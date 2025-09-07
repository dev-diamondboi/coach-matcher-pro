import { NextResponse } from "next/server";
import { currentUser } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { coachId, startISO, durationMins } = await req.json();
  const start = new Date(startISO);
  const end = new Date(start.getTime() + (durationMins || 60) * 60000);

  // Simple overlap check
  const conflict = await prisma.booking.findFirst({
    where: {
      coachId,
      OR: [
        { start: { lt: end }, end: { gt: start } }
      ]
    }
  });
  if (conflict) return NextResponse.json({ error: "Time not available" }, { status: 409 });

  const booking = await prisma.booking.create({
    data: {
      clientId: user.id,
      coachId,
      start,
      end,
      status: "SCHEDULED",
      location: `https://meet.jit.si/coach-matcher-${booking.id}`
    }
  });

  return NextResponse.json({ ok: true, booking });
}
