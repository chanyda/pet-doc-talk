import { Test, TestingModule } from "@nestjs/testing";

import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";

describe("CategoriesController", () => {
    let categoriesController: CategoriesController;
    let categoriesService: CategoriesService;

    let findManySpy: jest.SpyInstance;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [CategoriesController],
            providers: [
                {
                    provide: CategoriesService,
                    useValue: {
                        findMany: jest.fn(),
                    },
                },
            ],
        }).compile();

        categoriesController = moduleRef.get(CategoriesController);
        categoriesService = moduleRef.get(CategoriesService);

        findManySpy = jest.spyOn(categoriesService, "findMany");
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

            const result = await categoriesController.findMany();

            expect(result).toEqual(mockCategories);
            expect(findManySpy).toHaveBeenCalledTimes(1);
        });
    });
});
