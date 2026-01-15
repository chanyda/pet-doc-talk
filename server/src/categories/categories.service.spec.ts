import { Test, TestingModule } from "@nestjs/testing";
import { CategoriesRepository } from "./categories.repository";
import { CategoriesService } from "./categories.service";

describe("CategoriesService", () => {
    let categoriesService: CategoriesService;
    let categoriesRepository: CategoriesRepository;

    let findManySpy: jest.SpyInstance;
    let findByIdSpy: jest.SpyInstance;

    const TEST_CATEGORY_ID = 1;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                CategoriesService,
                {
                    provide: CategoriesRepository,
                    useValue: {
                        findMany: jest.fn(),
                        findById: jest.fn(),
                    },
                },
            ],
        }).compile();

        categoriesService = moduleRef.get(CategoriesService);
        categoriesRepository = moduleRef.get(CategoriesRepository);

        findManySpy = jest.spyOn(categoriesRepository, "findMany");
        findByIdSpy = jest.spyOn(categoriesRepository, "findById");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("findMany", () => {
        it("카테고리 목록을 반환한다.", async () => {
            const mockCategories = [
                { id: 1, name: "건강·상담·병원" },
                { id: 2, name: "사료·간식·용품" },
                { id: 3, name: "행동·훈련" },
                { id: 4, name: "자유 질문" },
            ];

            findManySpy.mockResolvedValue(mockCategories);

            const result = await categoriesService.findMany();

            expect(result).toEqual(mockCategories);
            expect(findManySpy).toHaveBeenCalledWith({ id: true, name: true });
            expect(findManySpy).toHaveBeenCalledTimes(1);
        });

        it("카테고리 목록이 없어서 빈 배열을 반환한다.", async () => {
            findManySpy.mockResolvedValue([]);

            const result = await categoriesService.findMany();

            expect(result).toEqual([]);
            expect(findManySpy).toHaveBeenCalledWith({ id: true, name: true });
            expect(findManySpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("existsByCategoryId", () => {
        it("조회하려는 id를 가진 카테고리가 존재해서 true를 반환한다.", async () => {
            findByIdSpy.mockResolvedValue({ id: TEST_CATEGORY_ID });

            const result = await categoriesService.existsByCategoryId(TEST_CATEGORY_ID);

            expect(result).toBeTruthy();
            expect(findByIdSpy).toHaveBeenCalledWith(TEST_CATEGORY_ID, { id: true });
            expect(findByIdSpy).toHaveBeenCalledTimes(1);
        });

        it("조회하려는 id를 가진 카테고리가 존재하지 않아서 false를 반환한다.", async () => {
            findByIdSpy.mockResolvedValue(null);

            const result = await categoriesService.existsByCategoryId(TEST_CATEGORY_ID);

            expect(result).toBeFalsy();
            expect(findByIdSpy).toHaveBeenCalledWith(TEST_CATEGORY_ID, { id: true });
            expect(findByIdSpy).toHaveBeenCalledTimes(1);
        });
    });
});
