// src/lib/matchEngine/chinesePatterns.ts

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

export type ChinesePatternTag =
  | "SAME_SIGN"
  | "SAME_SIGN_SELF_PUNISH"
  | "SAN_HE"
  | "LIU_HE"
  | "LIU_CHONG"
  | "LIU_HAI"
  | "XING"
  | "PO"
  | "NONE";

// Self-punish (Zi Xing 自刑) animals: only these 4
const SELF_PUNISH_ANIMALS: ChineseAnimal[] = [
  "Dragon",
  "Horse",
  "Rooster",
  "Pig",
];

// --- helper utils ---

function unorderedPairEquals(
  a: ChineseAnimal,
  b: ChineseAnimal,
  x: ChineseAnimal,
  y: ChineseAnimal
): boolean {
  return (
    (a === x && b === y) ||
    (a === y && b === x)
  );
}

// San He trine groups
const SAN_HE_GROUPS: ChineseAnimal[][] = [
  ["Rat", "Dragon", "Monkey"],    // Visionaries
  ["Ox", "Snake", "Rooster"],     // Strategists
  ["Tiger", "Horse", "Dog"],      // Adventurers
  ["Rabbit", "Goat", "Pig"],      // Artists
];

// Liu He secret friend pairs
const LIU_HE_PAIRS: [ChineseAnimal, ChineseAnimal][] = [
  ["Rat", "Ox"],
  ["Tiger", "Pig"],
  ["Rabbit", "Dog"],
  ["Dragon", "Rooster"],
  ["Snake", "Monkey"],
  ["Horse", "Goat"],
];

// Liu Chong clash pairs
const LIU_CHONG_PAIRS: [ChineseAnimal, ChineseAnimal][] = [
  ["Rat", "Horse"],
  ["Ox", "Goat"],
  ["Tiger", "Monkey"],
  ["Rabbit", "Rooster"],
  ["Dragon", "Dog"],
  ["Snake", "Pig"],
];

// Liu Hai (Six Harms) pairs
const LIU_HAI_PAIRS: [ChineseAnimal, ChineseAnimal][] = [
  ["Rat", "Goat"],
  ["Ox", "Horse"],
  ["Tiger", "Snake"],
  ["Rabbit", "Dragon"],
  ["Monkey", "Pig"],
  ["Rooster", "Dog"],
];

// Punishment (Xing 刑) cross-sign pairs
// (Triads expanded into pairs; self-punish handled separately)
const XING_PAIRS: [ChineseAnimal, ChineseAnimal][] = [
  ["Rat", "Rabbit"],      // "impolite punishment"
  ["Tiger", "Snake"],
  ["Tiger", "Monkey"],
  ["Snake", "Monkey"],    // Tiger–Snake–Monkey triad
  ["Goat", "Ox"],
  ["Goat", "Dog"],
  ["Ox", "Dog"],          // Ox–Goat–Dog triad
];

// Break (Po 破) pairs
// NOTE: Goat-Dog is now treated as Neutral (not Po) per latest specs
// NOTE: Snake-Monkey is Liu He (not Po), so it's excluded here
// NOTE: Tiger-Pig is Liu He (not Po), so it's excluded here
const PO_PAIRS: [ChineseAnimal, ChineseAnimal][] = [
  ["Rat", "Rooster"],
  ["Ox", "Dragon"],
  // ["Tiger", "Pig"],   // Tiger-Pig is Liu He, not Po
  ["Rabbit", "Horse"],
  // ["Goat", "Dog"],     // Goat-Dog is now Neutral, not Po
];

function isInPairList(
  a: ChineseAnimal,
  b: ChineseAnimal,
  list: [ChineseAnimal, ChineseAnimal][]
): boolean {
  return list.some(([x, y]) => unorderedPairEquals(a, b, x, y));
}

function isSanHePair(a: ChineseAnimal, b: ChineseAnimal): boolean {
  if (a === b) return false; // 👈 IMPORTANT: never treat same sign as San He
  return SAN_HE_GROUPS.some(group =>
    group.includes(a) && group.includes(b)
  );
}

function isLiuHePair(a: ChineseAnimal, b: ChineseAnimal): boolean {
  if (a === b) return false; // same sign handled separately
  return isInPairList(a, b, LIU_HE_PAIRS);
}

// --- MAIN: get primary pattern tag ---

/**
 * Primary Chinese pattern for a pair.
 *
 * IMPORTANT:
 * - Same sign (including self-punish) is detected FIRST,
 *   so it never shows up as San He / Triple Harmony.
 *
 * Priority order:
 *   1) Same sign (or Same Sign Self-Punish)
 *   2) Liu Chong (Six Conflicts)
 *   3) Liu Hai (Six Harms)
 *   4) San He (Triple Harmony)
 *   5) Liu He (Secret Friends)
 *   6) Xing (Punishment)
 *   7) Po (Break)
 *   8) None
 *
 * Tweak this order if you ever want harmony > conflict, etc.
 */
export function getPrimaryChinesePatternTag(
  a: ChineseAnimal,
  b: ChineseAnimal
): ChinesePatternTag {
  // 1) Same sign / Self-punish first
  if (a === b) {
    if (SELF_PUNISH_ANIMALS.includes(a)) {
      return "SAME_SIGN_SELF_PUNISH";
    }
    return "SAME_SIGN";
  }

  // 2) Strong opposition
  if (isInPairList(a, b, LIU_CHONG_PAIRS)) return "LIU_CHONG";

  // 3) Six Harms
  if (isInPairList(a, b, LIU_HAI_PAIRS)) return "LIU_HAI";

  // 4) Triple Harmony (same trine, different animals only)
  if (isSanHePair(a, b)) return "SAN_HE";

  // 5) Secret Friends
  if (isLiuHePair(a, b)) return "LIU_HE";

  // 6) Punishment (cross-sign)
  if (isInPairList(a, b, XING_PAIRS)) return "XING";

  // 7) Break (Po)
  if (isInPairList(a, b, PO_PAIRS)) return "PO";

  // 8) Neutral / no major pattern
  return "NONE";
}

/**
 * Convert ChinesePatternTag to the legacy ChinesePatternId format
 * used elsewhere in the codebase
 */
export function patternTagToPatternId(tag: ChinesePatternTag): string {
  switch (tag) {
    case "SAME_SIGN":
    case "SAME_SIGN_SELF_PUNISH":
      return "same_sign";
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
      return "neutral";
    default:
      return "neutral";
  }
}

/**
 * Convert legacy pattern ID to ChinesePatternTag
 */
export function patternIdToPatternTag(id: string): ChinesePatternTag {
  switch (id) {
    case "same_sign":
      return "SAME_SIGN";
    case "san_he":
      return "SAN_HE";
    case "liu_he":
      return "LIU_HE";
    case "liu_chong":
      return "LIU_CHONG";
    case "liu_hai":
      return "LIU_HAI";
    case "xing":
      return "XING";
    case "po":
      return "PO";
    case "neutral":
    case "none":
      return "NONE";
    default:
      return "NONE";
  }
}

