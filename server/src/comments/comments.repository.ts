import { Injectable } from "@nestjs/common";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { TransactionHost } from "@nestjs-cls/transactional";
import { PrismaService } from "src/prisma/prisma.service";
import { ICommentsRepository } from "./interfaces/comments.repository.interface";
import { CreateCommentDto } from "./dtos/requests/create-comment.dto";
import { UpdateCommentDto } from "./dtos/requests/update-comment.dto";
import { IComment } from "./interfaces/comments.interface";
import { CommentFindManyArgs, CommentSelect } from "generated/prisma/models";
import { CommentGetPayload, SelectSubset } from "generated/prisma/internal/prismaNamespace";

@Injectable()
export class CommentsRepository implements ICommentsRepository {
    constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma<PrismaService>>) {}

    async findMany<T extends CommentFindManyArgs>(
        params: SelectSubset<T, CommentFindManyArgs>,
    ): Promise<CommentGetPayload<T>[]> {
        return this.txHost.tx.comment.findMany(params);
    }

    async findById(commentId: number, select?: CommentSelect): Promise<IComment | null> {
        return this.txHost.tx.comment.findUnique({
            where: { id: commentId },
            select,
        });
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
}
