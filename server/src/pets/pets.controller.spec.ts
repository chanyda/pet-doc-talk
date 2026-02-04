import { AuthGuard } from "src/auth/guards/auth.guard";
import { PetsController } from "./pets.controller";
import { PetsService } from "./pets.service";
import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { PetGender, PetType } from "generated/prisma/enums";
import { Decimal } from "@prisma/client/runtime/index-browser";

describe("PetsController", () => {
    let petsController: PetsController;
    let petsService: PetsService;

    let findManySpy: jest.SpyInstance;
    let findByIdSpy: jest.SpyInstance;
    let createSpy: jest.SpyInstance;
    let updateSpy: jest.SpyInstance;
    let removeSpy: jest.SpyInstance;

    const TEST_USER_ID = 1;
    const TEST_PET_ID = 1;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [PetsController],
            providers: [
                {
                    provide: PetsService,
                    useValue: {
                        findMany: jest.fn(),
                        findById: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                    },
                },
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        petsController = moduleRef.get(PetsController);
        petsService = moduleRef.get(PetsService);

        findManySpy = jest.spyOn(petsService, "findMany");
        findByIdSpy = jest.spyOn(petsService, "findById");
        createSpy = jest.spyOn(petsService, "create");
        updateSpy = jest.spyOn(petsService, "update");
        removeSpy = jest.spyOn(petsService, "remove");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("findMany", () => {
        it("내가 등록한 펫의 목록을 반환한다.", async () => {
            const mockPets = Array.from({ length: 5 }, (_, i) => ({
                id: i + 1,
                name: `펫${i + 1}`,
                type: PetType.DOG,
                gender: PetGender.MALE,
                breed: "믹스",
                imageUrl: null,
                weight: null,
                birthDate: null,
                isNeutered: null,
            }));

            findManySpy.mockResolvedValue(mockPets);

            const result = await petsController.findMany(TEST_USER_ID);

            expect(result).toEqual(mockPets);
            expect(findManySpy).toHaveBeenCalledWith(TEST_USER_ID);
            expect(findManySpy).toHaveBeenCalledTimes(1);
        });

        it("등록한 펫이 없어서 빈 배열을 반환한다.", async () => {
            findManySpy.mockResolvedValue([]);

            const result = await petsController.findMany(TEST_USER_ID);

            expect(result).toEqual([]);
            expect(findManySpy).toHaveBeenCalledWith(TEST_USER_ID);
            expect(findManySpy).toHaveBeenCalledTimes(1);
        });
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

            const result = await petsController.findById(TEST_USER_ID, TEST_PET_ID);

            expect(result).toEqual(mockPet);
            expect(findByIdSpy).toHaveBeenCalledWith(TEST_PET_ID, TEST_USER_ID);
            expect(findByIdSpy).toHaveBeenCalledTimes(1);
        });

        it("조회하려는 Pet이 존재하지 않아서 오류를 반환한다.", async () => {
            findByIdSpy.mockRejectedValue(new NotFoundException("Pet not exists."));

            await expect(petsController.findById(TEST_USER_ID, TEST_PET_ID)).rejects.toThrow(
                new NotFoundException("Pet not exists."),
            );
            expect(findByIdSpy).toHaveBeenCalledWith(TEST_PET_ID, TEST_USER_ID);
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

                const result = await petsController.create(TEST_USER_ID, requiredCreatePetDto);

                expect(result).toEqual(mockPet);
                expect(createSpy).toHaveBeenCalledWith(TEST_USER_ID, requiredCreatePetDto);
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

                const result = await petsController.create(TEST_USER_ID, createPetDto);

                expect(result).toEqual(mockPet);
                expect(createSpy).toHaveBeenCalledWith(TEST_USER_ID, createPetDto);
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

                const result = await petsController.create(TEST_USER_ID, createPetDto);

                expect(result).toEqual(mockPet);
                expect(createSpy).toHaveBeenCalledWith(TEST_USER_ID, createPetDto);
                expect(createSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("펫 생성 실패", () => {
            it("로그인한 유저에 대한 정보를 DB에서 찾지 못하여 오류를 반환한다.", async () => {
                createSpy.mockRejectedValue(new NotFoundException("User not exists."));

                await expect(petsController.create(TEST_USER_ID, requiredCreatePetDto)).rejects.toThrow(
                    new NotFoundException("User not exists."),
                );
                expect(createSpy).toHaveBeenCalledWith(TEST_USER_ID, requiredCreatePetDto);
                expect(createSpy).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("update", () => {
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

        describe("펫 정보 업데이트 성공", () => {
            it("단일 필드만 업데이트하여 수정된 펫 정보를 반환한다. (name)", async () => {
                const updatePetDto = { name: "호동이" };
                const mockUpdatePet = { ...mockPet, ...updatePetDto };

                updateSpy.mockResolvedValue(mockUpdatePet);

                const result = await petsController.update(TEST_USER_ID, TEST_PET_ID, updatePetDto);

                expect(result).toEqual(mockUpdatePet);
                expect(updateSpy).toHaveBeenCalledWith(TEST_PET_ID, TEST_USER_ID, updatePetDto);
                expect(updateSpy).toHaveBeenCalledTimes(1);
            });

            it("일부 필드를 업데이트하여 수정된 펫 정보를 반환한다. (name, weight, imageUrl, birthDate)", async () => {
                const updatePetDto = {
                    name: "호동이",
                    weight: new Decimal(10.8),
                    birthDate: "2023-10-21T00:00:00Z",
                    imageUrl: "http://test.com",
                };
                const mockUpdatePet = { ...mockPet, ...updatePetDto };

                updateSpy.mockResolvedValue(mockUpdatePet);

                const result = await petsController.update(TEST_USER_ID, TEST_PET_ID, updatePetDto);

                expect(result).toEqual(mockUpdatePet);
                expect(updateSpy).toHaveBeenCalledWith(TEST_PET_ID, TEST_USER_ID, updatePetDto);
                expect(updateSpy).toHaveBeenCalledTimes(1);
            });

            it("모든 필드를 업데이트하여 수정된 펫 정보를 반환한다.", async () => {
                const updatePetDto = {
                    name: "호동이",
                    gender: PetGender.FEMALE,
                    breed: "포메라니안",
                    weight: new Decimal(10.8),
                    birthDate: "2023-10-21T00:00:00Z",
                    isNeutered: false,
                    imageUrl: "http://test.com",
                };
                const mockUpdatePet = { ...mockPet, ...updatePetDto };

                updateSpy.mockResolvedValue(mockUpdatePet);

                const result = await petsController.update(TEST_USER_ID, TEST_PET_ID, updatePetDto);

                expect(result).toEqual(mockUpdatePet);
                expect(updateSpy).toHaveBeenCalledWith(TEST_PET_ID, TEST_USER_ID, updatePetDto);
                expect(updateSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("펫 정보 업데이트 실패", () => {
            it("로그인한 유저에 대한 펫 정보를 DB에서 찾지 못하여 오류를 반환한다.", async () => {
                const updatePetDto = { name: "호동이" };

                updateSpy.mockRejectedValue(new NotFoundException("Pet not exists."));

                await expect(petsController.update(TEST_USER_ID, TEST_PET_ID, updatePetDto)).rejects.toThrow(
                    new NotFoundException("Pet not exists."),
                );
                expect(updateSpy).toHaveBeenCalledWith(TEST_PET_ID, TEST_USER_ID, updatePetDto);
                expect(updateSpy).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("remove", () => {
        it("펫을 성공적으로 삭제한다.", async () => {
            removeSpy.mockResolvedValue(undefined);

            const result = await petsController.remove(TEST_USER_ID, TEST_PET_ID);

            expect(result).toBeUndefined();
            expect(removeSpy).toHaveBeenCalledWith(TEST_PET_ID, TEST_USER_ID);
            expect(removeSpy).toHaveBeenCalledTimes(1);
        });

        it("로그인한 유저에 대한 펫 정보를 DB에서 찾지 못하여 오류를 반환한다.", async () => {
            removeSpy.mockRejectedValue(new NotFoundException("Pet not exists."));

            await expect(petsController.remove(TEST_USER_ID, TEST_PET_ID)).rejects.toThrow(
                new NotFoundException("Pet not exists."),
            );
            expect(removeSpy).toHaveBeenCalledWith(TEST_PET_ID, TEST_USER_ID);
            expect(removeSpy).toHaveBeenCalledTimes(1);
        });
    });
});
