import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { CommentsRepository } from "./comments.repository";
import { CreateCommentDto } from "./dtos/requests/create-comment.dto";
import { UpdateCommentDto } from "./dtos/requests/update-comment.dto";
import { CommentResponseDto } from "./dtos/responses/comment-response.dto";
import { UsersService } from "src/users/users.service";
import { PostsService } from "src/posts/posts.service";
import { CommentGetPayload } from "generated/prisma/models";
import { COMMENT_BASE_SELECT, COMMENT_SELECT, CommentSelect, MY_COMMENT_SELECT, MyCommentSelect } from "./constants";
import { PaginationQueryDto } from "src/common/dtos/requests/pagination-query.dto";
import { CommentListResponseDto } from "./dtos/responses/comment-list-response.dto";
import { CommentReplyListResponseDto } from "./dtos/responses/comment-reply-list-response.dto";
import { CommentItemDto } from "./dtos/responses/comment-item.dto";
import { getNextCursor } from "src/common/utils/pagination.util";
import { MyCommentListResponseDto } from "./dtos/responses/my-comment-list-response.dto";
import { MyCommentItemDto } from "./dtos/responses/my-comment-item.dto";

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

        // 답글을 제외한 댓글 목록과 댓글 수를 가져온다.
        const { comments: parentComments, totalCount: totalParentCommentCount } =
            await this.commentsRepository.findManyAndCount({
                take: query.limit,
                skip: query.cursor ? 1 : undefined,
                cursor: query.cursor ? { id: query.cursor } : undefined,
                // 댓글만 가져오기 때문에 parentId는 null이다. (답글 혹은 대댓글인 경우 parentId를 가지고 있음)
                // 삭제된 댓글의 경우, '삭제된 댓글입니다' 라고 표시해줄 예정이므로 deletedAt: null에 대한 조건은 별도 설정하지 않음
                where: { postId: postId, parentId: null },
                select: COMMENT_SELECT,
                orderBy: { createdAt: "asc" },
            });
        // 댓글과 답글을 포함한 전체 댓글 수를 보여줘야 하므로 전체 댓글 수를 가져온다.
        // 삭제된 댓글도 표시해주므로 댓글 수에 포함된다.
        const totalCommentCount = await this.commentsRepository.count({ postId });

        const nextCursor = getNextCursor(parentComments, query.limit);

        return {
            comments: parentComments.map((comment) => this.toCommentItem(comment)),
            totalParentCommentCount,
            totalCommentCount,
            nextCursor,
        };
    }

    // TODO: 댓글 좋아요 기능 추가 시 userId를 받아서 좋아요한 댓글에 대한 정보를 보여줘야함
    async findReplies(parentCommentId: number, query: PaginationQueryDto): Promise<CommentReplyListResponseDto> {
        const parentComment = await this.commentsRepository.findById(parentCommentId, { id: true });
        if (!parentComment) {
            throw new NotFoundException("Parent comment not exists.");
        }

        const replies = await this.commentsRepository.findMany({
            take: query.limit,
            skip: query.cursor ? 1 : undefined,
            cursor: query.cursor ? { id: query.cursor } : undefined,
            // 삭제된 댓글의 경우, '삭제된 댓글입니다' 라고 표시해줄 예정이므로 deletedAt: null에 대한 조건은 별도 설정하지 않음
            where: { parentId: parentCommentId },
            select: COMMENT_BASE_SELECT,
            orderBy: { createdAt: "asc" },
        });
        const nextCursor = getNextCursor(replies, query.limit);

        return {
            replies,
            nextCursor,
        };
    }

    async findMyComments(userId: number, query: PaginationQueryDto): Promise<MyCommentListResponseDto> {
        const { comments, totalCount } = await this.commentsRepository.findManyAndCount({
            take: query.limit,
            skip: query.cursor ? 1 : undefined,
            cursor: query.cursor ? { id: query.cursor } : undefined,
            // 내가 작성한 댓글을 보여줘야하므로, 삭제된 댓글은 보여주지 않는다.
            where: { userId, deletedAt: null },
            select: MY_COMMENT_SELECT,
            orderBy: { createdAt: "desc" },
        });
        const nextCursor = getNextCursor(comments, query.limit);

        return {
            comments: comments.map((comment) => this.toMyCommentItem(comment)),
            nextCursor,
            totalCommentCount: totalCount,
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

    async update(commentId: number, userId: number, updateCommentDto: UpdateCommentDto): Promise<CommentResponseDto> {
        const comment = await this.commentsRepository.findById(commentId, { id: true, userId: true, deletedAt: true });

        if (!comment) {
            throw new NotFoundException("Comment not exists.");
        }

        if (comment.userId !== userId) {
            throw new ForbiddenException("You do not have permission to update this comment.");
        }

        if (comment.deletedAt) {
            throw new BadRequestException("Cannot update a deleted comment.");
        }

        return this.commentsRepository.update(commentId, updateCommentDto);
    }

    async remove(commentId: number, userId: number): Promise<void> {
        const comment = await this.commentsRepository.findById(commentId, { id: true, userId: true, deletedAt: true });

        if (!comment) {
            throw new NotFoundException("Comment not exists.");
        }

        if (comment.userId !== userId) {
            throw new ForbiddenException("You do not have permission to delete this comment.");
        }

        if (comment.deletedAt) {
            throw new BadRequestException("Comment already deleted.");
        }

        await this.commentsRepository.delete(commentId);
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

    private toCommentItem(comment: CommentGetPayload<{ select: CommentSelect }>): CommentItemDto {
        return {
            id: comment.id,
            content: comment.content,
            parentId: comment.parentId,
            user: comment.user,
            mentionUser: comment.mentionUser,
            replyCount: comment._count.replies,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
            deletedAt: comment.deletedAt,
        };
    }

    private toMyCommentItem(comment: CommentGetPayload<{ select: MyCommentSelect }>): MyCommentItemDto {
        return {
            id: comment.id,
            content: comment.content,
            post: {
                id: comment.post.id,
                title: comment.post.title,
                commentCount: comment.post._count.comments,
            },
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
        };
    }
}
