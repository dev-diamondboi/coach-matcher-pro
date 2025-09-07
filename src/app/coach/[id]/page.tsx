import { prisma } from "@/src/lib/db";
import { notFound } from "next/navigation";
import { Card, Button, Badge } from "@/src/lib/ui";
import Link from "next/link";

export default async function CoachPage({ params }: { params: { id: string } }) {
  const coachUser = await prisma.user.findUnique({ where: { id: params.id }, include: { coachProfile: true } });
  if (!coachUser || !coachUser.coachProfile) return notFound();

  const cp = coachUser.coachProfile;

  return (
    <main className="p-6 md:p-10 grid gap-6">
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{coachUser.name}</h1>
            <p className="text-gray-600">{cp.bio}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(cp.specialties || "").split(",").map(s => s.trim()).filter(Boolean).map(s => <Badge key={s}>{s}</Badge>)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-semibold">${"{"+""+"}"}{cp.pricePerHour}</div>
            <div className="text-sm text-gray-600">per hour</div>
          </div>
        
        <div className="mt-4 text-sm text-gray-600">Rating: {cp.rating.toFixed(1)} ({cp.ratingCount})</div>
        </div>
        <div className="mt-6">

          <Link href={`/book/${coachUser.id}`}><Button>Book a session</Button></Link>
        </div>
      </Card>
    
      <Card className="p-6 mt-6">
        <h2 className="font-semibold">Reviews</h2>
        {/* List reviews */}
      </Card>
    </main>

  );
}
