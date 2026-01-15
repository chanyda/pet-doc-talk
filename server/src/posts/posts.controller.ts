import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CreatePostDto } from "./dtos/requests/create-post.dto";
import { UpdatePostDto } from "./dtos/requests/update-post.dto";
import { PostResponseDto } from "./dtos/responses/post-response.dto";
import { PostDetailResponseDto } from "./dtos/responses/post-detail-response.dto";
import { User } from "src/common/decorators/user.decorator";
import { Auth } from "src/common/decorators/auth.decorator";
import { Public } from "src/common/decorators/public.decorator";
import { FindPostListQueryDto } from "./dtos/requests/find-post-list-query.dto";
import { PostListResponseDto } from "./dtos/responses/post-list-response.dto";
import { PaginationQueryDto } from "src/common/dtos/requests/pagination-query.dto";

@ApiTags("posts")
@Auth()
@Controller("posts")
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get()
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: "Find posts successful.", type: PostListResponseDto })
    // TODO: 좋아요 기능 추가 시 userId를 받아서 로그인한 사용자가 좋아요를 누른 게시글인지 보여줘야함
    findMany(@Query() findPostListQuery: FindPostListQueryDto): Promise<PostListResponseDto> {
        return this.postsService.findMany(findPostListQuery);
    }

    @Get("me")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: "Find my posts successful.", type: PostListResponseDto })
    findMyPosts(
        @User("userId") userId: number,
        @Query() paginationQuery: PaginationQueryDto,
    ): Promise<PostListResponseDto> {
        return this.postsService.findMyPosts(userId, paginationQuery);
    }

    @Get(":id")
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: "Find post successful.", type: PostDetailResponseDto })
    @ApiNotFoundResponse({ description: "Post not exists." })
    // TODO: 좋아요 기능 추가 시 userId를 받아서 로그인한 사용자가 좋아요를 누른 게시글인지 보여줘야함
    findById(@Param("id") postId: number): Promise<PostDetailResponseDto> {
        return this.postsService.findById(postId);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({ description: "Create post successful.", type: PostResponseDto })
    @ApiNotFoundResponse({ description: "User or Category not exists." })
    create(@User("userId") userId: number, @Body() createPostDto: CreatePostDto): Promise<PostResponseDto> {
        return this.postsService.create(userId, createPostDto);
    }

    @Patch(":id")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: "Update post successful.", type: PostResponseDto })
    @ApiNotFoundResponse({ description: "Post or Category not exists." })
    @ApiForbiddenResponse({ description: "You do not have permission to update this post." })
    update(
        @Param("id") postId: number,
        @User("userId") userId: number,
        @Body() updatePostDto: UpdatePostDto,
    ): Promise<PostResponseDto> {
        return this.postsService.update(postId, userId, updatePostDto);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOkResponse({ description: "Delete post successful." })
    @ApiNotFoundResponse({ description: "Post not exists." })
    @ApiForbiddenResponse({ description: "You do not have permission to delete this post." })
    remove(@Param("id") postId: number, @User("userId") userId: number): Promise<void> {
        return this.postsService.remove(postId, userId);
    }
}
