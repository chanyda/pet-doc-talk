import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { PointsModule } from "@/points/points.module";
import { UsersModule } from "@/users/users.module";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
    imports: [
        UsersModule,
        PointsModule,
        JwtModule.register({
            global: true,
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
