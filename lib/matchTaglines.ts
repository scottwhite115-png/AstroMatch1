// lib/matchTaglines.ts

import {
  ChinesePattern,
  MatchTier,
  WestAspect,
  WestElementRelation,
} from "@/lib/matchEngine";

export interface PatternTaglineInput {
  tier: MatchTier;
  chinesePattern: ChinesePattern;
  westAspect: WestAspect;
  westElementRelation: WestElementRelation;
  isChineseOpposite: boolean;
}

export function getPatternTagline(
  input: PatternTaglineInput
): string | undefined {
  const {
    tier,
    chinesePattern,
    westAspect,
    westElementRelation,
    isChineseOpposite,
  } = input;

  const isDamagePattern = ["liu_chong", "liu_hai", "xing", "po"].includes(
    chinesePattern
  );
  const isSameTribe =
    chinesePattern === "san_he" || chinesePattern === "same_trine";

  const westNice =
    (westAspect === "trine" || westAspect === "sextile") &&
    (westElementRelation === "same" ||
      westElementRelation === "compatible" ||
      westElementRelation === "semi_compatible");

  // 0) Bland neutral: no tagline, keep box clean
  if (
    tier === "Neutral Match" &&
    !isDamagePattern &&
    !isSameTribe &&
    !isChineseOpposite
  ) {
    return undefined;
  }

  // 1) Top tiers
  if (tier === "Soulmate Match") {
    return "Top tier · One of your strongest overall matches.";
  }

  if (tier === "Twin Flame Match") {
    return "Intense flow · Strong match with extra edge and movement.";
  }

  // 2) Same tribe (San He / same_trine) but not Soulmate/Twin
  if (isSameTribe) {
    if (westNice) {
      return "Deep harmony · Same tribe energy with easy flow.";
    }
    return "Tribe bond · Strong link with different emotional rhythm.";
  }

  // 3) Liu He "secret friends"
  if (chinesePattern === "liu_he") {
    return "Soft support · Quietly loyal, good for real life.";
  }

  // 4) Damage patterns
  if (
    isDamagePattern &&
    (westAspect === "square" ||
      westAspect === "opposition" ||
      westAspect === "quincunx")
  ) {
    return "Handle with care · Intense pattern that needs maturity.";
  }

  if (isDamagePattern) {
    return "";
  }

  // 5) Opposites (Chinese or Western)
  if (
    tier === "Opposites Attract" ||
    isChineseOpposite ||
    westAspect === "opposition"
  ) {
    return "Magnetic pull · Exciting but rarely relaxing.";
  }

  // 6) Harmonious / Neutral catch-alls
  if (tier === "Harmonious Match") {
    return "Easy rhythm · Feels natural to spend time together.";
  }

  if (tier === "Neutral Match") {
    return "Could go either way · A lot depends on timing and effort.";
  }

  // 7) Difficult fallback
  if (tier === "Difficult Match") {
    return "Challenging pattern · Growth-heavy connection.";
  }

  return undefined;
}














