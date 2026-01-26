import { Controller, Get, HttpCode, HttpStatus, Query, Res } from "@nestjs/common";
import {
    ApiBadRequestResponse,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { AuthKakaoService } from "./auth-kakao.service";
import { AuthService } from "src/auth/auth.service";
import { LoginFrom } from "generated/prisma/enums";
import { KakaoLoginQueryDto } from "./dtos/requests/kakao-login-query.dto";
import { Response } from "express";
import { ConfigType } from "src/types/config.type";
import { ConfigService } from "@nestjs/config";

@ApiTags("auth/kakao")
@Controller("auth/kakao")
export class AuthKakaoController {
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
        const { email, name } = await this.authKakaoService.authenticate(query.code);
        const { accessToken, refreshToken } = await this.authService.login({ email, name, loginFrom: LoginFrom.KAKAO });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 30,
        });

        return res.redirect(`${this.origin}`);
    }
}
