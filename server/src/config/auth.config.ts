import { registerAs } from "@nestjs/config";
import type { StringValue } from "ms";

import { AuthConfigType } from "@/types/config.type";

export default registerAs<AuthConfigType>("auth", () => ({
    secretKey: process.env.JWT_SECRET_KEY || "",
    accessTokenExpTime: (process.env.JWT_ACCESS_TOKEN_EXP_TIME || "1d") as StringValue,
    refreshTokenExpTime: (process.env.JWT_REFRESH_TOKEN_EXP_TIME || "30d") as StringValue,
    kakaoClientId: process.env.KAKAO_CLIENT_ID || "",
    kakaoRedirectUri: process.env.KAKAO_REDIRECT_URI || "",
    kakaoClientSecret: process.env.KAKAO_CLIENT_SECRET || "",
}));
