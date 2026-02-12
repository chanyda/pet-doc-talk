import { ForbiddenException, Injectable } from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";

import { PointAction, PointSource } from "generated/prisma/enums";
import { PointsRepository } from "./points.repository";
import { FixedPointSource, POINT_POLICY } from "./constants";
import { MyPointItemDto } from "./dtos/responses/my-point-item.dto";

@Injectable()
export class PointsService {
    constructor(private readonly pointsRepository: PointsRepository) {}

    async findMyPoints(userId: number): Promise<MyPointItemDto> {
        let point = await this.pointsRepository.findByUserId(userId, { amount: true });

        if (!point) {
            point = await this.pointsRepository.create(userId, 0, { amount: true });
        }

        return point;
    }

    @Transactional()
    async applyPoint(userId: number, source: FixedPointSource): Promise<number> {
        const point = await this.findMyPoints(userId);

        const { amount, action } = POINT_POLICY[source];
        const newAmount = point.amount + amount;

        if (newAmount < 0) {
            throw new ForbiddenException("Insufficient points.");
        }

        await this.pointsRepository.updateAmount(userId, newAmount);
        await this.pointsRepository.createHistory(userId, action, source, amount, newAmount);

        return newAmount;
    }

    @Transactional()
    async refundPoint(userId: number): Promise<number> {
        const point = await this.findMyPoints(userId);

        // 차감했던 금액의 절댓값을 다시 더해줌 (CONSULTATION: -1 → 환불: +1)
        // NOTE: 우선은 환불은 상담 메세지에 대해서만 진행해줌. 추후 또 필요한 상황이 있다면 변경
        const refundAmount = Math.abs(POINT_POLICY.CONSULTATION.amount);
        const newAmount = point.amount + refundAmount;

        await this.pointsRepository.updateAmount(userId, newAmount);
        await this.pointsRepository.createHistory(
            userId,
            PointAction.EARN,
            PointSource.REFUND,
            refundAmount,
            newAmount,
        );

        return newAmount;
    }
}
