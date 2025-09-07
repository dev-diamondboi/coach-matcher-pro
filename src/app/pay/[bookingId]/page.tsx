"use client";
import { useEffect, useState } from "react";
import { Button, Card } from "@/src/lib/ui";

export default function Pay({ params }: { params: { bookingId: string } }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go() {
    setLoading(true);
    setError(null);
    const r = await fetch("/api/checkout/create", { method: "POST", body: JSON.stringify({ bookingId: params.bookingId }) });
    const data = await r.json();
    if (r.ok && data.url) {
      window.location.href = data.url;
    } else {
      setError(data.error || "Could not start checkout");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <Card className="p-6 max-w-md w-full text-center">
        <h1 className="text-xl font-semibold">Secure payment</h1>
        <p className="text-sm text-gray-600 mt-2">You will be redirected to Stripe Checkout.</p>
        <Button onClick={go} disabled={loading} className="mt-4">{loading ? "Preparing..." : "Proceed to Checkout"}</Button>
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      </Card>
    </main>
  );
}
