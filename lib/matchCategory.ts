// /lib/matchCategory.ts
// Adapts the new compatibility classifier into legacy style objects.

import { classify, type ClassifyInput } from "@/engine/compat/classify";
import type { WestSign, EastAnimal } from "@/engine/compat/maps";
import type { Tier } from "@/engine/labels";

export interface CategoryStyle {
  label: string;
  emoji: string;
  colorRgb: string;
}

const TIER_STYLES: Record<Tier, CategoryStyle> = {
  perfect: {
    label: "Perfect Match",
    emoji: "✨",
    colorRgb: "rgb(212, 175, 55)",
  },
  excellent: {
    label: "Excellent Match",
    emoji: "💖",
    colorRgb: "rgb(249, 115, 22)",
  },
  good: {
    label: "Good Match",
    emoji: "🌙",
    colorRgb: "rgb(168, 85, 247)",
  },
  fair: {
    label: "Fair Match",
    emoji: "🧭",
    colorRgb: "rgb(59, 130, 246)",
  },
  challenging: {
    label: "Challenging Match",
    emoji: "⚡",
    colorRgb: "rgb(239, 68, 68)",
  },
};

const toWestSign = (value: string) => value.toLowerCase() as WestSign;
const toEastAnimal = (value: string) => value.toLowerCase() as EastAnimal;

export function classifyMatch(westA: string, eastA: string, westB: string, eastB: string, overrides?: Partial<ClassifyInput>) {
  const result = classify({
    westA: toWestSign(westA),
    eastA: toEastAnimal(eastA),
    westB: toWestSign(westB),
    eastB: toEastAnimal(eastB),
    ...overrides,
  });

  const style = TIER_STYLES[result.tier];

  return {
    ...result,
    style,
  };
}

export { TIER_STYLES as CATEGORY_STYLES };
