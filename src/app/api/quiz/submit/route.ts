import { NextResponse } from "next/server";
import { currentUser } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";
import { z } from "zod";

const Schema = z.object({
  goalTags: z.array(z.string()).min(1),
  languages: z.array(z.string()).min(1),
  budgetMax: z.number().int().min(10).max(1000).optional()
});

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json();
  const parsed = Schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const score = parsed.data.goalTags.length * 10;
  await prisma.questionnaire.create({
    data: { userId: user.id, answers: JSON.stringify(parsed.data), score }
  });

  return NextResponse.json({ ok: true });
}
