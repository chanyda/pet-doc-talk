import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import appConfig from "./config/app.config";
import { validate } from "./config/validation/env.validation";
import prismaConfig from "./config/prisma.config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig, prismaConfig],
            envFilePath: ".env",
            validate,
        }),
    ],
})
export class AppModule {}
