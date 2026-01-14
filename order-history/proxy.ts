import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {

    const session = request.cookies.get("session")?.value;
    const path = request.nextUrl.pathname;

    const isLoginPage = path === "/login" || path === "/";
    const isApiLogin = path.startsWith("/api/auth/login");

    // if (isLoginPage || isApiLogin ) return NextResponse.next();
    if(session && (isLoginPage || isApiLogin)) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
    }

    if (!session) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }
    return NextResponse.next();
}
export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*|login|api/auth/login).*)",],
};