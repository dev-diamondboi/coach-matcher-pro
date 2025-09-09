// src/app/messages/page.tsx
import { prisma } from "@/src/lib/db";
import { currentUser } from "@/src/lib/auth";
import Link from "next/link";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Search = { with?: string };

export default async function MessagesPage({ searchParams }: { searchParams: Search }) {
  const user = await currentUser();
  if (!user) return null;

  const partnerId = searchParams.with ?? null;

  // List recent conversations for the sidebar
  const conversations = await prisma.conversation.findMany({
    where: { OR: [{ clientId: user.id }, { coachId: user.id }] },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  // If a partner is selected, load that thread (client↔coach in either direction)
  const thread = partnerId
    ? await prisma.conversation.findFirst({
        where: {
          OR: [
            { clientId: user.id, coachId: partnerId },
            { clientId: partnerId, coachId: user.id },
          ],
        },
        include: { messages: { orderBy: { createdAt: "asc" }, include: { sender: true } } },
      })
    : null;

  return (
    <main className="p-6 md:p-10">
      <h1 className="text-2xl font-semibold mb-4">Messages</h1>

      <div className="grid md:grid-cols-[260px_1fr] gap-6">
        <aside className="border rounded-2xl p-3">
          <div className="text-sm text-gray-600 mb-2">Conversations</div>
          <ul className="grid gap-2">
            {conversations.length === 0 && <li className="text-sm text-gray-500">No conversations yet.</li>}
            {conversations.map((c) => {
              const otherId = c.clientId === user.id ? c.coachId : c.clientId;
              const active = otherId === partnerId;
              return (
                <li key={c.id}>
                  <Link
                    className={`block rounded-xl px-3 py-2 border ${active ? "bg-gray-50" : ""}`}
                    href={`/messages?with=${otherId}`}
                  >
                    Chat with {otherId.slice(0, 6)}…
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>

        <section className="border rounded-2xl p-4">
          {!partnerId && <p className="text-sm text-gray-600">Pick a conversation on the left.</p>}

          {partnerId && !thread && (
            <p className="text-sm text-gray-600">No messages with this user yet.</p>
          )}

          {thread && (
            <div className="grid gap-3">
              {thread.messages.map((m) => (
                <div key={m.id} className="border rounded-xl px-3 py-2">
                  <div className="text-xs text-gray-500">
                    {m.senderId === user.id ? "You" : m.sender.name ?? m.senderId.slice(0, 6)} •{" "}
                    {new Date(m.createdAt).toLocaleString()}
                  </div>
                  <div>{m.content}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
