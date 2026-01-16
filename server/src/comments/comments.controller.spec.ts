import { Test, TestingModule } from "@nestjs/testing";
import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.service";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe("CommentsController", () => {
    let commentsController: CommentsController;
    let commentsService: CommentsService;

    let createSpy: jest.SpyInstance;

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
                        create: jest.fn(),
                    },
                },
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        commentsController = moduleRef.get(CommentsController);
        commentsService = moduleRef.get(CommentsService);

        createSpy = jest.spyOn(commentsService, "create");
    });

    afterEach(() => {
        jest.clearAllMocks();
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
                createSpy.mockRejectedValue(new NotFoundException("Parent comment does not belong to this post."));

                await expect(
                    commentsController.create(TEST_POST_ID, TEST_USER_ID, { ...createCommentDto, parentId: 2 }),
                ).rejects.toThrow(new NotFoundException("Parent comment does not belong to this post."));
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
});
