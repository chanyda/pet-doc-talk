import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "generated/prisma/client";

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(private configService: ConfigService) {
        const adapter = new PrismaPg({
            connectionString: configService.get<string>("prisma.databaseUrl"),
        });
        super({ adapter });
    }
}
