import { Module } from "@nestjs/common";

import { PrismaModule } from "@/prisma/prisma.module";
import { UsersModule } from "@/users/users.module";

import { PetsController } from "./pets.controller";
import { PetsRepository } from "./pets.repository";
import { PetsService } from "./pets.service";

@Module({
    imports: [PrismaModule, UsersModule],
    controllers: [PetsController],
    providers: [PetsService, PetsRepository],
    exports: [PetsService],
})
export class PetsModule {}
