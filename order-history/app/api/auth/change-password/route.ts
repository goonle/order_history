import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // your logic here
  return NextResponse.json({ ok: true });
}