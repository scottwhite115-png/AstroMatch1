import { getOrCreateDailyTarotDraw } from '@/app/actions/explore/tarot';

export default async function TarotPage() {
  const draw = await getOrCreateDailyTarotDraw();
  const cards = JSON.parse(draw.cardsJson) as any[];
  const card = cards[0];

  return (
    <main className="w-full">
      <header className="px-4 py-4">
        <h1 className="text-lg font-semibold text-white">Tarot</h1>
        <p className="mt-1 text-sm text-white/60">Your daily card.</p>
      </header>

      <section className="px-4 py-4">
        <div className="text-sm text-white/70">{card.orientation}</div>
        <div className="mt-1 text-xl font-semibold text-white">{card.name}</div>
        <p className="mt-3 text-sm leading-relaxed text-white/85">{card.meaningShort}</p>
      </section>

      <div className="h-px w-full bg-white/10" />
    </main>
  );
}

