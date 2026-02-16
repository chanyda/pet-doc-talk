import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { ClsPluginTransactional } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { ClsModule } from "nestjs-cls";

import { AuthModule } from "./auth/auth.module";
import { AuthService } from "./auth/auth.service";
import { AuthKakaoModule } from "./auth-kakao/auth-kakao.module";
import { AwsModule } from "./aws/aws.module";
import { CategoriesModule } from "./categories/categories.module";
import { CommentsModule } from "./comments/comments.module";
import appConfig from "./config/app.config";
import authConfig from "./config/auth.config";
import awsConfig from "./config/aws.config";
import openaiConfig from "./config/openai.config";
import prismaConfig from "./config/prisma.config";
import { validate } from "./config/validation/env.validation";
import { ConsultationConversationsModule } from "./consultation-conversations/consultation-conversations.module";
import { ConsultationMessagesModule } from "./consultation-messages/consultation-messages.module";
import { ConsultationsModule } from "./consultations/consultations.module";
import { ImagesModule } from "./images/images.module";
import { OpenAIModule } from "./openai/openai.module";
import { PetsModule } from "./pets/pets.module";
import { PointsModule } from "./points/points.module";
import { PostsModule } from "./posts/posts.module";
import { PrismaModule } from "./prisma/prisma.module";
import { PrismaService } from "./prisma/prisma.service";
import { UsersModule } from "./users/users.module";

@Module({
    imports: [
        ThrottlerModule.forRoot([
            {
                ttl: 60000,
                limit: 20,
            },
        ]),
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig, prismaConfig, authConfig, openaiConfig, awsConfig],
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
        AuthKakaoModule,
        PetsModule,
        CategoriesModule,
        PostsModule,
        CommentsModule,
        ConsultationsModule,
        OpenAIModule,
        ConsultationConversationsModule,
        ConsultationMessagesModule,
        PointsModule,
        AwsModule,
        ImagesModule,
    ],
    providers: [AuthService],
})
export class AppModule {}
