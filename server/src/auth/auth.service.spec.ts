import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import { AuthService } from "./auth.service";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { LoginFrom } from "generated/prisma/enums";

// @Transactional() 데코레이터 모킹 (원래 함수를 그대로 반환하도록 함)
jest.mock("@nestjs-cls/transactional", () => ({
    Transactional: () => (_: any, __: string, descriptor: PropertyDescriptor) => {
        return descriptor;
    },
}));
jest.mock("nanoid", () => ({
    nanoid: jest.fn(() => "exampleNickname"),
}));

const TEST_USER_ID = 1;
const accessToken = "accessToken";
const refreshToken = "refreshToken";

describe("AuthService", () => {
    let authService: AuthService;
    let userService: UsersService;

    let jwtService: JwtService;

    let userFindByEmailSpy: jest.SpyInstance;
    let userExistsByNicknameSpy: jest.SpyInstance;
    let userCreateSpy: jest.SpyInstance;
    let userUpdateByIdSpy: jest.SpyInstance;
    let userUpdateRefreshTokenSpy: jest.SpyInstance;
    let jwtVerifySpy: jest.SpyInstance;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: {
                        findByEmail: jest.fn(),
                        updateById: jest.fn(),
                        updateRefreshToken: jest.fn(),
                        existsByNickname: jest.fn(),
                        create: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest
                            .fn()
                            .mockImplementation((payload: { userId: number; email: string; isRefresh?: boolean }) => {
                                return payload.isRefresh ? refreshToken : accessToken;
                            }),
                        verify: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        getOrThrow: jest.fn().mockImplementation((key: string) => {
                            if (key === "auth.secretKey") return "test-secret-key";
                            if (key === "auth.accessTokenExpTime") return "1d";
                            if (key === "auth.refreshTokenExpTime") return "30d";
                            return "";
                        }),
                    },
                },
            ],
        }).compile();

        jest.spyOn(console, "error").mockImplementation(jest.fn());

        authService = moduleRef.get(AuthService);
        userService = moduleRef.get(UsersService);
        jwtService = moduleRef.get(JwtService);

        userFindByEmailSpy = jest.spyOn(userService, "findByEmail");
        userExistsByNicknameSpy = jest.spyOn(userService, "existsByNickname");
        userCreateSpy = jest.spyOn(userService, "create");
        userUpdateByIdSpy = jest.spyOn(userService, "updateById");
        userUpdateRefreshTokenSpy = jest.spyOn(userService, "updateRefreshToken");
        jwtVerifySpy = jest.spyOn(jwtService, "verify");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("login", () => {
        const loginDto = {
            email: "test@example.com",
            name: "Tester",
            loginFrom: LoginFrom.KAKAO,
        };

        const mockUser = {
            id: 1,
            email: loginDto.email,
            name: loginDto.name,
            nickname: "Tester",
            refreshToken: "",
            loginFrom: loginDto.loginFrom,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        describe("기존 회원 - email이 이미 존재하는 경우", () => {
            it("다른 provider로 로그인하려는 경우 에러를 반환한다.", async () => {
                userFindByEmailSpy.mockResolvedValue({ ...mockUser, loginFrom: LoginFrom.APPLE });

                await expect(authService.login(loginDto)).rejects.toThrow(
                    new BadRequestException("Already signed up using APPLE."),
                );

                expect(userExistsByNicknameSpy).not.toHaveBeenCalled();
                expect(userCreateSpy).not.toHaveBeenCalled();
                expect(userUpdateByIdSpy).not.toHaveBeenCalled();
            });

            it("동일한 provider인 경우 토큰을 발급한다.", async () => {
                userFindByEmailSpy.mockResolvedValue(mockUser);
                userUpdateByIdSpy.mockResolvedValue({ ...mockUser, refreshToken });

                const result = await authService.login(loginDto);

                expect(result).toEqual({ accessToken, refreshToken, isNewUser: false });
                expect(userFindByEmailSpy).toHaveBeenCalledWith(loginDto.email);
                expect(userUpdateByIdSpy).toHaveBeenCalledWith(mockUser.id, { refreshToken });
                expect(userExistsByNicknameSpy).not.toHaveBeenCalled();
                expect(userCreateSpy).not.toHaveBeenCalled();
            });
        });

        describe("신규 회원", () => {
            it("회원을 생성하고 토큰을 발급한다.", async () => {
                userFindByEmailSpy.mockResolvedValue(null);
                userExistsByNicknameSpy
                    .mockResolvedValueOnce(true) // 첫 번째 시도: 닉네임 존재
                    .mockResolvedValueOnce(true) // 두 번째 시도: 닉네임 존재
                    .mockResolvedValueOnce(false); // 세 번째 시도: 닉네임 없음 (성공)
                userCreateSpy.mockResolvedValue({
                    id: 1,
                    email: loginDto.email,
                    name: loginDto.name,
                    nickname: "user_exampleNickname",
                    loginFrom: loginDto.loginFrom,
                    refreshToken: "",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                userUpdateByIdSpy.mockResolvedValue({
                    id: 1,
                    email: loginDto.email,
                    name: loginDto.name,
                    nickname: "user_exampleNickname",
                    loginFrom: loginDto.loginFrom,
                    refreshToken,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                const result = await authService.login(loginDto);

                expect(result).toEqual({ accessToken, refreshToken, isNewUser: true });
                expect(userFindByEmailSpy).toHaveBeenCalledWith(loginDto.email);
                expect(userExistsByNicknameSpy).toHaveBeenCalledTimes(3);
                expect(userCreateSpy).toHaveBeenCalledWith({
                    ...loginDto,
                    refreshToken: "",
                    nickname: "user_exampleNickname",
                });
                expect(userUpdateByIdSpy).toHaveBeenCalledWith(1, { refreshToken });
            });
        });
    });

    describe("clearRefreshToken", () => {
        it("Refresh Token 초기화에 성공한다.", async () => {
            userUpdateByIdSpy.mockResolvedValue({
                id: TEST_USER_ID,
                email: "tester@nomail.com",
                name: "Tester",
                nickname: "Tester",
                loginFrom: "KAKAO",
                profileImageUrl: null,
                refreshToken: "",
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const result = await authService.clearRefreshToken(TEST_USER_ID);

            expect(result).toBeUndefined();
            expect(userUpdateByIdSpy).toHaveBeenCalledWith(TEST_USER_ID, { refreshToken: "" });
            expect(userUpdateByIdSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("refresh", () => {
        const oldAccessToken = "oldAccessToken";
        const oldRefreshToken = "oldRefreshToken";

        const mockAccessTokenPayload = {
            userId: TEST_USER_ID,
            email: "test@example.com",
            iat: 1000000,
            exp: 2000000,
        };

        const mockRefreshTokenPayload = {
            userId: TEST_USER_ID,
            email: "test@example.com",
            isRefresh: true,
            iat: 1000000,
            exp: 2000000,
        };

        const mockUser = {
            id: TEST_USER_ID,
            email: "test@example.com",
            name: "Tester",
            nickname: "Tester",
            loginFrom: "KAKAO",
            refreshToken: oldRefreshToken,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        describe("토큰 갱신 성공", () => {
            it("토큰 갱신에 성공하면 새로운 토큰을 반환한다.", async () => {
                jwtVerifySpy.mockReturnValueOnce(mockAccessTokenPayload).mockReturnValueOnce(mockRefreshTokenPayload);
                userFindByEmailSpy.mockResolvedValue(mockUser);
                userUpdateRefreshTokenSpy.mockResolvedValue({ refreshToken });

                const result = await authService.refresh(oldAccessToken, oldRefreshToken);

                expect(result).toEqual({ accessToken, refreshToken });
                expect(userFindByEmailSpy).toHaveBeenCalledWith(mockRefreshTokenPayload.email);
                expect(userFindByEmailSpy).toHaveBeenCalledTimes(1);
                expect(userUpdateRefreshTokenSpy).toHaveBeenCalledWith(mockUser.id, oldRefreshToken, refreshToken);
                expect(userUpdateRefreshTokenSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("토큰 갱신 실패", () => {
            it("토큰 검증에 실패하면 UnauthorizedException을 반환한다.", async () => {
                jwtVerifySpy.mockImplementation(() => {
                    throw new Error("Invalid token");
                });

                await expect(authService.refresh(oldAccessToken, oldRefreshToken)).rejects.toThrow(
                    new UnauthorizedException("Invalid token."),
                );

                expect(jwtVerifySpy).toHaveBeenCalledTimes(1);
                expect(userFindByEmailSpy).not.toHaveBeenCalled();
                expect(userUpdateRefreshTokenSpy).not.toHaveBeenCalled();
            });

            it("AccessToken payload에 필수 필드가 없으면 UnauthorizedException을 반환한다.", async () => {
                jwtVerifySpy
                    .mockReturnValueOnce({ iat: 1000000, exp: 2000000 })
                    .mockReturnValueOnce(mockRefreshTokenPayload); // accessToken: userId, email 없음

                await expect(authService.refresh(oldAccessToken, oldRefreshToken)).rejects.toThrow(
                    new UnauthorizedException("Invalid token."),
                );

                expect(jwtVerifySpy).toHaveBeenCalledTimes(2);
                expect(userFindByEmailSpy).not.toHaveBeenCalled();
                expect(userUpdateRefreshTokenSpy).not.toHaveBeenCalled();
            });

            it("RefreshToken payload에 isRefresh가 없으면 UnauthorizedException을 반환한다.", async () => {
                jwtVerifySpy
                    .mockReturnValueOnce(mockAccessTokenPayload)
                    .mockReturnValueOnce({ ...mockRefreshTokenPayload, isRefresh: false });

                await expect(authService.refresh(oldAccessToken, oldRefreshToken)).rejects.toThrow(
                    new UnauthorizedException("Invalid token."),
                );

                expect(jwtVerifySpy).toHaveBeenCalledTimes(2);
                expect(userFindByEmailSpy).not.toHaveBeenCalled();
                expect(userUpdateRefreshTokenSpy).not.toHaveBeenCalled();
            });

            it("AccessToken과 RefreshToken의 payload가 일치하지 않으면 UnauthorizedException을 반환한다.", async () => {
                jwtVerifySpy
                    .mockReturnValueOnce(mockAccessTokenPayload)
                    .mockReturnValueOnce({ ...mockRefreshTokenPayload, email: "other@example.com" });

                await expect(authService.refresh(oldAccessToken, oldRefreshToken)).rejects.toThrow(
                    new UnauthorizedException("Invalid token."),
                );

                expect(jwtVerifySpy).toHaveBeenCalledTimes(2);
                expect(userFindByEmailSpy).not.toHaveBeenCalled();
                expect(userUpdateRefreshTokenSpy).not.toHaveBeenCalled();
            });

            it("유저가 존재하지 않으면 UnauthorizedException을 반환한다.", async () => {
                jwtVerifySpy.mockReturnValueOnce(mockAccessTokenPayload).mockReturnValueOnce(mockRefreshTokenPayload);
                userFindByEmailSpy.mockResolvedValue(null);

                await expect(authService.refresh(oldAccessToken, oldRefreshToken)).rejects.toThrow(
                    new UnauthorizedException("Invalid token."),
                );

                expect(jwtVerifySpy).toHaveBeenCalledTimes(2);
                expect(userFindByEmailSpy).toHaveBeenCalledWith(mockRefreshTokenPayload.email);
                expect(userFindByEmailSpy).toHaveBeenCalledTimes(1);
                expect(userUpdateRefreshTokenSpy).not.toHaveBeenCalled();
            });

            it("저장된 Refresh Token과 일치하지 않으면 UnauthorizedException을 반환한다.", async () => {
                jwtVerifySpy.mockReturnValueOnce(mockAccessTokenPayload).mockReturnValueOnce(mockRefreshTokenPayload);
                userFindByEmailSpy.mockResolvedValue({ ...mockUser, refreshToken: "differentToken" });

                await expect(authService.refresh(oldAccessToken, oldRefreshToken)).rejects.toThrow(
                    new UnauthorizedException("Invalid token."),
                );

                expect(jwtVerifySpy).toHaveBeenCalledTimes(2);
                expect(userFindByEmailSpy).toHaveBeenCalledWith(mockRefreshTokenPayload.email);
                expect(userFindByEmailSpy).toHaveBeenCalledTimes(1);
                expect(userUpdateRefreshTokenSpy).not.toHaveBeenCalled();
            });
        });
    });
});
