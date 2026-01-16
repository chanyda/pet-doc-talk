import { Injectable } from "@nestjs/common";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { TransactionHost } from "@nestjs-cls/transactional";
import { PrismaService } from "src/prisma/prisma.service";
import { ICommentsRepository } from "./interfaces/comments.repository.interface";
import { CreateCommentDto } from "./dtos/requests/create-comment.dto";
import { IComment } from "./interfaces/comments.interface";
import { CommentSelect } from "generated/prisma/models";

@Injectable()
export class CommentsRepository implements ICommentsRepository {
    constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma<PrismaService>>) {}

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

    async findById(commentId: number, select?: CommentSelect): Promise<IComment | null> {
        return this.txHost.tx.comment.findUnique({
            where: { id: commentId },
            select,
        });
    }
}
