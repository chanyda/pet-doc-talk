import { PostFindManyArgs, PostGetPayload, PostSelect } from "generated/prisma/models";
import { CreatePostDto } from "../dtos/requests/create-post.dto";
import { IPost } from "./posts.interface";
import { SelectSubset } from "generated/prisma/internal/prismaNamespace";

export interface IPostsRepository {
    findMany<T extends PostFindManyArgs>(params: SelectSubset<T, PostFindManyArgs>): Promise<PostGetPayload<T>[]>;
    findById<T extends PostSelect>(postId: number, select: T): Promise<PostGetPayload<{ select: T }> | null>;
    create(userId: number, createPostDto: CreatePostDto, select?: PostSelect): Promise<IPost>;
    updateViewCount(postId: number, select?: PostSelect): Promise<IPost>;
}
