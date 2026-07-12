import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {

    const session = request.cookies.get("session")?.value;
    const path = request.nextUrl.pathname;

    const isLoginPage = path === "/login" || path === "/";
    const isApiLogin = path.startsWith("/api/auth/login");
    const isApiTestLogin = path.startsWith("/api/auth/testLogin");
    const url = request.nextUrl.clone();

    // if there is session info and try to access login page or api login then redirect to dashboard.
    // the reason of this code is to prevent to access login page who has authenticated already.
    if (session && (isLoginPage || isApiLogin || isApiTestLogin)) {
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
    }

    // if there isn't session data and its not testlogin
    if (!session && !isApiTestLogin) {
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }
    return NextResponse.next();
}
export const config = {
    matcher: ["/((?!_next|favicon.ico|.*\\..*|login|api/auth/login).*)",],
};