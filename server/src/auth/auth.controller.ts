import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dtos/requests/login.dto";
import { LoginResponseDto } from "./dtos/responses/login-response.dto";
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";

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
}
