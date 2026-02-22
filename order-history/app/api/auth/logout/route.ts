import { logoutAction } from "@/server/actions/auth.action";
import { NextResponse } from "next/server";

export async function POST() {
    const res = NextResponse.json({ ok: true });
    await logoutAction(res);
    return res;
}