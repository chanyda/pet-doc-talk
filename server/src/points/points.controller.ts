import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOkResponse } from "@nestjs/swagger";

import { PointsService } from "./points.service";
import { Auth } from "src/common/decorators/auth.decorator";
import { User } from "src/common/decorators/user.decorator";
import { MyPointItemDto } from "./dtos/responses/my-point-item.dto";

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
