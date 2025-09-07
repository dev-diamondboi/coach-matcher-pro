import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const bookingId = searchParams.get("bookingId")!;
  const b = await prisma.booking.findUnique({ where: { id: bookingId }, include: { client: true, coach: true } });
  if (!b) return NextResponse.json({ error: "Not found" }, { status: 404 });

  function toICSDate(d: Date) {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
  }
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Coach Matcher//EN",
    "BEGIN:VEVENT",
    `UID:${b.id}`,
    `DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART:${toICSDate(b.start)}`,
    `DTEND:${toICSDate(b.end)}`,
    `SUMMARY:Coaching with ${b.coach.name}`,
    `DESCRIPTION:Join video: ${b.location}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="booking-${b.id}.ics"`
    }
  });
}
