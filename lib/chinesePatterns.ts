// lib/chinesePatterns.ts

import type { ChineseAnimal } from "./chineseZodiac";

export type ChinesePatternCode =
  | "san_he"        // Three Harmonies (trine)
  | "liu_he"        // Six Harmonies (secret friend)
  | "liu_chong"     // Six Conflicts (opposition)
  | "liu_hai"       // Six Harms
  | "xing"          // Punishment
  | "neutral";      // Everything else

const TRINES: ChineseAnimal[][] = [
  ["Rat", "Dragon", "Monkey"],     // Visionaries
  ["Ox", "Snake", "Rooster"],      // Strategists
  ["Tiger", "Horse", "Dog"],       // Adventurers
  ["Rabbit", "Goat", "Pig"],       // Artists
];

function pairKey(a: ChineseAnimal, b: ChineseAnimal): string {
  return [a, b].sort().join("-");
}

// Build all San He pairs from trines
const SAN_HE_KEYS = new Set<string>();
for (const group of TRINES) {
  const [a, b, c] = group;
  [ [a, b], [a, c], [b, c] ].forEach(([x, y]) => {
    SAN_HE_KEYS.add(pairKey(x, y));
  });
}

// Liu He 六合 — Six Harmonies (secret friend pairs)
const LIU_HE_KEYS = new Set<string>([
  pairKey("Rat", "Ox"),
  pairKey("Tiger", "Pig"),
  pairKey("Rabbit", "Dog"),
  pairKey("Dragon", "Rooster"),
  pairKey("Snake", "Monkey"),
  pairKey("Horse", "Goat"),
]);

// Liu Chong 六冲 — Six Conflicts (opposing pairs)
const LIU_CHONG_KEYS = new Set<string>([
  pairKey("Rat", "Horse"),
  pairKey("Ox", "Goat"),
  pairKey("Tiger", "Monkey"),
  pairKey("Rabbit", "Rooster"),
  pairKey("Dragon", "Dog"),
  pairKey("Snake", "Pig"),
]);

// Liu Hai 六害 — Six Harms
const LIU_HAI_KEYS = new Set<string>([
  pairKey("Rat", "Goat"),
  pairKey("Ox", "Horse"),
  pairKey("Tiger", "Snake"),
  pairKey("Rabbit", "Dragon"),
  pairKey("Monkey", "Pig"),
  pairKey("Rooster", "Dog"),
]);

// Xing 刑 / 相刑 — Punishment pairs (using a common pair-based interpretation)
const XING_KEYS = new Set<string>([
  pairKey("Rat", "Rabbit"),
  pairKey("Ox", "Dog"),
  pairKey("Tiger", "Snake"),
  pairKey("Dragon", "Goat"),
  pairKey("Horse", "Rooster"),
  // Note: Monkey × Pig is Liu Hai, not Xing
]);

export function getChinesePatternCode(
  a: ChineseAnimal,
  b: ChineseAnimal
): ChinesePatternCode {
  if (a === b) return "neutral"; // you can special-case same-sign elsewhere

  const key = pairKey(a, b);

  // Priority order: San He > Liu He > Liu Chong > Liu Hai > Xing > Neutral
  if (SAN_HE_KEYS.has(key)) return "san_he";
  if (LIU_HE_KEYS.has(key)) return "liu_he";
  if (LIU_CHONG_KEYS.has(key)) return "liu_chong";
  if (LIU_HAI_KEYS.has(key)) return "liu_hai";

  // Only treat as Xing if not already classed as the above
  if (XING_KEYS.has(key)) return "xing";

  return "neutral";
}

export function getChinesePatternLabel(
  code: ChinesePatternCode
): string {
  switch (code) {
    case "san_he":
      return 'San He 三合 "Three Harmonies"';
    case "liu_he":
      return 'Liu He 六合 "Six Harmonies"';
    case "liu_chong":
      return 'Liu Chong 六冲 "Opposition"';
    case "liu_hai":
      return 'Liu Hai 六害 "Harm"';
    case "xing":
      return 'Xing 刑 "Punishment"';
    case "neutral":
    default:
      return "Neutral pattern";
  }
}

