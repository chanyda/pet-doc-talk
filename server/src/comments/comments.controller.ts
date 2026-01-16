import { Body, Controller, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiTags } from "@nestjs/swagger";
import { CreateCommentDto } from "./dtos/requests/create-comment.dto";
import { CommentResponseDto } from "./dtos/responses/comment-response.dto";
import { User } from "src/common/decorators/user.decorator";
import { Auth } from "src/common/decorators/auth.decorator";

@ApiTags("comments")
@Auth()
@Controller()
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Post("posts/:postId/comments")
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({ description: "Create comment successful.", type: CommentResponseDto })
    @ApiBadRequestResponse({ description: "Cannot reply to a deleted parent comment." })
    @ApiNotFoundResponse({ description: "Post, User, Parent comment, or Mention user not exists." })
    create(
        @Param("postId") postId: number,
        @User("userId") userId: number,
        @Body() createCommentDto: CreateCommentDto,
    ): Promise<CommentResponseDto> {
        return this.commentsService.create(postId, userId, createCommentDto);
    }
}
