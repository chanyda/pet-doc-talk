import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import appConfig from "./config/app.config";
import { validate } from "./config/validation/env.validation";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";
import { AuthService } from "./auth/auth.service";
import { AuthModule } from "./auth/auth.module";
import prismaConfig from "./config/prisma.config";
import authConfig from "./config/auth.config";
import { ClsModule } from "nestjs-cls";
import { ClsPluginTransactional } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { PrismaService } from "./prisma/prisma.service";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig, prismaConfig, authConfig],
            envFilePath: ".env",
            validate,
        }),
        ClsModule.forRoot({
            plugins: [
                new ClsPluginTransactional({
                    imports: [PrismaModule],
                    adapter: new TransactionalAdapterPrisma({
                        prismaInjectionToken: PrismaService,
                        sqlFlavor: "postgresql",
                    }),
                }),
            ],
        }),
        PrismaModule,
        UsersModule,
        AuthModule,
    ],
    providers: [AuthService],
})
export class AppModule {}
