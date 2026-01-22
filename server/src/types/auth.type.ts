export type JwtPayload = {
    userId: number;
    email: string;
    isRefresh?: boolean;
    iat: number;
    exp: number;
};
