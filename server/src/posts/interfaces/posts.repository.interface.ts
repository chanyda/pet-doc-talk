import { PostSelect } from "generated/prisma/models";
import { CreatePostDto } from "../dtos/create-post.dto";
import { IPost } from "./posts.interface";

export interface IPostsRepository {
    create(userId: number, createPostDto: CreatePostDto, select?: PostSelect): Promise<IPost>;
}
