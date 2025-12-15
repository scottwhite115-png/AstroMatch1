/**
 * Browser-compatible Match Engine Data Loader
 * Uses dynamic imports instead of fs module for Next.js compatibility
 */

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

export type WesternSign = 
  | "Aries" | "Taurus" | "Gemini" | "Cancer" 
  | "Leo" | "Virgo" | "Libra" | "Scorpio" 
  | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces";

export type ChineseAnimal = 
  | "Rat" | "Ox" | "Tiger" | "Rabbit" 
  | "Dragon" | "Snake" | "Horse" | "Goat" 
  | "Monkey" | "Rooster" | "Dog" | "Pig";

export type Combo = `${WesternSign}-${ChineseAnimal}`;

export interface MatchData {
  [key: Combo]: {
    [key: Combo]: MatchResult;
  };
}

// Cache for loaded match data
const matchDataCache = new Map<WesternSign, MatchData>();

/**
 * Load match data for a specific western sign
 */
export async function loadMatchData(westernSign: WesternSign): Promise<MatchData> {
  // Check cache first
  if (matchDataCache.has(westernSign)) {
    return matchDataCache.get(westernSign)!;
  }

  // Dynamic import based on western sign
  let data: MatchData;
  
  switch (westernSign) {
    case "Aries":
      data = (await import('@/data/match-engine/out_aries.json')).default;
      break;
    case "Taurus":
      data = (await import('@/data/match-engine/out_taurus.json')).default;
      break;
    case "Gemini":
      data = (await import('@/data/match-engine/out_gemini.json')).default;
      break;
    case "Cancer":
      data = (await import('@/data/match-engine/out_cancer.json')).default;
      break;
    case "Leo":
      data = (await import('@/data/match-engine/out_leo.json')).default;
      break;
    case "Virgo":
      data = (await import('@/data/match-engine/out_virgo.json')).default;
      break;
    case "Libra":
      data = (await import('@/data/match-engine/out_libra.json')).default;
      break;
    case "Scorpio":
      data = (await import('@/data/match-engine/out_scorpio.json')).default;
      break;
    case "Sagittarius":
      data = (await import('@/data/match-engine/out_sagittarius.json')).default;
      break;
    case "Capricorn":
      data = (await import('@/data/match-engine/out_capricorn.json')).default;
      break;
    case "Aquarius":
      data = (await import('@/data/match-engine/out_aquarius.json')).default;
      break;
    case "Pisces":
      data = (await import('@/data/match-engine/out_pisces.json')).default;
      break;
  }
  
  // Cache it
  matchDataCache.set(westernSign, data);
  
  return data;
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
  
  // Load the match data for person1's western sign
  const matchData = await loadMatchData(person1Western);
  
  // Get the specific compatibility
  if (matchData[combo1] && matchData[combo1][combo2]) {
    return matchData[combo1][combo2];
  }
  
  throw new Error(`Compatibility data not found for ${combo1} and ${combo2}`);
}

/**
 * Get all matches for a specific combo (useful for ranking potential matches)
 */
export async function getAllMatches(
  westernSign: WesternSign,
  chineseAnimal: ChineseAnimal
): Promise<Array<{ combo: Combo; match: MatchResult }>> {
  const combo = `${westernSign}-${chineseAnimal}` as Combo;
  const matchData = await loadMatchData(westernSign);
  
  if (!matchData[combo]) {
    throw new Error(`No match data found for ${combo}`);
  }
  
  const matches: Array<{ combo: Combo; match: MatchResult }> = [];
  
  for (const [otherCombo, matchResult] of Object.entries(matchData[combo])) {
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
 * Clear the cache (useful for testing or memory management)
 */
export function clearCache(): void {
  matchDataCache.clear();
}

/**
 * Preload all match data (useful for production to avoid runtime loading delays)
 */
export async function preloadAllData(): Promise<void> {
  const signs: WesternSign[] = [
    "Aries", "Taurus", "Gemini", "Cancer",
    "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  
  await Promise.all(signs.map(sign => loadMatchData(sign)));
  console.log(`Preloaded match data for all ${signs.length} western signs`);
}

