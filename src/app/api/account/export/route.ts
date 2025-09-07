import { NextResponse } from "next/server";
import { currentUser } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [clientProfile, coachProfile, bookings, messages, reviews] = await Promise.all([
    prisma.clientProfile.findUnique({ where: { userId: user.id } }),
    prisma.coachProfile.findUnique({ where: { userId: user.id } }),
    prisma.booking.findMany({ where: { OR: [{ clientId: user.id }, { coachId: user.id }] } }),
    prisma.message.findMany({ where: { senderId: user.id } }),
    prisma.review.findMany({ where: { OR: [{ clientId: user.id }, { coachId: user.id }] } }),
  ]);

  return NextResponse.json({ user, clientProfile, coachProfile, bookings, messages, reviews });
}
