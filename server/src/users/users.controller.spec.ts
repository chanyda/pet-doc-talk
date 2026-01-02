import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { AuthRequest } from "src/types/request.type";

describe("UsersController", () => {
    let usersController: UsersController;
    let usersService: UsersService;

    let findProfileSpy: jest.SpyInstance;
    let updateProfileSpy: jest.SpyInstance;

    const now = Math.floor(Date.now() / 1000);
    const mockReq: AuthRequest = {
        user: {
            userId: 1,
            email: "test@example.com",
            iat: now,
            exp: now + 10 * 24 * 60 * 60, // 10일 뒤
        },
    } as AuthRequest;

    const mockUserProfile = {
        id: 1,
        email: "test@example.com",
        name: "Tester",
        nickname: "Tester",
        profileImageUrl: null,
    };

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: {
                        findProfile: jest.fn(),
                        updateProfile: jest.fn(),
                    },
                },
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        usersController = moduleRef.get(UsersController);
        usersService = moduleRef.get(UsersService);

        findProfileSpy = jest.spyOn(usersService, "findProfile");
        updateProfileSpy = jest.spyOn(usersService, "updateProfile");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("findProfile", () => {
        it("프로필 정보를 가져오기에 성공하여 프로필 정보를 반환한다.", async () => {
            findProfileSpy.mockResolvedValue(mockUserProfile);

            const result = await usersController.findProfile(mockReq);

            expect(result).toEqual(mockUserProfile);
            expect(findProfileSpy).toHaveBeenCalledWith(mockReq.user.userId);
            expect(findProfileSpy).toHaveBeenCalledTimes(1);
        });

        it("이메일에 대한 프로필 정보가 없어서 오류가 발생한다.", async () => {
            findProfileSpy.mockRejectedValue(new NotFoundException("User not exists."));

            await expect(usersController.findProfile(mockReq)).rejects.toThrow(
                new NotFoundException("User not exists."),
            );
            expect(findProfileSpy).toHaveBeenCalledWith(mockReq.user.userId);
            expect(findProfileSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("updateProfile", () => {
        describe("프로필 업데이트 성공", () => {
            it("닉네임만 변경했고, 변경된 닉네임이 적용된 프로필 정보를 반환한다.", async () => {
                const updateProfileDto = { nickname: "CHANGE_NICKNAME" };
                const updateMockUserProfile = { ...mockUserProfile, ...updateProfileDto };

                updateProfileSpy.mockResolvedValue(updateMockUserProfile);

                const result = await usersController.updateProfile(mockReq, updateProfileDto);

                expect(result).toEqual(updateMockUserProfile);
                expect(updateProfileSpy).toHaveBeenCalledWith(mockReq.user.userId, updateProfileDto);
                expect(updateProfileSpy).toHaveBeenCalledTimes(1);
            });

            it("프로필 이미지만 변경했고, 변경된 프로필 이미지가 적용된 프로필 정보를 반환한다.", async () => {
                const updateProfileDto = { profileImageUrl: "http://test.com" };
                const updateMockUserProfile = { ...mockUserProfile, ...updateProfileDto };

                updateProfileSpy.mockResolvedValue(updateMockUserProfile);

                const result = await usersController.updateProfile(mockReq, updateProfileDto);

                expect(result).toEqual(updateMockUserProfile);
                expect(updateProfileSpy).toHaveBeenCalledWith(mockReq.user.userId, updateProfileDto);
                expect(updateProfileSpy).toHaveBeenCalledTimes(1);
            });

            it("닉네임과 프로필 이미지 모두 변경했고, 변경된 정보가 적용된 프로필 정보를 반환한다.", async () => {
                const updateProfileDto = { nickname: "CHANGE_NICKNAME", profileImageUrl: "http://test.com" };
                const updateMockUserProfile = { ...mockUserProfile, ...updateProfileDto };

                updateProfileSpy.mockResolvedValue(updateMockUserProfile);

                const result = await usersController.updateProfile(mockReq, updateProfileDto);

                expect(result).toEqual(updateMockUserProfile);
                expect(updateProfileSpy).toHaveBeenCalledWith(mockReq.user.userId, updateProfileDto);
                expect(updateProfileSpy).toHaveBeenCalledTimes(1);
            });
        });

        it("빈 객체가 넘어온 경우 업데이트할 요소가 없으므로 기존 프로필 정보를 반환한다.", async () => {
            updateProfileSpy.mockResolvedValue(mockUserProfile);

            const result = await usersController.updateProfile(mockReq, {});

            expect(result).toEqual(mockUserProfile);
            expect(updateProfileSpy).toHaveBeenCalledWith(mockReq.user.userId, {});
            expect(updateProfileSpy).toHaveBeenCalledTimes(1);
        });

        describe("프로필 업데이트 실패", () => {
            it("변경하려는 유저 정보를 DB에서 찾지 못하여 오류를 반환한다.", async () => {
                updateProfileSpy.mockRejectedValue(new NotFoundException("User not exists."));

                await expect(usersController.updateProfile(mockReq, { nickname: "CHANGE_NICKNAME" })).rejects.toThrow(
                    new NotFoundException("User not exists."),
                );
                expect(updateProfileSpy).toHaveBeenCalledWith(mockReq.user.userId, { nickname: "CHANGE_NICKNAME" });
                expect(updateProfileSpy).toHaveBeenCalledTimes(1);
            });

            it("변경하려는 닉네임을 가진 사용자가 이미 존재하여 오류를 반환한다.", async () => {
                updateProfileSpy.mockRejectedValue(new BadRequestException("This nickname is already in use."));

                await expect(usersController.updateProfile(mockReq, { nickname: "CHANGE_NICKNAME" })).rejects.toThrow(
                    new BadRequestException("This nickname is already in use."),
                );
                expect(updateProfileSpy).toHaveBeenCalledWith(mockReq.user.userId, { nickname: "CHANGE_NICKNAME" });
                expect(updateProfileSpy).toHaveBeenCalledTimes(1);
            });
        });
    });
});
