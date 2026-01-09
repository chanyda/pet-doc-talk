import { Injectable } from "@nestjs/common";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { TransactionHost } from "@nestjs-cls/transactional";
import { PrismaService } from "src/prisma/prisma.service";
import { IPostsRepository } from "./interfaces/posts.repository.interface";
import { CreatePostDto } from "./dtos/create-post.dto";
import { IPost } from "./interfaces/posts.interface";
import { PostFindManyArgs, PostGetPayload, PostSelect } from "generated/prisma/models";
import { SelectSubset } from "generated/prisma/internal/prismaNamespace";

@Injectable()
export class PostsRepository implements IPostsRepository {
    constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma<PrismaService>>) {}

    // Prisma의 select / include에 따라 반환 타입이 달라질 수 있으므로 다른 함수와 달리 고정된 커스텀 타입을 정의하지 않고,
    // 전달된 쿼리 파라미터(T)를 기반으로 PostGetPayload<T>를 통해 반환 타입을 동적으로 추론하도록 함
    async findMany<T extends PostFindManyArgs>(
        params: SelectSubset<T, PostFindManyArgs>,
    ): Promise<PostGetPayload<T>[]> {
        return this.txHost.tx.post.findMany(params);
    }

    async create(userId: number, createPostDto: CreatePostDto, select?: PostSelect): Promise<IPost> {
        return this.txHost.tx.post.create({
            data: { userId, ...createPostDto },
            select,
        });
    }
}
