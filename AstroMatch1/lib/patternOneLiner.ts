// lib/patternOneLiner.ts
// Simple one-liner connection overview based on Chinese pattern

import type { ChinesePattern } from "./matchEngine";

/**
 * Generate a short one-line connection overview based on pattern and score.
 * Replaces the old essay-style overview with crisp pattern-based summaries.
 */
export function deriveConnectionOverview(
  pattern: ChinesePattern,
  score: number
): string {
  switch (pattern) {
    case "SAN_HE":
      return score >= 90
        ? "Very strong harmony; one of your most natural matches."
        : "Strong harmony with natural alignment.";

    case "LIU_HE":
      return "Soft, steady connection with a warm, friend-like tone.";

    case "SAME_SIGN":
      return "Familiar, mirror-style bond; you recognise each other's habits very clearly.";

    case "NO_PATTERN":
      return "";

    case "LIU_CHONG":
      return "";

    case "LIU_HAI":
      return "Emotionally sensitive match; small hurts need gentle handling.";

    case "XING":
      return "Can feel demanding at times; fairness and patience are important here.";

    case "PO":
      return "Changeable connection; it works best when both allow space and flexibility.";

    default:
      return "";
  }
}

/**
 * Backward compatibility alias
 */
export function getPatternOneLiner(pattern: ChinesePattern): string {
  return deriveConnectionOverview(pattern, 75); // Use mid-range score as default
}

