import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { AuthGuard } from "@/auth/guards/auth.guard";

import { FindPostListQueryDto } from "./dtos/requests/find-post-list-query.dto";
import { PostsController } from "./posts.controller";
import { PostOrderBy } from "./posts.enums";
import { PostsService } from "./posts.service";

describe("PostsController", () => {
    let postsController: PostsController;
    let postsService: PostsService;

    let findManySpy: jest.SpyInstance;
    let findMyPostsSpy: jest.SpyInstance;
    let findByIdSpy: jest.SpyInstance;
    let createSpy: jest.SpyInstance;
    let updateSpy: jest.SpyInstance;
    let removeSpy: jest.SpyInstance;

    const TEST_POST_ID = 1;
    const TEST_USER_ID = 1;
    const TEST_CATEGORY_ID = 1;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [PostsController],
            providers: [
                {
                    provide: PostsService,
                    useValue: {
                        findMany: jest.fn(),
                        findMyPosts: jest.fn(),
                        findById: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                    },
                },
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        postsController = moduleRef.get(PostsController);
        postsService = moduleRef.get(PostsService);

        findManySpy = jest.spyOn(postsService, "findMany");
        findMyPostsSpy = jest.spyOn(postsService, "findMyPosts");
        findByIdSpy = jest.spyOn(postsService, "findById");
        createSpy = jest.spyOn(postsService, "create");
        updateSpy = jest.spyOn(postsService, "update");
        removeSpy = jest.spyOn(postsService, "remove");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("findMany", () => {
        const requiredQuery: FindPostListQueryDto = { limit: 10, orderBy: PostOrderBy.CREATED_AT, keyword: "제목" };

        it("게시글 목록을 조회하여 다음 페이지가 존재할 때 nextCursor를 반환한다.", async () => {
            const mockPosts = Array.from({ length: requiredQuery.limit }, (_, i) => ({
                id: i + 1,
                title: "게시글 제목",
                viewCount: 0,
                commentCount: 5,
                createdAt: new Date(),
                updatedAt: new Date(),
                user: {
                    id: i + 1,
                    nickname: `닉네임${i + 1}`,
                    profileImageUrl: null,
                },
                category: {
                    id: i + 1,
                    name: `카테고리${i + 1}`,
                },
            }));
            const postListResponse = {
                posts: mockPosts,
                totalPostCount: 20,
                nextCursor: mockPosts[mockPosts.length - 1].id,
            };

            findManySpy.mockResolvedValue(postListResponse);

            const result = await postsController.findMany(requiredQuery);

            expect(result).toEqual(postListResponse);
            expect(findManySpy).toHaveBeenCalledWith(requiredQuery);
            expect(findManySpy).toHaveBeenCalledTimes(1);
        });

        it("게시글 목록을 조회하여 다음 페이지가 없을 때 nextCursor를 null로 반환한다.", async () => {
            const mockPosts = Array.from({ length: requiredQuery.limit - 1 }, (_, i) => ({
                id: i + 1,
                title: "게시글 제목",
                viewCount: 0,
                commentCount: 5,
                createdAt: new Date(),
                updatedAt: new Date(),
                user: {
                    id: i + 1,
                    nickname: `닉네임${i + 1}`,
                    profileImageUrl: null,
                },
                category: {
                    id: i + 1,
                    name: `카테고리${i + 1}`,
                },
            }));
            const postListResponse = { posts: mockPosts, totalPostCount: 9, nextCursor: null };

            findManySpy.mockResolvedValue(postListResponse);

            const result = await postsController.findMany(requiredQuery);

            expect(result).toEqual(postListResponse);
            expect(findManySpy).toHaveBeenCalledWith(requiredQuery);
            expect(findManySpy).toHaveBeenCalledTimes(1);
        });

        it("게시글 목록이 없을 때 빈 배열과 nextCursor를 null로 반환한다.", async () => {
            const postListResponse = { posts: [], totalPostCount: 0, nextCursor: null };

            findManySpy.mockResolvedValue(postListResponse);

            const result = await postsController.findMany(requiredQuery);

            expect(result).toEqual(postListResponse);
            expect(findManySpy).toHaveBeenCalledWith(requiredQuery);
            expect(findManySpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("findMyPosts", () => {
        const requiredQuery = { limit: 10 };

        it("내가 작성한 게시글을 반환한다.", async () => {
            const mockPosts = Array.from({ length: requiredQuery.limit }, (_, i) => ({
                id: i + 1,
                title: "게시글 제목",
                viewCount: 0,
                commentCount: 5,
                createdAt: new Date(),
                updatedAt: new Date(),
                user: {
                    id: TEST_USER_ID,
                    nickname: "Tester",
                    profileImageUrl: null,
                },
                category: {
                    id: i + 1,
                    name: `카테고리${i + 1}`,
                },
            }));
            const postListResponse = {
                posts: mockPosts,
                nextCursor: mockPosts[mockPosts.length - 1].id,
                totalPostCount: 20,
            };

            findMyPostsSpy.mockResolvedValue(postListResponse);

            const result = await postsController.findMyPosts(TEST_USER_ID, requiredQuery);

            expect(result).toEqual(postListResponse);
            expect(findMyPostsSpy).toHaveBeenCalledWith(TEST_USER_ID, requiredQuery);
            expect(findMyPostsSpy).toHaveBeenCalledTimes(1);
        });

        it("내가 작성한 게시글이 없어서 빈 배열과 nextCursor를 null로 반환한다.", async () => {
            const postListResponse = { posts: [], nextCursor: null, totalPostCount: 0 };

            findMyPostsSpy.mockResolvedValue(postListResponse);

            const result = await postsController.findMyPosts(TEST_USER_ID, requiredQuery);

            expect(result).toEqual(postListResponse);
            expect(findMyPostsSpy).toHaveBeenCalledWith(TEST_USER_ID, requiredQuery);
            expect(findMyPostsSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("findById", () => {
        it("게시글 상세 조회에 성공하여 게시글을 반환한다.", async () => {
            const post = {
                id: 1,
                title: "게시글 제목",
                content: "게시글 내용",
                viewCount: 1,
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

            findByIdSpy.mockResolvedValue(post);

            const result = await postsController.findById(TEST_POST_ID);

            expect(result).toEqual(post);
            expect(findByIdSpy).toHaveBeenCalledWith(TEST_POST_ID);
            expect(findByIdSpy).toHaveBeenCalledTimes(1);
        });

        it("조회하려는 id에 대한 게시글을 찾지 못하여 오류를 반환한다.", async () => {
            findByIdSpy.mockRejectedValue(new NotFoundException("Post not exists."));

            await expect(postsController.findById(TEST_POST_ID)).rejects.toThrow(
                new NotFoundException("Post not exists."),
            );
            expect(findByIdSpy).toHaveBeenCalledWith(TEST_POST_ID);
            expect(findByIdSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("create", () => {
        const createPostDto = {
            categoryId: TEST_CATEGORY_ID,
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

                createSpy.mockResolvedValue(mockPost);

                const result = await postsController.create(TEST_USER_ID, createPostDto);

                expect(result).toEqual(mockPost);
                expect(createSpy).toHaveBeenCalledWith(TEST_USER_ID, createPostDto);
                expect(createSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("게시글 생성 실패", () => {
            it("로그인한 유저에 대한 정보를 DB에서 찾지 못하여 오류를 반환한다.", async () => {
                createSpy.mockRejectedValue(new NotFoundException("User not exists."));

                await expect(postsController.create(TEST_USER_ID, createPostDto)).rejects.toThrow(
                    new NotFoundException("User not exists."),
                );
                expect(createSpy).toHaveBeenCalledWith(TEST_USER_ID, createPostDto);
                expect(createSpy).toHaveBeenCalledTimes(1);
            });

            it("생성하려는 카테고리 id에 대한 카테고리 정보를 DB에서 찾지 못하여 오류를 반환한다.", async () => {
                createSpy.mockRejectedValue(new NotFoundException("Category not exists."));

                await expect(postsController.create(TEST_USER_ID, createPostDto)).rejects.toThrow(
                    new NotFoundException("Category not exists."),
                );
                expect(createSpy).toHaveBeenCalledWith(TEST_USER_ID, createPostDto);
                expect(createSpy).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("update", () => {
        const updatePostDto = { title: "update title" };

        describe("게시글 수정 성공", () => {
            it("게시글 수정에 성공하여 수정된 게시글 정보를 반환한다.", async () => {
                const mockUpdatePost = {
                    id: TEST_POST_ID,
                    userId: TEST_USER_ID,
                    categoryId: 1,
                    title: updatePostDto.title,
                    content: "Test",
                    viewCount: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                updateSpy.mockResolvedValue(mockUpdatePost);

                const result = await postsController.update(TEST_POST_ID, TEST_USER_ID, updatePostDto);

                expect(result).toEqual(mockUpdatePost);
                expect(updateSpy).toHaveBeenCalledWith(TEST_POST_ID, TEST_USER_ID, updatePostDto);
                expect(updateSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("게시글 수정 실패", () => {
            it("수정하려는 게시글 id에 대한 게시글을 DB에서 찾지 못하여 오류를 반환한다.", async () => {
                updateSpy.mockRejectedValue(new NotFoundException("Post not exists."));

                await expect(postsController.update(TEST_POST_ID, TEST_USER_ID, updatePostDto)).rejects.toThrow(
                    new NotFoundException("Post not exists."),
                );
                expect(updateSpy).toHaveBeenCalledWith(TEST_POST_ID, TEST_USER_ID, updatePostDto);
                expect(updateSpy).toHaveBeenCalledTimes(1);
            });

            it("로그인한 사용자와 게시글 작성자가 상이하여 오류를 반환한다.", async () => {
                updateSpy.mockRejectedValue(new ForbiddenException("You do not have permission to update this post."));

                await expect(postsController.update(TEST_POST_ID, TEST_USER_ID, updatePostDto)).rejects.toThrow(
                    new ForbiddenException("You do not have permission to update this post."),
                );
                expect(updateSpy).toHaveBeenCalledWith(TEST_POST_ID, TEST_USER_ID, updatePostDto);
                expect(updateSpy).toHaveBeenCalledTimes(1);
            });

            it("수정하려는 카테고리 id에 대한 카테고리를 DB에서 찾지 못하여 오류를 반환한다.", async () => {
                const updatePostDto = { categoryId: 20 };

                updateSpy.mockRejectedValue(new NotFoundException("Category not exists."));

                await expect(postsController.update(TEST_POST_ID, TEST_USER_ID, updatePostDto)).rejects.toThrow(
                    new NotFoundException("Category not exists."),
                );
                expect(updateSpy).toHaveBeenCalledWith(TEST_POST_ID, TEST_USER_ID, updatePostDto);
                expect(updateSpy).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("remove", () => {
        describe("게시글 삭제 성공", () => {
            it("게시글 삭제에 성공한다.", async () => {
                removeSpy.mockResolvedValue(undefined);

                await postsController.remove(TEST_POST_ID, TEST_USER_ID);

                expect(removeSpy).toHaveBeenCalledWith(TEST_POST_ID, TEST_USER_ID);
                expect(removeSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("게시글 삭제 실패", () => {
            it("삭제하려는 게시글 id에 대한 게시글을 DB에서 찾지 못하여 오류를 반환한다.", async () => {
                removeSpy.mockRejectedValue(new NotFoundException("Post not exists."));

                await expect(postsController.remove(TEST_POST_ID, TEST_USER_ID)).rejects.toThrow(
                    new NotFoundException("Post not exists."),
                );
                expect(removeSpy).toHaveBeenCalledWith(TEST_POST_ID, TEST_USER_ID);
                expect(removeSpy).toHaveBeenCalledTimes(1);
            });

            it("로그인한 사용자와 게시글 작성자가 상이하여 오류를 반환한다.", async () => {
                removeSpy.mockRejectedValue(new ForbiddenException("You do not have permission to delete this post."));

                await expect(postsController.remove(TEST_POST_ID, TEST_USER_ID)).rejects.toThrow(
                    new ForbiddenException("You do not have permission to delete this post."),
                );
                expect(removeSpy).toHaveBeenCalledWith(TEST_POST_ID, TEST_USER_ID);
                expect(removeSpy).toHaveBeenCalledTimes(1);
            });
        });
    });
});
