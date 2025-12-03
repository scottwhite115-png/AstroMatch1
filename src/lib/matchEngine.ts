// src/lib/matchEngine.ts

import { adjustForNeutralChineseHighWestern } from './compatibility/scoreAdjustments';
import { mapToChinesePatternId } from './compatibility/helpers';
import type { WesternAspect as WesternAspectCompat } from './compatibility/types';
import {
  ChineseAnimal as ChineseAnimalNew,
  type ChinesePatternTag,
  getPrimaryChinesePatternTag,
  patternTagToPatternId,
} from './matchEngine/chinesePatterns';

// Re-export for convenience
export { type ChinesePatternTag, getPrimaryChinesePatternTag } from './matchEngine/chinesePatterns';

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

// ----------------- DYNAMIC WEIGHTING -----------------

interface WeightConfig {
  chinese: number;
  western: number;
}

/**
 * Get Chinese/Western weight based on pattern strength
 * Strong patterns: 70/30 (Chinese leads)
 * Neutral patterns: 65/35 (Western has more influence)
 */
function getWeightForPattern(pattern: ChinesePattern): WeightConfig {
  const strongPatterns: ChinesePattern[] = [
    'san_he',
    'liu_he',
    'same_animal',
    'liu_chong',
    'liu_hai',
    'xing',
    'po',
  ];

  if (strongPatterns.includes(pattern)) {
    // Strong Chinese pattern → Chinese should clearly lead
    return { chinese: 0.7, western: 0.3 };
  }

  // Neutral / no big pattern → let Western breathe more (65/35)
  // e.g. "none", "cross_trine", or "same_trine"
  return { chinese: 0.65, western: 0.35 };
}

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
  // Same-sign scoring based on element relationships (60-70% base)
  // Most combos land 62-67%, push to 68-70% only if Western is genuinely strong
  const sameSignScoreMap: Record<ElementRelationship, number> = {
    same: 70,        // Peak same-sign with strong Western support
    compatible: 67,  // Good same-sign
    semi: 64,        // Moderate same-sign
    clash: 60,       // Difficult same-sign
  };

  const selfPunishSameSignScoreMap: Record<ElementRelationship, number> = {
    same: 66,        // Self-punishing but strong Western
    compatible: 63,  // Self-punishing, moderate Western
    semi: 60,        // Self-punishing, weak Western
    clash: 56,       // Self-punishing with clash
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

  // Base score starting point
  let score = 50;

  switch (pattern) {
    case "san_he":
      // 三合 (same trine) → 72-88% range (Soulmate/Twin Flame territory)
      score += 53; // Base: ~103 before 70/30 blend → ~72-88% after adjustments
      break;
    case "liu_he":
      // 六合 (secret friend) → 68-84% range
      score += 47; // Base: ~97 before 70/30 blend → ~68-84% after adjustments
      break;
    case "same_trine":
      score += 15;
      break;
    case "same_animal":
      score += 8; // fallback if westElementRelation not provided
      break;
    case "cross_trine":
      // Neutral pairs → 52-68% range (can climb with good Western support)
      score += 0;
      break;
    case "liu_chong":
      // 六冲 (Opposites) → 40-62% base, typical 45-58%, max 60-62%
      score -= 15; // Base: ~35 before 70/30 blend → ~40-62% after adjustments
      break;
    case "liu_hai":
      // 六害 (harm) → 38-60% range
      score -= 20;
      break;
    case "xing":
      // 刑 (punishment) → 38-60% range
      score -= 20;
      break;
    case "po":
      // 破 (break) → 38-60% range
      score -= 17;
      break;
    case "none":
    default:
      // Neutral pairs → 52-68% range
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

  // ⭐ Soulmate – San He with strong Western → 88-98%
  if (score >= 85 && isSuperHarmonious && chinesePattern === "san_he") return "Soulmate";

  // 🔥 Twin Flame – intense, same trine + edgy West or top Liu He → 82-91%
  if (score >= 80 && (isTwinFlamey || (chinesePattern === "liu_he" && score >= 84))) return "Twin Flame";

  // 💚 Harmonious Match – Liu He, San He without perfect West, same-sign peak → 72-84%
  if (score >= 72) return "Harmonious Match";

  // 💙 Dynamic Match – good same-sign, decent patterns → 63-71%
  if (score >= 63) return "Dynamic Match";

  // ❤️‍🔥 Opposites Attract – flagged by aspect/pattern and not in the gutter
  // Liu Chong max is 62%, so threshold at 48-62%
  if ((isChineseOpposite || westAspect === "opposition") && score >= 48) {
    return "Opposites Attract";
  }

  // ⚪ Neutral Match – middle of the road, no strong difficulty pattern → 52-62%
  if (score >= 52 && !isDifficultPattern) return "Neutral Match";

  // 🔴 Difficult Match – low score or clear difficult Chinese pattern → 38-51%
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
      // San He with strong Western → 88-98% range (peak harmony)
      const min = hasWuXingHarmony ? 92 : 88;
      const max = hasWuXingHarmony ? 98 : 94;
      score = clamp(score, min, max);
      break;
    }

    case "Twin Flame": {
      // San He/Liu He top tier or same_trine with opposition → 82-91% range
      const min = hasWuXingHarmony ? 86 : 82;
      const max = hasWuXingHarmony ? 91 : 87;
      score = clamp(score, min, max);
      break;
    }

    case "Harmonious Match": {
      // Liu He and strong San He without perfect alignment → 72-84% range
      const min = hasWuXingHarmony ? 78 : 72;
      const max = hasWuXingHarmony ? 84 : 79;
      score = clamp(score, min, max);
      break;
    }

    case "Neutral Match": {
      // Neutral pairs and cross-trine → 52-68% range
      const min = hasWuXingHarmony ? 64 : 58;
      const max = hasWuXingHarmony ? 68 : 64;
      score = clamp(score, min, max);
      break;
    }

    case "Opposites Attract": {
      if (chinesePattern === "liu_chong") {
        // True Chinese opposites (Rat–Horse, Tiger–Monkey, etc.)
        // Liu Chong → 40-62% base, typical 45-58%, "best case" max 60-62%

        if (westElementRelation === "same" && hasWuXingHarmony) {
          // 🔥 Peak magnetic opposite: same West element + supportive Wu Xing
          // → "best case" max 60-62%
          score = clamp(score, 58, 62);
        } else if (
          (westElementRelation === "same" && !hasWuXingHarmony) ||
          (westElementRelation === "compatible" && hasWuXingHarmony)
        ) {
          // Very strong but not the absolute peak
          score = clamp(score, 54, 60);
        } else if (
          westElementRelation === "compatible" ||
          westElementRelation === "semi_compatible"
        ) {
          // Still attractive, more chaotic
          score = clamp(score, 50, 56);
        } else {
          // Clash/neutral elements: hot but rough
          score = clamp(score, 45, 52);
        }
      } else {
        // Non-Liu-Chong opposites (e.g. pure West opposition cases)
        score = clamp(score, 54, 62);
      }
      break;
    }

    case "Difficult Match":
    default: {
      // Other conflict patterns (Liu Hai, Xing, Po) → 38-60% depending on stack
      const isDifficultPattern = DIFFICULT_PATTERNS.includes(chinesePattern);
      
      if (isDifficultPattern) {
        if (westElementRelation === "same" && hasWuXingHarmony) {
          // Best case for difficult patterns with good Western + Wu Xing support
          score = clamp(score, 54, 60);
        } else if (
          (westElementRelation === "same" || westElementRelation === "compatible") &&
          hasWuXingHarmony
        ) {
          // Good Western support helps a bit
          score = clamp(score, 48, 56);
        } else if (
          westElementRelation === "compatible" ||
          westElementRelation === "semi_compatible"
        ) {
          // Moderate support
          score = clamp(score, 42, 50);
        } else {
          // Worst case: difficult pattern + poor Western + no Wu Xing help
          score = clamp(score, 38, 46);
        }
      } else {
        // Not a difficult pattern, just low score
        score = clamp(score, 38, 100);
      }
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

  // 2) Dynamic weight based on pattern strength
  const weights = getWeightForPattern(chinesePattern);
  let rawScore = weights.chinese * baseChineseScore + weights.western * baseWesternScore;

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

