import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtPayload } from "src/types/auth.type";
import { AuthRequest } from "src/types/request.type";

export const User = createParamDecorator((data: keyof JwtPayload, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    const user = request.user;

    return data ? user[data] : user;
});
