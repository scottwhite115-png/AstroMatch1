import { Element, Gender, Rank, TrineId, UserAstro, ConnectionBox, UserProfile, WesternPairInfo, PatternMeta, SimpleConnectionBox, ConnectionBoxTop, Animal, type WestSign as WestSignType } from "./types";
import trineInfo from "./trine.json";
import elementsInfo from "./elements.json";
import fusion from "./fusion.json";
import { TIER_LABEL, type Tier } from "@/engine/labels";
import { westernPairs, chinesePairs, patterns, sunSignLabel, animalMeta } from "./lookups";
import { computeMatchWithClassifier } from "@/lib/classifierAdapter";
import type { West, East } from "@/engine/astromatch-engine";
import { NEUTRAL_CHINESE_MATCHES } from "@/lib/chinesePatternSystem";
import { buildWesternSection, getWesternPatternLines } from "./westernElements";
import { buildChineseSection as buildChineseSectionNew, getChinesePatternLines, type ChinesePattern as ChinesePatternNew, type ChinesePatternKey, type TrineName as TrineNameNew } from "./chinesePatterns";
import { buildConnectionOverview as buildConnectionOverviewNew } from "./connectionOverview";
import { generateConnectionOverview, type MatchLabel as NewMatchLabel } from "@/lib/connectionOverview";
import { deriveConnectionOverview } from "@/lib/patternOneLiner";
import { buildConnectionLines, type ConnectionContext, type Element as WesternElement, type WuXing, type ChinesePattern as ConnectionChinesePattern, type WestAspect } from "@/lib/connectionText";
import { evaluateMatch as evaluateMatchNew, matchLabelText, type MatchContext as NewMatchContext, type ElementPair, type WuXingRelation, type ChinesePattern as NewChinesePattern, type WestAspect as NewWestAspect } from "@/data/matchLabels";
// New match engine imports
import { 
  computeMatchScore as computeNewMatchScore, 
  buildMatchContext as buildNewMatchContext,
  type MatchContext as NewMatchEngineContext,
  type MatchTier,
  getWuXingYearElement
} from "@/lib/matchEngine";
import {
  getWestAspect,
  getWestElementRelation,
  getChinesePatternCode,
  isChineseOppositePair,
  isLivelyPair,
} from "@/lib/matchEngineHelpers";
// NEW: Import simplified match engine core
import { 
  computeMatchResult,
  ChinesePattern as NewChinesePattern,
  WestHarmony,
} from "@/lib/astrology/matchEngineCore";
import {
  mapOldPatternToNew,
  classifyWestHarmony,
  getWesternElement,
  getElementRelation,
  getAspectRelation,
  type OldElementRelation,
  type OldAspectRelation,
} from "@/lib/astrology/matchEngineAdapter";
// Import new match engine functions for labels and blurbs
import {
  getMatchLabel,
  getConnectionBlurb,
  deriveArchetype,
  applySameSignCap,
  deriveWesternEase,
  type ChineseBasePattern,
  type ChineseOverlayPattern,
  type WesternEase,
  type WesternElementRelation,
  type ConnectionArchetype,
} from "@/lib/connectionUi";
import { 
  buildCardOverlay, 
  attachCardOverlay,
  type CardOverlay,
  type ChineseAnimal as CardChineseAnimal,
  type WesternElementRelation as CardWesternElementRelation,
  type WestOpposition as CardWestOpposition
} from "@/lib/cardOverlay";

// Chinese animal type used in AstroMatch
export type ChineseAnimal =
  | 'rat'
  | 'ox'
  | 'tiger'
  | 'rabbit'
  | 'dragon'
  | 'snake'
  | 'horse'
  | 'goat'
  | 'monkey'
  | 'rooster'
  | 'dog'
  | 'pig';

/** WEST → element */
export const westElement: Record<string, Element> = {
  aries:"fire", leo:"fire", sagittarius:"fire",
  taurus:"earth", virgo:"earth", capricorn:"earth",
  gemini:"air", libra:"air", aquarius:"air",
  cancer:"water", scorpio:"water", pisces:"water"
};

/** EAST → trine id */
export const eastTrine: Record<string, TrineId> = {
  rat:1, dragon:1, monkey:1,
  ox:2, snake:2, rooster:2,
  tiger:3, horse:3, dog:3,
  rabbit:4, goat:4, pig:4
};

/** Natural enemy pairs (sorted key a-b) */
const eastEnemies = new Set([
  "rat-horse","ox-goat","tiger-monkey",
  "rabbit-rooster","dragon-dog","snake-pig"
]);
const isEnemy = (a: string, b: string) => eastEnemies.has([a,b].sort().join("-"));

/** Element relations */
const same = (a: Element, b: Element) => a === b;
const compatible = (a: Element, b: Element) =>
  (a==="fire" && b==="air") || (a==="air" && b==="fire") ||
  (a==="earth" && b==="water") || (a==="water" && b==="earth");
const semi = (a: Element, b: Element) =>
  (a==="fire" && b==="earth") || (a==="earth" && b==="fire") ||
  (a==="air" && b==="water") || (a==="water" && b==="air");

/** Rating to Tier mapping */
const ratingToTier: Record<Rank, Tier> = {
  5: "Soulmate",
  4: "Excellent",
  3: "Favourable",
  2: "Neutral",
  1: "Difficult",
};

/** Core rank logic (East-led, West-flavoured) */
export function getRank(a: UserAstro, b: UserAstro): Rank {
  if (isEnemy(a.east_sign, b.east_sign)) return 1;

  const sameTrine = a.trine === b.trine;
  const eA = a.element, eB = b.element;

  if (sameTrine && (same(eA,eB) || compatible(eA,eB))) return 5;
  if (sameTrine) return 4;

  if (same(eA,eB) || compatible(eA,eB)) return 3;
  if (semi(eA,eB)) return 2;

  return 1;
}

/** ---------------- Formatting helpers ---------------- */
function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
function labelGender(g?: Gender) {
  if (!g || g === "unspecified") return "";
  if (g === "male") return " (Male)";
  if (g === "female") return " (Female)";
  return " (They)";
}
function eastPair(viewer: UserAstro, other: UserAstro) {
  const L = `${cap(viewer.east_sign)}${labelGender(viewer.gender)}`;
  const R = `${cap(other.east_sign)}${labelGender(other.gender)}`;
  return `${L} × ${R}`;
}
function westPair(viewer: UserAstro, other: UserAstro) {
  return `${cap(viewer.west_sign)} × ${cap(other.west_sign)}`;
}
function trineThemeName(t: TrineId) {
  return (t === 1 ? "Visionaries" : t === 2 ? "Strategists" : t === 3 ? "Adventurers" : "Artists");
}
function elementKey(a: Element, b: Element) {
  return [a, b].sort().join("-") as keyof typeof elementsInfo.blurbs;
}

/** ---------------- Build Connection Box (+ dropdown) ---------------- */
/** 
 * Legacy function - builds ConnectionBox from UserAstro objects.
 * For new code, use buildSimpleConnectionBox with UserProfile instead.
 */
export function buildConnectionBoxFromAstro(viewer: UserAstro, other: UserAstro): ConnectionBox {
  const rating = getRank(viewer, other);
  const tier = ratingToTier[rating];
  const label = TIER_LABEL[tier];
  const fusionLine = fusion[String(rating) as keyof typeof fusion];

  // CHINESE
  const sameTr = viewer.trine === other.trine;
  const enemies = isEnemy(viewer.east_sign, other.east_sign);

  let chineseRelation: "Same Trine" | "Cross-Trine" | "Natural Enemies" =
    enemies ? "Natural Enemies" : (sameTr ? "Same Trine" : "Cross-Trine");

  let theme: string | undefined;
  let ch_summary_line = "";
  let ch_expanded = "";
  let ch_love = "";
  let ch_watch = "";

  if (enemies) {
    theme = undefined;
    ch_summary_line = (trineInfo.enemies.summary_line);
    ch_expanded = (trineInfo.enemies.expanded);
    ch_love = trineInfo.enemies.love;
    ch_watch = trineInfo.enemies.watch;
  } else if (sameTr) {
    const key = String(viewer.trine) as "1" | "2" | "3" | "4";
    theme = trineInfo[key].theme;
    ch_summary_line = trineInfo[key].summary_line;
    ch_expanded = trineInfo[key].expanded;
    ch_love = trineInfo[key].love;
    ch_watch = trineInfo[key].watch;
  } else {
    theme = undefined;
    ch_summary_line = trineInfo.cross.summary_line;
    ch_expanded = trineInfo.cross.expanded;
    ch_love = trineInfo.cross.love;
    ch_watch = trineInfo.cross.watch;
  }

  const chineseHeading = `${eastPair(viewer, other)} — ${chineseRelation}${theme ? `: ${theme}` : ""}`;

  // WESTERN
  const eKey = elementKey(viewer.element, other.element);
  const eInfo = elementsInfo.blurbs[eKey];
  const westernHeading = `${westPair(viewer, other)} — ${eInfo.relation}: ${eInfo.label}`;
  const w_summary_line = eInfo.summary_line;
  const w_expanded = eInfo.expanded;

  const box: ConnectionBox = {
    rating,
    label,
    fusion: fusionLine,
    tier,

    summary: {
      chinese_heading: chineseHeading,
      chinese_line: ch_summary_line,
      western_heading: westernHeading,
      western_line: w_summary_line
    },

    dropdown: {
      chinese: {
        heading: chineseHeading,
        expanded: ch_expanded,
        love_tip: ch_love,
        watch_tip: ch_watch
      },
      western: {
        heading: westernHeading,
        expanded: w_expanded,
        nurture_tip: eInfo.nurture,
        caution_tip: eInfo.caution
      }
    }
  };

  return box;
}

/** Derivers for signup/backfill */
export function deriveElement(west_sign: string): Element {
  return (westElement as any)[west_sign.toLowerCase()];
}
export function deriveTrine(east_sign: string): TrineId {
  return (eastTrine as any)[east_sign.toLowerCase()];
}

/** ---------------- Match Score Computation ---------------- */
/**
 * Computes a compatibility match score (0-100) based on user profiles,
 * Western zodiac pair information, and Chinese pattern metadata.
 * 
 * @param userA - First user's profile with sunSign and animal
 * @param userB - Second user's profile with sunSign and animal
 * @param western - Western zodiac pair information
 * @param pattern - Chinese zodiac pattern metadata
 * @returns Match score from 0-100
 */
/**
 * Computes match score using the old classifier engine
 * This uses the previous match engine % scores
 */
// Types for pattern adjustment logic from ChatGPT
export type ChinesePattern =
  | 'san_he'
  | 'liu_he'
  | 'same_animal'
  | 'same_trine'
  | 'liu_chong'
  | 'liu_chong_xing' // Liu Chong + Xing combo
  | 'liu_hai'
  | 'xing'
  | 'po'
  | 'neutral';

export type TrineName = 'Visionaries 水三会' | 'Strategists 金三会' | 'Adventurers 木三会' | 'Artists 土三会';

/**
 * Checks if two Chinese animals form a neutral match (no major pattern)
 * Uses the NEUTRAL_CHINESE_MATCHES mapping
 */
export function isNeutralChinesePair(a: ChineseAnimal, b: ChineseAnimal): boolean {
  if (a === b) return false; // same-sign handled elsewhere
  return NEUTRAL_CHINESE_MATCHES[a]?.includes(b) ?? false;
}

export type WestRelation =
  | 'same_sign'
  | 'same_element'
  | 'compatible_element'
  | 'semi_compatible'
  | 'opposing';

type Label =
  | 'Soulmate Match'
  | 'Twin Flame Match'
  | 'Excellent Match'
  | 'Favourable Match'
  | 'Neutral Match'
  | 'Six Conflicts'
  | 'Difficult Match';

interface MatchResult {
  score: number;
  label: Label;
}

export interface ChinesePatternResult {
  primary: ChinesePattern;     // For scoring
  all: ChinesePattern[];       // For UI connection box display
}

// -------------------------------
// Config: 70% East / 30% West
// -------------------------------

const EAST_FACTOR: Record<ChinesePattern, number> = {
  san_he:      0.97,
  liu_he:      0.88,
  same_animal: 0.86,
  same_trine:  0.84,
  neutral:     0.62,
  liu_chong:   0.45,
  xing:        0.40,
  liu_hai:     0.43,
  po:          0.30,
};

const WEST_FACTOR: Record<WestRelation, number> = {
  same_sign:          1.0,
  same_element:       0.9,
  compatible_element: 0.85,
  semi_compatible:    0.7,
  opposing:           0.55,
};

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

// -------------------------------
// Base label from score (before overrides)
// -------------------------------

export function baseLabelFromScore(score: number): Label {
  if (score >= 95) return 'Soulmate Match';
  if (score >= 85) return 'Twin Flame Match';
  if (score >= 75) return 'Excellent Match';
  if (score >= 60) return 'Favourable Match';
  if (score >= 50) return 'Neutral Match';
  if (score >= 35) return 'Six Conflicts';
  return 'Difficult Match';
}

// -------------------------------
// Base score from factors (70/30)
// -------------------------------

export function computeBaseScore(
  chinesePattern: ChinesePattern,
  westRelation: WestRelation
): number {
  const e = EAST_FACTOR[chinesePattern];
  const w = WEST_FACTOR[westRelation];
  const raw = 100 * (0.7 * e + 0.3 * w);
  return clamp(Math.round(raw), 0, 100);
}

// -------------------------------
// Adjusted score & label
// -------------------------------

export function computeMatch(
  chinesePattern: ChinesePattern,
  westRelation: WestRelation
): MatchResult {
  let score = computeBaseScore(chinesePattern, westRelation);
  let label = baseLabelFromScore(score);

  // Apply penalty multiplier for same Western sign (reduces mirror effect)
  if (westRelation === 'same_sign') {
    score = Math.round(score * 0.855); // ~14.5% reduction for same sign combinations
  }

  const isHarmony = ['san_he','liu_he','same_animal','same_trine'].includes(chinesePattern);
  const isTension = ['liu_chong','liu_hai','xing','po'].includes(chinesePattern);

  // A. Neutral animals: always Neutral label (50–59)
  if (chinesePattern === 'neutral') {
    label = 'Neutral Match';
    score = clamp(score, 50, 59);
    return { score, label };
  }

  // B. Harmony patterns

  if (chinesePattern === 'san_he') {
    if (score < 80) score = 80;

    const strongWest =
      westRelation === 'same_element' ||
      westRelation === 'compatible_element';

    if (strongWest && westRelation !== 'same_sign') {
      if (score < 88) score = 88;
      label = score >= 95 ? 'Soulmate Match' : 'Twin Flame Match';
    } else {
      // semi / opposing West
      if (score < 75) score = 75;
      if (label === 'Favourable Match' || label === 'Neutral Match') {
        label = 'Excellent Match';
      }
    }
  }

  if (chinesePattern === 'liu_he') {
    if (score < 70) score = 70;
    const strongWest =
      westRelation === 'same_element' ||
      westRelation === 'compatible_element';

    if (strongWest && westRelation !== 'same_sign') {
      if (score < 75) score = 75;
      if (label === 'Favourable Match' || label === 'Neutral Match') {
        label = 'Excellent Match';
      }
    } else {
      // semi / opposing
      if (score < 60) score = 60;
      if (label === 'Neutral Match') label = 'Favourable Match';
    }
  }

  if (chinesePattern === 'same_animal' || chinesePattern === 'same_trine') {
    const strongWest =
      westRelation === 'same_element' ||
      westRelation === 'compatible_element';

    if (strongWest && westRelation !== 'same_sign') {
      if (score < 75) score = 75;
      if (
        label === 'Favourable Match' ||
        label === 'Neutral Match' ||
        label === 'Six Conflicts' ||
        label === 'Difficult Match'
      ) {
        label = 'Excellent Match';
      }
    } else {
      // semi / opposing elements
      if (score < 60) score = 60;
      if (label === 'Neutral Match') label = 'Favourable Match';
    }
  }

  // C. Tension / damage patterns

  if (chinesePattern === 'liu_chong') {
    // Always Six Conflicts
    score = clamp(score, 35, 49);
    label = 'Six Conflicts';
  }

  if (chinesePattern === 'xing') {
    // Punishment: Difficult tier
    if (score > 45) score = 45;
    label = 'Difficult Match';
  }

  if (chinesePattern === 'liu_hai') {
    if (score > 45) score = 45;
    label = 'Difficult Match';
  }

  if (chinesePattern === 'po') {
    if (score > 40) score = 40;
    label = 'Difficult Match';
  }

  // D. Same West sign global cap

  if (westRelation === 'same_sign') {
    if (isTension) {
      // same sign + bad East → Difficult/Magnetic, never Favourable+
      if (score > 49) score = 49;
      if (label === 'Favourable Match' || label === 'Neutral Match') {
        label = chinesePattern === 'liu_chong'
          ? 'Six Conflicts'
          : 'Difficult Match';
      }
    } else if (isHarmony) {
      // same sign + good East → Favourable only
      if (score < 60) score = 60;
      if (score > 74) score = 74;
      label = 'Favourable Match';
    } else {
      // (shouldn't occur, neutral already returned above)
      label = 'Neutral Match';
      score = clamp(score, 50, 59);
    }
  }

  score = clamp(score, 0, 100);
  return { score, label };
}

// -------------------------------
// Chinese Pattern Section Builder
// -------------------------------

// Re-export types from chinesePatterns for convenience
export type { ChinesePattern as ChinesePatternType, TrineName } from "./chinesePatterns";

// Keep old patternBody for backward compatibility in other parts of the code
function patternBody(pattern: ChinesePattern): { line2: string; line3: string } {
  // Use the new buildChineseSection to get the structure, then extract line2 and line3
  // This is a compatibility wrapper
  const section = buildChineseSectionNew({
    animalA: "A",
    animalB: "B",
    pattern: pattern as ChinesePatternNew,
  });
  return {
    line2: section.line2,
    line3: section.line3
  };
}

// Use the new buildChineseSection from chinesePatterns.ts
export { buildChineseSection } from "./chinesePatterns";

// -------------------------------
// Connection Overview Builder
// -------------------------------

function firstSentence(text: string): string {
  if (!text) return '';

  const trimmed = text.trim();
  const parts = trimmed.split(/(?<=[.!?])\s+/);
  return parts[0] ?? trimmed;
}

function patternSummarySentence(pattern: ChinesePattern, animalA?: string, animalB?: string): string {
  switch (pattern) {
    case 'san_he':
      return 'Chinese-wise, this is a San He (三合) match, so there is strong built-in harmony supporting long-term closeness.';
    case 'liu_he':
      return 'In Chinese astrology this is a Liu He (六合) "secret friend" bond, giving a quietly supportive, cooperative foundation.';
    case 'same_trine':
      return 'You share the same trine (三会), so your basic temperament and life pace are naturally compatible.';
    case 'same_animal':
      return "Sharing the same animal sign brings strong familiarity — you understand each other easily but can also mirror each other's flaws.";
    case 'liu_chong':
      const animals = animalA && animalB ? `${animalA} × ${animalB}` : 'Monkey × Tiger';
      return `${animals} style Liu Chong (六冲) oppositions bring real spark and real friction — this is a classic "magnetic but tense" dynamic.`;
    case 'liu_chong_xing':
      return 'This pairing combines Liu Chong (六冲) opposition with Xing (刑) punishment, creating intense chemistry wrapped in sharp contrast.';
    case 'xing':
      return 'The Xing (刑) pattern adds emotional pressure and lessons through conflict, so handling tension with maturity is essential.';
    case 'liu_hai':
      return 'Liu Hai (六害) can feel like a slow drain; without awareness, small hurts and misunderstandings tend to accumulate over time.';
    case 'po':
      return 'Po (破) brings an unstable, stop–start rhythm, so consistency and reassurance matter more than usual here.';
    case 'neutral':
    default:
      return 'There is no strong karmic Chinese pattern here, so the quality of this bond depends more on individual maturity than fate.';
  }
}

export function buildConnectionOverview(params: {
  westBlurb: string;
  eastBlurb: string;
  pattern: ChinesePattern;
  animalA?: string;
  animalB?: string;
}): string {
  const westIntro = firstSentence(params.westBlurb);
  const eastIntro = firstSentence(params.eastBlurb);
  const patternLine = patternSummarySentence(params.pattern, params.animalA, params.animalB);

  // Compact 2–3 sentence style, similar to your Aquarius Monkey × Pisces Goat example
  return [
    westIntro,
    eastIntro,
    patternLine
  ]
    .filter(Boolean)
    .join(' ');
}

export function buildConnectionOverviewV2(params: {
  westTheme: string;       // e.g., "mind meets emotion", "fire fuels air", "earth steadies water"
  westDynamics: string;    // e.g., "Aquarius brings clarity while Pisces brings empathy"
  eastDynamics: string;    // e.g., "Monkey excites Goat while Goat calms Monkey"
  chinesePattern: ChinesePattern;
}): string {
  // 1) Western dynamic sentence
  const westLine = `${params.westDynamics}.`.trim();

  // 2) East–West blend sentence
  const blendLine = `${params.eastDynamics}.`.trim();

  // 3) Chinese pattern interpretation
  let patternLine = '';
  switch (params.chinesePattern) {
    case 'san_he':
      patternLine = "This pairing sits under the San He (三合) \"Three Harmonies\" pattern, giving it natural cooperation, shared rhythm, and long-term stability.";
      break;
    case 'liu_he':
      patternLine = "In Chinese astrology, this is a Liu He (六合) secret-friend bond, offering support, loyalty, and emotional safety beneath the surface.";
      break;
    case 'same_trine':
      patternLine = "You share the same trine (三会), meaning your rhythms and temperament align in a naturally supportive way.";
      break;
    case 'same_animal':
      patternLine = "Sharing the same animal sign creates familiarity — you intuit each other's needs easily, but can mirror each other's challenges.";
      break;
    case 'liu_chong':
      patternLine = "This pairing carries Liu Chong (六冲) opposing energy, giving strong attraction mixed with friction that must be handled consciously.";
      break;
    case 'liu_chong_xing':
      patternLine = "This pairing combines Liu Chong (六冲) opposition with Xing (刑) punishment, creating intense chemistry wrapped in sharp contrast.";
      break;
    case 'xing':
      patternLine = "The Xing (刑) punishment pattern adds emotional pressure, requiring gentleness and patience to prevent misunderstandings.";
      break;
    case 'liu_hai':
      patternLine = "Liu Hai (六害) brings a subtle drain and misunderstandings that need clarity and steady communication to manage.";
      break;
    case 'po':
      patternLine = "The Po (破) break pattern adds instability, making consistency and reassurance especially important.";
      break;
    case 'neutral':
    default:
      patternLine = "There is no strong karmic pattern in Chinese astrology here, so the connection depends more on communication and emotional maturity than fate.";
      break;
  }

  // 4) Final growth line
  const growthLine = "This connection grows best when both people slow down enough to listen, stay emotionally present, and meet each other's needs with steadiness.";

  return [westLine, blendLine, patternLine, growthLine]
    .filter(Boolean)
    .join(' ');
}

// -------------------------------
// Chinese pattern resolver
// -------------------------------

// San He 三合 trines (4 groups of 3)
const SAN_HE_TRINES: ChineseAnimal[][] = [
  ['rat', 'dragon', 'monkey'],      // Visionaries
  ['ox', 'snake', 'rooster'],       // Strategists
  ['tiger', 'horse', 'dog'],        // Adventurers
  ['rabbit', 'goat', 'pig'],        // Artists
];

// Liu He 六合 (modern Six Harmonies / secret friends)
const LIU_HE_PAIRS: [ChineseAnimal, ChineseAnimal][] = [
  ['rat', 'ox'],
  ['tiger', 'pig'],
  ['rabbit', 'dog'],
  ['dragon', 'rooster'],
  ['snake', 'monkey'],
  ['horse', 'goat'],
];

// Liu Chong 六冲 (Six Conflicts / Offending groups)
const LIU_CHONG_PAIRS: [ChineseAnimal, ChineseAnimal][] = [
  ['rat', 'horse'],
  ['ox', 'goat'],
  ['tiger', 'monkey'],
  ['rabbit', 'rooster'],
  ['dragon', 'dog'],
  ['snake', 'pig'],
];

// Liu Hai 六害 (Six Harms)
const LIU_HAI_PAIRS: [ChineseAnimal, ChineseAnimal][] = [
  ['rat', 'goat'],
  ['ox', 'horse'],
  ['tiger', 'snake'],
  ['rabbit', 'dragon'],
  ['monkey', 'pig'], // Monkey × Pig is Liu Hai (Six Harms)
  ['rooster', 'dog'],
];

// Punishment groups 相刑 (Xing)
// From the 3 punishment clusters: (Rat–Rabbit), (Tiger–Snake–Monkey), (Goat–Ox–Dog)
const XING_PAIRS: [ChineseAnimal, ChineseAnimal][] = [
  ['rat', 'rabbit'],
  ['tiger', 'snake'],
  ['tiger', 'monkey'],
  ['snake', 'monkey'],
  ['goat', 'ox'],
  ['goat', 'dog'],
  ['ox', 'dog'],
];

// Po 破 — "Break" (classical)
// Note: Monkey × Pig is Liu Hai (Six Harms), not Po
const PO_PAIRS: [ChineseAnimal, ChineseAnimal][] = [
  // Po pairs go here if any are identified classically
];

// Helper: test if a pair is in a list (order-insensitive)
const isPairInList = (
  a: ChineseAnimal,
  b: ChineseAnimal,
  list: [ChineseAnimal, ChineseAnimal][]
): boolean =>
  list.some(
    ([x, y]) =>
      (x === a && y === b) ||
      (x === b && y === a),
  );

// Helper: same trine group?
const areInSameTrine = (a: ChineseAnimal, b: ChineseAnimal): boolean =>
  SAN_HE_TRINES.some(
    group => group.includes(a) && group.includes(b)
  );

/**
 * Resolves all Chinese patterns for a pair of animals
 * Returns primary pattern (for scoring) and all patterns (for UI display)
 * Some pairs can have multiple patterns (e.g., Tiger-Snake is both Liu Hai and Xing)
 */
export function getChinesePatternResult(
  a: ChineseAnimal,
  b: ChineseAnimal,
): ChinesePatternResult {
  const all: ChinesePattern[] = [];

  if (a === b) {
    return { primary: 'same_animal', all: ['same_animal'] };
  }

  // Check all patterns (in priority order for primary, but collect all)
  if (areInSameTrine(a, b)) {
    all.push('san_he');
  }

  if (isPairInList(a, b, LIU_HE_PAIRS)) {
    all.push('liu_he');
  }

  if (isPairInList(a, b, PO_PAIRS)) {
    all.push('po');
  }

  if (isPairInList(a, b, LIU_CHONG_PAIRS)) {
    all.push('liu_chong');
  }

  if (isPairInList(a, b, LIU_HAI_PAIRS)) {
    all.push('liu_hai');
  }

  if (isPairInList(a, b, XING_PAIRS)) {
    all.push('xing');
  }

  // Determine primary pattern (first one in priority order, or neutral)
  const primary: ChinesePattern = 
    all.length > 0 ? all[0] : 'neutral';

  return { primary, all: all.length > 0 ? all : ['neutral'] };
}

/**
 * Resolves Chinese pattern directly from two animals
 * Uses systematic pattern detection with priority order
 * Returns only the primary pattern (for backward compatibility)
 */
export function getChinesePattern(
  a: ChineseAnimal,
  b: ChineseAnimal,
): ChinesePattern {
  return getChinesePatternResult(a, b).primary;
}

/**
 * Maps pattern key to ChinesePattern type
 * Uses direct pattern resolver when user profiles are available, otherwise falls back to lookup
 */
function mapToChinesePattern(patternKey: string, userA?: UserProfile, userB?: UserProfile): ChinesePattern {
  // Use direct pattern resolver if we have user profiles
  if (userA && userB) {
    const animalA = userA.animal.toLowerCase() as ChineseAnimal;
    const animalB = userB.animal.toLowerCase() as ChineseAnimal;
    return getChinesePattern(animalA, animalB);
  }
  
  // Fallback to lookup table mapping
  const mapping: Record<string, ChinesePattern> = {
    'san_he': 'san_he',
    'liu_he': 'liu_he',
    'liu_chong': 'liu_chong',
    'liu_hai': 'liu_hai',
    'xing': 'xing',
    'po': 'po',
    'friendly': 'neutral',
  };
  return mapping[patternKey] || 'neutral';
}

// -------------------------------
// Western relation resolver
// -------------------------------

const WEST_SIGNS_ORDER: WestSignType[] = [
  'aries',
  'taurus',
  'gemini',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'scorpio',
  'sagittarius',
  'capricorn',
  'aquarius',
  'pisces',
];

const SIGN_ELEMENT: Record<WestSignType, Element> = {
  aries: 'fire',
  leo: 'fire',
  sagittarius: 'fire',
  taurus: 'earth',
  virgo: 'earth',
  capricorn: 'earth',
  gemini: 'air',
  libra: 'air',
  aquarius: 'air',
  cancer: 'water',
  scorpio: 'water',
  pisces: 'water',
};

const OPPOSITE_AXES: [WestSignType, WestSignType][] = [
  ['aries', 'libra'],
  ['taurus', 'scorpio'],
  ['gemini', 'sagittarius'],
  ['cancer', 'capricorn'],
  ['leo', 'aquarius'],
  ['virgo', 'pisces'],
];

const isOppositeAxis = (a: WestSignType, b: WestSignType): boolean =>
  OPPOSITE_AXES.some(
    ([x, y]) =>
      (x === a && y === b) ||
      (x === b && y === a),
  );

const areCompatibleElements = (e1: Element, e2: Element): boolean => {
  return (
    (e1 === 'fire' && e2 === 'air') ||
    (e1 === 'air' && e2 === 'fire') ||
    (e1 === 'earth' && e2 === 'water') ||
    (e1 === 'water' && e2 === 'earth')
  );
};

/**
 * Resolves Western relation directly from two signs
 * Uses systematic relation detection with priority order
 */
export function getWestRelation(
  a: WestSignType,
  b: WestSignType,
): WestRelation {
  if (a === b) return 'same_sign';

  const eA = SIGN_ELEMENT[a];
  const eB = SIGN_ELEMENT[b];

  if (eA === eB) return 'same_element';
  if (areCompatibleElements(eA, eB)) return 'compatible_element';

  // Check opposition (Aries–Libra, Taurus–Scorpio, etc.)
  if (isOppositeAxis(a, b)) return 'opposing';

  // Use basic zodiac order to detect squares as "opposing" (challenging relationships)
  const idxA = WEST_SIGNS_ORDER.indexOf(a);
  const idxB = WEST_SIGNS_ORDER.indexOf(b);
  const diff = Math.abs(idxA - idxB);
  const wrappedDiff = Math.min(diff, 12 - diff);

  if (wrappedDiff === 3 || wrappedDiff === 9) {
    // squares: Aries–Cancer, Aries–Capricorn, etc.
    return 'opposing';
  }

  // Everything else sits in the middling range
  return 'semi_compatible';
}

/**
 * Maps western relation key to WestRelation type
 * Uses direct relation resolver when user profiles are available, otherwise falls back to lookup
 */
function mapToWestRelation(relationKey: string, userA: UserProfile, userB: UserProfile): WestRelation {
  // Use direct relation resolver if we have user profiles
  if (userA && userB) {
    const signA = userA.sunSign.toLowerCase() as WestSignType;
    const signB = userB.sunSign.toLowerCase() as WestSignType;
    return getWestRelation(signA, signB);
  }
  
  // Fallback to lookup table mapping
  const mapping: Record<string, WestRelation> = {
    'same_element': 'same_element',
    'compatible': 'compatible_element',
    'semi_compatible': 'semi_compatible',
    'challenging': 'opposing',
    'opposites': 'opposing',
    'opposite_axis': 'opposing',
    'mismatch': 'semi_compatible',
    'neutral': 'semi_compatible',
  };
  return mapping[relationKey] || 'semi_compatible';
}

/**
 * Maps label string to Label type
 * Note: Good Friends labels are now mapped to Neutral Match
 */
function mapToLabel(labelString: string): Label {
  const mapping: Record<string, Label> = {
    'Soulmate Match': 'Soulmate Match',
    'Twin Flame Match': 'Twin Flame Match',
    'Excellent Match': 'Excellent Match',
    'Very Good Match': 'Excellent Match',
    'Favourable Match': 'Favourable Match',
    'Good Friends': 'Neutral Match',
    'Good Friends Match': 'Neutral Match',
    'Sparky Friends': 'Neutral Match',
    'Neutral Match': 'Neutral Match',
    'Opposites Attract': 'Six Conflicts',
    'Six Conflicts': 'Six Conflicts',
    'Difficult Match': 'Difficult Match',
    'Challenging Match': 'Difficult Match',
  };
  return mapping[labelString] || 'Neutral Match';
}

export function computeMatchScore(
  userA: UserProfile,
  userB: UserProfile,
  western: WesternPairInfo,
  pattern: PatternMeta
): number {
  // Safety check for pattern
  if (!pattern || !pattern.key) {
    console.error('[computeMatchScore] Pattern is undefined or missing key:', pattern);
    return 50; // Return neutral score as fallback
  }
  
  // Use new 70/30 scoring system
  const chinesePattern = mapToChinesePattern(pattern.key, userA, userB);
  const westRelation = mapToWestRelation(western?.relationKey || 'semi_compatible', userA, userB);
  
  // Compute match score and label using 70% East / 30% West weighting
  const adjusted = computeMatch(chinesePattern, westRelation);
  
  return adjusted.score;
}

/**
 * Generates a match label using the old classifier engine with pattern adjustments
 * Returns: Soulmate Match, Twin Flame Match, Excellent Match, Neutral Match, Six Conflicts, or Difficult Match
 * Note: Good Friends label has been removed and now maps to Neutral Match
 */
export function labelFromScore(score: number, userA?: UserProfile, userB?: UserProfile, western?: WesternPairInfo, pattern?: PatternMeta): string {
  // If we have user profiles, use the classifier for accurate label with pattern adjustments
  if (userA && userB && western && pattern) {
    const userWest = sunSignLabel[userA.sunSign] as West;
    const userEast = animalMeta[userA.animal].label_en as East;
    const profileWest = sunSignLabel[userB.sunSign] as West;
    const profileEast = animalMeta[userB.animal].label_en as East;
    
    const classifierResult = computeMatchWithClassifier(
      userWest,
      userEast,
      profileWest,
      profileEast
    );
    
    // Use new 70/30 scoring system
    const chinesePattern = mapToChinesePattern(pattern.key, userA, userB);
    const westRelation = mapToWestRelation(western.relationKey, userA, userB);
    
    // Compute base score using 70% East / 30% West weighting
    // Compute match score and label using 70% East / 30% West weighting
    const adjusted = computeMatch(chinesePattern, westRelation);
    
    // Map adjusted label back to display format
    const labelMap: Record<string, string> = {
      "Soulmate Match": "Soulmate Match",
      "Twin Flame Match": "Twin Flame Match",
      "Excellent Match": "Excellent Match",
      "Favourable Match": "Favourable Match",
      "Neutral Match": "Neutral Match",
      "Six Conflicts": "Six Conflicts",
      "Difficult Match": "Difficult Match",
    };
    
    return labelMap[adjusted.label] || adjusted.label;
  }
  
  // If we have user profiles but no western/pattern, use classifier without adjustments
  if (userA && userB) {
    const userWest = sunSignLabel[userA.sunSign] as West;
    const userEast = animalMeta[userA.animal].label_en as East;
    const profileWest = sunSignLabel[userB.sunSign] as West;
    const profileEast = animalMeta[userB.animal].label_en as East;
    
    const classifierResult = computeMatchWithClassifier(
      userWest,
      userEast,
      profileWest,
      profileEast
    );
    
    // Map to labels (Good Friends now maps to Neutral Match)
    const labelMap: Record<string, string> = {
      "Soulmate Match": "Soulmate Match",
      "Twin Flame Match": "Twin Flame Match",
      "Excellent Match": "Excellent Match",
      "Very Good Match": "Excellent Match",
      "Favourable Match": "Favourable Match",
      "Good Friends": "Neutral Match",
      "Good Friends Match": "Neutral Match",
      "Sparky Friends": "Neutral Match",
      "Opposites Attract": "Opposites Attract",
      "Neutral Match": "Neutral Match",
      "Difficult Match": "Neutral Match",
    };
    
    return labelMap[classifierResult.rankLabel] || "Neutral Match";
  }
  
  // Fallback to score-based labels (new system)
  return baseLabelFromScore(score);
}

/** ---------------- Simple Connection Box Builder ---------------- */

/**
 * Normalizes the intro text by removing generic sign names
 * so our own subject (Aquarius Monkey and Sagittarius Rabbit) can lead.
 */
function normaliseIntro(intro: string): string {
  // Strip leading sign names like "Aquarius and Sagittarius..."
  return intro.replace(/^[A-Za-z]+ and [A-Za-z]+\s*/i, "").trim() || "create a connection with real potential.";
}

/**
 * Helper function to generate a Chinese pattern sentence
 */
function chineseSentenceFromPattern(pattern: PatternMeta, aLabel: string, bLabel: string): string {
  if (pattern.key === "friendly") {
    return `${aLabel} and ${bLabel} don't sit under a strong San He (三合) or Liu He (六合) pattern, so the energy is more neutral and depends heavily on how you both communicate.`;
  }
  return pattern.blurbHint || ""; // already references San He / Liu He / 六冲 / 六害 / 刑 / 破
}

/**
 * Blends Western growth advice with Chinese pattern insights.
 * Creates a cohesive growth sentence that combines both systems.
 */
function blendedGrowthSentence(baseGrowth: string, pattern: PatternMeta): string {
  if (pattern.tone === "very_supportive" || pattern.tone === "supportive") {
    return `${baseGrowth} With this supportive pattern in the background, small efforts go a long way if you stay honest about your needs.`;
  }

  if (pattern.tone && ["conflict", "harmful", "punishment", "break"].includes(pattern.tone)) {
    return `${baseGrowth} The pattern between your animals adds extra tension, but it also shows you exactly where growth is possible if you both stay self-aware.`;
  }

  return baseGrowth;
}

/**
 * Helper to map Element to WesternElement type from connectionText module
 */
function mapToWesternElement(element: Element): WesternElement {
  const elementMap: Record<Element, WesternElement> = {
    'fire': 'Fire',
    'earth': 'Earth',
    'air': 'Air',
    'water': 'Water'
  };
  return elementMap[element];
}

/**
 * Helper to map ChinesePattern to ConnectionChinesePattern from connectionText module
 */
function mapToConnectionChinesePattern(pattern: ChinesePattern): ConnectionChinesePattern {
  const patternMap: Record<ChinesePattern, ConnectionChinesePattern> = {
    'san_he': 'san_he',
    'liu_he': 'liu_he',
    'same_animal': 'same_animal',
    'same_trine': 'same_trine',
    'liu_chong': 'liu_chong',
    'liu_chong_xing': 'liu_chong',  // Map combined pattern to liu_chong
    'liu_hai': 'liu_hai',
    'xing': 'xing',
    'po': 'po',
    'neutral': 'none',
  };
  return patternMap[pattern] || 'none';
}

/**
 * Helper to determine Western aspect from sun signs
 */
function getWesternAspect(signA: string, signB: string): WestAspect {
  // Calculate zodiac distance (signs apart)
  const zodiacOrder = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ];
  
  const indexA = zodiacOrder.indexOf(signA.toLowerCase());
  const indexB = zodiacOrder.indexOf(signB.toLowerCase());
  
  if (indexA === -1 || indexB === -1) return 'none';
  if (indexA === indexB) return 'same_sign';
  
  const distance = Math.min(
    Math.abs(indexB - indexA),
    12 - Math.abs(indexB - indexA)
  );
  
  // Map distance to aspect
  switch (distance) {
    case 0: return 'same_sign';
    case 1: return 'none';  // semi-sextile, not in our system
    case 2: return 'sextile';  // 60 degrees
    case 3: return 'square';  // 90 degrees
    case 4: return 'trine';  // 120 degrees
    case 5: return 'quincunx';  // 150 degrees
    case 6: return 'opposition';  // 180 degrees
    default: return 'none';
  }
}

/** ---------------- NEW MATCH ENGINE INTEGRATION ---------------- */

/**
 * Wu Xing (Five Elements) generation and control cycles
 */
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

/**
 * Compute Wu Xing relationship between two year elements
 */
function computeWuXingRelation(a?: WuXing, b?: WuXing): WuXingRelation {
  if (!a || !b) return "neutral";
  if (a === b) return "same";
  
  // Supportive: generating cycle (either way)
  if (wuXingGenerating[a] === b || wuXingGenerating[b] === a) {
    return "supportive";
  }
  
  // Controlling: controlling cycle (either way)
  if (wuXingControlling[a] === b || wuXingControlling[b] === a) {
    // Determine if it's soft or harsh based on pattern
    return "controlling_soft";
  }
  
  return "neutral";
}

/**
 * Map old ChinesePattern to new MatchContext ChinesePattern
 */
function mapToNewChinesePattern(pattern: ChinesePattern): NewChinesePattern {
  const patternMap: Record<ChinesePattern, NewChinesePattern> = {
    'san_he': 'san_he',
    'liu_he': 'liu_he',
    'same_animal': 'same_animal',  // Keep same_animal distinct
    'same_trine': 'san_he',   // same_trine = san_he (Three Harmonies)
    'liu_chong': 'liu_chong',
    'liu_chong_xing': 'liu_chong',
    'liu_hai': 'liu_hai',
    'xing': 'xing',
    'po': 'po',
    'neutral': 'none',
  };
  return patternMap[pattern] || 'none';
}

/**
 * Map WestRelation to new WestAspect
 */
function mapToNewWestAspect(relation: WestRelation, signA: string, signB: string): NewWestAspect {
  // Calculate actual aspect from signs
  const aspect = getWesternAspect(signA, signB);
  
  // Map aspect to new system
  const aspectMap: Record<string, NewWestAspect> = {
    'same_sign': 'same',
    'opposition': 'opposite',
    'trine': 'trine_like',
    'sextile': 'trine_like',
    'square': 'square_like',
    'quincunx': 'other',
    'none': 'other',
  };
  
  return aspectMap[aspect] || 'other';
}

/**
 * Determine ElementPair from two Western elements
 */
function getElementPair(elemA: Element, elemB: Element): ElementPair {
  if (elemA === elemB) return 'same';
  
  // Compatible: Fire–Air, Water–Earth
  const compatible = [
    ['fire', 'air'],
    ['air', 'fire'],
    ['water', 'earth'],
    ['earth', 'water']
  ];
  
  if (compatible.some(([a, b]) => elemA === a && elemB === b)) {
    return 'compatible';
  }
  
  // Clash: Fire–Water, Air–Earth
  const clash = [
    ['fire', 'water'],
    ['water', 'fire'],
    ['air', 'earth'],
    ['earth', 'air']
  ];
  
  if (clash.some(([a, b]) => elemA === a && elemB === b)) {
    return 'clash';
  }
  
  // Everything else is semi-compatible
  return 'semi_compatible';
}

/**
 * Check if animals are in the same Chinese trine
 */
function areSameChineseTrine(animalA: ChineseAnimal, animalB: ChineseAnimal): boolean {
  const trines: ChineseAnimal[][] = [
    ['rat', 'dragon', 'monkey'],
    ['ox', 'snake', 'rooster'],
    ['tiger', 'horse', 'dog'],
    ['rabbit', 'goat', 'pig'],
  ];
  
  return trines.some(trine => trine.includes(animalA) && trine.includes(animalB));
}

/**
 * Check if animals are Chinese opposites (Liu Chong)
 */
function areChineseOpposites(animalA: ChineseAnimal, animalB: ChineseAnimal): boolean {
  const opposites: [ChineseAnimal, ChineseAnimal][] = [
    ['rat', 'horse'],
    ['ox', 'goat'],
    ['tiger', 'monkey'],
    ['rabbit', 'rooster'],
    ['dragon', 'dog'],
    ['snake', 'pig'],
  ];
  
  return opposites.some(([a, b]) =>
    (a === animalA && b === animalB) || (a === animalB && b === animalA)
  );
}

// isLivelyPair is imported from @/lib/matchEngineHelpers

/**
 * Build MatchContext from user profiles and compatibility data
 */
export function buildMatchContext(
  userA: UserProfile,
  userB: UserProfile,
  chinesePattern: ChinesePattern,
  westRelation: WestRelation,
  yearElementA?: WuXing,
  yearElementB?: WuXing
): NewMatchContext {
  const signA = userA.sunSign.toLowerCase();
  const signB = userB.sunSign.toLowerCase();
  const animalA = userA.animal.toLowerCase() as ChineseAnimal;
  const animalB = userB.animal.toLowerCase() as ChineseAnimal;
  
  const elemA = westElement[signA];
  const elemB = westElement[signB];
  
  const sameTrine = areSameChineseTrine(animalA, animalB);
  const mappedPattern = mapToNewChinesePattern(chinesePattern);
  const elementPairResult = getElementPair(elemA, elemB);
  
  // Debug for Profile 1 (Luna - Libra/Rat) - case insensitive
  const isLuna = (signB === "libra" && animalB === "rat");
  
  // Debug for same trine matches
  const isSameTrineDebug = (
    (animalA === "monkey" && (animalB === "rat" || animalB === "dragon")) ||
    (animalA === "rat" && (animalB === "monkey" || animalB === "dragon")) ||
    (animalA === "dragon" && (animalB === "monkey" || animalB === "rat"))
  );
  
  if (isLuna || isSameTrineDebug) {
    console.log(`\n[🔍 MATCH CONTEXT BUILDING]`);
    console.log(`  ${signA}-${animalA} × ${signB}-${animalB}`);
    console.log(`  signA: ${signA}, signB: ${signB}`);
    console.log(`  elemA: ${elemA}, elemB: ${elemB}`);
    console.log(`  animalA: ${animalA}, animalB: ${animalB}`);
    console.log(`  Original pattern: ${chinesePattern} → Mapped: ${mappedPattern}`);
    console.log(`  sameTrine: ${sameTrine}`);
    console.log(`  elementPair: ${elementPairResult}`);
    console.log(`  sameAnimal: ${animalA === animalB}, sameSunSign: ${signA === signB}`);
    console.log(`  westAspect: ${mapToNewWestAspect(westRelation, signA, signB)}`);
    console.log(`  wuxingRelation: ${computeWuXingRelation(yearElementA, yearElementB)}`);
  }
  
  const context = {
    westA: sunSignLabel[userA.sunSign],
    westB: sunSignLabel[userB.sunSign],
    animalA: animalMeta[userA.animal].label_en,
    animalB: animalMeta[userB.animal].label_en,
    chinesePattern: mappedPattern,
    sameChineseTrine: sameTrine,
    isChineseOpposites: areChineseOpposites(animalA, animalB),
    isLivelyPair: isLivelyPair(animalA, animalB),
    sameAnimal: animalA === animalB,
    sameSunSign: signA === signB,
    westAspect: mapToNewWestAspect(westRelation, signA, signB),
    elementPair: elementPairResult,
    wuxingRelation: computeWuXingRelation(yearElementA, yearElementB),
  };
  
  if (isLuna) {
    console.log(`Final MatchContext:`, context);
  }
  
  return context;
}

/**
 * Builds a simplified ConnectionBox from two user profiles.
 * Uses lookup tables to get Western and Chinese compatibility information,
 * computes a match score, and generates formatted display strings.
 * 
 * @param userA - First user's profile with sunSign and animal
 * @param userB - Second user's profile with sunSign and animal
 * @returns SimpleConnectionBox with all formatted strings and score
 */
export function buildSimpleConnectionBox(
  userA: UserProfile, 
  userB: UserProfile,
  yearElementA?: WuXing,
  yearElementB?: WuXing
): SimpleConnectionBox {
  // 1. Resolve Chinese pattern using direct resolver (new system)
  const animalA = userA.animal.toLowerCase() as ChineseAnimal;
  const animalB = userB.animal.toLowerCase() as ChineseAnimal;
  const signA = userA.sunSign.toLowerCase();
  const signB = userB.sunSign.toLowerCase();
  
  // Debug for Profile 1 (Luna - Libra/Rat) - case insensitive
  const isLuna = (animalB === "rat" && signB === "libra");
  
  if (isLuna) {
    console.log(`\n====== [🔍 LUNA MATCH - COMPLETE DEBUG] ======`);
    console.log(`Building box for ${userA.sunSign}-${userA.animal} × ${userB.sunSign}-${userB.animal}`);
    console.log(`User A (You): sunSign=${signA}, animal=${animalA}, yearElement=${yearElementA}`);
    console.log(`User B (Luna): sunSign=${signB}, animal=${animalB}, yearElement=${yearElementB}`);
  }
  
  const chinesePatternResult = getChinesePatternResult(animalA, animalB);
  const chinesePattern = chinesePatternResult.primary;
  
  // Debug for same trine matches (Rat, Dragon, or Monkey with each other)
  const isSameTrine = (
    (animalA === "monkey" && (animalB === "rat" || animalB === "dragon")) ||
    (animalA === "rat" && (animalB === "monkey" || animalB === "dragon")) ||
    (animalA === "dragon" && (animalB === "monkey" || animalB === "rat"))
  );
  
  if (isLuna || isSameTrine) {
    console.log(`\n====== [🔍 SAME TRINE DEBUG] ======`);
    console.log(`Profile: ${userB.sunSign}-${userB.animal}`);
    console.log(`Building box for ${signA}-${animalA} × ${signB}-${animalB}`);
    console.log(`Chinese Pattern Detection:`);
    console.log(`  Primary pattern: ${chinesePattern}`);
    console.log(`  All patterns:`, chinesePatternResult.all);
  }
  
  // Get pattern metadata for display (map to pattern key)
  const patternKeyMap: Record<ChinesePattern, string> = {
    'san_he': 'san_he',
    'liu_he': 'liu_he',
    'same_animal': 'same_animal', // Keep same animal distinct with its own metadata
    'same_trine': 'san_he',  // same trine uses san_he metadata
    'liu_chong': 'liu_chong',
    'liu_hai': 'liu_hai',
    'xing': 'xing',
    'po': 'po',
    'neutral': 'friendly',
  };
  const patternKey = patternKeyMap[chinesePattern] || 'friendly';
  const pattern = patterns[patternKey] || patterns['friendly'] || {
    key: 'friendly',
    label: 'Neutral Pattern',
    translation: 'Neutral',
    headlineTag: 'Neutral',
    blurbHint: 'This pairing has a neutral pattern.',
    tone: 'neutral'
  };

  // 2. Resolve Western relation using direct resolver (new system)
  // signA and signB already declared above
  const westRelation = getWestRelation(signA as WestSignType, signB as WestSignType);
  
  // Get Western pair info for display (label, element info)
  // Add safety check for westernPairs
  const western = westernPairs[userA.sunSign]?.[userB.sunSign] || {
    relationKey: 'semi_compatible',
    intro: '',
    dynamics: '',
    label: 'Mixed Elements'
  };

  // 3. Basic labels
  const signALabel = sunSignLabel[userA.sunSign];   // "Aquarius"
  const signBLabel = sunSignLabel[userB.sunSign];   // "Sagittarius"

  const animalALabel = animalMeta[userA.animal].label_en; // "Monkey"
  const animalBLabel = animalMeta[userB.animal].label_en; // "Rabbit"

  // 4. Score + match label using NEW match engine from lib/matchEngine.ts
  // Get year elements - calculate from birthdates if not provided
  let finalYearElementA = yearElementA;
  let finalYearElementB = yearElementB;
  
  // If year elements not provided, we'll need birthdates to calculate them
  // For now, use provided elements or calculate from a default year (1984 base)
  // Note: In production, you should pass birthdates and calculate year elements
  
  // Build match context for new engine
  const westA = signALabel as any; // "Aquarius", "Leo", etc.
  const westB = signBLabel as any;
  const chineseA = animalALabel as any; // "Rat", "Monkey", etc.
  const chineseB = animalBLabel as any;
  
  // Get year elements - use provided or calculate from a default (you should pass actual birth years)
  // For now, if not provided, we'll use a placeholder calculation
  // In production, extract year from birthdate and use getWuXingYearElement(year)
  const yearElementAForEngine = finalYearElementA || getWuXingYearElement(1990); // Default fallback
  const yearElementBForEngine = finalYearElementB || getWuXingYearElement(1990); // Default fallback
  
  // Build context using helper functions
  const newMatchContext: NewMatchEngineContext = {
    westA: { 
      sign: westA, 
      element: westElement[signA].charAt(0).toUpperCase() + westElement[signA].slice(1) as any
    },
    westB: { 
      sign: westB, 
      element: westElement[signB].charAt(0).toUpperCase() + westElement[signB].slice(1) as any
    },
    westAspect: getWestAspect(westA, westB),
    westElementRelation: getWestElementRelation(
      westElement[signA].charAt(0).toUpperCase() + westElement[signA].slice(1),
      westElement[signB].charAt(0).toUpperCase() + westElement[signB].slice(1)
    ),
    chineseA: {
      animal: chineseA,
      yearElement: yearElementAForEngine
    },
    chineseB: {
      animal: chineseB,
      yearElement: yearElementBForEngine
    },
    chinesePattern: getChinesePatternCode(animalA, animalB),
    isChineseOpposite: isChineseOppositePair(animalA, animalB),
    isLivelyPair: isLivelyPair(animalA, animalB),
  };
  
  // Force SAME_SIGN pattern if both animals are the same (regardless of other patterns)
  const sameChineseAnimal = animalA.toLowerCase() === animalB.toLowerCase();
  const sameWesternSign = westA.toLowerCase() === westB.toLowerCase();
  
  if (sameChineseAnimal) {
    newMatchContext.chinesePattern = 'SAME_SIGN';
    console.log('[Match Engine] Same Chinese animal detected, forcing SAME_SIGN pattern');
  }
  
  if (sameWesternSign) {
    console.log('[Match Engine] Same Western sign detected, will apply penalty');
  }
  
  // Calculate score using new engine
  const matchResult = computeNewMatchScore(newMatchContext);
  let score = matchResult.score;
  let finalTier = matchResult.tier;
  
  // Override tier for SAME_SIGN pattern - should always be Neutral Match
  if (sameChineseAnimal || newMatchContext.chinesePattern === 'SAME_SIGN') {
    finalTier = "Neutral Match";
    // Also ensure score is clamped to SAME_SIGN max (82%)
    if (score > 82) {
      console.warn(`[Match Engine] SAME_SIGN score ${score} exceeded max, clamping to 82%`);
      score = 82;
    }
  }
  
  // If same Western sign causes Neutral classification, set tier to Neutral Match
  // (This happens when sameWestSign blocks from top tiers)
  if (sameWesternSign && !sameChineseAnimal && finalTier !== "Neutral Match") {
    // Check if score is in neutral range (60-74) - if so, it's a Neutral Match
    if (score >= 60 && score < 75) {
      finalTier = "Neutral Match";
      console.log('[Match Engine] Same Western sign detected, setting tier to Neutral Match');
    }
  }
  
  // Cap for Neutral when "blocked-from-top-tiers" conditions apply
  // If same West sign OR same animal causes the pair to be classified as Neutral,
  // then cap the final score at 66%
  if (finalTier === "Neutral Match" && (sameWesternSign || sameChineseAnimal)) {
    if (score > 66) {
      console.log('[Match Engine] Capping Neutral score at 66% due to sameWestSign or sameChineseAnimal:', {
        sameWesternSign,
        sameChineseAnimal,
        finalTier,
        originalScore: score
      });
      score = 66;
    }
  }
  
  console.log('[Match Engine] Final score calculation:', {
    pattern: newMatchContext.chinesePattern,
    sameChineseAnimal,
    sameWesternSign,
    score,
    tier: finalTier,
    originalTier: matchResult.tier
  });
  
  // Map new tier system to labels (keep new tier names)
  const tierToLabel: Record<MatchTier, string> = {
    "Soulmate Match": "Soulmate Match",
    "Twin Flame Match": "Twin Flame Match",
    "Harmonious Match": "Harmonious Match",
    "Neutral Match": "Neutral Match",
    "Opposites Attract": "Opposites Attract",
    "Difficult Match": "Difficult Match",
  };
  
  const matchLabel = tierToLabel[finalTier] || "Neutral Match";
  const headingLine = `${matchLabel} · ${score}%`;
  
  // Update matchResult.score to use the capped score
  matchResult.score = score;

  if (isLuna || isSameTrine) {
    console.log(`Match Result from New Engine:`);
    console.log(`  tier: ${matchResult.tier}`);
    console.log(`  matchLabel: ${matchLabel}`);
    console.log(`  score: ${score}`);
    console.log(`  chinesePattern: ${newMatchContext.chinesePattern}`);
    console.log(`  westAspect: ${newMatchContext.westAspect}`);
    console.log(`======================================\n`);
  }

  // 5. Heading lines as per desired format
  const pairLine = `${signALabel}/${animalALabel} × ${signBLabel}/${animalBLabel}`;

  // Helper to get trine group name for animals
  const getTrineGroupName = (animal: Animal): string | null => {
    const trineGroups: Record<Animal, string> = {
      rat: "Visionaries",
      dragon: "Visionaries",
      monkey: "Visionaries",
      ox: "Strategists",
      snake: "Strategists",
      rooster: "Strategists",
      tiger: "Adventurers",
      horse: "Adventurers",
      dog: "Adventurers",
      rabbit: "Artists",
      goat: "Artists",
      pig: "Artists",
    };
    return trineGroups[animal] || null;
  };

  // Helper to get trine group name with Chinese characters
  const getTrineGroupNameWithChinese = (animal: Animal): string | null => {
    const trineGroups: Record<Animal, string> = {
      rat: "Visionaries 三会",
      dragon: "Visionaries 三会",
      monkey: "Visionaries 三会",
      ox: "Strategists 三会",
      snake: "Strategists 三会",
      rooster: "Strategists 三会",
      tiger: "Adventurers 三会",
      horse: "Adventurers 三会",
      dog: "Adventurers 三会",
      rabbit: "Artists 三会",
      goat: "Artists 三会",
      pig: "Artists 三会",
    };
    return trineGroups[animal] || null;
  };

  // Helper to convert trine name to TrineName format
  const getTrineName = (animal: Animal): TrineName | undefined => {
    const trineMap: Record<Animal, TrineName> = {
      rat: "Visionaries 水三会",
      dragon: "Visionaries 水三会",
      monkey: "Visionaries 水三会",
      ox: "Strategists 金三会",
      snake: "Strategists 金三会",
      rooster: "Strategists 金三会",
      tiger: "Adventurers 木三会",
      horse: "Adventurers 木三会",
      dog: "Adventurers 木三会",
      rabbit: "Artists 土三会",
      goat: "Artists 土三会",
      pig: "Artists 土三会",
    };
    return trineMap[animal];
  };

  // Helper to check if two animals are in the same trine group
  const areSameTrine = (animalA: Animal, animalB: Animal): boolean => {
    const trineA = getTrineGroupName(animalA);
    const trineB = getTrineGroupName(animalB);
    return trineA !== null && trineB !== null && trineA === trineB;
  };

  // Chinese compatibility line using new buildChineseSection function
  const trineA = getTrineGroupName(userA.animal);
  const trineB = getTrineGroupName(userB.animal);
  const allPatterns = chinesePatternResult.all;
  const sameTrine = areSameTrine(userA.animal, userB.animal);
  const trineName = sameTrine ? getTrineName(userA.animal) : undefined;
  
  // Map old ChinesePattern to new ChinesePatternNew type
  const mapToNewPattern = (pattern: ChinesePattern): ChinesePatternNew => {
    if (pattern === 'liu_chong' && allPatterns.includes('xing')) {
      return 'liu_chong_xing';
    }
    // Map old pattern names to new ones (they should be the same, but ensure type safety)
    const patternMap: Record<ChinesePattern, ChinesePatternNew> = {
      'san_he': 'san_he',
      'liu_he': 'liu_he',
      'same_animal': 'same_animal',
      'same_trine': 'same_trine',
      'liu_chong': 'liu_chong',
      'liu_chong_xing': 'liu_chong_xing',
      'liu_hai': 'liu_hai',
      'xing': 'xing',
      'po': 'po',
      'neutral': 'neutral',
    };
    return patternMap[pattern] || 'neutral';
  };
  
  // Determine pattern - check for liu_chong_xing combo
  const actualPattern: ChinesePatternNew = mapToNewPattern(chinesePattern);
  
  // NEW: Use the connectionText module for generating beautiful compatibility lines
  let chineseLine: string;
  let westernSignLine: string; // New: personality blurb
  let westernLine: string; // Element + aspect info
  let chineseDescription: string;
  let westernDescription: string;
  let wuXingLine: string | undefined = undefined;
  
  try {
    // Build ConnectionContext for the new system
    const elemA = westElement[signA];
    const elemB = westElement[signB];
    const westAspect = getWesternAspect(signALabel, signBLabel);
    const connectionPattern = mapToConnectionChinesePattern(chinesePattern);
    const trineNameSimple = sameTrine ? getTrineGroupName(userA.animal) : undefined;
    
    const ctx: ConnectionContext = {
      westA: { sign: signALabel, element: mapToWesternElement(elemA) },
      westB: { sign: signBLabel, element: mapToWesternElement(elemB) },
      chineseA: { 
        animal: animalALabel, 
        trineName: trineNameSimple || undefined,
        yearElement: yearElementA  // Now passed as parameter
      },
      chineseB: { 
        animal: animalBLabel, 
        trineName: trineNameSimple || undefined,
        yearElement: yearElementB  // Now passed as parameter
      },
      chinesePattern: connectionPattern,
      westAspect: westAspect,
    };
    
    // Generate the beautiful new connection lines
    const connectionLines = buildConnectionLines(ctx);
    chineseLine = connectionLines.chineseLine;
    westernSignLine = connectionLines.westernSignLine; // New personality blurb
    westernLine = connectionLines.westernLine; // Element + aspect info
    wuXingLine = connectionLines.wuXingLine || undefined;
    
    // For descriptions, fall back to existing system for now
    const patternKey = (() => {
      const mapPatternToKey = (pattern: ChinesePatternNew): ChinesePatternKey => {
        if (pattern === 'same_animal' || pattern === 'same_trine') return 'SAN_HE';
        const keyMap: Record<string, ChinesePatternKey> = {
          'san_he': 'SAN_HE',
          'liu_he': 'LIU_HE',
          'liu_chong': 'LIU_CHONG',
          'liu_chong_xing': 'LIU_CHONG_XING',
          'liu_hai': 'LIU_HAI',
          'xing': 'XING',
          'po': 'PO',
          'neutral': 'NEUTRAL',
        };
        return keyMap[pattern] || 'NEUTRAL';
      };
      return mapPatternToKey(actualPattern);
    })();
    
    const trineNameForPattern = (patternKey === 'SAN_HE' && sameTrine) ? getTrineName(userA.animal) : undefined;
    const chineseLines = getChinesePatternLines(animalALabel, animalBLabel, patternKey, trineNameForPattern);
    chineseDescription = chineseLines.description;
    
    const westernLines = getWesternPatternLines(signALabel, signBLabel);
    westernDescription = westernLines.description;
    
  } catch (error) {
    // Fallback if new system fails
    console.error('[buildSimpleConnectionBox] Error using new connectionText system:', error);
    
    // Fallback to old system
    try {
      const mapPatternToKey = (pattern: ChinesePatternNew): ChinesePatternKey => {
        if (pattern === 'same_animal' || pattern === 'same_trine') return 'SAN_HE';
        const keyMap: Record<string, ChinesePatternKey> = {
          'san_he': 'SAN_HE',
          'liu_he': 'LIU_HE',
          'liu_chong': 'LIU_CHONG',
          'liu_chong_xing': 'LIU_CHONG_XING',
          'liu_hai': 'LIU_HAI',
          'xing': 'XING',
          'po': 'PO',
          'neutral': 'NEUTRAL',
        };
        return keyMap[pattern] || 'NEUTRAL';
      };
      
      const patternKey = mapPatternToKey(actualPattern);
      const trineNameForPattern = (patternKey === 'SAN_HE' && sameTrine) ? getTrineName(userA.animal) : undefined;
      const chineseLines = getChinesePatternLines(animalALabel, animalBLabel, patternKey, trineNameForPattern);
      chineseLine = chineseLines.heading;
      chineseDescription = chineseLines.description;
      
      const westernLines = getWesternPatternLines(signALabel, signBLabel);
      westernLine = westernLines.heading;
      westernDescription = westernLines.description;
    } catch (fallbackError) {
      console.error('[buildSimpleConnectionBox] Fallback also failed:', fallbackError);
      chineseLine = `${animalALabel} × ${animalBLabel} — Pattern`;
      chineseDescription = '';
      westernLine = `${signALabel} × ${signBLabel}`;
      westernDescription = '';
    }
  }

  // Build overview using simple pattern-based one-liner
  let overview: string;
  try {
    // Map chinesePattern to match engine ChinesePattern type
    const mapToMatchEnginePattern = (pattern: ChinesePattern): import('@/lib/matchEngine').ChinesePattern => {
      const patternMap: Record<ChinesePattern, import('@/lib/matchEngine').ChinesePattern> = {
        'san_he': 'SAN_HE',
        'liu_he': 'LIU_HE',
        'same_animal': 'SAME_SIGN',
        'same_trine': 'SAN_HE',
        'liu_chong': 'LIU_CHONG',
        'liu_chong_xing': 'LIU_CHONG',
        'liu_hai': 'LIU_HAI',
        'xing': 'XING',
        'po': 'PO',
        'neutral': 'NO_PATTERN',
      };
      return patternMap[pattern] || 'NO_PATTERN';
    };
    
    const matchEnginePattern = mapToMatchEnginePattern(chinesePattern);
    
    // Use simple one-liner with score context
    overview = deriveConnectionOverview(matchEnginePattern, score);
  } catch (error) {
    console.error('[buildSimpleConnectionBox] Error generating pattern one-liner:', error);
    // Fallback to generic line
    overview = 'Connection shaped by personality and effort.';
  }
  
  // Chinese and Western descriptions are already set above using simpler functions

  // Call new match engine to get pill label, pattern emoji, and star ratings
  let matchEngineResult;
  
  // ===== DECLARE VARIABLES FOR CARD OVERLAY AT HIGHER SCOPE =====
  // These need to be accessible throughout the function for the card overlay
  let westernElementRelation: WesternElementRelation = 'NEUTRAL';
  let chineseBase: ChineseBasePattern = 'NO_PATTERN';
  let chineseOverlays: ChineseOverlayPattern[] = [];
  try {
    const { buildMatchResult } = require('@/lib/matchEngine');
    
    // Map pattern to ChinesePattern enum (convert lowercase pattern to uppercase)
    const mapPatternToKey = (pattern: any): string => {
      // CRITICAL: same_animal should map to SAME_SIGN, not SAN_HE
      if (pattern === 'same_animal') return 'SAME_SIGN';
      if (pattern === 'same_trine') return 'SAN_HE';
      const keyMap: Record<string, string> = {
        'san_he': 'SAN_HE',
        'liu_he': 'LIU_HE',
        'liu_chong': 'LIU_CHONG',
        'liu_chong_xing': 'LIU_CHONG',
        'liu_hai': 'LIU_HAI',
        'xing': 'XING',
        'po': 'PO',
        'neutral': 'NO_PATTERN',
      };
      return keyMap[pattern] || 'NO_PATTERN';
    };
    
    let patternKey = mapPatternToKey(chinesePattern);
    
    // Check if both animals are the same and force SAME_SIGN pattern
    const sameChineseAnimal = animalA.toLowerCase() === animalB.toLowerCase();
    const sameWesternSign = signA.toLowerCase() === signB.toLowerCase();
    
    if (sameChineseAnimal) {
      patternKey = 'SAME_SIGN';
      console.log('[buildSimpleConnectionBox] Same Chinese animal detected, forcing SAME_SIGN pattern');
    }
    
    // Debug logging
    console.log('[buildSimpleConnectionBox] Match engine input:', {
      patternKey,
      chinesePattern,
      sameChineseAnimal,
      sameWesternSign,
      westElementRelation: newMatchContext.westElementRelation,
      westAspect: newMatchContext.westAspect,
      yearElementA,
      yearElementB,
    });
    
    // Get wu xing relation
    let wuXingRelation = "OTHER";
    if (yearElementA && yearElementB) {
      if (yearElementA === yearElementB) {
        wuXingRelation = "SAME";
      } else {
        // Simplified: check generating cycle (Wood→Fire→Earth→Metal→Water→Wood)
        const generating: Record<string, string> = {
          'Wood': 'Fire',
          'Fire': 'Earth',
          'Earth': 'Metal',
          'Metal': 'Water',
          'Water': 'Wood',
        };
        const controlling: Record<string, string> = {
          'Wood': 'Earth',
          'Earth': 'Water',
          'Water': 'Fire',
          'Fire': 'Metal',
          'Metal': 'Wood',
        };
        if (generating[yearElementA] === yearElementB || generating[yearElementB] === yearElementA) {
          wuXingRelation = "GENERATING";
        } else if (controlling[yearElementA] === yearElementB || controlling[yearElementB] === yearElementA) {
          wuXingRelation = "CONTROLLING";
        }
      }
    }
    
    // Map western element relation to proper enum value
    let westElemRelation = "SEMI_COMPATIBLE";
    const westElemStr = newMatchContext.westElementRelation?.toLowerCase() || '';
    if (westElemStr.includes('same')) {
      westElemRelation = "SAME_ELEMENT";
    } else if (westElemStr.includes('compatible') && !westElemStr.includes('semi')) {
      westElemRelation = "COMPATIBLE_ELEMENT";
    } else if (westElemStr.includes('semi')) {
      westElemRelation = "SEMI_COMPATIBLE";
    } else if (westElemStr.includes('mismatch') || westElemStr.includes('incompatible')) {
      westElemRelation = "MISMATCH";
    }
    
    // Map western aspect to proper enum value
    let westAspectRelation = "NEUTRAL";
    const westAspectStr = newMatchContext.westAspect?.toLowerCase() || '';
    if (westAspectStr.includes('soft') || westAspectStr.includes('trine') || westAspectStr.includes('sextile')) {
      westAspectRelation = "SOFT";
    } else if (westAspectStr.includes('hard') || westAspectStr.includes('square')) {
      westAspectRelation = "HARD";
    } else if (westAspectStr.includes('opposition') || westAspectStr.includes('opposite')) {
      westAspectRelation = "OPPOSITION";
    }
    
    console.log('[buildSimpleConnectionBox] Mapped match engine input:', {
      pattern: patternKey,
      westernElementRelation: westElemRelation,
      westernAspectRelation: westAspectRelation,
      wuXingRelation,
      overlays: chinesePatternResult.all,
    });
    
    // Map overlay patterns to ChinesePattern type for match engine
    const overlayPatterns: any[] = chinesePatternResult.all
      .filter((p: string) => p !== chinesePattern) // Exclude the primary pattern
      .map((p: string) => {
        const overlayMap: Record<string, string> = {
          'liu_hai': 'LIU_HAI',
          'xing': 'XING',
          'po': 'PO',
          'liu_chong': 'LIU_CHONG',
        };
        return overlayMap[p];
      })
      .filter((p: string) => p !== undefined);
    
    matchEngineResult = buildMatchResult({
      pattern: patternKey as any,
      westernElementRelation: westElemRelation,
      westernAspectRelation: westAspectRelation,
      wuXingRelation,
      sameWesternSign: sameWesternSign,
    }, overlayPatterns);
    
    // Apply 66% cap for Neutral matches when blocked from top tiers
    // This must happen AFTER buildMatchResult since it recalculates the score
    if (finalTier === "Neutral Match" && (sameWesternSign || sameChineseAnimal)) {
      if (matchEngineResult.score > 66) {
        console.log('[buildSimpleConnectionBox] Capping Neutral score at 66% due to sameWestSign or sameChineseAnimal:', {
          sameWesternSign,
          sameChineseAnimal,
          finalTier,
          originalScore: matchEngineResult.score
        });
        matchEngineResult.score = 66;
        // Also update the pillLabel and patternFullLabel to reflect the capped score
        matchEngineResult.pillLabel = matchEngineResult.pillLabel.replace(/\d+%/, '66%');
        matchEngineResult.patternFullLabel = matchEngineResult.patternFullLabel.replace(/\d+%/, '66%');
      }
    }
    
    // NEW: Use new match engine functions for labels and blurbs
    // Map Chinese pattern to ChineseBasePattern
    const mapToChineseBasePattern = (pattern: string): ChineseBasePattern => {
      if (pattern === 'san_he' || pattern === 'same_trine') return 'SAN_HE';
      if (pattern === 'liu_he') return 'LIU_HE';
      if (pattern === 'same_animal' || sameChineseAnimal) return 'SAME_SIGN';
      return 'NO_PATTERN';
    };
    
    chineseBase = mapToChineseBasePattern(chinesePattern);
    
    // Map overlay patterns to ChineseOverlayPattern[]
    chineseOverlays = overlayPatterns
      .filter((p): p is ChineseOverlayPattern => 
        p === 'LIU_CHONG' || p === 'LIU_HAI' || p === 'XING' || p === 'PO'
      );
    
    // Derive archetype
    const archetype: ConnectionArchetype = deriveArchetype(chineseBase, chineseOverlays);
    
    // Derive Western ease from element relation
    // Map westElemRelation to WesternElementRelation type
    const mapToWesternElementRelation = (rel: string): WesternElementRelation => {
      if (rel === 'SAME_ELEMENT') return 'SAME';
      if (rel === 'COMPATIBLE_ELEMENT') return 'COMPATIBLE';
      if (rel === 'SEMI_COMPATIBLE') return 'SEMI_COMPATIBLE';
      if (rel === 'MISMATCH' || rel === 'INCOMPATIBLE') return 'CLASH';
      return 'NEUTRAL';
    };
    
    westernElementRelation = mapToWesternElementRelation(westElemRelation);
    const westernEase: WesternEase = deriveWesternEase(westernElementRelation);
    
    // Apply same sign cap to score
    const cappedScore = applySameSignCap(matchEngineResult.score, chineseBase);
    
    // Get new match label and connection blurb (use getConnectionBlurb descriptions)
    const newPillLabel = getMatchLabel(archetype, chineseBase, chineseOverlays, cappedScore);
    const newBaseTagline = getConnectionBlurb(archetype, westernEase, chineseBase, chineseOverlays);
    
    // Override with new values (use getConnectionBlurb descriptions for baseTagline)
    matchEngineResult.pillLabel = newPillLabel;
    matchEngineResult.baseTagline = newBaseTagline; // THIS IS THE KEY - SET IT HERE
    matchEngineResult.score = cappedScore; // Use capped score
    matchEngineResult.patternFullLabel = `${newPillLabel} · ${cappedScore}%`;
    
    console.log('[buildSimpleConnectionBox] Match engine result:', matchEngineResult);
    console.log('[buildSimpleConnectionBox] ✅ baseTagline set to:', newBaseTagline);
  } catch (error) {
    console.error('[buildSimpleConnectionBox] Error calling match engine:', error);
    // Fallback values - use getConnectionBlurb for descriptions
    try {
      const { getConnectionBlurb, deriveArchetype, deriveWesternEase } = require('@/lib/connectionUi');
      const { extractChineseBase, extractChineseOverlays, extractWesternRelation } = require('@/lib/connectionUiHelpers');
      chineseBase = extractChineseBase(chinesePattern) as ChineseBasePattern;
      chineseOverlays = extractChineseOverlays(chinesePattern, undefined, '') as ChineseOverlayPattern[];
      westernElementRelation = extractWesternRelation(newMatchContext.westElementRelation);
      const fallbackArchetype = deriveArchetype(chineseBase, chineseOverlays);
      const fallbackEase = deriveWesternEase(westernElementRelation);
      const fallbackBaseTagline = getConnectionBlurb(fallbackArchetype, fallbackEase, chineseBase, chineseOverlays);
      
      matchEngineResult = {
        score,
        pillLabel: `${score}% · ${matchLabel}`,
        pattern: chinesePattern,
        patternFullLabel: `${matchLabel} · ${score}%`,
        baseTagline: fallbackBaseTagline,
        patternEmoji: '✨',
        chemistryStars: 3,
        stabilityStars: 3,
      };
    } catch (fallbackError) {
      console.error('[buildSimpleConnectionBox] Error in fallback getConnectionBlurb:', fallbackError);
      // Final fallback
      matchEngineResult = {
        score,
        pillLabel: `${score}% · ${matchLabel}`,
        pattern: chinesePattern,
        patternFullLabel: `${matchLabel} · ${score}%`,
        baseTagline: overview.substring(0, 100),
        patternEmoji: '✨',
        chemistryStars: 3,
        stabilityStars: 3,
      };
    }
  }
  
  // CRITICAL: Always override baseTagline with getConnectionBlurb to ensure latest descriptions are used
  // This ensures we ALWAYS use the latest descriptions even if matchEngine returned old ones
  // Recalculate outside try block to ensure variables are in scope
  try {
    const { getConnectionBlurb, deriveArchetype, deriveWesternEase } = require('@/lib/connectionUi');
    const { extractChineseBase, extractChineseOverlays, extractWesternRelation } = require('@/lib/connectionUiHelpers');
    // Use already-extracted values if available, otherwise recalculate
    const finalChineseBase = chineseBase !== 'NO_PATTERN' ? chineseBase : extractChineseBase(chinesePattern) as ChineseBasePattern;
    const finalChineseOverlays = chineseOverlays.length > 0 ? chineseOverlays : extractChineseOverlays(chinesePattern, undefined, '') as ChineseOverlayPattern[];
    const finalWesternRelation = westernElementRelation !== 'NEUTRAL' ? westernElementRelation : extractWesternRelation(newMatchContext.westElementRelation);
    const finalArchetype = deriveArchetype(finalChineseBase, finalChineseOverlays);
    const finalEase = deriveWesternEase(finalWesternRelation);
    const finalBaseTagline = getConnectionBlurb(finalArchetype, finalEase, finalChineseBase, finalChineseOverlays);
    matchEngineResult.baseTagline = finalBaseTagline;
    console.log('[buildSimpleConnectionBox] ✅ FINAL OVERRIDE - baseTagline set to:', finalBaseTagline);
  } catch (overrideError) {
    console.error('[buildSimpleConnectionBox] ❌ Error in final override:', overrideError);
  }

  // ===== EXTRACT TAGLINES FROM DETAILED COMPATIBILITY DESCRIPTIONS =====
  const { getChineseDetailedCompat, getWesternDetailedCompat } = require('@/data/detailedCompatDescriptions');
  
  const chineseTagline = getChineseDetailedCompat(
    animalALabel.toLowerCase(),
    animalBLabel.toLowerCase()
  )?.tagline || undefined;
  
  const westernTagline = getWesternDetailedCompat(
    signALabel.toLowerCase(),
    signBLabel.toLowerCase()
  )?.tagline || undefined;
  
  if (chineseTagline) {
    console.log(`[buildSimpleConnectionBox] ✅ Chinese tagline found: "${chineseTagline}" for ${animalALabel} × ${animalBLabel}`);
  }
  if (westernTagline) {
    console.log(`[buildSimpleConnectionBox] ✅ Western tagline found: "${westernTagline}" for ${signALabel} × ${signBLabel}`);
  }

  // ===== BUILD CARD OVERLAY FOR PHOTO CAROUSEL =====
  // Map Western element relation to card overlay format (using already defined westernElementRelation from line 2016)
  const cardWestElemRel: CardWesternElementRelation = 
    westernElementRelation === 'SAME' ? 'SAME' :
    westernElementRelation === 'COMPATIBLE' ? 'COMPATIBLE' :
    westernElementRelation === 'SEMI_COMPATIBLE' ? 'SEMI_COMPATIBLE' :
    westernElementRelation === 'CLASH' ? 'CLASH' : 'NEUTRAL';
  
  // Map Western aspect to card overlay format
  const cardWestOpposition: CardWestOpposition =
    newMatchContext.westAspect === 'opposition' ? 'OPPOSITION' :
    newMatchContext.westAspect === 'square_like' ? 'HARD' :
    newMatchContext.westAspect === 'trine_like' ? 'SOFT' : 'NEUTRAL';
  
  // Build the connection box first
  const simpleBox = {
    matchLabel,
    score: matchEngineResult.score, // Use match engine score (already capped if applicable)
    headingLine,
    pairLine,
    chineseLine,
    chineseDescription,
    chineseTagline, // NEW: Tagline from detailed compatibility
    westernSignLine, // New: personality blurb
    westernLine, // Element + aspect info
    westernDescription,
    westernTagline, // NEW: Tagline from detailed compatibility
    wuXingLine: undefined, // Remove Wu Xing element information
    overview,
    // Chinese year elements for elements line display - set to undefined to hide
    chineseElementA: undefined,
    chineseElementB: undefined,
    // Pattern fields for taglines and star ratings
    chinesePattern: newMatchContext.chinesePattern,
    westAspect: newMatchContext.westAspect,
    westElementRelation: newMatchContext.westElementRelation,
    isChineseOpposite: newMatchContext.isChineseOpposite,
    isLivelyPair: newMatchContext.isLivelyPair,
    // NEW: Match engine result fields for photo carousel pill
    pillLabel: matchEngineResult.pillLabel,
    pattern: matchEngineResult.pattern,
    patternFullLabel: matchEngineResult.patternFullLabel,
    baseTagline: matchEngineResult.baseTagline,
    patternEmoji: matchEngineResult.patternEmoji,
    chemistryStars: matchEngineResult.chemistryStars,
    stabilityStars: matchEngineResult.stabilityStars,
  };

  // Build and attach card overlay
  const cardOverlay = buildCardOverlay({
    box: simpleBox,
    chineseBase: chineseBase,
    overlays: chineseOverlays,
    westElemRel: cardWestElemRel,
    sameWestSign: sameWesternSign,
    westOpposition: cardWestOpposition,
    trinePipFromAnimal: animalB.toLowerCase() as CardChineseAnimal, // Use User B's animal for the pip
  });
  console.log(`[🃏 Card Overlay] Built card for ${animalALabel} × ${animalBLabel}:`, cardOverlay);

  // Attach card overlay to the box and return
  const finalBox = attachCardOverlay(simpleBox, cardOverlay);
  console.log(`[🃏 Card Overlay] Final box has card:`, !!finalBox.card, finalBox.card);
  return finalBox;
}

/**
 * Builds the top-level display information for a connection box.
 * Returns only the header information without the overview paragraph.
 * 
 * @param userA - First user's profile with sunSign and animal
 * @param userB - Second user's profile with sunSign and animal
 * @returns ConnectionBoxTop with heading, pair, chinese, and western lines
 */
export function buildConnectionBoxTop(userA: UserProfile, userB: UserProfile): ConnectionBoxTop {
  // 1. Resolve Chinese pattern using direct resolver (new system)
  const animalA = userA.animal.toLowerCase() as ChineseAnimal;
  const animalB = userB.animal.toLowerCase() as ChineseAnimal;
  const chinesePatternResult = getChinesePatternResult(animalA, animalB);
  const chinesePattern = chinesePatternResult.primary;
  
  // Get pattern metadata for display (map to pattern key)
  const patternKeyMap: Record<ChinesePattern, string> = {
    'san_he': 'san_he',
    'liu_he': 'liu_he',
    'same_animal': 'same_animal', // Keep same animal distinct with its own metadata
    'same_trine': 'san_he',  // same trine uses san_he metadata
    'liu_chong': 'liu_chong',
    'liu_hai': 'liu_hai',
    'xing': 'xing',
    'po': 'po',
    'neutral': 'friendly',
  };
  const patternKey = patternKeyMap[chinesePattern] || 'friendly';
  const pattern = patterns[patternKey];

  // 2. Resolve Western relation using direct resolver (new system)
  const signA = userA.sunSign.toLowerCase() as WestSignType;
  const signB = userB.sunSign.toLowerCase() as WestSignType;
  const westRelation = getWestRelation(signA, signB);
  
  // Get Western pair info for display (label, element info)
  // Add safety check for westernPairs
  const western = westernPairs[userA.sunSign]?.[userB.sunSign] || {
    relationKey: 'semi_compatible',
    intro: '',
    dynamics: '',
    label: 'Mixed Elements'
  };

  // 3. Human-readable labels
  const signALabel = sunSignLabel[userA.sunSign];      // "Aquarius"
  const signBLabel = sunSignLabel[userB.sunSign];      // "Sagittarius"
  const animalALabel = animalMeta[userA.animal].label_en; // "Monkey"
  const animalBLabel = animalMeta[userB.animal].label_en; // "Rabbit"

  // 4. Score + match label using new 70/30 scoring system
  const adjusted = computeMatch(chinesePattern, westRelation);
  
  const score = adjusted.score;
  const matchLabel = adjusted.label;
  const headingLine = `${matchLabel} · ${score}%`;

  // 5. East–West combo line
  const pairLine = `${signALabel}/${animalALabel} × ${signBLabel}/${animalBLabel}`;

  // 6. Chinese line with symbols
  // Helper to get trine group name for animals
  const getTrineGroupName = (animal: Animal): string | null => {
    const trineGroups: Record<Animal, string> = {
      rat: "Visionaries",
      dragon: "Visionaries",
      monkey: "Visionaries",
      ox: "Strategists",
      snake: "Strategists",
      rooster: "Strategists",
      tiger: "Adventurers",
      horse: "Adventurers",
      dog: "Adventurers",
      rabbit: "Artists",
      goat: "Artists",
      pig: "Artists",
    };
    return trineGroups[animal] || null;
  };

  // Helper to check if two animals are in the same trine group
  const areSameTrine = (animalA: Animal, animalB: Animal): boolean => {
    const trineA = getTrineGroupName(animalA);
    const trineB = getTrineGroupName(animalB);
    return trineA !== null && trineB !== null && trineA === trineB;
  };

  // Remove duplicate words from headlineTag that are already in translation
  const removeDuplicateWords = (headlineTag: string, translation: string): string => {
    const translationWords = translation.toLowerCase().split(/\s+/);
    const headlineWords = headlineTag.split(/\s+/);
    const filteredWords = headlineWords.filter(word => 
      !translationWords.includes(word.toLowerCase())
    );
    return filteredWords.join(' ').trim();
  };

  let chineseLine: string;
  const trineA = getTrineGroupName(userA.animal);
  const trineB = getTrineGroupName(userB.animal);
  const allPatterns = chinesePatternResult.all;
  
  if (chinesePattern === 'same_animal') {
    // Same Animal: {A} × {B} — Same Animal "Shared Temperament" (Same Trine: {TrineName 汉字})
    const trineGroup = getTrineGroupNameWithChinese(userA.animal); // Both animals are the same, so same trine
    if (trineGroup) {
      chineseLine = `${animalALabel} × ${animalBLabel} — Same Animal "Shared Temperament" (Same Trine: ${trineGroup})`;
    } else {
      chineseLine = `${animalALabel} × ${animalBLabel} — Same Animal "Shared Temperament"`;
    }
  } else if ((pattern?.key === "san_he" || chinesePattern === 'san_he')) {
    // San He: {A} × {B} — San He (三合) "Three Harmonies" (Same Trine: {TrineName 汉字})
    const trineGroup = getTrineGroupNameWithChinese(userA.animal); // Both animals are in the same trine group
    const patternLabel = pattern?.label || 'San He (三合)';
    const patternTranslation = pattern?.translation || 'Three Harmonies';
    if (trineGroup) {
      chineseLine = `${animalALabel} × ${animalBLabel} — ${patternLabel} "${patternTranslation}" (Same Trine: ${trineGroup})`;
    } else {
      chineseLine = `${animalALabel} × ${animalBLabel} — ${patternLabel} "${patternTranslation}"`;
    }
  } else if (chinesePattern === 'same_trine') {
    // Same Trine (but not san_he): {A} × {B} — Same Trine (三会) "Shared Elemental Nature" (Same Trine: {TrineName 汉字})
    const trineGroup = getTrineGroupNameWithChinese(userA.animal); // Both animals are in the same trine group
    if (trineGroup) {
      chineseLine = `${animalALabel} × ${animalBLabel} — Same Trine (三会) "Shared Elemental Nature" (Same Trine: ${trineGroup})`;
    } else {
      chineseLine = `${animalALabel} × ${animalBLabel} — Same Trine (三会) "Shared Elemental Nature"`;
    }
  } else if ((pattern?.key === "liu_he" || chinesePattern === 'liu_he')) {
    // Liu He: {A} × {B} — Liu He (六合) "Six Harmonies / Six Harmoniess" ({SameOrCrossTrine})
    const patternLabel = pattern?.label || 'Liu He (六合)';
    if (trineA && trineB && trineA !== trineB) {
      chineseLine = `${animalALabel} × ${animalBLabel} — ${patternLabel} "Six Harmonies / Six Harmoniess" (Cross-Trine)`;
    } else if (trineA && trineB && trineA === trineB) {
      chineseLine = `${animalALabel} × ${animalBLabel} — ${patternLabel} "Six Harmonies / Six Harmoniess" (Same Trine)`;
    } else {
      chineseLine = `${animalALabel} × ${animalBLabel} — ${patternLabel} "Six Harmonies / Six Harmoniess"`;
    }
  } else if ((pattern?.key === "liu_chong" || chinesePattern === 'liu_chong')) {
    // Check if also has Xing pattern
    if (allPatterns.includes('xing')) {
      // Liu Chong + Xing: {A} × {B} — Liu Chong (六冲) + Xing (刑) "Opposition & Punishment" (Cross-Trine)
      chineseLine = `${animalALabel} × ${animalBLabel} — Liu Chong (六冲) + Xing (刑) "Opposition & Punishment" (Cross-Trine)`;
    } else {
      // Liu Chong: {A} × {B} — Liu Chong (六冲) "Opposition Pattern" (Cross-Trine)
      chineseLine = `${animalALabel} × ${animalBLabel} — Liu Chong (六冲) "Opposition Pattern" (Cross-Trine)`;
    }
  } else if ((pattern?.key === "xing" || chinesePattern === 'xing')) {
    // Xing: {A} × {B} — Xing (刑) "Punishment Pattern" ({SameOrCrossTrine})
    if (trineA && trineB && trineA !== trineB) {
      chineseLine = `${animalALabel} × ${animalBLabel} — Xing (刑) "Punishment Pattern" (Cross-Trine)`;
    } else if (trineA && trineB && trineA === trineB) {
      chineseLine = `${animalALabel} × ${animalBLabel} — Xing (刑) "Punishment Pattern" (Same Trine)`;
    } else {
      chineseLine = `${animalALabel} × ${animalBLabel} — Xing (刑) "Punishment Pattern"`;
    }
  } else if ((pattern?.key === "liu_hai" || chinesePattern === 'liu_hai')) {
    // Liu Hai: {A} × {B} — Liu Hai (六害) "Harm Pattern" ({SameOrCrossTrine})
    if (trineA && trineB && trineA !== trineB) {
      chineseLine = `${animalALabel} × ${animalBLabel} — Liu Hai (六害) "Harm Pattern" (Cross-Trine)`;
    } else if (trineA && trineB && trineA === trineB) {
      chineseLine = `${animalALabel} × ${animalBLabel} — Liu Hai (六害) "Harm Pattern" (Same Trine)`;
    } else {
      chineseLine = `${animalALabel} × ${animalBLabel} — Liu Hai (六害) "Harm Pattern"`;
    }
  } else if ((pattern?.key === "po" || chinesePattern === 'po')) {
    // Po: {A} × {B} — Po (破) "Break Pattern" ({SameOrCrossTrine})
    if (trineA && trineB && trineA !== trineB) {
      chineseLine = `${animalALabel} × ${animalBLabel} — Po (破) "Break Pattern" (Cross-Trine)`;
    } else if (trineA && trineB && trineA === trineB) {
      chineseLine = `${animalALabel} × ${animalBLabel} — Po (破) "Break Pattern" (Same Trine)`;
    } else {
      chineseLine = `${animalALabel} × ${animalBLabel} — Po (破) "Break Pattern"`;
    }
  } else {
    // Neutral: {A} × {B} — Neutral Pattern ({SameOrCrossTrine})
    if (trineA && trineB && trineA !== trineB) {
      chineseLine = `${animalALabel} × ${animalBLabel} — Neutral Pattern (Cross-Trine)`;
    } else if (trineA && trineB && trineA === trineB) {
      chineseLine = `${animalALabel} × ${animalBLabel} — Neutral Pattern (Same Trine)`;
    } else {
      chineseLine = `${animalALabel} × ${animalBLabel} — Neutral Pattern`;
    }
  }

  // 7. Western line with relationship/compatibility (elements removed)
  // Format: "Aquarius × Sagittarius — Compatible"
  const relationLabel = (() => {
    switch (western.relationKey) {
      case "same_element":
        return "Same Element";
      case "compatible":
        return "Compatible";
      case "semi_compatible":
        return "Semi-Compatible";
      case "opposites":
        return "Opposing";
      case "mismatch":
        return "Mismatch";
      default:
        return "Compatible";
    }
  })();
  const westernLine = `${signALabel} × ${signBLabel} — ${relationLabel}`;

  // 8. NEW ENGINE INTEGRATION - Compute using simplified matchEngineCore
  // Map old pattern to new pattern type
  const newChinesePattern: NewChinesePattern = mapOldPatternToNew(chinesePattern);
  
  // Classify Western harmony
  const elemA = getWesternElement(userA.sunSign);
  const elemB = getWesternElement(userB.sunSign);
  const elemRel = getElementRelation(elemA, elemB);
  const aspectRel = getAspectRelation(userA.sunSign, userB.sunSign);
  const westHarmony: WestHarmony = classifyWestHarmony(elemRel, aspectRel);
  
  // Debug logging
  console.log('[NEW ENGINE]', {
    oldPattern: chinesePattern,
    newPattern: newChinesePattern,
    westHarmony,
    userA: userA.sunSign,
    userB: userB.sunSign
  });
  
  // Compute match with new engine
  const match = computeMatchResult({ 
    chinesePattern: newChinesePattern, 
    westHarmony 
  });
  
  console.log('[NEW ENGINE RESULT]', {
    score: match.score,
    pattern: match.pattern.labelEn,
    overview: match.connectionOverview
  });

  // Recalculate headingLine and matchLabel with NEW engine score
  const newHeadingLine = `${matchLabel} · ${match.score}%`;

  // Return enriched data with new engine fields
  return {
    headingLine: newHeadingLine, // Use NEW score in heading
    pairLine,
    chineseLine,
    westernLine,
    score: match.score, // Use new engine score
    matchLabel,
    // New fields from matchEngineCore
    pillLabel: `${match.score}% · ${match.pattern.labelEn}`,
    patternEmoji: match.pattern.emoji,
    patternLabelEn: match.pattern.labelEn,
    patternLabelZh: match.pattern.labelZh || "",
    patternTagline: match.pattern.tagline,
    connectionOverview: match.connectionOverview,
  };
}

/**
 * Main function to build a ConnectionBox from two user profiles.
 * Uses the new simplified engine with lookup tables.
 * 
 * @param userA - First user's profile with sunSign and animal
 * @param userB - Second user's profile with sunSign and animal
 * @returns SimpleConnectionBox with all formatted strings and score
 */
export function buildConnectionBox(
  userA: UserProfile, 
  userB: UserProfile,
  yearElementA?: WuXing,
  yearElementB?: WuXing
): SimpleConnectionBox {
  return buildSimpleConnectionBox(userA, userB, yearElementA, yearElementB);
}