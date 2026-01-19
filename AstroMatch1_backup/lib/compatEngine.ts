// Parametric Compatibility Engine - Lightweight (~30KB total)
// Fetch-based lazy loading for optimal bundle size

type West = "aries"|"taurus"|"gemini"|"cancer"|"leo"|"virgo"|"libra"|"scorpio"|"sagittarius"|"capricorn"|"aquarius"|"pisces";
type East = "rat"|"ox"|"tiger"|"rabbit"|"dragon"|"snake"|"horse"|"goat"|"monkey"|"rooster"|"dog"|"pig";
type PairKey = `${West}_${East}__${West}_${East}`;

const loadJSON = <T>(path: string) => fetch(path).then(r => {
  if (!r.ok) throw new Error(`Failed to load ${path}`);
  return r.json() as Promise<T>;
});

// Small in-memory caches
let westM: {signs: West[]; matrix: number[][]} | null = null;
let eastM: {animals: East[]; matrix: number[][]} | null = null;
let weights: { west_weight: number; east_weight: number; synergy_bonus: number; same_trine_bonus: number; conflict_penalty: number } | null = null;
let tags: { themes: Record<string,string>; warnings: Record<string,string> } | null = null;
let overrides: { pairs: Record<PairKey, { score?: number; themes?: string[]; warnings?: string[] }> } | null = null;

export interface CompatResult {
  score: number
  label: string
  themes: string[]
  warnings: string[]
  themesText: string[]
  warningsText: string[]
  source: 'override' | 'computed'
}

const TRINES: East[][] = [
  ["rat","dragon","monkey"],
  ["ox","snake","rooster"],
  ["tiger","horse","dog"],
  ["rabbit","goat","pig"]
];

function sameTrine(a: East, b: East) {
  return TRINES.some(t => t.includes(a) && t.includes(b));
}

function idx<T extends string>(list: T[], val: T) {
  const i = list.indexOf(val);
  if (i < 0) throw new Error(`Unknown value: ${val}`);
  return i;
}

function generateLabel(score: number): string {
  if (score >= 95) return 'Exceptional Match'
  if (score >= 85) return 'Highly Compatible'
  if (score >= 75) return 'Strong Connection'
  if (score >= 65) return 'Balanced Chemistry'
  if (score >= 55) return 'Growth Potential'
  return 'Challenging Dynamic'
}

export async function computeCompatibility(aWest: string, aEast: string, bWest: string, bEast: string): Promise<CompatResult> {
  // Normalize inputs
  const aWestNorm = aWest.toLowerCase() as West;
  const aEastNorm = aEast.toLowerCase() as East;
  const bWestNorm = bWest.toLowerCase() as West;
  const bEastNorm = bEast.toLowerCase() as East;

  // Lazy-load small config files from public directory
  if (!westM) westM = await loadJSON("/data/compat/west_matrix.json");
  if (!eastM) eastM = await loadJSON("/data/compat/east_matrix.json");
  if (!weights) weights = await loadJSON("/data/compat/weights.json");
  if (!tags) tags = await loadJSON("/data/compat/tags.json");
  if (!overrides) overrides = await loadJSON("/data/compat/overrides.json");

  const wA = idx(westM!.signs, aWestNorm);
  const wB = idx(westM!.signs, bWestNorm);
  const eA = idx(eastM!.animals, aEastNorm);
  const eB = idx(eastM!.animals, bEastNorm);

  const westScore = westM!.matrix[wA][wB];
  const eastScore = eastM!.matrix[eA][eB];

  const { west_weight, east_weight, synergy_bonus, same_trine_bonus, conflict_penalty } = weights!;

  // Blend scores
  let score = Math.round(westScore * west_weight + eastScore * east_weight);

  // Synergy boost if both are strong
  if (westScore >= 75 && eastScore >= 75) score += synergy_bonus;

  // Same-trine bonus
  if (sameTrine(aEastNorm, bEastNorm)) score += same_trine_bonus;

  // Simple conflict heuristic
  const likelyClash = (westScore < 50 && eastScore < 50);
  if (likelyClash) score += conflict_penalty;

  // Clamp 0–100
  score = Math.max(0, Math.min(100, score));

  // Generate themes and warnings by tiers
  const themes: string[] = [];
  const warnings: string[] = [];

  if (score >= 85) themes.push("spark","brains");
  else if (score >= 75) themes.push("builder","spark");
  else if (score >= 65) themes.push("builder");
  else themes.push("cozy");

  if (westScore >= 85 || eastScore >= 85) themes.push("royal");
  if (westScore < 55) warnings.push("ego");
  if (eastScore < 55) warnings.push("pace");
  if (likelyClash) warnings.push("control","impulse");

  // Apply overrides last
  const key: PairKey = `${aWestNorm}_${aEastNorm}__${bWestNorm}_${bEastNorm}`;
  const rev: PairKey = `${bWestNorm}_${bEastNorm}__${aWestNorm}_${aEastNorm}`;
  const over = overrides!.pairs[key] || overrides!.pairs[rev];

  let label = generateLabel(score);
  let source: 'override' | 'computed' = 'computed';

  if (over) {
    if (typeof over.score === "number") score = over.score;
    if (over.themes) { themes.length = 0; themes.push(...over.themes); }
    if (over.warnings) { warnings.length = 0; warnings.push(...over.warnings); }
    source = 'override';
  }

  // Return with resolved labels for UI
  return {
    score,
    label,
    themes,
    warnings,
    themesText: themes.map(t => tags!.themes[t] || t),
    warningsText: warnings.map(w => tags!.warnings[w] || w),
    source
  };
}

// Alias for compatibility with existing code
export function getCompatibilityWithText(
  westSign1: string,
  eastAnimal1: string,
  westSign2: string,
  eastAnimal2: string
): Promise<CompatResult> {
  return computeCompatibility(westSign1, eastAnimal1, westSign2, eastAnimal2);
}
