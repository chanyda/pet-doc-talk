import { PointAction, PointSource } from "generated/prisma/enums";

export interface IPoint {
    id: number;
    userId: number;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPointHistory {
    id: number;
    userId: number;
    action: PointAction;
    source: PointSource;
    value: number;
    remainingPoints: number;
    createdAt: Date;
    updatedAt: Date;
}
