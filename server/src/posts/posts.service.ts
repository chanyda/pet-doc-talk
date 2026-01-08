import { Injectable, NotFoundException } from "@nestjs/common";
import { PostsRepository } from "./posts.repository";
import { CreatePostDto } from "./dtos/create-post.dto";
import { PostResponseDto } from "./dtos/post-response.dto";
import { Transactional } from "@nestjs-cls/transactional";
import { UsersService } from "src/users/users.service";
import { CategoriesService } from "src/categories/categories.service";

@Injectable()
export class PostsService {
    constructor(
        private readonly postsRepository: PostsRepository,
        private readonly categoriesService: CategoriesService,
        private readonly usersService: UsersService,
    ) {}

    @Transactional()
    async create(userId: number, createPostDto: CreatePostDto): Promise<PostResponseDto> {
        const userExists = await this.usersService.existsByUserId(userId);

        if (!userExists) {
            throw new NotFoundException("User not exists.");
        }

        const categoryExists = await this.categoriesService.existsByCategoryId(createPostDto.categoryId);

        if (!categoryExists) {
            throw new NotFoundException("Category not exists.");
        }

        return this.postsRepository.create(userId, createPostDto);
    }
}
