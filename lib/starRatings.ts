// src/lib/starRatings.ts

import {
  ChinesePattern,
  MatchContext,
  WestAspect,
  WestElementRelation,
} from "@/lib/matchEngine";

export function getWestStarsFromAspect(
  aspect: WestAspect,
  elementRelation: WestElementRelation,
  sameSign: boolean
): number {
  // Same-sign: always 3★ for romance
  if (sameSign) return 3;

  // Core pattern – matches the Compatibility Summary logic we agreed on
  switch (aspect) {
    case "trine":
      return 5; // same element = best
    case "sextile":
      return 4; // supportive aspect
    case "opposition":
      return 4; // strong polarity / marriage axis
    case "square":
    case "quincunx":
      return 2; // tough but not impossible
    case "none":
    default:
      break;
  }

  // Fallback: use element relation if aspect is "none"/unspecified
  switch (elementRelation) {
    case "same":
      return 4;
    case "compatible":
      return 4;
    case "semi_compatible":
      return 3;
    case "clash":
      return 2;
    case "neutral":
    default:
      return 3;
  }
}

export function getChineseStarsFromPattern(
  pattern: ChinesePattern,
  isLivelyPair?: boolean
): number {
  // Map your Chinese patterns to 1–5★
  switch (pattern) {
    case "san_he":
      return 5; // peak harmony
    case "liu_he":
      return 4; // secret friends
    case "same_trine":
      return 4; // same tribe
    case "same_animal":
      return 4; // intense mirror, strong but not always easy
    case "cross_trine":
    case "none":
      return isLivelyPair ? 3 : 2; // neutral / lively pairs
    case "liu_chong":
    case "liu_hai":
    case "xing":
    case "po":
      return 1; // classical clash patterns
    default:
      return 2;
  }
}














