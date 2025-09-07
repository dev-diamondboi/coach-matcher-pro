"use client";
import { useState } from "react";
import { Input, Button, Card } from "@/src/lib/ui";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CLIENT"|"COACH">("CLIENT");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const r = await fetch("/api/auth/sign-up", { method: "POST", body: JSON.stringify({ email, password, name, role }) });
    if (r.ok) window.location.href = "/dashboard";
    else setError("Sign up failed");
  }

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <Card className="p-6 max-w-sm w-full">
        <h1 className="text-xl font-semibold">Create your account</h1>
        <form onSubmit={submit} className="mt-4 grid gap-3">
          <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
          <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <Input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <div className="flex items-center gap-3">
            <label className="text-sm">I am a:</label>
            <select className="border rounded-xl px-2 py-1" value={role} onChange={e => setRole(e.target.value as any)}>
              <option value="CLIENT">Client</option>
              <option value="COACH">Coach</option>
            </select>
          </div>
          <Button type="submit">Continue</Button>
        </form>
      </Card>
    </main>
  );
}
