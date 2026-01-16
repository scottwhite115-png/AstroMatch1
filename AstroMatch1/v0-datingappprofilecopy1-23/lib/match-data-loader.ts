/**
 * Match Engine Data Loader
 * Utility to load pre-computed zodiac compatibility data
 */

import { readFileSync } from 'fs';
import { join } from 'path';

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
export function loadMatchData(westernSign: WesternSign): MatchData {
  // Check cache first
  if (matchDataCache.has(westernSign)) {
    return matchDataCache.get(westernSign)!;
  }

  // Load from file
  const filename = `out_${westernSign.toLowerCase()}.json`;
  const dataPath = join(process.cwd(), 'data', 'match-engine', filename);
  
  try {
    const fileContent = readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(fileContent) as MatchData;
    
    // Cache it
    matchDataCache.set(westernSign, data);
    
    return data;
  } catch (error) {
    console.error(`Failed to load match data for ${westernSign}:`, error);
    throw new Error(`Could not load match data for ${westernSign}`);
  }
}

/**
 * Get compatibility between two zodiac combinations
 */
export function getCompatibility(
  person1Western: WesternSign,
  person1Chinese: ChineseAnimal,
  person2Western: WesternSign,
  person2Chinese: ChineseAnimal
): MatchResult {
  const combo1 = `${person1Western}-${person1Chinese}` as Combo;
  const combo2 = `${person2Western}-${person2Chinese}` as Combo;
  
  // Load the match data for person1's western sign
  const matchData = loadMatchData(person1Western);
  
  // Get the specific compatibility
  if (matchData[combo1] && matchData[combo1][combo2]) {
    return matchData[combo1][combo2];
  }
  
  throw new Error(`Compatibility data not found for ${combo1} and ${combo2}`);
}

/**
 * Get all matches for a specific combo (useful for ranking potential matches)
 */
export function getAllMatches(
  westernSign: WesternSign,
  chineseAnimal: ChineseAnimal
): Array<{ combo: Combo; match: MatchResult }> {
  const combo = `${westernSign}-${chineseAnimal}` as Combo;
  const matchData = loadMatchData(westernSign);
  
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
export function preloadAllData(): void {
  const signs: WesternSign[] = [
    "Aries", "Taurus", "Gemini", "Cancer",
    "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  
  signs.forEach(sign => loadMatchData(sign));
  console.log(`Preloaded match data for all ${signs.length} western signs`);
}

