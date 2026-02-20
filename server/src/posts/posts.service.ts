import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";

import { PostGetPayload, PostOrderByWithRelationInput, PostWhereInput } from "generated/prisma/models";

import { CategoriesService } from "@/categories/categories.service";
import { PaginationQueryDto } from "@/common/dtos/requests/pagination-query.dto";
import { getNextCursor } from "@/common/utils/pagination.util";
import { UsersService } from "@/users/users.service";

import { POST_DETAIL_SELECT, POST_SUMMARY_SELECT, PostSummarySelect } from "./constants";
import { CreatePostDto } from "./dtos/requests/create-post.dto";
import { FindPostListQueryDto } from "./dtos/requests/find-post-list-query.dto";
import { UpdatePostDto } from "./dtos/requests/update-post.dto";
import { PostDetailResponseDto } from "./dtos/responses/post-detail-response.dto";
import { PostListResponseDto } from "./dtos/responses/post-list-response.dto";
import { PostResponseDto } from "./dtos/responses/post-response.dto";
import { PostSummaryDto } from "./dtos/responses/post-summary-dto";
import { PostOrderBy } from "./posts.enums";
import { PostsRepository } from "./posts.repository";

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

        // TODO: 좋아요 기능 추가 시 likeCount, isLiked도 보여줘야함
        const { posts, totalCount: totalPostCount } = await this.postsRepository.findManyAndCount({
            take: query.limit,
            skip: query.cursor ? 1 : undefined,
            cursor: query.cursor ? { id: query.cursor } : undefined,
            select: POST_SUMMARY_SELECT,
            where: whereInput,
            orderBy: orderByInput,
        });
        // 조회된 post의 수가 limit와 동일한 경우, 다음 페이지가 있다고 판단하여 nextCursor를 리턴해주고
        // 동일하지 않은 경우 다음 페이지는 없다고 판단하여 null를 리턴한다.
        const nextCursor = getNextCursor(posts, query.limit);

        return {
            posts: posts.map((post) => this.toPostSummary(post)),
            nextCursor,
            totalPostCount,
        };
    }

    async findMyPosts(userId: number, query: PaginationQueryDto): Promise<PostListResponseDto> {
        const { posts, totalCount: totalPostCount } = await this.postsRepository.findManyAndCount({
            take: query.limit,
            skip: query.cursor ? 1 : undefined,
            cursor: query.cursor ? { id: query.cursor } : undefined,
            select: POST_SUMMARY_SELECT,
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        const nextCursor = getNextCursor(posts, query.limit);

        return {
            posts: posts.map((post) => this.toPostSummary(post)),
            nextCursor,
            totalPostCount,
        };
    }

    async findById(postId: number, currentUserId: number | undefined): Promise<PostDetailResponseDto> {
        const post = await this.postsRepository.findById(postId, POST_DETAIL_SELECT);

        if (!post) {
            throw new NotFoundException("Post not exists.");
        }

        // 비로그인 사용자이거나 내 게시글이 아닌 게시글을 조회한 경우 조회수를 올려준다.
        if (!currentUserId || post.user.id !== currentUserId) {
            const { viewCount: updatedViewCount } = await this.postsRepository.updateViewCount(postId, {
                viewCount: true,
            });
            post.viewCount = updatedViewCount;
        }

        return post;
    }

    async existsByPostId(postId: number): Promise<boolean> {
        const post = await this.postsRepository.findById(postId, { id: true });
        return !!post;
    }

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

    async update(postId: number, userId: number, updatePostDto: UpdatePostDto): Promise<PostResponseDto> {
        const post = await this.postsRepository.findById(postId, { id: true, userId: true });

        if (!post) {
            throw new NotFoundException("Post not exists.");
        }

        if (post.userId !== userId) {
            throw new ForbiddenException("You do not have permission to update this post.");
        }

        // 카테고리 변경 시, 유효한 카테고리인지 체크한다.
        if (updatePostDto.categoryId) {
            const categoryExists = await this.categoriesService.existsByCategoryId(updatePostDto.categoryId);

            if (!categoryExists) {
                throw new NotFoundException("Category not exists.");
            }
        }

        return this.postsRepository.update(postId, updatePostDto);
    }

    async remove(postId: number, userId: number): Promise<void> {
        const post = await this.postsRepository.findById(postId, { id: true, userId: true });

        if (!post) {
            throw new NotFoundException("Post not exists.");
        }

        if (post.userId !== userId) {
            throw new ForbiddenException("You do not have permission to delete this post.");
        }

        await this.postsRepository.delete(postId);
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

    private toPostSummary(post: PostGetPayload<{ select: PostSummarySelect }>): PostSummaryDto {
        return {
            id: post.id,
            title: post.title,
            viewCount: post.viewCount,
            commentCount: post._count.comments,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            user: post.user,
            category: post.category,
        };
    }
}
