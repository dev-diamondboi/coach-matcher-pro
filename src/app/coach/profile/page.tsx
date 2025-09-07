"use client";
import { useEffect, useState } from "react";
import { Button, Card, Input, Textarea } from "@/src/lib/ui";

export default function CoachProfileEdit() {
  const [bio, setBio] = useState("");
  const [specialties, setSpecialties] = useState("");
  const [languages, setLanguages] = useState("");
  const [price, setPrice] = useState(120);
  const [status, setStatus] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    const r = await fetch("/api/coach/profile/get");
    if (r.ok) {
      const data = await r.json();
      setBio(data.bio || ""); setSpecialties(data.specialties?.join(", ") || "");
      setLanguages(data.languages?.join(", ") || ""); setPrice(data.pricePerHour || 120);
    }
  }

  async function save() {
    const r = await fetch("/api/coach/profile/save", { method: "POST", body: JSON.stringify({
      bio, specialties: specialties.split(",").map(s=>s.trim()).filter(Boolean),
      languages: languages.split(",").map(s=>s.trim()).filter(Boolean), pricePerHour: price
    })});
    setStatus(r.ok ? "Saved" : "Failed");
  }

  return (
    <main className="p-6 md:p-10 grid place-items-center">
      <Card className="p-6 max-w-xl w-full grid gap-3">
        <h1 className="text-xl font-semibold">Coach Profile</h1>
        <Textarea placeholder="Bio" value={bio} onChange={e=>setBio(e.target.value)} />
        <Input placeholder="Specialties (comma separated)" value={specialties} onChange={e=>setSpecialties(e.target.value)} />
        <Input placeholder="Languages (comma separated)" value={languages} onChange={e=>setLanguages(e.target.value)} />
        <Input type="number" placeholder="Price per hour" value={price} onChange={e=>setPrice(parseInt(e.target.value||"0"))} />
        <Button onClick={save}>Save</Button>
        {status && <p className="text-sm text-gray-600">{status}</p>}
      </Card>
    </main>
  );
}
