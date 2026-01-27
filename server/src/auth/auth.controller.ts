import { Controller, HttpCode, HttpStatus, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Cookies } from "src/common/decorators/cookie.decorator";
import { Response } from "express";
import { ACCESS_TOKEN_COOKIE_OPTIONS, REFRESH_TOKEN_COOKIE_OPTIONS } from "src/common/constants";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
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
}
