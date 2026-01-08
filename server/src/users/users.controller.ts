import { Body, Controller, Get, HttpCode, HttpStatus, Patch } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { FindProfileResponseDto } from "./dtos/find-profile-response.dto";
import { UpdateProfileDto } from "./dtos/update-profile-dto";
import { User } from "src/common/decorators/user.decorator";
import { Auth } from "src/common/decorators/auth.decorator";

@ApiTags("users")
@Auth()
@Controller("users")
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get("me")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: "Find profile successful.", type: FindProfileResponseDto })
    @ApiNotFoundResponse({ description: "User not exists." })
    findProfile(@User("userId") userId: number): Promise<FindProfileResponseDto> {
        return this.usersService.findProfile(userId);
    }

    @Patch("me")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: "Update profile successful.", type: FindProfileResponseDto })
    @ApiNotFoundResponse({ description: "User not exists." })
    @ApiBadRequestResponse({ description: "This nickname is already in use." })
    updateProfile(
        @User("userId") userId: number,
        @Body() updateProfileDto: UpdateProfileDto,
    ): Promise<FindProfileResponseDto> {
        return this.usersService.updateProfile(userId, updateProfileDto);
    }
}
