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
import openaiConfig from "./config/openai.config";
import { ClsModule } from "nestjs-cls";
import { ClsPluginTransactional } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { PrismaService } from "./prisma/prisma.service";
import { PetsModule } from "./pets/pets.module";
import { CategoriesModule } from "./categories/categories.module";
import { PostsModule } from "./posts/posts.module";
import { CommentsModule } from "./comments/comments.module";
import { AuthKakaoModule } from "./auth-kakao/auth-kakao.module";
import { ConsultationsModule } from "./consultations/consultations.module";
import { OpenAIModule } from "./openai/openai.module";
import { ConsultationConversationsModule } from "./consultation-conversations/consultation-conversations.module";
import { ConsultationMessagesModule } from "./consultation-messages/consultation-messages.module";
import { ThrottlerModule } from "@nestjs/throttler";
import { PointsModule } from "./points/points.module";

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
            load: [appConfig, prismaConfig, authConfig, openaiConfig],
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
    ],
    providers: [AuthService],
})
export class AppModule {}
