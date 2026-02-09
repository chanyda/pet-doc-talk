import { Injectable } from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";
import { ConsultationConversationsRepository } from "./consultation-conversations.repository";
import { IConsultationConversation } from "./interfaces/consultation-conversations.interface";

@Injectable()
export class ConsultationConversationsService {
    constructor(private readonly consultationConversationsRepository: ConsultationConversationsRepository) {}

    @Transactional()
    async create(consultationId: number, conversationId: string): Promise<IConsultationConversation> {
        return this.consultationConversationsRepository.create(consultationId, conversationId);
    }

    async findActiveByConsultationId(consultationId: number): Promise<IConsultationConversation | null> {
        return this.consultationConversationsRepository.findActiveByConsultationId(consultationId);
    }

    @Transactional()
    async incrementTokens(conversationId: number, inputTokens: number, outputTokens: number): Promise<void> {
        return this.consultationConversationsRepository.incrementTokens(conversationId, inputTokens, outputTokens);
    }
}
