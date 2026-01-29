import { Injectable } from "@nestjs/common";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { TransactionHost } from "@nestjs-cls/transactional";
import { PrismaService } from "src/prisma/prisma.service";
import { FindManyAndCountResult, ICommentsRepository } from "./interfaces/comments.repository.interface";
import { UpdateCommentDto } from "./dtos/requests/update-comment.dto";
import { IComment } from "./interfaces/comments.interface";
import { CommentFindManyArgs, CommentSelect } from "generated/prisma/models";
import { CommentGetPayload, CommentWhereInput, SelectSubset } from "generated/prisma/internal/prismaNamespace";
import { CreateCommentDto } from "./dtos/requests/create-comment.dto";

@Injectable()
export class CommentsRepository implements ICommentsRepository {
    constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma<PrismaService>>) {}

    async findMany<T extends CommentFindManyArgs>(
        params: SelectSubset<T, CommentFindManyArgs>,
    ): Promise<CommentGetPayload<T>[]> {
        return this.txHost.tx.comment.findMany(params);
    }

    async findManyAndCount<T extends CommentFindManyArgs>(
        params: SelectSubset<T, CommentFindManyArgs>,
    ): Promise<FindManyAndCountResult<T>> {
        return this.txHost.withTransaction(async () => {
            const comments = await this.findMany(params);
            const totalCount = await this.count(params.where);

            return { comments, totalCount };
        });
    }

    async findById(commentId: number, select?: CommentSelect): Promise<IComment | null> {
        return this.txHost.tx.comment.findUnique({
            where: { id: commentId },
            select,
        });
    }

    async count(whereInput?: CommentWhereInput): Promise<number> {
        return this.txHost.tx.comment.count({ where: whereInput });
    }

    async create(
        postId: number,
        userId: number,
        createCommentDto: CreateCommentDto,
        select?: CommentSelect,
    ): Promise<IComment> {
        return this.txHost.tx.comment.create({
            data: {
                userId,
                postId,
                content: createCommentDto.content,
                parentId: createCommentDto.parentId ?? null,
                mentionUserId: createCommentDto.mentionUserId ?? null,
            },
            select,
        });
    }

    async update(commentId: number, updateCommentDto: UpdateCommentDto, select?: CommentSelect): Promise<IComment> {
        return this.txHost.tx.comment.update({
            where: { id: commentId },
            data: updateCommentDto,
            select,
        });
    }

    // NOTE: Soft delete를 구현하기 위해 Prisma Client Extensions의 $extends를 사용하려고 시도했으나,
    // any 타입에 대한 타입 오류 처리 등에 대한 해결책을 찾지 못해 현재는 repository에서 update로 처리함.
    // 향후 Prisma 버전 업데이트나 타입 개선 시 Client Extensions로 변경 필요
    // https://www.prisma.io/docs/orm/prisma-client/client-extensions/model#example-1
    // https://medium.com/@erciliomarquesmanhica/implementing-soft-delete-in-prisma-using-client-extensions-a-step-by-step-guide-for-nestjs-51a9d0716831

    async delete(commentId: number): Promise<{ id: number }> {
        return this.txHost.tx.comment.update({
            where: { id: commentId },
            data: { deletedAt: new Date() },
            select: { id: true },
        });
    }
}
