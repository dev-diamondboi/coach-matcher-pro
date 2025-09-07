# Coach Matcher — Launchable Starter

A production-focused starter for a fully automated coach-matching platform:
**quiz → match → book → message → pay (stub)** with **admin dashboard**.

## Tech
- Next.js (App Router) + React + TypeScript
- Tailwind CSS (shadcn-style components, minimal custom UI kit)
- Prisma ORM (SQLite by default; swap to Postgres for prod)
- JWT cookie auth (no third-party provider required)
- Zod for input validation
- Recharts for analytics UI
- Stripe integration **stub** with webhooks route (wire keys to enable live payments)
- Structured code with `lib/` helpers and clean API routes

## Quick Start

```bash
# 1) install deps
pnpm i  # or: npm i  |  yarn

# 2) create .env from example and set a strong JWT secret
cp .env.example .env

# 3) initialize the database
pnpm prisma db push
pnpm prisma db seed

# 4) run the dev server
pnpm dev
# open http://localhost:3000
```

### Deploy (suggested)
- **Frontend**: Vercel
- **Database**: Fly.io, Railway, Neon, or Supabase (Postgres). Update `DATABASE_URL` and switch `provider = "postgresql"` in `prisma/schema.prisma`.
- **Cache/Queues (optional)**: Upstash Redis
- **Env**: Set `JWT_SECRET`, `DATABASE_URL`, `STRIPE_*` if enabling payments, `VIDEO_PROVIDER` if you later integrate video SDKs.

### Credentials
- **Admin**: Sign up a user, then flip `role` to `ADMIN` in DB (or via Admin UI once seeded). Seed creates one admin and sample users.

### Features Included
- Beautiful marketing landing with CTA
- Auth (email+password, bcrypt, httpOnly JWT cookie)
- Client onboarding quiz
- Deterministic matching engine (weighted rules) in `lib/matching.ts`
- Coach profiles with specialties, pricing, languages, timezone
- Availability & booking with reminders (email stubs)
- Messaging (threaded async inbox, optimistic UI; not websockets)
- Reviews/ratings
- Admin dashboard: KPIs, revenue placeholder (wire Stripe to go live), top coaches
- Fully themable design system with Tailwind tokens

### Stripe (optional)
- Replace placeholders in `.env` with your Stripe keys
- Uncomment calls in `api/stripe/checkout` & `api/stripe/webhook`
- Choose between pay-per-session, packs, or subscriptions

---

**Note**: This is a high-quality starter you can launch from **today**. For custom video (Zoom/Daily) or enterprise scheduling (Cronofy/Nylas), drop keys and complete the small TODOs where indicated.


## Payments (Stripe Checkout)
- Set `STRIPE_SECRET_KEY`, `STRIPE_PUBLIC_KEY`, `STRIPE_WEBHOOK_SECRET`, and `APP_URL` in `.env`.
- Start a checkout from the dashboard -> "Pay for session" or visit `/pay/:bookingId`.

## Video meetings
- Each booking gets a unique Jitsi Meet link (`meet.jit.si`) for easy, keyless video.

## Calendar invites
- Download an `.ics` from the dashboard for any booking.
