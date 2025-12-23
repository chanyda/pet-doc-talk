import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { JwtPayload } from "src/types/auth.type";
import { ConfigType } from "src/types/config.type";
import { AuthRequest } from "src/types/request.type";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService<ConfigType, true>,
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<AuthRequest>();

        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const secretKey = this.configService.getOrThrow("auth.secretKey", { infer: true });
            const jwtPayload = this.jwtService.verify<JwtPayload>(token, { secret: secretKey });

            request.user = jwtPayload;
        } catch (err) {
            console.error(err);
            throw new UnauthorizedException();
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | null {
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : null;
    }
}
