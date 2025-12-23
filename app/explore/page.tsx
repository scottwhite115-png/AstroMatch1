import { prisma } from '@/lib/prisma';

export default async function ExplorePage() {
  const todayKey = new Date().toISOString().slice(0,10);

  const rows = await prisma.horoscopeCache.findMany({
    where: { system: 'VEDIC', period: 'DAILY', dateKey: todayKey },
    orderBy: { sign: 'asc' },
  });

  return (
    <main className="w-full">
      <header className="px-4 py-4">
        <h1 className="text-lg font-semibold text-white">Explore</h1>
        <p className="mt-1 text-sm text-white/60">Daily Vedic forecasts for all signs.</p>
      </header>

      <section className="divide-y divide-white/10">
        {rows.map(r => (
          <article key={r.id} className="px-4 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-white capitalize">{r.sign}</h2>
              <span className="text-xs text-white/40">{r.source}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-white/85">{r.content}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

