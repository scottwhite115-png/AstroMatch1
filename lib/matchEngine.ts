// lib/matchEngine.ts
// Core scoring + labelling logic for AstroMatch, based on traditional Chinese patterns.

// ----------------- TYPES -----------------

export type ChinesePattern =
  | "SAN_HE"      // 三合
  | "LIU_HE"      // 六合
  | "SAME_SIGN"   // 同生肖 (renamed from SAME_ANIMAL)
  | "NO_PATTERN"  // 无显著格局 (NEUTRAL)
  | "LIU_CHONG"   // 六冲
  | "LIU_HAI"     // 六害
  | "XING"        // 刑
  | "PO";         // 破

export type WesternElement = "Fire" | "Earth" | "Air" | "Water";
export type WuXingElement = "Wood" | "Fire" | "Earth" | "Metal" | "Water";

// Very simplified relationship buckets – adapt to however you already model these.
export type WesternElementRelation =
  | "SAME_ELEMENT"
  | "COMPATIBLE_ELEMENT"   // e.g. Fire–Air, Earth–Water
  | "SEMI_COMPATIBLE"      // e.g. Fire–Earth, Air–Water
  | "MISMATCH";            // e.g. Fire–Water, Air–Earth

export type WesternAspectRelation =
  | "SOFT"      // trine / sextile
  | "NEUTRAL"   // conjunction or no strong aspect
  | "HARD"      // square etc.
  | "OPPOSITION";

export type WuXingRelation =
  | "SAME"
  | "GENERATING" // productive / supportive cycle
  | "CONTROLLING"
  | "OTHER";

// Element relation for Wu Xing scoring
export type ElementRelation = 'same' | 'compatible' | 'semi' | 'clash';

export interface MatchInput {
  pattern: ChinesePattern;
  westernElementRelation: WesternElementRelation;
  westernAspectRelation: WesternAspectRelation;
  wuXingRelation?: WuXingRelation;
  sameWesternSign?: boolean; // <--- add this
}

// What the engine returns to the UI.
export interface MatchResult {
  score: number; // 0–100
  pattern: ChinesePattern;
  patternEmoji: string;
  patternShortLabelEn: string;   // "Triple Harmony"
  patternFullLabel: string;      // "🌟 San He 三合 · Triple Harmony · 92%"
  pillLabel: string;             // "92% · Triple Harmony"
  baseTagline: string;           // pattern explanation line
  chemistryStars: number;        // 0–5 in 0.5 steps
  stabilityStars: number;        // 0–5 in 0.5 steps
}

// ----------------- Pattern metadata -----------------

interface PatternMeta {
  id: ChinesePattern;
  emoji: string;
  labelEn: string;
  labelFull: string;        // e.g. "San He 三合 · Triple Harmony"
  tagline: string;          // short explainer (no slang)
  // score band for this pattern before West/WuXing tweaks
  min: number;              // absolute minimum this pattern should ever reach
  max: number;              // absolute maximum
  // helpful anchors for tuning inside the band
  highStart: number;        // score from which we consider it "high" for this pattern
  midStart: number;         // "mid" band start within pattern
}

const PATTERN_META: Record<ChinesePattern, PatternMeta> = {
  SAN_HE: {
    id: "SAN_HE",
    emoji: "🌟",
    labelEn: "Triple Harmony",
    labelFull: "San He 三合 · Triple Harmony",
    tagline: "High natural harmony and shared rhythm; when you're aligned, this connection moves fast and far.",
    min: 72,
    max: 98,
    highStart: 88,
    midStart: 80,
  },
  LIU_HE: {
    id: "LIU_HE",
    emoji: "💫",
    labelEn: "Secret Friends",
    labelFull: "Liu He 六合 · Secret Friends",
    tagline: "Quietly strong bond that feels safe, loyal, and steady when you choose each other.",
    min: 68,
    max: 91,
    highStart: 82,
    midStart: 75,
  },
  SAME_SIGN: {
    id: "SAME_SIGN",
    emoji: "🪞",
    labelEn: "Same Sign",
    labelFull: "Same Sign 同生肖",
    tagline: "Mirror-match energy with strong familiarity and shared habits; comforting, but not automatically harmonious.",
    min: 68,
    max: 82,
    highStart: 78,
    midStart: 72,
  },
  NO_PATTERN: {
    id: "NO_PATTERN",
    emoji: "◽",
    labelEn: "Neutral",
    labelFull: "Neutral 中",
    tagline: "No classical pattern; the vibe depends more on personal charts, timing, and your Western signs.",
    min: 52,
    max: 68,
    highStart: 64,
    midStart: 58,
  },
  LIU_CHONG: {
    id: "LIU_CHONG",
    emoji: "⚠️",
    labelEn: "Six Conflicts",
    labelFull: "Liu Chong 六冲 · Six Conflicts",
    tagline: "Magnetic opposites with sharp edges; big lessons, not automatic comfort.",
    min: 45,
    max: 62,
    highStart: 60,
    midStart: 52,
  },
  LIU_HAI: {
    id: "LIU_HAI",
    emoji: "💔",
    labelEn: "Six Harms",
    labelFull: "Liu Hai 六害 · Six Harms",
    tagline: "Sensitive pattern where small misreads can snowball; this match needs extra patience and very clear communication.",
    min: 38,
    max: 60,
    highStart: 54,
    midStart: 46,
  },
  XING: {
    id: "XING",
    emoji: "🔥",
    labelEn: "Punishment Pattern",
    labelFull: "Xing 刑 · Punishment Pattern",
    tagline: "Tension and sharp edges; situations can feel strict or demanding.",
    min: 38,
    max: 60,
    highStart: 54,
    midStart: 46,
  },
  PO: {
    id: "PO",
    emoji: "💥",
    labelEn: "Break Pattern",
    labelFull: "Po 破 · Break Pattern",
    tagline: "This bond tends to disrupt old patterns; growth is possible but rarely feels easy or predictable.",
    min: 38,
    max: 60,
    highStart: 54,
    midStart: 46,
  },
};

// ----------------- Scoring helpers -----------------

// Convert WuXingRelation to ElementRelation for base score calculation
function wuXingToElementRelation(wuXing?: WuXingRelation): ElementRelation {
  if (!wuXing) return 'semi';
  switch (wuXing) {
    case "SAME":
      return 'same';
    case "GENERATING":
      return 'compatible';
    case "CONTROLLING":
      return 'clash';
    case "OTHER":
    default:
      return 'semi';
  }
}

// Get Chinese base score based on pattern and element relation
function getChineseBaseScore(
  pattern: ChinesePattern,
  elementRelation: ElementRelation
): number {
  // Same Sign
  if (pattern === 'SAME_SIGN') {
    if (elementRelation === 'same') return 76;         // Same animal + same element
    if (elementRelation === 'compatible') return 74;   // Same animal + compatible elements
    if (elementRelation === 'semi') return 72;         // Same animal + semi-compatible
    return 70;                                         // Same animal + clashing elements
  }

  // San He trines (NO same sign)
  if (pattern === 'SAN_HE') {
    if (elementRelation === 'same') return 90;
    if (elementRelation === 'compatible') return 88;
    if (elementRelation === 'semi') return 85;
    return 82;
  }

  // Liu He - Secret Friends
  if (pattern === 'LIU_HE') {
    if (elementRelation === 'same') return 86;
    if (elementRelation === 'compatible') return 84;
    if (elementRelation === 'semi') return 80;
    return 76;
  }

  // No Pattern / Neutral
  if (pattern === 'NO_PATTERN') {
    if (elementRelation === 'same') return 64;
    if (elementRelation === 'compatible') return 62;
    if (elementRelation === 'semi') return 60;
    return 56;
  }

  // Liu Chong - Six Conflicts
  if (pattern === 'LIU_CHONG') {
    if (elementRelation === 'same') return 60;
    if (elementRelation === 'compatible') return 56;
    if (elementRelation === 'semi') return 52;
    return 48;
  }

  // Liu Hai - Six Harms
  if (pattern === 'LIU_HAI') {
    if (elementRelation === 'same') return 58;
    if (elementRelation === 'compatible') return 54;
    if (elementRelation === 'semi') return 50;
    return 46;
  }

  // Xing - Punishment
  if (pattern === 'XING') {
    if (elementRelation === 'same') return 56;
    if (elementRelation === 'compatible') return 52;
    if (elementRelation === 'semi') return 48;
    return 44;
  }

  // Po - Break
  if (pattern === 'PO') {
    if (elementRelation === 'same') return 54;
    if (elementRelation === 'compatible') return 50;
    if (elementRelation === 'semi') return 46;
    return 42;
  }

  return 60;
}

// Baseline for each pattern before West / Wu Xing adjustments.
// These sit in the middle of each pattern's band roughly.
const PATTERN_BASE_SCORE: Record<ChinesePattern, number> = {
  SAN_HE: 82,
  LIU_HE: 80,
  SAME_SIGN: 72,
  NO_PATTERN: 60,
  LIU_CHONG: 52,
  LIU_HAI: 50,
  XING: 48,
  PO: 46,
};

// Element compatibility adjustments.
// These are deliberately modest; pattern does most of the work.
function scoreFromWesternElementRelation(rel: WesternElementRelation): number {
  switch (rel) {
    case "SAME_ELEMENT":
      // same element – very easy
      return +6;
    case "COMPATIBLE_ELEMENT":
      // Fire–Air, Earth–Water etc.
      return +4;
    case "SEMI_COMPATIBLE":
      return +1;
    case "MISMATCH":
    default:
      return -4;
  }
}

// Aspect adjustments.
function scoreFromWesternAspect(rel: WesternAspectRelation): number {
  switch (rel) {
    case "SOFT":
      return +4;
    case "NEUTRAL":
      return 0;
    case "HARD":
      return -6;
    case "OPPOSITION":
      // you may choose -4 and then separately mark Magnetic Opposites in UI
      return -4;
    default:
      return 0;
  }
}

// Wu Xing (year element) adjustments.
function scoreFromWuXing(rel?: WuXingRelation): number {
  if (!rel) return 0;
  switch (rel) {
    case "SAME":
      return +2;
    case "GENERATING":
      return +4;
    case "CONTROLLING":
      return -4;
    case "OTHER":
    default:
      return 0;
  }
}

// Same Western sign adjustment.
const SAME_SIGN_PENALTY = -8; // tune this if needed

function sameSignAdjustment(sameWesternSign?: boolean): number {
  return sameWesternSign ? SAME_SIGN_PENALTY : 0;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// Make sure pattern scores never leave their allowed band.
function clampToPatternBand(pattern: ChinesePattern, score: number): number {
  const meta = PATTERN_META[pattern];
  return clamp(score, meta.min, meta.max);
}

// Convert score 0–100 to 0–5 stars (nearest 0.5)
function overallStars(score: number): number {
  return Math.round((score / 20) * 2) / 2; // nearest 0.5
}

// ----------------- Public API -----------------

export function calculateMatchScore(input: MatchInput): number {
  const {
    pattern,
    westernElementRelation,
    westernAspectRelation,
    wuXingRelation,
    sameWesternSign,
  } = input;

  // NEW: Use element-based base score instead of fixed PATTERN_BASE_SCORE
  const elementRelation = wuXingToElementRelation(wuXingRelation);
  let score = getChineseBaseScore(pattern, elementRelation);

  // Add Western adjustments
  score += scoreFromWesternElementRelation(westernElementRelation);
  score += scoreFromWesternAspect(westernAspectRelation);
  score += sameSignAdjustment(sameWesternSign);

  score = clampToPatternBand(pattern, score);
  
  // Cap NO_PATTERN (Neutral) scores at 65%
  if (pattern === "NO_PATTERN" && score > 65) {
    score = 65;
  }
  
  score = clamp(score, 0, 100);

  return Math.round(score);
}

/**
 * Calculate match score with overlay penalties applied.
 * This version should be used when overlay information is available.
 */
export function calculateMatchScoreWithOverlays(
  input: MatchInput,
  overlays: ChinesePattern[]
): number {
  const {
    pattern,
    westernElementRelation,
    westernAspectRelation,
    wuXingRelation,
    sameWesternSign,
  } = input;

  // NEW: Use element-based base score instead of fixed PATTERN_BASE_SCORE
  const elementRelation = wuXingToElementRelation(wuXingRelation);
  let score = getChineseBaseScore(pattern, elementRelation);

  // Add Western adjustments
  score += scoreFromWesternElementRelation(westernElementRelation);
  score += scoreFromWesternAspect(westernAspectRelation);
  score += sameSignAdjustment(sameWesternSign);

  score = clampToPatternBand(pattern, score);
  
  // Cap NO_PATTERN (Neutral) scores at 65%
  if (pattern === "NO_PATTERN" && score > 65) {
    score = 65;
  }
  
  // Apply overlay penalties
  const damageOverlays = overlays.filter(o => 
    o === "LIU_HAI" || o === "XING" || o === "PO"
  );
  const hasDamageOverlays = damageOverlays.length > 0;
  
  // Count damage overlays
  if (hasDamageOverlays) {
    // For harmonious base patterns (San He, Liu He), apply caps
    if (pattern === "SAN_HE" || pattern === "LIU_HE") {
      if (damageOverlays.length >= 2) {
        // 2+ damage overlays: cap at 78-84% max
        if (westernElementRelation === "SAME_ELEMENT" || westernElementRelation === "COMPATIBLE_ELEMENT") {
          score = Math.min(score, 84);
        } else {
          score = Math.min(score, 82);
        }
      } else if (damageOverlays.length === 1) {
        // 1 overlay with good West: cap at 82-86%
        if (westernElementRelation === "SAME_ELEMENT" || westernElementRelation === "COMPATIBLE_ELEMENT") {
          score = Math.min(score, 86);
        } else {
          score = Math.min(score, 82);
        }
      }
    }
  }
  
  score = clamp(score, 0, 100);

  return Math.round(score);
}

// ----------------- Chemistry & Stability Star Mapping -----------------

interface StarPair {
  chemistry: number;
  stability: number;
}

/**
 * Get base star ratings for a pattern and score combination.
 * These are adjusted by Western aspect before final display.
 */
function baseStarsForPattern(pattern: ChinesePattern, score: number): StarPair {
  switch (pattern) {
    case "SAN_HE": {
      if (score >= 90) return { chemistry: 4.5, stability: 5.0 };
      if (score >= 82) return { chemistry: 4.0, stability: 4.5 };
      return { chemistry: 3.5, stability: 4.0 }; // 75–81
    }
    case "LIU_HE": {
      if (score >= 86) return { chemistry: 4.5, stability: 4.5 };
      if (score >= 78) return { chemistry: 4.0, stability: 4.0 };
      return { chemistry: 3.5, stability: 3.5 }; // 72–77
    }
    case "SAME_ANIMAL": {
      if (score >= 80) return { chemistry: 4.0, stability: 3.5 };
      if (score >= 72) return { chemistry: 3.5, stability: 3.0 };
      return { chemistry: 3.0, stability: 2.5 }; // 68–71
    }
    case "NO_PATTERN": {
      if (score >= 68) return { chemistry: 3.5, stability: 3.0 };
      if (score >= 58) return { chemistry: 3.0, stability: 2.5 };
      return { chemistry: 2.5, stability: 2.0 }; // 50–57
    }
    case "LIU_CHONG": {
      if (score >= 60) return { chemistry: 4.0, stability: 2.5 };
      if (score >= 48) return { chemistry: 3.0, stability: 2.0 };
      return { chemistry: 2.5, stability: 1.5 }; // 38–47
    }
    case "LIU_HAI": {
      if (score >= 58) return { chemistry: 3.5, stability: 2.5 };
      if (score >= 45) return { chemistry: 3.0, stability: 2.0 };
      return { chemistry: 2.5, stability: 1.5 }; // 35–44
    }
    case "XING": {
      if (score >= 56) return { chemistry: 3.0, stability: 2.0 };
      if (score >= 45) return { chemistry: 2.5, stability: 1.5 };
      return { chemistry: 2.0, stability: 1.0 }; // 35–44
    }
    case "PO": {
      if (score >= 54) return { chemistry: 3.0, stability: 2.0 };
      if (score >= 42) return { chemistry: 2.5, stability: 1.5 };
      return { chemistry: 2.0, stability: 1.0 }; // 32–41
    }
    default:
      return { chemistry: 3.0, stability: 3.0 };
  }
}

/**
 * Apply Western aspect tweak to star ratings.
 * SOFT aspects boost both chemistry and stability.
 * HARD/OPPOSITION boost chemistry but lower stability (magnetic opposites).
 */
function applyAspectTweak(
  stars: StarPair,
  aspect: WesternAspectRelation,
  pattern: ChinesePattern
): StarPair {
  let { chemistry, stability } = stars;

  // Check if this is a conflict pattern
  const isConflictPattern = ["LIU_CHONG", "LIU_HAI", "XING", "PO"].includes(pattern);

  if (aspect === "SOFT") {
    // For conflict patterns: only boost chemistry, not stability
    chemistry += 0.5;
    if (!isConflictPattern) {
      stability += 0.5;
    }
  } else if (aspect === "HARD" || aspect === "OPPOSITION") {
    chemistry += 0.5;
    stability -= 0.5;
  }

  // Cap chemistry and stability for conflict patterns
  if (isConflictPattern) {
    chemistry = clamp(chemistry, 0, 4.0); // Max 4.0 for conflict patterns
    stability = clamp(stability, 0, 3.0); // Max 3.0 for conflict patterns
  } else {
    chemistry = clamp(chemistry, 0, 5);
    stability = clamp(stability, 0, 5);
  }

  // Round to nearest 0.5 to keep display neat
  const roundHalf = (x: number) => Math.round(x * 2) / 2;

  return {
    chemistry: roundHalf(chemistry),
    stability: roundHalf(stability),
  };
}

/**
 * Calculate final star ratings for chemistry and stability.
 * Returns values from 0–5 in 0.5 increments.
 */
function getStarRatings(
  pattern: ChinesePattern,
  score: number,
  aspect: WesternAspectRelation,
  sameWesternSign?: boolean
): StarPair {
  const base = baseStarsForPattern(pattern, score);
  let result = applyAspectTweak(base, aspect, pattern);
  
  // Special case: San He + same Western sign = cap Stability at 4.0
  // (mirror-y pair, loads of chemistry but not totally effortless)
  if (pattern === "SAN_HE" && sameWesternSign) {
    result.stability = Math.min(result.stability, 4.0);
  }
  
  return result;
}

// ----------------- Build Full Result -----------------

import { getPatternPillLabel, getPatternHeading } from './astrology/patternLabels';

export function buildMatchResult(input: MatchInput, overlays?: ChinesePattern[]): MatchResult {
  const score = overlays && overlays.length > 0 
    ? calculateMatchScoreWithOverlays(input, overlays)
    : calculateMatchScore(input);
  const meta = PATTERN_META[input.pattern];

  // Use the new pattern label functions from patternLabels.ts
  const pillLabel = `${getPatternPillLabel(input.pattern)} · ${Math.round(score)}%`;
  const patternFullLabelWithScore = getPatternHeading(input.pattern, score);

  const { chemistry, stability } = getStarRatings(
    input.pattern,
    score,
    input.westernAspectRelation,
    input.sameWesternSign
  );

  console.log('[buildMatchResult] Generated stars:', {
    pattern: input.pattern,
    score,
    westernAspect: input.westernAspectRelation,
    sameWesternSign: input.sameWesternSign,
    chemistry,
    stability,
  });

  return {
    score,
    pattern: input.pattern,
    patternEmoji: meta.emoji,
    patternShortLabelEn: meta.labelEn,
    patternFullLabel: patternFullLabelWithScore,
    pillLabel,
    baseTagline: meta.tagline,
    chemistryStars: chemistry,
    stabilityStars: stability,
  };
}

// ----------------- LEGACY TYPES & EXPORTS (for backward compatibility) -----------------

export type WesternSign =
  | "Aries"
  | "Taurus"
  | "Gemini"
  | "Cancer"
  | "Leo"
  | "Virgo"
  | "Libra"
  | "Scorpio"
  | "Sagittarius"
  | "Capricorn"
  | "Aquarius"
  | "Pisces";

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

export type WuXing = WuXingElement; // alias

export type West = WesternSign;
export type East = ChineseAnimal;

export type MatchTier =
  | "Soulmate Match"
  | "Twin Flame Match"
  | "Harmonious Match"
  | "Neutral Match"
  | "Opposites Attract"
  | "Difficult Match";

// Legacy aspect types (lowercase versions)
export type WestAspect =
  | "same_sign"
  | "opposition"
  | "trine"
  | "sextile"
  | "square"
  | "quincunx"
  | "none";

export type WestElementRelation =
  | "same"
  | "compatible"
  | "semi_compatible"
  | "clash"
  | "neutral";

// Legacy context interface
export interface MatchContext {
  // WEST
  westA: { sign: WesternSign; element: WesternElement };
  westB: { sign: WesternSign; element: WesternElement };
  westAspect: WestAspect;
  westElementRelation: WestElementRelation;

  // CHINESE
  chineseA: { animal: ChineseAnimal; yearElement: WuXing };
  chineseB: { animal: ChineseAnimal; yearElement: WuXing };
  chinesePattern: ChinesePattern | Lowercase<ChinesePattern>;

  isChineseOpposite?: boolean;
  isLivelyPair?: boolean;
}

export interface MatchScoreResult {
  score: number;   // calibrated (UI)
  rawScore: number; // math before banding
  tier: MatchTier;
}

// ----------------- Wu Xing helpers -----------------

const wuXingGenerating: Record<WuXing, WuXing> = {
  Wood: "Fire",
  Fire: "Earth",
  Earth: "Metal",
  Metal: "Water",
  Water: "Wood",
};

const wuXingControlling: Record<WuXing, WuXing> = {
  Wood: "Earth",
  Earth: "Water",
  Water: "Fire",
  Fire: "Metal",
  Metal: "Wood",
};

export function computeWuXingRelation(a: WuXing, b: WuXing): WuXingRelation {
  if (a === b) return "SAME";
  if (wuXingGenerating[a] === b || wuXingGenerating[b] === a) {
    return "GENERATING";
  }
  if (wuXingControlling[a] === b || wuXingControlling[b] === a) {
    return "CONTROLLING";
  }
  return "OTHER";
}

// Helper to calculate Western aspect between two signs
export function calculateWestAspect(a: WesternSign, b: WesternSign): WestAspect {
  const signs: WesternSign[] = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  
  const indexA = signs.indexOf(a);
  const indexB = signs.indexOf(b);
  
  if (indexA === -1 || indexB === -1) return "none";
  if (indexA === indexB) return "same_sign";
  
  const distance = Math.abs(indexA - indexB);
  const minDistance = Math.min(distance, 12 - distance);
  
  switch (minDistance) {
    case 6: return "opposition";
    case 4: return "trine";
    case 2: return "sextile";
    case 3: return "square";
    case 5: return "quincunx";
    default: return "none";
  }
}

// Helper to get Western element from sign
export function getWesternSignElement(sign: WesternSign): WesternElement {
  const fireSign: WesternSign[] = ["Aries", "Leo", "Sagittarius"];
  const earthSign: WesternSign[] = ["Taurus", "Virgo", "Capricorn"];
  const airSign: WesternSign[] = ["Gemini", "Libra", "Aquarius"];
  const waterSign: WesternSign[] = ["Cancer", "Scorpio", "Pisces"];
  
  if (fireSign.includes(sign)) return "Fire";
  if (earthSign.includes(sign)) return "Earth";
  if (airSign.includes(sign)) return "Air";
  if (waterSign.includes(sign)) return "Water";
  
  return "Fire"; // fallback
}

// Helper to calculate Western element relation
export function calculateWestElementRelation(
  a: WesternElement,
  b: WesternElement
): WestElementRelation {
  if (a === b) return "same";
  
  // Compatible: Fire-Air, Earth-Water
  if ((a === "Fire" && b === "Air") || (a === "Air" && b === "Fire")) return "compatible";
  if ((a === "Earth" && b === "Water") || (a === "Water" && b === "Earth")) return "compatible";
  
  // Semi-compatible: Fire-Earth, Air-Water
  if ((a === "Fire" && b === "Earth") || (a === "Earth" && b === "Fire")) return "semi_compatible";
  if ((a === "Air" && b === "Water") || (a === "Water" && b === "Air")) return "semi_compatible";
  
  // Clash: Fire-Water, Earth-Air
  if ((a === "Fire" && b === "Water") || (a === "Water" && b === "Fire")) return "clash";
  if ((a === "Earth" && b === "Air") || (a === "Air" && b === "Earth")) return "clash";
  
  return "neutral";
}

// Helper to get Wu Xing year element from birth year
export function getWuXingYearElement(year: number): WuXing {
  // 60-year cycle: 1984 = Wood (Yang)
  const reference = 1984;
  const offset = (year - reference) % 10;
  const normalizedOffset = offset < 0 ? offset + 10 : offset;
  
  const elements: WuXing[] = ["Wood", "Wood", "Fire", "Fire", "Earth", "Earth", "Metal", "Metal", "Water", "Water"];
  return elements[normalizedOffset];
}

// Helper to get Western modality
export type WesternModality = "Cardinal" | "Fixed" | "Mutable";

export function getWesternSignModality(sign: WesternSign): WesternModality {
  const cardinal: WesternSign[] = ["Aries", "Cancer", "Libra", "Capricorn"];
  const fixed: WesternSign[] = ["Taurus", "Leo", "Scorpio", "Aquarius"];
  const mutable: WesternSign[] = ["Gemini", "Virgo", "Sagittarius", "Pisces"];
  
  if (cardinal.includes(sign)) return "Cardinal";
  if (fixed.includes(sign)) return "Fixed";
  if (mutable.includes(sign)) return "Mutable";
  
  return "Cardinal"; // fallback
}

// Convert between uppercase and lowercase pattern formats
export function normalizePattern(pattern: string): ChinesePattern {
  const upperPattern = pattern.toUpperCase();
  if (upperPattern === "SAN_HE") return "SAN_HE";
  if (upperPattern === "LIU_HE") return "LIU_HE";
  if (upperPattern === "SAME_ANIMAL") return "SAME_ANIMAL";
  if (upperPattern === "LIU_CHONG") return "LIU_CHONG";
  if (upperPattern === "LIU_HAI") return "LIU_HAI";
  if (upperPattern === "XING") return "XING";
  if (upperPattern === "PO") return "PO";
  return "NO_PATTERN";
}

// Convert legacy WestElementRelation to new WesternElementRelation
export function convertElementRelation(legacy: WestElementRelation): WesternElementRelation {
  switch (legacy) {
    case "same": return "SAME_ELEMENT";
    case "compatible": return "COMPATIBLE_ELEMENT";
    case "semi_compatible": return "SEMI_COMPATIBLE";
    case "clash":
    case "neutral":
    default: return "MISMATCH";
  }
}

// Convert legacy WestAspect to new WesternAspectRelation
export function convertAspectRelation(legacy: WestAspect): WesternAspectRelation {
  switch (legacy) {
    case "trine":
    case "sextile":
      return "SOFT";
    case "square":
      return "HARD";
    case "opposition":
      return "OPPOSITION";
    case "same_sign":
    case "none":
    default:
      return "NEUTRAL";
  }
}

// Legacy wrapper function for backward compatibility
export function computeMatchScore(ctx: MatchContext): MatchScoreResult {
  // Convert legacy format to new format
  const pattern = normalizePattern(ctx.chinesePattern as string);
  const westernElementRelation = convertElementRelation(ctx.westElementRelation);
  const westernAspectRelation = convertAspectRelation(ctx.westAspect);
  const wuXingRelation = computeWuXingRelation(
    ctx.chineseA.yearElement,
    ctx.chineseB.yearElement
  );

  const input: MatchInput = {
    pattern,
    westernElementRelation,
    westernAspectRelation,
    wuXingRelation,
  };

  const result = buildMatchResult(input);
  
  // Map score to tier for legacy compatibility
  let tier: MatchTier;
  if (result.score >= 95) tier = "Soulmate Match";
  else if (result.score >= 85) tier = "Twin Flame Match";
  else if (result.score >= 75) tier = "Harmonious Match";
  else if (result.score >= 60) tier = "Neutral Match";
  else if (ctx.isChineseOpposite || ctx.westAspect === "opposition") tier = "Opposites Attract";
  else tier = "Difficult Match";

  console.log('[Match Engine] Scoring:', {
    pattern: result.pattern,
    westernElementRelation,
    westernAspectRelation,
    wuXingRelation,
    score: result.score,
    tier
  });

  return {
    score: result.score,
    rawScore: result.score, // In new engine, these are the same after clamping
    tier,
  };
}

// ---- Deprecated/Legacy exports for backward compatibility ----
// These are used by lib/getMatchCard.ts for carousel-demo and other legacy components

export function pairKey(aWest: string, aEast: string, bWest: string, bEast: string): string {
  return `${aWest.toLowerCase()}/${aEast.toLowerCase()}×${bWest.toLowerCase()}/${bEast.toLowerCase()}`;
}

export interface LegacyMatchExplanation {
  score: number;
  rankKey: string;
  emoji: string;
  colorRgb: string;
  connectionLabel: string;
  east_relation: string;
  east_summary: string;
  west_relation: string;
  west_summary: string;
}

export function explainMatchAndScore(
  aWest: string,
  aEast: string,
  bWest: string,
  bEast: string
): LegacyMatchExplanation {
  // Stub implementation - returns placeholder data
  // This is only used by carousel-demo which is a test page
  return {
    score: 75,
    rankKey: "good",
    emoji: "🌙",
    colorRgb: "rgb(251, 191, 36)",
    connectionLabel: "Easy Flow",
    east_relation: `${aEast} × ${bEast}`,
    east_summary: "Compatible energy in the Chinese zodiac.",
    west_relation: `${aWest} × ${bWest}`,
    west_summary: "Harmonious western sign pairing.",
  };
}

// Export West and East types for backward compatibility
export type West =
  | "Aries" | "Taurus" | "Gemini" | "Cancer" | "Leo" | "Virgo"
  | "Libra" | "Scorpio" | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces";

export type East =
  | "Rat" | "Ox" | "Tiger" | "Rabbit" | "Dragon" | "Snake"
  | "Horse" | "Goat" | "Monkey" | "Rooster" | "Dog" | "Pig";
