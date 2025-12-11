import { Module } from "@nestjs/common";
import { TestController } from "./test/test.controller";
import { TestService } from "./test/test.service";
import { ConfigModule } from "@nestjs/config";
import appConfig from "./config/app.config";
import { validate } from "./config/validation/env.validation";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig],
            envFilePath: ".env",
            validate,
        }),
    ],
    controllers: [TestController],
    providers: [TestService],
})
export class AppModule {}
