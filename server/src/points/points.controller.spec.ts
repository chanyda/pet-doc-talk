import { Test, TestingModule } from "@nestjs/testing";

import { AuthGuard } from "@/auth/guards/auth.guard";

import { PointsController } from "./points.controller";
import { PointsService } from "./points.service";

describe("PointsController", () => {
    let pointsController: PointsController;
    let pointsService: PointsService;

    let findMyPointsSpy: jest.SpyInstance;

    const TEST_USER_ID = 1;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PointsController],
            providers: [
                {
                    provide: PointsService,
                    useValue: {
                        findMyPoints: jest.fn(),
                    },
                },
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        pointsController = module.get(PointsController);
        pointsService = module.get(PointsService);

        findMyPointsSpy = jest.spyOn(pointsService, "findMyPoints");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("findMyPoints", () => {
        it("내 포인트 정보를 정상적으로 조회하여 반환한다.", async () => {
            findMyPointsSpy.mockResolvedValue({ amount: 3 });

            const result = await pointsController.findMyPoints(TEST_USER_ID);

            expect(result).toEqual({ amount: 3 });
            expect(findMyPointsSpy).toHaveBeenCalledWith(TEST_USER_ID);
            expect(findMyPointsSpy).toHaveBeenCalledTimes(1);
        });
    });
});
