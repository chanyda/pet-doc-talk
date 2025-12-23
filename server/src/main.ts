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

    app.useGlobalPipes(new ValidationPipe());
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
