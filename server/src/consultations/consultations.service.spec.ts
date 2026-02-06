import { PetsService } from "src/pets/pets.service";
import { ConsultationsService } from "./consultations.service";
import { ConsultationsRepository } from "./consultations.repository";
import { Test, TestingModule } from "@nestjs/testing";
import { PetGender } from "generated/prisma/enums";
import { NotFoundException } from "@nestjs/common";

describe("ConsultationsService", () => {
    let consultationsService: ConsultationsService;
    let consultationsRepository: ConsultationsRepository;

    let petsService: PetsService;

    let createSpy: jest.SpyInstance;

    let petFindByIdSpy: jest.SpyInstance;

    const TEST_CONSULTATION_ID = 1;
    const TEST_USER_ID = 1;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                ConsultationsService,
                {
                    provide: ConsultationsRepository,
                    useValue: {
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

        createSpy = jest.spyOn(consultationsRepository, "create");

        petFindByIdSpy = jest.spyOn(petsService, "findById");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        const createConsultationDto = { petId: 1 };

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
