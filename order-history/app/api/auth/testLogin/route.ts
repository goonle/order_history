// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { loginWithTestAccountAction } from "@/server/actions/auth.action";
import { setSessionCookie } from "@/server/utils/session-cookie.utils";
import { createSession } from "@/server/services/session.service";

export async function POST() {
  // Authenticate user
  const authResult = await loginWithTestAccountAction();

  if (!authResult.ok) {
    return NextResponse.json({ ok: false, code: authResult.code }, { status: authResult.status });
  }
  console.log("/auth/testLogin : authResult", authResult);
  // Create session and set cookie
  const token = await createSession(authResult.data!.userId);
  console.log("/auth/testLogin : token", token);
  const res = NextResponse.json({ ok: true });
  setSessionCookie(res, token);

  return res;
}

