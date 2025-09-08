import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";
import { currentUser } from "@/src/lib/auth";
import { Role } from "@prisma/client";

export const runtime = "nodejs";

// Accept "HH:mm" strings or numbers (minutes from midnight)
function toMinutes(v: string | number): number {
  if (typeof v === "number") return v;
  const [h, m] = v.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) throw new Error("Invalid time format");
  return h * 60 + m;
}

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== Role.COACH) {
    return NextResponse.json({ error: "Not coach" }, { status: 400 });
  }

  const { dayOfWeek, start, end } = await req.json();

  // Find the coach profile owned by this user
  const coachProfile = await prisma.coachProfile.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });
  if (!coachProfile) {
    return NextResponse.json({ error: "Coach profile not found" }, { status: 404 });
  }

  // Normalize and validate times
  const d = Number(dayOfWeek);
  const startMins = toMinutes(start);
  const endMins = toMinutes(end);

  if (!(d >= 0 && d <= 6)) {
    return NextResponse.json({ error: "dayOfWeek must be 0–6 (Sun–Sat)" }, { status: 400 });
  }
  if (!(startMins >= 0 && endMins > startMins && endMins <= 24 * 60)) {
    return NextResponse.json({ error: "Invalid start/end minutes" }, { status: 400 });
  }

  const availability = await prisma.availability.create({
    data: {
      coachId: coachProfile.id, // <-- Availability.coachId references CoachProfile.id
      dayOfWeek: d,
      startMins,
      endMins,
    },
  });

  return NextResponse.json({ availability }, { status: 201 });
}
