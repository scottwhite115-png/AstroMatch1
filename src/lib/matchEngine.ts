// src/lib/matchEngine.ts

import { adjustForNeutralChineseHighWestern } from './compatibility/scoreAdjustments';
import { mapToChinesePatternId } from './compatibility/helpers';
import type { WesternAspect as WesternAspectCompat } from './compatibility/types';
import {
  ChineseAnimal as ChineseAnimalNew,
  ChinesePatternTag,
  getPrimaryChinesePatternTag,
  patternTagToPatternId,
} from './matchEngine/chinesePatterns';

// Re-export for convenience
export { ChinesePatternTag, getPrimaryChinesePatternTag } from './matchEngine/chinesePatterns';

// ----------------- TYPES -----------------

export type WesternSign =
  | "Aries"
  | "Taurus"
  | "Gemini"
  | "Cancer"
  | "Leo"
  | "Virgo"
  | "Libra"
  | "Scorpio"
  | "Sagittarius"
  | "Capricorn"
  | "Aquarius"
  | "Pisces";

export type WesternElement = "Fire" | "Earth" | "Air" | "Water";

export type ChineseAnimal =
  | "Rat"
  | "Ox"
  | "Tiger"
  | "Rabbit"
  | "Dragon"
  | "Snake"
  | "Horse"
  | "Goat"
  | "Monkey"
  | "Rooster"
  | "Dog"
  | "Pig";

export type WuXing = "Wood" | "Fire" | "Earth" | "Metal" | "Water";

export type ChinesePattern =
  | "san_he"       // 三合 "Visionaries/Strategists/Adventurers/Artists"
  | "liu_he"       // 六合
  | "liu_chong"    // 六冲 (conflict)
  | "liu_hai"      // 六害 (harm)
  | "xing"         // 刑 (punishment)
  | "po"           // 破 (break)
  | "same_trine"   // same trine but not San He / Liu He
  | "cross_trine"  // different trines, no special harmony
  | "same_animal"  // same zodiac sign
  | "none";        // neutral / no classical pattern

export type WestAspect =
  | "same_sign"
  | "opposition"
  | "trine"
  | "sextile"
  | "square"
  | "quincunx"
  | "none";

export type WestElementRelation =
  | "same"
  | "compatible"
  | "semi_compatible"
  | "clash"
  | "neutral";

export type WuXingRelation = "supportive" | "same" | "clashing" | "neutral";

export type MatchTier =
  | "Soulmate"
  | "Twin Flame"
  | "Harmonious Match"
  | "Dynamic Match"
  | "Neutral Match"
  | "Opposites Attract"
  | "Difficult Match";

export interface MatchContext {
  // WEST
  westA: { sign: WesternSign; element: WesternElement };
  westB: { sign: WesternSign; element: WesternElement };
  westAspect: WestAspect;
  westElementRelation: WestElementRelation;

  // CHINESE
  chineseA: { animal: ChineseAnimal; yearElement: WuXing };
  chineseB: { animal: ChineseAnimal; yearElement: WuXing };
  chinesePattern: ChinesePattern;
  chinesePatternTag?: ChinesePatternTag; // Store original tag for more precise scoring

  // extra flags from your metadata
  isChineseOpposite?: boolean; // opposite signs (Rat–Horse, Ox–Goat, etc.)
  isLivelyPair?: boolean;      // your "lively pair" chart flag if you use it
}

// ----------------- UTIL -----------------

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

// ----------------- WESTERN ASPECT CALCULATION -----------------

const WESTERN_SIGNS_ORDER: WesternSign[] = [
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

const WESTERN_ELEMENTS: Record<WesternSign, WesternElement> = {
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

const OPPOSITE_PAIRS: [WesternSign, WesternSign][] = [
  ["Aries", "Libra"],
  ["Taurus", "Scorpio"],
  ["Gemini", "Sagittarius"],
  ["Cancer", "Capricorn"],
  ["Leo", "Aquarius"],
  ["Virgo", "Pisces"],
];

export function calculateWestAspect(a: WesternSign, b: WesternSign): WestAspect {
  if (a === b) return "same_sign";

  const idxA = WESTERN_SIGNS_ORDER.indexOf(a);
  const idxB = WESTERN_SIGNS_ORDER.indexOf(b);
  const distance = Math.abs(idxA - idxB);
  const minDistance = Math.min(distance, 12 - distance);

  // Check for opposition
  if (OPPOSITE_PAIRS.some(([x, y]) => (x === a && y === b) || (x === b && y === a))) {
    return "opposition";
  }

  // Calculate aspect based on distance
  if (minDistance === 4 || minDistance === 8) return "trine";
  if (minDistance === 2 || minDistance === 10) return "sextile";
  if (minDistance === 3 || minDistance === 9) return "square";
  if (minDistance === 5 || minDistance === 7) return "quincunx";

  return "none";
}

export function calculateWestElementRelation(
  a: WesternElement,
  b: WesternElement
): WestElementRelation {
  if (a === b) return "same";

  // Compatible pairs: Fire-Air, Earth-Water
  const compatiblePairs: [WesternElement, WesternElement][] = [
    ["Fire", "Air"],
    ["Air", "Fire"],
    ["Earth", "Water"],
    ["Water", "Earth"],
  ];

  if (compatiblePairs.some(([x, y]) => (x === a && y === b) || (x === b && y === a))) {
    return "compatible";
  }

  // Semi-compatible: Fire-Earth, Air-Water
  const semiCompatiblePairs: [WesternElement, WesternElement][] = [
    ["Fire", "Earth"],
    ["Earth", "Fire"],
    ["Air", "Water"],
    ["Water", "Air"],
  ];

  if (semiCompatiblePairs.some(([x, y]) => (x === a && y === b) || (x === b && y === a))) {
    return "semi_compatible";
  }

  // Clashing: Fire-Water, Earth-Air
  const clashingPairs: [WesternElement, WesternElement][] = [
    ["Fire", "Water"],
    ["Water", "Fire"],
    ["Earth", "Air"],
    ["Air", "Earth"],
  ];

  if (clashingPairs.some(([x, y]) => (x === a && y === b) || (x === b && y === a))) {
    return "clash";
  }

  return "neutral";
}

// ----------------- WU XING YEAR ELEMENT CALCULATION -----------------

/**
 * Calculate Wu Xing (Five Elements) year element based on the 60-year cycle
 * The cycle alternates between Yang and Yin, and cycles through the 5 elements
 * Reference year: 1984 is Wood (Yang) - Rat
 */
export function getWuXingYearElement(year: number): WuXing {
  // The 60-year cycle: each element appears twice (Yang and Yin) in a 10-year cycle
  // Within each 12-year animal cycle, the element cycles: Wood, Fire, Earth, Metal, Water
  // Starting from 1984 (Wood Rat), we can calculate backwards/forwards

  // Reference: 1984 = Wood (Yang)
  // The element cycle repeats every 10 years: Wood, Wood, Fire, Fire, Earth, Earth, Metal, Metal, Water, Water
  const baseYear = 1984;
  const elementCycle: WuXing[] = ["Wood", "Wood", "Fire", "Fire", "Earth", "Earth", "Metal", "Metal", "Water", "Water"];
  
  // Calculate offset from base year
  const offset = ((year - baseYear) % 10 + 10) % 10;
  return elementCycle[offset];
}

// ----------------- WU XING RELATION -----------------

const wuXingGenerating: Record<WuXing, WuXing> = {
  Wood: "Fire",
  Fire: "Earth",
  Earth: "Metal",
  Metal: "Water",
  Water: "Wood",
};

const wuXingControlling: Record<WuXing, WuXing> = {
  Wood: "Earth",
  Earth: "Water",
  Water: "Fire",
  Fire: "Metal",
  Metal: "Wood",
};

export function computeWuXingRelation(a: WuXing, b: WuXing): WuXingRelation {
  if (a === b) return "same";

  if (wuXingGenerating[a] === b || wuXingGenerating[b] === a) {
    return "supportive";
  }

  if (wuXingControlling[a] === b || wuXingControlling[b] === a) {
    return "clashing";
  }

  return "neutral";
}

const GOOD_PATTERNS: ChinesePattern[] = ["san_he", "liu_he", "same_trine"];
const DIFFICULT_PATTERNS: ChinesePattern[] = [
  "liu_chong",
  "liu_hai",
  "xing",
  "po",
];

function getWuXingScoreBonus(
  pattern: ChinesePattern,
  elemA: WuXing,
  elemB: WuXing
): number {
  const relation = computeWuXingRelation(elemA, elemB);
  const isGood = GOOD_PATTERNS.includes(pattern);
  const isDifficult = DIFFICULT_PATTERNS.includes(pattern);

  switch (relation) {
    case "supportive":
      if (isGood) return +6;      // great pattern + supportive elements
      if (isDifficult) return +2; // tough pattern, elements help a little
      return +4;                  // neutral pattern, nice lift

    case "same":
      if (isGood) return +4;
      if (isDifficult) return +1;
      return +2;

    case "clashing":
      if (isGood) return -6;      // strong pattern, but elements clash
      if (isDifficult) return -2;
      return -4;

    case "neutral":
    default:
      return 0;
  }
}

// ----------------- BASE CHINESE SCORE -----------------

/**
 * Element relationship categories for same-sign scoring
 */
type ElementRelationship = "same" | "compatible" | "semi" | "clash";

/**
 * Convert WestElementRelation to ElementRelationship for same-sign scoring
 */
function toElementRelationship(rel: WestElementRelation): ElementRelationship {
  switch (rel) {
    case "same":
      return "same";
    case "compatible":
      return "compatible";
    case "semi_compatible":
      return "semi";
    case "clash":
      return "clash";
    case "neutral":
      return "semi"; // treat neutral as semi-compatible
    default:
      return "semi";
  }
}

/**
 * Get base Chinese score with element-aware same-sign scoring
 */
function getBaseChineseScore(
  pattern: ChinesePattern,
  patternTag: ChinesePatternTag | undefined,
  westElementRelation?: WestElementRelation,
  isLivelyPair?: boolean
): number {
  // Same-sign scoring based on element relationships
  const sameSignScoreMap: Record<ElementRelationship, number> = {
    same: 68,
    compatible: 65,
    semi: 62,
    clash: 58,
  };

  const selfPunishSameSignScoreMap: Record<ElementRelationship, number> = {
    same: 64,
    compatible: 61,
    semi: 58,
    clash: 54,
  };

  // Handle same_animal pattern with element-based scoring using pattern tag
  if (pattern === "same_animal" && westElementRelation && patternTag) {
    const rel = toElementRelationship(westElementRelation);
    
    if (patternTag === "SAME_SIGN") {
      return sameSignScoreMap[rel];
    } else if (patternTag === "SAME_SIGN_SELF_PUNISH") {
      return selfPunishSameSignScoreMap[rel];
    }
    // Fallback to regular same-sign scoring
    return sameSignScoreMap[rel];
  }

  // Start around 50 and nudge for other patterns
  let score = 50;

  switch (pattern) {
    case "san_he":
      score += 25; // top-tier harmony
      break;
    case "liu_he":
      score += 20;
      break;
    case "same_trine":
      score += 15;
      break;
    case "same_animal":
      score += 8; // fallback if westElementRelation not provided
      break;
    case "cross_trine":
      score += 0;
      break;
    case "liu_chong":
      score -= 20;
      break;
    case "liu_hai":
      score -= 15;
      break;
    case "xing":
      score -= 15;
      break;
    case "po":
      score -= 12;
      break;
    case "none":
    default:
      score += 0;
      break;
  }

  if (isLivelyPair) {
    // Chinese "lively pair" – add spark, not necessarily stability
    score += 3;
  }

  return clamp(score, 0, 100);
}

// ----------------- BASE WESTERN SCORE -----------------

function getBaseWesternScore(
  aspect: WestAspect,
  elementRelation: WestElementRelation
): number {
  let score = 50;

  // Aspect – geometry
  switch (aspect) {
    case "trine":
      score += 10;
      break;
    case "sextile":
      score += 6;
      break;
    case "same_sign":
      score += 6; // strong mirror, high recognition + some friction
      break;
    case "opposition":
      score += 2; // chemistry but polarity
      break;
    case "square":
      score -= 6;
      break;
    case "quincunx":
      score -= 4;
      break;
    case "none":
    default:
      break;
  }

  // Element relationship
  switch (elementRelation) {
    case "same":
      score += 6;
      break;
    case "compatible":
      score += 4;
      break;
    case "semi_compatible":
      score += 2;
      break;
    case "clash":
      score -= 6;
      break;
    case "neutral":
    default:
      break;
  }

  return clamp(score, 0, 100);
}

// ----------------- TIER MAPPING -----------------

interface TierContext {
  chinesePattern: ChinesePattern;
  westAspect: WestAspect;
  isChineseOpposite: boolean;
}

function getMatchTier(score: number, ctx: TierContext): MatchTier {
  const { chinesePattern, westAspect, isChineseOpposite } = ctx;

  const isSuperHarmonious =
    (chinesePattern === "san_he" || chinesePattern === "liu_he") &&
    (westAspect === "trine" || westAspect === "same_sign");

  const isTwinFlamey =
    chinesePattern === "same_trine" &&
    (westAspect === "opposition" || westAspect === "same_sign");

  const isDifficultPattern = DIFFICULT_PATTERNS.includes(chinesePattern);

  // ⭐ Soulmate – very top
  if (score >= 90 && isSuperHarmonious) return "Soulmate";

  // 🔥 Twin Flame – intense, same trine + edgy West
  if (score >= 84 && isTwinFlamey) return "Twin Flame";

  // 💚 Harmonious Match – everything that basically "just works"
  if (score >= 78) return "Harmonious Match";

  // 💙 Dynamic Match – decent score, more friction/growth
  if (score >= 64) return "Dynamic Match";

  // ❤️‍🔥 Opposites Attract – flagged by aspect/pattern and not in the gutter
  if ((isChineseOpposite || westAspect === "opposition") && score >= 56) {
    return "Opposites Attract";
  }

  // ⚪ Neutral Match – middle of the road, no strong difficulty pattern
  if (score >= 52 && !isDifficultPattern) return "Neutral Match";

  // 🔴 Difficult Match – low score or clear difficult Chinese pattern
  return "Difficult Match";
}

// ----------------- SCORE CALIBRATION -----------------

function calibrateScoreForLabel(
  rawScore: number,
  tier: MatchTier,
  wuXingRelation: WuXingRelation,
  westElementRelation: WestElementRelation,
  chinesePattern: ChinesePattern
): number {
  let score = clamp(rawScore, 0, 100);

  const hasWuXingHarmony =
    wuXingRelation === "supportive" || wuXingRelation === "same";

  switch (tier) {
    case "Soulmate": {
      const min = hasWuXingHarmony ? 95 : 91;
      const max = hasWuXingHarmony ? 98 : 95;
      score = clamp(score, min, max);
      break;
    }

    case "Twin Flame": {
      const min = hasWuXingHarmony ? 87 : 83;
      const max = hasWuXingHarmony ? 91 : 87;
      score = clamp(score, min, max);
      break;
    }

    case "Harmonious Match": {
      const min = hasWuXingHarmony ? 79 : 75;
      const max = hasWuXingHarmony ? 83 : 79;
      score = clamp(score, min, max);
      break;
    }

    case "Neutral Match": {
      const min = hasWuXingHarmony ? 69 : 63;
      const max = hasWuXingHarmony ? 75 : 69;
      score = clamp(score, min, max);
      break;
    }

    case "Opposites Attract": {
      if (chinesePattern === "liu_chong") {
        // True Chinese opposites (Rat–Horse, Tiger–Monkey, etc.)

        if (westElementRelation === "same" && hasWuXingHarmony) {
          // 🔥 Peak magnetic opposite: same West element + supportive Wu Xing
          // → never above 70
          score = clamp(score, 66, 70);
        } else if (
          (westElementRelation === "same" && !hasWuXingHarmony) ||
          (westElementRelation === "compatible" && hasWuXingHarmony)
        ) {
          // Very strong but not the absolute peak
          score = clamp(score, 62, 68);
        } else if (
          westElementRelation === "compatible" ||
          westElementRelation === "semi_compatible"
        ) {
          // Still attractive, more chaotic
          score = clamp(score, 58, 64);
        } else {
          // Clash/neutral elements: hot but rough
          score = clamp(score, 52, 60);
        }
      } else {
        // Non-Liu-Chong opposites (e.g. pure West opposition cases)
        score = clamp(score, 58, 66);
      }
      break;
    }

    case "Difficult Match":
    default: {
      score = clamp(score, 0, 100);
      break;
    }
  }

  return Math.round(score);
}

// ----------------- PUBLIC API -----------------

export interface MatchScoreResult {
  score: number; // 0–100
  tier: MatchTier;
}

export function computeMatchScore(ctx: MatchContext): MatchScoreResult {
  const {
    westA,
    westB,
    westAspect,
    westElementRelation,
    chineseA,
    chineseB,
    chinesePattern,
    chinesePatternTag,
    isChineseOpposite,
    isLivelyPair,
  } = ctx;

  // 1) Base scores with element-aware same-sign scoring
  const baseChineseScore = getBaseChineseScore(
    chinesePattern,
    chinesePatternTag,
    westElementRelation,
    isLivelyPair
  );
  const baseWesternScore = getBaseWesternScore(
    westAspect,
    westElementRelation
  );

  // 2) 70/30 blend
  let rawScore = 0.7 * baseChineseScore + 0.3 * baseWesternScore;

  // 3) Wu Xing adjustment (year elements)
  const wuXingDelta = getWuXingScoreBonus(
    chinesePattern,
    chineseA.yearElement,
    chineseB.yearElement
  );
  rawScore += wuXingDelta;

  // 4) Apply neutral Chinese + high Western boost
  // Maps to ChinesePatternId and applies adjustment for neutral Chinese with strong Western aspects
  const chinesePatternId = mapToChinesePatternId(chinesePattern);
  const westernAspectCompat = westAspect as WesternAspectCompat;
  rawScore = adjustForNeutralChineseHighWestern(
    rawScore,
    chinesePatternId!,
    westernAspectCompat
  );

  // 5) Clamp and round raw score
  rawScore = clamp(Math.round(rawScore), 0, 100);

  // 6) Determine tier based on raw score
  const tier = getMatchTier(rawScore, {
    chinesePattern,
    westAspect,
    isChineseOpposite: !!isChineseOpposite,
  });

  // 7) Calculate Wu Xing relation for calibration
  const wuXingRelation = computeWuXingRelation(
    chineseA.yearElement,
    chineseB.yearElement
  );

  // 8) Calibrate final score based on tier and astrological factors
  const score = calibrateScoreForLabel(
    rawScore,
    tier,
    wuXingRelation,
    westElementRelation,
    chinesePattern
  );

  return { score, tier };
}

// ----------------- TYPE CONVERSION HELPERS -----------------

/**
 * Convert lowercase animal name to capitalized (for compatibility with existing system)
 */
function capitalizeAnimal(animal: string): ChineseAnimal {
  return (animal.charAt(0).toUpperCase() + animal.slice(1).toLowerCase()) as ChineseAnimal;
}

/**
 * Convert capitalized animal name to lowercase (for compatibility with existing system)
 */
function lowercaseAnimal(animal: ChineseAnimal): string {
  return animal.toLowerCase();
}

/**
 * Map existing ChinesePattern from lib/compat/engine.ts to new ChinesePattern type
 */
function mapChinesePattern(pattern: string): ChinesePattern {
  const patternMap: Record<string, ChinesePattern> = {
    'san_he': 'san_he',
    'liu_he': 'liu_he',
    'liu_chong': 'liu_chong',
    'liu_hai': 'liu_hai',
    'xing': 'xing',
    'po': 'po',
    'same_trine': 'same_trine',
    'cross_trine': 'cross_trine',
    'same_animal': 'same_animal',
    'neutral': 'none',
    'none': 'none',
  };
  return patternMap[pattern] || 'none';
}

/**
 * Convert ChinesePatternTag from new system to ChinesePattern
 */
function patternTagToPattern(tag: ChinesePatternTag): ChinesePattern {
  switch (tag) {
    case "SAME_SIGN":
    case "SAME_SIGN_SELF_PUNISH":
      return "same_animal";
    case "SAN_HE":
      return "san_he";
    case "LIU_HE":
      return "liu_he";
    case "LIU_CHONG":
      return "liu_chong";
    case "LIU_HAI":
      return "liu_hai";
    case "XING":
      return "xing";
    case "PO":
      return "po";
    case "NONE":
      return "none";
    default:
      return "none";
  }
}

/**
 * Convert Western sign from existing format (lowercase) to new format (capitalized)
 */
function normalizeWesternSign(sign: string): WesternSign {
  const normalized = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();
  return normalized as WesternSign;
}

// ----------------- CONVENIENCE FUNCTIONS -----------------

/**
 * Helper to build MatchContext from raw inputs
 * This integrates with existing systems in the codebase
 */
export function buildMatchContext(
  westA: WesternSign | string,
  westB: WesternSign | string,
  chineseA: ChineseAnimal | string,
  chineseB: ChineseAnimal | string,
  yearA: number,
  yearB: number,
  chinesePattern?: ChinesePattern | string,
  isLivelyPair?: boolean
): MatchContext {
  // Normalize inputs
  const normalizedWestA = typeof westA === 'string' ? normalizeWesternSign(westA) : westA;
  const normalizedWestB = typeof westB === 'string' ? normalizeWesternSign(westB) : westB;
  const normalizedChineseA = typeof chineseA === 'string' ? capitalizeAnimal(chineseA) : chineseA;
  const normalizedChineseB = typeof chineseB === 'string' ? capitalizeAnimal(chineseB) : chineseB;
  
  // If pattern not provided, use the new pattern detection system
  let normalizedPattern: ChinesePattern;
  let patternTag: ChinesePatternTag | undefined;
  
  if (chinesePattern) {
    normalizedPattern = mapChinesePattern(String(chinesePattern));
  } else {
    // Use new pattern detection
    patternTag = getPrimaryChinesePatternTag(normalizedChineseA, normalizedChineseB);
    normalizedPattern = patternTagToPattern(patternTag);
  }

  // Calculate Western aspect and element relation
  const westAspect = calculateWestAspect(normalizedWestA, normalizedWestB);
  const elementA = WESTERN_ELEMENTS[normalizedWestA];
  const elementB = WESTERN_ELEMENTS[normalizedWestB];
  const westElementRelation = calculateWestElementRelation(elementA, elementB);

  // Get Wu Xing year elements
  const yearElementA = getWuXingYearElement(yearA);
  const yearElementB = getWuXingYearElement(yearB);

  // Check if Chinese opposite (liu_chong pattern)
  const isChineseOpposite = normalizedPattern === "liu_chong";

  return {
    westA: { sign: normalizedWestA, element: elementA },
    westB: { sign: normalizedWestB, element: elementB },
    westAspect,
    westElementRelation,
    chineseA: { animal: normalizedChineseA, yearElement: yearElementA },
    chineseB: { animal: normalizedChineseB, yearElement: yearElementB },
    chinesePattern: normalizedPattern,
    chinesePatternTag: patternTag,
    isChineseOpposite,
    isLivelyPair,
  };
}

/**
 * Main entry point that integrates with existing Chinese pattern detection
 * Uses getChinesePattern from lib/compat/engine.ts if pattern is not provided
 */
export async function computeMatchScoreWithIntegration(
  westA: WesternSign | string,
  westB: WesternSign | string,
  chineseA: ChineseAnimal | string,
  chineseB: ChineseAnimal | string,
  yearA: number,
  yearB: number,
  isLivelyPair?: boolean
): Promise<MatchScoreResult> {
  // Normalize animal names for existing system (lowercase)
  const animalA = typeof chineseA === 'string' ? chineseA.toLowerCase() : lowercaseAnimal(chineseA);
  const animalB = typeof chineseB === 'string' ? chineseB.toLowerCase() : lowercaseAnimal(chineseB);

  // Import and use existing Chinese pattern detection
  // Note: This is a dynamic import to avoid circular dependencies
  try {
    const { getChinesePattern } = await import('@/lib/compat/engine');
    const existingPattern = getChinesePattern(animalA as any, animalB as any);
    
    // Map to new pattern type
    const chinesePattern = mapChinesePattern(existingPattern);

    // Build context and compute score
    const ctx = buildMatchContext(
      westA,
      westB,
      chineseA,
      chineseB,
      yearA,
      yearB,
      chinesePattern,
      isLivelyPair
    );

    return computeMatchScore(ctx);
  } catch (error) {
    // Fallback if import fails - use 'none' pattern
    const ctx = buildMatchContext(
      westA,
      westB,
      chineseA,
      chineseB,
      yearA,
      yearB,
      'none',
      isLivelyPair
    );
    return computeMatchScore(ctx);
  }
}

