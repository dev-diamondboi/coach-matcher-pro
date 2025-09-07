"use client";
import { useEffect, useState } from "react";
import { Button, Card } from "@/src/lib/ui";

export default function BookPage({ params }: { params: { coachId: string } }) {
  const [start, setStart] = useState<string>("");
  const [duration, setDuration] = useState<number>(60);
  const [status, setStatus] = useState<string>("");

  async function submit() {
    setStatus("Booking...");
    const r = await fetch("/api/booking/create", {
      method: "POST",
      body: JSON.stringify({ coachId: params.coachId, startISO: start, durationMins: duration })
    });
    if (r.ok) setStatus("Booked! Check your dashboard.");
    else setStatus("Failed to book");
  }

  return (
    <main className="min-h-screen p-6 md:p-10 grid place-items-center">
      <Card className="p-6 max-w-md w-full">
        <h1 className="text-xl font-semibold">Pick a time</h1>
        <div className="grid gap-3 mt-4">
          <input type="datetime-local" value={start} onChange={e => setStart(e.target.value)} className="border rounded-xl p-2" />
          <select className="border rounded-xl p-2" value={duration} onChange={e => setDuration(parseInt(e.target.value))}>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes</option>
            <option value={90}>90 minutes</option>
          </select>
          <Button onClick={submit}>Book</Button>
          {status && <p className="text-sm text-gray-600">{status}</p>}
        </div>
      </Card>
    </main>
  );
}
