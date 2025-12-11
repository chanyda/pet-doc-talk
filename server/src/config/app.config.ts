import { registerAs } from "@nestjs/config";
import { AppConfigType } from "src/types/config.type";

export default registerAs<AppConfigType>("app", () => ({
    nodeEnv: process.env.NODE_ENV || "development",
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    origin: process.env.ORIGIN || "http://localhost:3001",
}));
