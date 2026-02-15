import { SelectSubset } from "generated/prisma/internal/prismaNamespace";
import { PostFindManyArgs, PostGetPayload, PostSelect } from "generated/prisma/models";

import { CreatePostDto } from "../dtos/requests/create-post.dto";
import { UpdatePostDto } from "../dtos/requests/update-post.dto";
import { IPost } from "./posts.interface";

export type FindManyAndCountResult<T extends PostFindManyArgs> = {
    posts: PostGetPayload<T>[];
    totalCount: number;
};

export interface IPostsRepository {
    findMany<T extends PostFindManyArgs>(params: SelectSubset<T, PostFindManyArgs>): Promise<PostGetPayload<T>[]>;
    findManyAndCount<T extends PostFindManyArgs>(
        params: SelectSubset<T, PostFindManyArgs>,
    ): Promise<FindManyAndCountResult<T>>;
    findById<T extends PostSelect>(postId: number, select: T): Promise<PostGetPayload<{ select: T }> | null>;
    create(userId: number, createPostDto: CreatePostDto, select?: PostSelect): Promise<IPost>;
    update(postId: number, updatePostDto: UpdatePostDto, select?: PostSelect): Promise<IPost>;
    updateViewCount(postId: number, select?: PostSelect): Promise<IPost>;
    delete(postId: number): Promise<IPost>;
}
