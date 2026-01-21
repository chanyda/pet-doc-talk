import { Injectable } from "@nestjs/common";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { TransactionHost } from "@nestjs-cls/transactional";
import { PrismaService } from "src/prisma/prisma.service";
import { FindManyAndCountResult, IPostsRepository } from "./interfaces/posts.repository.interface";
import { CreatePostDto } from "./dtos/requests/create-post.dto";
import { UpdatePostDto } from "./dtos/requests/update-post.dto";
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

    async findManyAndCount<T extends PostFindManyArgs>(
        params: SelectSubset<T, PostFindManyArgs>,
    ): Promise<FindManyAndCountResult<T>> {
        return this.txHost.withTransaction(async () => {
            const posts = await this.findMany(params);
            const totalCount = await this.txHost.tx.post.count({ where: params.where });

            return { posts, totalCount };
        });
    }

    // 다른 함수와 달리 select를 필수로 받는 이유:
    // select가 옵셔널이면 Prisma가 Post의 모든 필드를 반환하는 기본 타입으로 추론됨 (user, category 제외)
    // select를 필수로 받으면 Prisma가 select에 지정된 필드만 포함한 타입으로 정확히 추론함 (user, category 포함)
    // findById는 user, category 등 관계 데이터를 포함한 타입을 반환해야 하므로 select를 필수로 받음
    async findById<T extends PostSelect>(postId: number, select: T): Promise<PostGetPayload<{ select: T }> | null> {
        return this.txHost.tx.post.findUnique({
            where: { id: postId },
            select,
        });
    }

    async create(userId: number, createPostDto: CreatePostDto, select?: PostSelect): Promise<IPost> {
        return this.txHost.tx.post.create({
            data: { userId, ...createPostDto },
            select,
        });
    }

    async update(postId: number, updatePostDto: UpdatePostDto, select?: PostSelect): Promise<IPost> {
        return this.txHost.tx.post.update({
            where: { id: postId },
            data: updatePostDto,
            select,
        });
    }

    async updateViewCount(postId: number, select?: PostSelect): Promise<IPost> {
        return this.txHost.tx.post.update({
            where: { id: postId },
            data: { viewCount: { increment: 1 } },
            select,
        });
    }

    async delete(postId: number): Promise<IPost> {
        return this.txHost.tx.post.delete({
            where: { id: postId },
        });
    }
}
