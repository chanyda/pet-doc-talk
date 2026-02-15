import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { extractTokenFromCookie } from "@/common/utils/auth.util";
import { JwtPayload } from "@/types/auth.type";
import { ConfigType } from "@/types/config.type";
import { AuthRequest } from "@/types/request.type";

@Injectable()
export class LogoutGuard implements CanActivate {
    private readonly secretKey: string;

    constructor(
        private jwtService: JwtService,
        configService: ConfigService<ConfigType, true>,
    ) {
        this.secretKey = configService.getOrThrow("auth.secretKey", { infer: true });
    }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<AuthRequest>();
        const token = extractTokenFromCookie(request.cookies, "accessToken");

        // 만일 토큰이 없다면 토큰에 대한 검증은 건너뛴다.
        if (!token) {
            return true;
        }

        try {
            const jwtPayload = this.jwtService.verify<JwtPayload>(token, {
                secret: this.secretKey,
                ignoreExpiration: true,
            });

            request.user = jwtPayload;
        } catch (err) {
            console.error(err);
        }

        return true;
    }
}
