import { AuthGuard } from "src/auth/guards/auth.guard";
import { PetsController } from "./pets.controller";
import { PetsService } from "./pets.service";
import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { AuthRequest } from "src/types/request.type";
import { PetGender, PetType } from "generated/prisma/enums";
import { Decimal } from "@prisma/client/runtime/index-browser";

describe("PetsController", () => {
    let petsController: PetsController;
    let petsService: PetsService;

    let createSpy: jest.SpyInstance;
    let findByIdSpy: jest.SpyInstance;

    const now = Math.floor(Date.now() / 1000);
    const mockReq: AuthRequest = {
        user: {
            userId: 1,
            email: "test@example.com",
            iat: now,
            exp: now + 10 * 24 * 60 * 60, // 10일 뒤
        },
    } as AuthRequest;

    const TEST_PET_ID = 1;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [PetsController],
            providers: [
                {
                    provide: PetsService,
                    useValue: {
                        create: jest.fn(),
                        findById: jest.fn(),
                    },
                },
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        petsController = moduleRef.get(PetsController);
        petsService = moduleRef.get(PetsService);

        createSpy = jest.spyOn(petsService, "create");
        findByIdSpy = jest.spyOn(petsService, "findById");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("findById", () => {
        it("펫 정보 가져오기에 성공하여 펫 정보를 반환한다.", async () => {
            const mockPet = {
                id: TEST_PET_ID,
                name: "호두",
                type: PetType.DOG,
                gender: PetGender.MALE,
                breed: "믹스",
                weight: new Decimal(5.85),
                birthDate: "2025-01-01T00:00:00Z",
                isNeutered: true,
                imageUrl: "http://test.com",
            };

            findByIdSpy.mockResolvedValue(mockPet);

            const result = await petsController.findById(mockReq, TEST_PET_ID);

            expect(result).toEqual(mockPet);
            expect(findByIdSpy).toHaveBeenCalledWith(TEST_PET_ID, mockReq.user.userId);
            expect(findByIdSpy).toHaveBeenCalledTimes(1);
        });

        it("조회하려는 Pet이 존재하지 않아서 오류를 반환한다.", async () => {
            findByIdSpy.mockRejectedValue(new NotFoundException("Pet not exists."));

            await expect(petsController.findById(mockReq, TEST_PET_ID)).rejects.toThrow(
                new NotFoundException("Pet not exists."),
            );
            expect(findByIdSpy).toHaveBeenCalledWith(TEST_PET_ID, mockReq.user.userId);
            expect(findByIdSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("create", () => {
        const requiredCreatePetDto = {
            name: "호두",
            type: PetType.DOG,
            gender: PetGender.MALE,
            breed: "믹스",
        };

        describe("펫 생성 성공", () => {
            it("필수로 필요한 정보만으로 펫을 생성하여 펫 정보를 반환한다.", async () => {
                const mockPet = {
                    id: TEST_PET_ID,
                    ...requiredCreatePetDto,
                    weight: null,
                    birthDate: null,
                    isNeutered: null,
                    imageUrl: null,
                };

                createSpy.mockResolvedValue(mockPet);

                const result = await petsController.create(mockReq, requiredCreatePetDto);

                expect(result).toEqual(mockPet);
                expect(createSpy).toHaveBeenCalledWith(mockReq.user.userId, requiredCreatePetDto);
                expect(createSpy).toHaveBeenCalledTimes(1);
            });

            it("필수 정보 포함 일부 선택 정보로 펫을 생성하여 펫 정보를 반환한다. (필수 정보 + weight + birthDate)", async () => {
                const createPetDto = {
                    ...requiredCreatePetDto,
                    weight: new Decimal(5.85),
                    birthDate: "2025-01-01T00:00:00Z",
                };
                const mockPet = {
                    id: TEST_PET_ID,
                    ...createPetDto,
                    isNeutered: null,
                    imageUrl: null,
                };

                createSpy.mockResolvedValue(mockPet);

                const result = await petsController.create(mockReq, createPetDto);

                expect(result).toEqual(mockPet);
                expect(createSpy).toHaveBeenCalledWith(mockReq.user.userId, createPetDto);
                expect(createSpy).toHaveBeenCalledTimes(1);
            });

            it("모든 정보로 펫을 생성하여 펫 정보를 반환한다.", async () => {
                const createPetDto = {
                    ...requiredCreatePetDto,
                    weight: new Decimal(5.85),
                    birthDate: "2025-01-01T00:00:00Z",
                    isNeutered: true,
                    imageUrl: "http://test.com",
                };
                const mockPet = { id: TEST_PET_ID, ...createPetDto };

                createSpy.mockResolvedValue(mockPet);

                const result = await petsController.create(mockReq, createPetDto);

                expect(result).toEqual(mockPet);
                expect(createSpy).toHaveBeenCalledWith(mockReq.user.userId, createPetDto);
                expect(createSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("펫 생성 실패", () => {
            it("로그인한 유저에 대한 정보를 DB에서 찾지 못하여 오류를 반환한다.", async () => {
                createSpy.mockRejectedValue(new NotFoundException("User not exists."));

                await expect(petsController.create(mockReq, requiredCreatePetDto)).rejects.toThrow(
                    new NotFoundException("User not exists."),
                );
                expect(createSpy).toHaveBeenCalledWith(mockReq.user.userId, requiredCreatePetDto);
                expect(createSpy).toHaveBeenCalledTimes(1);
            });
        });
    });
});
