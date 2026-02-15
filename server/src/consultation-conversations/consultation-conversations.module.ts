import { Module } from "@nestjs/common";

import { OpenAIModule } from "@/openai/openai.module";

import { ConsultationConversationsRepository } from "./consultation-conversations.repository";
import { ConsultationConversationsService } from "./consultation-conversations.service";

@Module({
    imports: [OpenAIModule],
    providers: [ConsultationConversationsService, ConsultationConversationsRepository],
    exports: [ConsultationConversationsService],
})
export class ConsultationConversationsModule {}
