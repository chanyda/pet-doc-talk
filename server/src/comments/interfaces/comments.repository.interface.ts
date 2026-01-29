import { CommentFindManyArgs, CommentSelect } from "generated/prisma/models";
import { CreateCommentDto } from "../dtos/requests/create-comment.dto";
import { UpdateCommentDto } from "../dtos/requests/update-comment.dto";
import { IComment } from "./comments.interface";
import { CommentGetPayload, CommentWhereInput, SelectSubset } from "generated/prisma/internal/prismaNamespace";

export type FindManyAndCountResult<T extends CommentFindManyArgs> = {
    comments: CommentGetPayload<T>[];
    totalCount: number;
};

export interface ICommentsRepository {
    findMany<T extends CommentFindManyArgs>(
        params: SelectSubset<T, CommentFindManyArgs>,
    ): Promise<CommentGetPayload<T>[]>;
    findManyAndCount<T extends CommentFindManyArgs>(
        params: SelectSubset<T, CommentFindManyArgs>,
    ): Promise<FindManyAndCountResult<T>>;
    findById(commentId: number, select?: CommentSelect): Promise<IComment | null>;
    count(whereInput: CommentWhereInput): Promise<number>;
    create(
        postId: number,
        userId: number,
        createCommentDto: CreateCommentDto,
        select?: CommentSelect,
    ): Promise<IComment>;
    update(commentId: number, updateCommentDto: UpdateCommentDto, select?: CommentSelect): Promise<IComment>;
    delete(commentId: number): Promise<{ id: number }>;
}
