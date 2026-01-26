import { Body, Controller, Headers, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RefreshTokenDto } from "./dtos/requests/refresh-token.dto";
import { GenerateTokenResponseDto } from "./dtos/responses/login-response.dto";
import { ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("refresh")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: "Refresh token successful.", type: GenerateTokenResponseDto })
    @ApiUnauthorizedResponse({ description: "Invalid token." })
    async refresh(
        @Headers("Authorization") authorization: string,
        @Body() refreshTokenDto: RefreshTokenDto,
    ): Promise<GenerateTokenResponseDto> {
        return this.authService.refresh(authorization, refreshTokenDto);
    }
}
