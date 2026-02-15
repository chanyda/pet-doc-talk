import { ForbiddenException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { PointAction, PointSource } from "generated/prisma/enums";

import { POINT_POLICY } from "./constants";
import { PointsRepository } from "./points.repository";
import { PointsService } from "./points.service";

jest.mock("@nestjs-cls/transactional", () => ({
    Transactional: () => (_: any, __: string, descriptor: PropertyDescriptor) => {
        return descriptor;
    },
}));

describe("PointsService", () => {
    let pointsService: PointsService;
    let pointsRepository: PointsRepository;

    let findByUserIdSpy: jest.SpyInstance;
    let createSpy: jest.SpyInstance;
    let createHistorySpy: jest.SpyInstance;
    let updateAmountSpy: jest.SpyInstance;

    const TEST_USER_ID = 1;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PointsService,
                {
                    provide: PointsRepository,
                    useValue: {
                        findByUserId: jest.fn(),
                        create: jest.fn(),
                        createHistory: jest.fn(),
                        updateAmount: jest.fn(),
                    },
                },
            ],
        }).compile();

        pointsService = module.get(PointsService);
        pointsRepository = module.get(PointsRepository);

        findByUserIdSpy = jest.spyOn(pointsRepository, "findByUserId");
        createSpy = jest.spyOn(pointsRepository, "create");
        createHistorySpy = jest.spyOn(pointsRepository, "createHistory");
        updateAmountSpy = jest.spyOn(pointsRepository, "updateAmount");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("findMyPoints", () => {
        it("userId에 대한 포인트 정보가 DB에 존재하지 않아서 새로 생성 후 반환한다.", async () => {
            findByUserIdSpy.mockResolvedValue(null);
            createSpy.mockResolvedValue({ amount: 0 });

            const result = await pointsService.findMyPoints(TEST_USER_ID);

            expect(result).toEqual({ amount: 0 });
            expect(findByUserIdSpy).toHaveBeenCalledWith(TEST_USER_ID, { amount: true });
            expect(findByUserIdSpy).toHaveBeenCalledTimes(1);
            expect(createSpy).toHaveBeenCalledWith(TEST_USER_ID, 0, { amount: true });
            expect(createSpy).toHaveBeenCalledTimes(1);
        });

        it("userId에 대한 포인트 정보를 반환한다.", async () => {
            findByUserIdSpy.mockResolvedValue({ amount: 3 });

            const result = await pointsService.findMyPoints(TEST_USER_ID);

            expect(result).toEqual({ amount: 3 });
            expect(findByUserIdSpy).toHaveBeenCalledWith(TEST_USER_ID, { amount: true });
            expect(findByUserIdSpy).toHaveBeenCalledTimes(1);
            expect(createSpy).not.toHaveBeenCalled();
        });
    });

    describe("applyPoint", () => {
        it("회원가입을 하여 포인트를 얻고 현재 포인트를 반환한다.", async () => {
            const signUpAmount = POINT_POLICY.SIGN_UP.amount;
            const newAmount = 0 + POINT_POLICY.SIGN_UP.amount;

            findByUserIdSpy.mockResolvedValue({ amount: 0 });
            updateAmountSpy.mockResolvedValue({
                id: 1,
                userId: TEST_USER_ID,
                amount: newAmount,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            createHistorySpy.mockResolvedValue({
                id: 1,
                userId: TEST_USER_ID,
                action: PointAction.EARN,
                source: PointSource.SIGN_UP,
                value: signUpAmount,
                remainingPoints: newAmount,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const result = await pointsService.applyPoint(TEST_USER_ID, PointSource.SIGN_UP);

            expect(result).toEqual(newAmount);
            expect(findByUserIdSpy).toHaveBeenCalledWith(TEST_USER_ID, { amount: true });
            expect(findByUserIdSpy).toHaveBeenCalledTimes(1);
            expect(createSpy).not.toHaveBeenCalled();
            expect(updateAmountSpy).toHaveBeenCalledWith(TEST_USER_ID, newAmount);
            expect(updateAmountSpy).toHaveBeenCalledTimes(1);
            expect(createHistorySpy).toHaveBeenCalledWith(
                TEST_USER_ID,
                PointAction.EARN,
                PointSource.SIGN_UP,
                signUpAmount,
                newAmount,
            );
            expect(createHistorySpy).toHaveBeenCalledTimes(1);
        });

        it("상담 메세지를 보내서 포인트를 소진하고 현재 포인트를 반환한다.", async () => {
            const consultationAmount = POINT_POLICY.CONSULTATION.amount;
            const newAmount = 3 + POINT_POLICY.CONSULTATION.amount;

            // 현재 3포인트를 보유하고 있다고 가정
            findByUserIdSpy.mockResolvedValue({ amount: 3 });
            updateAmountSpy.mockResolvedValue({
                id: 1,
                userId: TEST_USER_ID,
                amount: newAmount,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            createHistorySpy.mockResolvedValue({
                id: 1,
                userId: TEST_USER_ID,
                action: PointAction.USE,
                source: PointSource.CONSULTATION,
                value: consultationAmount,
                remainingPoints: newAmount,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const result = await pointsService.applyPoint(TEST_USER_ID, PointSource.CONSULTATION);

            expect(result).toEqual(newAmount);
            expect(findByUserIdSpy).toHaveBeenCalledWith(TEST_USER_ID, { amount: true });
            expect(findByUserIdSpy).toHaveBeenCalledTimes(1);
            expect(createSpy).not.toHaveBeenCalled();
            expect(updateAmountSpy).toHaveBeenCalledWith(TEST_USER_ID, newAmount);
            expect(updateAmountSpy).toHaveBeenCalledTimes(1);
            expect(createHistorySpy).toHaveBeenCalledWith(
                TEST_USER_ID,
                PointAction.USE,
                PointSource.CONSULTATION,
                POINT_POLICY.CONSULTATION.amount,
                newAmount,
            );
            expect(createHistorySpy).toHaveBeenCalledTimes(1);
        });

        it("상담 메세지를 보내서 포인트 소진 시 업데이트하려는 포인트가 0이하여서 오류를 반환한다.", async () => {
            findByUserIdSpy.mockResolvedValue({ amount: 0 });

            await expect(pointsService.applyPoint(TEST_USER_ID, PointSource.CONSULTATION)).rejects.toThrow(
                new ForbiddenException("Insufficient points."),
            );
            expect(findByUserIdSpy).toHaveBeenCalledWith(TEST_USER_ID, { amount: true });
            expect(findByUserIdSpy).toHaveBeenCalledTimes(1);
            expect(updateAmountSpy).not.toHaveBeenCalled();
            expect(createHistorySpy).not.toHaveBeenCalled();
        });
    });

    describe("refundPoint", () => {
        it("포인트 환불을 처리하고 현재 포인트를 반환한다.", async () => {
            const refundAmount = Math.abs(POINT_POLICY.CONSULTATION.amount);
            const newAmount = 1 + refundAmount;

            findByUserIdSpy.mockResolvedValue({ amount: 1 });
            updateAmountSpy.mockResolvedValue({
                id: 1,
                userId: TEST_USER_ID,
                amount: newAmount,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            createHistorySpy.mockResolvedValue({
                id: 1,
                userId: TEST_USER_ID,
                action: PointAction.EARN,
                source: PointSource.REFUND,
                value: refundAmount,
                remainingPoints: newAmount,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const result = await pointsService.refundPoint(TEST_USER_ID);

            expect(result).toEqual(newAmount);
            expect(findByUserIdSpy).toHaveBeenCalledWith(TEST_USER_ID, { amount: true });
            expect(findByUserIdSpy).toHaveBeenCalledTimes(1);
            expect(updateAmountSpy).toHaveBeenCalledWith(TEST_USER_ID, newAmount);
            expect(updateAmountSpy).toHaveBeenCalledTimes(1);
            expect(createHistorySpy).toHaveBeenCalledWith(
                TEST_USER_ID,
                PointAction.EARN,
                PointSource.REFUND,
                refundAmount,
                newAmount,
            );
            expect(createHistorySpy).toHaveBeenCalledTimes(1);
        });
    });
});
