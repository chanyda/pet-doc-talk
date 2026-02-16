import { Injectable } from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";

import { OpenAIService } from "@/openai/openai.service";

import { ConsultationConversationsRepository } from "./consultation-conversations.repository";
import { IConsultationConversation } from "./interfaces/consultation-conversations.interface";

@Injectable()
export class ConsultationConversationsService {
    constructor(
        private readonly consultationConversationsRepository: ConsultationConversationsRepository,
        private readonly openaiService: OpenAIService,
    ) {}

    @Transactional()
    async create(consultationId: number): Promise<IConsultationConversation> {
        const conversationId = await this.openaiService.createConversation();
        return this.consultationConversationsRepository.create(consultationId, conversationId);
    }

    async findActiveByConsultationId(consultationId: number): Promise<IConsultationConversation | null> {
        return this.consultationConversationsRepository.findActiveByConsultationId(consultationId);
    }

    async findManyByConsultationId(consultationId: number): Promise<IConsultationConversation[]> {
        return this.consultationConversationsRepository.findManyByConsultationId(consultationId);
    }

    @Transactional()
    async incrementTokens(conversationId: number, inputToken: number, outputToken: number): Promise<void> {
        return this.consultationConversationsRepository.incrementTokens(conversationId, inputToken, outputToken);
    }

    @Transactional()
    async deactivate(id: number): Promise<void> {
        return this.consultationConversationsRepository.deactivate(id);
    }
}
