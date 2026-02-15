import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";

import { MessageRole } from "generated/prisma/enums";

import { PaginationQueryDto } from "@/common/dtos/requests/pagination-query.dto";
import { getNextCursor } from "@/common/utils/pagination.util";
import { ConsultationMessagesService } from "@/consultation-messages/consultation-messages.service";
import { PetsService } from "@/pets/pets.service";

import { CONSULTATION_SELECT } from "./constants";
import { ConsultationsRepository } from "./consultations.repository";
import { CreateConsultationDto } from "./dtos/requests/create-consultation.dto";
import { ConsultationDto } from "./dtos/responses/consultation.dto";
import { MyConsultationListResponseDto } from "./dtos/responses/my-consultation-list-response.dto";
import { IConsultation } from "./interfaces/consultations.interface";

@Injectable()
export class ConsultationsService {
    constructor(
        private readonly consultationsRepository: ConsultationsRepository,
        private readonly petsService: PetsService,
        @Inject(forwardRef(() => ConsultationMessagesService))
        private readonly messagesService: ConsultationMessagesService,
    ) {}

    async findMyConsultations(userId: number, query: PaginationQueryDto): Promise<MyConsultationListResponseDto> {
        const { consultations, totalCount } = await this.consultationsRepository.findManyAndCount({
            take: query.limit,
            skip: query.cursor ? 1 : undefined,
            cursor: query.cursor ? { id: query.cursor } : undefined,
            where: { userId },
            orderBy: { createdAt: "desc" },
            select: CONSULTATION_SELECT,
        });

        const nextCursor = getNextCursor(consultations, query.limit);

        return {
            consultations,
            totalConsultationCount: totalCount,
            nextCursor,
        };
    }

    async findById(consultationId: number): Promise<IConsultation | null> {
        return this.consultationsRepository.findById(consultationId);
    }

    @Transactional()
    async create(userId: number, createConsultationDto: CreateConsultationDto): Promise<ConsultationDto> {
        // findById 함수에서 사용자의 펫이 아닌 경우, 오류를 뱉으므로 해당 레벨에서는 별도로 오류 처리를 하지 않음
        const pet = await this.petsService.findById(createConsultationDto.petId, userId);

        const consultation = await this.consultationsRepository.create(userId, createConsultationDto);

        const welcomeMessage = `안녕하세요, AI 수의사입니다!\n\n${pet.name}(이)에 대해 궁금하신 점이나 걱정되는 증상이 있으시면 편하게 물어보세요. 최선을 다해 도와드리겠습니다.`;
        await this.messagesService.create(consultation.id, {
            role: MessageRole.assistant,
            content: welcomeMessage,
            inputToken: 0,
            outputToken: 0,
        });

        return consultation;
    }
}
