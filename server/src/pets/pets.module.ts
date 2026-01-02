import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { PetsController } from "./pets.controller";
import { PetsService } from "./pets.service";
import { PetsRepository } from "./pets.repository";
import { UsersModule } from "src/users/users.module";

@Module({
    imports: [PrismaModule, UsersModule],
    controllers: [PetsController],
    providers: [PetsService, PetsRepository],
    exports: [PetsService],
})
export class PetsModule {}
