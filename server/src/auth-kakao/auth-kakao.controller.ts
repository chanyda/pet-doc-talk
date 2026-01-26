import { Controller, Get, HttpCode, HttpStatus, Query } from "@nestjs/common";
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
import { LoginResponseDto } from "src/auth/dtos/responses/login-response.dto";
import { KakaoLoginQueryDto } from "./dtos/requests/kakao-login-query.dto";

@ApiTags("auth/kakao")
@Controller("auth/kakao")
export class AuthKakaoController {
    constructor(
        private readonly authKakaoService: AuthKakaoService,
        private readonly authService: AuthService,
    ) {}

    @Get("callback")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: "Kakao login success.", type: LoginResponseDto })
    @ApiBadRequestResponse({ description: "Invalid request to Kakao API." })
    @ApiUnauthorizedResponse({ description: "Invalid token or kakao authentication failed." })
    @ApiNotFoundResponse({ description: "Kakao account not exists or email, name not found." })
    @ApiInternalServerErrorResponse({
        description: "Failed to authenticate with Kakao OAuth service or retrieve user information from Kakao.",
    })
    async kakaoLogin(@Query() query: KakaoLoginQueryDto): Promise<LoginResponseDto> {
        const { email, name } = await this.authKakaoService.authenticate(query.code);
        return this.authService.login({ email, name, loginFrom: LoginFrom.KAKAO });
    }
}
