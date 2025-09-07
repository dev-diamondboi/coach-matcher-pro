import { NextResponse } from "next/server";
import { currentUser } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { coachId, rating, comment } = await req.json();
  const rev = await prisma.review.create({ data: { clientId: user.id, coachId, rating, comment } });
  // update aggregates
  const agg = await prisma.review.aggregate({ _avg: { rating: true }, _count: { rating: true }, where: { coachId } });
  await prisma.coachProfile.update({ where: { userId: coachId }, data: { rating: agg._avg.rating || 0, ratingCount: agg._count.rating || 0 } });
  return NextResponse.json({ ok: true, rev });
}
