import { NextResponse } from "next/server";
import { currentUser } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const cp = await prisma.coachProfile.findUnique({ where: { userId: user.id } });
  const out = cp ? {
    ...cp,
    specialties: cp.specialties ? (cp.specialties as any as string).split(",").map(s=>s.trim()).filter(Boolean) : [],
    languages: cp.languages ? (cp.languages as any as string).split(",").map(s=>s.trim()).filter(Boolean) : []
  } : {};
  return NextResponse.json(out);
}
