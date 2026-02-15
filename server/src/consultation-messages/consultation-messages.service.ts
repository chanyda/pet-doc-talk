import { Injectable, ForbiddenException, NotFoundException, forwardRef, Inject } from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";
import { Observable, Subscriber } from "rxjs";
import { MessageEvent } from "@nestjs/common";
import { Response } from "express";
import { OpenAIError } from "openai";
import { ConsultationMessagesRepository } from "./consultation-messages.repository";
import { IConsultationMessage } from "./interfaces/consultation-messages.interface";
import { ICreateMessageData, IMessageContext } from "./interfaces/consultation-messages.repository.interface";
import { MessageListResponseDto } from "./dtos/responses/message-list-response.dto";
import { MessageDto } from "./dtos/responses/message.dto";
import { SendMessageDto } from "./dtos/requests/send-message.dto";
import { PaginationQueryDto } from "src/common/dtos/requests/pagination-query.dto";
import { getNextCursor } from "src/common/utils/pagination.util";
import { MESSAGE_SELECT } from "./constants";
import { ConsultationsService } from "src/consultations/consultations.service";
import { ConsultationConversationsService } from "src/consultation-conversations/consultation-conversations.service";
import { IConsultationConversation } from "src/consultation-conversations/interfaces/consultation-conversations.interface";
import { OpenAIService } from "src/openai/openai.service";
import { PetsService } from "src/pets/pets.service";
import { PointsService } from "src/points/points.service";
import { MessageRole, PointSource } from "generated/prisma/enums";
import {
    CONSULTATION_JSON_SCHEMA,
    getConsultationPrompt,
    RECENT_MESSAGE_COUNT,
    TOKEN_INPUT_LIMIT,
} from "src/openai/constants";
import { jsonrepair, JSONRepairError } from "jsonrepair";

@Injectable()
export class ConsultationMessagesService {
    constructor(
        private readonly consultationMessagesRepository: ConsultationMessagesRepository,
        @Inject(forwardRef(() => ConsultationsService))
        private readonly consultationsService: ConsultationsService,
        private readonly conversationsService: ConsultationConversationsService,
        private readonly openaiService: OpenAIService,
        private readonly petsService: PetsService,
        private readonly pointsService: PointsService,
    ) {}

    async findMany(userId: number, consultationId: number, query: PaginationQueryDto): Promise<MessageListResponseDto> {
        const consultation = await this.consultationsService.findById(consultationId);

        if (!consultation) {
            throw new NotFoundException("Consultation not exists.");
        }

        if (consultation.userId !== userId) {
            throw new ForbiddenException("Access denied to this consultation.");
        }

        const { messages, totalCount } = await this.consultationMessagesRepository.findManyAndCount({
            take: query.limit,
            skip: query.cursor ? 1 : undefined,
            cursor: query.cursor ? { id: query.cursor } : undefined,
            where: { consultationId },
            select: MESSAGE_SELECT,
            orderBy: { createdAt: "desc" },
        });

        const nextCursor = getNextCursor(messages, query.limit);

        return {
            messages,
            totalMessageCount: totalCount,
            nextCursor,
        };
    }

    async create(consultationId: number, data: ICreateMessageData): Promise<IConsultationMessage> {
        return this.consultationMessagesRepository.create(consultationId, data);
    }

    @Transactional()
    async sendMessageStream(
        userId: number,
        consultationId: number,
        sendMessageDto: SendMessageDto,
        res: Response,
    ): Promise<Observable<MessageEvent>> {
        // consultation 조회 및 권한을 확인한다.
        const consultation = await this.consultationsService.findById(consultationId);
        if (!consultation) {
            throw new NotFoundException("Consultation not exists.");
        }
        if (consultation.userId !== userId) {
            throw new ForbiddenException("Access denied to this consultation.");
        }

        const point = await this.pointsService.findMyPoints(userId);
        if (point.amount < 1) {
            throw new ForbiddenException("You do not have enough consultation points.");
        }

        await this.pointsService.applyPoint(userId, PointSource.CONSULTATION);

        // 상담하려는 반려동물의 정보를 AI 수의사에게 넘겨줘야하기 때문에 Pet을 조회한다.
        const pet = await this.petsService.findById(consultation.petId, userId);
        const instruction = getConsultationPrompt(pet);

        const { currentConversation, input } = await this.prepareConversationInput(
            consultation.id,
            sendMessageDto.content,
            instruction,
        );

        const abortController = new AbortController();

        res.on("close", () => {
            console.log("Client Abort.");
            abortController.abort();
        });

        return new Observable((subscriber: Subscriber<MessageEvent>) => {
            this.processStreamingMessage(
                consultationId,
                currentConversation,
                sendMessageDto.content,
                input,
                instruction,
                subscriber,
                abortController.signal,
            )
                .then(() => subscriber.complete())
                .catch(async (error) => {
                    console.error(error);

                    if (error instanceof OpenAIError) {
                        try {
                            // OpenAI 스트리밍 실패 시 포인트 환불
                            await this.pointsService.refundPoint(userId);
                            console.log("Refund point.");
                            subscriber.error(error);
                        } catch (err) {
                            console.error("Failed to refund point.", err);
                        }
                    }
                });

            return () => abortController.abort();
        });
    }

    private async processStreamingMessage(
        consultationId: number,
        conversation: IConsultationConversation,
        userMessage: string,
        input: string | Array<IMessageContext>,
        instruction: string,
        subscriber: Subscriber<MessageEvent>,
        signal: AbortSignal,
    ): Promise<void> {
        let aiAnswerRaw = "";
        let aiAnswerRepair = "";
        let inputToken = 0;
        let outputToken = 0;

        try {
            const stream = this.openaiService.streamResponse({
                conversationId: conversation.conversationId,
                input,
                instruction,
                signal,
            });

            for await (const chunk of stream) {
                try {
                    if (chunk.type === "delta") {
                        aiAnswerRaw += chunk.content;
                        aiAnswerRepair = jsonrepair(aiAnswerRaw);

                        subscriber.next({
                            data: {
                                type: "delta",
                                message: { role: MessageRole.assistant, content: aiAnswerRepair },
                            },
                        });
                    } else if (chunk.type === "completed") {
                        // completed인 경우, 완전한 json형태이기 때문에 별도의 jsonrepair처리는 하지 않음
                        aiAnswerRepair = chunk.content;

                        inputToken = chunk.usage?.inputToken || 0;
                        outputToken = chunk.usage?.outputToken || 0;
                    }
                } catch (err) {
                    if (err instanceof JSONRepairError) {
                        console.error(err);
                    }
                }
            }
        } catch (error) {
            console.error(error);
            subscriber.next({
                data: {
                    type: "error",
                    message: "AI 서비스에 일시적인 문제가 발생했습니다.",
                },
            });
            throw error;
        }

        const { answerMessage } = await this.saveMessagesWithTokens(
            consultationId,
            conversation.id,
            userMessage,
            aiAnswerRepair,
            inputToken,
            outputToken,
        );

        const answerMessageDto: MessageDto = {
            id: answerMessage.id,
            consultationId: answerMessage.consultationId,
            role: answerMessage.role,
            content: answerMessage.content,
            createdAt: answerMessage.createdAt,
        };

        subscriber.next({
            data: { type: "done", message: answerMessageDto },
        });
    }

    @Transactional()
    private async saveMessagesWithTokens(
        consultationId: number,
        conversationId: number,
        userMessage: string,
        aiMessage: string,
        inputToken: number,
        outputToken: number,
    ): Promise<{ questionMessage: IConsultationMessage; answerMessage: IConsultationMessage }> {
        // 사용자의 질문 저장
        const questionMessage = await this.create(consultationId, {
            role: MessageRole.user,
            content: userMessage,
            inputToken,
            outputToken: 0,
        });

        // AI 답변 저장
        const answerMessage = await this.create(consultationId, {
            role: MessageRole.assistant,
            content: aiMessage,
            inputToken: 0,
            outputToken,
        });

        await this.conversationsService.incrementTokens(conversationId, inputToken, outputToken);

        return { questionMessage, answerMessage };
    }

    @Transactional()
    private async prepareConversationInput(
        consultationId: number,
        content: string,
        instruction: string,
    ): Promise<{ currentConversation: IConsultationConversation; input: string | Array<IMessageContext> }> {
        // 해당 상담 채팅방에 대한 active된 openai conversation이 존재하는지 체크한다.
        let currentConversation = await this.conversationsService.findActiveByConsultationId(consultationId);
        // 만일 active된 openai conversation이 존재하지 않다면, 생성해주고 db에 저장한다.
        if (!currentConversation) {
            currentConversation = await this.conversationsService.create(consultationId);
        }

        // Token 관리 전략:
        // - GPT-5-nano의 context window: 400,000 tokens
        // - Conversation API 사용 시 이전 대화가 자동으로 context에 포함됨
        // - 누적된 대화가 많아질수록 매 요청마다 input token 소비가 증가
        // Token 최적화 로직:
        // - 현재 메시지의 token 수를 계산하여 누적 token과 합산
        // - 총 input token이 80,000을 초과하면 conversation을 rotation
        // - Rotation 시 필요한 대화 내역만 수동으로 포함하여 token 사용량 절감
        // NOTE: 이는 초기 비용 최적화를 위한 임시 방편입니다.
        //       서비스 규모가 커지면 token 비용보다 대화 품질(전체 context 유지)이
        //       더 중요해지므로 이 로직은 제거될 수 있습니다.
        const userMessage: IMessageContext = { role: "user", content };

        const currentMessageTokens = this.openaiService.countMessagesTokens(
            [{ role: "system", content: instruction }, userMessage],
            JSON.stringify(CONSULTATION_JSON_SCHEMA.schema),
        );
        const totalInputTokens = currentConversation.totalInputToken + currentMessageTokens;

        let input: string | Array<IMessageContext> = content;

        // 현재 보내려는 메세지 + 누적 input token가 TOKEN_INPUT_LIMIT를 초과하는 경우,
        // conversation을 새로 만들어주고 매뉴얼로 이전 대화 내용을 포함시켜서 질문을 보내주도록 한다.
        if (totalInputTokens > TOKEN_INPUT_LIMIT) {
            // TODO: 개인정보 보호를 위해 OpenAI conversation 지연 삭제 구현 필요
            // - 비활성화된 지 N일 경과한 conversation을 찾아서 삭제하는 배치 작업
            // - 또는 즉시 삭제: await this.openaiService.deleteConversation(currentConversation.conversationId);
            await this.conversationsService.deactivate(currentConversation.id);
            const newConversation = await this.conversationsService.create(consultationId);

            const history = await this.rotateConversationWithHistory(consultationId, userMessage);

            input = history;
            currentConversation = newConversation;
        }

        return { currentConversation, input };
    }

    private async rotateConversationWithHistory(
        consultationId: number,
        userMessage: IMessageContext,
    ): Promise<Array<IMessageContext>> {
        // 이전 메세지를 RECENT_MESSAGE_COUNT만큼 조회한다.
        const recentMessages: Array<IMessageContext> = await this.consultationMessagesRepository.findRecentForContext(
            consultationId,
            RECENT_MESSAGE_COUNT,
        );

        // 대화 순서에 맞게 reverse 시켜준다.
        const history = recentMessages.reverse();

        // 현재 사용자가 보낸 메세지를 추가해준다.
        history.push(userMessage);

        let historyTokens = this.openaiService.countMessagesTokens(history, JSON.stringify(CONSULTATION_JSON_SCHEMA));

        // 기존 메세지 + 현재 메세지에 대한 input 토큰 수가 최대 input token수를 넘은 경우 가장 오래된 메세지부터 제거해준다.
        // 단 메세지 히스토리는 알고 있어야하므로 최대 2개의 message는 가지고 있도록 해준다.
        while (historyTokens > TOKEN_INPUT_LIMIT && history.length > 2) {
            try {
                history.shift();

                historyTokens = this.openaiService.countMessagesTokens(
                    history,
                    JSON.stringify(CONSULTATION_JSON_SCHEMA),
                );
            } catch (err) {
                console.error(err);
            }
        }

        return history;
    }
}
