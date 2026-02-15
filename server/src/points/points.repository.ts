import { Injectable } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";

import { PointAction, PointSource } from "generated/prisma/enums";
import { PointSelect } from "generated/prisma/models";

import { PrismaService } from "@/prisma/prisma.service";

import { IPoint, IPointHistory } from "./interfaces/point.interface";
import { IPointsRepository } from "./interfaces/points.repository.interface";

@Injectable()
export class PointsRepository implements IPointsRepository {
    constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma<PrismaService>>) {}

    async findByUserId(userId: number, select?: PointSelect): Promise<IPoint | null> {
        return this.txHost.tx.point.findUnique({
            where: { userId },
            select,
        });
    }

    async create(userId: number, amount: number, select?: PointSelect): Promise<IPoint> {
        return this.txHost.tx.point.create({
            data: { userId, amount },
            select,
        });
    }

    async createHistory(
        userId: number,
        action: PointAction,
        source: PointSource,
        value: number,
        remainingPoints: number,
    ): Promise<IPointHistory> {
        return this.txHost.tx.pointHistory.create({ data: { userId, action, source, value, remainingPoints } });
    }

    async updateAmount(userId: number, amount: number): Promise<IPoint> {
        return this.txHost.tx.point.update({
            where: { userId },
            data: { amount },
        });
    }
}
