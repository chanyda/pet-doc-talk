import { Module } from "@nestjs/common";

import { PointsController } from "./points.controller";
import { PointsRepository } from "./points.repository";
import { PointsService } from "./points.service";

@Module({
    providers: [PointsService, PointsRepository],
    controllers: [PointsController],
    exports: [PointsService],
})
export class PointsModule {}
