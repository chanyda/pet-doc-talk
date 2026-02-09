export interface IConsultationConversation {
    id: number;
    consultationId: number;
    conversationId: string;
    totalInputToken: number;
    totalOutputToken: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
