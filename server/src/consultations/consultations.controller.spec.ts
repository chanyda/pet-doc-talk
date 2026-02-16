import { ForbiddenException, Logger, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { PetType } from "generated/prisma/enums";

import { AuthGuard } from "@/auth/guards/auth.guard";
import { getNextCursor } from "@/common/utils/pagination.util";

import { ConsultationsController } from "./consultations.controller";
import { ConsultationsService } from "./consultations.service";

describe("ConsultationsController", () => {
    let consultationsController: ConsultationsController;
    let consultationsService: ConsultationsService;

    let findMyConsultationsSpy: jest.SpyInstance;
    let createSpy: jest.SpyInstance;
    let deleteSpy: jest.SpyInstance;

    const TEST_CONSULTATION_ID = 1;
    const TEST_USER_ID = 1;
    const TEST_PET_ID = 1;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [ConsultationsController],
            providers: [
                {
                    provide: ConsultationsService,
                    useValue: {
                        create: jest.fn(),
                        findMyConsultations: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        jest.spyOn(Logger.prototype, "error").mockImplementation();

        consultationsController = moduleRef.get(ConsultationsController);
        consultationsService = moduleRef.get(ConsultationsService);

        findMyConsultationsSpy = jest.spyOn(consultationsService, "findMyConsultations");
        createSpy = jest.spyOn(consultationsService, "create");
        deleteSpy = jest.spyOn(consultationsService, "delete");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("findMyConsultations", () => {
        const requiredQuery = { limit: 10 };

        it("상담 목록을 조회하여 다음 페이지가 존재할 때 nextCursor를 반환한다.", async () => {
            const mockConsultations = Array.from({ length: requiredQuery.limit }, (_, i) => ({
                id: i + 1,
                userId: TEST_USER_ID,
                pet: { id: TEST_PET_ID, name: "Test Pet", type: PetType.CAT, imageUrl: null },
                title: `Title ${i}`,
                createdAt: new Date(),
            }));

            const myConsultationListResponse = {
                consultations: mockConsultations,
                totalConsultationCount: 20,
                nextCursor: getNextCursor(mockConsultations, requiredQuery.limit),
            };

            findMyConsultationsSpy.mockResolvedValue(myConsultationListResponse);

            const result = await consultationsController.findMyConsultations(TEST_USER_ID, requiredQuery);

            expect(result).toEqual(myConsultationListResponse);
            expect(findMyConsultationsSpy).toHaveBeenCalledWith(TEST_USER_ID, requiredQuery);
            expect(findMyConsultationsSpy).toHaveBeenCalledTimes(1);
        });

        it("상담 목록을 조회하여 다음 페이지가 없을 때 nextCursor를 null로 반환한다.", async () => {
            const query = { ...requiredQuery, cursor: 10 };

            const mockConsultations = Array.from({ length: query.limit - 1 }, (_, i) => ({
                id: i + 1,
                userId: TEST_USER_ID,
                pet: { id: TEST_PET_ID, name: "Test Pet", type: PetType.CAT, imageUrl: null },
                title: `Title ${i}`,
                createdAt: new Date(),
            }));

            const myConsultationListResponse = {
                consultations: mockConsultations,
                totalConsultationCount: 19,
                nextCursor: getNextCursor(mockConsultations, query.limit),
            };

            findMyConsultationsSpy.mockResolvedValue(myConsultationListResponse);

            const result = await consultationsController.findMyConsultations(TEST_USER_ID, query);

            expect(result).toEqual(myConsultationListResponse);
            expect(findMyConsultationsSpy).toHaveBeenCalledWith(TEST_USER_ID, query);
            expect(findMyConsultationsSpy).toHaveBeenCalledTimes(1);
        });

        it("상담 목록이 없을 때 빈 배열과 nextCursor를 null로 반환한다.", async () => {
            const myConsultationListResponse = {
                consultations: [],
                totalConsultationCount: 0,
                nextCursor: null,
            };

            findMyConsultationsSpy.mockResolvedValue(myConsultationListResponse);

            const result = await consultationsController.findMyConsultations(TEST_USER_ID, requiredQuery);

            expect(result).toEqual(myConsultationListResponse);
            expect(findMyConsultationsSpy).toHaveBeenCalledWith(TEST_USER_ID, requiredQuery);
            expect(findMyConsultationsSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("create", () => {
        const createConsultationDto = { petId: TEST_PET_ID };

        it("상담 채팅방을 정상적으로 생성한다.", async () => {
            const mockConsultation = {
                id: TEST_CONSULTATION_ID,
                userId: TEST_USER_ID,
                petId: createConsultationDto.petId,
                title: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            createSpy.mockResolvedValue(mockConsultation);

            const result = await consultationsController.create(TEST_USER_ID, createConsultationDto);

            expect(result).toEqual(mockConsultation);
            expect(createSpy).toHaveBeenCalledWith(TEST_USER_ID, createConsultationDto);
            expect(createSpy).toHaveBeenCalledTimes(1);
        });

        it("상담하려는 펫 정보가 DB에 존재하지 않아서 오류를 반환한다.", async () => {
            createSpy.mockRejectedValue(new NotFoundException("Pet not exists."));

            await expect(consultationsController.create(TEST_USER_ID, createConsultationDto)).rejects.toThrow(
                new NotFoundException("Pet not exists."),
            );
            expect(createSpy).toHaveBeenCalledWith(TEST_USER_ID, createConsultationDto);
            expect(createSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("delete", () => {
        describe("상담 삭제 성공", () => {
            it("상담 삭제를 성공한다.", async () => {
                deleteSpy.mockResolvedValue(undefined);

                const result = await consultationsController.delete(TEST_USER_ID, TEST_CONSULTATION_ID);

                expect(result).toBeUndefined();
                expect(deleteSpy).toHaveBeenCalledWith(TEST_USER_ID, TEST_CONSULTATION_ID);
                expect(deleteSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("상담 삭제 실패", () => {
            it("consultationId가 DB에 존재하지 않아서 오류를 반환한다.", async () => {
                deleteSpy.mockRejectedValue(new NotFoundException("Consultation not exists."));

                await expect(consultationsController.delete(TEST_USER_ID, TEST_CONSULTATION_ID)).rejects.toThrow(
                    new NotFoundException("Consultation not exists."),
                );
                expect(deleteSpy).toHaveBeenCalledWith(TEST_USER_ID, TEST_CONSULTATION_ID);
                expect(deleteSpy).toHaveBeenCalledTimes(1);
            });

            it("삭제하려는 consultationId가 내가 생성한 consultation이 아니라서 오류를 반환한다.", async () => {
                deleteSpy.mockRejectedValue(
                    new ForbiddenException("You do not have permission to delete this consultation."),
                );

                await expect(consultationsController.delete(TEST_USER_ID, TEST_CONSULTATION_ID)).rejects.toThrow(
                    new ForbiddenException("You do not have permission to delete this consultation."),
                );
                expect(deleteSpy).toHaveBeenCalledWith(TEST_USER_ID, TEST_CONSULTATION_ID);
                expect(deleteSpy).toHaveBeenCalledTimes(1);
            });
        });
    });
});
