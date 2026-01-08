import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { CategoriesService } from "./categories.service";
import { CategoriesRepository } from "./categories.repository";

@Module({
    imports: [PrismaModule],
    providers: [CategoriesService, CategoriesRepository],
    exports: [CategoriesService],
})
export class CategoriesModule {}
