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

    const TEST_USER_ID = 1;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                PetsService,
                {
                    provide: PetsRepository,
                    useValue: {
                        create: jest.fn(),
                    },
                },
                {
                    provide: UsersService,
                    useValue: {
                        existsByUserId: jest.fn(),
                    },
                },
            ],
        }).compile();

        petsService = moduleRef.get(PetsService);
        petsRepository = moduleRef.get(PetsRepository);
        usersService = moduleRef.get(UsersService);

        existsByUserIdSpy = jest.spyOn(usersService, "existsByUserId");
        createSpy = jest.spyOn(petsRepository, "create");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        const requiredCreatePetDto = {
            name: "호두",
            type: PetType.DOG,
            gender: PetGender.MALE,
            breed: "믹스",
        };

        const selectPetOptions = {
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

        describe("펫 생성 성공", () => {
            it("필수로 필요한 정보만으로 펫을 생성하여 펫 정보를 반환한다.", async () => {
                const mockPet = {
                    id: 1,
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
                expect(createSpy).toHaveBeenCalledWith(TEST_USER_ID, requiredCreatePetDto, selectPetOptions);
                expect(createSpy).toHaveBeenCalledTimes(1);
            });

            it("필수 정보 포함 일부 선택 정보로 펫을 생성하여 펫 정보를 반환한다. (필수 정보 + weight + birthDate)", async () => {
                const createPetDto = {
                    ...requiredCreatePetDto,
                    weight: new Decimal(5.85),
                    birthDate: "2025-01-01T00:00:00Z",
                };
                const mockPet = {
                    id: 1,
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
                expect(createSpy).toHaveBeenCalledWith(TEST_USER_ID, createPetDto, selectPetOptions);
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
                    id: 1,
                    ...createPetDto,
                };

                existsByUserIdSpy.mockResolvedValue(true);
                createSpy.mockResolvedValue(mockPet);

                const result = await petsService.create(TEST_USER_ID, createPetDto);

                expect(result).toEqual(mockPet);
                expect(existsByUserIdSpy).toHaveBeenCalledWith(TEST_USER_ID);
                expect(existsByUserIdSpy).toHaveBeenCalledTimes(1);
                expect(createSpy).toHaveBeenCalledWith(TEST_USER_ID, createPetDto, selectPetOptions);
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
