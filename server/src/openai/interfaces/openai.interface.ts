import { MessageRole } from "generated/prisma/enums";

export interface IStreamChunk {
    role: MessageRole;
    content: string;
    usage: IUsage | null;
}

export interface IUsage {
    inputTokens: number;
    outputTokens: number;
}

export interface IStreamResponseParams {
    conversationId: string;
    input: string;
    petContext: string;
}
