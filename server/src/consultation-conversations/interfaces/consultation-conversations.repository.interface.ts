import { IConsultationConversation } from "./consultation-conversations.interface";

export interface IConsultationConversationsRepository {
    create(consultationId: number, conversationId: string): Promise<IConsultationConversation>;
    findActiveByConsultationId(consultationId: number): Promise<IConsultationConversation | null>;
    findManyByConsultationId(consultationId: number): Promise<IConsultationConversation[]>;
    incrementTokens(conversationId: number, inputTokens: number, outputTokens: number): Promise<void>;
    deactivate(id: number): Promise<void>;
}
