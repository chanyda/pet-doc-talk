import { LoginFrom } from "generated/prisma/enums";

export interface IUser {
    id: number;
    email: string;
    name: string;
    nickname?: string | null;
    loginFrom: LoginFrom;
    profileImageUrl?: string | null;
    refreshToken: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}
