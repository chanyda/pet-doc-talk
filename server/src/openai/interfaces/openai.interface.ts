import { MessageRole } from "generated/prisma/enums";
import { IMessageContext } from "src/consultation-messages/interfaces/consultation-messages.repository.interface";

export interface IStreamChunk {
    type: "delta" | "completed";
    role: MessageRole;
    content: string;
    usage: IUsage | null;
}

export interface IUsage {
    inputToken: number;
    outputToken: number;
}

export interface IStreamResponseParams {
    conversationId: string;
    input: string | Array<IMessageContext>;
    instruction: string;
    signal: AbortSignal;
}
