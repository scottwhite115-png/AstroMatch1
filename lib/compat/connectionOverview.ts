// connectionOverview.ts
// New connection overview engine with structured types and formatting

import type { ChinesePattern as ChinesePatternOld } from "./chinesePatterns";
import { buildWesternSection } from "./westernElements";
import type { WestRelation as WestRelationOld } from "./westernElements";

// ==================== Type Definitions ====================

export type WesternSign =
  | "Aries" | "Taurus" | "Gemini" | "Cancer"
  | "Leo" | "Virgo" | "Libra" | "Scorpio"
  | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces";

export type ChineseAnimal =
  | "Rat" | "Ox" | "Tiger" | "Rabbit"
  | "Dragon" | "Snake" | "Horse" | "Goat"
  | "Monkey" | "Rooster" | "Dog" | "Pig";

// Chinese pattern "labels" we've been using
export type ChinesePattern =
  | "san_he"          // 三合
  | "liu_he"          // 六合
  | "liu_chong"       // 六冲 (opposites)
  | "liu_hai"         // 六害
  | "po"              // 破
  | "self_punishment" // 相刑 / 自刑
  | "neutral";

// Western relation "buckets" (from your West compatibility section)
export type WestRelation =
  | "same_element"
  | "compatible"
  | "semi_compatible"
  | "mismatch"
  | "opposites";

export interface ChinesePairInfo {
  animalA: ChineseAnimal;
  animalB: ChineseAnimal;
  label: string; // e.g. "Monkey × Goat"
  pattern: ChinesePattern;
  patternLabel: string; // e.g. "San He (三合)"
  patternNameEn: string; // e.g. "Three Harmonies"
  trineLabel?: string; // e.g. "Visionaries 水三会" or "Artists 木三合" (optional)
  // One short Tone-B sentence about the "vibe":
  shortSummary: string; // e.g. "The bond feels bright, synergistic, and naturally aligned."
  isSameTrine: boolean;
  isSameAnimal: boolean;
}

export interface WestPairInfo {
  signA: WesternSign;
  signB: WesternSign;
  label: string; // e.g. "Aquarius × Leo"
  relation: WestRelation;
  relationLabel: string; // e.g. "Compatible (Air + Fire)" or "Same Element (Air + Air)"
  elementsLabel: string; // e.g. "Air + Fire", "Water + Earth"
  // One short Tone-B sentence about the West energy:
  shortSummary: string; // e.g. "The connection feels energetic, future-focused, and mentally alive."
}

// Match Labels
export type MatchLabel =
  | "Soulmate Match"
  | "Twin Flame Match"
  | "Excellent Match"
  | "Favourable Match"
  | "Neutral Match"
  | "Magnetic Opposites"
  | "Difficult Match";

export interface MatchLabelInfo {
  label: MatchLabel;
  color: string; // hex or tailwind token
}

export interface ConnectionOverview {
  chineseLine: string; // for the Chinese row in the box
  westLine: string; // for the Western row
  overview: string; // the paragraph
  score: number; // 0-100
  label: MatchLabel;
  labelColor: string;
}

// ==================== Match Label Colors ====================

const MATCH_LABEL_COLORS: Record<MatchLabel, string> = {
  "Soulmate Match": "#FFD700",       // Gold
  "Twin Flame Match": "#FF8A00",     // AstroMatch orange
  "Excellent Match": "#FF4FA3",      // Hot pink
  "Favourable Match": "#4A90E2",     // Blue
  "Neutral Match": "#4CAF50",        // Green
  "Magnetic Opposites": "#E53935",   // Red
  "Difficult Match": "#7E57C2",      // Purple
};

// ==================== Pattern Mapping ====================

/**
 * Maps old ChinesePattern types to new ones
 */
function mapToNewPattern(oldPattern: ChinesePatternOld): ChinesePattern {
  switch (oldPattern) {
    case 'san_he':
      return 'san_he';
    case 'liu_he':
      return 'liu_he';
    case 'same_animal':
    case 'xing':
      return 'self_punishment';
    case 'same_trine':
      return 'san_he'; // Same trine is treated as san_he in the new system
    case 'liu_chong':
    case 'liu_chong_xing':
      return 'liu_chong';
    case 'liu_hai':
      return 'liu_hai';
    case 'po':
      return 'po';
    case 'neutral':
    default:
      return 'neutral';
  }
}

/**
 * Maps old WestRelation types to new ones
 */
function mapToNewWestRelation(oldRelation: WestRelationOld): WestRelation {
  switch (oldRelation) {
    case 'same_element':
      return 'same_element';
    case 'compatible_element':
      return 'compatible';
    case 'semi_compatible':
      return 'semi_compatible';
    case 'opposing':
      return 'opposites';
    default:
      return 'mismatch';
  }
}

// ==================== Helper Functions ====================

/**
 * Capitalizes first letter of a string
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converts lowercase animal name to capitalized format
 */
function normalizeAnimal(animal: string): ChineseAnimal {
  return capitalize(animal) as ChineseAnimal;
}

/**
 * Converts lowercase sign name to capitalized format
 */
function normalizeSign(sign: string): WesternSign {
  return capitalize(sign) as WesternSign;
}

// ==================== Pattern Label Mappings ====================

const PATTERN_LABELS: Record<ChinesePattern, { label: string; nameEn: string }> = {
  san_he: { label: "San He (三合)", nameEn: "Three Harmonies" },
  liu_he: { label: "Liu He (六合)", nameEn: "Six Harmonies / Secret Friends" },
  liu_chong: { label: "Liu Chong (六冲)", nameEn: "Opposition Pattern" },
  liu_hai: { label: "Liu Hai (六害)", nameEn: "Harm Pattern" },
  po: { label: "Po (破)", nameEn: "Break Pattern" },
  self_punishment: { label: "Xing (刑)", nameEn: "Punishment Pattern" },
  neutral: { label: "Neutral Pattern", nameEn: "Neutral" },
};

// ==================== Short Summary Generators ====================

function getChineseShortSummary(pattern: ChinesePattern, animalA: string, animalB: string): string {
  switch (pattern) {
    case 'san_he':
      return 'The bond feels smooth, cooperative, and inherently aligned — the kind of synergy that forms strong, lasting partnerships.';
    case 'liu_he':
      return 'The connection feels steady, warm, and intuitively cooperative.';
    case 'liu_chong':
      return 'This is one of the most dynamic patterns, full of movement, challenge, and intensity.';
    case 'liu_hai':
      return 'The bond can feel quiet, delicate, or gently destabilised.';
    case 'po':
      return 'The connection carries a sense of instability or quick-changing tone.';
    case 'self_punishment':
      return 'This bond can feel grounding, playful, or intensely reflective.';
    case 'neutral':
    default:
      return 'The energy feels flexible, unpressured, and open-ended.';
  }
}

function getWestShortSummary(relation: WestRelation, elementA: string, elementB: string): string {
  const elements = `${elementA} + ${elementB}`;
  
  switch (relation) {
    case 'same_element':
      if (elementA === 'Fire') return 'The connection feels fast-moving and intensely expressive, full of shared excitement and challenge.';
      if (elementA === 'Earth') return 'The connection feels stable, sincere, and quietly harmonious.';
      if (elementA === 'Air') return 'The energy feels light, clever, and effortlessly stimulating.';
      if (elementA === 'Water') return 'The dynamic feels intimate, reflective, and richly attuned.';
      return 'The connection feels naturally aligned and harmonious.';
    case 'compatible':
      if ((elementA === 'Fire' && elementB === 'Air') || (elementA === 'Air' && elementB === 'Fire')) {
        return 'The connection feels inspiring, adventurous, and forward-looking.';
      }
      if ((elementA === 'Water' && elementB === 'Earth') || (elementA === 'Earth' && elementB === 'Water')) {
        return 'The dynamic feels nurturing, stable, and deeply considerate.';
      }
      return 'The connection feels energising, forward-moving, and naturally inspiring.';
    case 'semi_compatible':
      if ((elementA === 'Fire' && elementB === 'Earth') || (elementA === 'Earth' && elementB === 'Fire')) {
        return 'The dynamic feels steady, strategic, and quietly progressive.';
      }
      if ((elementA === 'Air' && elementB === 'Water') || (elementA === 'Water' && elementB === 'Air')) {
        return 'The connection feels gentle, imaginative, and subtly textured.';
      }
      return 'The connection feels thoughtful, analytical, and gently contrasting.';
    case 'opposites':
      return 'The connection feels magnetic, expressive, and rich with mirrored growth.';
    case 'mismatch':
    default:
      return 'The connection feels atmospheric, delicate, and introspective.';
  }
}

// ==================== Trine Detection ====================

const TRINE_GROUPS: Record<string, ChineseAnimal[]> = {
  "Visionaries": ["Rat", "Dragon", "Monkey"],
  "Strategists": ["Ox", "Snake", "Rooster"],
  "Adventurers": ["Tiger", "Horse", "Dog"],
  "Artists": ["Rabbit", "Goat", "Pig"]
};

function areSameTrine(animalA: ChineseAnimal, animalB: ChineseAnimal): boolean {
  for (const group of Object.values(TRINE_GROUPS)) {
    if (group.includes(animalA) && group.includes(animalB)) {
      return true;
    }
  }
  return false;
}

function getTrineName(animal: ChineseAnimal): string | undefined {
  for (const [name, animals] of Object.entries(TRINE_GROUPS)) {
    if (animals.includes(animal)) {
      return name;
    }
  }
  return undefined;
}

// ==================== Main Implementation Functions ====================

/**
 * Gets Chinese pair info from animal pair
 */
export function getChinesePairInfo(
  animalA: ChineseAnimal,
  animalB: ChineseAnimal,
  oldPattern?: ChinesePatternOld,
  trineName?: string,
  sameTrine?: boolean
): ChinesePairInfo {
  const normalizedA = normalizeAnimal(animalA);
  const normalizedB = normalizeAnimal(animalB);
  const pattern = oldPattern ? mapToNewPattern(oldPattern) : 'neutral';
  
  const { label: patternLabelText, nameEn } = PATTERN_LABELS[pattern];
  
  // Build the label directly from animal names
  const pairLabel = `${normalizedA} × ${normalizedB}`;
  
  const shortSummary = getChineseShortSummary(pattern, normalizedA, normalizedB);
  
  const isSameTrine = sameTrine !== undefined ? sameTrine : areSameTrine(normalizedA, normalizedB);
  const isSameAnimal = normalizedA === normalizedB;
  
  return {
    animalA: normalizedA,
    animalB: normalizedB,
    label: pairLabel,
    pattern,
    patternLabel: patternLabelText,
    patternNameEn: nameEn,
    trineLabel: trineName || (isSameTrine ? getTrineName(normalizedA) : undefined),
    shortSummary,
    isSameTrine,
    isSameAnimal
  };
}

/**
 * Gets Western pair info from sign pair
 */
export function getWestPairInfo(
  signA: WesternSign,
  signB: WesternSign
): WestPairInfo {
  const normalizedA = normalizeSign(signA);
  const normalizedB = normalizeSign(signB);
  
  // Build the Western section to extract info
  const westernSection = buildWesternSection(normalizedA, normalizedB);
  
  const relation = mapToNewWestRelation(westernSection.relation);
  
  // Extract elements and build relation label
  const elementA = westernSection.elementA;
  const elementB = westernSection.elementB;
  const elementsLabel = `${elementA} + ${elementB}`;
  
  // Build relation label based on relation type
  let relationLabel: string;
  switch (relation) {
    case 'same_element':
      relationLabel = `Same Element (${elementsLabel})`;
      break;
    case 'compatible':
      relationLabel = `Compatible (${elementsLabel})`;
      break;
    case 'semi_compatible':
      relationLabel = `Semi-Compatible (${elementsLabel})`;
      break;
    case 'opposites':
      relationLabel = `Opposites (${elementsLabel})`;
      break;
    case 'mismatch':
    default:
      relationLabel = `Mismatch (${elementsLabel})`;
      break;
  }
  
  const shortSummary = getWestShortSummary(relation, elementA, elementB);
  
  return {
    signA: normalizedA,
    signB: normalizedB,
    label: `${normalizedA} × ${normalizedB}`,
    relation,
    relationLabel,
    elementsLabel,
    shortSummary
  };
}

// ==================== Formatting Functions ====================

export function formatChineseLine(info: ChinesePairInfo): string {
  // Examples:
  // "Monkey × Dragon — San He (三合) "Three Harmonies""
  // "Monkey × Tiger — Liu Chong (六冲) "Opposition Pattern""
  return `${info.label} — ${info.patternLabel} "${info.patternNameEn}"`;
}

export function formatWestLine(info: WestPairInfo): string {
  // Examples:
  // "Aquarius × Libra — Same Element (Air + Air)"
  // "Aquarius × Taurus — Mismatch (Air + Earth)"
  // "Aquarius × Leo — Opposites (Air + Fire)"
  return `${info.label} — ${info.relationLabel}`;
}

// ==================== Match Label Logic ====================

interface LabelContext {
  west: WestPairInfo;
  east: ChinesePairInfo;
  isSameWestSign: boolean;
}

function getMatchLabel(ctx: LabelContext): MatchLabel {
  const { west, east, isSameWestSign } = ctx;
  const { pattern, isSameAnimal } = east;
  const r = west.relation;

  // 1. Magnetic Opposites: all Liu Chong
  if (pattern === "liu_chong") {
    return "Magnetic Opposites";
  }

  // 2. Damage patterns default to Difficult (unless overridden)
  if (pattern === "liu_hai" || pattern === "po") {
    return "Difficult Match";
  }

  // 3. All neutral animal patterns → Neutral (you asked for this)
  if (pattern === "neutral" && !isSameAnimal) {
    return "Neutral Match";
  }

  // 4. Same-animal logic (not neutral pattern; self_punishment covers same sign)
  if (isSameAnimal && pattern !== "self_punishment") {
    if (r === "same_element" || r === "compatible") {
      return "Excellent Match";
    }
    return "Favourable Match";
  }

  // 5. San He (三合)
  if (pattern === "san_he") {
    if (!isSameAnimal && !isSameWestSign && r === "same_element") {
      return "Soulmate Match";
    }
    if (!isSameAnimal && !isSameWestSign && r === "compatible") {
      return "Twin Flame Match";
    }
    if (r === "semi_compatible") {
      return "Excellent Match";
    }
    // any other element mix
    return "Favourable Match";
  }

  // 6. Liu He (六合)
  if (pattern === "liu_he") {
    if (r === "same_element" || r === "compatible") {
      return "Excellent Match";
    }
    return "Favourable Match";
  }

  // 7. Self-punishment (same animal sign like Dog–Dog, Pig–Pig, etc.)
  if (pattern === "self_punishment") {
    if (r === "same_element" || r === "compatible") {
      return "Favourable Match";
    }
    if (r === "semi_compatible") {
      return "Neutral Match";
    }
    return "Difficult Match";
  }

  // 8. Fallback using West if we somehow get here
  if (r === "same_element" || r === "compatible") {
    return "Favourable Match";
  }
  if (r === "semi_compatible") {
    return "Neutral Match";
  }
  return "Neutral Match";
}

function enforceSameWestRule(label: MatchLabel, isSameWestSign: boolean): MatchLabel {
  if (!isSameWestSign) return label;

  // Same West → cannot be Soulmate / Twin Flame / Excellent
  if (
    label === "Soulmate Match" ||
    label === "Twin Flame Match" ||
    label === "Excellent Match"
  ) {
    return "Neutral Match";
  }

  return label;
}

// ==================== Score Calculation ====================

function chineseBaseScore(pattern: ChinesePattern, isSameAnimal: boolean): number {
  switch (pattern) {
    case "san_he":
      return 88; // will get pushed up by good West
    case "liu_he":
      return 80;
    case "self_punishment":
      return isSameAnimal ? 70 : 60;
    case "neutral":
      return 65;
    case "liu_hai":
      return 40;
    case "po":
      return 35;
    case "liu_chong":
      return 42;
    default:
      return 60;
  }
}

function westFactor(relation: WestRelation): number {
  switch (relation) {
    case "same_element":
      return 1.0;
    case "compatible":
      return 0.8;
    case "semi_compatible":
      return 0.55;
    case "opposites":
      return 0.45;
    case "mismatch":
      return 0.35;
    default:
      return 0.5;
  }
}

interface Band {
  min: number;
  max: number;
}

function bandForLabel(label: MatchLabel): Band {
  switch (label) {
    case "Soulmate Match":
      return { min: 90, max: 100 };
    case "Twin Flame Match":
      return { min: 84, max: 95 };
    case "Excellent Match":
      return { min: 76, max: 88 };
    case "Favourable Match":
      return { min: 62, max: 80 };
    case "Neutral Match":
      return { min: 40, max: 72 };
    case "Magnetic Opposites":
      return { min: 35, max: 55 };
    case "Difficult Match":
      return { min: 20, max: 50 };
  }
}

function computeScore(
  label: MatchLabel,
  pattern: ChinesePattern,
  relation: WestRelation,
  isSameAnimal: boolean
): number {
  const baseChinese = chineseBaseScore(pattern, isSameAnimal);
  const band = bandForLabel(label);
  const wf = westFactor(relation);

  // Interpolate inside the band using West factor,
  // but nudge toward Chinese base.
  const bandMid = (band.min + band.max) / 2;

  // 70% Chinese, 30% West within the label's band
  const chineseComponent = baseChinese;
  const westComponent = band.min + (band.max - band.min) * wf;

  let raw = 0.7 * chineseComponent + 0.3 * westComponent;

  // Clamp to band
  if (raw < band.min) raw = band.min;
  if (raw > band.max) raw = band.max;

  return Math.round(raw);
}

// ==================== Overview Text Builder ====================

function buildOverviewText(
  west: WestPairInfo,
  east: ChinesePairInfo
): string {
  const w = west.shortSummary.trim();
  const e = east.shortSummary.trim();

  switch (east.pattern) {
    case "san_he":
      return `${w} Beneath that, ${e}`;
    case "liu_he":
      return `${w} Underneath, ${e}`;
    case "neutral":
      return `${w} ${e}`;
    case "liu_chong":
      return `${w} At the same time, ${e}`;
    case "liu_hai":
      return `${w} In the background, ${e}`;
    case "po":
      return `${w} Behind the scenes, ${e}`;
    case "self_punishment":
      return `${w} Between you, ${e}`;
    default:
      return `${w} ${e}`;
  }
}

// ==================== Main Export Function ====================

export function buildConnectionOverview(
  westA: WesternSign,
  eastA: ChineseAnimal,
  westB: WesternSign,
  eastB: ChineseAnimal,
  oldPattern?: ChinesePatternOld,
  trineName?: string,
  sameTrine?: boolean
): ConnectionOverview {
  try {
    const westInfo = getWestPairInfo(westA, westB);
    const eastInfo = getChinesePairInfo(eastA, eastB, oldPattern, trineName, sameTrine);

    const isSameWestSign = westA === westB;

    // 1) Decide label from patterns
    let label = getMatchLabel({
      west: westInfo,
      east: eastInfo,
      isSameWestSign,
    });

    // 2) Enforce "same West = never top tiers"
    label = enforceSameWestRule(label, isSameWestSign);

    // 3) Compute score with 70/30 East–West logic
    const score = computeScore(
      label,
      eastInfo.pattern,
      westInfo.relation,
      eastInfo.isSameAnimal
    );

    const labelColor = MATCH_LABEL_COLORS[label];

    // 4) Build connection overview text
    const overview = buildOverviewText(westInfo, eastInfo);

    // 5) Chinese + West lines for the box
    const chineseLine = formatChineseLine(eastInfo);
    const westLine = formatWestLine(westInfo);

    return {
      chineseLine,
      westLine,
      overview,
      score,
      label,
      labelColor,
    };
  } catch (error) {
    console.error('[connectionOverview] Error building overview:', error);
    // Return fallback overview
    return {
      chineseLine: `${eastA} × ${eastB}`,
      westLine: `${westA} × ${westB}`,
      overview: '',
      score: 50,
      label: 'Neutral Match',
      labelColor: MATCH_LABEL_COLORS['Neutral Match'],
    };
  }
}
