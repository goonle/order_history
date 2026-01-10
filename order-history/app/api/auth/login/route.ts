// app/api/auth/login/route.ts
import crypto from "crypto";
import { NextResponse } from "next/server";
import { loginAction } from "@/server/actions/auth.action";
import { setSessionCookie } from "@/server/utils/session-cookie.utils";
import { createSession } from "@/server/services/session.service";

export async function POST(req: Request) {
  const { accountId, password } = await req.json();
  // Authenticate user
  const authResult = await loginAction(accountId, password);
  if (!authResult.ok) {
    return NextResponse.json({ ok: false, code: authResult.code }, { status: authResult.status });
  }

  // Create session and set cookie
  const token = await createSession(authResult.data!.userId);
  const res = NextResponse.json({ ok: true });
  setSessionCookie(res, token);

  return res;
}
