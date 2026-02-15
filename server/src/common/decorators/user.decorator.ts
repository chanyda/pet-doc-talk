import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";

import { JwtPayload } from "@/types/auth.type";
import { AuthRequest } from "@/types/request.type";

export const User = createParamDecorator((data: keyof JwtPayload, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const user = request.user;
    const isPublic = request.isPublic ?? false;

    // 비공개 API인데, Auth 검증을 통해 user가 넘어오지 않은 경우 오류를 반환한다.
    if (!isPublic && !user) {
        throw new UnauthorizedException();
    }

    // 공개 API user가 없는 경우는 로그인하지 않은 사용자로 판단한다.
    if (!user) {
        return undefined;
    }

    // 비공개와 공개 API 여부 상관없이 user가 있다면 user 정보를 반환해준다.
    return data ? user[data] : user;
});
