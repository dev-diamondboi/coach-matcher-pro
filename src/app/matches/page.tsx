import { prisma } from "@/src/lib/db";
import { currentUser } from "@/src/lib/auth";
import { pickTop } from "@/src/lib/matching";
import Link from "next/link";
import { Card, Button } from "@/src/lib/ui";

export default async function Matches() {
  const user = await currentUser();
  if (!user) return null;

  const q = await prisma.questionnaire.findFirst({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
  const coaches = await prisma.coachProfile.findMany({ include: { user: true, availability: true } });

  function csv(s?: string | null) { return (s||"").split(",").map(x=>x.trim()).filter(Boolean); }
  let cards: any[] = [];
  if (q) {
    const quiz = JSON.parse(q.answers as unknown as string);
    const top = pickTop(coaches, quiz, 3);
    cards = top.map(t => ({
      id: t.coach.userId,
      name: t.coach.user.name,
      bio: t.coach.bio,
      price: t.coach.pricePerHour,
      score: Math.round(t.score)
    }));
  }

  return (
    <main className="p-6 md:p-10">
      <h1 className="text-2xl font-semibold">Your Matches</h1>
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        {cards.length === 0 && <p>No quiz found. <a className="underline" href="/quiz">Take the quiz</a>.</p>}
        {cards.map(c => (
          <Card key={c.id} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{c.name}</h3>
                <p className="text-sm text-gray-600">{c.bio}</p>
              </div>
              <div className="text-right">
                <div className="text-sm">Score</div>
                <div className="text-xl font-semibold">{c.score}</div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">${"{"+""+"}"}{c.price}/hr</span>
              <Link href={`/coach/${c.id}`}><Button>View</Button></Link>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
