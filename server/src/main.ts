import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ConfigType } from "./types/config.type";
import helmet from "helmet";
import { ValidationPipe } from "@nestjs/common";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService<ConfigType, true>);

    app.use(helmet());
    app.enableCors({
        origin: configService.get("app.origin", { infer: true }),
        credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new LoggingInterceptor());

    await app.listen(configService.get("app.port", { infer: true }));
}
bootstrap();
