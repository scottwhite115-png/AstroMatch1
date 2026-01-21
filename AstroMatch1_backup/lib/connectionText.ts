// connectionText.ts

import { getChineseConnectionBlurb, ChineseAnimal } from "@/lib/astrology/chineseConnectionBlurbs";
import { getWesternConnectionBlurb, WesternSign } from "@/lib/astrology/westernConnectionBlurbs";
import { normalizeWesternSign, getWesternModality, type WestModality } from "@/lib/astrology/westMeta";

// ---- BASIC TYPES ----

export type Element = 'Fire' | 'Earth' | 'Air' | 'Water';
export type WuXing = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';

export type ChinesePattern =
  | 'san_he'
  | 'liu_he'
  | 'liu_chong'
  | 'liu_hai'
  | 'xing'
  | 'po'
  | 'same_trine'
  | 'cross_trine'
  | 'same_animal'
  | 'none';

export type WestAspect =
  | 'same_sign'
  | 'opposition'
  | 'trine'
  | 'sextile'
  | 'square'
  | 'quincunx'
  | 'none';

export type WuXingRelation = 'supportive' | 'same' | 'clashing' | 'neutral';

export interface ConnectionContext {
  westA: { sign: string; element: Element; modality?: WestModality };
  westB: { sign: string; element: Element; modality?: WestModality };
  chineseA: {
    animal: string;
    trineName?: string;    // e.g. "Visionaries", "Strategists", "Adventurers", "Artists"
    yearElement?: WuXing;
  };
  chineseB: {
    animal: string;
    trineName?: string;
    yearElement?: WuXing;
  };
  chinesePattern: ChinesePattern;
  westAspect: WestAspect;
}

// ---- WU XING RELATION LOGIC ----

const wuXingGenerating: Record<WuXing, WuXing> = {
  Wood: 'Fire',
  Fire: 'Earth',
  Earth: 'Metal',
  Metal: 'Water',
  Water: 'Wood',
};

const wuXingControlling: Record<WuXing, WuXing> = {
  Wood: 'Earth',
  Earth: 'Water',
  Water: 'Fire',
  Fire: 'Metal',
  Metal: 'Wood',
};

/**
 * Compute the Wu Xing relation between two year elements.
 * You can skip this and store relation directly if you prefer.
 */
export function computeWuXingRelation(a: WuXing, b: WuXing): WuXingRelation {
  if (a === b) return 'same';

  // Generating cycle: supportive
  if (wuXingGenerating[a] === b || wuXingGenerating[b] === a) {
    return 'supportive';
  }

  // Controlling cycle: clashing
  if (wuXingControlling[a] === b || wuXingControlling[b] === a) {
    return 'clashing';
  }

  // Everything else: neutral overlay
  return 'neutral';
}

// ---- WU XING SCORE ADJUSTMENT ----

const GOOD_PATTERNS: ChinesePattern[] = ['san_he', 'liu_he', 'same_trine'];
const DIFFICULT_PATTERNS: ChinesePattern[] = [
  'liu_chong',
  'liu_hai',
  'xing',
  'po',
];

/**
 * Calculate score adjustment based on Wu Xing (year element) compatibility
 * combined with Chinese zodiac pattern.
 * 
 * @param pattern - Chinese zodiac pattern (san_he, liu_he, etc.)
 * @param elemA - Year element for user A
 * @param elemB - Year element for user B
 * @returns Score adjustment from -6 to +6
 */
export function getWuXingScoreBonus(
  pattern: ChinesePattern,
  elemA?: WuXing,
  elemB?: WuXing
): number {
  if (!elemA || !elemB) return 0;

  const relation = computeWuXingRelation(elemA, elemB);

  const isGood = GOOD_PATTERNS.includes(pattern);
  const isDifficult = DIFFICULT_PATTERNS.includes(pattern);

  switch (relation) {
    case 'supportive':
      if (isGood) return +6;        // great animal + supportive elements
      if (isDifficult) return +2;   // hard animal, elements help a little
      return +4;                    // neutral animal, nice boost

    case 'same':
      if (isGood) return +4;
      if (isDifficult) return +1;
      return +2;

    case 'clashing':
      if (isGood) return -6;        // strong animal, but elements clash
      if (isDifficult) return -2;   // already low, don't overkill
      return -4;                    // neutral animal, elements drag it down

    case 'neutral':
    default:
      return 0;
  }
}

// ---- DESCRIPTION FUNCTIONS ----

export function getChinesePatternLine(ctx: ConnectionContext): string {
  const { chineseA, chineseB } = ctx;
  const pairLabel = `${chineseA.animal} × ${chineseB.animal}`;
  
  // Use the new blurb system
  const blurb = getChineseConnectionBlurb(chineseA.animal as ChineseAnimal, chineseB.animal as ChineseAnimal);
  
  if (blurb) {
    console.log(`[getChinesePatternLine] Found blurb for ${chineseA.animal} × ${chineseB.animal}: ${blurb}`);
    return `${pairLabel} — ${blurb}`;
  }
  
  // Fallback (should rarely happen)
  console.log(`[getChinesePatternLine] No blurb found for ${chineseA.animal} × ${chineseB.animal}, using fallback`);
  return `${pairLabel} — No major classical pattern: chemistry depends more on Western signs and personal maturity.`;
}

function baseElementPhrase(a: Element, b: Element): string {
  const pairSorted = [a, b].sort().join('-');

  switch (pairSorted) {
    case 'Fire-Fire':
      return 'intense and fast-burning chemistry';

    case 'Earth-Earth':
      return 'slow-burn, grounded match';

    case 'Air-Air':
      return 'mentally fast, chatty, and restless';

    case 'Water-Water':
      return 'deep emotional tide, very sensitive together';

    case 'Air-Fire':
      // This covers Air + Fire and Fire + Air (opposites like Aquarius–Leo, or trines like Aries–Leo, etc.)
      return 'lively and stimulating';

    case 'Earth-Water':
      return 'nurturing and stabilising';

    case 'Earth-Fire':
      return 'passion vs practicality';

    case 'Fire-Water':
      return 'strong attraction but sensitive spots need care';

    case 'Air-Earth':
      return 'ideas vs reality';

    case 'Air-Water':
      return 'romantic and imaginative';

    default:
      return 'mixed tempo';
  }
}

function aspectDescription(aspect: WestAspect): { name: string; description: string } {
  switch (aspect) {
    case 'same_sign':
      return { name: 'same sign', description: 'very strong mirror effect' };
    case 'opposition':
      return { name: 'opposition', description: 'high-voltage chemistry' };
    case 'square':
      return { name: 'square aspect', description: 'growth through friction' };
    case 'trine':
      return { name: 'trine aspect', description: 'natural flow' };
    case 'sextile':
      return { name: 'sextile aspect', description: 'light, social and stimulating' };
    case 'quincunx':
      return { name: 'quincunx', description: 'off-beat mix that doesn\'t click on autopilot' };
    default:
      return { name: '', description: '' };
  }
}

export function getWesternSignLine(ctx: ConnectionContext): string {
  const { westA, westB } = ctx;
  
  // Use the new blurb system for Western sign personality descriptions
  const blurb = getWesternConnectionBlurb(westA.sign as WesternSign, westB.sign as WesternSign);
  
  if (blurb) {
    console.log(`[getWesternSignLine] Found blurb for ${westA.sign} × ${westB.sign}: ${blurb}`);
    return `${westA.sign} × ${westB.sign} — ${blurb}`;
  }
  
  // Fallback (should rarely happen)
  console.log(`[getWesternSignLine] No blurb found for ${westA.sign} × ${westB.sign}, using fallback`);
  return `${westA.sign} × ${westB.sign} — Connection details not available.`;
}

export function getWesternElementLine(ctx: ConnectionContext): string {
  const { westA, westB, westAspect } = ctx;
  
  // Get modality from context or derive it
  let modalityA = westA.modality;
  let modalityB = westB.modality;
  
  if (!modalityA || !modalityB) {
    try {
      const signANorm = normalizeWesternSign(westA.sign);
      const signBNorm = normalizeWesternSign(westB.sign);
      modalityA = getWesternModality(signANorm);
      modalityB = getWesternModality(signBNorm);
    } catch (error) {
      console.error('[getWesternElementLine] Error getting modality:', error);
      // Fallback to empty string
      modalityA = modalityA || '';
      modalityB = modalityB || '';
    }
  }
  
  const phrase = baseElementPhrase(westA.element, westB.element);
  const aspect = aspectDescription(westAspect);

  // Format: "Fire (Fixed) × Air (Mutable), sextile aspect – light, social and stimulating"
  if (aspect.name && aspect.description) {
    return `${westA.element} (${modalityA}) × ${westB.element} (${modalityB}), ${aspect.name} – ${aspect.description}.`;
  }

  // No aspect (rare)
  return `${westA.element} (${modalityA}) × ${westB.element} (${modalityB}) – ${phrase}.`;
}

export function getWuXingLine(ctx: ConnectionContext): string | null {
  const { chineseA, chineseB } = ctx;
  const elemA = chineseA.yearElement;
  const elemB = chineseB.yearElement;

  if (!elemA || !elemB) return null;

  const relation = computeWuXingRelation(elemA, elemB);
  const pairLabel = `${elemA} ${chineseA.animal} × ${elemB} ${chineseB.animal}`;

  switch (relation) {
    case 'supportive': {
      // Determine which element generates which
      let generationText = '';
      if (wuXingGenerating[elemA] === elemB) {
        generationText = `${elemA} generates ${elemB}`;
      } else if (wuXingGenerating[elemB] === elemA) {
        generationText = `${elemB} generates ${elemA}`;
      }
      return `${pairLabel} — Elemental harmony: Supportive (${generationText}).`;
    }
    case 'same':
      return `${pairLabel} — Elemental harmony: Same element, double ${elemA}.`;
    case 'clashing':
      return `${pairLabel} — Elemental tension: Clashing elements, extra patience needed.`;
    case 'neutral':
    default:
      return `${pairLabel} — Elemental overlay: Neutral influence, neither strongly supportive nor clashing.`;
  }
}

// ---- MAIN API ----

export interface ConnectionLines {
  chineseLine: string;
  westernSignLine: string; // New: personality blurb
  westernLine: string; // Element + aspect technical info
  wuXingLine?: string | null;
}

export function buildConnectionLines(ctx: ConnectionContext): ConnectionLines {
  const chineseLine = getChinesePatternLine(ctx);
  const westernSignLine = getWesternSignLine(ctx);
  const westernLine = getWesternElementLine(ctx);
  const wuXingLine = getWuXingLine(ctx); // can be null if no year elements

  return {
    chineseLine,
    westernSignLine,
    westernLine,
    wuXingLine: wuXingLine || undefined,
  };
}

// ---- FINAL MATCH SCORE COMPUTATION ----

export interface MatchScoreInput {
  baseChineseScore: number;       // 0–100
  baseWesternScore: number;       // 0–100
  chinesePattern: ChinesePattern;
  yearElementA?: WuXing;
  yearElementB?: WuXing;
}

/**
 * Compute the final match score by blending Chinese and Western scores,
 * then applying Wu Xing (year element) adjustments.
 * 
 * Formula:
 * 1. Blend: 70% Chinese + 30% Western
 * 2. Add Wu Xing adjustment (-6 to +6)
 * 3. Clamp to [0, 100]
 * 
 * @param input - Match score input with base scores and year elements
 * @returns Final match score (0-100)
 */
export function computeFinalMatchScore(input: MatchScoreInput): number {
  const {
    baseChineseScore,
    baseWesternScore,
    chinesePattern,
    yearElementA,
    yearElementB,
  } = input;

  // 1) Blend Chinese (70%) + Western (30%)
  let score = 0.7 * baseChineseScore + 0.3 * baseWesternScore;

  // 2) Apply Wu Xing adjustment
  const wuXingDelta = getWuXingScoreBonus(
    chinesePattern,
    yearElementA,
    yearElementB
  );

  score += wuXingDelta;

  // 3) Clamp to [0, 100] and round
  score = Math.max(0, Math.min(100, Math.round(score)));

  return score;
}

// ---- MATCH LABEL CLASSIFICATION ----

export type MatchLabel =
  | "Soulmate Match"
  | "Twin Flame Match"
  | "Excellent Match"
  | "Favourable Match"
  | "Neutral Match"
  | "Opposites Attract"
  | "Challenging Match"
  | "Difficult Match";

export interface MatchLabelResult {
  label: MatchLabel;
  emoji: string;
  description: string;
}

/**
 * Determine match label based on final score and optional pattern context.
 * Considers special cases like opposites attract, difficult patterns, etc.
 * 
 * @param score - Final match score (0-100)
 * @param chinesePattern - Optional Chinese pattern for context
 * @param westAspect - Optional Western aspect for context
 * @returns Match label with emoji and description
 */
export function getMatchLabelFromScore(
  score: number,
  chinesePattern?: ChinesePattern,
  westAspect?: WestAspect
): MatchLabelResult {
  // Check for special "Opposites Attract" case
  const isOpposites = 
    chinesePattern === "liu_chong" || 
    westAspect === "opposition";
  
  // Check for difficult patterns
  const isDifficultPattern = 
    chinesePattern === "liu_chong" ||
    chinesePattern === "liu_hai" ||
    chinesePattern === "xing" ||
    chinesePattern === "po";

  // Score-based classification with pattern context
  if (score >= 90) {
    return {
      label: "Soulmate Match",
      emoji: "⭐",
      description: "Exceptional compatibility across all dimensions"
    };
  }
  
  if (score >= 80) {
    return {
      label: "Twin Flame Match",
      emoji: "🔥",
      description: "Powerful connection with transformative potential"
    };
  }
  
  if (score >= 70) {
    return {
      label: "Excellent Match",
      emoji: "💖",
      description: "Strong compatibility with great long-term potential"
    };
  }
  
  if (score >= 60) {
    return {
      label: "Favourable Match",
      emoji: "✨",
      description: "Good compatibility with room for growth"
    };
  }
  
  if (score >= 50) {
    return {
      label: "Neutral Match",
      emoji: "🌟",
      description: "Balanced compatibility, success depends on effort"
    };
  }
  
  // Special handling for opposites attract (35-49)
  if (score >= 35 && isOpposites) {
    return {
      label: "Opposites Attract",
      emoji: "⚡",
      description: "Magnetic tension with high-voltage chemistry"
    };
  }
  
  // Challenging match (35-49 without opposites)
  if (score >= 35) {
    return {
      label: "Challenging Match",
      emoji: "⚠️",
      description: "Requires patience, compromise, and conscious effort"
    };
  }
  
  // Difficult match (below 35)
  return {
    label: "Difficult Match",
    emoji: "💔",
    description: "Significant challenges, not recommended without deep awareness"
  };
}

