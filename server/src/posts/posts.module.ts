import { Module } from "@nestjs/common";

import { CategoriesModule } from "@/categories/categories.module";
import { PrismaModule } from "@/prisma/prisma.module";
import { UsersModule } from "@/users/users.module";

import { PostsController } from "./posts.controller";
import { PostsRepository } from "./posts.repository";
import { PostsService } from "./posts.service";

@Module({
    imports: [PrismaModule, UsersModule, CategoriesModule],
    controllers: [PostsController],
    providers: [PostsService, PostsRepository],
    exports: [PostsService],
})
export class PostsModule {}
