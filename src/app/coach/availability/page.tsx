"use client";
import { useEffect, useState } from "react";
import { Button, Card, Input } from "@/src/lib/ui";

export default function Availability() {
  const [day, setDay] = useState<number>(1);
  const [start, setStart] = useState<string>("09:00");
  const [end, setEnd] = useState<string>("12:00");
  const [status, setStatus] = useState("");

  async function add() {
    const r = await fetch("/api/coach/availability/add", { method: "POST", body: JSON.stringify({ dayOfWeek: day, start, end }) });
    if (r.ok) setStatus("Added");
    else setStatus("Failed");
  }

  return (
    <main className="p-6 md:p-10 grid place-items-center">
      <Card className="p-6 max-w-md w-full">
        <h1 className="text-xl font-semibold">Set Weekly Availability</h1>
        <div className="grid gap-3 mt-3">
          <select className="border rounded-xl p-2" value={day} onChange={e => setDay(parseInt(e.target.value))}>
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d,i)=> <option key={i} value={i}>{d}</option>)}
          </select>
          <Input type="time" value={start} onChange={e => setStart(e.target.value)} />
          <Input type="time" value={end} onChange={e => setEnd(e.target.value)} />
          <Button onClick={add}>Add</Button>
          {status && <p className="text-sm text-gray-600">{status}</p>}
        </div>
      </Card>
    </main>
  );
}
