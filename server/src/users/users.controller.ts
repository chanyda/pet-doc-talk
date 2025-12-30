import { Controller, Get, HttpCode, HttpStatus, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { AuthRequest } from "src/types/request.type";
import { FindProfileResponseDto } from "./dtos/find-profile-response.dto";

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
}
