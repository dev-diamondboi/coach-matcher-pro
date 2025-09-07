import { NextResponse } from "next/server";
import { currentUser } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";

export async function GET(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const otherId = searchParams.get("with");

  // Find or create conversation
  let conv = await prisma.conversation.findFirst({ where: { clientId: user.id, coachId: otherId ?? "" } });
  if (!conv && otherId) {
    // check roles to assign client/coach
    const other = await prisma.user.findUnique({ where: { id: otherId } });
    if (other) {
      const isClient = user.role === "CLIENT";
      conv = await prisma.conversation.create({
        data: { clientId: isClient ? user.id : other.id, coachId: isClient ? other.id : user.id }
      });
    }
  }
  if (!conv) return NextResponse.json([]);

  const msgs = await prisma.message.findMany({ where: { conversationId: conv.id }, orderBy: { createdAt: "asc" } });
  return NextResponse.json(msgs);
}
