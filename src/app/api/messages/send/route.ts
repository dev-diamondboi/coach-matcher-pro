import { NextResponse } from "next/server";
import { currentUser } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { to, content } = await req.json();
  if (!to || !content) return NextResponse.json({ error: "Missing" }, { status: 400 });

  let conv = await prisma.conversation.findFirst({
    where: {
      OR: [
        { clientId: user.id, coachId: to },
        { clientId: to, coachId: user.id }
      ]
    }
  });
  if (!conv) {
    const other = await prisma.user.findUnique({ where: { id: to } });
    if (!other) return NextResponse.json({ error: "No user" }, { status: 400 });
    const isClient = user.role === "CLIENT";
    conv = await prisma.conversation.create({ data: { clientId: isClient ? user.id : other.id, coachId: isClient ? other.id : user.id } });
  }

  const msg = await prisma.message.create({ data: { conversationId: conv.id, senderId: user.id, content } });
  return NextResponse.json({ ok: true, msg });
}
