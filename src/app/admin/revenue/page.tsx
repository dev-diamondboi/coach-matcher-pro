import { prisma } from "@/src/lib/db";
import { currentUser } from "@/src/lib/auth";
import { Role } from "@prisma/client";
import { Card } from "@/src/lib/ui";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";

export default async function Revenue() {
  const user = await currentUser();
  if (!user || user.role !== Role.ADMIN) return null;

  const bookings = await prisma.booking.findMany({ include: { coach: { include: { coachProfile: true } } } });
  const rows = bookings.map(b => {
    const mins = Math.max(30, Math.round((b.end.getTime()-b.start.getTime())/60000));
    const rate = b.coach.coachProfile?.pricePerHour ?? 100;
    return { month: b.start.toISOString().slice(0,7), amount: (mins/60)*rate };
  });
  const byMonth = rows.reduce((acc: any, r) => (acc[r.month]=(acc[r.month]||0)+r.amount, acc), {});
  const data = Object.keys(byMonth).sort().map(m => ({ month: m, revenue: Math.round(byMonth[m]) }));

  return (
    <main className="p-6 md:p-10 grid gap-6">
      <h1 className="text-2xl font-semibold">Revenue</h1>
      <Card className="p-6">
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <BarChart data={data}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </main>
  );
}
