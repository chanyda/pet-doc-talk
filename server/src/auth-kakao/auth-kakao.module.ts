import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";

import { AuthModule } from "@/auth/auth.module";

import { AuthKakaoController } from "./auth-kakao.controller";
import { AuthKakaoService } from "./auth-kakao.service";

@Module({
    imports: [HttpModule, AuthModule],
    controllers: [AuthKakaoController],
    providers: [AuthKakaoService],
})
export class AuthKakaoModule {}
