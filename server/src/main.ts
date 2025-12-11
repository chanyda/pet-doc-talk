import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ConfigType } from "./types/config.type";
import helmet from "helmet";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService<ConfigType, true>);

    app.use(helmet());
    app.enableCors({
        origin: configService.get("app.origin", { infer: true }),
        credentials: true,
    });

    await app.listen(configService.get("app.port", { infer: true }));
}
bootstrap();
