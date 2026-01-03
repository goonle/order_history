import "server-only";
import { NextResponse } from "next/server";

export function setSessionCookie(res: NextResponse, sessionToken: string) {
    res.cookies.set("session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });
}