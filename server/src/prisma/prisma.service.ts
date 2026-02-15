import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "generated/prisma/client";

import { ConfigType } from "@/types/config.type";

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(private configService: ConfigService<ConfigType, true>) {
        const nodeEnv = configService.getOrThrow("app.nodeEnv", { infer: true });

        const adapter = new PrismaPg({
            connectionString: configService.getOrThrow("prisma.databaseUrl", { infer: true }),
        });
        super({
            adapter,
            log: nodeEnv !== "production" ? ["query", "info", "warn", "error"] : [],
        });
    }
}
