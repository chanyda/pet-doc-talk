import { forwardRef, Module } from "@nestjs/common";

import { ConsultationConversationsModule } from "@/consultation-conversations/consultation-conversations.module";
import { ConsultationMessagesModule } from "@/consultation-messages/consultation-messages.module";
import { OpenAIModule } from "@/openai/openai.module";
import { PetsModule } from "@/pets/pets.module";
import { PrismaModule } from "@/prisma/prisma.module";

import { ConsultationsController } from "./consultations.controller";
import { ConsultationsRepository } from "./consultations.repository";
import { ConsultationsService } from "./consultations.service";

@Module({
    imports: [
        PrismaModule,
        PetsModule,
        forwardRef(() => ConsultationMessagesModule),
        ConsultationConversationsModule,
        OpenAIModule,
    ],
    controllers: [ConsultationsController],
    providers: [ConsultationsService, ConsultationsRepository],
    exports: [ConsultationsService],
})
export class ConsultationsModule {}
