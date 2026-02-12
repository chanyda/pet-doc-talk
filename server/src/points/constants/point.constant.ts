import { PointAction } from "generated/prisma/enums";

export const POINT_POLICY = {
    SIGN_UP: {
        amount: 3,
        action: PointAction.EARN,
    },
    CONSULTATION: {
        amount: -1,
        action: PointAction.USE,
    },
    AD_WATCH: {
        amount: 3,
        action: PointAction.EARN,
    },
} as const;

export type FixedPointSource = keyof typeof POINT_POLICY;
