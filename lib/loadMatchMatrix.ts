// loadMatchMatrix.ts
// Loads all 12 JSON files and merges them into a single lookup object.

export type WesternSign = 
  | "Aries" | "Taurus" | "Gemini" | "Cancer" 
  | "Leo" | "Virgo" | "Libra" | "Scorpio" 
  | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces";

export type ChineseAnimal = 
  | "Rat" | "Ox" | "Tiger" | "Rabbit" 
  | "Dragon" | "Snake" | "Horse" | "Goat" 
  | "Monkey" | "Rooster" | "Dog" | "Pig";

export type Combo = `${WesternSign}-${ChineseAnimal}`;

export interface MatchScores {
  core_vibe: number;
  chemistry: number;
  communication: number;
  lifestyle: number;
  long_term: number;
  growth: number;
}

export interface MatchResult {
  overall: number;
  summary: string;
  insight: string[];
  scores: MatchScores;
  color: "green" | "yellow" | "red" | "grey";
}

export type MatchMatrix = Record<Combo, Record<Combo, MatchResult>>;

// Singleton cache
let matchMatrixCache: MatchMatrix | null = null;

/**
 * Load all match data files and merge into a single object
 */
export async function loadMatchMatrix(): Promise<MatchMatrix> {
  // Return cached data if available
  if (matchMatrixCache) {
    return matchMatrixCache;
  }

  const index = [
    "out_aries.json",
    "out_taurus.json",
    "out_gemini.json",
    "out_cancer.json",
    "out_leo.json",
    "out_virgo.json",
    "out_libra.json",
    "out_scorpio.json",
    "out_sagittarius.json",
    "out_capricorn.json",
    "out_aquarius.json",
    "out_pisces.json"
  ];

  const allData: MatchMatrix = {} as MatchMatrix;

  for (const file of index) {
    const module = await import(`../data/match-engine/${file}`);
    Object.assign(allData, module.default || module);
  }

  // Cache the result
  matchMatrixCache = allData;

  return allData;
}

/**
 * Get compatibility between two zodiac combinations
 */
export async function getCompatibility(
  person1Western: WesternSign,
  person1Chinese: ChineseAnimal,
  person2Western: WesternSign,
  person2Chinese: ChineseAnimal
): Promise<MatchResult> {
  const combo1 = `${person1Western}-${person1Chinese}` as Combo;
  const combo2 = `${person2Western}-${person2Chinese}` as Combo;
  
  const matrix = await loadMatchMatrix();
  
  if (matrix[combo1]?.[combo2]) {
    return matrix[combo1][combo2];
  }
  
  throw new Error(`Compatibility data not found for ${combo1} and ${combo2}`);
}

/**
 * Get all matches for a specific combo, sorted by compatibility
 */
export async function getAllMatches(
  westernSign: WesternSign,
  chineseAnimal: ChineseAnimal
): Promise<Array<{ combo: Combo; match: MatchResult }>> {
  const combo = `${westernSign}-${chineseAnimal}` as Combo;
  const matrix = await loadMatchMatrix();
  
  if (!matrix[combo]) {
    throw new Error(`No match data found for ${combo}`);
  }
  
  const matches: Array<{ combo: Combo; match: MatchResult }> = [];
  
  for (const [otherCombo, matchResult] of Object.entries(matrix[combo])) {
    matches.push({
      combo: otherCombo as Combo,
      match: matchResult
    });
  }
  
  // Sort by overall score (descending)
  matches.sort((a, b) => b.match.overall - a.match.overall);
  
  return matches;
}

/**
 * Get top N best matches for a specific combo
 */
export async function getTopMatches(
  westernSign: WesternSign,
  chineseAnimal: ChineseAnimal,
  limit: number = 10
): Promise<Array<{ combo: Combo; match: MatchResult }>> {
  const allMatches = await getAllMatches(westernSign, chineseAnimal);
  return allMatches.slice(0, limit);
}

/**
 * Clear the cache (useful for testing)
 */
export function clearCache(): void {
  matchMatrixCache = null;
}

/**
 * Check if two combos are highly compatible (80+ score)
 */
export async function areHighlyCompatible(
  person1Western: WesternSign,
  person1Chinese: ChineseAnimal,
  person2Western: WesternSign,
  person2Chinese: ChineseAnimal
): Promise<boolean> {
  const result = await getCompatibility(person1Western, person1Chinese, person2Western, person2Chinese);
  return result.overall >= 80;
}

/**
 * Get compatibility level as a string
 */
export function getCompatibilityLevel(score: number): string {
  if (score >= 90) return "Exceptional Match";
  if (score >= 80) return "Great Match";
  if (score >= 70) return "Good Potential";
  if (score >= 60) return "Mixed / Workable";
  if (score >= 50) return "Challenging";
  return "Hard Work";
}

/**
 * Parse combo string into western and chinese parts
 */
export function parseCombo(combo: Combo): { western: WesternSign; chinese: ChineseAnimal } {
  const [western, chinese] = combo.split('-') as [WesternSign, ChineseAnimal];
  return { western, chinese };
}

