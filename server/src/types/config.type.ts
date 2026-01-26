import type { StringValue } from "ms";

export type AppConfigType = {
    nodeEnv: string;
    port: number;
    origin: string;
};

export type PrismaConfigType = {
    databaseUrl: string;
};

export type AuthConfigType = {
    secretKey: string;
    accessTokenExpTime: StringValue;
    refreshTokenExpTime: StringValue;
    kakaoClientId: string;
    kakaoRedirectUri: string;
    kakaoClientSecret: string;
};

export type ConfigType = {
    app: AppConfigType;
    prisma: PrismaConfigType;
    auth: AuthConfigType;
};
