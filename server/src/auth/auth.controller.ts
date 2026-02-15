import { Controller, HttpCode, HttpStatus, Logger, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Response } from "express";

import { ACCESS_TOKEN_COOKIE_OPTIONS, REFRESH_TOKEN_COOKIE_OPTIONS } from "@/common/constants";
import { Cookies } from "@/common/decorators/cookie.decorator";
import { AuthRequest } from "@/types/request.type";

import { AuthService } from "./auth.service";
import { LogoutGuard } from "./guards/logout.guard";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private readonly authService: AuthService) {}

    @Post("refresh")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: "Token refreshed successfully." })
    @ApiUnauthorizedResponse({ description: "Invalid token." })
    async refresh(
        @Cookies("accessToken") accessToken: string,
        @Cookies("refreshToken") refreshToken: string,
        @Res() res: Response,
    ): Promise<void> {
        const tokens = await this.authService.refresh(accessToken, refreshToken);

        res.cookie("accessToken", tokens.accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
        res.cookie("refreshToken", tokens.refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

        res.json({ message: "Token refreshed successfully." });
    }

    @Post("logout")
    @UseGuards(LogoutGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: "Logout successfully." })
    async logout(@Req() req: AuthRequest, @Res() res: Response): Promise<void> {
        try {
            // LogoutGuard에 의해 검증된 user가 있는 경우에만 refresh token을 초기화해준다.
            if (req.user) {
                await this.authService.clearRefreshToken(req.user.userId);
            }
        } catch (err) {
            this.logger.error("Failed to clear refresh token during logout.", err);
        } finally {
            // 무조건 cookie는 삭제해준다.
            res.clearCookie("accessToken", ACCESS_TOKEN_COOKIE_OPTIONS);
            res.clearCookie("refreshToken", REFRESH_TOKEN_COOKIE_OPTIONS);

            res.json({ message: "Logout successfully." });
        }
    }
}
