import { Body, Controller, Headers, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dtos/requests/login.dto";
import { RefreshTokenDto } from "./dtos/requests/refresh-token.dto";
import { GenerateTokenResponseDto, LoginResponseDto } from "./dtos/responses/login-response.dto";
import { ApiBadRequestResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("login")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: "Login successful.", type: LoginResponseDto })
    @ApiBadRequestResponse({
        description: "The user previously logged in using a different social provider.",
    })
    async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
        return this.authService.login(loginDto);
    }

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
