// lib/astrology/matchRankLabels.ts

import type { ChinesePattern } from "../matchEngine";

export type MatchRankLabel =
  | "SOULMATE"
  | "TWIN_FLAME"
  | "EXCELLENT"
  | "FAVOURABLE"
  | "NEUTRAL"
  | "OPPOSITES_ATTRACT"
  | "DIFFICULT";

export function getMatchRankLabelFromPattern(
  pattern: ChinesePattern
): MatchRankLabel {
  switch (pattern) {
    case "SAN_HE":
    case "LIU_HE":
      // Exact label will also depend on West elements, but Chinese side is "good"
      return "FAVOURABLE";

    case "LIU_CHONG":
      // Six Conflicts - Opposites Attract
      return "OPPOSITES_ATTRACT";

    case "LIU_HAI":
    case "XING":
    case "PO":
      // All damage patterns = Difficult tier
      return "DIFFICULT";

    case "SAME_SIGN":
      // Same animal - neutral to favourable depending on elements
      return "NEUTRAL";

    case "NO_PATTERN":
    default:
      return "NEUTRAL";
  }
}

// Display labels for UI
export const RANK_LABEL_DISPLAY: Record<MatchRankLabel, string> = {
  SOULMATE: "Soulmate",
  TWIN_FLAME: "Twin Flame",
  EXCELLENT: "Excellent",
  FAVOURABLE: "Favourable",
  NEUTRAL: "Neutral",
  OPPOSITES_ATTRACT: "Opposites Attract",
  DIFFICULT: "Difficult",
};

// Get display text for a rank label
export function getRankLabelDisplay(label: MatchRankLabel): string {
  return RANK_LABEL_DISPLAY[label];
}

