import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { NotFoundException } from "@nestjs/common";
import { AuthRequest } from "src/types/request.type";

describe("UsersController", () => {
    let usersController: UsersController;
    let usersService: UsersService;

    let findProfileSpy: jest.SpyInstance;

    const now = Math.floor(Date.now() / 1000);
    const mockReq: AuthRequest = {
        user: {
            userId: 1,
            email: "test@example.com",
            iat: now,
            exp: now + 10 * 24 * 60 * 60, // 10일 뒤
        },
    } as AuthRequest;

    const mockProfileDto = {
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
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("findProfile", () => {
        it("프로필 정보를 가져오기에 성공하여 프로필 정보를 반환한다.", async () => {
            findProfileSpy.mockResolvedValue(mockProfileDto);

            const result = await usersController.findProfile(mockReq);

            expect(result).toEqual(mockProfileDto);
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
});
