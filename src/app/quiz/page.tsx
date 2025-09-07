"use client";
import { useState } from "react";
import { Button, Card } from "@/src/lib/ui";

const ALL_TAGS = ["Leadership","Career","Communication","Productivity","Mindset","Stress"];

export default function Quiz() {
  const [tags, setTags] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>(["English"]);
  const [budgetMax, setBudgetMax] = useState<number>(150);

  function toggle(tag: string) {
    setTags(t => t.includes(tag) ? t.filter(x => x !== tag) : [...t, tag]);
  }

  async function submit() {
    const r = await fetch("/api/quiz/submit", { method: "POST", body: JSON.stringify({ goalTags: tags, languages, budgetMax }) });
    if (r.ok) window.location.href = "/matches";
  }

  return (
    <main className="min-h-screen p-6 md:p-10">
      <Card className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold">Your goals</h1>
        <p className="text-sm text-gray-600">Pick what you want to work on.</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {ALL_TAGS.map(t => (
            <button key={t} onClick={() => toggle(t)} className={`px-3 py-1 rounded-xl border ${tags.includes(t) ? "bg-brand-100 border-brand-300" : ""}`}>{t}</button>
          ))}
        </div>

        <h2 className="mt-6 font-semibold">Languages</h2>
        <div className="mt-2">
          <select multiple className="border rounded-xl p-2" value={languages} onChange={e => setLanguages(Array.from(e.target.selectedOptions).map(o => o.value))}>
            {["English","Spanish","French","Dutch"].map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        <h2 className="mt-6 font-semibold">Budget</h2>
        <input type="range" min={50} max={300} value={budgetMax} onChange={e => setBudgetMax(parseInt(e.target.value))} />
        <div className="text-sm text-gray-600 mt-1">Up to ${"{"+""+"}"}{budgetMax}/hour</div>

        <div className="mt-6">
          <Button onClick={submit}>See my matches</Button>
        </div>
      </Card>
    </main>
  );
}
