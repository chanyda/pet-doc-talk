import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";

import { AuthRequest } from "@/types/request.type";

export const Cookies = createParamDecorator((data: string, ctx: ExecutionContext): string | Record<string, string> => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    const cookies = request.cookies as Record<string, string> | undefined;

    if (!cookies) {
        throw new UnauthorizedException("Cookie not found.");
    }

    // 조회하려는 쿠키 값이 있는데 해당 값이 쿠키에 저장되어 있지 않은 경우 오류를 반환한다.
    if (data && !cookies[data]) {
        throw new UnauthorizedException(`Required cookie '${data}' not found.`);
    }

    return data ? cookies[data] : cookies;
});
