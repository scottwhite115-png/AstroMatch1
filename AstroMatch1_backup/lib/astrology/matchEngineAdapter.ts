// lib/astrology/matchEngineAdapter.ts
// Adapter to bridge the existing match engine with the new simplified core

import {
  ChinesePattern as NewChinesePattern,
  WestHarmony,
  MatchResult,
  computeMatchResult,
} from "./matchEngineCore";
import { ChinesePatternType } from "../chinesePatternSystem";

// ---- Map old pattern names to new simplified ones ----

export function mapOldPatternToNew(
  oldPattern: ChinesePatternType | string
): NewChinesePattern {
  const normalized = oldPattern.toLowerCase();

  switch (normalized) {
    case "san_he":
    case "triple_harmony":
      return "SAN_HE";

    case "liu_he":
    case "secret_friends":
      return "LIU_HE";

    case "same_animal":
    case "same_sign":
    case "same_trine":
      return "SAME_SIGN";

    case "liu_chong":
    case "six_conflicts":
    case "natural_enemies":
      return "LIU_CHONG";

    case "liu_hai":
    case "six_harms":
      return "LIU_HAI";

    case "xing":
    case "punishment":
      return "XING";

    case "po":
    case "break":
      return "PO";

    case "friendly":
    case "neutral":
    case "none":
    case "no_pattern":
    default:
      return "NEUTRAL";
  }
}

// ---- Classify Western harmony from element + aspect ----

export type OldElementRelation = "same" | "compatible" | "semi" | "mismatch";
export type OldAspectRelation = "soft" | "neutral" | "hard" | "opposition";

export function classifyWestHarmony(
  elementRelation: OldElementRelation | string,
  aspectRelation: OldAspectRelation | string
): WestHarmony {
  const elem = elementRelation.toLowerCase();
  const aspect = aspectRelation.toLowerCase();

  // VERY_HARMONIOUS: same element + trine, or compatible element + trine
  if (
    (elem === "same" || elem === "compatible") &&
    (aspect === "soft" || aspect === "trine" || aspect === "sextile")
  ) {
    // If it's a trine (120°) and same/compatible element, this is peak harmony
    if (aspect === "soft" || aspect === "trine") {
      return "VERY_HARMONIOUS";
    }
    // sextile (60°) with compatible element is also very harmonious
    return "HARMONIOUS";
  }

  // HARMONIOUS: sextile aspect, or compatible elements with neutral aspect
  if (aspect === "sextile" || elem === "compatible") {
    return "HARMONIOUS";
  }

  // TENSE: square, quincunx, or mismatched elements
  if (aspect === "hard" || aspect === "square" || aspect === "quincunx") {
    return "TENSE";
  }

  // OPPOSITION: full opposition (180°)
  if (aspect === "opposition") {
    return "OPPOSITION";
  }

  // MIXED: conjunction (same sign), semi-compatible elements, or neutral
  return "MIXED";
}

// ---- Helper to get Western element from sign ----

export type WesternSign =
  | "Aries" | "Taurus" | "Gemini" | "Cancer"
  | "Leo" | "Virgo" | "Libra" | "Scorpio"
  | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces";

export type WesternElement = "fire" | "earth" | "air" | "water";

const WESTERN_ELEMENT_MAP: Record<string, WesternElement> = {
  aries: "fire",
  leo: "fire",
  sagittarius: "fire",
  taurus: "earth",
  virgo: "earth",
  capricorn: "earth",
  gemini: "air",
  libra: "air",
  aquarius: "air",
  cancer: "water",
  scorpio: "water",
  pisces: "water",
};

export function getWesternElement(sign: string): WesternElement {
  return WESTERN_ELEMENT_MAP[sign.toLowerCase()] || "fire";
}

export function getElementRelation(
  elemA: WesternElement,
  elemB: WesternElement
): OldElementRelation {
  if (elemA === elemB) return "same";

  if (
    (elemA === "fire" && elemB === "air") ||
    (elemA === "air" && elemB === "fire") ||
    (elemA === "earth" && elemB === "water") ||
    (elemA === "water" && elemB === "earth")
  ) {
    return "compatible";
  }

  if (
    (elemA === "fire" && elemB === "earth") ||
    (elemA === "earth" && elemB === "fire") ||
    (elemA === "air" && elemB === "water") ||
    (elemA === "water" && elemB === "air")
  ) {
    return "semi";
  }

  return "mismatch";
}

// ---- Helper to get Western aspect from signs ----

const SIGN_ORDER: WesternSign[] = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export function getAspectRelation(
  signA: string,
  signB: string
): OldAspectRelation {
  const indexA = SIGN_ORDER.findIndex(
    (s) => s.toLowerCase() === signA.toLowerCase()
  );
  const indexB = SIGN_ORDER.findIndex(
    (s) => s.toLowerCase() === signB.toLowerCase()
  );

  if (indexA === -1 || indexB === -1) return "neutral";

  let diff = Math.abs(indexA - indexB);
  if (diff > 6) diff = 12 - diff; // wrap around zodiac

  switch (diff) {
    case 0:
      return "neutral"; // same sign (conjunction)
    case 1:
    case 5:
      return "hard"; // semi-sextile (30°) / quincunx (150°)
    case 2:
    case 4:
      return "soft"; // sextile (60°) / trine (120°)
    case 3:
      return "hard"; // square (90°)
    case 6:
      return "opposition"; // opposition (180°)
    default:
      return "neutral";
  }
}

// ---- Main adapter function ----

/**
 * Compute a match result using the new simplified engine
 * by mapping inputs from the old system.
 */
export function computeMatchWithNewEngine(params: {
  chinesePattern: ChinesePatternType | string;
  westernSignA: string;
  westernSignB: string;
  elementRelation?: OldElementRelation | string;
  aspectRelation?: OldAspectRelation | string;
}): MatchResult {
  const {
    chinesePattern,
    westernSignA,
    westernSignB,
    elementRelation,
    aspectRelation,
  } = params;

  // 1. Map Chinese pattern
  const newChinesePattern = mapOldPatternToNew(chinesePattern);

  // 2. Determine Western harmony
  let westHarmony: WestHarmony;

  if (elementRelation && aspectRelation) {
    // If we have both, use them directly
    westHarmony = classifyWestHarmony(elementRelation, aspectRelation);
  } else {
    // Otherwise, derive from signs
    const elemA = getWesternElement(westernSignA);
    const elemB = getWesternElement(westernSignB);
    const elemRel = getElementRelation(elemA, elemB);
    const aspectRel = getAspectRelation(westernSignA, westernSignB);
    westHarmony = classifyWestHarmony(elemRel, aspectRel);
  }

  // 3. Compute the match using the new engine
  return computeMatchResult({
    chinesePattern: newChinesePattern,
    westHarmony,
  });
}

// ---- Export helper to format pill label ----

/**
 * Format a pill label like "92% · Triple Harmony"
 */
export function formatPillLabel(result: MatchResult): string {
  return `${result.score}% · ${result.pattern.labelEn}`;
}

/**
 * Format a full label like "🌟 San He 三合 · Triple Harmony · 92%"
 */
export function formatFullLabel(result: MatchResult): string {
  const { emoji, labelEn, labelZh } = result.pattern;
  const zhPart = labelZh ? ` ${labelZh}` : "";
  return `${emoji} ${labelEn}${zhPart} · ${result.score}%`;
}
