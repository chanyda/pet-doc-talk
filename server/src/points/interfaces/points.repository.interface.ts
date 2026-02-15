import { PointAction, PointSource } from "generated/prisma/enums";
import { PointSelect } from "generated/prisma/models";

import { IPoint, IPointHistory } from "./point.interface";

export interface IPointsRepository {
    findByUserId(userId: number, select?: PointSelect): Promise<IPoint | null>;
    create(userId: number, amount: number, select?: PointSelect): Promise<IPoint>;
    createHistory(
        userId: number,
        action: PointAction,
        source: PointSource,
        value: number,
        remainingPoints: number,
    ): Promise<IPointHistory>;
    updateAmount(userId: number, amount: number): Promise<IPoint>;
}
