import { Injectable } from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";
import { ConsultationMessagesRepository } from "./consultation-messages.repository";
import { IConsultationMessage } from "./interfaces/consultation-messages.interface";
import { ICreateMessageData } from "./interfaces/consultation-messages.repository.interface";
import { MessageListResponseDto } from "./dtos/responses/message-list-response.dto";
import { PaginationQueryDto } from "src/common/dtos/requests/pagination-query.dto";
import { getNextCursor } from "src/common/utils/pagination.util";
import { MESSAGE_SELECT } from "./constants";

@Injectable()
export class ConsultationMessagesService {
    constructor(private readonly consultationMessagesRepository: ConsultationMessagesRepository) {}

    @Transactional()
    async create(consultationId: number, data: ICreateMessageData): Promise<IConsultationMessage> {
        return this.consultationMessagesRepository.create(consultationId, data);
    }

    async findMany(consultationId: number, query: PaginationQueryDto): Promise<MessageListResponseDto> {
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
}
