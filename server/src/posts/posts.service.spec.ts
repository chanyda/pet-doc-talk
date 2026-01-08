import { Test, TestingModule } from "@nestjs/testing";
import { PostsRepository } from "./posts.repository";
import { PostsService } from "./posts.service";
import { UsersService } from "src/users/users.service";
import { CategoriesService } from "src/categories/categories.service";
import { NotFoundException } from "@nestjs/common";

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
    let createSpy: jest.SpyInstance;

    const TEST_USER_ID = 1;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                PostsService,
                {
                    provide: PostsRepository,
                    useValue: {
                        create: jest.fn(),
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
        createSpy = jest.spyOn(postsRepository, "create");
    });

    afterEach(() => {
        jest.clearAllMocks();
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
