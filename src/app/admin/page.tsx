import { prisma } from "@/src/lib/db";
import { currentUser } from "@/src/lib/auth";
import { Card } from "@/src/lib/ui";
import { Role } from "@prisma/client";

export default async function Admin() {
  const user = await currentUser();
  if (!user || user.role !== Role.ADMIN) return null;

  const [users, bookings, reviews] = await Promise.all([
    prisma.user.count(),
    prisma.booking.count(),
    prisma.review.count(),
  ]);

  return (
    <main className="p-6 md:p-10 grid gap-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6"><div className="text-3xl font-semibold">{users}</div><div className="text-sm text-gray-600">Users</div></Card>
        <Card className="p-6"><div className="text-3xl font-semibold">{bookings}</div><div className="text-sm text-gray-600">Bookings</div></Card>
        <Card className="p-6"><div className="text-3xl font-semibold">{reviews}</div><div className="text-sm text-gray-600">Reviews</div></Card>
      </div>
    </main>
  );
}
