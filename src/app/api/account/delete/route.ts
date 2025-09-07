import { NextResponse } from "next/server";
import { currentUser } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";

export async function POST() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Cascade delete (simplified; in production, consider soft-delete)
  await prisma.message.deleteMany({ where: { senderId: user.id } });
  await prisma.booking.deleteMany({ where: { OR: [{ clientId: user.id }, { coachId: user.id }] } });
  await prisma.review.deleteMany({ where: { OR: [{ clientId: user.id }, { coachId: user.id }] } });
  await prisma.clientProfile.deleteMany({ where: { userId: user.id } });
  await prisma.coachProfile.deleteMany({ where: { userId: user.id } });
  await prisma.user.delete({ where: { id: user.id } });

  return NextResponse.json({ ok: true });
}
