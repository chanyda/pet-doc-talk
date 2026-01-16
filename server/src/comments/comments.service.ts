import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CommentsRepository } from "./comments.repository";
import { CreateCommentDto } from "./dtos/requests/create-comment.dto";
import { CommentResponseDto } from "./dtos/responses/comment-response.dto";
import { UsersService } from "src/users/users.service";
import { PostsService } from "src/posts/posts.service";
import { CommentGetPayload } from "generated/prisma/models";
import { COMMENT_REPLY_SELECT, COMMENT_SELECT, CommentSelect } from "./constants";
import { PaginationQueryDto } from "src/common/dtos/requests/pagination-query.dto";
import { CommentListResponseDto } from "./dtos/responses/comment-list-response.dto";
import { CommentReplyListResponseDto } from "./dtos/responses/comment-reply-list-response.dto";
import { CommentListItemDto } from "./dtos/responses/comment-list-item.dto";
import { getNextCursor } from "src/common/utils/pagination.util";

@Injectable()
export class CommentsService {
    constructor(
        private readonly commentsRepository: CommentsRepository,
        private readonly usersService: UsersService,
        private readonly postsService: PostsService,
    ) {}

    // TODO: 댓글 좋아요 기능 추가 시 userId를 받아서 좋아요한 댓글에 대한 정보를 보여줘야함
    async findComments(postId: number, query: PaginationQueryDto): Promise<CommentListResponseDto> {
        const postExists = await this.postsService.existsByPostId(postId);
        if (!postExists) {
            throw new NotFoundException("Post not exists.");
        }

        const parentComments = await this.commentsRepository.findMany({
            take: query.limit,
            skip: query.cursor ? 1 : undefined,
            cursor: query.cursor ? { id: query.cursor } : undefined,
            // 댓글만 가져오기 때문에 parentId는 null이다. (답글 혹은 대댓글인 경우 parentId를 가지고 있음)
            where: { postId: postId, parentId: null },
            select: COMMENT_SELECT,
            orderBy: { id: "asc" },
        });
        const nextCursor = getNextCursor(parentComments, query.limit);

        return {
            comments: parentComments.map((comment) => this.toCommentResponse(comment)),
            nextCursor,
        };
    }

    // TODO: 댓글 좋아요 기능 추가 시 userId를 받아서 좋아요한 댓글에 대한 정보를 보여줘야함
    async findReplies(
        postId: number,
        parentCommentId: number,
        query: PaginationQueryDto,
    ): Promise<CommentReplyListResponseDto> {
        const postExists = await this.postsService.existsByPostId(postId);
        if (!postExists) {
            throw new NotFoundException("Post not exists.");
        }

        const parentComment = await this.commentsRepository.findById(parentCommentId, { id: true, postId: true });
        if (!parentComment) {
            throw new NotFoundException("Parent comment not exists.");
        }

        if (parentComment.postId !== postId) {
            throw new BadRequestException("Parent comment does not belong to this post.");
        }

        const replies = await this.commentsRepository.findMany({
            take: query.limit,
            skip: query.cursor ? 1 : undefined,
            cursor: query.cursor ? { id: query.cursor } : undefined,
            where: { postId: postId, parentId: parentCommentId },
            select: COMMENT_REPLY_SELECT,
            orderBy: { id: "asc" },
        });
        const nextCursor = getNextCursor(replies, query.limit);

        return {
            replies,
            nextCursor,
        };
    }

    /**
     * 댓글 구조는 예시는 아래와 같음
     * 홍길동: 안녕하세요?
     * ㄴ 김철수: 안녕하세요 길동님
     * ㄴ 신짱구: @김철수 철수님은 누구신가요?
     * ㄴ 김철수: @신짱구 김철수입니다만
     * ㄴ 이수지: 길동님 뭐하시나요?
     *
     * @param postId
     * @param userId
     * @param createCommentDto
     * @returns
     */
    async create(postId: number, userId: number, createCommentDto: CreateCommentDto): Promise<CommentResponseDto> {
        const postExists = await this.postsService.existsByPostId(postId);
        if (!postExists) {
            throw new NotFoundException("Post not exists.");
        }

        const userExists = await this.usersService.existsByUserId(userId);
        if (!userExists) {
            throw new NotFoundException("User not exists.");
        }

        // 답글인 경우, parent 댓글이 유효한지 체크한다.
        if (createCommentDto.parentId) {
            await this.validateParentComment(createCommentDto.parentId, postId);
        }

        // 대댓글인 경우, 멘션한 사용자의 아이디가 존재하는 지 체크한다.
        if (createCommentDto.mentionUserId) {
            await this.validateMentionUserId(createCommentDto.mentionUserId);
        }

        return this.commentsRepository.create(postId, userId, createCommentDto);
    }

    private async validateParentComment(parentId: number, postId: number): Promise<void> {
        const parentComment = await this.commentsRepository.findById(parentId, {
            id: true,
            postId: true,
            deletedAt: true,
        });

        if (!parentComment) {
            throw new NotFoundException("Parent comment not exists.");
        }

        if (parentComment.postId !== postId) {
            throw new BadRequestException("Parent comment does not belong to this post.");
        }

        if (parentComment.deletedAt) {
            throw new BadRequestException("Cannot reply to a deleted parent comment.");
        }
    }

    private async validateMentionUserId(mentionUserId: number): Promise<void> {
        const mentionUserExists = await this.usersService.existsByUserId(mentionUserId);

        if (!mentionUserExists) {
            throw new NotFoundException("Mention user not exists.");
        }
    }

    private toCommentResponse(comment: CommentGetPayload<{ select: CommentSelect }>): CommentListItemDto {
        return {
            id: comment.id,
            content: comment.content,
            parentId: comment.parentId,
            user: comment.user,
            replyCount: comment._count.replies,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
            deletedAt: comment.deletedAt,
        };
    }
}
