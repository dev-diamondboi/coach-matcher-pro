"use client";
import { useState } from "react";
import { Input, Button, Card } from "@/src/lib/ui";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const r = await fetch("/api/auth/sign-in", { method: "POST", body: JSON.stringify({ email, password }) });
    if (r.ok) window.location.href = "/dashboard";
    else setError("Invalid credentials");
  }

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <Card className="p-6 max-w-sm w-full">
        <h1 className="text-xl font-semibold">Welcome back</h1>
        <form onSubmit={submit} className="mt-4 grid gap-3">
          <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <Input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <Button type="submit">Sign in</Button>
        </form>
        <p className="mt-3 text-sm text-gray-600">
          No account? <a className="underline" href="/sign-up">Create one</a>
        </p>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </Card>
    </main>
  );
}
