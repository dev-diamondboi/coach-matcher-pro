import { NextResponse } from "next/server";
import { currentUser } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";
import { getStripe } from "@/src/lib/stripe";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { bookingId } = await req.json();
  const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { coach: { include: { coachProfile: true } } } });
  if (!booking || booking.clientId !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const pricePerHour = booking.coach.coachProfile?.pricePerHour ?? 100;
  const minutes = Math.max(30, Math.round((booking.end.getTime() - booking.start.getTime())/60000));
  const amount = Math.round(pricePerHour * (minutes/60) * 100); // cents

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{
      price_data: {
        currency: process.env.CURRENCY || "usd",
        product_data: {
          name: `Coaching session with ${booking.coach.name}`,
          description: `${minutes} minutes`
        },
        unit_amount: amount
      },
      quantity: 1
    }],
    metadata: { bookingId },
    success_url: `${process.env.APP_URL}/dashboard?paid=1`,
    cancel_url: `${process.env.APP_URL}/dashboard?canceled=1`,
  });
  return NextResponse.json({ url: session.url });
}
