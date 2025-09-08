import { prisma } from "@/src/lib/db";
import Link from "next/link";
import { Card, Badge, Button } from "@/src/lib/ui";

const toList = (v?: string | null) =>
  v?.split(",").map(s => s.trim()).filter(Boolean) ?? [];

export default async function Search({
  searchParams,
}: {
  searchParams: { q?: string; lang?: string; max?: string };
}) {
  const q = searchParams.q || "";
  const lang = searchParams.lang;
  const max = searchParams.max ? parseInt(searchParams.max) : undefined;

  const coaches = await prisma.coachProfile.findMany({
    include: { user: true },
  });

  const filtered = coaches.filter((c) => {
    const specs = toList(c.specialties);
    const langs = toList(c.languages);
    const qok = q
      ? c.bio.toLowerCase().includes(q.toLowerCase()) ||
        specs.some((s) => s.toLowerCase().includes(q.toLowerCase()))
      : true;
    const lok = lang ? langs.includes(lang) : true;
    const pok = max ? c.pricePerHour <= max : true;
    return qok && lok && pok;
  });

  return (
    <main className="p-6 md:p-10">
      <h1 className="text-2xl font-semibold">Browse Coaches</h1>

      <form className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          name="q"
          placeholder="Search specialty..."
          defaultValue={q}
          className="border rounded-xl px-3 py-2"
        />
        <select
          name="lang"
          defaultValue={lang || ""}
          className="border rounded-xl px-3 py-2"
        >
          <option value="">Any language</option>
          {["English", "Spanish", "French", "Dutch"].map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <input
          name="max"
          type="number"
          placeholder="Max $/hr"
          defaultValue={max || ""}
          className="border rounded-xl px-3 py-2"
        />
        <button className="rounded-2xl border px-3 py-2">Filter</button>
      </form>

      <div className="mt-6 grid md:grid-cols-3 gap-6">
        {filtered.map((c) => (
          <Card key={c.id} className="p-6">
            <h3 className="font-semibold">{c.user.name}</h3>
            <p className="text-sm text-gray-600">{c.bio}</p>

            <div className="mt-2 flex flex-wrap gap-2">
              {toList(c.specialties).map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-gray-600">${c.pricePerHour}/hr</span>
              <Link href={`/coach/${c.userId}`}>
                <Button>View</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
