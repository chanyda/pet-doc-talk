import { PetsService } from "src/pets/pets.service";
import { ConsultationsService } from "./consultations.service";
import { ConsultationsRepository } from "./consultations.repository";
import { Test, TestingModule } from "@nestjs/testing";
import { PetGender, PetType } from "generated/prisma/enums";
import { NotFoundException } from "@nestjs/common";
import { getNextCursor } from "src/common/utils/pagination.util";
import { CONSULTATION_SELECT } from "./constants";

describe("ConsultationsService", () => {
    let consultationsService: ConsultationsService;
    let consultationsRepository: ConsultationsRepository;

    let petsService: PetsService;

    let findManyAndCountSpy: jest.SpyInstance;
    let createSpy: jest.SpyInstance;

    let petFindByIdSpy: jest.SpyInstance;

    const TEST_CONSULTATION_ID = 1;
    const TEST_PET_ID = 1;
    const TEST_USER_ID = 1;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                ConsultationsService,
                {
                    provide: ConsultationsRepository,
                    useValue: {
                        findManyAndCount: jest.fn(),
                        create: jest.fn(),
                    },
                },
                {
                    provide: PetsService,
                    useValue: {
                        findById: jest.fn(),
                    },
                },
            ],
        }).compile();

        consultationsService = moduleRef.get(ConsultationsService);
        consultationsRepository = moduleRef.get(ConsultationsRepository);
        petsService = moduleRef.get(PetsService);

        findManyAndCountSpy = jest.spyOn(consultationsRepository, "findManyAndCount");
        createSpy = jest.spyOn(consultationsRepository, "create");

        petFindByIdSpy = jest.spyOn(petsService, "findById");
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

            findManyAndCountSpy.mockResolvedValue({ consultations: mockConsultations, totalCount: 20 });

            const result = await consultationsService.findMyConsultations(TEST_USER_ID, requiredQuery);

            expect(result).toEqual(myConsultationListResponse);
            expect(findManyAndCountSpy).toHaveBeenCalledWith({
                take: requiredQuery.limit,
                skip: undefined,
                cursor: undefined,
                where: { userId: TEST_USER_ID },
                orderBy: { createdAt: "desc" },
                select: CONSULTATION_SELECT,
            });
            expect(findManyAndCountSpy).toHaveBeenCalledTimes(1);
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

            findManyAndCountSpy.mockResolvedValue({ consultations: mockConsultations, totalCount: 19 });

            const result = await consultationsService.findMyConsultations(TEST_USER_ID, query);

            expect(result).toEqual(myConsultationListResponse);
            expect(findManyAndCountSpy).toHaveBeenCalledWith({
                take: query.limit,
                skip: 1,
                cursor: { id: query.cursor },
                where: { userId: TEST_USER_ID },
                orderBy: { createdAt: "desc" },
                select: CONSULTATION_SELECT,
            });
            expect(findManyAndCountSpy).toHaveBeenCalledTimes(1);
        });

        it("상담 목록이 없을 때 빈 배열과 nextCursor를 null로 반환한다.", async () => {
            const myConsultationListResponse = { consultations: [], totalConsultationCount: 0, nextCursor: null };

            findManyAndCountSpy.mockResolvedValue({ consultations: [], totalCount: 0 });

            const result = await consultationsService.findMyConsultations(TEST_USER_ID, requiredQuery);

            expect(result).toEqual(myConsultationListResponse);
            expect(findManyAndCountSpy).toHaveBeenCalledWith({
                take: requiredQuery.limit,
                skip: undefined,
                cursor: undefined,
                where: { userId: TEST_USER_ID },
                orderBy: { createdAt: "desc" },
                select: CONSULTATION_SELECT,
            });
            expect(findManyAndCountSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("create", () => {
        const createConsultationDto = { petId: TEST_PET_ID };

        it("상담 채팅방을 정상적으로 생성한다.", async () => {
            const mockPet = {
                id: createConsultationDto.petId,
                name: "Test Pet",
                gender: PetGender.FEMALE,
                breed: "세상에 하나뿐인 믹스",
                imageUrl: null,
                weight: null,
                birthDate: null,
                isNeutered: null,
            };
            const mockConsultation = {
                id: TEST_CONSULTATION_ID,
                userId: TEST_USER_ID,
                petId: createConsultationDto.petId,
                title: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            petFindByIdSpy.mockResolvedValue(mockPet);
            createSpy.mockResolvedValue(mockConsultation);

            const result = await consultationsService.create(TEST_USER_ID, createConsultationDto);

            expect(result).toEqual(mockConsultation);
            expect(petFindByIdSpy).toHaveBeenCalledWith(createConsultationDto.petId, TEST_USER_ID);
            expect(petFindByIdSpy).toHaveBeenCalledTimes(1);
            expect(createSpy).toHaveBeenCalledWith(TEST_USER_ID, createConsultationDto);
            expect(createSpy).toHaveBeenCalledTimes(1);
        });

        it("상담하려는 펫 정보가 DB에 존재하지 않아서 오류를 반환한다.", async () => {
            petFindByIdSpy.mockRejectedValue(new NotFoundException("Pet not exists."));

            await expect(consultationsService.create(TEST_USER_ID, createConsultationDto)).rejects.toThrow(
                new NotFoundException("Pet not exists."),
            );
            expect(petFindByIdSpy).toHaveBeenCalledWith(createConsultationDto.petId, TEST_USER_ID);
            expect(petFindByIdSpy).toHaveBeenCalledTimes(1);
            expect(createSpy).not.toHaveBeenCalled();
        });
    });
});
