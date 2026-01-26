import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { AuthKakaoController } from "./auth-kakao.controller";
import { AuthKakaoService } from "./auth-kakao.service";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [HttpModule, AuthModule],
    controllers: [AuthKakaoController],
    providers: [AuthKakaoService],
})
export class AuthKakaoModule {}
