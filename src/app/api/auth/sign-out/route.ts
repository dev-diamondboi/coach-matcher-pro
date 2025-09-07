import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/src/lib/jwt";

export async function POST() {
  clearSessionCookie();
  return NextResponse.json({ ok: true });
}
