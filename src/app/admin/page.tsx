import { prisma } from "@/src/lib/db";
import { Card } from "@/src/lib/ui";
import dynamic from "next/dynamic";
import { BookingStatus } from "@prisma/client";

// Import the client chart lazily with SSR disabled
const RevenueChart = dynamic(
  () => import("@/src/components/charts/RevenueChart"),
  { ssr: false }
);

type RevenuePoint = { date: string; revenue: number; count: number };

// Helper to format a Date -> YYYY-MM-DD (UTC)
function ymd(d: Date) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default async function RevenuePage() {
  // Fetch completed bookings
  const bookings = await prisma.booking.findMany({
    where: { status: BookingStatus.COMPLETED },
    select: { start: true, coachId: true },
  });

  // Grab coach hourly rates in one query
  const coachIds = Array.from(new Set(bookings.map((b) => b.coachId)));
  const profiles =
    coachIds.length === 0
      ? []
      : await prisma.coachProfile.findMany({
          where: { userId: { in: coachIds } },
          select: { userId: true, pricePerHour: true },
        });
  const priceByCoach = new Map(profiles.map((p) => [p.userId, p.pricePerHour]));

  // Aggregate by day
  const byDay = new Map<string, RevenuePoint>();
  for (const b of bookings) {
    const key = ymd(b.start);
    const price = priceByCoach.get(b.coachId) ?? 0;
    const cur = byDay.get(key) ?? { date: key, revenue: 0, count: 0 };
    cur.revenue += price;
    cur.count += 1;
    byDay.set(key, cur);
  }
  const data = Array.from(byDay.values()).sort((a, z) =>
    a.date.localeCompare(z.date)
  );

  // Simple totals for the header
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalSessions = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <main className="p-6 md:p-10 grid gap-6">
      <h1 className="text-2xl font-semibold">Revenue</h1>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="text-sm text-gray-600">Total revenue</div>
          <div className="text-2xl font-semibold">${totalRevenue}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-gray-600">Completed sessions</div>
          <div className="text-2xl font-semibold">{totalSessions}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-gray-600">Avg revenue / day</div>
          <div className="text-2xl font-semibold">
            {data.length ? `$${Math.round(totalRevenue / data.length)}` : "$0"}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="font-semibold mb-4">Revenue & Sessions by Day</h2>
        {/* Client-only chart */}
        <RevenueChart data={data} />
      </Card>
    </main>
  );
}
