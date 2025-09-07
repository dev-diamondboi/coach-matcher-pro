import { NextResponse } from "next/server";
import { getStripe } from "@/src/lib/stripe";
import { prisma } from "@/src/lib/db";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripe = getStripe();

  let event;
  try {
    if (!sig || !secret) throw new Error("Missing webhook secret");
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session: any = event.data.object;
    const bookingId = session.metadata?.bookingId;
    if (bookingId) {
      await prisma.booking.update({ where: { id: bookingId }, data: { status: "SCHEDULED" } });
    }
  }
  return NextResponse.json({ received: true });
}
