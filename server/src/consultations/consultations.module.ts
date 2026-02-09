import { Module, forwardRef } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { ConsultationsController } from "./consultations.controller";
import { ConsultationsService } from "./consultations.service";
import { ConsultationsRepository } from "./consultations.repository";
import { PetsModule } from "src/pets/pets.module";
import { ConsultationMessagesModule } from "src/consultation-messages/consultation-messages.module";

@Module({
    imports: [PrismaModule, PetsModule, forwardRef(() => ConsultationMessagesModule)],
    controllers: [ConsultationsController],
    providers: [ConsultationsService, ConsultationsRepository],
    exports: [ConsultationsService],
})
export class ConsultationsModule {}
