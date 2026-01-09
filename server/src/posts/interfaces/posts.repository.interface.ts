import { PostFindManyArgs, PostGetPayload, PostSelect } from "generated/prisma/models";
import { CreatePostDto } from "../dtos/create-post.dto";
import { IPost } from "./posts.interface";
import { SelectSubset } from "generated/prisma/internal/prismaNamespace";

export interface IPostsRepository {
    findMany<T extends PostFindManyArgs>(params: SelectSubset<T, PostFindManyArgs>): Promise<PostGetPayload<T>[]>;
    create(userId: number, createPostDto: CreatePostDto, select?: PostSelect): Promise<IPost>;
}
