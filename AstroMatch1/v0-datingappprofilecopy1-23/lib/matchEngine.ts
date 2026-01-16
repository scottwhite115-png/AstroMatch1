// /lib/matchEngine.ts
// Core scoring + rationale (expanded weights with synergy, same-sign bonuses, and nuanced semi-compatibility)
import { classifyMatch } from "./matchCategory";

export type West =
  | "Aries" | "Taurus" | "Gemini" | "Cancer" | "Leo" | "Virgo"
  | "Libra" | "Scorpio" | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces";

export type East =
  | "Rat" | "Ox" | "Tiger" | "Rabbit" | "Dragon" | "Snake"
  | "Horse" | "Goat" | "Monkey" | "Rooster" | "Dog" | "Pig";

export type RankKey = "perfect" | "excellent" | "good" | "fair" | "challenging";

export interface RankMeta {
  key: RankKey;
  label: string;           // e.g., "Good"
  connectionLabel: string; // e.g., "Cosmic Companions"
  min: number; max: number;
  emoji: string; colorRgb: string;
}

export const RANKS: RankMeta[] = [
  { key: "perfect",     label: "Perfect",     connectionLabel: "Destined Harmony", min: 90, max: 100, emoji: "✨", colorRgb: "rgb(212, 175, 55)" },
  { key: "excellent",   label: "Excellent",   connectionLabel: "Radiant Alignment", min: 75, max: 89, emoji: "💖", colorRgb: "rgb(34, 197, 94)" },
  { key: "good",        label: "Good",        connectionLabel: "Easy Flow",         min: 60, max: 74, emoji: "🌙", colorRgb: "rgb(251, 191, 36)" },
  { key: "fair",        label: "Fair",        connectionLabel: "Growing Edges",     min: 45, max: 59, emoji: "🧭", colorRgb: "rgb(56, 189, 248)" },
  { key: "challenging", label: "Challenging", connectionLabel: "High Contrast",     min: 0,  max: 44, emoji: "⚡", colorRgb: "rgb(239, 68, 68)" },
];

export function getRankMeta(score: number): RankMeta {
  const s = Math.max(0, Math.min(100, Math.round(score)));
  return RANKS.find(r => s >= r.min && s <= r.max)!;
}

// ---------- Chinese Trines ----------
type TrineGroup = "Visionaries" | "Strategists" | "Adventurers" | "Artists";
const TRINE: Record<East, { group: TrineGroup; title: string; summary: string }> = {
  Rat:     { group: "Visionaries",  title: "Rat–Dragon–Monkey",    summary: "Clever, expressive, future-focused." },
  Dragon:  { group: "Visionaries",  title: "Rat–Dragon–Monkey",    summary: "Clever, expressive, future-focused." },
  Monkey:  { group: "Visionaries",  title: "Rat–Dragon–Monkey",    summary: "Clever, expressive, future-focused." },

  Ox:      { group: "Strategists",  title: "Ox–Snake–Rooster",     summary: "Disciplined, loyal, analytical." },
  Snake:   { group: "Strategists",  title: "Ox–Snake–Rooster",     summary: "Disciplined, loyal, analytical." },
  Rooster: { group: "Strategists",  title: "Ox–Snake–Rooster",     summary: "Disciplined, loyal, analytical." },

  Tiger:   { group: "Adventurers",  title: "Tiger–Horse–Dog",      summary: "Bold, free-spirited, action-oriented." },
  Horse:   { group: "Adventurers",  title: "Tiger–Horse–Dog",      summary: "Bold, free-spirited, action-oriented." },
  Dog:     { group: "Adventurers",  title: "Tiger–Horse–Dog",      summary: "Bold, free-spirited, action-oriented." },

  Rabbit:  { group: "Artists",      title: "Rabbit–Goat–Pig",      summary: "Gentle, kind, emotionally aware." },
  Goat:    { group: "Artists",      title: "Rabbit–Goat–Pig",      summary: "Gentle, kind, emotionally aware." },
  Pig:     { group: "Artists",      title: "Rabbit–Goat–Pig",      summary: "Gentle, kind, emotionally aware." },
};

// ---------- Western Elements ----------
export type Elem = "Fire" | "Earth" | "Air" | "Water";
const ELEM: Record<West, Elem> = {
  Aries: "Fire", Leo: "Fire", Sagittarius: "Fire",
  Taurus: "Earth", Virgo: "Earth", Capricorn: "Earth",
  Gemini: "Air", Libra: "Air", Aquarius: "Air",
  Cancer: "Water", Scorpio: "Water", Pisces: "Water",
};

// --- Element relationships ---
// Compatible pairs (bidirectional)
const ELEM_COMPAT: Record<Elem, Elem[]> = {
  Fire: ["Air"], Air: ["Fire"], Earth: ["Water"], Water: ["Earth"],
};

// Semi-compatible (Suzanne White nuance): Air–Water, Fire–Earth (bidirectional)
const ELEM_SEMI: Record<Elem, Elem[]> = {
  Fire: ["Earth"], Earth: ["Fire"], Air: ["Water"], Water: ["Air"],
};

// ---------- Scoring Weights (expanded) ----------
const WEIGHTS = {
  base: 50,
  trine: { same: +20, cross: -5 },
  elem: { same: +20, compat: +10, semi: 0, conflict: -15 },
  synergy: { perfect: +10, strong: +5 },
  sameSign: { west: +6, east: +4 },
  nuance: {
    sameTrine_semi: +8,
    sameTrine_conflict: +4,
    crossTrine_semi: +3,
    crossTrine_conflict: -6,
  },
};

// ---------- Engine Output ----------
export interface EngineResult {
  score: number;
  rankKey: RankKey;
  rankLabel: string;
  connectionLabel: string;
  emoji: string;
  colorRgb: string;

  east_relation: string; // e.g., "Monkey × Rat — Same Trine: Visionaries"
  east_summary: string;  // one-liner
  west_relation: string; // e.g., "Aquarius × Gemini — Same Element: Air × Air"
  west_summary: string;  // one-liner

  // For insight generator context:
  facts: {
    sameTrine: boolean;
    sameWestSign: boolean;
    sameEastSign: boolean;
    trineGroupA: TrineGroup;
    trineGroupB: TrineGroup;
    elemA: Elem;
    elemB: Elem;
    elemRelation: "same" | "compatible" | "semi" | "conflicting";
  };
}

export function explainMatchAndScore(
  aWest: West, 
  aEast: East, 
  bWest: West, 
  bEast: East
): EngineResult {
  const base = WEIGHTS.base;

  // --- Chinese ---
  const aT = TRINE[aEast], bT = TRINE[bEast];
  const sameTrine = aT.group === bT.group;
  const sameEastSign = aEast === bEast;
  
  let east_relation = `${aEast} × ${bEast}`;
  let east_summary = "";
  
  if (sameEastSign) {
    east_relation += " — Same Sign";
    east_summary = "Shared rhythm, instincts, and motivation.";
  } else if (sameTrine) {
    east_relation += ` — Same Trine: ${aT.group}`;
    east_summary = "Shared pace and goals create mutual understanding.";
  } else {
    east_relation += " — Cross-Trine";
    east_summary = "Different life rhythm — curiosity bridges the gap.";
  }

  const trineAdjust = sameTrine ? WEIGHTS.trine.same : WEIGHTS.trine.cross;

  // --- Western ---
  const aEl = ELEM[aWest], bEl = ELEM[bWest];
  const sameWestSign = aWest === bWest;
  
  let west_relation = `${aWest} × ${bWest}`;
  let west_summary = "";
  let elemRelation: "same" | "compatible" | "semi" | "conflicting" = "conflicting";
  let elemAdjust = 0;

  if (aEl === bEl) {
    elemRelation = "same";
    west_relation += ` — Same Element: ${aEl} × ${bEl}`;
    west_summary = "Easy understanding and outlook.";
    elemAdjust = WEIGHTS.elem.same;
  } else if (ELEM_COMPAT[aEl].includes(bEl)) {
    elemRelation = "compatible";
    west_relation += ` — Compatible: ${aEl} × ${bEl}`;
    west_summary = "Complementary strengths and shared flow.";
    elemAdjust = WEIGHTS.elem.compat;
  } else if (ELEM_SEMI[aEl].includes(bEl)) {
    elemRelation = "semi";
    west_relation += ` — Semi-Compatible: ${aEl} × ${bEl}`;
    west_summary = "Different tone, workable with respect.";
    elemAdjust = WEIGHTS.elem.semi;
  } else {
    elemRelation = "conflicting";
    west_relation += ` — Conflicting: ${aEl} × ${bEl}`;
    west_summary = "Different modes — patience is key.";
    elemAdjust = WEIGHTS.elem.conflict;
  }

  // --- Synergy bonuses ---
  let synergy = 0;
  if (sameTrine && elemRelation === "same") synergy += WEIGHTS.synergy.perfect;
  else if (sameTrine && elemRelation === "compatible") synergy += WEIGHTS.synergy.strong;

  // --- Same-sign bonuses ---
  let sameSignBonus = 0;
  if (sameWestSign) sameSignBonus += WEIGHTS.sameSign.west;
  if (sameEastSign) sameSignBonus += WEIGHTS.sameSign.east;

  // --- Suzanne White nuanced element adjustments ---
  let nuanceAdjust = 0;
  if (sameTrine && elemRelation === "semi") nuanceAdjust = WEIGHTS.nuance.sameTrine_semi;
  else if (sameTrine && elemRelation === "conflicting") nuanceAdjust = WEIGHTS.nuance.sameTrine_conflict;
  else if (!sameTrine && elemRelation === "semi") nuanceAdjust = WEIGHTS.nuance.crossTrine_semi;
  else if (!sameTrine && elemRelation === "conflicting") nuanceAdjust = WEIGHTS.nuance.crossTrine_conflict;

  // --- Total Score ---
  const raw = base + trineAdjust + elemAdjust + synergy + sameSignBonus + nuanceAdjust;
  const score = Math.max(0, Math.min(100, Math.round(raw)));
  const rank = getRankMeta(score);
  const classification = classifyMatch(aWest, aEast, bWest, bEast);
  const categoryLabel = classification.style.label;
  const categoryEmoji = classification.style.emoji;
  const categoryColor = classification.style.colorRgb;
 
  return {
    score,
    rankKey: rank.key,
    rankLabel: categoryLabel,
    connectionLabel: categoryLabel,
    emoji: categoryEmoji,
    colorRgb: categoryColor,
    east_relation,
    east_summary,
    west_relation,
    west_summary,
    facts: {
      sameTrine,
      sameWestSign,
      sameEastSign,
      trineGroupA: aT.group,
      trineGroupB: bT.group,
      elemA: aEl,
      elemB: bEl,
      elemRelation,
    },
  };
}

// Utility: consistent key for overrides
export function pairKey(aWest: West, aEast: East, bWest: West, bEast: East) {
  return `${aWest.toLowerCase()}_${aEast.toLowerCase()}__${bWest.toLowerCase()}_${bEast.toLowerCase()}`;
}
