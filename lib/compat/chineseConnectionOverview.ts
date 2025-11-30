export type ChinesePatternId =
  | "neutral"
  | "san_he"
  | "liu_he"
  | "cross_trine"
  | "opposite_animals"
  | "opposition_punishment"
  | "liu_chong"
  | "liu_hai"
  | "xing"
  | "po";

export const CONNECTION_OVERVIEW_HEADING = "Connection Overview";

const CONNECTION_OVERVIEW_BY_PATTERN: Record<ChinesePatternId, string> = {
  neutral:
    "This pairing sits in a neutral Chinese pattern. Neither strongly pulled together nor pushed apart by karmic forces, so more depends on personality, timing, and free will.",

  san_he:
    "This match sits in a San He 三合 \"Three Harmonies\" pattern, a highly supportive combination that makes it easier to trust each other and build long-term understanding.",

  liu_he:
    "This match falls under Liu He 六合 \"Six Harmonies\", a classic ally pairing with a built-in instinct to support, protect, and gently bring out each other's best.",

  cross_trine:
    "This pairing forms a lively cross-trine pattern in the Chinese zodiac, with sociable, changeable energy that thrives on shared experiences more than automatic stability.",

  opposite_animals:
    "This match links opposite-sign animals in the Chinese zodiac—an \"Opposites Attract\" pattern with strong chemistry that works best when differences are treated as intrigue, not problems to fix.",

  opposition_punishment:
    "This match falls under Liu Chong 六冲 and Xing 刑—an \"Opposition & Punishment\" pattern in the Chinese system, with intense pull that requires real self-awareness to avoid drama and power struggles.",

  liu_chong:
    "This match falls under Liu Chong 六冲, a \"Six Conflicts\" pattern with strong reactions and clashing rhythms that demands patience, clear communication, and firm boundaries.",

  liu_hai:
    "This pairing connects through Liu Hai 六害, a \"Six Harms\" pattern where subtle frictions can accumulate over time, making honesty, empathy, and shared direction especially important.",

  xing:
    "This match touches Xing 刑, a \"Punishment\" pattern that can feel compelling yet tense, and grows best when kindness and accountability replace criticism and blame.",

  po:
    "This pairing carries Po 破, a \"Break\" pattern that shakes up old habits and can act as a catalyst for growth if handled consciously instead of repeating the same ruptures.",
};

export function getChineseConnectionOverview(pattern: ChinesePatternId): {
  heading: string;
  body: string;
} {
  return {
    heading: CONNECTION_OVERVIEW_HEADING,
    body: CONNECTION_OVERVIEW_BY_PATTERN[pattern],
  };
}

// Helper function to map from existing ChinesePattern/ChinesePatternKey to ChinesePatternId
import type { ChinesePattern, ChinesePatternKey } from "./chinesePatterns";

export function mapPatternToId(
  pattern: ChinesePattern | ChinesePatternKey,
  options?: {
    isCrossTrine?: boolean; // true if san_he/liu_he but different trine groups
    isOppositeAnimals?: boolean; // true if liu_chong (6 conflicts)
  }
): ChinesePatternId {
  // Handle uppercase keys (ChinesePatternKey)
  const normalized = typeof pattern === "string" ? pattern.toLowerCase() : pattern;

  // Handle special cases first
  if (normalized === "liu_chong_xing") {
    return "opposition_punishment";
  }

  // Cross-trine: san_he or liu_he pattern but animals are in different trine groups
  if (options?.isCrossTrine && (normalized === "san_he" || normalized === "liu_he")) {
    return "cross_trine";
  }

  // Map standard patterns
  switch (normalized) {
    case "san_he":
    case "same_animal":
    case "same_trine":
      // same_animal and same_trine are always same trine, so they're san_he, not cross_trine
      // But if isCrossTrine is explicitly true, it overrides
      if (options?.isCrossTrine) {
        return "cross_trine";
      }
      return "san_he";
    case "liu_he":
      // liu_he could be cross_trine if isCrossTrine is true
      if (options?.isCrossTrine) {
        return "cross_trine";
      }
      return "liu_he";
    case "liu_chong":
      // liu_chong is the specific "Six Conflicts" pattern
      return "liu_chong";
    case "liu_hai":
      return "liu_hai";
    case "xing":
      return "xing";
    case "po":
      return "po";
    case "neutral":
    default:
      return "neutral";
  }
}

