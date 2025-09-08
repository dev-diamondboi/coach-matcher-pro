import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";
import { currentUser } from "@/src/lib/auth";
import { Role } from "@prisma/client";

export const runtime = "nodejs";

type MaybeArray = string | string[] | null | undefined;

function toCSV(value: MaybeArray): string | null {
  if (value == null) return null;
  if (Array.isArray(value)) return value.join(", ");
  return value;
}

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== Role.COACH) {
    return NextResponse.json({ error: "Only coaches can edit coach profile" }, { status: 403 });
  }

  const body = await req.json();
  const bio: string = body.bio ?? "";
  const specialties = toCSV(body.specialties);
  const certifications = toCSV(body.certifications);
  const languages = toCSV(body.languages);
  const formats = toCSV(body.formats) ?? "1-1";
  const timezone: string = body.timezone ?? user.timezone ?? "America/Toronto";
  const pricePerHour: number = Number(body.pricePerHour ?? 0);

  if (!bio.trim()) {
    return NextResponse.json({ error: "Bio is required" }, { status: 400 });
  }
  if (!Number.isFinite(pricePerHour) || pricePerHour <= 0) {
    return NextResponse.json({ error: "pricePerHour must be a positive number" }, { status: 400 });
  }

  const profile = await prisma.coachProfile.upsert({
    where: { userId: user.id },
    update: {
      bio,
      specialties,
      certifications,
      languages,
      timezone,
      pricePerHour,
      formats,
    },
    create: {
      userId: user.id,
      bio,
      specialties,
      certifications,
      languages,
      timezone,
      pricePerHour,
      formats,
    },
    select: {
      id: true,
      userId: true,
      bio: true,
      specialties: true,
      certifications: true,
      languages: true,
      timezone: true,
      pricePerHour: true,
      formats: true,
      rating: true,
      ratingCount: true,
    },
  });

  return NextResponse.json({ profile }, { status: 200 });
}
