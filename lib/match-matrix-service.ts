/**
 * Match Matrix Service
 * Server-side compatibility lookup with caching
 */

import { loadMatchMatrix, type MatchResult, type Combo } from "@/lib/loadMatchMatrix";

let matrix: Record<string, any> = {};
let isLoading = false;
let loadPromise: Promise<void> | null = null;

/**
 * Initialize the match matrix (call once on server startup)
 */
export async function initMatrix(): Promise<void> {
  // If already loaded, return immediately
  if (Object.keys(matrix).length > 0) {
    return;
  }

  // If currently loading, wait for that to complete
  if (isLoading && loadPromise) {
    return loadPromise;
  }

  // Start loading
  isLoading = true;
  loadPromise = (async () => {
    try {
      matrix = await loadMatchMatrix();
      console.log("🔮 Match matrix loaded:", Object.keys(matrix).length, "sign combinations");
    } catch (error) {
      console.error("Failed to load match matrix:", error);
      throw error;
    } finally {
      isLoading = false;
      loadPromise = null;
    }
  })();

  return loadPromise;
}

/**
 * Get compatibility between two zodiac sign combinations
 */
export async function getCompatibility(
  userSign: string,
  partnerSign: string
): Promise<MatchResult> {
  // Ensure matrix is loaded
  if (Object.keys(matrix).length === 0) {
    await initMatrix();
  }

  // Parse signs
  const userCombo = userSign as Combo;
  const partnerCombo = partnerSign as Combo;

  // Look up compatibility - FIX: Don't use userCombo twice
  const userMatches = matrix[userCombo];
  const matchData = userMatches?.[partnerCombo];

  if (!matchData) {
    console.warn(`No compatibility data found for ${userSign} and ${partnerSign}`);
    return {
      overall: 50,
      summary: "No data found",
      insight: ["Compatibility data not available for this combination."],
      scores: {
        core_vibe: 50,
        chemistry: 50,
        communication: 50,
        lifestyle: 50,
        long_term: 50,
        growth: 50,
      },
      color: "grey"
    };
  }

  return matchData;
}

/**
 * Get all matches for a user, sorted by compatibility
 */
export async function getAllMatchesForUser(
  userSign: string
): Promise<Array<{ partnerSign: string; match: MatchResult }>> {
  // Ensure matrix is loaded
  if (Object.keys(matrix).length === 0) {
    await initMatrix();
  }

  const userCombo = userSign as Combo;
  const userMatches = matrix[userCombo];

  if (!userMatches) {
    console.warn(`No match data found for ${userSign}`);
    return [];
  }

  const matches: Array<{ partnerSign: string; match: MatchResult }> = [];

  for (const [partnerSign, matchData] of Object.entries(userMatches)) {
    matches.push({
      partnerSign,
      match: matchData as MatchResult
    });
  }

  // Sort by overall score (descending)
  matches.sort((a, b) => b.match.overall - a.match.overall);

  return matches;
}

/**
 * Get top N matches for a user
 */
export async function getTopMatches(
  userSign: string,
  limit: number = 10
): Promise<Array<{ partnerSign: string; match: MatchResult }>> {
  const allMatches = await getAllMatchesForUser(userSign);
  return allMatches.slice(0, limit);
}

/**
 * Check if matrix is loaded
 */
export function isMatrixLoaded(): boolean {
  return Object.keys(matrix).length > 0;
}

/**
 * Get matrix stats
 */
export function getMatrixStats() {
  const totalCombos = Object.keys(matrix).length;
  let totalMatches = 0;
  
  for (const combo in matrix) {
    totalMatches += Object.keys(matrix[combo]).length;
  }

  return {
    totalCombinations: totalCombos,
    totalMatches,
    isLoaded: totalCombos > 0
  };
}

/**
 * Clear matrix cache (useful for testing)
 */
export function clearMatrix(): void {
  matrix = {};
  console.log("🧹 Match matrix cache cleared");
}

/**
 * Filter profiles by minimum compatibility score
 */
export async function filterByCompatibility(
  userSign: string,
  profiles: Array<{ id: string; westernSign: string; chineseSign: string }>,
  minScore: number = 60
): Promise<Array<{ id: string; compatibility: MatchResult }>> {
  const compatible: Array<{ id: string; compatibility: MatchResult }> = [];

  for (const profile of profiles) {
    const partnerSign = `${profile.westernSign}-${profile.chineseSign}`;
    const match = await getCompatibility(userSign, partnerSign);
    
    if (match.overall >= minScore) {
      compatible.push({
        id: profile.id,
        compatibility: match
      });
    }
  }

  // Sort by compatibility score (descending)
  compatible.sort((a, b) => b.compatibility.overall - a.compatibility.overall);

  return compatible;
}

