import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import { ConfigType } from "src/types/config.type";
import { IStreamChunk, IStreamResponseParams } from "./interfaces/openai.interface";
import { ResponseUsage } from "openai/resources/responses/responses";
import { CONSULTATION_JSON_SCHEMA, CONSULTATION_PROMPT } from "./constants";

@Injectable()
export class OpenAIService {
    private readonly openai: OpenAI;

    constructor(private readonly configService: ConfigService<ConfigType, true>) {
        const apiKey = this.configService.get("openai.apiKey", { infer: true });
        this.openai = new OpenAI({ apiKey });
    }

    /**
     * Creates a new conversation using OpenAI Conversations API
     * @returns The conversation ID
     */
    async createConversation(): Promise<string> {
        const conversation = await this.openai.conversations.create();
        return conversation.id;
    }

    /**
     * Streams a response from OpenAI Responses API
     * @param params - Conversation ID, user input, and pet context
     * @yields Stream chunks with content and usage information
     */
    async *streamResponse(params: IStreamResponseParams): AsyncGenerator<IStreamChunk> {
        const stream = await this.openai.responses.create({
            model: "gpt-5-mini-2025-08-07", // TODO: env로 빼기
            conversation: params.conversationId,
            input: params.input,
            instructions: `${params.petContext}\n\n${CONSULTATION_PROMPT}`,
            text: {
                format: {
                    name: CONSULTATION_JSON_SCHEMA.name,
                    type: "json_schema",
                    schema: CONSULTATION_JSON_SCHEMA.schema,
                },
            },
            stream: true,
        });

        let fullContent = "";
        let usage: ResponseUsage | null = null;

        for await (const event of stream) {
            if (event.type === "response.output_text.delta") {
                fullContent += event.delta;
                yield { role: "ASSISTANT", content: event.delta, usage: null };
            }

            if (event.type === "response.completed") {
                usage = event.response.usage ?? null;
                yield {
                    role: "ASSISTANT",
                    content: fullContent,
                    usage: {
                        inputTokens: usage?.input_tokens ?? 0,
                        outputTokens: usage?.output_tokens ?? 0,
                    },
                };
            }
        }
    }
}
