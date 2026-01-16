import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CommentsRepository } from "./comments.repository";
import { CreateCommentDto } from "./dtos/requests/create-comment.dto";
import { CommentResponseDto } from "./dtos/responses/comment-response.dto";
import { UsersService } from "src/users/users.service";
import { PostsService } from "src/posts/posts.service";

@Injectable()
export class CommentsService {
    constructor(
        private readonly commentsRepository: CommentsRepository,
        private readonly usersService: UsersService,
        private readonly postsService: PostsService,
    ) {}

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
            throw new NotFoundException("Parent comment does not belong to this post.");
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
}
