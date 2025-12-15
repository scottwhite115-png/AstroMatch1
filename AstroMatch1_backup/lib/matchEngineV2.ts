// matchEngine.ts
// Updated match engine with cleaner structure and configuration

import { isFeaturedMatch } from '@/data/featuredMatches';
import { applyChineseOverlay, type Tier as OverlayTier, type WestSign as OverlayWestSign, type EastAnimal as OverlayEastAnimal } from './engine/overlays/chineseOverlay';
import { applySameTrineFloors } from './engine/overlays/floorsSameTrine';

// =========================
// Config: Soulmate-worthy
// =========================
export const SETTINGS = {
  weights: { east: 0.65, west: 0.35 },
  east: {
    sameTrineBonus: 13,
    oppositeBonus: 0,  // No bonus - Chinese opposites are challenging, overlay floors to Fair tier
    crossTrinePenalty: -12,   // stronger drag
  },
  west: {
    oppositeBonus: 8,      // ⬅️ updated
    sameSignPenalty: -3,    // set to 0 if you don't want any penalty
    // NEW: context scaling for West-opposite based on East relation
    oppositeContext: {
      whenEastAligned: 1.0,   // same-trine → full +8
      whenEastOpposite: 0.5,  // east-opposite → reduced +4 (both opposites = volatile)
      whenEastNeutral: 0.75,  // neutral → +6
      whenEastCross: 0.375,   // cross-trine → +3   << key line
    },
  },
  tiers: [
    { name: "Soulmate Match", min: 95 },
    { name: "Twin Flame Match", min: 83 },
    { name: "Excellent Match", min: 70 },
    { name: "Mixed Match", min: 55 },
    { name: "Learning Match", min: 40 },
    { name: "Challenging Match", min: 25 },
    { name: "Incompatible Match", min: 0 },
    // Alternative tier names for matches without anchor relationships
    { name: "Destined Harmony", min: 95 },
    { name: "Magnetic Connection", min: 83 },
    { name: "Compatible Match", min: 70 },
  ],
  uiTags: {
    east_same_trine: "Same Trine: Natural Harmony",
    east_opposite: "⚡ Magnetic Opposites",
    east_cross_trine: "Cross-Trine Contrast",
    west_opposite: "⚡ Magnetic Opposites",
    west_same_sign: "Mirror Effect",
  },
  blurbs: {
    east_same_trine:
      "Effortless rhythm and shared instincts. You accelerate each other's wins and bounce back quickly from bumps.",
    east_opposite:
      "High-voltage chemistry via contrast. Different instincts, shared momentum when respect is mutual.",
    east_cross_trine:
      "Different lanes, same road. Keep goals explicit and you'll meet in the middle without friction.",
    west_opposite:
      "Classic polarity magnetism; admiration across differences keeps the spark alive.",
    west_same_sign:
      "Familiar strengths, familiar blind spots—variety and space keep it fresh.",
  },
  taglines: {
    "Soulmate Match": "Destined Union",
    "Destined Harmony": "Rare, effortless resonance.",
    "Twin Flame Match": "Magnetic Synergy.",
    "Magnetic Connection": "Powerful attraction, unfolding over time.",
    "Excellent Match": "Natural flow and complementarity.",
    "Compatible Match": "Balanced affinity and shared rhythm.",
    "Mixed Match": "Promising connection with steady effort.",
    "Fair Match": "Steady connection that deepens over time.",
    "Learning Match": "Growth through difference.",
    "Challenging Match": "Opposite orbits, karmic tension.",
    "Incompatible Match": "Paths diverge easily.",
  },
};

// ============
// Data helpers
// ============
export type Sun =
  | "aries" | "taurus" | "gemini" | "cancer" | "leo" | "virgo"
  | "libra" | "scorpio" | "sagittarius" | "capricorn" | "aquarius" | "pisces";

export type Animal =
  | "rat" | "ox" | "tiger" | "rabbit" | "dragon" | "snake"
  | "horse" | "goat" | "monkey" | "rooster" | "dog" | "pig";

// West opposites
const WEST_OPPOSITES: Record<Sun, Sun> = {
  aries: "libra",
  taurus: "scorpio",
  gemini: "sagittarius",
  cancer: "capricorn",
  leo: "aquarius",
  virgo: "pisces",
  libra: "aries",
  scorpio: "taurus",
  sagittarius: "gemini",
  capricorn: "cancer",
  aquarius: "leo",
  pisces: "virgo",
};

// Element resonance map
const ELEMENTS: Record<Sun, "fire" | "earth" | "air" | "water"> = {
  aries: "fire", leo: "fire", sagittarius: "fire",
  taurus: "earth", virgo: "earth", capricorn: "earth",
  gemini: "air", libra: "air", aquarius: "air",
  cancer: "water", scorpio: "water", pisces: "water",
};

// Chinese trines
const TRINES: Animal[][] = [
  ["rat", "dragon", "monkey"],      // Visionaries
  ["ox", "snake", "rooster"],       // Strategists
  ["tiger", "horse", "dog"],        // Adventurers
  ["rabbit", "goat", "pig"],        // Artists
];

// Chinese opposites
const CHINESE_OPPOSITES: Record<Animal, Animal> = {
  rat: "horse",    horse: "rat",
  ox: "goat",      goat: "ox",
  tiger: "monkey", monkey: "tiger",
  rabbit: "rooster", rooster: "rabbit",
  dragon: "dog",   dog: "dragon",
  snake: "pig",    pig: "snake",
};

// ==============
// Core utilities
// ==============
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

function sameTrine(a: Animal, b: Animal): boolean {
  return TRINES.some(group => group.includes(a) && group.includes(b));
}

function crossTrine(a: Animal, b: Animal): boolean {
  // not same trine and not opposite → treat as cross-trine/neutral-ish
  if (sameTrine(a, b)) return false;
  if (CHINESE_OPPOSITES[a] === b) return false;
  return true;
}

function isOppositeChinese(a: Animal, b: Animal) {
  return CHINESE_OPPOSITES[a] === b;
}

function isOppositeWestern(a: Sun, b: Sun) {
  return WEST_OPPOSITES[a] === b;
}

function isSameSign(a: string, b: string) {
  return a === b;
}

// Helper to determine East (Chinese) relationship flags
function eastRelationFlags(eastA: Animal, eastB: Animal) {
  const same = sameTrine(eastA, eastB);
  const opp = isOppositeChinese(eastA, eastB);
  const cross = crossTrine(eastA, eastB); // true when not same/opp
  return { same, opp, cross };
}

// Elemental flow between Western signs
function elementalFlow(a: Sun, b: Sun): "same" | "compatible" | "incompatible" {
  const ea = ELEMENTS[a], eb = ELEMENTS[b];
  if (ea === eb) return "same";
  if ((ea === "fire" && eb === "air") || (ea === "air" && eb === "fire")) return "compatible";
  if ((ea === "earth" && eb === "water") || (ea === "water" && eb === "earth")) return "compatible";
  return "incompatible";
}

// Pick tier name based on score and anchor relationships
function pickTier(total: number, flags: {
  eastSameTrine: boolean;
  eastOpposite: boolean;
  westOpposite: boolean;
}): string {
  const hasAnchor = flags.eastSameTrine || flags.eastOpposite || flags.westOpposite;

  if (total >= 95) return hasAnchor ? "Soulmate Match" : "Destined Harmony";
  if (total >= 83) return hasAnchor ? "Twin Flame Match" : "Magnetic Connection";
  if (total >= 70) return hasAnchor ? "Excellent Match" : "Compatible Match";
  if (total >= 55) return "Mixed Match";
  if (total >= 40) return "Learning Match";
  if (total >= 25) return "Challenging Match";
  return "Incompatible Match";
}

// Helper to convert from existing format to new format
export function normalizeSun(sun: string): Sun {
  return sun.toLowerCase() as Sun;
}

export function normalizeAnimal(animal: string): Animal {
  return animal.toLowerCase() as Animal;
}

// ===================
// Scoring entry point
// ===================
export interface ScoreInput {
  westA: Sun; westB: Sun;
  eastA: Animal; eastB: Animal;
  baseWest: number; // 0–100 baseline before deltas
  baseEast: number; // 0–100 baseline before deltas
  userSignKey?: string; // Optional: e.g., "aquarius_monkey" for featured match lookup
  partnerSignKey?: string; // Optional: e.g., "gemini_rat" for featured match lookup
}

export interface ScoreOutput {
  total: number;          // 0–100
  eastScore: number;      // 0–100 after deltas
  westScore: number;      // 0–100 after deltas
  tier: string;
  tagline?: string;        // Optional tagline for UI badge
  tags: string[];
  notes: string[];        // debug trail
}

export function computeScore(input: ScoreInput, cfg = SETTINGS): ScoreOutput {
  const notes: string[] = [];
  const tags: string[] = [];

  // ---- East (Chinese) - capture flags once
  let east = input.baseEast;
  const eastFlags = eastRelationFlags(input.eastA, input.eastB);

  if (eastFlags.same) {
    east += cfg.east.sameTrineBonus;
    tags.push(cfg.uiTags.east_same_trine);
    notes.push(`East same-trine +${cfg.east.sameTrineBonus}`);
  } else if (eastFlags.opp) {
    east += cfg.east.oppositeBonus;
    tags.push(cfg.uiTags.east_opposite);
    notes.push(`East opposite +${cfg.east.oppositeBonus}`);
  } else if (eastFlags.cross) {
    east += cfg.east.crossTrinePenalty;
    tags.push(cfg.uiTags.east_cross_trine);
    notes.push(`East cross-trine ${cfg.east.crossTrinePenalty}`);
  }

  // ---- West (Sun) with CONTEXT-AWARE opposite bonus
  let west = input.baseWest;

  const westIsOpp = isOppositeWestern(input.westA, input.westB);
  if (westIsOpp) {
    let scale = cfg.west.oppositeContext.whenEastNeutral;
    if (eastFlags.same) scale = cfg.west.oppositeContext.whenEastAligned;
    else if (eastFlags.opp) scale = cfg.west.oppositeContext.whenEastOpposite;
    else if (eastFlags.cross) scale = cfg.west.oppositeContext.whenEastCross;

    const bonus = Math.round(cfg.west.oppositeBonus * scale);
    west += bonus;
    tags.push(cfg.uiTags.west_opposite);
    notes.push(`West opposite +${bonus} (scaled by east=${eastFlags.same ? "same" : eastFlags.opp ? "opp" : eastFlags.cross ? "cross" : "neutral"})`);
  }

  if (isSameSign(input.westA, input.westB) && cfg.west.sameSignPenalty !== 0) {
    west += cfg.west.sameSignPenalty;
    tags.push(cfg.uiTags.west_same_sign);
    notes.push(`West same-sign ${cfg.west.sameSignPenalty}`);
  }

  // --- Apply subtle penalties for bland or awkward West combos ---
  const flow = elementalFlow(input.westA, input.westB);

  if (flow === "incompatible" && !westIsOpp) {
    // heavier Air–Water, Fire–Earth friction
    west -= 6;
    notes.push("West cross-element –6 friction");
  } else if (flow === "same" || flow === "compatible") {
    // keep as is - no penalty for same element or compatible elements
  } else {
    // neutral drag for no clear resonance (incompatible but opposite, or edge cases)
    west -= 5;
    notes.push("West neutral –5 drag");
  }

  // clamp internal 0–100
  east = Math.max(0, Math.min(100, east));
  west = Math.max(0, Math.min(100, west));

  // ---- Blend
  const totalFloat =
    clamp01(east / 100) * cfg.weights.east +
    clamp01(west / 100) * cfg.weights.west;

  let total = Math.round(totalFloat * 100);

  // ---- SAFETY CAP: if East is cross-trine AND West is opposite, don't allow Excellent+
  if (eastFlags.cross && westIsOpp && total >= 70) {
    notes.push("Quality gate: cross-trine + west-opposite capped to 69");
    total = 69;
  }

  // ---- Require dual-synergy for ≥83 (Twin Flame tier)
  const dualSynergy =
    (eastFlags.same && (flow === "compatible" || westIsOpp)) ||
    (eastFlags.opp && westIsOpp);

  if (!dualSynergy && total >= 83) {
    notes.push("Gate: lacks dual-synergy → cap 82");
    total = 82;
  }

  // ---- Tier (based on total and anchor relationships)
  const tierFlags = {
    eastSameTrine: eastFlags.same,
    eastOpposite: eastFlags.opp,
    westOpposite: westIsOpp,
  };
  let tier = pickTier(total, tierFlags);
  
  // ---- Check featured matches and override tier if applicable
  if (input.userSignKey && input.partnerSignKey) {
    if (isFeaturedMatch(input.userSignKey, input.partnerSignKey, "soulmate")) {
      tier = "Soulmate Match";
      notes.push("Featured match: Soulmate tier override");
    } else if (isFeaturedMatch(input.userSignKey, input.partnerSignKey, "twin_flame")) {
      tier = "Twin Flame Match";
      notes.push("Featured match: Twin Flame tier override");
    }
  }
  
  const overlayTierMap: Record<string, OverlayTier> = {
    "Soulmate Match": "Soulmate",
    "Destined Harmony": "Soulmate",
    "Twin Flame Match": "Twin Flame",
    "Magnetic Connection": "Twin Flame",
    "Excellent Match": "Excellent",
    "Compatible Match": "Excellent",
    "Mixed Match": "Good",
    "Fair Match": "Fair",
    "Learning Match": "Learning",
    "Challenging Match": "Challenging",
    "Incompatible Match": "Challenging",
  };

  const overlayTierToName: Record<OverlayTier, string> = {
    Soulmate: "Soulmate Match",
    "Twin Flame": "Twin Flame Match",
    Excellent: "Excellent Match",
    Good: "Mixed Match",
    Fair: "Fair Match",
    Learning: "Learning Match",
    Challenging: "Challenging Match",
  };

  const overlayWestA = input.westA as OverlayWestSign;
  const overlayWestB = input.westB as OverlayWestSign;
  const overlayEastA = input.eastA as OverlayEastAnimal;
  const overlayEastB = input.eastB as OverlayEastAnimal;

  let overlayInputTier = overlayTierMap[tier] ?? "Good";

  overlayInputTier = applySameTrineFloors(
    overlayWestA,
    overlayWestB,
    overlayEastA,
    overlayEastB,
    overlayInputTier,
  );

  const overlayResult = applyChineseOverlay({
    westA: overlayWestA,
    westB: overlayWestB,
    eastA: overlayEastA,
    eastB: overlayEastB,
    currentTier: overlayInputTier,
  });

  if (overlayResult.badges.length) {
    for (const badge of overlayResult.badges) {
      if (!tags.includes(badge)) {
        tags.push(badge);
      }
    }
  }

  tier = overlayTierToName[overlayResult.tier] ?? tier;

  const tagline = overlayResult.tagline || cfg.taglines[tier] || undefined;

  return {
    total,
    eastScore: east,
    westScore: west,
    tier,
    tagline,
    tags,
    notes,
  };
}

// ==================
// Connection Box API
// ==================
export function buildConnectionBox(params: {
  howTheyConnect: string;   // your pair-specific paragraph (West+East synthesis)
  westSummary: string;      // your short Western blurb
  score: ScoreOutput;
}) {
  const { howTheyConnect, westSummary, score } = params;
  const tagLine = score.tags.filter(Boolean).join(" · ");
  const blurbLines: string[] = [howTheyConnect, "", `Western: ${westSummary}`];

  return {
    headline: tagLine || undefined,
    tagList: score.tags,
    scoreLabel: `${score.total}% — ${score.tier}`,
    blurb: blurbLines.join("\n"),
  };
}

