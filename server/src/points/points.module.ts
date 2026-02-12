import { Module } from "@nestjs/common";

import { PointsService } from "./points.service";
import { PointsController } from "./points.controller";
import { PointsRepository } from "./points.repository";

@Module({
    providers: [PointsService, PointsRepository],
    controllers: [PointsController],
    exports: [PointsService],
})
export class PointsModule {}
