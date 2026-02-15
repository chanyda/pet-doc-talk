import { Request } from "express";

import { JwtPayload } from "./auth.type";

export interface AuthRequest extends Request {
    user?: JwtPayload;
    isPublic: boolean;
}
