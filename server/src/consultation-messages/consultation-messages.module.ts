import { Module, forwardRef } from "@nestjs/common";
import { ConsultationMessagesController } from "./consultation-messages.controller";
import { ConsultationMessagesService } from "./consultation-messages.service";
import { ConsultationMessagesRepository } from "./consultation-messages.repository";
import { ConsultationsModule } from "src/consultations/consultations.module";
import { ConsultationConversationsModule } from "src/consultation-conversations/consultation-conversations.module";
import { PetsModule } from "src/pets/pets.module";
import { PointsModule } from "src/points/points.module";

@Module({
    imports: [forwardRef(() => ConsultationsModule), ConsultationConversationsModule, PetsModule, PointsModule],
    controllers: [ConsultationMessagesController],
    providers: [ConsultationMessagesService, ConsultationMessagesRepository],
    exports: [ConsultationMessagesService],
})
export class ConsultationMessagesModule {}
