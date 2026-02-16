import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import { ConversationDeletedResource } from "openai/resources/conversations/conversations";
import { EasyInputMessage, ResponseUsage } from "openai/resources/responses/responses";
import { ResponsesModel } from "openai/resources/shared";
import { get_encoding, Tiktoken } from "tiktoken";

import { ConfigType } from "@/types/config.type";

import { CONSULTATION_JSON_SCHEMA } from "./constants";
import { IStreamChunk, IStreamResponseParams } from "./interfaces/openai.interface";

@Injectable()
export class OpenAIService {
    private readonly openai: OpenAI;
    private readonly model: ResponsesModel;
    private readonly tiktoken: Tiktoken;

    constructor(private readonly configService: ConfigService<ConfigType, true>) {
        const apiKey = this.configService.get("openai.apiKey", { infer: true });
        const model = this.configService.get("openai.model", { infer: true });

        this.openai = new OpenAI({ apiKey });
        this.model = model;
        // GPT-5-nano uses o200k_base encoding
        this.tiktoken = get_encoding("o200k_base");
    }

    async createConversation(): Promise<string> {
        const conversation = await this.openai.conversations.create();
        return conversation.id;
    }

    countMessagesTokens(messages: Array<EasyInputMessage>, serializedSchema: string): number {
        let totalTokens = 0;

        for (const message of messages) {
            totalTokens += 3; // Message overhead
            totalTokens += this.tiktoken.encode(message.role).length;
            totalTokens += this.tiktoken.encode(message.content as string).length;
        }

        totalTokens += this.tiktoken.encode(serializedSchema).length;

        return totalTokens;
    }

    /**
     * Streams a response from OpenAI Responses API
     * @param params - Conversation ID, user input, and pet context
     * @yields Stream chunks with content and usage information
     */
    async *streamResponse(params: IStreamResponseParams): AsyncGenerator<IStreamChunk> {
        const stream = await this.openai.responses.create(
            {
                model: this.model,
                conversation: params.conversationId,
                input: params.input,
                instructions: params.instruction,
                text: {
                    format: {
                        name: CONSULTATION_JSON_SCHEMA.name,
                        type: "json_schema",
                        schema: CONSULTATION_JSON_SCHEMA.schema,
                    },
                },
                stream: true,
                reasoning: { effort: "low" },
            },
            { signal: params.signal },
        );

        let fullContent = "";
        let usage: ResponseUsage | null = null;

        for await (const event of stream) {
            if (event.type === "response.output_text.delta") {
                fullContent += event.delta;
                yield { type: "delta", role: "assistant", content: event.delta, usage: null };
            }

            if (event.type === "response.completed") {
                usage = event.response.usage ?? null;
                yield {
                    type: "completed",
                    role: "assistant",
                    content: fullContent,
                    usage: {
                        inputToken: usage?.input_tokens ?? 0,
                        outputToken: usage?.output_tokens ?? 0,
                    },
                };
            }
        }
    }

    async deleteConversation(conversationId: string): Promise<ConversationDeletedResource> {
        return await this.openai.conversations.delete(conversationId);
    }
}
