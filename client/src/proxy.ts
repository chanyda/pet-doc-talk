import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/ai-consultation", "/mypage", "/community/new", "/community"];

function isProtectedRoute(pathname: string): boolean {
    return PROTECTED_ROUTES.some((route) => {
        if (route === "/community") {
            return pathname === "/community/new" || /^\/community\/\d+\/edit/.test(pathname);
        }
        return pathname.startsWith(route);
    });
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken");

    if (isProtectedRoute(pathname) && !accessToken) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|images).*)"],
};
