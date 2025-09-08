import { prisma } from "@/src/lib/db";
import { BookingStatus } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function ymd(d: Date) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default async function RevenuePage() {
  // Get completed bookings
  const bookings = await prisma.booking.findMany({
    where: { status: BookingStatus.COMPLETED },
    select: { start: true, coachId: true },
  });

  // Get coach rates
  const coachIds = Array.from(new Set(bookings.map(b => b.coachId)));
  const profiles = coachIds.length
    ? await prisma.coachProfile.findMany({
        where: { userId: { in: coachIds } },
        select: { userId: true, pricePerHour: true },
      })
    : [];
  const priceByCoach = new Map(profiles.map(p => [p.userId, p.pricePerHour]));

  // Aggregate per day
  const byDay = new Map<string, { date: string; revenue: number; count: number }>();
  for (const b of bookings) {
    const key = ymd(b.start);
    const price = priceByCoach.get(b.coachId) ?? 0;
    const cur = byDay.get(key) ?? { date: key, revenue: 0, count: 0 };
    cur.revenue += price;
    cur.count += 1;
    byDay.set(key, cur);
  }
  const data = Array.from(byDay.values()).sort((a, z) => a.date.localeCompare(z.date));

  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalSessions = data.reduce((sum, d) => sum + d.count, 0);
  const avgPerDay = data.length ? Math.round(totalRevenue / data.length) : 0;

  return (
    <main style={{ padding: "24px", display: "grid", gap: "24px" }}>
      <h1 style={{ fontSize: "20px", fontWeight: 600 }}>Revenue</h1>

      <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
          <div style={{ color: "#6b7280", fontSize: 12 }}>Total revenue</div>
          <div style={{ fontSize: 24, fontWeight: 600 }}>${totalRevenue}</div>
        </div>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
          <div style={{ color: "#6b7280", fontSize: 12 }}>Completed sessions</div>
          <div style={{ fontSize: 24, fontWeight: 600 }}>{totalSessions}</div>
        </div>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
          <div style={{ color: "#6b7280", fontSize: 12 }}>Avg revenue / day</div>
          <div style={{ fontSize: 24, fontWeight: 600 }}>${avgPerDay}</div>
        </div>
      </div>

      <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
        <h2 style={{ fontWeight: 600, marginBottom: 12 }}>Revenue & Sessions by Day</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
            <thead style={{ color: "#6b7280", textAlign: "left" }}>
              <tr>
                <th style={{ padding: "8px 16px" }}>Date</th>
                <th style={{ padding: "8px 16px" }}>Revenue</th>
                <th style={{ padding: "8px 16px" }}>Sessions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ padding: "12px 16px", color: "#6b7280" }}>
                    No completed sessions yet.
                  </td>
                </tr>
              ) : (
                data.map(d => (
                  <tr key={d.date} style={{ borderTop: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "8px 16px" }}>{d.date}</td>
                    <td style={{ padding: "8px 16px" }}>${d.revenue}</td>
                    <td style={{ padding: "8px 16px" }}>{d.count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
