import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { Auth } from "@/common/decorators/auth.decorator";
import { User } from "@/common/decorators/user.decorator";

import { MyPointItemDto } from "./dtos/responses/my-point-item.dto";
import { PointsService } from "./points.service";

@ApiTags("points")
@Auth()
@Controller("points")
export class PointsController {
    constructor(private readonly pointsService: PointsService) {}

    @Get("me")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: "Find my points successful.", type: MyPointItemDto })
    findMyPoints(@User("userId") userId: number): Promise<MyPointItemDto> {
        return this.pointsService.findMyPoints(userId);
    }
}
