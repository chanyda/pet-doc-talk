export function extractTokenFromCookie(cookies: Record<string, string> | undefined, cookieName: string): string | null {
    return cookies?.[cookieName] ?? null;
}
