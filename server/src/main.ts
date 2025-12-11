import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ConfigType } from "./types/config.type";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService<ConfigType, true>);

    await app.listen(configService.get("app.port", { infer: true }));
}
bootstrap();
