import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ConfigType } from "./types/config.type";
import helmet from "helmet";
import { ValidationPipe } from "@nestjs/common";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService<ConfigType, true>);

    app.use(helmet());
    app.enableCors({
        origin: configService.getOrThrow("app.origin", { infer: true }),
        credentials: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            // 데이터에서 유효하지 않은 속성 자동 제거
            whitelist: true,
            disableErrorMessages:
                configService.getOrThrow("app.nodeEnv", { infer: true }) === "development" ? false : true,
        }),
    );
    app.useGlobalInterceptors(new LoggingInterceptor());

    const documentConfig = new DocumentBuilder()
        .setTitle("API")
        .setDescription("API docs")
        .setVersion("1.0")
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, documentConfig);
    SwaggerModule.setup("docs", app, document);

    await app.listen(configService.getOrThrow("app.port", { infer: true }));
}
bootstrap();
