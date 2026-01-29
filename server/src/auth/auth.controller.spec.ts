import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Response } from "express";
import { UnauthorizedException } from "@nestjs/common";
import { LogoutGuard } from "./guards/logout.guard";
import { AuthRequest } from "src/types/request.type";
import { ACCESS_TOKEN_COOKIE_OPTIONS, REFRESH_TOKEN_COOKIE_OPTIONS } from "src/common/constants";

describe("AuthController", () => {
    let authController: AuthController;
    let authService: AuthService;

    const mockResponse = {
        json: jest.fn(),
        cookie: jest.fn().mockReturnThis(),
        clearCookie: jest.fn().mockReturnThis(),
    };

    let refreshSpy: jest.SpyInstance;
    let clearRefreshTokenSpy: jest.SpyInstance;

    const TEST_USER_ID = 1;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        login: jest.fn(),
                        refresh: jest.fn(),
                        clearRefreshToken: jest.fn(),
                    },
                },
            ],
        })
            .overrideGuard(LogoutGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        jest.spyOn(console, "error").mockImplementation(jest.fn());

        authController = moduleRef.get(AuthController);
        authService = moduleRef.get(AuthService);

        refreshSpy = jest.spyOn(authService, "refresh");
        clearRefreshTokenSpy = jest.spyOn(authService, "clearRefreshToken");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("refresh", () => {
        const accessToken = "accessToken";
        const refreshToken = "refreshToken";

        describe("토큰 갱신 성공", () => {
            it("정상적으로 토큰을 갱신하여 새로운 토큰을 쿠키에 설정하고 응답을 반환한다.", async () => {
                const mockTokens = {
                    accessToken: "newAccessToken",
                    refreshToken: "newRefreshToken",
                };

                refreshSpy.mockResolvedValue(mockTokens);

                await authController.refresh(accessToken, refreshToken, mockResponse as unknown as Response);

                expect(refreshSpy).toHaveBeenCalledWith(accessToken, refreshToken);
                expect(refreshSpy).toHaveBeenCalledTimes(1);
                expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
                expect(mockResponse.cookie).toHaveBeenCalledWith(
                    "accessToken",
                    mockTokens.accessToken,
                    ACCESS_TOKEN_COOKIE_OPTIONS,
                );
                expect(mockResponse.cookie).toHaveBeenCalledWith(
                    "refreshToken",
                    mockTokens.refreshToken,
                    REFRESH_TOKEN_COOKIE_OPTIONS,
                );
                expect(mockResponse.json).toHaveBeenCalledWith({ message: "Token refreshed successfully." });
            });
        });

        describe("토큰 갱신 실패", () => {
            it("유효하지 않은 토큰으로 인해 갱신에 실패한다.", async () => {
                refreshSpy.mockRejectedValue(new UnauthorizedException("Invalid token."));

                await expect(
                    authController.refresh(accessToken, refreshToken, mockResponse as unknown as Response),
                ).rejects.toThrow(new UnauthorizedException("Invalid token."));
                expect(refreshSpy).toHaveBeenCalledWith(accessToken, refreshToken);
                expect(refreshSpy).toHaveBeenCalledTimes(1);
                expect(mockResponse.cookie).not.toHaveBeenCalled();
                expect(mockResponse.json).not.toHaveBeenCalled();
            });
        });
    });

    describe("logout", () => {
        const now = Math.floor(Date.now() / 1000);
        let mockRequest: AuthRequest;

        beforeEach(() => {
            mockRequest = {
                isPublic: false,
            } as AuthRequest;
        });

        describe("로그아웃 성공", () => {
            it("로그인된 사용자가 로그아웃하여 refresh token을 초기화하고 쿠키를 삭제한다.", async () => {
                mockRequest = {
                    ...mockRequest,
                    user: {
                        userId: 1,
                        email: "test@example.com",
                        iat: now,
                        exp: now + 10 * 24 * 60 * 60,
                    },
                } as AuthRequest;

                clearRefreshTokenSpy.mockResolvedValue(undefined);

                await authController.logout(mockRequest, mockResponse as unknown as Response);

                expect(clearRefreshTokenSpy).toHaveBeenCalledWith(TEST_USER_ID);
                expect(clearRefreshTokenSpy).toHaveBeenCalledTimes(1);
                expect(mockResponse.clearCookie).toHaveBeenCalledTimes(2);
                expect(mockResponse.clearCookie).toHaveBeenCalledWith("accessToken", ACCESS_TOKEN_COOKIE_OPTIONS);
                expect(mockResponse.clearCookie).toHaveBeenCalledWith("refreshToken", REFRESH_TOKEN_COOKIE_OPTIONS);
                expect(mockResponse.json).toHaveBeenCalledWith({ message: "Logout successfully." });
            });

            it("토큰이 없는 상태에서 로그아웃하여 쿠키만 삭제한다.", async () => {
                await authController.logout(mockRequest, mockResponse as unknown as Response);

                expect(clearRefreshTokenSpy).not.toHaveBeenCalled();
                expect(mockResponse.clearCookie).toHaveBeenCalledTimes(2);
                expect(mockResponse.clearCookie).toHaveBeenCalledWith("accessToken", ACCESS_TOKEN_COOKIE_OPTIONS);
                expect(mockResponse.clearCookie).toHaveBeenCalledWith("refreshToken", REFRESH_TOKEN_COOKIE_OPTIONS);
                expect(mockResponse.json).toHaveBeenCalledWith({ message: "Logout successfully." });
            });

            it("refresh token 초기화에 실패해도 쿠키는 삭제되고 로그아웃에 성공한다.", async () => {
                mockRequest = {
                    ...mockRequest,
                    user: {
                        userId: 1,
                        email: "test@example.com",
                        iat: now,
                        exp: now + 10 * 24 * 60 * 60,
                    },
                } as AuthRequest;

                clearRefreshTokenSpy.mockRejectedValue(new Error("Database error"));

                await authController.logout(mockRequest, mockResponse as unknown as Response);

                expect(clearRefreshTokenSpy).toHaveBeenCalledWith(TEST_USER_ID);
                expect(clearRefreshTokenSpy).toHaveBeenCalledTimes(1);
                expect(mockResponse.clearCookie).toHaveBeenCalledTimes(2);
                expect(mockResponse.clearCookie).toHaveBeenCalledWith("accessToken", ACCESS_TOKEN_COOKIE_OPTIONS);
                expect(mockResponse.clearCookie).toHaveBeenCalledWith("refreshToken", REFRESH_TOKEN_COOKIE_OPTIONS);
                expect(mockResponse.json).toHaveBeenCalledWith({ message: "Logout successfully." });
            });
        });
    });
});
