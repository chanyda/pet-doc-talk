import { Module } from "@nestjs/common";
import { ConsultationMessagesService } from "./consultation-messages.service";
import { ConsultationMessagesRepository } from "./consultation-messages.repository";

@Module({
    providers: [ConsultationMessagesService, ConsultationMessagesRepository],
    exports: [ConsultationMessagesService],
})
export class ConsultationMessagesModule {}
