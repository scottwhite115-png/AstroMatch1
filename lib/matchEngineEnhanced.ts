// lib/matchEngineEnhanced.ts
// Enhanced match engine with base/overlay pattern support for ConnectionBoxUpdated

import {
  ChinesePattern,
  WuXingElement,
  MatchInput,
  MatchResult,
  calculateMatchScore,
  buildMatchResult,
  computeWuXingRelation,
  getWuXingYearElement,
} from './matchEngine';
import type { 
  WesternElement,
  WesternElementRelation,
  WesternAspectRelation,
  WuXingRelation,
  ChineseAnimal 
} from './matchEngine';

/** ===== Enhanced Types for Base/Overlay System ===== */

export type ChineseBasePattern =
  | "SAN_HE"
  | "LIU_HE"
  | "SAME_SIGN"
  | "NO_PATTERN";

export type ChineseOverlayPattern =
  | "LIU_CHONG"
  | "LIU_HAI"
  | "XING"
  | "PO";

export type SanHeTrineName = "Visionaries" | "Strategists" | "Adventurers" | "Artists";

export interface EnhancedMatchInput extends MatchInput {
  // Chinese animals for pattern detection
  chineseAnimalA: ChineseAnimal;
  chineseAnimalB: ChineseAnimal;
}

export interface EnhancedMatchResult extends MatchResult {
  // Base pattern (positive/neutral foundation)
  basePattern: ChineseBasePattern;
  
  // Overlay patterns (challenges/tensions that can co-exist with base)
  overlays: ChineseOverlayPattern[];
  
  // San He trine name (if applicable)
  sanHeTrineName?: SanHeTrineName;
  
  // Whether this is an opposite branches pair (Rat-Horse, etc.)
  isOppositeBranches: boolean;
  
  // Whether same Chinese animal
  sameChineseAnimal: boolean;
  
  // Western element relation for display
  westernElements: {
    a: WesternElement;
    b: WesternElement;
  };
}

/** ===== Pattern Detection Logic ===== */

// San He trines (groups of 3 that share the same trine)
const SAN_HE_GROUPS: Record<string, ChineseAnimal[]> = {
  Visionaries: ["Rat", "Dragon", "Monkey"],
  Strategists: ["Ox", "Snake", "Rooster"],
  Adventurers: ["Tiger", "Horse", "Dog"],
  Artists: ["Rabbit", "Goat", "Pig"],
};

// Liu He pairs (secret friends)
const LIU_HE_PAIRS: [ChineseAnimal, ChineseAnimal][] = [
  ["Rat", "Ox"],
  ["Tiger", "Pig"],
  ["Rabbit", "Dog"],
  ["Dragon", "Rooster"],
  ["Snake", "Monkey"],
  ["Horse", "Goat"],
];

// Liu Chong pairs (six conflicts - opposite branches)
const LIU_CHONG_PAIRS: [ChineseAnimal, ChineseAnimal][] = [
  ["Rat", "Horse"],
  ["Ox", "Goat"],
  ["Tiger", "Monkey"],
  ["Rabbit", "Rooster"],
  ["Dragon", "Dog"],
  ["Snake", "Pig"],
];

// Liu Hai pairs (six harms)
const LIU_HAI_PAIRS: [ChineseAnimal, ChineseAnimal][] = [
  ["Rat", "Goat"],
  ["Ox", "Horse"],
  ["Tiger", "Snake"],
  ["Rabbit", "Dragon"],
  ["Monkey", "Pig"],
  ["Rooster", "Dog"],
];

// Xing groups (punishment patterns - groups of 3)
const XING_GROUPS: ChineseAnimal[][] = [
  ["Rat", "Rabbit"],
  ["Ox", "Goat", "Dog"],
  ["Tiger", "Snake", "Monkey"],
  ["Dragon", "Dragon"], // self-punishment
  ["Horse", "Horse"], // self-punishment
  ["Rooster", "Rooster"], // self-punishment
  ["Pig", "Pig"], // self-punishment
];

// Po pairs (break patterns)
const PO_PAIRS: [ChineseAnimal, ChineseAnimal][] = [
  ["Rat", "Rooster"],
  ["Ox", "Dragon"],
  ["Tiger", "Pig"],
  ["Rabbit", "Horse"],
  ["Snake", "Monkey"],
  ["Goat", "Dog"],
];

/**
 * Check if two animals form a pair in a list of pairs
 */
function isPairInList(
  a: ChineseAnimal,
  b: ChineseAnimal,
  pairList: [ChineseAnimal, ChineseAnimal][]
): boolean {
  return pairList.some(
    ([x, y]) => (a === x && b === y) || (a === y && b === x)
  );
}

/**
 * Check if two animals are in the same San He trine
 */
function getSanHeTrine(
  a: ChineseAnimal,
  b: ChineseAnimal
): SanHeTrineName | null {
  for (const [name, group] of Object.entries(SAN_HE_GROUPS)) {
    if (group.includes(a) && group.includes(b)) {
      return name as SanHeTrineName;
    }
  }
  return null;
}

/**
 * Check if two animals are in the same Xing group
 */
function areInSameXingGroup(a: ChineseAnimal, b: ChineseAnimal): boolean {
  // Self-punishment check
  if (a === b) {
    const selfPunishAnimals: ChineseAnimal[] = ["Dragon", "Horse", "Rooster", "Pig"];
    return selfPunishAnimals.includes(a);
  }
  
  // Group punishment check
  return XING_GROUPS.some(
    (group) => group.includes(a) && group.includes(b)
  );
}

/**
 * Detect the base pattern (primary positive/neutral foundation)
 */
export function detectBasePattern(
  a: ChineseAnimal,
  b: ChineseAnimal
): { basePattern: ChineseBasePattern; sanHeTrineName?: SanHeTrineName } {
  // 1. Same animal
  if (a === b) {
    return { basePattern: "SAME_SIGN" };
  }
  
  // 2. San He (Triple Harmony)
  const sanHeTrine = getSanHeTrine(a, b);
  if (sanHeTrine) {
    return { basePattern: "SAN_HE", sanHeTrineName: sanHeTrine };
  }
  
  // 3. Liu He (Secret Friends)
  if (isPairInList(a, b, LIU_HE_PAIRS)) {
    return { basePattern: "LIU_HE" };
  }
  
  // 4. No pattern
  return { basePattern: "NO_PATTERN" };
}

/**
 * Detect overlay patterns (challenges that can co-exist with base)
 */
export function detectOverlayPatterns(
  a: ChineseAnimal,
  b: ChineseAnimal
): ChineseOverlayPattern[] {
  const overlays: ChineseOverlayPattern[] = [];
  
  // Liu Chong (Six Conflicts)
  if (isPairInList(a, b, LIU_CHONG_PAIRS)) {
    overlays.push("LIU_CHONG");
  }
  
  // Liu Hai (Six Harms)
  if (isPairInList(a, b, LIU_HAI_PAIRS)) {
    overlays.push("LIU_HAI");
  }
  
  // Xing (Punishment)
  if (areInSameXingGroup(a, b)) {
    overlays.push("XING");
  }
  
  // Po (Break)
  if (isPairInList(a, b, PO_PAIRS)) {
    overlays.push("PO");
  }
  
  return overlays;
}

/**
 * Check if animals are opposite branches (Liu Chong)
 */
export function areOppositeBranches(a: ChineseAnimal, b: ChineseAnimal): boolean {
  return isPairInList(a, b, LIU_CHONG_PAIRS);
}

/**
 * Get Western element from animal (for element compatibility)
 */
function getWesternElementFromAnimal(animal: ChineseAnimal): WesternElement {
  // Mapping based on traditional associations
  const fireAnimals: ChineseAnimal[] = ["Snake", "Horse"];
  const earthAnimals: ChineseAnimal[] = ["Ox", "Dragon", "Goat", "Dog"];
  const metalAnimals: ChineseAnimal[] = ["Monkey", "Rooster"];
  const waterAnimals: ChineseAnimal[] = ["Rat", "Pig"];
  const woodAnimals: ChineseAnimal[] = ["Tiger", "Rabbit"];
  
  if (fireAnimals.includes(animal)) return "Fire";
  if (earthAnimals.includes(animal)) return "Earth";
  if (metalAnimals.includes(animal)) return "Air"; // Metal → Air for Western
  if (waterAnimals.includes(animal)) return "Water";
  if (woodAnimals.includes(animal)) return "Earth"; // Wood → Earth for Western
  
  return "Fire"; // fallback
}

/** ===== Enhanced Match Calculation ===== */

/**
 * Calculate enhanced match with base/overlay pattern detection
 */
export function calculateEnhancedMatch(input: EnhancedMatchInput): EnhancedMatchResult {
  const { chineseAnimalA, chineseAnimalB, ...baseInput } = input;
  
  // Get base pattern and trine name
  const { basePattern, sanHeTrineName } = detectBasePattern(chineseAnimalA, chineseAnimalB);
  
  // Get overlay patterns
  const overlays = detectOverlayPatterns(chineseAnimalA, chineseAnimalB);
  
  // Check if opposite branches
  const isOppositeBranches = areOppositeBranches(chineseAnimalA, chineseAnimalB);
  
  // Check if same animal
  const sameChineseAnimal = chineseAnimalA === chineseAnimalB;
  
  // Get Western elements
  const westernElements = {
    a: getWesternElementFromAnimal(chineseAnimalA),
    b: getWesternElementFromAnimal(chineseAnimalB),
  };
  
  // Calculate base match using existing engine
  // Map base pattern to legacy pattern for scoring
  let legacyPattern: ChinesePattern;
  if (overlays.includes("LIU_CHONG")) {
    legacyPattern = "LIU_CHONG";
  } else if (overlays.includes("LIU_HAI")) {
    legacyPattern = "LIU_HAI";
  } else if (overlays.includes("XING")) {
    legacyPattern = "XING";
  } else if (overlays.includes("PO")) {
    legacyPattern = "PO";
  } else {
    // Use base pattern for scoring
    legacyPattern = basePattern === "NO_PATTERN" ? "NO_PATTERN" : basePattern;
  }
  
  const baseMatchResult = buildMatchResult({
    ...baseInput,
    pattern: legacyPattern,
  });
  
  return {
    ...baseMatchResult,
    basePattern,
    overlays,
    sanHeTrineName,
    isOppositeBranches,
    sameChineseAnimal,
    westernElements,
  };
}

/**
 * Helper to convert Chinese animal string to ChineseAnimal type
 */
export function normalizeChineseAnimal(animal: string): ChineseAnimal {
  const normalized = animal.charAt(0).toUpperCase() + animal.slice(1).toLowerCase();
  return normalized as ChineseAnimal;
}

/** ===== Export enhanced types and functions ===== */

export type {
  WesternElement,
  WesternElementRelation,
  WesternAspectRelation,
  WuXingRelation,
  ChineseAnimal,
};









