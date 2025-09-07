import Link from "next/link";
import { prisma } from "@/src/lib/db";
import { currentUser } from "@/src/lib/auth";
import { Card, Button } from "@/src/lib/ui";
import { Role } from "@prisma/client";

export default async function Dashboard() {
  const user = await currentUser();
  if (!user) return null;

  const upcoming = await prisma.booking.findMany({
    where: {
      OR: [{ clientId: user.id }, { coachId: user.id }],
      start: { gte: new Date() },
    },
    orderBy: { start: "asc" },
    take: 5,
    include: {
      client: true,
      coach: { include: { coachProfile: true } },
    },
  });

  return (
    <main className="p-6 md:p-10 grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        {user.role === Role.CLIENT ? (
          <Link href="/quiz">
            <Button>Take/Update Quiz</Button>
          </Link>
        ) : null}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="font-semibold">Upcoming</h2>
          <div className="mt-3 grid gap-2">
            {upcoming.length === 0 ? (
              <p className="text-sm text-gray-600">No upcoming sessions.</p>
            ) : (
              upcoming.map((bk) => (
                <div
                  key={bk.id}
                  className="flex items-center justify-between py-2 border-b"
                >
                  <div>
                    <div className="font-medium">
                      {new Date(bk.start).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {bk.clientId === user.id
                        ? `With ${bk.coach?.name ?? "Coach"}`
                        : `With ${bk.client?.name ?? "Client"}`}
                    </div>
                    <div className="text-xs text-gray-500">
                      <a
                        className="underline"
                        href={bk.location}
                        target="_blank"
                      >
                        Open video room
                      </a>
                    </div>
                  </div>

                  <div className="text-right space-y-2">
                    <a
                      className="text-sm underline block"
                      href={`/api/booking/ics?bookingId=${bk.id}`}
                    >
                      Add to calendar (.ics)
                    </a>

                    {bk.clientId === user.id && (
                      <a
                        href={`/pay/${bk.id}`}
                        className="text-sm underline block"
                      >
                        Pay for session
                      </a>
                    )}

                    <Link
                      href={`/messages?with=${
                        bk.clientId === user.id ? bk.coachId : bk.clientId
                      }`}
                      className="text-sm underline block"
                    >
                      Open chat
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold">Actions</h2>
          <div className="mt-3 grid gap-3">
            {user.role === Role.CLIENT && (
              <>
                <Link href="/matches">
                  <Button>See My Matches</Button>
                </Link>
                <Link href="/search">
                  <Button className="bg-white text-black border">
                    Browse Coaches
                  </Button>
                </Link>
              </>
            )}

            {user.role === Role.COACH && (
              <>
                <Link href="/coach/profile">
                  <Button>Edit Coach Profile</Button>
                </Link>
                <Link href="/coach/availability">
                  <Button className="bg-white text-black border">
                    Set Availability
                  </Button>
                </Link>
              </>
            )}

            {user.role === Role.ADMIN && (
              <Link href="/admin">
                <Button>Open Admin</Button>
              </Link>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}
