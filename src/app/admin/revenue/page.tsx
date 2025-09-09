import { prisma } from "@/src/lib/db";
import { currentUser } from "@/src/lib/auth";
import { Role, BookingStatus } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function Revenue() {
  const user = await currentUser();
  if (!user || user.role !== Role.ADMIN) return null;

  const bookings = await prisma.booking.findMany({
    where: { status: BookingStatus.COMPLETED },
    include: { coach: { include: { coachProfile: true } } },
  });

  // Aggregate revenue by YYYY-MM
  const byMonth = new Map<string, number>();
  for (const b of bookings) {
    const mins = Math.max(30, Math.round((b.end.getTime() - b.start.getTime()) / 60000));
    const rate = b.coach.coachProfile?.pricePerHour ?? 100;
    const amount = (mins / 60) * rate;
    const month = b.start.toISOString().slice(0, 7);
    byMonth.set(month, (byMonth.get(month) ?? 0) + amount);
  }

  const data = Array.from(byMonth.entries())
    .sort(([a], [z]) => a.localeCompare(z))
    .map(([month, revenue]) => ({ month, revenue: Math.round(revenue) }));

  const total = data.reduce((s, d) => s + d.revenue, 0);

  return (
    <main style={{ padding: 24, display: "grid", gap: 24 }}>
      <h1 style={{ fontSize: 20, fontWeight: 600 }}>Revenue</h1>

      <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
        <div style={{ marginBottom: 12, display: "flex", gap: 24 }}>
          <div>
            <div style={{ color: "#6b7280", fontSize: 12 }}>Total revenue</div>
            <div style={{ fontWeight: 600, fontSize: 20 }}>${total}</div>
          </div>
          <div>
            <div style={{ color: "#6b7280", fontSize: 12 }}>Completed sessions</div>
            <div style={{ fontWeight: 600, fontSize: 20 }}>{bookings.length}</div>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead style={{ color: "#6b7280", textAlign: "left" }}>
              <tr>
                <th style={{ padding: "8px 12px" }}>Month</th>
                <th style={{ padding: "8px 12px" }}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={2} style={{ padding: "10px 12px", color: "#6b7280" }}>
                    No completed sessions yet.
                  </td>
                </tr>
              ) : (
                data.map((r) => (
                  <tr key={r.month} style={{ borderTop: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "8px 12px" }}>{r.month}</td>
                    <td style={{ padding: "8px 12px" }}>${r.revenue}</td>
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
