import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";

import { IS_PUBLIC_KEY } from "@/common/decorators/public.decorator";
import { extractTokenFromCookie } from "@/common/utils/auth.util";
import { JwtPayload } from "@/types/auth.type";
import { ConfigType } from "@/types/config.type";
import { AuthRequest } from "@/types/request.type";

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly secretKey: string;

    constructor(
        private jwtService: JwtService,
        configService: ConfigService<ConfigType, true>,
        private reflector: Reflector,
    ) {
        this.secretKey = configService.getOrThrow("auth.secretKey", { infer: true });
    }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<AuthRequest>();
        const token = extractTokenFromCookie(request.cookies, "accessToken");

        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        request.isPublic = isPublic;

        // 만일 public endpoint인데, token이 존재하지 않는 경우(로그인한 사용자가 아닌 경우)에는 별다른 검증 없이 통과시켜준다.
        if (isPublic && !token) {
            return true;
        }

        // public한 endpoint가 아닌데 (반드시 검증이 필요한 경우) token이 존재하지 않거나 올바르지 않은 token을 가졌다면 오류를 발생시킨다.
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const jwtPayload = this.jwtService.verify<JwtPayload>(token, { secret: this.secretKey });

            request.user = jwtPayload;
        } catch (err) {
            console.error(err);
            throw new UnauthorizedException();
        }

        return true;
    }
}
