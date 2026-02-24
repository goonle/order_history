import { logoutAction } from "@/server/actions/auth.action";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const res = NextResponse.redirect(new URL("/login", request.url));
    await logoutAction(res);
    return res;
}