// /lib/insight.ts
import type { EngineResult, RankKey } from "@/lib/matchEngine";

const RANK_INSIGHTS: Record<RankKey, string[]> = {
  perfect: [
    "Rare chemistry and clear alignment let you both shine without effort. This is the kind of match where momentum stays high as long as you keep showing up for each other.",
    "Everything clicks naturally — protect the rhythm you’ve built and it only deepens."
  ],
  excellent: [
    "Understanding comes easily here, and you support each other's strengths without much effort. Natural flow and shared confidence create a partnership that feels good to grow in, with mutual support and genuine connection."
  ],
  good: [
    "You click in honest, practical ways — consistent attention keeps this connection thriving. With shared curiosity, it develops into something steady and uplifting.",
    "Small efforts go a long way together; stay present and the bond keeps warming up."
  ],
  fair: [
    "You share sparks of alignment with plenty of room to learn. Clear communication and patience help the connection stay balanced while you figure out what works best.",
    "Mixed signals mean you’ll grow most when you listen closely and adjust together."
  ],
  challenging: [
    "Different instincts and strong personalities can spark chemistry or conflict depending on how you handle it. Boundaries, empathy, and honest check-ins keep things steady.",
    "High contrast energies demand patience — lead with respect if you want it to work."
  ],
};

// Optional flavor based on element/trine relation
function flavorFromFacts(r: EngineResult): string | null {
  const f = r.facts;
  
  // Guard: Check if facts exists
  if (!f) {
    console.warn('[autoInsight] No facts object in result:', r);
    return null;
  }
  
  if (f.sameTrine && f.elemRelation === "same") return "Shared pace and outlook keep things simple and strong.";
  if (f.sameTrine && f.elemRelation === "compatible") return "You balance each other well while moving in the same general direction.";
  if (f.sameTrine && f.elemRelation === "semi") return "Shared rhythm helps smooth over differences in style.";
  if (!f.sameTrine && f.elemRelation === "same") return "Even with different instincts, your outlook aligns and keeps you steady.";
  if (!f.sameTrine && f.elemRelation === "semi") return "Different rhythms, workable differences — respect goes a long way.";
  if (f.elemRelation === "conflicting") return "You'll need patience and clear communication to stay connected.";
  return null;
}

export function autoInsight(result: EngineResult): string {
  const bank = RANK_INSIGHTS[result.rankKey] || [];
  const primary = bank[0] ?? "This connection has potential when both of you show up with intention and care.";
  const secondary = bank[1] ?? "Stay curious about each other and keep communication open so the bond can grow.";

  let narrative = `${primary.trim()} ${secondary.trim()}`.trim();

  const tail = flavorFromFacts(result);
  if (tail) {
    narrative = `${narrative} ${tail.trim()}`.trim();
  }

  return narrative;
}

