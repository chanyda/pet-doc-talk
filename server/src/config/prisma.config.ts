import { registerAs } from "@nestjs/config";
import { PrismaConfigType } from "src/types/config.type";

export default registerAs<PrismaConfigType>("prisma", () => ({
    databaseUrl: process.env.DATABASE_URL || "",
}));
