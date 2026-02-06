import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { ConsultationsController } from "./consultations.controller";
import { ConsultationsService } from "./consultations.service";
import { ConsultationsRepository } from "./consultations.repository";
import { PetsModule } from "src/pets/pets.module";

@Module({
    imports: [PrismaModule, PetsModule],
    controllers: [ConsultationsController],
    providers: [ConsultationsService, ConsultationsRepository],
    exports: [ConsultationsService],
})
export class ConsultationsModule {}
