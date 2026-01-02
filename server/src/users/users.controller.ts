import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { AuthRequest } from "src/types/request.type";
import { FindProfileResponseDto } from "./dtos/find-profile-response.dto";
import { UpdateProfileDto } from "./dtos/update-profile-dto";

@ApiBearerAuth()
@ApiTags("users")
@UseGuards(AuthGuard)
@Controller("users")
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get("me")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: "Find profile successful.", type: FindProfileResponseDto })
    @ApiNotFoundResponse({ description: "User not exists." })
    findProfile(@Req() req: AuthRequest): Promise<FindProfileResponseDto> {
        return this.usersService.findProfile(req.user.userId);
    }

    @Patch("me")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: "Update profile successful.", type: FindProfileResponseDto })
    @ApiNotFoundResponse({ description: "User not exists." })
    @ApiBadRequestResponse({ description: "This nickname is already in use." })
    updateProfile(
        @Req() req: AuthRequest,
        @Body() updateProfileDto: UpdateProfileDto,
    ): Promise<FindProfileResponseDto> {
        return this.usersService.updateProfile(req.user.userId, updateProfileDto);
    }
}
