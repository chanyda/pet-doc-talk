import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.service";
import { CommentsRepository } from "./comments.repository";
import { UsersModule } from "src/users/users.module";
import { PostsModule } from "src/posts/posts.module";

@Module({
    imports: [PrismaModule, UsersModule, PostsModule],
    controllers: [CommentsController],
    providers: [CommentsService, CommentsRepository],
})
export class CommentsModule {}
