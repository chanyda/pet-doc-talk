import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
} from "@nestjs/swagger";
import { CreateCommentDto } from "./dtos/requests/create-comment.dto";
import { UpdateCommentDto } from "./dtos/requests/update-comment.dto";
import { CommentResponseDto } from "./dtos/responses/comment-response.dto";
import { CommentListResponseDto } from "./dtos/responses/comment-list-response.dto";
import { User } from "src/common/decorators/user.decorator";
import { Auth } from "src/common/decorators/auth.decorator";
import { Public } from "src/common/decorators/public.decorator";
import { PaginationQueryDto } from "src/common/dtos/requests/pagination-query.dto";
import { CommentReplyListResponseDto } from "./dtos/responses/comment-reply-list-response.dto";

@ApiTags("comments")
@Auth()
@Controller()
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Get("posts/:postId/comments")
    @Public()
    @ApiOkResponse({ description: "Get comment list successful.", type: CommentListResponseDto })
    @ApiNotFoundResponse({ description: "Post not exists." })
    findComments(@Param("postId") postId: number, @Query() query: PaginationQueryDto): Promise<CommentListResponseDto> {
        return this.commentsService.findComments(postId, query);
    }

    @Get("comments/:commentId/replies")
    @Public()
    @ApiOkResponse({ description: "Get comment reply list successful.", type: CommentReplyListResponseDto })
    @ApiNotFoundResponse({ description: "Parent comment not exists." })
    findReplies(
        @Param("commentId") commentId: number,
        @Query() query: PaginationQueryDto,
    ): Promise<CommentReplyListResponseDto> {
        return this.commentsService.findReplies(commentId, query);
    }

    @Post("posts/:postId/comments")
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({ description: "Create comment successful.", type: CommentResponseDto })
    @ApiBadRequestResponse({
        description: "Cannot reply to a deleted parent comment or Parent comment does not belong to this post.",
    })
    @ApiNotFoundResponse({ description: "Post, User, Parent comment, or Mention user not exists." })
    create(
        @Param("postId") postId: number,
        @User("userId") userId: number,
        @Body() createCommentDto: CreateCommentDto,
    ): Promise<CommentResponseDto> {
        return this.commentsService.create(postId, userId, createCommentDto);
    }

    @Patch("comments/:id")
    @ApiOkResponse({ description: "Update comment successful.", type: CommentResponseDto })
    @ApiBadRequestResponse({ description: "Cannot update a deleted comment." })
    @ApiForbiddenResponse({ description: "You do not have permission to update this comment." })
    @ApiNotFoundResponse({ description: "Comment not exists." })
    update(
        @Param("id") id: number,
        @User("userId") userId: number,
        @Body() updateCommentDto: UpdateCommentDto,
    ): Promise<CommentResponseDto> {
        return this.commentsService.update(id, userId, updateCommentDto);
    }
}
