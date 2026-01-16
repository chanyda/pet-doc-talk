import { UsersService } from "src/users/users.service";
import { CommentsRepository } from "./comments.repository";
import { CommentsService } from "./comments.service";
import { PostsService } from "src/posts/posts.service";
import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe("CommentsService", () => {
    let commentsService: CommentsService;
    let commentsRepository: CommentsRepository;
    let usersService: UsersService;
    let postsService: PostsService;

    let findByIdSpy: jest.SpyInstance;
    let createSpy: jest.SpyInstance;

    let existsByPostIdSpy: jest.SpyInstance;
    let existsByUserIdSpy: jest.SpyInstance;

    const TEST_COMMENT_ID = 1;
    const TEST_POST_ID = 1;
    const TEST_USER_ID = 1;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                CommentsService,
                {
                    provide: CommentsRepository,
                    useValue: {
                        findById: jest.fn(),
                        create: jest.fn(),
                    },
                },

                {
                    provide: PostsService,
                    useValue: {
                        existsByPostId: jest.fn(),
                    },
                },
                {
                    provide: UsersService,
                    useValue: {
                        existsByUserId: jest.fn(),
                    },
                },
            ],
        }).compile();

        commentsService = moduleRef.get(CommentsService);
        commentsRepository = moduleRef.get(CommentsRepository);
        usersService = moduleRef.get(UsersService);
        postsService = moduleRef.get(PostsService);

        findByIdSpy = jest.spyOn(commentsRepository, "findById");
        createSpy = jest.spyOn(commentsRepository, "create");

        existsByPostIdSpy = jest.spyOn(postsService, "existsByPostId");

        existsByUserIdSpy = jest.spyOn(usersService, "existsByUserId");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        describe("댓글 생성 성공", () => {
            it("댓글(content)을 성공적으로 생성하여 생성된 댓글을 반환한다.", async () => {
                const createCommentDto = { content: "Test" };
                const mockComment = {
                    id: TEST_COMMENT_ID,
                    postId: TEST_POST_ID,
                    userId: TEST_USER_ID,
                    parentId: null,
                    mentionUserId: null,
                    content: createCommentDto.content,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                };

                existsByPostIdSpy.mockResolvedValue(true);
                existsByUserIdSpy.mockResolvedValue(true);
                createSpy.mockResolvedValue(mockComment);

                const result = await commentsService.create(TEST_POST_ID, TEST_USER_ID, createCommentDto);

                expect(result).toEqual(mockComment);
                expect(existsByPostIdSpy).toHaveBeenCalledWith(TEST_POST_ID);
                expect(existsByPostIdSpy).toHaveBeenCalledTimes(1);
                expect(existsByUserIdSpy).toHaveBeenCalledWith(TEST_USER_ID);
                expect(existsByUserIdSpy).toHaveBeenCalledTimes(1);
                expect(findByIdSpy).not.toHaveBeenCalled();
                expect(createSpy).toHaveBeenCalledWith(TEST_POST_ID, TEST_USER_ID, createCommentDto);
                expect(createSpy).toHaveBeenCalledTimes(1);
            });

            it("답글(content, parentId)을 성공적으로 생성하여 생성된 댓글을 반환한다.", async () => {
                const createCommentDto = { content: "Test", parentId: 2 };
                const mockComment = {
                    id: TEST_COMMENT_ID,
                    postId: TEST_POST_ID,
                    userId: TEST_USER_ID,
                    parentId: createCommentDto.parentId,
                    mentionUserId: null,
                    content: createCommentDto.content,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                };

                existsByPostIdSpy.mockResolvedValue(true);
                existsByUserIdSpy.mockResolvedValue(true);
                findByIdSpy.mockResolvedValue({ id: createCommentDto.parentId, postId: TEST_POST_ID, deletedAt: null });
                createSpy.mockResolvedValue(mockComment);

                const result = await commentsService.create(TEST_POST_ID, TEST_USER_ID, createCommentDto);

                expect(result).toEqual(mockComment);
                expect(existsByPostIdSpy).toHaveBeenCalledWith(TEST_POST_ID);
                expect(existsByPostIdSpy).toHaveBeenCalledTimes(1);
                expect(existsByUserIdSpy).toHaveBeenCalledWith(TEST_USER_ID);
                expect(existsByUserIdSpy).toHaveBeenCalledTimes(1);
                expect(findByIdSpy).toHaveBeenCalledWith(createCommentDto.parentId, {
                    id: true,
                    postId: true,
                    deletedAt: true,
                });
                expect(findByIdSpy).toHaveBeenCalledTimes(1);
                expect(createSpy).toHaveBeenCalledWith(TEST_POST_ID, TEST_USER_ID, createCommentDto);
                expect(createSpy).toHaveBeenCalledTimes(1);
            });

            it("대댓글(content, parentId, mentionUserId)을 성공적으로 생성하여 생성된 댓글을 반환한다.", async () => {
                const createCommentDto = { content: "Test", parentId: 2, mentionUserId: 2 };
                const mockComment = {
                    id: TEST_COMMENT_ID,
                    postId: TEST_POST_ID,
                    userId: TEST_USER_ID,
                    parentId: createCommentDto.parentId,
                    mentionUserId: createCommentDto.mentionUserId,
                    content: createCommentDto.content,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                };

                existsByPostIdSpy.mockResolvedValue(true);
                existsByUserIdSpy.mockResolvedValue(true);
                findByIdSpy.mockResolvedValue({ id: createCommentDto.parentId, postId: TEST_POST_ID, deletedAt: null });
                createSpy.mockResolvedValue(mockComment);

                const result = await commentsService.create(TEST_POST_ID, TEST_USER_ID, createCommentDto);

                expect(result).toEqual(mockComment);
                expect(existsByPostIdSpy).toHaveBeenCalledWith(TEST_POST_ID);
                expect(existsByPostIdSpy).toHaveBeenCalledTimes(1);
                expect(existsByUserIdSpy).toHaveBeenCalledWith(TEST_USER_ID);
                expect(existsByUserIdSpy).toHaveBeenCalledWith(createCommentDto.mentionUserId);
                // mentionUserId 유효성 검사도 진행하므로 2번 불린다.
                expect(existsByUserIdSpy).toHaveBeenCalledTimes(2);
                expect(findByIdSpy).toHaveBeenCalledWith(createCommentDto.parentId, {
                    id: true,
                    postId: true,
                    deletedAt: true,
                });
                expect(findByIdSpy).toHaveBeenCalledTimes(1);
                expect(createSpy).toHaveBeenCalledWith(TEST_POST_ID, TEST_USER_ID, createCommentDto);
                expect(createSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("댓글 생성 실패", () => {
            it("댓글을 작성하려는 게시글 정보가 존재하지 않아서 오류를 반환한다.", async () => {
                const createCommentDto = { content: "Test" };

                existsByPostIdSpy.mockResolvedValue(false);

                await expect(commentsService.create(TEST_POST_ID, TEST_USER_ID, createCommentDto)).rejects.toThrow(
                    new NotFoundException("Post not exists."),
                );
                expect(existsByPostIdSpy).toHaveBeenCalledWith(TEST_POST_ID);
                expect(existsByPostIdSpy).toHaveBeenCalledTimes(1);
                expect(existsByUserIdSpy).not.toHaveBeenCalled();
                expect(findByIdSpy).not.toHaveBeenCalled();
                expect(createSpy).not.toHaveBeenCalled();
            });

            it("로그인한 사용자에 대한 사용자 정보가 DB에 존재하지 않아서 오류를 반환한다.", async () => {
                const createCommentDto = { content: "Test" };

                existsByPostIdSpy.mockResolvedValue(true);
                existsByUserIdSpy.mockResolvedValue(false);

                await expect(commentsService.create(TEST_POST_ID, TEST_USER_ID, createCommentDto)).rejects.toThrow(
                    new NotFoundException("User not exists."),
                );
                expect(existsByPostIdSpy).toHaveBeenCalledWith(TEST_POST_ID);
                expect(existsByPostIdSpy).toHaveBeenCalledTimes(1);
                expect(existsByUserIdSpy).toHaveBeenCalledWith(TEST_USER_ID);
                expect(existsByUserIdSpy).toHaveBeenCalledTimes(1);
                expect(findByIdSpy).not.toHaveBeenCalled();
                expect(createSpy).not.toHaveBeenCalled();
            });

            it("답글을 다려고 하는 댓글 정보가 DB에 존재하지 않아서 오류를 반환한다.", async () => {
                const createCommentDto = { content: "Test", parentId: 2 };

                existsByPostIdSpy.mockResolvedValue(true);
                existsByUserIdSpy.mockResolvedValue(true);
                findByIdSpy.mockResolvedValue(null);

                await expect(commentsService.create(TEST_POST_ID, TEST_USER_ID, createCommentDto)).rejects.toThrow(
                    new NotFoundException("Parent comment not exists."),
                );
                expect(existsByPostIdSpy).toHaveBeenCalledWith(TEST_POST_ID);
                expect(existsByPostIdSpy).toHaveBeenCalledTimes(1);
                expect(existsByUserIdSpy).toHaveBeenCalledWith(TEST_USER_ID);
                expect(existsByUserIdSpy).toHaveBeenCalledTimes(1);
                expect(findByIdSpy).toHaveBeenCalledWith(createCommentDto.parentId, {
                    id: true,
                    postId: true,
                    deletedAt: true,
                });
                expect(findByIdSpy).toHaveBeenCalledTimes(1);
                expect(createSpy).not.toHaveBeenCalled();
            });

            it("답글을 다려고 하는 댓글의 게시글과 현재 답글을 다려는 게시글이 일치하지 않아서 오류를 반환한다.", async () => {
                const createCommentDto = { content: "Test", parentId: 2 };

                existsByPostIdSpy.mockResolvedValue(true);
                existsByUserIdSpy.mockResolvedValue(true);
                findByIdSpy.mockResolvedValue({ id: createCommentDto.parentId, postId: 2, deletedAt: null });

                await expect(commentsService.create(TEST_POST_ID, TEST_USER_ID, createCommentDto)).rejects.toThrow(
                    new NotFoundException("Parent comment does not belong to this post."),
                );
                expect(existsByPostIdSpy).toHaveBeenCalledWith(TEST_POST_ID);
                expect(existsByPostIdSpy).toHaveBeenCalledTimes(1);
                expect(existsByUserIdSpy).toHaveBeenCalledWith(TEST_USER_ID);
                expect(existsByUserIdSpy).toHaveBeenCalledTimes(1);
                expect(findByIdSpy).toHaveBeenCalledWith(createCommentDto.parentId, {
                    id: true,
                    postId: true,
                    deletedAt: true,
                });
                expect(findByIdSpy).toHaveBeenCalledTimes(1);
                expect(createSpy).not.toHaveBeenCalled();
            });

            it("답글을 다려고 하는 댓글이 이미 지워져서 오류를 반환한다.", async () => {
                const createCommentDto = { content: "Test", parentId: 2 };

                existsByPostIdSpy.mockResolvedValue(true);
                existsByUserIdSpy.mockResolvedValue(true);
                findByIdSpy.mockResolvedValue({
                    id: createCommentDto.parentId,
                    postId: TEST_POST_ID,
                    deletedAt: new Date(),
                });

                await expect(commentsService.create(TEST_POST_ID, TEST_USER_ID, createCommentDto)).rejects.toThrow(
                    new BadRequestException("Cannot reply to a deleted parent comment."),
                );
                expect(existsByPostIdSpy).toHaveBeenCalledWith(TEST_POST_ID);
                expect(existsByPostIdSpy).toHaveBeenCalledTimes(1);
                expect(existsByUserIdSpy).toHaveBeenCalledWith(TEST_USER_ID);
                expect(existsByUserIdSpy).toHaveBeenCalledTimes(1);
                expect(findByIdSpy).toHaveBeenCalledWith(createCommentDto.parentId, {
                    id: true,
                    postId: true,
                    deletedAt: true,
                });
                expect(findByIdSpy).toHaveBeenCalledTimes(1);
                expect(createSpy).not.toHaveBeenCalled();
            });

            it("멘션하려는 User 정보가 DB에 존재하지 않아서 오류를 반환한다.", async () => {
                const createCommentDto = { content: "Test", parentId: 2, mentionUserId: 2 };

                existsByPostIdSpy.mockResolvedValue(true);
                existsByUserIdSpy.mockResolvedValueOnce(true);
                findByIdSpy.mockResolvedValue({ id: createCommentDto.parentId, postId: TEST_POST_ID, deletedAt: null });
                existsByUserIdSpy.mockResolvedValueOnce(false);

                await expect(commentsService.create(TEST_POST_ID, TEST_USER_ID, createCommentDto)).rejects.toThrow(
                    new NotFoundException("Mention user not exists."),
                );
                expect(existsByPostIdSpy).toHaveBeenCalledWith(TEST_POST_ID);
                expect(existsByPostIdSpy).toHaveBeenCalledTimes(1);
                expect(existsByUserIdSpy).toHaveBeenCalledWith(TEST_USER_ID);
                expect(existsByUserIdSpy).toHaveBeenCalledTimes(2);
                expect(findByIdSpy).toHaveBeenCalledWith(createCommentDto.parentId, {
                    id: true,
                    postId: true,
                    deletedAt: true,
                });
                expect(findByIdSpy).toHaveBeenCalledTimes(1);
                expect(existsByUserIdSpy).toHaveBeenCalledWith(createCommentDto.mentionUserId);
                expect(createSpy).not.toHaveBeenCalled();
            });
        });
    });
});
