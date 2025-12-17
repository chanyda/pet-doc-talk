export type AppConfigType = {
    nodeEnv: string;
    port: number;
    origin: string;
};

export type PrismaConfigType = {
    databaseUrl: string;
};

export type ConfigType = {
    app: AppConfigType;
    prisma: PrismaConfigType;
};
