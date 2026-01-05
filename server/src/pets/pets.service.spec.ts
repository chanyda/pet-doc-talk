import { UsersService } from "src/users/users.service";
import { PetsRepository } from "./pets.repository";
import { PetsService } from "./pets.service";
import { Test, TestingModule } from "@nestjs/testing";
import { PetGender, PetType } from "generated/prisma/enums";
import { NotFoundException } from "@nestjs/common";
import { Decimal } from "@prisma/client/runtime/index-browser";

jest.mock("@nestjs-cls/transactional", () => ({
    Transactional: () => (_: any, __: string, descriptor: PropertyDescriptor) => {
        return descriptor;
    },
}));

describe("PetsService", () => {
    let petsService: PetsService;
    let petsRepository: PetsRepository;
    let usersService: UsersService;

    let existsByUserIdSpy: jest.SpyInstance;

    let findManySpy: jest.SpyInstance;
    let findByIdSpy: jest.SpyInstance;
    let createSpy: jest.SpyInstance;
    let updateSpy: jest.SpyInstance;
    let deleteSpy: jest.SpyInstance;

    const TEST_USER_ID = 1;
    const TEST_PET_ID = 1;

    // NOTE: 서비스의 private readonly PET_SUMMARY_SELECT, PET_DETAIL_SELECT와 동일한 값이어야 함
    const PET_SUMMARY_SELECT = {
        id: true,
        name: true,
        type: true,
        gender: true,
        breed: true,
        imageUrl: true,
    };

    const PET_DETAIL_SELECT = {
        ...PET_SUMMARY_SELECT,
        weight: true,
        birthDate: true,
        isNeutered: true,
    };

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                PetsService,
                {
                    provide: PetsRepository,
                    useValue: {
                        findMany: jest.fn(),
                        findById: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                    },
                },
                {
                    provide: UsersService,
                    useValue: {
                        existsByUserId: jest.fn(),
                        findById: jest.fn(),
                    },
                },
            ],
        }).compile();

        petsService = moduleRef.get(PetsService);
        petsRepository = moduleRef.get(PetsRepository);
        usersService = moduleRef.get(UsersService);

        existsByUserIdSpy = jest.spyOn(usersService, "existsByUserId");

        findManySpy = jest.spyOn(petsRepository, "findMany");
        findByIdSpy = jest.spyOn(petsRepository, "findById");
        createSpy = jest.spyOn(petsRepository, "create");
        updateSpy = jest.spyOn(petsRepository, "update");
        deleteSpy = jest.spyOn(petsRepository, "delete");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("findMany", () => {
        const PAGE_SIZE = 10;

        it("펫 목록을 조회하여 다음 페이지가 존재할 때 nextCursor를 반환한다.", async () => {
            const mockPets = Array.from({ length: PAGE_SIZE }, (_, i) => ({
                id: i + 1,
                name: `호두${i + 1}`,
                type: PetType.DOG,
                gender: PetGender.MALE,
                breed: "믹스",
                imageUrl: null,
            }));

            findManySpy.mockResolvedValue(mockPets);

            const result = await petsService.findMany(TEST_USER_ID, undefined, PAGE_SIZE);

            expect(result).toEqual({ pets: mockPets, nextCursor: mockPets[mockPets.length - 1].id });
            expect(findManySpy).toHaveBeenCalledWith(TEST_USER_ID, undefined, PAGE_SIZE, PET_SUMMARY_SELECT);
            expect(findManySpy).toHaveBeenCalledTimes(1);
        });

        it("펫 목록을 조회하여 다음 페이지가 없을 때 nextCursor를 null로 반환한다.", async () => {
            // PAGE_SIZE보다 덜 조회되었다고 가정
            const mockPets = Array.from({ length: PAGE_SIZE - 1 }, (_, i) => ({
                id: i + 1,
                name: `호두${i + 1}`,
                type: PetType.DOG,
                gender: PetGender.MALE,
                breed: "믹스",
                imageUrl: null,
            }));

            findManySpy.mockResolvedValue(mockPets);

            const result = await petsService.findMany(TEST_USER_ID, undefined, PAGE_SIZE);

            expect(result).toEqual({ pets: mockPets, nextCursor: null });
            expect(findManySpy).toHaveBeenCalledWith(TEST_USER_ID, undefined, PAGE_SIZE, PET_SUMMARY_SELECT);
            expect(findManySpy).toHaveBeenCalledTimes(1);
        });

        it("펫 목록이 없을 때 빈 배열과 nextCursor를 null로 반환한다.", async () => {
            findManySpy.mockResolvedValue([]);

            const result = await petsService.findMany(TEST_USER_ID, undefined, PAGE_SIZE);

            expect(result).toEqual({ pets: [], nextCursor: null });
            expect(findManySpy).toHaveBeenCalledWith(TEST_USER_ID, undefined, PAGE_SIZE, PET_SUMMARY_SELECT);
            expect(findManySpy).toHaveBeenCalledTimes(1);
        });

        it("cursor를 사용하여 다음 페이지의 펫 목록을 조회한다.", async () => {
            const mockPets = [
                {
                    id: 11,
                    name: "호두11",
                    type: PetType.DOG,
                    gender: PetGender.MALE,
                    breed: "믹스",
                    imageUrl: null,
                },
            ];
            const cursor = 10;

            findManySpy.mockResolvedValue(mockPets);

            const result = await petsService.findMany(TEST_USER_ID, cursor, PAGE_SIZE);

            expect(result).toEqual({ pets: mockPets, nextCursor: null });
            expect(findManySpy).toHaveBeenCalledWith(TEST_USER_ID, cursor, PAGE_SIZE, PET_SUMMARY_SELECT);
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

            const result = await petsService.findById(TEST_PET_ID, TEST_USER_ID);

            expect(result).toEqual(mockPet);
            expect(findByIdSpy).toHaveBeenCalledWith(TEST_PET_ID, TEST_USER_ID, PET_DETAIL_SELECT);
            expect(findByIdSpy).toHaveBeenCalledTimes(1);
        });

        it("조회하려는 Pet이 존재하지 않아서 오류를 반환한다.", async () => {
            findByIdSpy.mockResolvedValue(null);

            await expect(petsService.findById(TEST_PET_ID, TEST_USER_ID)).rejects.toThrow(
                new NotFoundException("Pet not exists."),
            );
            expect(findByIdSpy).toHaveBeenCalledWith(TEST_PET_ID, TEST_USER_ID, PET_DETAIL_SELECT);
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

                existsByUserIdSpy.mockResolvedValue(true);
                createSpy.mockResolvedValue(mockPet);

                const result = await petsService.create(TEST_USER_ID, requiredCreatePetDto);

                expect(result).toEqual(mockPet);
                expect(existsByUserIdSpy).toHaveBeenCalledWith(TEST_USER_ID);
                expect(existsByUserIdSpy).toHaveBeenCalledTimes(1);
                expect(createSpy).toHaveBeenCalledWith(TEST_USER_ID, requiredCreatePetDto, PET_DETAIL_SELECT);
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

                existsByUserIdSpy.mockResolvedValue(true);
                createSpy.mockResolvedValue(mockPet);

                const result = await petsService.create(TEST_USER_ID, createPetDto);

                expect(result).toEqual(mockPet);
                expect(existsByUserIdSpy).toHaveBeenCalledWith(TEST_USER_ID);
                expect(existsByUserIdSpy).toHaveBeenCalledTimes(1);
                expect(createSpy).toHaveBeenCalledWith(TEST_USER_ID, createPetDto, PET_DETAIL_SELECT);
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
                const mockPet = {
                    id: TEST_PET_ID,
                    ...createPetDto,
                };

                existsByUserIdSpy.mockResolvedValue(true);
                createSpy.mockResolvedValue(mockPet);

                const result = await petsService.create(TEST_USER_ID, createPetDto);

                expect(result).toEqual(mockPet);
                expect(existsByUserIdSpy).toHaveBeenCalledWith(TEST_USER_ID);
                expect(existsByUserIdSpy).toHaveBeenCalledTimes(1);
                expect(createSpy).toHaveBeenCalledWith(TEST_USER_ID, createPetDto, PET_DETAIL_SELECT);
                expect(createSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("펫 생성 실패", () => {
            it("로그인한 유저에 대한 정보를 DB에서 찾지 못하여 오류를 반환한다.", async () => {
                existsByUserIdSpy.mockResolvedValue(false);

                await expect(petsService.create(TEST_USER_ID, requiredCreatePetDto)).rejects.toThrow(
                    new NotFoundException("User not exists."),
                );
                expect(existsByUserIdSpy).toHaveBeenCalledWith(TEST_USER_ID);
                expect(existsByUserIdSpy).toHaveBeenCalledTimes(1);
                expect(createSpy).toHaveBeenCalledTimes(0);
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

                findByIdSpy.mockResolvedValue({ id: TEST_PET_ID });
                updateSpy.mockResolvedValue(mockUpdatePet);

                const result = await petsService.update(TEST_PET_ID, TEST_USER_ID, updatePetDto);

                expect(result).toEqual(mockUpdatePet);
                expect(findByIdSpy).toHaveBeenCalledWith(TEST_PET_ID, TEST_USER_ID, { id: true });
                expect(findByIdSpy).toHaveBeenCalledTimes(1);
                expect(updateSpy).toHaveBeenCalledWith(TEST_PET_ID, updatePetDto, PET_DETAIL_SELECT);
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

                findByIdSpy.mockResolvedValue({ id: TEST_PET_ID });
                updateSpy.mockResolvedValue(mockUpdatePet);

                const result = await petsService.update(TEST_PET_ID, TEST_USER_ID, updatePetDto);

                expect(result).toEqual(mockUpdatePet);
                expect(findByIdSpy).toHaveBeenCalledWith(TEST_PET_ID, TEST_USER_ID, { id: true });
                expect(findByIdSpy).toHaveBeenCalledTimes(1);
                expect(updateSpy).toHaveBeenCalledWith(TEST_PET_ID, updatePetDto, PET_DETAIL_SELECT);
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

                findByIdSpy.mockResolvedValue({ id: TEST_PET_ID });
                updateSpy.mockResolvedValue(mockUpdatePet);

                const result = await petsService.update(TEST_PET_ID, TEST_USER_ID, updatePetDto);

                expect(result).toEqual(mockUpdatePet);
                expect(findByIdSpy).toHaveBeenCalledWith(TEST_PET_ID, TEST_USER_ID, { id: true });
                expect(findByIdSpy).toHaveBeenCalledTimes(1);
                expect(updateSpy).toHaveBeenCalledWith(TEST_PET_ID, updatePetDto, PET_DETAIL_SELECT);
                expect(updateSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("펫 정보 업데이트 실패", () => {
            it("로그인한 유저에 대한 펫 정보를 DB에서 찾지 못하여 오류를 반환한다.", async () => {
                const updatePetDto = { name: "호동이" };

                findByIdSpy.mockResolvedValue(null);

                await expect(petsService.update(TEST_PET_ID, TEST_USER_ID, updatePetDto)).rejects.toThrow(
                    new NotFoundException("Pet not exists."),
                );
                expect(findByIdSpy).toHaveBeenCalledWith(TEST_PET_ID, TEST_USER_ID, { id: true });
                expect(findByIdSpy).toHaveBeenCalledTimes(1);
                expect(updateSpy).toHaveBeenCalledTimes(0);
            });
        });
    });

    describe("remove", () => {
        it("펫을 성공적으로 삭제한다.", async () => {
            findByIdSpy.mockResolvedValue({ id: TEST_PET_ID });
            deleteSpy.mockResolvedValue(undefined);

            const result = await petsService.remove(TEST_PET_ID, TEST_USER_ID);

            expect(result).toBeUndefined();
            expect(findByIdSpy).toHaveBeenCalledWith(TEST_PET_ID, TEST_USER_ID, { id: true });
            expect(findByIdSpy).toHaveBeenCalledTimes(1);
            expect(deleteSpy).toHaveBeenCalledWith(TEST_PET_ID);
            expect(deleteSpy).toHaveBeenCalledTimes(1);
        });

        it("로그인한 유저에 대한 펫 정보를 DB에서 찾지 못하여 오류를 반환한다.", async () => {
            findByIdSpy.mockResolvedValue(null);

            await expect(petsService.remove(TEST_PET_ID, TEST_USER_ID)).rejects.toThrow(
                new NotFoundException("Pet not exists."),
            );
            expect(findByIdSpy).toHaveBeenCalledWith(TEST_PET_ID, TEST_USER_ID, { id: true });
            expect(findByIdSpy).toHaveBeenCalledTimes(1);
            expect(deleteSpy).toHaveBeenCalledTimes(0);
        });
    });
});
