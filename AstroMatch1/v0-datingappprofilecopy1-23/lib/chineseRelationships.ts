// /lib/chineseRelationships.ts
// Chinese zodiac relationship data and scoring

export type RelationType = "same_trine" | "opposite" | "opposed_trine" | "neutral";

export interface ChineseRel {
  type: RelationType;
  delta: number; // e.g. +12 (same trine), +6 (opposite), -2 (opposed_trine), etc.
}

export interface EngineData {
  chinese_relationships: Record<string, ChineseRel>;
  ui_tags: Record<RelationType | string, string>;
  blurb_templates: Record<RelationType | string, string>;
}

// Helper function to create normalized key for Chinese sign pairs
export function getKey(a: string, b: string): string {
  const x = a.toLowerCase();
  const y = b.toLowerCase();
  return x < y ? `${x}__${y}` : `${y}__${x}`;
}

// Chinese zodiac relationship data
// Note: Keys are normalized alphabetically (e.g., "monkey__tiger" not "tiger__monkey")
export const chineseRelationships: Record<string, ChineseRel> = {
  // Opposite pairs (magnetic opposites) - +6 delta
  "monkey__tiger": { type: "opposite", delta: 6 },  // Fixed: alphabetically sorted
  "dog__dragon": { type: "opposite", delta: 6 },   // Fixed: alphabetically sorted
  "horse__rat": { type: "opposite", delta: 6 },     // Fixed: alphabetically sorted
  "goat__ox": { type: "opposite", delta: 6 },       // Fixed: alphabetically sorted
  "rabbit__rooster": { type: "opposite", delta: 6 },
  "pig__snake": { type: "opposite", delta: 6 },     // Fixed: alphabetically sorted
  
  // Same trine pairs - +12 delta (Visionaries, Strategists, Adventurers, Artists)
  // Visionaries: Rat, Dragon, Monkey
  "dragon__rat": { type: "same_trine", delta: 12 },    // Fixed: alphabetically sorted
  "monkey__rat": { type: "same_trine", delta: 12 },    // Fixed: alphabetically sorted
  "dragon__monkey": { type: "same_trine", delta: 12 },
  // Strategists: Ox, Snake, Rooster
  "ox__snake": { type: "same_trine", delta: 12 },
  "ox__rooster": { type: "same_trine", delta: 12 },
  "rooster__snake": { type: "same_trine", delta: 12 }, // Fixed: alphabetically sorted
  // Adventurers: Tiger, Horse, Dog
  "horse__tiger": { type: "same_trine", delta: 12 },    // Fixed: alphabetically sorted
  "dog__tiger": { type: "same_trine", delta: 12 },     // Fixed: alphabetically sorted
  "dog__horse": { type: "same_trine", delta: 12 },     // Fixed: alphabetically sorted
  // Artists: Rabbit, Goat, Pig
  "goat__rabbit": { type: "same_trine", delta: 12 },   // Fixed: alphabetically sorted
  "pig__rabbit": { type: "same_trine", delta: 12 },    // Fixed: alphabetically sorted
  "goat__pig": { type: "same_trine", delta: 12 },
  
  // Note: Opposite pairs take precedence over opposed_trine
  // Opposed trine (cross-trine) pairs would be added here if needed
  // For now, all non-same-trine, non-opposite pairs default to neutral
};

// UI tags for relationship types
export const uiTags: Record<RelationType | string, string> = {
  "opposite": "⚡ Magnetic Opposites",
  "same_trine": "Same Trine: Natural Harmony",
  "opposed_trine": "Cross-Trine Contrast",
  "neutral": "Neutral Connection"
};

// Blurb templates for relationship types
export const blurbTemplates: Record<RelationType | string, string> = {
  "opposite": "High-voltage chemistry through contrast. You're wired differently but sparked to grow—momentum builds when you respect each other's pace.",
  "same_trine": "Effortless rhythm and shared instincts. You accelerate each other's wins and recover quickly from bumps.",
  "opposed_trine": "Different lanes, same road. Keep goals explicit and you'll meet in the middle without friction.",
  "neutral": "A balanced connection with room to grow."
};

// Engine data structure
export const engineData: EngineData = {
  chinese_relationships: chineseRelationships,
  ui_tags: uiTags,
  blurb_templates: blurbTemplates
};

// Clamp function for 0-1 range
function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

// Score pair function using the new structure
export function scorePair({
  westA,
  westB,
  eastA,
  eastB,
  baseWestScore,   // 0–100 before adjustments
  baseEastScore,   // 0–100 before adjustments
  data             // EngineData (loaded once)
}: {
  westA: string; westB: string;
  eastA: string; eastB: string;
  baseWestScore: number; baseEastScore: number;
  data: EngineData;
}) {
  const key = getKey(eastA, eastB);
  const rel = data.chinese_relationships[key] ?? { type: "neutral", delta: 0 };
  const eastAdjusted = clamp01((baseEastScore + rel.delta) / 100);

  // 60/40 blend (east/west)
  const westPart = clamp01(baseWestScore / 100) * 0.40;
  const eastPart = eastAdjusted * 0.60;
  const total = Math.round((westPart + eastPart) * 100);

  const tag = data.ui_tags[rel.type] ?? "";
  const blurbSeed = data.blurb_templates[rel.type] ?? "";

  return { total, rel, tag, blurbSeed };
}

// Build connection box using the new structure
export function buildConnectionBox({
  westA, westB, eastA, eastB, westSummary, howTheyConnect, engineOut
}: {
  westA: string; westB: string;
  eastA: string; eastB: string;
  westSummary: string;        // your existing West blurb
  howTheyConnect: string;     // your existing connection paragraph
  engineOut: ReturnType<typeof scorePair>;
}) {
  const { tag, blurbSeed, rel } = engineOut;

  const chineseLine = tag ? `\n• ${tag}: ${blurbSeed}` : "";
  const labelHints = [
    rel.type === "same_trine" && "Same Trine",
    rel.type === "opposite" && "Opposite Signs",
    rel.type === "opposed_trine" && "Cross-Trine"
  ].filter(Boolean).join(" · ");

  return {
    headline: labelHints,               // e.g., "Opposite Signs"
    tag,                                // e.g., "⚡ Magnetic Opposites"
    blurb:
      `${howTheyConnect}\n\n` +
      `Western: ${westSummary}${chineseLine}`
  };
}

// Helper function to get the minimum score threshold for a tier
function thresholdForTier(tier: number): number {
  // Tier mapping: 0=incompatible, 1=challenging, 2=learning, 3=good, 4=excellent, 5=twin_flame, 6=soulmate
  const thresholds: Record<number, number> = {
    0: 0,    // Incompatible: 0-24
    1: 25,   // Challenging: 25-39
    2: 40,   // Learning: 40-54
    3: 55,   // Good: 55-69
    4: 70,   // Excellent: 70-84
    5: 85,   // Twin Flame: 85-94
    6: 95    // Soulmate: 95-100
  };
  return thresholds[tier] ?? 0;
}

// Cap tier jumps to prevent unrealistic score increases
// Prevents jumping more than 1 tier unless Western base score is strong (>= 70)
export function capTierJump(prev: number, next: number, westBase: number): number {
  const tierOf = (n: number): number =>
    n >= 95 ? 6 : n >= 85 ? 5 : n >= 70 ? 4 : n >= 55 ? 3 : n >= 40 ? 2 : n >= 25 ? 1 : 0;

  const a = tierOf(prev);
  const b = tierOf(next);
  
  // If tier jump is 1 or less, allow it
  if (b - a <= 1) return next;
  
  // If Western base is strong (>= 70), allow the jump
  if (westBase >= 70) return next;
  
  // Otherwise, cap to one tier above previous
  return Math.min(next, thresholdForTier(a + 1) + 1);
}

