import { CommentSelect } from "generated/prisma/models";
import { CreateCommentDto } from "../dtos/requests/create-comment.dto";
import { IComment } from "./comments.interface";

export interface ICommentsRepository {
    create(
        userId: number,
        postId: number,
        createCommentDto: CreateCommentDto,
        select?: CommentSelect,
    ): Promise<IComment>;
    findById(commentId: number, select?: CommentSelect): Promise<IComment | null>;
}
