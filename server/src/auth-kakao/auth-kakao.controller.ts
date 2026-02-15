import { Controller, Get, HttpCode, HttpException, HttpStatus, Logger, Query, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
    ApiBadRequestResponse,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Response } from "express";

import { LoginFrom } from "generated/prisma/enums";

import { AuthService } from "@/auth/auth.service";
import { ACCESS_TOKEN_COOKIE_OPTIONS, REFRESH_TOKEN_COOKIE_OPTIONS } from "@/common/constants";
import { ConfigType } from "@/types/config.type";

import { AuthKakaoService } from "./auth-kakao.service";
import { KakaoLoginQueryDto } from "./dtos/requests/kakao-login-query.dto";

@ApiTags("auth/kakao")
@Controller("auth/kakao")
export class AuthKakaoController {
    private readonly logger = new Logger(AuthKakaoController.name);
    private readonly origin: string;

    constructor(
        private readonly authKakaoService: AuthKakaoService,
        private readonly authService: AuthService,
        configService: ConfigService<ConfigType, true>,
    ) {
        this.origin = configService.getOrThrow("app.origin", { infer: true });
    }

    @Get("callback")
    @HttpCode(HttpStatus.FOUND)
    @ApiOkResponse({ description: "Kakao login success." })
    @ApiBadRequestResponse({ description: "Invalid request to Kakao API." })
    @ApiUnauthorizedResponse({ description: "Invalid token or kakao authentication failed." })
    @ApiNotFoundResponse({ description: "Kakao account not exists or email, name not found." })
    @ApiInternalServerErrorResponse({
        description: "Failed to authenticate with Kakao OAuth service or retrieve user information from Kakao.",
    })
    async kakaoLogin(@Query() query: KakaoLoginQueryDto, @Res() res: Response): Promise<void> {
        try {
            const { email, name } = await this.authKakaoService.authenticate(query.code);
            const { accessToken, refreshToken } = await this.authService.login({
                email,
                name,
                loginFrom: LoginFrom.KAKAO,
            });

            res.cookie("accessToken", accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
            res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

            return res.redirect(`${this.origin}`);
        } catch (err: unknown) {
            this.logger.error("Kakao login failed.", err);

            const errorMessage = err instanceof HttpException ? err.message : "An error occurred during login.";
            return res.redirect(`${this.origin}/auth/error?message=${encodeURIComponent(errorMessage)}`);
        }
    }
}
