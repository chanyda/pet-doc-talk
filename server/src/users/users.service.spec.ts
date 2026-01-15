import { Test, TestingModule } from "@nestjs/testing";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { LoginFrom } from "generated/prisma/enums";
import { USER_PROFILE_SELECT, UserProfileSelect } from "./constants";
import { UserGetPayload } from "generated/prisma/models";
import { FindProfileResponseDto } from "./dtos/responses/find-profile-response.dto";

jest.mock("@nestjs-cls/transactional", () => ({
    Transactional: () => (_: any, __: string, descriptor: PropertyDescriptor) => {
        return descriptor;
    },
}));

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

    describe("findProfile", () => {
        it("사용자의 프로필 찾기에 성공하여 정보를 반환한다.", async () => {
            const mockUserProfile = {
                id: TEST_USER_ID,
                email: TEST_EMAIL,
                name: TEST_NAME,
                nickname: TEST_NICKNAME,
                profileImageUrl: null,
                _count: {
                    posts: 10,
                },
            };
            const profileResponse = toProfileResponse(mockUserProfile);

            findByIdSpy.mockResolvedValue(mockUserProfile);

            const result = await usersService.findProfile(TEST_USER_ID);

            expect(result).toEqual(profileResponse);
            expect(findByIdSpy).toHaveBeenCalledWith(TEST_USER_ID, USER_PROFILE_SELECT);
            expect(findByIdSpy).toHaveBeenCalledTimes(1);
        });

        it("사용자의 프로필 찾기에 실패하여 오류를 반환한다.", async () => {
            findByIdSpy.mockResolvedValue(null);

            await expect(usersService.findProfile(TEST_USER_ID)).rejects.toThrow(
                new NotFoundException("User not exists."),
            );
            expect(findByIdSpy).toHaveBeenCalledWith(TEST_USER_ID, USER_PROFILE_SELECT);
            expect(findByIdSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("updateProfile", () => {
        describe("프로필 업데이트 성공", () => {
            it("nickname 변경에 성공하여 프로필 정보를 반환한다.", async () => {
                const updateProfileDto = { nickname: "CHANGE_NICKNAME" };
                const updateMockUserProfile = {
                    id: TEST_USER_ID,
                    email: TEST_EMAIL,
                    name: TEST_NAME,
                    nickname: updateProfileDto.nickname,
                    profileImageUrl: null,
                    _count: {
                        posts: 10,
                    },
                };
                const profileResponse = toProfileResponse(updateMockUserProfile);

                findByIdSpy.mockResolvedValue({ id: TEST_USER_ID });
                findByNicknameSpy.mockResolvedValue(null);
                updateByIdSpy.mockResolvedValue(updateMockUserProfile);

                const result = await usersService.updateProfile(TEST_USER_ID, updateProfileDto);

                expect(result).toEqual(profileResponse);
                expect(findByIdSpy).toHaveBeenCalledWith(TEST_USER_ID, { id: true });
                expect(findByIdSpy).toHaveBeenCalledTimes(1);
                expect(findByNicknameSpy).toHaveBeenCalledWith(updateMockUserProfile.nickname, TEST_USER_ID, {
                    id: true,
                });
                expect(findByNicknameSpy).toHaveBeenCalledTimes(1);
                expect(updateByIdSpy).toHaveBeenCalledWith(TEST_USER_ID, updateProfileDto, USER_PROFILE_SELECT);
                expect(updateByIdSpy).toHaveBeenCalledTimes(1);
            });

            it("profileImageUrl 변경에 성공하여 프로필 정보를 반환한다.", async () => {
                const updateProfileDto = { profileImageUrl: "http://test.com" };
                const updateMockUserProfile = {
                    id: TEST_USER_ID,
                    email: TEST_EMAIL,
                    name: TEST_NAME,
                    nickname: TEST_NICKNAME,
                    profileImageUrl: updateProfileDto.profileImageUrl,
                    _count: {
                        posts: 10,
                    },
                };
                const profileResponse = toProfileResponse(updateMockUserProfile);

                findByIdSpy.mockResolvedValue({ id: TEST_USER_ID });
                updateByIdSpy.mockResolvedValue(updateMockUserProfile);

                const result = await usersService.updateProfile(TEST_USER_ID, updateProfileDto);

                expect(result).toEqual(profileResponse);
                expect(findByIdSpy).toHaveBeenCalledWith(TEST_USER_ID, { id: true });
                expect(findByIdSpy).toHaveBeenCalledTimes(1);
                expect(findByNicknameSpy).not.toHaveBeenCalled();
                expect(updateByIdSpy).toHaveBeenCalledWith(TEST_USER_ID, updateProfileDto, USER_PROFILE_SELECT);
                expect(updateByIdSpy).toHaveBeenCalledTimes(1);
            });

            it("profileImageUrl, nickname 변경에 성공하여 프로필 정보를 반환한다.", async () => {
                const updateProfileDto = { profileImageUrl: "http://test.com", nickname: "CHANGE_NICKNAME" };
                const updateMockUserProfile = {
                    id: TEST_USER_ID,
                    email: TEST_EMAIL,
                    name: TEST_NAME,
                    nickname: updateProfileDto.nickname,
                    profileImageUrl: updateProfileDto.profileImageUrl,
                    _count: {
                        posts: 10,
                    },
                };
                const profileResponse = toProfileResponse(updateMockUserProfile);

                findByIdSpy.mockResolvedValue({ id: TEST_USER_ID });
                findByNicknameSpy.mockResolvedValue(null);
                updateByIdSpy.mockResolvedValue(updateMockUserProfile);

                const result = await usersService.updateProfile(TEST_USER_ID, updateProfileDto);

                expect(result).toEqual(profileResponse);
                expect(findByIdSpy).toHaveBeenCalledWith(TEST_USER_ID, { id: true });
                expect(findByIdSpy).toHaveBeenCalledTimes(1);
                expect(findByNicknameSpy).toHaveBeenCalledWith(updateMockUserProfile.nickname, TEST_USER_ID, {
                    id: true,
                });
                expect(findByNicknameSpy).toHaveBeenCalledTimes(1);
                expect(updateByIdSpy).toHaveBeenCalledWith(TEST_USER_ID, updateProfileDto, USER_PROFILE_SELECT);
                expect(updateByIdSpy).toHaveBeenCalledTimes(1);
            });

            it("빈 객체가 넘어온 경우 업데이트할 요소가 없으므로 기존 프로필 정보를 반환한다.", async () => {
                const updateProfileDto = {};
                const updateMockUserProfile = {
                    id: TEST_USER_ID,
                    email: TEST_EMAIL,
                    name: TEST_NAME,
                    nickname: TEST_NICKNAME,
                    profileImageUrl: null,
                    _count: {
                        posts: 10,
                    },
                };
                const profileResponse = toProfileResponse(updateMockUserProfile);

                findByIdSpy.mockResolvedValue({ id: TEST_USER_ID });
                updateByIdSpy.mockResolvedValue(updateMockUserProfile);

                const result = await usersService.updateProfile(TEST_USER_ID, updateProfileDto);

                expect(result).toEqual(profileResponse);
                expect(findByIdSpy).toHaveBeenCalledWith(TEST_USER_ID, { id: true });
                expect(findByIdSpy).toHaveBeenCalledTimes(1);
                expect(findByNicknameSpy).not.toHaveBeenCalled();
                expect(updateByIdSpy).toHaveBeenCalledWith(TEST_USER_ID, updateProfileDto, USER_PROFILE_SELECT);
                expect(updateByIdSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("프로필 업데이트 실패", () => {
            const updateProfileDto = { nickname: "CHANGE_NICKNAME" };

            it("변경하려는 유저 정보를 DB에서 찾지 못하여 오류를 반환한다.", async () => {
                findByIdSpy.mockResolvedValue(null);

                await expect(usersService.updateProfile(TEST_USER_ID, updateProfileDto)).rejects.toThrow(
                    new NotFoundException("User not exists."),
                );
                expect(findByIdSpy).toHaveBeenCalledWith(TEST_USER_ID, { id: true });
                expect(findByIdSpy).toHaveBeenCalledTimes(1);
                expect(findByNicknameSpy).not.toHaveBeenCalled();
                expect(updateByIdSpy).not.toHaveBeenCalled();
            });

            it("변경하려는 닉네임을 가진 사용자가 이미 존재하여 오류를 반환한다.", async () => {
                findByIdSpy.mockResolvedValue({ id: TEST_USER_ID });
                findByNicknameSpy.mockResolvedValue({ id: 2 });

                await expect(usersService.updateProfile(TEST_USER_ID, updateProfileDto)).rejects.toThrow(
                    new BadRequestException("This nickname is already in use."),
                );
                expect(findByIdSpy).toHaveBeenCalledWith(TEST_USER_ID, { id: true });
                expect(findByIdSpy).toHaveBeenCalledTimes(1);
                expect(findByNicknameSpy).toHaveBeenCalledWith(updateProfileDto.nickname, TEST_USER_ID, { id: true });
                expect(findByNicknameSpy).toHaveBeenCalledTimes(1);
                expect(updateByIdSpy).not.toHaveBeenCalled();
            });
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

            findByIdSpy.mockResolvedValue({ id: TEST_USER_ID });
            updateByIdSpy.mockResolvedValue(updateMockUser);

            const result = await usersService.updateById(TEST_USER_ID, updateUserDto);

            expect(result).toEqual(updateMockUser);
            expect(findByIdSpy).toHaveBeenCalledWith(TEST_USER_ID, { id: true });
            expect(findByIdSpy).toHaveBeenCalledTimes(1);
            expect(updateByIdSpy).toHaveBeenCalledWith(TEST_USER_ID, updateUserDto);
            expect(updateByIdSpy).toHaveBeenCalledTimes(1);
        });

        it("사용자 정보 업데이트 시 id에 대한 사용자 정보 찾기에 실패하여 오류를 반환한다.", async () => {
            findByIdSpy.mockResolvedValue(null);

            await expect(usersService.updateById(TEST_USER_ID, updateUserDto)).rejects.toThrow(
                new NotFoundException("User not exists."),
            );
            expect(findByIdSpy).toHaveBeenCalledWith(TEST_USER_ID, { id: true });
            expect(findByIdSpy).toHaveBeenCalledTimes(1);
            expect(updateByIdSpy).not.toHaveBeenCalled();
        });
    });
});

function toProfileResponse(user: UserGetPayload<{ select: UserProfileSelect }>): FindProfileResponseDto {
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        nickname: user.nickname,
        profileImageUrl: user.profileImageUrl,
        postCount: user._count.posts,
    };
}
