import { Test, TestingModule } from "@nestjs/testing";
import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.service";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { BadRequestException, ForbiddenException, NotFoundException } from "@nestjs/common";

describe("CommentsController", () => {
    let commentsController: CommentsController;
    let commentsService: CommentsService;

    let findCommentsSpy: jest.SpyInstance;
    let findRepliesSpy: jest.SpyInstance;
    let createSpy: jest.SpyInstance;
    let updateSpy: jest.SpyInstance;

    const TEST_COMMENT_ID = 1;
    const TEST_POST_ID = 1;
    const TEST_USER_ID = 1;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [CommentsController],
            providers: [
                {
                    provide: CommentsService,
                    useValue: {
                        findComments: jest.fn(),
                        findReplies: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                    },
                },
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        commentsController = moduleRef.get(CommentsController);
        commentsService = moduleRef.get(CommentsService);

        findCommentsSpy = jest.spyOn(commentsService, "findComments");
        findRepliesSpy = jest.spyOn(commentsService, "findReplies");
        createSpy = jest.spyOn(commentsService, "create");
        updateSpy = jest.spyOn(commentsService, "update");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("findComments", () => {
        const requiredQuery = { limit: 10 };

        describe("댓글 목록 조회 성공", () => {
            it("댓글 목록을 조회하여 다음 페이지가 존재할 때 nextCursor를 반환한다.", async () => {
                const mockComments = Array.from({ length: requiredQuery.limit }, (_, i) => ({
                    id: i + 1,
                    content: "Test",
                    parentId: null,
                    user: { id: i + 1, nickname: `닉네임${i + 1}`, profileImageUrl: null },
                    replyCount: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                }));
                const commentsResponse = {
                    comments: mockComments,
                    nextCursor: mockComments[mockComments.length - 1].id,
                };

                findCommentsSpy.mockResolvedValue(commentsResponse);

                const result = await commentsController.findComments(TEST_POST_ID, requiredQuery);

                expect(result).toEqual(commentsResponse);
                expect(findCommentsSpy).toHaveBeenCalledWith(TEST_POST_ID, requiredQuery);
                expect(findCommentsSpy).toHaveBeenCalledTimes(1);
            });

            it("댓글 목록을 조회하여 다음 페이지가 없을 때 nextCursor를 null로 반환한다.", async () => {
                const mockComments = Array.from({ length: requiredQuery.limit - 1 }, (_, i) => ({
                    id: i + 1,
                    content: "Test",
                    parentId: null,
                    user: { id: i + 1, nickname: `닉네임${i + 1}`, profileImageUrl: null },
                    replyCount: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                }));
                const commentsResponse = { comments: mockComments, nextCursor: null };

                findCommentsSpy.mockResolvedValue(commentsResponse);

                const result = await commentsController.findComments(TEST_POST_ID, requiredQuery);

                expect(result).toEqual(commentsResponse);
                expect(findCommentsSpy).toHaveBeenCalledWith(TEST_POST_ID, requiredQuery);
                expect(findCommentsSpy).toHaveBeenCalledTimes(1);
            });

            it("댓글 목록이 없을 때 빈 배열과 nextCursor를 null로 반환한다.", async () => {
                const commentsResponse = { comments: [], nextCursor: null };

                findCommentsSpy.mockResolvedValue(commentsResponse);

                const result = await commentsController.findComments(TEST_POST_ID, requiredQuery);

                expect(result).toEqual(commentsResponse);
                expect(findCommentsSpy).toHaveBeenCalledWith(TEST_POST_ID, requiredQuery);
                expect(findCommentsSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("댓글 목록 조회 실패", () => {
            it("댓글을 조회하려는 게시글 정보가 존재하지 않아 오류를 반환한다.", async () => {
                findCommentsSpy.mockRejectedValue(new NotFoundException("Post not exists."));

                await expect(commentsController.findComments(TEST_POST_ID, requiredQuery)).rejects.toThrow(
                    new NotFoundException("Post not exists."),
                );
                expect(findCommentsSpy).toHaveBeenCalledWith(TEST_POST_ID, requiredQuery);
                expect(findCommentsSpy).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("findReplies", () => {
        const requiredQuery = { limit: 10 };

        describe("답글 목록 조회 성공", () => {
            it("답글 목록을 조회하여 다음 페이지가 존재할 때 nextCursor를 반환한다.", async () => {
                const mockReplies = Array.from({ length: requiredQuery.limit }, (_, i) => ({
                    id: i + 1,
                    content: "Test",
                    parentId: null,
                    user: { id: i + 1, nickname: `닉네임${i + 1}`, profileImageUrl: null },
                    mentionUser: { id: i + 10, nickname: `닉네임${i + 10}` },
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                }));
                const repliesResponse = { replies: mockReplies, nextCursor: mockReplies[mockReplies.length - 1].id };

                findRepliesSpy.mockResolvedValue(repliesResponse);

                const result = await commentsController.findReplies(TEST_COMMENT_ID, requiredQuery);

                expect(result).toEqual(repliesResponse);
                expect(findRepliesSpy).toHaveBeenCalledWith(TEST_COMMENT_ID, requiredQuery);
                expect(findRepliesSpy).toHaveBeenCalledTimes(1);
            });

            it("답글 목록을 조회하여 다음 페이지가 없을 때 nextCursor를 null로 반환한다.", async () => {
                const mockReplies = Array.from({ length: requiredQuery.limit - 1 }, (_, i) => ({
                    id: i + 1,
                    content: "Test",
                    parentId: null,
                    user: { id: i + 1, nickname: `닉네임${i + 1}`, profileImageUrl: null },
                    mentionUser: { id: i + 10, nickname: `닉네임${i + 10}` },
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                }));
                const repliesResponse = { replies: mockReplies, nextCursor: null };

                findRepliesSpy.mockResolvedValue(repliesResponse);

                const result = await commentsController.findReplies(TEST_COMMENT_ID, requiredQuery);

                expect(result).toEqual(repliesResponse);
                expect(findRepliesSpy).toHaveBeenCalledWith(TEST_COMMENT_ID, requiredQuery);
                expect(findRepliesSpy).toHaveBeenCalledTimes(1);
            });

            it("답글 목록이 없을 때 빈 배열과 nextCursor를 null로 반환한다.", async () => {
                const repliesResponse = { replies: [], nextCursor: null };

                findRepliesSpy.mockResolvedValue(repliesResponse);

                const result = await commentsController.findReplies(TEST_COMMENT_ID, requiredQuery);

                expect(result).toEqual(repliesResponse);
                expect(findRepliesSpy).toHaveBeenCalledWith(TEST_COMMENT_ID, requiredQuery);
                expect(findRepliesSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("답글 목록 조회 실패", () => {
            it("답글을 조회하려는 댓글 정보가 존재하지 않아서 오류를 반환한다.", async () => {
                findRepliesSpy.mockRejectedValue(new NotFoundException("Parent comment not exists."));

                await expect(commentsController.findReplies(TEST_COMMENT_ID, requiredQuery)).rejects.toThrow(
                    new NotFoundException("Parent comment not exists."),
                );
                expect(findRepliesSpy).toHaveBeenCalledWith(TEST_COMMENT_ID, requiredQuery);
                expect(findRepliesSpy).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("create", () => {
        const createCommentDto = { content: "Test" };

        describe("댓글 생성 성공", () => {
            it("댓글이 정상적으로 생성되어 생성된 댓글을 반환한다.", async () => {
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

                createSpy.mockResolvedValue(mockComment);

                const result = await commentsController.create(TEST_POST_ID, TEST_USER_ID, createCommentDto);

                expect(result).toEqual(mockComment);
                expect(createSpy).toHaveBeenCalledWith(TEST_POST_ID, TEST_USER_ID, createCommentDto);
                expect(createSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("댓글 생성 실패", () => {
            it("댓글을 작성하려는 게시글 정보가 존재하지 않아서 오류를 반환한다.", async () => {
                createSpy.mockRejectedValue(new NotFoundException("Post not exists."));

                await expect(commentsController.create(TEST_POST_ID, TEST_USER_ID, createCommentDto)).rejects.toThrow(
                    new NotFoundException("Post not exists."),
                );
                expect(createSpy).toHaveBeenCalledWith(TEST_POST_ID, TEST_USER_ID, createCommentDto);
                expect(createSpy).toHaveBeenCalledTimes(1);
            });

            it("로그인한 사용자에 대한 사용자 정보가 DB에 존재하지 않아서 오류를 반환한다.", async () => {
                createSpy.mockRejectedValue(new NotFoundException("User not exists."));

                await expect(commentsController.create(TEST_POST_ID, TEST_USER_ID, createCommentDto)).rejects.toThrow(
                    new NotFoundException("User not exists."),
                );
                expect(createSpy).toHaveBeenCalledWith(TEST_POST_ID, TEST_USER_ID, createCommentDto);
                expect(createSpy).toHaveBeenCalledTimes(1);
            });

            it("답글을 다려고 하는 댓글 정보가 DB에 존재하지 않아서 오류를 반환한다.", async () => {
                createSpy.mockRejectedValue(new NotFoundException("Parent comment not exists."));

                await expect(
                    commentsController.create(TEST_POST_ID, TEST_USER_ID, { ...createCommentDto, parentId: 2 }),
                ).rejects.toThrow(new NotFoundException("Parent comment not exists."));
                expect(createSpy).toHaveBeenCalledWith(TEST_POST_ID, TEST_USER_ID, {
                    ...createCommentDto,
                    parentId: 2,
                });
                expect(createSpy).toHaveBeenCalledTimes(1);
            });

            it("답글을 다려고 하는 댓글의 게시글과 현재 답글을 다려는 게시글이 일치하지 않아서 오류를 반환한다.", async () => {
                createSpy.mockRejectedValue(new BadRequestException("Parent comment does not belong to this post."));

                await expect(
                    commentsController.create(TEST_POST_ID, TEST_USER_ID, { ...createCommentDto, parentId: 2 }),
                ).rejects.toThrow(new BadRequestException("Parent comment does not belong to this post."));
                expect(createSpy).toHaveBeenCalledWith(TEST_POST_ID, TEST_USER_ID, {
                    ...createCommentDto,
                    parentId: 2,
                });
                expect(createSpy).toHaveBeenCalledTimes(1);
            });

            it("답글을 다려고 하는 댓글이 이미 지워져서 오류를 반환한다.", async () => {
                createSpy.mockRejectedValue(new BadRequestException("Cannot reply to a deleted parent comment."));

                await expect(
                    commentsController.create(TEST_POST_ID, TEST_USER_ID, { ...createCommentDto, parentId: 2 }),
                ).rejects.toThrow(new BadRequestException("Cannot reply to a deleted parent comment."));
                expect(createSpy).toHaveBeenCalledWith(TEST_POST_ID, TEST_USER_ID, {
                    ...createCommentDto,
                    parentId: 2,
                });
                expect(createSpy).toHaveBeenCalledTimes(1);
            });

            it("멘션하려는 User 정보가 DB에 존재하지 않아서 오류를 반환한다.", async () => {
                createSpy.mockRejectedValue(new NotFoundException("Mention user not exists."));

                await expect(
                    commentsController.create(TEST_POST_ID, TEST_USER_ID, { ...createCommentDto, mentionUserId: 2 }),
                ).rejects.toThrow(new NotFoundException("Mention user not exists."));
                expect(createSpy).toHaveBeenCalledWith(TEST_POST_ID, TEST_USER_ID, {
                    ...createCommentDto,
                    mentionUserId: 2,
                });
                expect(createSpy).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("update", () => {
        const updateCommentDto = { content: "update" };

        describe("댓글 수정 성공", () => {
            it("댓글을 정상적으로 수정하여 수정된 댓글을 반환한다.", async () => {
                const mockUpdateComment = {
                    id: TEST_COMMENT_ID,
                    postId: TEST_POST_ID,
                    userId: TEST_USER_ID,
                    parentId: null,
                    mentionUserId: null,
                    content: updateCommentDto.content,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                };

                updateSpy.mockResolvedValue(mockUpdateComment);

                const result = await commentsController.update(TEST_COMMENT_ID, TEST_USER_ID, updateCommentDto);

                expect(result).toEqual(mockUpdateComment);
                expect(updateSpy).toHaveBeenCalledWith(TEST_COMMENT_ID, TEST_USER_ID, updateCommentDto);
                expect(updateSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("댓글 수정 실패", () => {
            it("수정하려는 댓글이 DB에 존재하지 않아서 오류를 반환한다.", async () => {
                updateSpy.mockRejectedValue(new NotFoundException("Comment not exists."));

                await expect(
                    commentsController.update(TEST_COMMENT_ID, TEST_USER_ID, updateCommentDto),
                ).rejects.toThrow(new NotFoundException("Comment not exists."));
                expect(updateSpy).toHaveBeenCalledWith(TEST_COMMENT_ID, TEST_USER_ID, updateCommentDto);
                expect(updateSpy).toHaveBeenCalledTimes(1);
            });

            it("다른 사용자가 작성한 댓글을 수정하려고 하여 오류를 반환한다.", async () => {
                updateSpy.mockRejectedValue(
                    new ForbiddenException("You do not have permission to update this comment."),
                );

                await expect(
                    commentsController.update(TEST_COMMENT_ID, TEST_USER_ID, updateCommentDto),
                ).rejects.toThrow(new ForbiddenException("You do not have permission to update this comment."));
                expect(updateSpy).toHaveBeenCalledWith(TEST_COMMENT_ID, TEST_USER_ID, updateCommentDto);
                expect(updateSpy).toHaveBeenCalledTimes(1);
            });

            it("이미 삭제된 댓글을 수정하려고 하여 오류를 반환한다.", async () => {
                updateSpy.mockRejectedValue(new BadRequestException("Cannot update a deleted comment."));

                await expect(
                    commentsController.update(TEST_COMMENT_ID, TEST_USER_ID, updateCommentDto),
                ).rejects.toThrow(new BadRequestException("Cannot update a deleted comment."));
                expect(updateSpy).toHaveBeenCalledWith(TEST_COMMENT_ID, TEST_USER_ID, updateCommentDto);
                expect(updateSpy).toHaveBeenCalledTimes(1);
            });
        });
    });
});
