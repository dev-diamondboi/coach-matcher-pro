import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";
import { currentUser } from "@/src/lib/auth";
import { BookingStatus } from "@prisma/client";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const coachId: string = body.coachId;
  const start = new Date(body.start);
  const end = new Date(body.end);
  const location: string = body.location ?? "video";

  // Basic overlap check for the coach (start < existing.end && end > existing.start)
  const conflict = await prisma.booking.findFirst({
    where: {
      coachId,
      AND: [{ start: { lt: end } }, { end: { gt: start } }],
    },
  });
  if (conflict) {
    return NextResponse.json({ error: "Time not available" }, { status: 409 });
  }

  // ✅ Create first, then use the result if you need its id anywhere else
  const createdBooking = await prisma.booking.create({
    data: {
      clientId: user.id,
      coachId,
      start,
      end,
      status: BookingStatus.SCHEDULED,
      location,
    },
    include: {
      client: true,
      coach: true,
    },
  });

  // Example follow-ups that need the ID can happen AFTER creation:
  // await prisma.conversation.upsert({ ... using createdBooking.id if your schema links it ... });

  return NextResponse.json({ booking: createdBooking }, { status: 201 });
}
