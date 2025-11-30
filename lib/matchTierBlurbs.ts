// matchTierBlurbs.ts

export type MatchTier =
  | "Soulmate Match"
  | "Twin Flame Match"
  | "Excellent Match"
  | "Opposites Attract"
  | "Difficult Match"
  | "Neutral Match";

export const MATCH_TIER_BLURBS: Record<MatchTier, string> = {
  "Soulmate Match":
    "This is a high-harmony San He (三合) trine match with the same Western element, so your instincts and temperament line up almost perfectly. You tend to understand each other quickly without needing much explanation. When you both show up honestly, the relationship can feel unusually steady and deeply aligned.",

  "Twin Flame Match":
    "You share the same San He (三合) trine but with different, yet compatible, Western elements, creating strong polarity and momentum. The connection is catalytic: it pushes growth, stirs big changes, and rarely feels neutral. When you stay grounded and direct, this can be one of the most energising bonds in the chart.",

  "Excellent Match":
    "This tier reflects strong Chinese harmony through the same trine (三合) or Six Harmonies, Liu He (六合) 'secret friend' links, backed by supportive Western elements. You're often on the same side even when your styles differ, and it's easier to recover from friction. With simple, consistent effort, this pairing tends to feel reliable, constructive and long-lasting.",

  "Opposites Attract":
    "Here you're often sitting in Six Conflicts, Liu Chong (六冲) territory, where the Chinese animals are classic opposites with strong pull and real friction. Chemistry can be memorable, but your instincts react very differently under stress. The connection works best when you treat the contrast as something to navigate, not something to fix in the other person.",

  "Difficult Match":
    "This tier gathers the harsher patterns: Clash (六冲), Harm (相害), Punishment (相刑), Break (相破), and Six Damages (六害) combinations, where the animals tend to strain each other over time. Misunderstandings or emotional wear can build quickly if you lean too hard on the bond. Clear boundaries, realism about expectations, and keeping the link lighter or more situational can protect both people.",

  "Neutral Match":
    "Here there are no strong San He (三合) or Liu He (六合) supports, but also no major clashes or damages in the Chinese chart. The connection sits in the middle ground and takes its shape mainly from your choices, not from heavy astrological pushes. With open communication and shared intent, it can grow in a direction you both consciously choose."
};

export function getTierBlurb(tier: MatchTier): string {
  return MATCH_TIER_BLURBS[tier];
}

