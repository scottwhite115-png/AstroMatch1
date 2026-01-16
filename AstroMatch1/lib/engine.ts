// engine.ts — Real-world compatibility scorer (v3)

import { applyBookOverrides } from './applyBookOverrides';
import { applyChineseNuance } from './applyChineseNuance';
import type { Polarity } from './nuanceEngine';
import type { East, West, Element } from './eastWestHelpers';
import { TRINES, SECRET_FRIEND, areAdjacent, sameTrine, secretFriends, isClash, pairKey } from './eastWestHelpers';
import { getWesternBaseScoreSeeded } from './matchExplainAndScore';
import { engineConfig, isChineseOpposite, getChineseOppositeOverride } from './matchEngine.config';

// ---------- TYPE DEFINITIONS ----------

// Legacy type aliases for backwards compatibility
export type WestSign = West;
export type EastAnimal = East;

export type MatchContext = 'romantic_opposite' | 'romantic_same' | 'platonic';

export interface Person {
  west: West;
  east: East;
  gender?: 'male' | 'female' | string; // optional for polarity-aware scoring
}

export interface ScoreOptions {
  weightWest?: number;   // default 0.4
  weightEast?: number;   // default 0.6
  context?: MatchContext; // default 'romantic_opposite'
  clamp?: { min?: number; max?: number }; // default {min: 40, max: 96}
}

export interface ScoreBreakdown {
  western: number;
  eastern: number;
  adjustments: Array<{ name: string; delta: number; reason: string }>;
  weights: { west: number; east: number };
  context: MatchContext;
}

export interface MatchScore {
  score: number;           // 0–100
  breakdown: ScoreBreakdown;
  reasons: string[];       // human readable bullets
}

// ---------- NEW WEIGHTS & SCORING SYSTEM ----------

// Chinese temperament carries a bit more weight than Western element
export const WEIGHTS = {
  east: 0.6,   // Chinese layer (trines/secret-friend/clash/adjacent)
  west: 0.4,   // Western layer (elements + tiny modality)
};

// ---------- Western layer (lightweight, fast, explainable) ----------

const element: Record<West, Element> = {
  Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
  Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
  Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
  Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water'
};

const modality: Record<West, 'Cardinal' | 'Fixed' | 'Mutable'> = {
  Aries: 'Cardinal', Cancer: 'Cardinal', Libra: 'Cardinal', Capricorn: 'Cardinal',
  Taurus: 'Fixed', Leo: 'Fixed', Scorpio: 'Fixed', Aquarius: 'Fixed',
  Gemini: 'Mutable', Virgo: 'Mutable', Sagittarius: 'Mutable', Pisces: 'Mutable'
};

export function pairKey(e1: Element, e2: Element) { 
  return `${e1}-${e2}` as const; 
}

// Export East and West types for use in other modules
export type { East, West, Element } from './eastWestHelpers';

// West base by element pairing (no jargon, very readable)
const elementPairBase: Record<string, number> = {
  'Air-Air': 88, 'Fire-Fire': 86, 'Water-Water': 82, 'Earth-Earth': 82,
  'Air-Fire': 85, 'Fire-Air': 85,
  'Water-Earth': 85, 'Earth-Water': 85,
  'Fire-Earth': 74, 'Earth-Fire': 74,
  'Air-Earth': 72, 'Earth-Air': 72,
  'Air-Water': 70, 'Water-Air': 70,
  'Fire-Water': 68, 'Water-Fire': 68
};

// Tiny modality nudges (keep these small)
function modalityTweak(a: West, b: West): number {
  const A = modality[a], B = modality[b];
  if (A === 'Fixed' && B === 'Fixed') return -3;
  if (A === 'Mutable' && B === 'Mutable') return +2;
  if ((A === 'Cardinal' && B === 'Mutable') || (A === 'Mutable' && B === 'Cardinal')) return +1;
  return 0;
}

const westNudges: Record<string, number> = {
  'Aquarius-Gemini': +2, 'Gemini-Aquarius': +2,
  'Cancer-Aries': -3, 'Aries-Cancer': -3,
  'Virgo-Gemini': -2, 'Gemini-Virgo': -2,
  'Scorpio-Leo': -3, 'Leo-Scorpio': -3,
  'Taurus-Scorpio': -2, 'Scorpio-Taurus': -2,
};

function scoreWestern(a: West, b: West): { score: number; notes: string[] } {
  const ea = element[a], eb = element[b];
  
  // Legacy scoring function
  const legacyScoreFn = (westA: string, westB: string): number => {
    const eA = element[westA as West], eB = element[westB as West];
    const base = elementPairBase[`${eA}-${eB}`] ?? 78;
    const tweak = modalityTweak(westA as West, westB as West);
    const nudge = westNudges[`${westA}-${westB}`] ?? 0;
    return Math.max(55, Math.min(95, base + tweak + nudge));
  };

  // Check if pair is in seeded 30 consensus pairs, otherwise use legacy
  const s = getWesternBaseScoreSeeded(a, b, legacyScoreFn);
  
  // Calculate legacy score for notes
  const base = elementPairBase[`${ea}-${eb}`] ?? 78;
  const tweak = modalityTweak(a, b);
  const nudge = westNudges[`${a}-${b}`] ?? 0;
  const legacyScore = base + tweak + nudge;
  const usedSeeded = s !== Math.max(55, Math.min(95, legacyScore));

  const notes = [
    `Western: ${a} (${ea}, ${modality[a]}) × ${b} (${eb}, ${modality[b]})`,
    usedSeeded ? `Seeded consensus score: ${s}` : `Element synergy base: ${base}`,
    !usedSeeded && tweak ? `Modality tweak: ${tweak > 0 ? '+' : ''}${tweak}` : '',
    !usedSeeded && nudge ? `Pair nudge: ${nudge > 0 ? '+' : ''}${nudge}` : ''
  ].filter(Boolean);

  return { score: s, notes };
}

// ---------- Eastern layer ----------

// East base bands — easy to reason about:
const EAST_BASE = {
  sameTrine: 88,        // kindred spirits, day-to-day ease
  secretFriend: 86,     // quiet affinity
  clash: 64,            // attraction + friction, needs care
  adjacent: 78,         // neighbors on 12-year cycle
  sameAnimal: 82,       // like-with-like: quick bond + blind spots
  neutral: 80,          // workable default
};

// Keeping old names for compatibility
const sameAnimalBase = EAST_BASE.sameAnimal;
const trineBase = EAST_BASE.sameTrine;
const neutralBase = EAST_BASE.neutral;
const adjacentBase = EAST_BASE.adjacent;
const clashBase = EAST_BASE.clash;

function scoreEastern(a: East, b: East): { score: number; notes: string[] } {
  let base: number;
  let relationship: string;
  
  if (a === b) {
    base = EAST_BASE.sameAnimal;
    relationship = 'same animal';
  } else if (sameTrine(a, b)) {
    base = EAST_BASE.sameTrine;
    relationship = 'same trine';
  } else if (secretFriends(a, b)) {
    base = EAST_BASE.secretFriend;
    relationship = 'secret friend';
  } else if (isClash(a, b)) {
    base = EAST_BASE.clash;
    relationship = 'clash';
  } else if (areAdjacent(a, b)) {
    base = EAST_BASE.adjacent;
    relationship = 'adjacent';
  } else {
    base = EAST_BASE.neutral;
    relationship = 'neutral';
  }

  let nudge = 0;
  const pairKey = `${a}-${b}`;

  if (pairKey.includes('Monkey') && pairKey.includes('Rooster')) nudge -= 4;
  if (pairKey.includes('Snake') && pairKey.includes('Pig')) nudge -= 3;
  if (pairKey.includes('Dragon') && pairKey.includes('Dog')) nudge -= 3;
  if (pairKey.includes('Horse') && pairKey.includes('Tiger')) nudge += 2;

  let s = base + nudge;
  s = Math.max(55, Math.min(95, s));

  const notes = [
    `Eastern: ${a} × ${b}`,
    `Temperament base: ${base} (${relationship})`,
    nudge ? `Pair nudge: ${nudge > 0 ? '+' : ''}${nudge}` : ''
  ].filter(Boolean);

  return { score: s, notes };
}

function applyRealismAdjustments(
  westScore: number,
  eastScore: number,
  a: Person,
  b: Person,
  context: MatchContext
) {
  const adjustments: Array<{ name: string; delta: number; reason: string }> = [];
  let delta = 0;

  const isAirAir = element[a.west] === 'Air' && element[b.west] === 'Air';
  if (context.startsWith('romantic') && isAirAir && eastScore <= 78) {
    adjustments.push({
      name: 'Emotional Grounding Check',
      delta: -4,
      reason: 'Strong mental rapport can mask day-to-day emotional/temperament gaps.'
    });
    delta += -4;
  }

  if (context.startsWith('romantic') && isClash(a.east, b.east) && westScore >= 84) {
    adjustments.push({
      name: 'Temperament Clash Dampener',
      delta: -3,
      reason: 'High Western chemistry won’t fully offset a known East clash in long-term romance.'
    });
    delta += -3;
  }

  if (westScore >= 85 && eastScore >= 85) {
    adjustments.push({
      name: 'Mutual High Harmony',
      delta: +2,
      reason: 'Both psychological fit and temperament align — rare, durable synergy.'
    });
    delta += +2;
  }

  return { delta, adjustments };
}

// Score rounding so numbers look intentional, not random.
export function quantizeScore(x: number): number {
  // Map to neat steps users can remember
  // 96, 94, 92, 90, 88, 86, 84, 82, 80, 78, 76, 74, 72, 70, 68, 66, 64
  const STEPS = [96,94,92,90,88,86,84,82,80,78,76,74,72,70,68,66,64];
  const clamp = (v:number,min:number,max:number)=>Math.max(min,Math.min(max,v));
  const v = clamp(Math.round(x), 64, 96); // keep outcomes realistic
  let best = STEPS[0], diff = Infinity;
  for (const s of STEPS) { const d = Math.abs(s - v); if (d < diff) { diff = d; best = s; } }
  return best;
}

// Tier labels that align with the steps
export function tierOf(score: number): "Exceptional"|"Highly Compatible"|"Balanced"|"Challenging" {
  if (score >= 90) return "Exceptional";
  if (score >= 80) return "Highly Compatible";
  if (score >= 70) return "Balanced";
  return "Challenging";
}

export function scoreMatch(
  A: Person,
  B: Person,
  opts: ScoreOptions = {}
): MatchScore {
  const weightWest = opts.weightWest ?? WEIGHTS.west;
  const weightEast = opts.weightEast ?? WEIGHTS.east;
  const context: MatchContext = opts.context ?? 'romantic_opposite';
  const clampMin = opts.clamp?.min ?? 40;
  const clampMax = opts.clamp?.max ?? 96;

  const wA = scoreWestern(A.west, B.west);
  const eA = scoreEastern(A.east, B.east);

  // Fast O(1) lookup from pre-computed matrix
  const nuance = applyChineseNuance(A.east, B.east);

  // Apply book overrides before final weighting
  let layer = { chemistry: 0, longTerm: 0, communication: 0 };
  layer = applyBookOverrides(A, B, layer);

  // Smear nuance and book overrides into scores
  // Nuance: 60% long-term + 40% chemistry into Eastern (temperament layer)
  // Book overrides already applied to layer
  let eastScore = eA.score + 0.6 * nuance.long + 0.4 * nuance.chem + 0.5 * layer.chemistry + 0.5 * layer.longTerm;
  eastScore = Math.max(55, Math.min(95, eastScore));

  // Western gets subtle chemistry feel + book comm adjustments
  let westScore = wA.score + 0.2 * nuance.chem + 0.5 * layer.communication;
  westScore = Math.max(55, Math.min(95, westScore));

  // Apply Chinese opposites rule (if enabled)
  const cfg = engineConfig;
  const cr = cfg.rules.chinese_opposites;
  let westAdjusted = westScore;
  let chineseOppositeBonus = 0;
  
  if (cr?.enabled && isChineseOpposite(A.east, B.east, cr.pairs)) {
    // Optional per-pair override
    const ov = getChineseOppositeOverride(A.east, B.east, cr.overrides ?? []);
    const spark = ov?.spark_bonus_if_west_opposite ?? cr.spark_bonus_if_west_opposite;
    // Get bonus from override or config (for opposite Chinese signs)
    chineseOppositeBonus = ov?.bonus ?? cr.bonus ?? 0;

    // If Western Suns are opposite, add a tiny spark to WEST side
    const westOpp = cfg.rules.opposite_western_signs.enabled &&
                    cfg.rules.opposite_western_signs.pairs.some(([x, y]) =>
                      (A.west === x && B.west === y) || (A.west === y && B.west === x));

    if (westOpp && spark && spark > 0) {
      // nudge the WEST component (chemistry) but keep a cap
      westAdjusted += spark;
      westAdjusted = Math.min(westAdjusted, cr.cap_after_spark ?? westAdjusted);
    }
  }

  // Apply opposite Western signs bonus (if enabled)
  let westernOppositeBonus = 0;
  const woRule = cfg.rules.opposite_western_signs;
  if (woRule?.enabled && woRule.bonus) {
    const isOpposite = woRule.pairs.some(([x, y]) =>
      (A.west === x && B.west === y) || (A.west === y && B.west === x));
    if (isOpposite) {
      westernOppositeBonus = woRule.bonus;
      // Add bonus to Western component
      westAdjusted += westernOppositeBonus;
    }
  }

  // Weighted base with adjusted scores
  let raw = (weightWest * westAdjusted) + (weightEast * eastScore);
  
  // Apply bonus for opposite Chinese signs to OVERALL score
  raw += chineseOppositeBonus;

  // Apply same Western sign rule (if enabled)
  const sameWestRule = cfg.rules.same_western_sign;
  if (sameWestRule?.enabled && A.west === B.west) {
    let delta = sameWestRule.score_delta_default; // baseline -4
    let maxCap = sameWestRule.tier_caps.default_max_score; // 94
    
    // Check if same Chinese trine
    const sameChineseTrine = sameTrine(A.east, B.east);
    if (sameChineseTrine) {
      delta = sameWestRule.score_delta_if_same_chinese_trine; // -6
      maxCap = sameWestRule.tier_caps.if_same_chinese_trine; // 84
    }
    
    // Check if same Chinese animal
    const sameChineseAnimal = A.east === B.east;
    if (sameChineseAnimal) {
      delta = sameWestRule.score_delta_if_same_chinese_animal; // -9
      maxCap = sameWestRule.tier_caps.if_same_chinese_animal; // 100
    }
    
    // But if East is naturally complementary, soften it (optional nuance)
    if (sameWestRule.score_softened_if_strong_east && eastScore >= 80 && !sameChineseAnimal) {
      delta = sameWestRule.score_softened_if_strong_east; // -2
    }
    
    // Apply the penalty to the raw score
    const scoreBeforeSameSignRule = raw;
    raw += delta;
    raw = Math.min(raw, maxCap); // cap based on tier
    
    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Same Sign Rule] ${A.west} === ${B.west}: TRUE`);
      console.log(`[Same Sign Rule] Score before: ${scoreBeforeSameSignRule.toFixed(1)}, delta: ${delta}, after: ${raw.toFixed(1)}, cap: ${maxCap}`);
    }
  }

  // Realism adjustments
  const realism = applyRealismAdjustments(wA.score, eA.score, A, B, context);
  raw += realism.delta;

  // Contextual global multiplier
  let multiplier = 1.0;
  if (context === 'romantic_opposite') multiplier = 0.98;
  if (context === 'romantic_same')     multiplier = 0.995;

  let final = raw * multiplier;
  final = Math.max(clampMin, Math.min(clampMax, final));
  
  // Apply quantization for cleaner, more memorable scores
  final = quantizeScore(final);

  // Build reasons array with nuance insights
  const reasons: string[] = [
    ...wA.notes,
    ...eA.notes,
    ...realism.adjustments.map(a => `${a.name}: ${a.delta > 0 ? '+' : ''}${a.delta} — ${a.reason}`),
    // Add nuance insights (human-readable, plain English)
    nuance.notes[0] || '',
    nuance.notes[1] || '',
    (layer.chemistry !== 0 || layer.longTerm !== 0 || layer.communication !== 0) 
      ? `Book overrides applied: chem${layer.chemistry > 0 ? '+' : ''}${layer.chemistry}, long${layer.longTerm > 0 ? '+' : ''}${layer.longTerm}, comm${layer.communication > 0 ? '+' : ''}${layer.communication}`
      : '',
    `Weights applied: Western ${Math.round(weightWest*100)}% • Eastern ${Math.round(weightEast*100)}%`,
    (multiplier !== 1 ? `Context multiplier (${context}): ×${multiplier.toFixed(3)}` : '')
  ].filter(Boolean);

  const breakdown: ScoreBreakdown = {
    western: Math.round(westScore),
    eastern: Math.round(eastScore),
    adjustments: realism.adjustments,
    weights: { west: weightWest, east: weightEast },
    context
  };

  return { score: Math.round(final), breakdown, reasons };
}


