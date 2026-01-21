import { UsersService } from "src/users/users.service";
import { CommentsRepository } from "./comments.repository";
import { CommentsService } from "./comments.service";
import { PostsService } from "src/posts/posts.service";
import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, ForbiddenException, NotFoundException } from "@nestjs/common";
import { CommentGetPayload } from "generated/prisma/models";
import { COMMENT_REPLY_SELECT, COMMENT_SELECT, CommentSelect, MY_COMMENT_SELECT, MyCommentSelect } from "./constants";
import { CommentListItemDto } from "./dtos/responses/comment-list-item.dto";
import { MyCommentListItemDto } from "./dtos/responses/my-comment-list-item.dto";
import { getNextCursor } from "src/common/utils/pagination.util";

describe("CommentsService", () => {
    let commentsService: CommentsService;
    let commentsRepository: CommentsRepository;
    let usersService: UsersService;
    let postsService: PostsService;

    let findManySpy: jest.SpyInstance;
    let findManyAndCountSpy: jest.SpyInstance;
    let findByIdSpy: jest.SpyInstance;
    let createSpy: jest.SpyInstance;
    let updateSpy: jest.SpyInstance;
    let deleteSpy: jest.SpyInstance;

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
                        findMany: jest.fn(),
                        findManyAndCount: jest.fn(),
                        findById: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
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

        findManySpy = jest.spyOn(commentsRepository, "findMany");
        findManyAndCountSpy = jest.spyOn(commentsRepository, "findManyAndCount");
        findByIdSpy = jest.spyOn(commentsRepository, "findById");
        createSpy = jest.spyOn(commentsRepository, "create");
        updateSpy = jest.spyOn(commentsRepository, "update");
        deleteSpy = jest.spyOn(commentsRepository, "delete");

        existsByPostIdSpy = jest.spyOn(postsService, "existsByPostId");

        existsByUserIdSpy = jest.spyOn(usersService, "existsByUserId");
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
                    _count: { replies: 10 },
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                }));
                const commentsResponse = {
                    comments: mockComments.map((comment) => toCommentResponse(comment)),
                    nextCursor: mockComments[mockComments.length - 1].id,
                };

                existsByPostIdSpy.mockResolvedValue(true);
                findManySpy.mockResolvedValue(mockComments);

                const result = await commentsService.findComments(TEST_POST_ID, requiredQuery);

                expect(result).toEqual(commentsResponse);
                expect(existsByPostIdSpy).toHaveBeenCalledWith(TEST_POST_ID);
                expect(existsByPostIdSpy).toHaveBeenCalledTimes(1);
                expect(findManySpy).toHaveBeenCalledWith({
                    take: requiredQuery.limit,
                    skip: undefined,
                    cursor: undefined,
                    where: { postId: TEST_POST_ID, parentId: null },
                    select: COMMENT_SELECT,
                    orderBy: { createdAt: "asc" },
                });
                expect(findManySpy).toHaveBeenCalledTimes(1);
            });

            it("댓글 목록을 조회하여 다음 페이지가 없을 때 nextCursor를 null로 반환한다. (cursor 전달)", async () => {
                const query = { cursor: 10, ...requiredQuery };

                const mockComments = Array.from({ length: requiredQuery.limit - 1 }, (_, i) => ({
                    id: i + 10,
                    content: "Test",
                    parentId: null,
                    user: { id: i + 1, nickname: `닉네임${i + 1}`, profileImageUrl: null },
                    _count: { replies: 10 },
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                }));
                const commentsResponse = {
                    comments: mockComments.map((comment) => toCommentResponse(comment)),
                    nextCursor: null,
                };

                existsByPostIdSpy.mockResolvedValue(true);
                findManySpy.mockResolvedValue(mockComments);

                const result = await commentsService.findComments(TEST_POST_ID, query);

                expect(result).toEqual(commentsResponse);
                expect(existsByPostIdSpy).toHaveBeenCalledWith(TEST_POST_ID);
                expect(existsByPostIdSpy).toHaveBeenCalledTimes(1);
                expect(findManySpy).toHaveBeenCalledWith({
                    take: query.limit,
                    skip: 1,
                    cursor: { id: query.cursor },
                    where: { postId: TEST_POST_ID, parentId: null },
                    select: COMMENT_SELECT,
                    orderBy: { createdAt: "asc" },
                });
                expect(findManySpy).toHaveBeenCalledTimes(1);
            });

            it("댓글 목록이 없을 때 빈 배열과 nextCursor를 null로 반환한다.", async () => {
                existsByPostIdSpy.mockResolvedValue(true);
                findManySpy.mockResolvedValue([]);

                const result = await commentsService.findComments(TEST_POST_ID, requiredQuery);

                expect(result).toEqual({ comments: [], nextCursor: null });
                expect(existsByPostIdSpy).toHaveBeenCalledWith(TEST_POST_ID);
                expect(existsByPostIdSpy).toHaveBeenCalledTimes(1);
                expect(findManySpy).toHaveBeenCalledWith({
                    take: requiredQuery.limit,
                    skip: undefined,
                    cursor: undefined,
                    where: { postId: TEST_POST_ID, parentId: null },
                    select: COMMENT_SELECT,
                    orderBy: { createdAt: "asc" },
                });
                expect(findManySpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("댓글 목록 조회 실패", () => {
            it("댓글을 조회하려는 게시글 정보가 존재하지 않아 오류를 반환한다.", async () => {
                existsByPostIdSpy.mockResolvedValue(false);

                await expect(commentsService.findComments(TEST_POST_ID, requiredQuery)).rejects.toThrow(
                    new NotFoundException("Post not exists."),
                );
                expect(existsByPostIdSpy).toHaveBeenCalledWith(TEST_POST_ID);
                expect(existsByPostIdSpy).toHaveBeenCalledTimes(1);
                expect(findManySpy).not.toHaveBeenCalled();
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

                findByIdSpy.mockResolvedValue({ id: TEST_COMMENT_ID });
                findManySpy.mockResolvedValue(mockReplies);

                const result = await commentsService.findReplies(TEST_COMMENT_ID, requiredQuery);

                expect(result).toEqual(repliesResponse);
                expect(findByIdSpy).toHaveBeenCalledWith(TEST_COMMENT_ID, { id: true });
                expect(findByIdSpy).toHaveBeenCalledTimes(1);
                expect(findManySpy).toHaveBeenCalledWith({
                    take: requiredQuery.limit,
                    skip: undefined,
                    cursor: undefined,
                    where: { parentId: TEST_COMMENT_ID },
                    select: COMMENT_REPLY_SELECT,
                    orderBy: { createdAt: "asc" },
                });
                expect(findManySpy).toHaveBeenCalledTimes(1);
            });

            it("답글 목록을 조회하여 다음 페이지가 없을 때 nextCursor를 null로 반환한다. (cursor 전달)", async () => {
                const query = { cursor: 10, ...requiredQuery };

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

                findByIdSpy.mockResolvedValue({ id: TEST_COMMENT_ID });
                findManySpy.mockResolvedValue(mockReplies);

                const result = await commentsService.findReplies(TEST_COMMENT_ID, query);

                expect(result).toEqual(repliesResponse);
                expect(findByIdSpy).toHaveBeenCalledWith(TEST_COMMENT_ID, { id: true });
                expect(findByIdSpy).toHaveBeenCalledTimes(1);
                expect(findManySpy).toHaveBeenCalledWith({
                    take: query.limit,
                    skip: 1,
                    cursor: { id: query.cursor },
                    where: { parentId: TEST_COMMENT_ID },
                    select: COMMENT_REPLY_SELECT,
                    orderBy: { createdAt: "asc" },
                });
                expect(findManySpy).toHaveBeenCalledTimes(1);
            });

            it("답글 목록이 없을 때 빈 배열과 nextCursor를 null로 반환한다.", async () => {
                findByIdSpy.mockResolvedValue({ id: TEST_COMMENT_ID });
                findManySpy.mockResolvedValue([]);

                const result = await commentsService.findReplies(TEST_COMMENT_ID, requiredQuery);

                expect(result).toEqual({ replies: [], nextCursor: null });
                expect(findByIdSpy).toHaveBeenCalledWith(TEST_COMMENT_ID, { id: true });
                expect(findByIdSpy).toHaveBeenCalledTimes(1);
                expect(findManySpy).toHaveBeenCalledWith({
                    take: requiredQuery.limit,
                    skip: undefined,
                    cursor: undefined,
                    where: { parentId: TEST_COMMENT_ID },
                    select: COMMENT_REPLY_SELECT,
                    orderBy: { createdAt: "asc" },
                });
                expect(findManySpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("답글 목록 조회 실패", () => {
            it("답글을 조회하려는 댓글 정보가 존재하지 않아서 오류를 반환한다.", async () => {
                findByIdSpy.mockResolvedValue(null);

                await expect(commentsService.findReplies(TEST_COMMENT_ID, requiredQuery)).rejects.toThrow(
                    new NotFoundException("Parent comment not exists."),
                );
                expect(findByIdSpy).toHaveBeenCalledWith(TEST_COMMENT_ID, { id: true });
                expect(findByIdSpy).toHaveBeenCalledTimes(1);
                expect(findManySpy).not.toHaveBeenCalled();
            });
        });
    });

    describe("findMyComments", () => {
        const requiredQuery = { limit: 10 };

        it("cursor를 전달하여 내가 작성한 댓글 목록을 반환한다.", async () => {
            const query = { cursor: 10, ...requiredQuery };
            const mockComments = Array.from({ length: requiredQuery.limit }, (_, i) => ({
                id: i + 10,
                content: "댓글입니다.",
                post: {
                    id: 1,
                    title: "게시글 제목",
                    _count: { comments: 5 },
                },
                createdAt: new Date(),
                updatedAt: new Date(),
            }));

            findManyAndCountSpy.mockResolvedValue({ comments: mockComments, totalCount: 20 });

            const result = await commentsService.findMyComments(TEST_USER_ID, query);

            expect(result).toEqual({
                comments: mockComments.map((comment) => toMyCommentListItem(comment)),
                nextCursor: getNextCursor(mockComments, query.limit),
                totalCommentCount: 20,
            });
            expect(findManyAndCountSpy).toHaveBeenCalledWith({
                take: query.limit,
                skip: 1,
                cursor: { id: query.cursor },
                where: { userId: TEST_USER_ID, deletedAt: null },
                select: MY_COMMENT_SELECT,
                orderBy: { createdAt: "desc" },
            });
            expect(findManyAndCountSpy).toHaveBeenCalledTimes(1);
        });

        it("내가 작성한 댓글 목록을 반환하고, 더이상 다음 페이지가 없어서 nextCursor를 null로 반환한다.", async () => {
            const query = { cursor: 10, ...requiredQuery };
            const mockComments = Array.from({ length: requiredQuery.limit - 1 }, (_, i) => ({
                id: i + 10,
                content: "댓글입니다.",
                post: {
                    id: 1,
                    title: "게시글 제목",
                    _count: { comments: 5 },
                },
                createdAt: new Date(),
                updatedAt: new Date(),
            }));

            findManyAndCountSpy.mockResolvedValue({ comments: mockComments, totalCount: 20 });

            const result = await commentsService.findMyComments(TEST_USER_ID, query);

            expect(result).toEqual({
                comments: mockComments.map((comment) => toMyCommentListItem(comment)),
                nextCursor: null,
                totalCommentCount: 20,
            });
            expect(findManyAndCountSpy).toHaveBeenCalledWith({
                take: query.limit,
                skip: 1,
                cursor: { id: query.cursor },
                where: { userId: TEST_USER_ID, deletedAt: null },
                select: MY_COMMENT_SELECT,
                orderBy: { createdAt: "desc" },
            });
            expect(findManyAndCountSpy).toHaveBeenCalledTimes(1);
        });

        it("내가 작성한 댓글 목록이 없어서 빈 배열과 nextCursor를 null로 반환한다.", async () => {
            findManyAndCountSpy.mockResolvedValue({ comments: [], totalCount: 0 });

            const result = await commentsService.findMyComments(TEST_USER_ID, requiredQuery);

            expect(result).toEqual({ comments: [], nextCursor: null, totalCommentCount: 0 });
            expect(findManyAndCountSpy).toHaveBeenCalledWith({
                take: requiredQuery.limit,
                skip: undefined,
                cursor: undefined,
                where: { userId: TEST_USER_ID, deletedAt: null },
                select: MY_COMMENT_SELECT,
                orderBy: { createdAt: "desc" },
            });
            expect(findManyAndCountSpy).toHaveBeenCalledTimes(1);
        });
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
                    new BadRequestException("Parent comment does not belong to this post."),
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

                findByIdSpy.mockResolvedValue({ id: TEST_COMMENT_ID, userId: TEST_USER_ID, deletedAt: null });
                updateSpy.mockResolvedValue(mockUpdateComment);

                const result = await commentsService.update(TEST_COMMENT_ID, TEST_USER_ID, updateCommentDto);

                expect(result).toEqual(mockUpdateComment);
                expect(findByIdSpy).toHaveBeenCalledWith(TEST_COMMENT_ID, { id: true, userId: true, deletedAt: true });
                expect(findByIdSpy).toHaveBeenCalledTimes(1);
                expect(updateSpy).toHaveBeenCalledWith(TEST_COMMENT_ID, updateCommentDto);
                expect(updateSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("댓글 수정 실패", () => {
            it("수정하려는 댓글이 DB에 존재하지 않아서 오류를 반환한다.", async () => {
                findByIdSpy.mockResolvedValue(null);

                await expect(commentsService.update(TEST_COMMENT_ID, TEST_USER_ID, updateCommentDto)).rejects.toThrow(
                    new NotFoundException("Comment not exists."),
                );
                expect(findByIdSpy).toHaveBeenCalledWith(TEST_COMMENT_ID, { id: true, userId: true, deletedAt: true });
                expect(findByIdSpy).toHaveBeenCalledTimes(1);
                expect(updateSpy).not.toHaveBeenCalled();
            });

            it("다른 사용자가 작성한 댓글을 수정하려고 하여 오류를 반환한다.", async () => {
                findByIdSpy.mockResolvedValue({ id: TEST_COMMENT_ID, userId: 2, deletedAt: null });

                await expect(commentsService.update(TEST_COMMENT_ID, TEST_USER_ID, updateCommentDto)).rejects.toThrow(
                    new ForbiddenException("You do not have permission to update this comment."),
                );
                expect(findByIdSpy).toHaveBeenCalledWith(TEST_COMMENT_ID, { id: true, userId: true, deletedAt: true });
                expect(findByIdSpy).toHaveBeenCalledTimes(1);
                expect(updateSpy).not.toHaveBeenCalled();
            });

            it("이미 삭제된 댓글을 수정하려고 하여 오류를 반환한다.", async () => {
                findByIdSpy.mockResolvedValue({ id: TEST_COMMENT_ID, userId: TEST_USER_ID, deletedAt: new Date() });

                await expect(commentsService.update(TEST_COMMENT_ID, TEST_USER_ID, updateCommentDto)).rejects.toThrow(
                    new BadRequestException("Cannot update a deleted comment."),
                );
                expect(findByIdSpy).toHaveBeenCalledWith(TEST_COMMENT_ID, { id: true, userId: true, deletedAt: true });
                expect(findByIdSpy).toHaveBeenCalledTimes(1);
                expect(updateSpy).not.toHaveBeenCalled();
            });
        });
    });

    describe("remove", () => {
        describe("댓글 삭제 성공", () => {
            it("댓글 삭제에 성공한다.", async () => {
                findByIdSpy.mockResolvedValue({ id: TEST_COMMENT_ID, userId: TEST_USER_ID, deletedAt: null });
                deleteSpy.mockResolvedValue({ id: TEST_COMMENT_ID });

                const result = await commentsService.remove(TEST_COMMENT_ID, TEST_USER_ID);

                expect(result).toBeUndefined();
                expect(findByIdSpy).toHaveBeenCalledWith(TEST_COMMENT_ID, { id: true, userId: true, deletedAt: true });
                expect(findByIdSpy).toHaveBeenCalledTimes(1);
                expect(deleteSpy).toHaveBeenCalledWith(TEST_COMMENT_ID);
                expect(deleteSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("댓글 삭제 실패", () => {
            it("삭제하려는 댓글이 DB에 존재하지 않아서 오류를 반환한다.", async () => {
                findByIdSpy.mockResolvedValue(null);

                await expect(commentsService.remove(TEST_COMMENT_ID, TEST_USER_ID)).rejects.toThrow(
                    new NotFoundException("Comment not exists."),
                );
                expect(findByIdSpy).toHaveBeenCalledWith(TEST_COMMENT_ID, { id: true, userId: true, deletedAt: true });
                expect(findByIdSpy).toHaveBeenCalledTimes(1);
                expect(deleteSpy).not.toHaveBeenCalled();
            });

            it("다른 사용자가 작성한 댓글을 삭제하려고 하여 오류를 반환한다.", async () => {
                findByIdSpy.mockResolvedValue({ id: TEST_COMMENT_ID, userId: 2, deletedAt: null });

                await expect(commentsService.remove(TEST_COMMENT_ID, TEST_USER_ID)).rejects.toThrow(
                    new ForbiddenException("You do not have permission to delete this comment."),
                );
                expect(findByIdSpy).toHaveBeenCalledWith(TEST_COMMENT_ID, { id: true, userId: true, deletedAt: true });
                expect(findByIdSpy).toHaveBeenCalledTimes(1);
                expect(deleteSpy).not.toHaveBeenCalled();
            });

            it("이미 삭제된 댓글을 삭제하려고 하여 오류를 반환한다.", async () => {
                findByIdSpy.mockResolvedValue({ id: TEST_COMMENT_ID, userId: TEST_USER_ID, deletedAt: new Date() });

                await expect(commentsService.remove(TEST_COMMENT_ID, TEST_USER_ID)).rejects.toThrow(
                    new BadRequestException("Comment already deleted."),
                );
                expect(findByIdSpy).toHaveBeenCalledWith(TEST_COMMENT_ID, { id: true, userId: true, deletedAt: true });
                expect(findByIdSpy).toHaveBeenCalledTimes(1);
                expect(deleteSpy).not.toHaveBeenCalled();
            });
        });
    });
});

// Note: 추후 해당 함수가 변경되면 테스트 코드도 변경 필요
function toCommentResponse(comment: CommentGetPayload<{ select: CommentSelect }>): CommentListItemDto {
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

function toMyCommentListItem(comment: CommentGetPayload<{ select: MyCommentSelect }>): MyCommentListItemDto {
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
