// /data/matchRankings.ts

export type RankKey =
  | "soulmate"
  | "twin_flame"
  | "excellent"
  | "good"
  | "learning"
  | "challenging"
  | "incompatible";

export type TrineRelation =
  | "same"            // same Chinese Trine (e.g., Rat–Dragon–Monkey)
  | "cross"           // different Trines but not oppositional
  | "opposite"        // directly opposing Trines
  | "disharmonious";  // broadly clashing trines

export type ElementRelation =
  | "same"            // same Western element (Air–Air, Fire–Fire, etc.)
  | "compatible"      // classic complementary pairs (Fire–Air, Earth–Water)
  | "semi"            // neutral / semi-compatible
  | "mixed"           // uneven fit; some synergy, some drag
  | "conflicting"     // tense pair (Fire–Water, Air–Earth)
  | "opposite";       // strongly opposing elemental dynamics

export interface RankConfig {
  key: RankKey;
  rank: string;         // e.g., "Soulmate"
  label: string;        // e.g., "Destined Union"
  scoreMin: number;     // inclusive
  scoreMax: number;     // inclusive
  colorName: string;    // UI token
  colorRgb: string;     // e.g., "rgb(251, 191, 36)"
  emoji: string;        // UI icon
  taglineTemplate: string; // will be prefixed by scientific rationale line
  defaultRationale: string; // fallback if we don't get granular inputs
}

// --- Rank table (global, reusable across the app) ---
export const RANKS: RankConfig[] = [
  {
    key: "soulmate",
    rank: "Soulmate",
    label: "Destined Union",
    scoreMin: 95,
    scoreMax: 100,
    colorName: "amberGold",
    colorRgb: "rgb(212, 175, 55)",
    emoji: "⭐",
    taglineTemplate: "Two souls born under the same stars — pure harmony.",
    defaultRationale: "Same trine, same element.",
  },
  {
    key: "twin_flame",
    rank: "Twin Flame",
    label: "Magnetic Synergy",
    scoreMin: 85,
    scoreMax: 94,
    colorName: "orange",
    colorRgb: "rgb(249, 115, 22)",
    emoji: "🔥",
    taglineTemplate: "Intense chemistry — mirror souls learning to dance.",
    defaultRationale: "Same trine, compatible elements.",
  },
  {
    key: "excellent",
    rank: "Excellent",
    label: "Kindred Spirits",
    scoreMin: 70,
    scoreMax: 84,
    colorName: "pink",
    colorRgb: "rgb(236, 72, 153)",
    emoji: "💖",
    taglineTemplate: "Natural flow, laughter, and shared dreams.",
    defaultRationale: "Cross trine, compatible elements.",
  },
  {
    key: "good",
    rank: "Good",
    label: "Cosmic Companions",
    scoreMin: 55,
    scoreMax: 69,
    colorName: "purple",
    colorRgb: "rgb(168, 85, 247)",
    emoji: "🌙",
    taglineTemplate: "Comfortable connection — grows stronger with care.",
    defaultRationale: "Same trine, semi-compatible elements.",
  },
  {
    key: "learning",
    rank: "Learning",
    label: "Karmic Teachers",
    scoreMin: 40,
    scoreMax: 54,
    colorName: "blue",
    colorRgb: "rgb(59, 130, 246)",
    emoji: "🧭",
    taglineTemplate: "Different rhythms, but lessons meant to be learned.",
    defaultRationale: "Cross trine, mixed elements.",
  },
  {
    key: "challenging",
    rank: "Challenging",
    label: "Opposite Orbits",
    scoreMin: 25,
    scoreMax: 39,
    colorName: "red",
    colorRgb: "rgb(239, 68, 68)",
    emoji: "⚡",
    taglineTemplate: "Attraction meets friction — strong sparks, steep lessons.",
    defaultRationale: "Opposite trines, conflicting elements.",
  },
  {
    key: "incompatible",
    rank: "Incompatible",
    label: "Crossed Paths",
    scoreMin: 0,
    scoreMax: 24,
    colorName: "gray",
    colorRgb: "rgb(107, 114, 128)",
    emoji: "💔",
    taglineTemplate: "Different worlds. Beautiful encounter, not a journey.",
    defaultRationale: "Disharmonious trines, opposite elements.",
  },
];

// --- Helpers to select rank from score ---
export function getRankByScore(score: number): RankConfig {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const match = RANKS.find(r => clamped >= r.scoreMin && clamped <= r.scoreMax);
  return match ?? RANKS[RANKS.length - 1]; // default to lowest if not found
}

// --- Science rationale composer (clean, explicit) ---
export function composeRationale(
  trine: TrineRelation | null | undefined,
  element: ElementRelation | null | undefined
): string | null {
  // Prefer explicit pair, then fallbacks
  if (trine && element) {
    return `${labelTrine(trine)}, ${labelElement(element)}.`;
  }
  if (trine) return `${labelTrine(trine)}.`;
  if (element) return `${labelElement(element)}.`;
  return null;
}

function labelTrine(t: TrineRelation): string {
  switch (t) {
    case "same": return "Same trine";
    case "cross": return "Cross trine";
    case "opposite": return "Opposite trines";
    case "disharmonious": return "Disharmonious trines";
  }
}

function labelElement(e: ElementRelation): string {
  switch (e) {
    case "same": return "same element";
    case "compatible": return "compatible elements";
    case "semi": return "semi-compatible elements";
    case "mixed": return "mixed elements";
    case "conflicting": return "conflicting elements";
    case "opposite": return "opposite elements";
  }
}

// --- View Tab: Connection Box builder ---
export interface ConnectionBoxInput {
  score: number;
  westA: string; // e.g., "Aquarius"
  eastA: string; // e.g., "Monkey"
  westB: string; // e.g., "Gemini"
  eastB: string; // e.g., "Rat"
  // science inputs from your engine:
  trineRelation?: TrineRelation | null;
  elementRelation?: ElementRelation | null;
  // optional override of the short descriptor
  description?: string; // e.g., "Natural understanding and shared rhythm; clever, ambitious, magnetic."
}

export interface ConnectionBoxOutput {
  headingEmoji: string;     // 🌙
  headingRank: string;      // "Mixed Match"
  score: number;            // 68
  pairA: string;            // "♒ Aquarius 🐒 Monkey"
  pairB: string;            // "♊ Gemini 🐀 Rat"
  label: string;            // "Cosmic Companions"
  tagline: string;          // "<rationale> <taglineTemplate>"
  colorRgb: string;         // rank color
}

export function buildConnectionBox(input: ConnectionBoxInput): ConnectionBoxOutput {
  const rank = getRankByScore(input.score);

  const emoji = rank.emoji;
  const headingRank = `${rank.rank} Match`;
  const { westA, eastA, westB, eastB } = input;

  // You likely already have glyphs upstream; shown here as placeholders:
  const westGlyphA = glyphForWest(westA);
  const westGlyphB = glyphForWest(westB);
  const eastGlyphA = glyphForEast(eastA);
  const eastGlyphB = glyphForEast(eastB);

  const pairA = `${westGlyphA} ${westA} ${eastGlyphA} ${eastA}`;
  const pairB = `${westGlyphB} ${westB} ${eastGlyphB} ${eastB}`;

  const science = composeRationale(input.trineRelation ?? null, input.elementRelation ?? null)
               ?? rank.defaultRationale;

  // If you want to include an extra short descriptor line, append it after a space.
  const descriptor = input.description ? ` ${input.description}` : "";

  const tagline = `${science} ${rank.taglineTemplate}${descriptor ? " " + descriptor : ""}`;

  return {
    headingEmoji: emoji,
    headingRank,
    score: Math.round(input.score),
    pairA,
    pairB,
    label: rank.label,
    tagline,
    colorRgb: rank.colorRgb,
  };
}

// --- Minimal glyph helpers (replace with your actual icon map) ---
function glyphForWest(sign: string): string {
  const map: Record<string, string> = {
    Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋",
    Leo: "♌", Virgo: "♍", Libra: "♎", Scorpio: "♏",
    Sagittarius: "♐", Capricorn: "♑", Aquarius: "♒", Pisces: "♓",
  };
  return map[sign] ?? "★";
}

function glyphForEast(animal: string): string {
  const map: Record<string, string> = {
    Rat: "🐀", Ox: "🐂", Tiger: "🐅", Rabbit: "🐇",
    Dragon: "🐉", Snake: "🐍", Horse: "🐎", Goat: "🐐",
    Monkey: "🐒", Rooster: "🐓", Dog: "🐕", Pig: "🐖",
  };
  return map[animal] ?? "✨";
}

