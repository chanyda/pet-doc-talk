import { IsEnum, IsInt, IsString, Max, Min } from "class-validator";

enum Environment {
    Development = "development",
    Production = "production",
    Test = "test",
}

export class EnvironmentVariables {
    @IsEnum(Environment)
    NODE_ENV: Environment;

    @IsInt()
    @Min(0)
    @Max(65535)
    PORT: number;

    @IsString()
    ORIGIN: string;

    @IsString()
    DATABASE_URL: string;

    @IsString()
    JWT_SECRET_KEY: string;

    @IsString()
    JWT_ACCESS_TOKEN_EXP_TIME: string;

    @IsString()
    JWT_REFRESH_TOKEN_EXP_TIME: string;

    @IsString()
    KAKAO_CLIENT_ID: string;

    @IsString()
    KAKAO_REDIRECT_URI: string;

    @IsString()
    KAKAO_CLIENT_SECRET: string;

    @IsString()
    OPENAI_API_KEY: string;
}
