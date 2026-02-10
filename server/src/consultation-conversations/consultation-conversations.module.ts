import { Module } from "@nestjs/common";
import { ConsultationConversationsService } from "./consultation-conversations.service";
import { ConsultationConversationsRepository } from "./consultation-conversations.repository";
import { OpenAIModule } from "src/openai/openai.module";

@Module({
    imports: [OpenAIModule],
    providers: [ConsultationConversationsService, ConsultationConversationsRepository],
    exports: [ConsultationConversationsService],
})
export class ConsultationConversationsModule {}
