import { CommentFindManyArgs, CommentSelect } from "generated/prisma/models";
import { CreateCommentDto } from "../dtos/requests/create-comment.dto";
import { UpdateCommentDto } from "../dtos/requests/update-comment.dto";
import { IComment } from "./comments.interface";
import { CommentGetPayload, SelectSubset } from "generated/prisma/internal/prismaNamespace";

export interface ICommentsRepository {
    findMany<T extends CommentFindManyArgs>(
        params: SelectSubset<T, CommentFindManyArgs>,
    ): Promise<CommentGetPayload<T>[]>;
    findById(commentId: number, select?: CommentSelect): Promise<IComment | null>;
    create(
        postId: number,
        userId: number,
        createCommentDto: CreateCommentDto,
        select?: CommentSelect,
    ): Promise<IComment>;
    update(commentId: number, updateCommentDto: UpdateCommentDto, select?: CommentSelect): Promise<IComment>;
    delete(commentId: number): Promise<{ id: number }>;
}
