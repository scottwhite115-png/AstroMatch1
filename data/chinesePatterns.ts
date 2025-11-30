// data/chinesePatterns.ts

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

type ChinesePairKey = `${ChineseAnimal}-${ChineseAnimal}`;

// A fixed order so we can normalise pairs (so Rat–Monkey == Monkey–Rat)
const CHINESE_ANIMAL_ORDER: ChineseAnimal[] = [
  "Rat",
  "Ox",
  "Tiger",
  "Rabbit",
  "Dragon",
  "Snake",
  "Horse",
  "Goat",
  "Monkey",
  "Rooster",
  "Dog",
  "Pig",
];

function normalizeChinesePairKey(
  a: ChineseAnimal,
  b: ChineseAnimal
): ChinesePairKey {
  if (a === b) return `${a}-${b}` as ChinesePairKey;

  const idxA = CHINESE_ANIMAL_ORDER.indexOf(a);
  const idxB = CHINESE_ANIMAL_ORDER.indexOf(b);

  const [first, second] = idxA <= idxB ? [a, b] : [b, a];
  return `${first}-${second}` as ChinesePairKey;
}

// Pattern labels – EXAMPLES, extend as needed
// 👉 Keyed in *normalised* order, so "Rat-Monkey" also covers "Monkey-Rat".
const CHINESE_PATTERN_LABELS: Partial<Record<ChinesePairKey, string>> = {
  // San He 三合 "Three Harmonies" – Visionaries
  "Rat-Dragon": "San He 三合 'Three Harmonies'",
  "Rat-Monkey": "San He 三合 'Three Harmonies'",
  "Dragon-Monkey": "San He 三合 'Three Harmonies'",

  // Liu Chong 六冲 "Opposition" – e.g. Tiger–Monkey, Rat–Horse, etc.
  "Monkey-Tiger": "Liu Chong 六冲 'Opposition'",

  // …add Liu He 六合, Hai 害, Xing 刑, Po 破 etc. as you go
};

// Main helper: get pattern label or default to Neutral
export function getChinesePatternLabel(
  animalA: ChineseAnimal,
  animalB: ChineseAnimal
): string {
  const key = normalizeChinesePairKey(animalA, animalB);
  return CHINESE_PATTERN_LABELS[key] ?? "Neutral pattern";
}

