import { Test, TestingModule } from "@nestjs/testing";
import { PostsRepository } from "./posts.repository";
import { PostsService } from "./posts.service";
import { UsersService } from "src/users/users.service";
import { CategoriesService } from "src/categories/categories.service";
import { NotFoundException } from "@nestjs/common";
import { FindPostListQueryDto } from "./dtos/requests/find-post-list-query.dto";
import { PostOrderBy } from "./posts.enums";

jest.mock("@nestjs-cls/transactional", () => ({
    Transactional: () => (_: any, __: string, descriptor: PropertyDescriptor) => {
        return descriptor;
    },
}));

describe("PostsService", () => {
    let postsService: PostsService;
    let postsRepository: PostsRepository;
    let categoriesService: CategoriesService;
    let usersService: UsersService;

    let existsByUserIdSpy: jest.SpyInstance;
    let existsByCategoryIdSpy: jest.SpyInstance;

    let findManySpy: jest.SpyInstance;
    let findByIdSpy: jest.SpyInstance;
    let createSpy: jest.SpyInstance;
    let updateViewCountSpy: jest.SpyInstance;

    const TEST_POST_ID = 1;
    const TEST_USER_ID = 1;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                PostsService,
                {
                    provide: PostsRepository,
                    useValue: {
                        findMany: jest.fn(),
                        findById: jest.fn(),
                        create: jest.fn(),
                        updateViewCount: jest.fn(),
                    },
                },
                {
                    provide: CategoriesService,
                    useValue: {
                        existsByCategoryId: jest.fn(),
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

        postsService = moduleRef.get(PostsService);
        postsRepository = moduleRef.get(PostsRepository);
        categoriesService = moduleRef.get(CategoriesService);
        usersService = moduleRef.get(UsersService);

        existsByUserIdSpy = jest.spyOn(usersService, "existsByUserId");
        existsByCategoryIdSpy = jest.spyOn(categoriesService, "existsByCategoryId");

        findManySpy = jest.spyOn(postsRepository, "findMany");
        findByIdSpy = jest.spyOn(postsRepository, "findById");
        createSpy = jest.spyOn(postsRepository, "create");
        updateViewCountSpy = jest.spyOn(postsRepository, "updateViewCount");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("findMany", () => {
        const selectInput = {
            id: true,
            title: true,
            viewCount: true,
            createdAt: true,
            updatedAt: true,
            user: {
                select: { id: true, nickname: true },
            },
            category: {
                select: { id: true, name: true },
            },
        };
        const requiredQuery: FindPostListQueryDto = { limit: 10, orderBy: PostOrderBy.CREATED_AT };

        describe("Pagination", () => {
            it("조회 결과가 없을 때 빈 배열과 nextCursor: null를 반환한다.", async () => {
                findManySpy.mockResolvedValue([]);

                const result = await postsService.findMany(requiredQuery);

                expect(result).toEqual({ posts: [], nextCursor: null });
                expect(findManySpy).toHaveBeenCalledWith({
                    take: requiredQuery.limit,
                    skip: undefined,
                    cursor: undefined,
                    select: selectInput,
                    where: {},
                    orderBy: { createdAt: "desc" },
                });
            });

            it("limit만 전달하여 게시글 목록을 조회한다.", async () => {
                const mockPost = Array.from({ length: requiredQuery.limit }, (_, i) => ({
                    id: i + 1,
                    title: "게시글 제목",
                    viewCount: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    user: {
                        id: i + 1,
                        nickname: `닉네임${i + 1}`,
                    },
                    category: {
                        id: i + 1,
                        name: `카테고리${i + 1}`,
                    },
                }));

                findManySpy.mockResolvedValue(mockPost);

                const result = await postsService.findMany(requiredQuery);

                expect(result).toEqual({ posts: mockPost, nextCursor: mockPost[mockPost.length - 1].id });
                expect(findManySpy).toHaveBeenCalledWith({
                    take: requiredQuery.limit,
                    skip: undefined,
                    cursor: undefined,
                    select: selectInput,
                    where: {},
                    orderBy: { createdAt: "desc" },
                });
                expect(findManySpy).toHaveBeenCalledTimes(1);
            });

            it("cursor와 limit만 전달하여 게시글 목록을 조회한다.", async () => {
                // 이전 페이지의 마지막 postId가 10이라고 가정
                const query = { ...requiredQuery, cursor: 10 };
                const mockPost = Array.from({ length: query.limit }, (_, i) => ({
                    id: i + 10,
                    title: "게시글 제목",
                    viewCount: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    user: {
                        id: i + 1,
                        nickname: `닉네임${i + 1}`,
                    },
                    category: {
                        id: i + 1,
                        name: `카테고리${i + 1}`,
                    },
                }));

                findManySpy.mockResolvedValue(mockPost);

                const result = await postsService.findMany(query);

                expect(result).toEqual({ posts: mockPost, nextCursor: mockPost[mockPost.length - 1].id });
                expect(findManySpy).toHaveBeenCalledWith({
                    take: query.limit,
                    // cursor가 있으므로 skip와 cursor를 정의
                    skip: 1,
                    cursor: { id: query.cursor },
                    select: selectInput,
                    where: {},
                    orderBy: { createdAt: "desc" },
                });
                expect(findManySpy).toHaveBeenCalledTimes(1);
            });

            it("cursor와 limit만 전달하여 게시글 목록을 조회하고 마지막 페이지일 때 nextCursor가 null로 반환된다.", async () => {
                // 이전 페이지의 마지막 postId가 10이라고 가정
                const query = { ...requiredQuery, cursor: 10 };
                const mockPost = [
                    {
                        id: 11,
                        title: "게시글 제목",
                        viewCount: 0,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        user: {
                            id: 1,
                            nickname: "닉네임1",
                        },
                        category: {
                            id: 1,
                            name: "카테고리1",
                        },
                    },
                ];

                findManySpy.mockResolvedValue(mockPost);

                const result = await postsService.findMany(query);

                expect(result).toEqual({ posts: mockPost, nextCursor: null });
                expect(findManySpy).toHaveBeenCalledWith({
                    take: query.limit,
                    // cursor가 있으므로 skip와 cursor를 정의
                    skip: 1,
                    cursor: { id: query.cursor },
                    select: selectInput,
                    where: {},
                    orderBy: { createdAt: "desc" },
                });
                expect(findManySpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("Filtering", () => {
            it("categoryId를 전달하여 특정 카테고리의 게시글 목록을 조회한다.", async () => {
                const query = { ...requiredQuery, categoryId: 2 };
                const mockPost = Array.from({ length: requiredQuery.limit - 1 }, (_, i) => ({
                    id: i + 1,
                    title: "게시글 제목",
                    viewCount: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    user: {
                        id: i + 1,
                        nickname: `닉네임${i + 1}`,
                    },
                    category: {
                        id: 2,
                        name: "카테고리2",
                    },
                }));

                findManySpy.mockResolvedValue(mockPost);

                const result = await postsService.findMany(query);

                expect(result).toEqual({ posts: mockPost, nextCursor: null });
                expect(findManySpy).toHaveBeenCalledWith({
                    take: query.limit,
                    skip: undefined,
                    cursor: undefined,
                    select: selectInput,
                    where: {
                        categoryId: query.categoryId,
                    },
                    orderBy: { createdAt: "desc" },
                });
                expect(findManySpy).toHaveBeenCalledTimes(1);
            });

            it("categoryId와 cursor를 전달하여 특정 카테고리의 다음 게시글 목록을 조회한다.", async () => {
                const query = { ...requiredQuery, categoryId: 2, cursor: 10 };
                const mockPost = Array.from({ length: requiredQuery.limit - 1 }, (_, i) => ({
                    id: i + 10,
                    title: "게시글 제목",
                    viewCount: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    user: {
                        id: i + 1,
                        nickname: `닉네임${i + 1}`,
                    },
                    category: {
                        id: 2,
                        name: "카테고리2",
                    },
                }));

                findManySpy.mockResolvedValue(mockPost);

                const result = await postsService.findMany(query);

                expect(result).toEqual({ posts: mockPost, nextCursor: null });
                expect(findManySpy).toHaveBeenCalledWith({
                    take: query.limit,
                    skip: 1,
                    cursor: { id: query.cursor },
                    select: selectInput,
                    where: {
                        categoryId: query.categoryId,
                    },
                    orderBy: { createdAt: "desc" },
                });
                expect(findManySpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("Searching", () => {
            it("keyword를 전달하여 제목 또는 내용에 검색어가 포함된 게시글 목록을 조회한다.", async () => {
                const query = { ...requiredQuery, keyword: "제목" };
                const mockPost = Array.from({ length: requiredQuery.limit - 1 }, (_, i) => ({
                    id: i + 1,
                    title: "게시글 제목",
                    viewCount: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    user: {
                        id: i + 1,
                        nickname: `닉네임${i + 1}`,
                    },
                    category: {
                        id: i + 1,
                        name: `카테고리${i + 1}`,
                    },
                }));

                findManySpy.mockResolvedValue(mockPost);

                const result = await postsService.findMany(query);

                expect(result).toEqual({ posts: mockPost, nextCursor: null });
                expect(findManySpy).toHaveBeenCalledWith({
                    take: query.limit,
                    skip: undefined,
                    cursor: undefined,
                    select: selectInput,
                    where: {
                        OR: [{ title: { contains: query.keyword } }, { content: { contains: query.keyword } }],
                    },
                    orderBy: { createdAt: "desc" },
                });
                expect(findManySpy).toHaveBeenCalledTimes(1);
            });

            it("keyword와 categoryId를 전달하여 특정 카테고리 내 제목 또는 내용에 검색어가 포함된 게시글 목록을 조회한다.", async () => {
                const query = { ...requiredQuery, keyword: "제목", categoryId: 1 };
                const mockPost = Array.from({ length: requiredQuery.limit - 1 }, (_, i) => ({
                    id: i + 1,
                    title: "게시글 제목",
                    viewCount: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    user: {
                        id: i + 1,
                        nickname: `닉네임${i + 1}`,
                    },
                    category: {
                        id: 1,
                        name: "카테고리1",
                    },
                }));

                findManySpy.mockResolvedValue(mockPost);

                const result = await postsService.findMany(query);

                expect(result).toEqual({ posts: mockPost, nextCursor: null });
                expect(findManySpy).toHaveBeenCalledWith({
                    take: query.limit,
                    skip: undefined,
                    cursor: undefined,
                    select: selectInput,
                    where: {
                        categoryId: query.categoryId,
                        OR: [{ title: { contains: query.keyword } }, { content: { contains: query.keyword } }],
                    },
                    orderBy: { createdAt: "desc" },
                });
                expect(findManySpy).toHaveBeenCalledTimes(1);
            });

            it("keyword와 categoryId와 cursor를 전달하여 특정 카테고리 내 제목 또는 내용에 검색어가 포함된 다음 게시글 목록을 조회한다.", async () => {
                const query = { ...requiredQuery, keyword: "제목", categoryId: 1, cursor: 10 };
                const mockPost = Array.from({ length: requiredQuery.limit - 1 }, (_, i) => ({
                    id: i + 10,
                    title: "게시글 제목",
                    viewCount: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    user: {
                        id: i + 1,
                        nickname: `닉네임${i + 1}`,
                    },
                    category: {
                        id: 1,
                        name: "카테고리1",
                    },
                }));

                findManySpy.mockResolvedValue(mockPost);

                const result = await postsService.findMany(query);

                expect(result).toEqual({ posts: mockPost, nextCursor: null });
                expect(findManySpy).toHaveBeenCalledWith({
                    take: query.limit,
                    skip: 1,
                    cursor: { id: query.cursor },
                    select: selectInput,
                    where: {
                        categoryId: query.categoryId,
                        OR: [{ title: { contains: query.keyword } }, { content: { contains: query.keyword } }],
                    },
                    orderBy: { createdAt: "desc" },
                });
                expect(findManySpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("Sorting", () => {
            it("orderBy를 viewCount로 전달하여 조회순으로 정렬된 게시글 목록을 조회한다.", async () => {
                const query = { ...requiredQuery, orderBy: PostOrderBy.VIEW_COUNT };
                const mockPost = Array.from({ length: requiredQuery.limit - 1 }, (_, i) => ({
                    id: i + 1,
                    title: "게시글 제목",
                    viewCount: i + 10,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    user: {
                        id: i + 1,
                        nickname: `닉네임${i + 1}`,
                    },
                    category: {
                        id: i + 1,
                        name: `카테고리${i + 1}`,
                    },
                })).reverse();

                findManySpy.mockResolvedValue(mockPost);

                const result = await postsService.findMany(query);

                expect(result).toEqual({ posts: mockPost, nextCursor: null });
                expect(findManySpy).toHaveBeenCalledWith({
                    take: query.limit,
                    skip: undefined,
                    cursor: undefined,
                    select: selectInput,
                    where: {},
                    orderBy: [{ viewCount: "desc" }, { createdAt: "desc" }],
                });
                expect(findManySpy).toHaveBeenCalledTimes(1);
            });

            // TODO: 게시글 좋아요 기능 추가 시 좋아요순 정렬에 대한 테스트 코드 작성 필요
        });
    });

    describe("findById", () => {
        const selectInput = {
            id: true,
            title: true,
            content: true,
            viewCount: true,
            createdAt: true,
            updatedAt: true,
            user: {
                select: { id: true, nickname: true, profileImageUrl: true },
            },
            category: {
                select: { id: true, name: true },
            },
        };

        it("게시글 상세 조회에 성공하여 게시글을 반환한다.", async () => {
            const post = {
                id: TEST_POST_ID,
                title: "게시글 제목",
                content: "게시글 내용",
                viewCount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                user: {
                    id: TEST_USER_ID,
                    nickname: "Tester",
                    profileImageUrl: "http://test.com",
                },
                category: {
                    id: 1,
                    name: "건강·상담·병원",
                },
            };
            const updatedViewCount = post.viewCount + 1;

            findByIdSpy.mockResolvedValue(post);
            updateViewCountSpy.mockResolvedValue({ viewCount: updatedViewCount });

            const result = await postsService.findById(TEST_POST_ID);

            expect(result).toEqual({ ...post, viewCount: updatedViewCount });
            expect(findByIdSpy).toHaveBeenCalledWith(TEST_POST_ID, selectInput);
            expect(findByIdSpy).toHaveBeenCalledTimes(1);
            expect(updateViewCountSpy).toHaveBeenCalledWith(TEST_POST_ID, { viewCount: true });
            expect(updateViewCountSpy).toHaveBeenCalledTimes(1);
        });

        it("조회하려는 id에 대한 게시글을 찾지 못하여 오류를 반환한다.", async () => {
            findByIdSpy.mockResolvedValue(null);

            await expect(postsService.findById(TEST_POST_ID)).rejects.toThrow(
                new NotFoundException("Post not exists."),
            );
            expect(findByIdSpy).toHaveBeenCalledWith(TEST_POST_ID, selectInput);
            expect(findByIdSpy).toHaveBeenCalledTimes(1);
            expect(updateViewCountSpy).not.toHaveBeenCalled();
        });
    });

    describe("create", () => {
        const createPostDto = {
            categoryId: 1,
            title: "강아지가 이상해요.",
            content: "어제부터 자꾸 하얀 거품 토를 하는데요..",
        };

        describe("게시글 생성 성공", () => {
            it("게시글을 생성하여 생성된 게시글 정보를 반환한다.", async () => {
                const mockPost = {
                    id: 1,
                    userId: TEST_USER_ID,
                    ...createPostDto,
                    viewCount: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                existsByUserIdSpy.mockResolvedValue(true);
                existsByCategoryIdSpy.mockResolvedValue(true);
                createSpy.mockResolvedValue(mockPost);

                const result = await postsService.create(TEST_USER_ID, createPostDto);

                expect(result).toEqual(mockPost);
                expect(existsByUserIdSpy).toHaveBeenCalledWith(TEST_USER_ID);
                expect(existsByUserIdSpy).toHaveBeenCalledTimes(1);
                expect(existsByCategoryIdSpy).toHaveBeenCalledWith(createPostDto.categoryId);
                expect(existsByCategoryIdSpy).toHaveBeenCalledTimes(1);
                expect(createSpy).toHaveBeenCalledWith(TEST_USER_ID, createPostDto);
                expect(createSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("게시글 생성 실패", () => {
            it("로그인한 유저에 대한 정보를 DB에서 찾지 못하여 오류를 반환한다.", async () => {
                existsByUserIdSpy.mockResolvedValue(false);

                await expect(postsService.create(TEST_USER_ID, createPostDto)).rejects.toThrow(
                    new NotFoundException("User not exists."),
                );
                expect(existsByUserIdSpy).toHaveBeenCalledWith(TEST_USER_ID);
                expect(existsByUserIdSpy).toHaveBeenCalledTimes(1);
                expect(existsByCategoryIdSpy).not.toHaveBeenCalled();
                expect(createSpy).not.toHaveBeenCalled();
            });

            it("생성하려는 카테고리 id에 대한 카테고리 정보를 DB에서 찾지 못하여 오류를 반환한다.", async () => {
                existsByUserIdSpy.mockResolvedValue(true);
                existsByCategoryIdSpy.mockResolvedValue(false);

                await expect(postsService.create(TEST_USER_ID, createPostDto)).rejects.toThrow(
                    new NotFoundException("Category not exists."),
                );
                expect(existsByUserIdSpy).toHaveBeenCalledWith(TEST_USER_ID);
                expect(existsByUserIdSpy).toHaveBeenCalledTimes(1);
                expect(existsByCategoryIdSpy).toHaveBeenCalledWith(createPostDto.categoryId);
                expect(existsByCategoryIdSpy).toHaveBeenCalledTimes(1);
                expect(createSpy).not.toHaveBeenCalled();
            });
        });
    });
});
