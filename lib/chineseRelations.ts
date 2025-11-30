// chineseRelations.ts

export type ChineseAnimal =
  | "rat"
  | "ox"
  | "tiger"
  | "rabbit"
  | "dragon"
  | "snake"
  | "horse"
  | "goat"
  | "monkey"
  | "rooster"
  | "dog"
  | "pig";

export type ChineseRelationKey =
  | "clash"        // 六冲
  | "harm"         // 六害
  | "punishment"   // 相刑
  | "break"        // 相破
  | "sixDamages";  // alias of 六害 for your wording

export interface ChineseRelationLabel {
  key: ChineseRelationKey;
  hanzi: string;
  pinyin: string;
  english: string;
  shortDescription: string;
}

export const CHINESE_RELATION_LABELS: Record<ChineseRelationKey, ChineseRelationLabel> = {
  clash: {
    key: "clash",
    hanzi: "六冲",
    pinyin: "liù chōng",
    english: "Clash",
    shortDescription:
      "Clash (六冲 liù chōng) pairs have strong tension and unstable rhythms, often pulling in opposite directions.",
  },
  harm: {
    key: "harm",
    hanzi: "相害",
    pinyin: "xiāng hài",
    english: "Harm",
    shortDescription:
      "Harm (相害 xiāng hài) relationships can feel undermining over time, with emotional or practical wear and tear.",
  },
  punishment: {
    key: "punishment",
    hanzi: "相刑",
    pinyin: "xiāng xíng",
    english: "Punishment",
    shortDescription:
      "Punishment (相刑 xiāng xíng) patterns push growth through friction, but can feel self-sabotaging if unmanaged.",
  },
  break: {
    key: "break",
    hanzi: "相破",
    pinyin: "xiāng pò",
    english: "Break",
    shortDescription:
      "Break (相破 xiāng pò) combinations erode stability gently, leading to gradual cracks or loss of trust.",
  },
  sixDamages: {
    key: "sixDamages",
    hanzi: "六害",
    pinyin: "liù hài",
    english: "Six Damages",
    shortDescription:
      "Six Damages (六害 liù hài) pairs are the classic worst matches, with deep incompatibilities if heavily relied on.",
  },
};

// Utility: normalise a pair so order doesn't matter
function normPair(a: ChineseAnimal, b: ChineseAnimal): [ChineseAnimal, ChineseAnimal] {
  return a < b ? [a, b] : [b, a];
}

// ---- SAME-TRINE / SAN HE (三合) for reference in good tiers ----
export const TRINES: ChineseAnimal[][] = [
  ["rat", "dragon", "monkey"],   // Visionaries
  ["ox", "snake", "rooster"],    // Strategists
  ["tiger", "horse", "dog"],     // Adventurers
  ["rabbit", "goat", "pig"],     // Artists
];

// ---- SIX HARMONIES / LIU HE (六合) SECRET FRIENDS ----
export const SIX_HARMONY_PAIRS: [ChineseAnimal, ChineseAnimal][] = [
  ["rat", "ox"],
  ["tiger", "pig"],
  ["rabbit", "dog"],
  ["dragon", "rooster"],
  ["snake", "monkey"],
  ["horse", "goat"],
].map(([a, b]) => normPair(a, b) as [ChineseAnimal, ChineseAnimal]);

// ---- CLASH / 六冲 ----
export const CLASH_PAIRS: [ChineseAnimal, ChineseAnimal][] = [
  ["rat", "horse"],
  ["ox", "goat"],
  ["tiger", "monkey"],
  ["rabbit", "rooster"],
  ["dragon", "dog"],
  ["snake", "pig"],
].map(([a, b]) => normPair(a, b) as [ChineseAnimal, ChineseAnimal]);

// ---- HARM / 六害  (this is also your "Six Damages") ----
export const HARM_PAIRS: [ChineseAnimal, ChineseAnimal][] = [
  ["rat", "goat"],
  ["ox", "horse"],
  ["tiger", "snake"],
  ["rabbit", "dragon"],
  ["monkey", "pig"],
  ["rooster", "dog"],
].map(([a, b]) => normPair(a, b) as [ChineseAnimal, ChineseAnimal]);

export const SIX_DAMAGES_PAIRS = HARM_PAIRS;

// ---- PUNISHMENT / 相刑 ----
export const PUNISHMENT_PAIRS: [ChineseAnimal, ChineseAnimal][] = [
  ["rat", "rabbit"],
  // snake–tiger–monkey triangle
  ["snake", "tiger"],
  ["snake", "monkey"],
  ["tiger", "monkey"],
  // ox–goat–dog triangle
  ["ox", "goat"],
  ["ox", "dog"],
  ["goat", "dog"],
].map(([a, b]) => normPair(a, b) as [ChineseAnimal, ChineseAnimal]);

// Optional: self-punishment animals (same sign with itself)
export const SELF_PUNISHMENT_SIGNS: ChineseAnimal[] = [
  "dragon",
  "horse",
  "rooster",
  "pig",
];

// ---- BREAK / 相破 ----
export const BREAK_PAIRS: [ChineseAnimal, ChineseAnimal][] = [
  ["rat", "rooster"],
  ["horse", "rabbit"],
  ["monkey", "snake"],
  ["tiger", "pig"],
  ["ox", "dragon"],
  ["dog", "goat"],
].map(([a, b]) => normPair(a, b) as [ChineseAnimal, ChineseAnimal]);

// ---- Helper: which difficult relations apply to a pair? ----
export function getChineseDifficultRelations(
  a: ChineseAnimal,
  b: ChineseAnimal
): ChineseRelationKey[] {
  const pair = normPair(a, b).join("-");

  const has = (list: [ChineseAnimal, ChineseAnimal][]) =>
    list.some(([x, y]) => `${x}-${y}` === pair);

  const relations: ChineseRelationKey[] = [];

  if (has(CLASH_PAIRS)) relations.push("clash");
  if (has(HARM_PAIRS)) relations.push("harm");
  if (has(PUNISHMENT_PAIRS)) relations.push("punishment");
  if (has(BREAK_PAIRS)) relations.push("break");
  if (has(SIX_DAMAGES_PAIRS)) relations.push("sixDamages");

  return relations;
}
