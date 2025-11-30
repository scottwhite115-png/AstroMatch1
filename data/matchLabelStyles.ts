// data/matchLabelStyles.ts

import type { MatchLabel } from "./matchLabels";

// Tailwind text color classes for each label
export const MATCH_LABEL_COLOR_CLASSES: Record<MatchLabel, string> = {
  "Soulmate Match": "text-yellow-300",   // gold
  "Twin Flame Match": "text-orange-400", // AstroMatch orange
  "Excellent Match": "text-pink-500",    // hot pink
  "Favourable Match": "text-sky-400",    // blue
  "Neutral Match": "text-emerald-400",   // green
  "Opposites Attract": "text-purple-400", // purple
  "Difficult Match": "text-slate-300",   // grey
};

