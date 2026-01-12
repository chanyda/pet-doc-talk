import { Injectable, NotFoundException } from "@nestjs/common";
import { PostsRepository } from "./posts.repository";
import { CreatePostDto } from "./dtos/requests/create-post.dto";
import { PostResponseDto } from "./dtos/responses/post-response.dto";
import { CreatePostDto } from "./dtos/create-post.dto";
import { PostResponseDto } from "./dtos/post-response.dto";
import { Transactional } from "@nestjs-cls/transactional";
import { UsersService } from "src/users/users.service";
import { CategoriesService } from "src/categories/categories.service";
import { FindPostListQueryDto } from "./dtos/requests/find-post-list-query.dto";
import { PostListResponseDto } from "./dtos/responses/post-list-response.dto";
import { PostOrderByWithRelationInput, PostSelect, PostWhereInput } from "generated/prisma/models";
import { PostOrderBy } from "./posts.enums";

@Injectable()
export class PostsService {
    constructor(
        private readonly postsRepository: PostsRepository,
        private readonly categoriesService: CategoriesService,
        private readonly usersService: UsersService,
    ) {}

    async findMany(query: FindPostListQueryDto): Promise<PostListResponseDto> {
        const orderByInput = this.buildFindManyOrderByInput(query.orderBy);
        const whereInput = this.buildFindManyWhereInput(query.categoryId, query.keyword);
        const selectInput: PostSelect = {
            id: true,
            title: true,
            viewCount: true,
            createdAt: true,
            updatedAt: true,
            user: {
                select: { id: true, nickname: true },
            },
            category: {
                select: { id: true, name: true },
            },
        };

        // TODO: 좋아요와 댓글 기능 추가 시 likeCount, commentCount, isLiked도 보여줘야함
        const posts = await this.postsRepository.findMany({
            take: query.limit,
            skip: query.cursor ? 1 : undefined,
            cursor: query.cursor ? { id: query.cursor } : undefined,
            select: selectInput,
            where: whereInput,
            orderBy: orderByInput,
        });

        // 조회된 post의 수가 limit와 동일한 경우, 다음 페이지가 있다고 판단하여 nextCursor를 리턴해주고
        // 동일하지 않은 경우 다음 페이지는 없다고 판단하여 null를 리턴한다.
        const nextCursor = posts.length === query.limit ? posts[posts.length - 1].id : null;
        return {
            posts,
            nextCursor,
        };
    }

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

    private buildFindManyOrderByInput(
        orderBy: PostOrderBy,
    ): PostOrderByWithRelationInput | PostOrderByWithRelationInput[] {
        switch (orderBy) {
            case PostOrderBy.CREATED_AT:
            case PostOrderBy.LIKE_COUNT:
                // TODO: 좋아요 기능 추가 전까지 좋아요순으로 요청해도 최신순으로 대체
                return { createdAt: "desc" };
            case PostOrderBy.VIEW_COUNT:
                // 기본적으로 viewCount가 높은 것부터 보여지고 viewCount가 동일하다면 최신순으로 정렬하도록 함
                return [{ viewCount: "desc" }, { createdAt: "desc" }];
            default:
                return { createdAt: "desc" };
        }
    }

    private buildFindManyWhereInput(categoryId?: number, keyword?: string): PostWhereInput {
        const where: PostWhereInput = {};

        if (categoryId) {
            where.categoryId = categoryId;
        }

        if (keyword) {
            where.OR = [{ title: { contains: keyword } }, { content: { contains: keyword } }];
        }

        return where;
    }
}
