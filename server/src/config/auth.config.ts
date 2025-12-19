import { registerAs } from "@nestjs/config";
import { AuthConfigType } from "src/types/config.type";

export default registerAs<AuthConfigType>("auth", () => ({
    secretKey: process.env.JWT_SECRET_KEY || "",
    accessTokenExpTime: process.env.JWT_ACCESS_TOKEN_EXP_TIME || "1d",
    refreshTokenExpTime: process.env.JWT_REFRESH_TOKEN_EXP_TIME || "30d",
}));
