import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { PostsRepository } from "./posts.repository";
import { UsersModule } from "src/users/users.module";
import { CategoriesModule } from "src/categories/categories.module";

@Module({
    imports: [PrismaModule, UsersModule, CategoriesModule],
    controllers: [PostsController],
    providers: [PostsService, PostsRepository],
    exports: [PostsService],
})
export class PostsModule {}
