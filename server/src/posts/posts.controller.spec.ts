import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { NotFoundException } from "@nestjs/common";

describe("PostsController", () => {
    let postsController: PostsController;
    let postsService: PostsService;

    let createSpy: jest.SpyInstance;

    const TEST_USER_ID = 1;
    const TEST_CATEGORY_ID = 1;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [PostsController],
            providers: [
                {
                    provide: PostsService,
                    useValue: {
                        create: jest.fn(),
                    },
                },
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        postsController = moduleRef.get(PostsController);
        postsService = moduleRef.get(PostsService);

        createSpy = jest.spyOn(postsService, "create");
    });

    afterEach(() => {
        jest.clearAllMocks();
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
});
