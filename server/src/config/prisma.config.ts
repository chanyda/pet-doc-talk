import { registerAs } from "@nestjs/config";

import { PrismaConfigType } from "@/types/config.type";

export default registerAs<PrismaConfigType>("prisma", () => ({
    databaseUrl: process.env.DATABASE_URL || "",
}));
