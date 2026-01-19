// matchGlue.ts

import {
  buildMatchResult,
  ChinesePattern,
  MatchInput,
  WesternElementRelation,
  WesternAspectRelation,
  WuXingRelation,
} from "./matchEngine"; // <- path to the file I gave you

// Adapt these to however you already type them.
export type WesternSign =
  | "Aries" | "Taurus" | "Gemini" | "Cancer"
  | "Leo" | "Virgo" | "Libra" | "Scorpio"
  | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces";

export type ChineseAnimal =
  | "Rat" | "Ox" | "Tiger" | "Rabbit" | "Dragon" | "Snake"
  | "Horse" | "Goat" | "Monkey" | "Rooster" | "Dog" | "Pig";

export type WuXingElement = "Wood" | "Fire" | "Earth" | "Metal" | "Water";

// Minimal astro payload for a profile.
export interface ProfileAstroCore {
  westernSign: WesternSign;
  chineseAnimal: ChineseAnimal;
  wuXingElement: WuXingElement;
}

// ----------------- Chinese pattern mapping -------------------

// Import your existing pattern detection system
import { getChinesePattern, type ChinesePatternType } from "./chinesePatternSystem";

/**
 * Wrapper for your existing pattern detection.
 * Replace this with your real implementation if different.
 */
function getRawChinesePattern(a: ChineseAnimal, b: ChineseAnimal): string {
  // Use your existing getChinesePattern function
  const patternType: ChinesePatternType = getChinesePattern(a, b);
  return patternType; // returns "san_he", "liu_he", "liu_chong", etc.
}

/**
 * Map whatever string your current engine returns -> the new ChinesePattern union type.
 * This handles both your existing lowercase format and the new uppercase format.
 */
function mapRawPatternToChinesePattern(
  raw: string,
  a: ChineseAnimal,
  b: ChineseAnimal
): ChinesePattern {
  // ✅ 1) Same animal ALWAYS wins
  if (a === b) {
    return "SAME_SIGN";
  }

  // ✅ 2) Then map the rest of your patterns
  switch (raw.toUpperCase()) {
    case "SAN_HE":
    case "TRIPLE_HARMONY":
      return "SAN_HE";
    case "LIU_HE":
    case "SIX_HARMONIES":
      return "LIU_HE";
    case "LIU_CHONG":
      return "LIU_CHONG";
    case "LIU_HAI":
      return "LIU_HAI";
    case "XING":
      return "XING";
    case "PO":
      return "PO";
    case "NONE":
    case "NO_PATTERN":
    default:
      return "NO_PATTERN";
  }
}

/**
 * Main function to detect Chinese pattern.
 * Uses your existing pattern detection system and maps to the new format.
 */
export function detectChinesePattern(
  animalA: ChineseAnimal,
  animalB: ChineseAnimal
): ChinesePattern {
  // Get raw pattern from your existing system
  const rawPattern = getRawChinesePattern(animalA, animalB);
  
  // Map to new format
  return mapRawPatternToChinesePattern(rawPattern, animalA, animalB);
}

// ----------------- Western element mapping -------------------

const WESTERN_ELEMENT_BY_SIGN: Record<WesternSign, "Fire" | "Earth" | "Air" | "Water"> = {
  Aries: "Fire",
  Leo: "Fire",
  Sagittarius: "Fire",
  Taurus: "Earth",
  Virgo: "Earth",
  Capricorn: "Earth",
  Gemini: "Air",
  Libra: "Air",
  Aquarius: "Air",
  Cancer: "Water",
  Scorpio: "Water",
  Pisces: "Water",
};

/**
 * Get Western element from sign.
 */
export function getWesternElement(sign: WesternSign): "Fire" | "Earth" | "Air" | "Water" {
  return WESTERN_ELEMENT_BY_SIGN[sign];
}

/**
 * Calculate Western element relation between two signs.
 */
function getWesternElementRelation(
  a: WesternSign,
  b: WesternSign
): WesternElementRelation {
  const ea = WESTERN_ELEMENT_BY_SIGN[a];
  const eb = WESTERN_ELEMENT_BY_SIGN[b];

  if (ea === eb) return "SAME_ELEMENT";

  const compatiblePairs: Array<[string, string]> = [
    ["Fire", "Air"],
    ["Air", "Fire"],
    ["Earth", "Water"],
    ["Water", "Earth"],
  ];

  const semiPairs: Array<[string, string]> = [
    ["Fire", "Earth"],
    ["Earth", "Fire"],
    ["Air", "Water"],
    ["Water", "Air"],
  ];

  if (compatiblePairs.some(([x, y]) => x === ea && y === eb)) {
    return "COMPATIBLE_ELEMENT";
  }

  if (semiPairs.some(([x, y]) => x === ea && y === eb)) {
    return "SEMI_COMPATIBLE";
  }

  return "MISMATCH";
}

// ----------------- Western aspect mapping -------------------

const SIGN_ORDER: WesternSign[] = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

/**
 * Calculate aspect relation between two Western signs.
 * Updated logic:
 * - case 0 (same sign): NEUTRAL (intense, but not auto-soft or auto-hard)
 * - case 1, 5: HARD (semi-sextile / quincunx: mildly awkward)
 * - case 2, 4: SOFT (sextile / trine: soft aspects)
 * - case 3: HARD (square)
 * - case 6: OPPOSITION
 */
function getWesternAspectRelation(
  a: WesternSign,
  b: WesternSign
): WesternAspectRelation {
  const ia = SIGN_ORDER.indexOf(a);
  const ib = SIGN_ORDER.indexOf(b);
  if (ia === -1 || ib === -1) return "NEUTRAL";

  let diff = Math.abs(ia - ib);
  if (diff > 6) diff = 12 - diff; // wrap round zodiac

  switch (diff) {
    case 0:
      return "NEUTRAL"; // same sign – intense, but not auto-soft or auto-hard
    case 1:
    case 5:
      // semi-sextile / quincunx: mildly awkward
      return "HARD";
    case 2:
    case 4:
      // sextile / trine: soft aspects
      return "SOFT";
    case 3:
      // square
      return "HARD";
    case 6:
      return "OPPOSITION";
    default:
      return "NEUTRAL";
  }
}

/**
 * Exported alias for backward compatibility.
 */
export function calculateWesternAspect(
  signA: WesternSign,
  signB: WesternSign
): WesternAspectRelation {
  return getWesternAspectRelation(signA, signB);
}

// ----------------- Wu Xing mapping -------------------

/**
 * Calculate Wu Xing relation between two elements.
 */
function getWuXingRelation(
  a: WuXingElement,
  b: WuXingElement
): WuXingRelation {
  if (a === b) return "SAME";

  const generatingPairs: Array<[WuXingElement, WuXingElement]> = [
    ["Wood", "Fire"],
    ["Fire", "Earth"],
    ["Earth", "Metal"],
    ["Metal", "Water"],
    ["Water", "Wood"],
  ];

  const controllingPairs: Array<[WuXingElement, WuXingElement]> = [
    ["Wood", "Earth"],
    ["Earth", "Water"],
    ["Water", "Fire"],
    ["Fire", "Metal"],
    ["Metal", "Wood"],
  ];

  if (generatingPairs.some(([x, y]) => x === a && y === b)) {
    return "GENERATING";
  }
  if (controllingPairs.some(([x, y]) => x === a && y === b)) {
    return "CONTROLLING";
  }
  return "OTHER";
}

/**
 * Exported alias for backward compatibility.
 */
export function calculateWuXingRelation(
  elemA: WuXingElement,
  elemB: WuXingElement
): WuXingRelation {
  return getWuXingRelation(elemA, elemB);
}

// ----------------- Public: build result from two profiles -------------------

/**
 * Given two profiles, compute their match using the new engine.
 * Returns the full MatchResult with pattern metadata, score, labels, etc.
 * 
 * This is the main public function to use from your UI/components.
 */
export function buildMatchResultForProfiles(
  a: ProfileAstroCore,
  b: ProfileAstroCore
) {
  // 1. Chinese pattern
  let pattern: ChinesePattern;

  if (a.chineseAnimal === b.chineseAnimal) {
    pattern = "SAME_SIGN";
  } else {
    const rawPattern = getRawChinesePattern(a.chineseAnimal, b.chineseAnimal);
    pattern = mapRawPatternToChinesePattern(rawPattern, a.chineseAnimal, b.chineseAnimal);
  }

  // 2. Western relationships
  const westernElementRelation = getWesternElementRelation(
    a.westernSign,
    b.westernSign
  );

  const westernAspectRelation = getWesternAspectRelation(
    a.westernSign,
    b.westernSign
  );

  const sameWesternSign = a.westernSign === b.westernSign;

  // 3. Wu Xing
  const wuXingRelation = getWuXingRelation(
    a.wuXingElement,
    b.wuXingElement
  );

  const matchInput: MatchInput = {
    pattern,
    westernElementRelation,
    westernAspectRelation,
    wuXingRelation,
    sameWesternSign, // <--- new
  };

  // 4. Hand off to the core engine
  return buildMatchResult(matchInput);
}

/**
 * Alias for backward compatibility.
 * @deprecated Use buildMatchResultForProfiles instead.
 */
export function computeProfileMatch(
  profileA: ProfileAstroCore,
  profileB: ProfileAstroCore
) {
  return buildMatchResultForProfiles(profileA, profileB);
}

// ----------------- Helper Exports -----------------

// Re-export types for convenience
export type { ChinesePattern, MatchInput, WesternElementRelation, WesternAspectRelation, WuXingRelation };
export { buildMatchResult };


