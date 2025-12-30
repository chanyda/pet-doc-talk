import { Test, TestingModule } from "@nestjs/testing";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";
import { LoginFrom } from "src/auth/auth.enums";
import { NotFoundException } from "@nestjs/common";

describe("UsersService", () => {
    let usersService: UsersService;
    let usersRepository: UsersRepository;

    let createSpy: jest.SpyInstance;
    let findByIdSpy: jest.SpyInstance;
    let findByEmailSpy: jest.SpyInstance;
    let findByNicknameSpy: jest.SpyInstance;
    let updateByIdSpy: jest.SpyInstance;

    const TEST_EMAIL = "test@example.com";
    const TEST_NAME = "Tester";
    const TEST_NICKNAME = "Tester";
    const TEST_USER_ID = 1;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: UsersRepository,
                    useValue: {
                        create: jest.fn(),
                        findById: jest.fn(),
                        findByEmail: jest.fn(),
                        findByNickname: jest.fn(),
                        updateById: jest.fn(),
                    },
                },
            ],
        }).compile();

        usersService = moduleRef.get(UsersService);
        usersRepository = moduleRef.get(UsersRepository);

        createSpy = jest.spyOn(usersRepository, "create");
        findByIdSpy = jest.spyOn(usersRepository, "findById");
        findByEmailSpy = jest.spyOn(usersRepository, "findByEmail");
        findByNicknameSpy = jest.spyOn(usersRepository, "findByNickname");
        updateByIdSpy = jest.spyOn(usersRepository, "updateById");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("사용자를 생성하기에 성공하여 사용자를 반환한다.", async () => {
            const createUserDto = {
                email: TEST_EMAIL,
                name: TEST_NAME,
                nickname: TEST_NICKNAME,
                loginFrom: LoginFrom.KAKAO,
                refreshToken: "",
            };
            const mockUser = {
                ...createUserDto,
                id: TEST_USER_ID,
                profileImageUrl: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            createSpy.mockResolvedValue(mockUser);

            const result = await usersService.create(createUserDto);

            expect(result).toEqual(mockUser);
            expect(createSpy).toHaveBeenCalledWith(createUserDto);
            expect(createSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("findByEmail", () => {
        it("이메일에 대한 사용자를 찾기에 성공하여 사용자를 반환한다.", async () => {
            const mockUser = {
                id: TEST_USER_ID,
                email: TEST_EMAIL,
                name: TEST_NAME,
                nickname: TEST_NICKNAME,
                loginFrom: LoginFrom.KAKAO,
                profileImageUrl: null,
                refreshToken: "",
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            findByEmailSpy.mockResolvedValue(mockUser);

            const result = await usersService.findByEmail(TEST_EMAIL);

            expect(result).toEqual(mockUser);
            expect(findByEmailSpy).toHaveBeenCalledWith(TEST_EMAIL);
            expect(findByEmailSpy).toHaveBeenCalledTimes(1);
        });

        it("이메일에 대한 사용자가 없어서 null을 반환한다.", async () => {
            findByEmailSpy.mockResolvedValue(null);

            const result = await usersService.findByEmail(TEST_EMAIL);

            expect(result).toBeNull();
            expect(findByEmailSpy).toHaveBeenCalledWith(TEST_EMAIL);
            expect(findByEmailSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("existsByNickname", () => {
        it("동일한 닉네임을 가진 사용자가 있어서 true를 반환한다.", async () => {
            findByNicknameSpy.mockResolvedValue({ id: 2 });

            const result = await usersService.existsByNickname(TEST_NICKNAME);

            expect(result).toBeTruthy();
            expect(findByNicknameSpy).toHaveBeenCalledWith(TEST_NICKNAME, undefined, { id: true });
            expect(findByNicknameSpy).toHaveBeenCalledTimes(1);
        });

        it("동일한 닉네임을 가진 사용자가 없어서 false를 반환한다.", async () => {
            findByNicknameSpy.mockResolvedValue(null);

            const result = await usersService.existsByNickname(TEST_NICKNAME);

            expect(result).toBeFalsy();
            expect(findByNicknameSpy).toHaveBeenCalledWith(TEST_NICKNAME, undefined, { id: true });
            expect(findByNicknameSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("findProfileByEmail", () => {
        const selectUserOptions = {
            id: true,
            email: true,
            name: true,
            nickname: true,
            profileImageUrl: true,
        };

        it("이메일에 대한 사용자의 프로필 찾기에 성공하여 정보를 반환한다.", async () => {
            const mockUserProfile = {
                id: TEST_USER_ID,
                email: TEST_EMAIL,
                name: TEST_NAME,
                nickname: TEST_NICKNAME,
                profileImageUrl: null,
            };

            findByEmailSpy.mockResolvedValue(mockUserProfile);

            const result = await usersService.findProfileByEmail(TEST_EMAIL);

            expect(result).toEqual(mockUserProfile);
            expect(findByEmailSpy).toHaveBeenCalledWith(TEST_EMAIL, selectUserOptions);
            expect(findByEmailSpy).toHaveBeenCalledTimes(1);
        });

        it("이메일에 대한 사용자의 프로필 찾기에 실패하여 오류를 반환한다.", async () => {
            findByEmailSpy.mockResolvedValue(null);

            await expect(usersService.findProfileByEmail(TEST_EMAIL)).rejects.toThrow(
                new NotFoundException("User not exists."),
            );
            expect(findByEmailSpy).toHaveBeenCalledWith(TEST_EMAIL, selectUserOptions);
            expect(findByEmailSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("updateById", () => {
        const mockUser = {
            id: TEST_USER_ID,
            email: TEST_EMAIL,
            name: TEST_NAME,
            nickname: TEST_NICKNAME,
            loginFrom: LoginFrom.KAKAO,
            profileImageUrl: null,
            refreshToken: "",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const updateUserDto = {
            nickname: "ChangeNickname",
            refreshToken: "refreshToken",
            profileImageUrl: "http://test.com",
        };

        it("사용자 정보 업데이트에 성공하여 업데이트된 User 정보를 반환한다.", async () => {
            const updateMockUser = { ...mockUser, ...updateUserDto };

            findByIdSpy.mockResolvedValue(mockUser);
            updateByIdSpy.mockResolvedValue(updateMockUser);

            const result = await usersService.updateById(TEST_USER_ID, updateUserDto);

            expect(result).toEqual(updateMockUser);
            expect(findByIdSpy).toHaveBeenCalledWith(TEST_USER_ID);
            expect(findByIdSpy).toHaveBeenCalledTimes(1);
            expect(updateByIdSpy).toHaveBeenCalledWith(TEST_USER_ID, updateUserDto);
            expect(updateByIdSpy).toHaveBeenCalledTimes(1);
        });

        it("사용자 정보 업데이트 시 id에 대한 사용자 정보 찾기에 실패하여 오류를 반환한다.", async () => {
            findByIdSpy.mockResolvedValue(null);

            await expect(usersService.updateById(TEST_USER_ID, updateUserDto)).rejects.toThrow(
                new NotFoundException("User not exists."),
            );
            expect(findByIdSpy).toHaveBeenCalledWith(TEST_USER_ID);
            expect(findByIdSpy).toHaveBeenCalledTimes(1);
            expect(updateByIdSpy).toHaveBeenCalledTimes(0);
        });
    });
});
