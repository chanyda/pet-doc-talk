import { MessageRole } from "generated/prisma/enums";

export interface IConsultationMessage {
    id: number;
    consultationId: number;
    role: MessageRole;
    content: string;
    inputToken: number;
    outputToken: number;
    createdAt: Date;
    updatedAt: Date;
}
