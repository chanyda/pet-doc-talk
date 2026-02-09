import { Module } from "@nestjs/common";
import { ConsultationConversationsService } from "./consultation-conversations.service";
import { ConsultationConversationsRepository } from "./consultation-conversations.repository";

@Module({
    providers: [ConsultationConversationsService, ConsultationConversationsRepository],
    exports: [ConsultationConversationsService],
})
export class ConsultationConversationsModule {}
