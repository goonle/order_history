import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export function setSessionCookie(res: NextResponse, sessionToken: string) {
    res.cookies.set("session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });
}

export async function getSessionToken() :Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get("session")?.value || null;
}

export function clearSessionCookie(res: NextResponse) {
    res.cookies.set("session", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });
}