import Link from "next/link";
import { Button, Card, Badge } from "@/src/lib/ui";

export default function Landing() {
  return (
    <main className="px-6 md:px-10">
      <nav className="flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-brand-600" />
          <span className="font-semibold">Coach Matcher</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="text-sm">Sign in</Link>
          <Link href="/sign-up"><Button>Get started</Button></Link>
        </div>
      </nav>

      <section className="grid md:grid-cols-2 gap-8 items-center py-12">
        <div>
          <Badge>New</Badge>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold leading-tight">
            Meet your ideal coach in minutes.
          </h1>
          <p className="mt-3 text-gray-600">
            Take a quick quiz, get a perfect match, book instantly, and start coaching.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/sign-up"><Button>Start the quiz</Button></Link>
            <Link href="#how" className="px-4 py-2 rounded-2xl border">How it works</Link>
          </div>
        </div>
        <Card className="p-6">
          <div className="grid gap-3">
            <div className="rounded-2xl bg-brand-50 p-4">
              <strong>Quiz</strong>
              <p className="text-sm text-brand-900/80">Brief, science-informed intake to understand your goals.</p>
            </div>
            <div className="rounded-2xl bg-brand-50 p-4">
              <strong>Match</strong>
              <p className="text-sm text-brand-900/80">We calculate fit across specialties, language, budget & time.</p>
            </div>
            <div className="rounded-2xl bg-brand-50 p-4">
              <strong>Book</strong>
              <p className="text-sm text-brand-900/80">Instant scheduling based on coach availability.</p>
            </div>
          </div>
        </Card>
      </section>

      <section id="how" className="py-12">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {[
            ["Onboard", "Sign up and answer a fast quiz."],
            ["Match", "See top coaches with transparent scores."],
            ["Book", "Pick a time and start coaching."],
          ].map(([t,s]) => (
            <Card key={t} className="p-6">
              <h3 className="font-semibold">{t}</h3>
              <p className="text-sm text-gray-600">{s}</p>
            </Card>
          ))}
        </div>
      </section>

      <footer className="py-10 text-center text-sm text-gray-500">© {new Date().getFullYear()} Coach Matcher</footer>
    </main>
  );
}
