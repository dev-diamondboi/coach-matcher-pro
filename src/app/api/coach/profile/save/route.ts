import { NextResponse } from "next/server";
import { currentUser } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { bio, specialties, languages, pricePerHour } = await req.json();
  if (!user.coachProfile) {
    await prisma.coachProfile.create({ data: {
      userId: user.id, bio, specialties: (specialties||[]).join(", "), languages: (languages||[]).join(", "), timezone: user.timezone, pricePerHour, formats: "1-1"
    }});
  } else {
    await prisma.coachProfile.update({ where: { userId: user.id }, data: { bio, specialties: (specialties||[]).join(", "), languages: (languages||[]).join(", "), pricePerHour } });
  }
  return NextResponse.json({ ok: true });
}
