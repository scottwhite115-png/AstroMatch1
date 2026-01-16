// /data/insight_overrides.ts
import type { RankKey } from "@/lib/matchEngine";

export type OverrideKey = `${Lowercase<string>}_${Lowercase<string>}__${Lowercase<string>}_${Lowercase<string>}`;

export interface InsightOverride {
  rank: Extract<RankKey, "perfect" | "excellent">;
  insight: string; // 1–4 short sentences in Insight tone
}

export const INSIGHT_OVERRIDES: Record<OverrideKey, InsightOverride> = {
  // Soulmate — Aquarius Monkey × Gemini Rat
  "aquarius_monkey__gemini_rat": {
    rank: "perfect",
    insight:
      "You connect through curiosity, humor, and quick ideas. Friendship comes first and makes everything easier. You energize each other to try new things and keep life moving. It's light, clever, and genuinely fun."
  },

  // Twin Flame — Leo Dragon × Aries Monkey
  "leo_dragon__aries_monkey": {
    rank: "excellent",
    insight:
      "High energy from the start. You push each other to be bold and celebrate every win. Respect keeps the spark healthy, and playfulness keeps it alive."
  },

  // Soulmate — Cancer Rabbit × Pisces Goat
  "cancer_rabbit__pisces_goat": {
    rank: "perfect",
    insight:
      "This is a calm, supportive bond. You read each other well and make space for feelings. Small acts of care build real trust over time."
  },

  // Add more ⭐/🔥 pairs here as you write them…
};

