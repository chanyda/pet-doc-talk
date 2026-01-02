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
    let createSpy: jest.SpyInstance;
    let findByIdSpy: jest.SpyInstance;

    const TEST_USER_ID = 1;
    const TEST_PET_ID = 1;

    // NOTE: 서비스의 private readonly PET_DETAIL_SELECT와 동일한 값이어야 함
    const PET_DETAIL_SELECT = {
        id: true,
        name: true,
        type: true,
        gender: true,
        breed: true,
        weight: true,
        birthDate: true,
        isNeutered: true,
        imageUrl: true,
    };

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                PetsService,
                {
                    provide: PetsRepository,
                    useValue: {
                        create: jest.fn(),
                        findById: jest.fn(),
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
        createSpy = jest.spyOn(petsRepository, "create");
        findByIdSpy = jest.spyOn(petsRepository, "findById");
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
});
