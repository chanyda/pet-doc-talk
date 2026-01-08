import { Injectable } from "@nestjs/common";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { TransactionHost } from "@nestjs-cls/transactional";
import { PrismaService } from "src/prisma/prisma.service";
import { IPostsRepository } from "./interfaces/posts.repository.interface";
import { CreatePostDto } from "./dtos/create-post.dto";
import { IPost } from "./interfaces/posts.interface";
import { PostSelect } from "generated/prisma/models";

@Injectable()
export class PostsRepository implements IPostsRepository {
    constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma<PrismaService>>) {}

    async create(userId: number, createPostDto: CreatePostDto, select?: PostSelect): Promise<IPost> {
        return this.txHost.tx.post.create({
            data: { userId, ...createPostDto },
            select,
        });
    }
}
