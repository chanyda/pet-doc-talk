export function extractTokenFromHeader(authorization?: string): string | null {
    const [type, token] = authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : null;
}
