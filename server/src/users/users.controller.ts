import { Controller, Get, HttpCode, HttpStatus, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { AuthRequest } from "src/types/request.type";
import { FindMyProfileResponseDto } from "./dtos/find-my-profile-response.dto";

@ApiBearerAuth()
@ApiTags("users")
@UseGuards(AuthGuard)
@Controller("users")
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get("me")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: "Find my profile successful.", type: FindMyProfileResponseDto })
    @ApiNotFoundResponse({ description: "User not exists." })
    findMyProfile(@Req() req: AuthRequest): Promise<FindMyProfileResponseDto> {
        return this.usersService.findProfileByEmail(req.user.email);
    }
}
