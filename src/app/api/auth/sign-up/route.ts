import { NextResponse } from "next/server";
import { register } from "@/src/lib/auth";
import { Role } from "@prisma/client";
import { setSessionCookie } from "@/src/lib/jwt";

export async function POST(req: Request) {
  const { email, password, name, role } = await req.json();
  if (!email || !password || !name) return NextResponse.json({ error: "Missing" }, { status: 400 });
  try {
    const user = await register(email, password, name, role === "COACH" ? Role.COACH : Role.CLIENT);
    const token = JSON.stringify({ uid: user.id, role: user.role, name: user.name });
    setSessionCookie(require("jsonwebtoken").sign(JSON.parse(token), process.env.JWT_SECRET!, { expiresIn: "7d" }));
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
