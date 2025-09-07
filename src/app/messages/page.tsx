"use client";
import { useEffect, useState } from "react";
import { Card, Button, Input } from "@/src/lib/ui";
import { useSearchParams } from "next/navigation";

type Msg = { id: string, content: string, createdAt: string, senderId: string };

export default function Messages() {
  const params = useSearchParams();
  const withId = params.get("with");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");

  async function load() {
    const r = await fetch(`/api/messages/list?with=${withId ?? ""}`);
    if (r.ok) setMessages(await r.json());
  }

  async function send() {
    const r = await fetch(`/api/messages/send`, { method: "POST", body: JSON.stringify({ to: withId, content: text }) });
    if (r.ok) { setText(""); load(); }
  }

  useEffect(() => { load(); }, [withId]);

  return (
    <main className="p-6 md:p-10">
      <Card className="p-6 max-w-2xl mx-auto">
        <h1 className="text-xl font-semibold">Messages</h1>
        <div className="mt-4 h-80 overflow-y-auto border rounded-xl p-3 bg-white">
          {messages.map(m => (
            <div key={m.id} className="py-1 text-sm">
              <span className="text-gray-500">{new Date(m.createdAt).toLocaleString()} — </span>
              <span>{m.content}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <Input value={text} onChange={e => setText(e.target.value)} placeholder="Write a message..." />
          <Button onClick={send}>Send</Button>
        </div>
      </Card>
    </main>
  );
}
