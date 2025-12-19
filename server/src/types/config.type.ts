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
    accessTokenExpTime: string;
    refreshTokenExpTime: string;
};

export type ConfigType = {
    app: AppConfigType;
    prisma: PrismaConfigType;
    auth: AuthConfigType;
};
