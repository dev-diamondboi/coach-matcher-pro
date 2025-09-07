import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";
import { currentUser } from "@/src/lib/auth";

function toMins(hhmm: string) {
  const [h,m] = hhmm.split(":").map(Number);
  return (h*60 + m);
}

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!user.coachProfile) return NextResponse.json({ error: "Not coach" }, { status: 400 });

  const { dayOfWeek, start, end } = await req.json();
  await prisma.availability.create({
    data: {
      coachId: user.coachProfile.id,
      dayOfWeek,
      startMins: toMins(start),
      endMins: toMins(end)
    }
  });
  return NextResponse.json({ ok: true });
}
