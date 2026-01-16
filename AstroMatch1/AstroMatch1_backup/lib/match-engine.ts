/*
AstroMatch – Tropical × Chinese Match Engine
------------------------------------------------
Drop-in TypeScript module designed for Cursor + V0 frontends, Supabase backends.
Implements:
  • getTropicalSunSign(dateUtc: Date): Tropical Sun sign (Western traditional ranges)
  • getChineseAnimal(dateUtc: Date): Chinese zodiac sign by lunar year (Gregorian fallback)
  • getHybridSignature(profile): { western: TropicalSign, animal: ChineseAnimal }
  • pairScore(a, b): number 0–100
  • explainScore(a, b): Narrative with sub-scores
  • Optional: seed deterministic 144×144 base matrix via rules; can be persisted to DB.

Notes
— Tropical date windows use traditional Western astrology dates aligned with the seasons.
  These are the standard dates used in Western horoscopes and astrology.
   (1) Fast range match (default) using fixed calendar windows (widely used by apps)
   (2) Hook for future precise calc via true Sun longitude (plug into astro lib)
— Chinese year uses Gregorian cutover at Lunar New Year. We include a small cache of
  Lunar New Year dates 1970–2035; outside that, we approximate to Feb 4 (Li Chun) which
  is standard for Four Pillars style. You can extend the map as needed.
*/

// ==========================
// Types
// ==========================

export type SiderealSign =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo'
  | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export type ChineseAnimal =
  | 'Rat' | 'Ox' | 'Tiger' | 'Rabbit' | 'Dragon' | 'Snake'
  | 'Horse' | 'Goat' | 'Monkey' | 'Rooster' | 'Dog' | 'Pig';

export interface HybridSignature {
  western: SiderealSign;
  animal: ChineseAnimal;
}

export interface Subscores {
  coreVibe: number;        // archetypal harmony from animal trines/clashes + element
  chemistry: number;       // spark/attraction (yin/yang polarity, modality friction)
  communication: number;   // air/mercury-like synergy, animal compatibility
  lifestyle: number;       // pace/values alignment from modalities & elements
  longTerm: number;        // stability from earth/water & supportive trines
  growth: number;          // complementary differences (healthy tension)
}

export interface MatchExplanation {
  score: number; // 0–100
  subs: Subscores;
  bullets: string[]; // 3–7 concise reasons
  signatureA: HybridSignature;
  signatureB: HybridSignature;
}

// ==========================
// Config: Tropical date windows (Western traditional ranges)
// ==========================
// These are the standard tropical Sun ranges used in Western astrology, aligned with the seasons.
// All dates are inclusive start, exclusive end, in UTC by default.
// Aries ~ Mar 21–Apr 19, Taurus ~ Apr 20–May 20, Gemini ~ May 21–Jun 20, Cancer ~ Jun 21–Jul 22
// Leo ~ Jul 23–Aug 22, Virgo ~ Aug 23–Sep 22, Libra ~ Sep 23–Oct 22, Scorpio ~ Oct 23–Nov 21
// Sagittarius ~ Nov 22–Dec 21, Capricorn ~ Dec 22–Jan 19, Aquarius ~ Jan 20–Feb 18, Pisces ~ Feb 19–Mar 20

const TROPICAL_WINDOWS: { sign: SiderealSign; start: [number, number]; end: [number, number] }[] = [
  { sign: 'Aries',       start: [3, 21], end: [4, 20] },
  { sign: 'Taurus',      start: [4, 20], end: [5, 21] },
  { sign: 'Gemini',      start: [5, 21], end: [6, 21] },
  { sign: 'Cancer',      start: [6, 21], end: [7, 23] },
  { sign: 'Leo',         start: [7, 23], end: [8, 23] },
  { sign: 'Virgo',       start: [8, 23], end: [9, 23] },
  { sign: 'Libra',       start: [9, 23], end: [10, 23] },
  { sign: 'Scorpio',     start: [10, 23], end: [11, 22] },
  { sign: 'Sagittarius', start: [11, 22], end: [12, 22] },
  { sign: 'Capricorn',   start: [12, 22], end: [1, 20] },
  { sign: 'Aquarius',    start: [1, 20], end: [2, 19] },
  { sign: 'Pisces',      start: [2, 19], end: [3, 21] },
];

// Western element & modality maps (same labels used for sidereal sign names)
const ELEMENT: Record<SiderealSign, 'Fire' | 'Earth' | 'Air' | 'Water'> = {
  Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
  Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
  Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
  Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water',
};

const MODALITY: Record<SiderealSign, 'Cardinal' | 'Fixed' | 'Mutable'> = {
  Aries: 'Cardinal', Cancer: 'Cardinal', Libra: 'Cardinal', Capricorn: 'Cardinal',
  Taurus: 'Fixed', Leo: 'Fixed', Scorpio: 'Fixed', Aquarius: 'Fixed',
  Gemini: 'Mutable', Virgo: 'Mutable', Sagittarius: 'Mutable', Pisces: 'Mutable',
};

// Chinese meta: trines, clashes, yin/yang
const TRINES: ChineseAnimal[][] = [
  ['Rat', 'Dragon', 'Monkey'],
  ['Ox', 'Snake', 'Rooster'],
  ['Tiger', 'Horse', 'Dog'],
  ['Rabbit', 'Goat', 'Pig'],
];
const CLASHES: Record<ChineseAnimal, ChineseAnimal> = {
  Rat: 'Horse', Ox: 'Goat', Tiger: 'Monkey', Rabbit: 'Rooster', Dragon: 'Dog', Snake: 'Pig',
  Horse: 'Rat', Goat: 'Ox', Monkey: 'Tiger', Rooster: 'Rabbit', Dog: 'Dragon', Pig: 'Snake',
};
const YIN: Set<ChineseAnimal> = new Set(['Ox','Rabbit','Snake','Goat','Rooster','Pig']);
const YANG: Set<ChineseAnimal> = new Set(['Rat','Tiger','Dragon','Horse','Monkey','Dog']);

// Near-neighbors on the 12-year wheel (useful for soft bonuses/penalties)
const ORDER: ChineseAnimal[] = ['Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat','Monkey','Rooster','Dog','Pig'];

// ==========================
// Public API
// ==========================

/** Return tropical Sun sign from UTC date via fixed civil windows */
export function getTropicalSunSign(dateUtc: Date): SiderealSign {
  const m = dateUtc.getUTCMonth() + 1; // 1–12
  const d = dateUtc.getUTCDate();

  for (const w of TROPICAL_WINDOWS) {
    const [sm, sd] = w.start; const [em, ed] = w.end;
    // windows may wrap over year-end (e.g., Sagittarius, Capricorn)
    const within =
      (sm < em && (m > sm || (m === sm && d >= sd)) && (m < em || (m === em && d < ed))) ||
      (sm > em && ((m > sm || (m === sm && d >= sd)) || (m < em || (m === em && d < ed))));
    if (within) return w.sign;
  }
  // Fallback (should not happen): Pisces
  return 'Pisces';
}

/** Legacy alias for backward compatibility */
export function getSiderealSunSign(dateUtc: Date): SiderealSign {
  return getTropicalSunSign(dateUtc);
}

/** Chinese zodiac from date using Lunar New Year cutover where available */
export function getChineseAnimal(dateLocal: Date): ChineseAnimal {
  // Determine lunar year start for the given Gregorian year
  const y = dateLocal.getFullYear();
  const lny = LUNAR_NEW_YEAR[y] ?? approxLiChun(y); // date string YYYY-MM-DD
  const [Y, M, D] = lny.split('-').map(Number);
  const cutoff = new Date(y, (M - 1), D); // local time
  const yearForAnimal = dateLocal >= cutoff ? y : y - 1;
  return animalFromYear(yearForAnimal);
}

export function getHybridSignature(dateOfBirth: Date, tzAwareLocal?: boolean): HybridSignature {
  // If you pass a local Date constructed with user's timezone, set tzAwareLocal=true for Chinese calc
  const western = getTropicalSunSign(new Date(Date.UTC(
    dateOfBirth.getFullYear(), dateOfBirth.getMonth(), dateOfBirth.getDate()
  )));
  const animal = getChineseAnimal(tzAwareLocal ? dateOfBirth : new Date(dateOfBirth));
  return { western, animal };
}

/** Main scoring entry: 0–100 */
export function pairScore(a: HybridSignature, b: HybridSignature): number {
  const subs = computeSubscores(a, b);
  // Optimized weights for balanced scoring across all 144×144 combinations
  const total = subs.coreVibe*0.32 + subs.chemistry*0.22 + subs.communication*0.24 +
                subs.lifestyle*0.10 + subs.longTerm*0.10 + subs.growth*0.02;
  return clamp(Math.round(total), 0, 100);
}

export function explainScore(a: HybridSignature, b: HybridSignature): MatchExplanation {
  const subs = computeSubscores(a, b);
  const score = pairScore(a, b);
  const bullets = buildBullets(a, b, subs, score);
  return { score, subs, bullets, signatureA: a, signatureB: b };
}

// ==========================
// Scoring internals
// ==========================

function computeSubscores(a: HybridSignature, b: HybridSignature): Subscores {
  const elemA = ELEMENT[a.western];
  const elemB = ELEMENT[b.western];
  const modA = MODALITY[a.western];
  const modB = MODALITY[b.western];

  // Animal relations
  const trine = sameTrine(a.animal, b.animal);
  const clash = CLASHES[a.animal] === b.animal;
  const sameAnimal = a.animal === b.animal;
  const neighborDelta = circleDistance(ORDER.indexOf(a.animal), ORDER.indexOf(b.animal), ORDER.length);

  // Yin/Yang
  const yinYang = (YIN.has(a.animal) && YANG.has(b.animal)) || (YANG.has(a.animal) && YIN.has(b.animal));

  // Element synergy matrix
  const elemScore = elementSynergy(elemA, elemB); // -8..+8

  // Modality friction/flow
  const modScore = modalitySynergy(modA, modB); // -6..+4

  // Core vibe: animal trines/clashes + element (maximum accuracy)
  let coreVibe = 68  // Raised base to 68 for better baseline
    + (trine ? 28 : 0)  // Major trine bonus - critical in Chinese astrology
    + (sameAnimal ? 18 : 0)  // Increased same animal bonus
    + (clash ? -10 : 0)  // Reduced clash penalty further
    + softNeighbor(neighborDelta)
    + (elemScore * 1.4); // Further amplify element score influence
  coreVibe = scaleTo(coreVibe, 0, 100);

  // Chemistry: polarity + a touch of friction (maximum synergy recognition)
  let chemistry = 65  // Raised base to 65
    + (yinYang ? 18 : 0)  // Increased yin/yang bonus
    + (elemScore >= 8 ? 15 : 0)  // Major bonus for same elements
    + (elemScore >= 6 && elemScore < 8 ? 12 : 0)  // Good bonus for complementary
    + (trine ? 10 : 0)  // Increased trine bonus
    + (sameAnimal ? 8 : 0)  // NEW: Add bonus for same animal
    + (modScore <= -2 ? 4 : 0) // a little tension can be sexy
    + (clash ? -6 : 0);  // Further reduced clash penalty
  chemistry = scaleTo(chemistry, 0, 100);

  // Communication: air/mental + friendly animal relations (maximum synergy)
  let communication = 65  // Raised base to 65
    + ((elemA === 'Air' || elemB === 'Air') ? 12 : 0)  // Increased Air bonus
    + (elemA === 'Air' && elemB === 'Air' ? 18 : 0)  // Maximum bonus for both Air signs - exceptional mental connection
    + (elemA === 'Water' && elemB === 'Water' ? 12 : 0)  // NEW: Water+Water emotional understanding
    + (elemA === 'Fire' && elemB === 'Fire' ? 10 : 0)  // NEW: Fire+Fire passionate communication
    + (trine ? 14 : 0)  // Increased trine bonus - natural understanding
    + (!clash && neighborDelta <= 2 ? 7 : 0)  // Increased neighbor bonus
    + (modA === 'Mutable' || modB === 'Mutable' ? 6 : 0)  // Mutable = adaptable communication
    + (elemA === elemB && elemA === 'Earth' ? 8 : 0);  // Earth+Earth practical communication
  communication = scaleTo(communication, 0, 100);

  // Lifestyle: pace/values via modality + element grounding
  let lifestyle = 60  // Raised base to 60
    + (modScore * 1.8)  // Further amplify modality influence
    + (elemA === 'Earth' && elemB === 'Earth' ? 10 : 0)  // Earth stability
    + (elemA === 'Water' && elemB === 'Water' ? 8 : 0)  // Water emotional flow
    + (elemA === 'Fire' && elemB === 'Fire' ? 5 : 0)  // Fire shared energy
    + (elemA === 'Air' && elemB === 'Air' ? 8 : 0)  // Air intellectual lifestyle
    + (trine ? 8 : 0)  // Increased trine bonus
    + (elemScore >= 6 ? 5 : 0)  // NEW: Bonus for element synergy
    + (clash ? -5 : 0);  // Further reduced clash penalty
  lifestyle = scaleTo(lifestyle, 0, 100);

  // Long-term: stability indicators
  let longTerm = 62  // Raised base to 62
    + (trine ? 18 : 0)  // Major trine bonus - long-term harmony
    + (sameAnimal ? 12 : 0)  // Increased same animal bonus
    + (elemA === 'Earth' || elemB === 'Earth' ? 6 : 0)  // Earth grounding
    + (elemA === 'Water' || elemB === 'Water' ? 6 : 0)  // Water emotional depth
    + (elemA === elemB ? 10 : 0)  // Increased bonus for same elements
    + (elemScore >= 6 ? 6 : 0)  // NEW: Synergy bonus
    + (modA === 'Fixed' && modB === 'Fixed' ? 0 : 0)  // Removed penalty completely
    + (modA === 'Fixed' || modB === 'Fixed' ? 3 : 0)  // NEW: Fixed provides stability
    + (clash ? -8 : 0);  // Reduced clash penalty
  longTerm = scaleTo(longTerm, 0, 100);

  // Growth: complementary differences (rebalanced to be more positive)
  let growth = 60  // Raised base: all relationships offer growth
    + (yinYang ? 8 : 0)  // Increased: yin/yang balance creates learning
    + (elemScore <= -3 ? 5 : 0)  // Reduced threshold: moderate friction is good
    + (elemScore >= 6 ? 5 : 0)  // NEW: Synergy also creates growth through support
    + (modA !== modB ? 6 : 0)  // Increased: different approaches expand perspectives
    + (neighborDelta >= 3 && !clash ? 4 : 0)  // Increased: different perspectives
    + (trine ? 3 : 0); // Changed: trines offer growth through harmony, not just challenge
  growth = scaleTo(growth, 0, 100);

  return { coreVibe, chemistry, communication, lifestyle, longTerm, growth };
}

function buildBullets(a: HybridSignature, b: HybridSignature, subs: Subscores, total: number): string[] {
  const bullets: string[] = [];
  const elemA = ELEMENT[a.western];
  const elemB = ELEMENT[b.western];
  const modA = MODALITY[a.western];
  const modB = MODALITY[b.western];
  const trine = sameTrine(a.animal, b.animal);
  const clash = CLASHES[a.animal] === b.animal;
  const neighborDelta = circleDistance(ORDER.indexOf(a.animal), ORDER.indexOf(b.animal), ORDER.length);
  const yinYang = (YIN.has(a.animal) && YANG.has(b.animal)) || (YANG.has(a.animal) && YIN.has(b.animal));

  if (trine) bullets.push(`${a.animal}–${b.animal} are same trine allies → easy rapport.`);
  if (clash) bullets.push(`${a.animal} vs ${b.animal} is a classic opposition → manage expectations.`);
  if (yinYang) bullets.push(`Yin/Yang balance between your animal natures sparks attraction.`);
  const es = elementSynergy(elemA, elemB);
  if (es >= 6) bullets.push(`${elemA}–${elemB} element synergy fuels chemistry.`);
  else if (es <= -4) bullets.push(`${elemA}–${elemB} element contrast keeps things interesting.`);
  if (modA === modB) bullets.push(`Both are ${modA} modality → shared pace, with periodic friction.`);
  else bullets.push(`Different modalities (${modA} & ${modB}) complement each other's style.`);
  if (neighborDelta === 1) bullets.push(`Adjacent birth years on the zodiac wheel → familiar vibe.`);
  if (neighborDelta >= 4 && !clash) bullets.push(`Distinct animal archetypes provide room for growth.`);
  bullets.push(`Overall match: ${total}/100.`);
  return bullets.slice(0, 7);
}

// --------------------------
// Helper scoring utilities
// --------------------------

function elementSynergy(a: 'Fire'|'Earth'|'Air'|'Water', b: typeof a): number {
  if (a === b) return 15; // Maximum: same element = deep understanding and harmony
  const allies: Record<typeof a, typeof a[]> = {
    Fire: ['Air'], Air: ['Fire'], Earth: ['Water'], Water: ['Earth']
  } as any;
  if (allies[a].includes(b)) return 10; // Strong: complementary elements work beautifully
  const frictions: Record<typeof a, typeof a[]> = {
    Fire: ['Water','Earth'], Water: ['Fire','Air'], Air: ['Earth','Water'], Earth: ['Air','Fire']
  } as any;
  if (frictions[a].includes(b)) return -2; // Minimal penalty: friction is manageable
  return 0;
}

function modalitySynergy(a: 'Cardinal'|'Fixed'|'Mutable', b: typeof a): number {
  if (a === b) {
    if (a === 'Fixed') return 0; // Reduced penalty: Fixed+Fixed can be stable
    if (a === 'Cardinal') return 5; // Increased: shared initiative = power couple
    return 6; // Increased: Mutable+Mutable = highly adaptable
  }
  const pairs: Record<typeof a, typeof a[]> = {
    Cardinal: ['Mutable'], Mutable: ['Fixed'], Fixed: ['Cardinal'] // rock-paper-scissors flow
  } as any;
  return pairs[a].includes(b) ? 6 : 2; // Increased: complementary flow, even non-pairs get small bonus
}

function sameTrine(x: ChineseAnimal, y: ChineseAnimal): boolean {
  return TRINES.some(t => t.includes(x) && t.includes(y));
}

function softNeighbor(delta: number): number {
  if (delta === 1) return 6; // Increased: adjacent years have strong understanding
  if (delta === 2) return 3; // Increased: close neighbors
  if (delta === 3) return 1; // Small bonus for moderate distance
  if (delta >= 5) return 0; // Removed penalty: different eras aren't necessarily bad
  return 0;
}

function clamp(n: number, min: number, max: number): number { return Math.max(min, Math.min(max, n)); }
function scaleTo(n: number, min: number, max: number): number { return clamp(Math.round(n), min, max); }
function circleDistance(i: number, j: number, size: number): number {
  const d = Math.abs(i - j); return Math.min(d, size - d);
}

// ==========================
// Chinese zodiac helpers
// ==========================

function animalFromYear(year: number): ChineseAnimal {
  // Reference: 2020 = Rat
  const base = 2020; const animals: ChineseAnimal[] = ORDER;
  const idx = ((year - base) % 12 + 12) % 12;
  return animals[idx];
}

function approxLiChun(year: number): string {
  // Approx solar-term boundary around Feb 4
  return `${year}-02-04`;
}

// Minimal Lunar New Year table (1970–2035). Extend as needed.
const LUNAR_NEW_YEAR: Record<number, string> = {
  1970:'1970-02-06',1971:'1971-01-27',1972:'1972-02-15',1973:'1973-02-03',1974:'1974-01-23',
  1975:'1975-02-11',1976:'1976-01-31',1977:'1977-02-18',1978:'1978-02-07',1979:'1979-01-28',
  1980:'1980-02-16',1981:'1981-02-05',1982:'1982-01-25',1983:'1983-02-13',1984:'1984-02-02',
  1985:'1985-02-20',1986:'1986-02-09',1987:'1987-01-29',1988:'1988-02-17',1989:'1989-02-06',
  1990:'1990-01-27',1991:'1991-02-15',1992:'1992-02-04',1993:'1993-01-23',1994:'1994-02-10',
  1995:'1995-01-31',1996:'1996-02-19',1997:'1997-02-07',1998:'1998-01-28',1999:'1999-02-16',
  2000:'2000-02-05',2001:'2001-01-24',2002:'2002-02-12',2003:'2003-02-01',2004:'2004-01-22',
  2005:'2005-02-09',2006:'2006-01-29',2007:'2007-02-18',2008:'2008-02-07',2009:'2009-01-26',
  2010:'2010-02-14',2011:'2011-02-03',2012:'2012-01-23',2013:'2013-02-10',2014:'2014-01-31',
  2015:'2015-02-19',2016:'2016-02-08',2017:'2017-01-28',2018:'2018-02-16',2019:'2019-02-05',
  2020:'2020-01-25',2021:'2021-02-12',2022:'2022-02-01',2023:'2023-01-22',2024:'2024-02-10',
  2025:'2025-01-29',2026:'2026-02-17',2027:'2027-02-06',2028:'2028-01-26',2029:'2029-02-13',
  2030:'2030-02-03',2031:'2031-01-23',2032:'2032-02-11',2033:'2033-01-31',2034:'2034-02-19',
  2035:'2035-02-08'
};

// ==========================
// Optional: Base matrix generation (144×144)
// ==========================
// Instead of storing a hand-authored 144×144 table, we can deterministically derive a base
// using the above rules. If you still want a concrete matrix for caching/A-B testing,
// use the function below to produce and persist it (e.g., Supabase table).

export type HybridKey = `${SiderealSign}_${ChineseAnimal}`;
export const ALL_SIGNS: SiderealSign[] = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
export const ALL_ANIMALS: ChineseAnimal[] = ORDER;

export function buildMatrix(): Record<HybridKey, Record<HybridKey, number>> {
  const keys: HybridKey[] = [];
  for (const s of ALL_SIGNS) for (const a of ALL_ANIMALS) keys.push(`${s}_${a}` as HybridKey);
  const out: Record<HybridKey, Record<HybridKey, number>> = {};
  for (const k1 of keys) {
    out[k1] = {} as Record<HybridKey, number>;
    const sig1 = parseHybrid(k1);
    for (const k2 of keys) {
      const sig2 = parseHybrid(k2);
      out[k1][k2] = pairScore(sig1, sig2);
    }
  }
  return out;
}

function parseHybrid(k: HybridKey): HybridSignature {
  const [w, a] = k.split('_');
  return { western: w as SiderealSign, animal: a as ChineseAnimal };
}

