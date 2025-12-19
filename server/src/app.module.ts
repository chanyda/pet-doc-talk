import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import appConfig from "./config/app.config";
import { validate } from "./config/validation/env.validation";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";
import prismaConfig from "./config/prisma.config";
import authConfig from "./config/auth.config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig, prismaConfig, authConfig],
            envFilePath: ".env",
            validate,
        }),
        PrismaModule,
        UsersModule,
    ],
})
export class AppModule {}
