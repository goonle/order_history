// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { accountId, password } = await req.json();

  // 1) 입력 검증
  if (!accountId || !password) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }
  console.log("Login attempt:", accountId);
  console.log("Password provided:", password)
  // 2) DB에서 유저 조회 (예시)
  const user = await prisma.user.findUnique({ where: { accountId }});
  if (!user) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

  // 3) 비밀번호 비교 (bcrypt)
  const ok = await bcrypt.compare(password, user.passwordEncrypted);
  if (!ok) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

  // 4) 세션 생성 + 쿠키 세팅 
  const res = NextResponse.json({ ok: true });

  // 예시: session 쿠키 (실제로는 랜덤 세션 토큰을 발급해야 함)
  res.cookies.set("session", "SOME_RANDOM_TOKEN", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return res;
}
