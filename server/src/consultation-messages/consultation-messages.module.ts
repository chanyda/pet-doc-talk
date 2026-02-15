import { forwardRef, Module } from "@nestjs/common";

import { ConsultationConversationsModule } from "@/consultation-conversations/consultation-conversations.module";
import { ConsultationsModule } from "@/consultations/consultations.module";
import { PetsModule } from "@/pets/pets.module";
import { PointsModule } from "@/points/points.module";

import { ConsultationMessagesController } from "./consultation-messages.controller";
import { ConsultationMessagesRepository } from "./consultation-messages.repository";
import { ConsultationMessagesService } from "./consultation-messages.service";

@Module({
    imports: [forwardRef(() => ConsultationsModule), ConsultationConversationsModule, PetsModule, PointsModule],
    controllers: [ConsultationMessagesController],
    providers: [ConsultationMessagesService, ConsultationMessagesRepository],
    exports: [ConsultationMessagesService],
})
export class ConsultationMessagesModule {}
