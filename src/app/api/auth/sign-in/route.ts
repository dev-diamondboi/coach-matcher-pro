import { NextResponse } from "next/server";
import { authenticate } from "@/src/lib/auth";
import { setSessionCookie } from "@/src/lib/jwt";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const result = await authenticate(email, password);
  if (!result) return NextResponse.json({ error: "Invalid" }, { status: 401 });
  setSessionCookie(result.token);
  return NextResponse.json({ ok: true });
}
