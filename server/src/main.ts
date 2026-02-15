import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import { AppModule } from "./app.module";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { ConfigType } from "./types/config.type";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService<ConfigType, true>);

    app.use(helmet());
    app.use(cookieParser());
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
            // 개발 환경에서만 어느 필드에 대한 validation error가 발생했는지 보여주고
            // 실서버에서는 자세한 오류 메세지는 표시하지 않도록 한다. (보안상)
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
