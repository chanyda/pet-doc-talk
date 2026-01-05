import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { BadRequestException } from "@nestjs/common";
import { LoginFrom } from "generated/prisma/enums";

describe("AuthController", () => {
    let authController: AuthController;
    let authService: AuthService;

    let loginSpy: jest.SpyInstance;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        login: jest.fn(),
                    },
                },
            ],
        }).compile();

        authController = moduleRef.get(AuthController);
        authService = moduleRef.get(AuthService);

        loginSpy = jest.spyOn(authService, "login");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("login", () => {
        const accessToken = "accessToken";
        const refreshToken = "refreshToken";

        const loginDto = {
            email: "test@example.com",
            name: "Tester",
            loginFrom: LoginFrom.KAKAO,
        };

        describe("로그인 성공", () => {
            it("이미 존재하는 회원 - LoginResponse를 반환한다.", async () => {
                loginSpy.mockResolvedValue({ accessToken, refreshToken, isNewUser: false });

                const result = await authController.login(loginDto);

                expect(result).toEqual({ accessToken, refreshToken, isNewUser: false });
                expect(loginSpy).toHaveBeenCalledWith(loginDto);
                expect(loginSpy).toHaveBeenCalledTimes(1);
            });

            it("신규 회원 - LoginResponse를 반환한다.", async () => {
                loginSpy.mockResolvedValue({ accessToken, refreshToken, isNewUser: true });

                const result = await authController.login(loginDto);

                expect(result).toEqual({ accessToken, refreshToken, isNewUser: true });
                expect(loginSpy).toHaveBeenCalledWith(loginDto);
                expect(loginSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("로그인 실패", () => {
            it("이미 존재하는 회원 - 다른 provider로 로그인하려는 경우 에러를 반환한다.", async () => {
                loginSpy.mockRejectedValue(new BadRequestException("Already signed up using APPLE."));

                await expect(authController.login(loginDto)).rejects.toThrow(
                    new BadRequestException("Already signed up using APPLE."),
                );
                expect(loginSpy).toHaveBeenCalledWith(loginDto);
                expect(loginSpy).toHaveBeenCalledTimes(1);
            });
        });
    });
});
