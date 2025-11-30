// /data/featuredMatches.ts
// Featured matches configuration for specific sign combinations
// Shows curated matches at different tier levels

export interface FeaturedMatchesConfig {
  featured_matches: {
    [signCombination: string]: {
      [tier: string]: string[];
    };
  };
}

export const FEATURED_MATCHES: FeaturedMatchesConfig = {
  featured_matches: {
    aquarius_monkey: {
      soulmate: ["gemini_rat", "libra_rat", "libra_dragon"],
      twin_flame: ["aquarius_rat", "aries_dragon", "sagittarius_dragon", "aries_rat", "sagittarius_rat"]
    }
  }
};

/**
 * Get featured matches for a specific sign combination and tier
 * @param signCombination - e.g., "aquarius_monkey"
 * @param tier - e.g., "soulmate", "twin_flame"
 * @returns Array of featured match sign combinations, or empty array if none found
 */
export function getFeaturedMatches(
  signCombination: string,
  tier: string
): string[] {
  const normalized = signCombination.toLowerCase();
  return FEATURED_MATCHES.featured_matches[normalized]?.[tier] || [];
}

/**
 * Get all featured matches for a specific sign combination across all tiers
 * @param signCombination - e.g., "aquarius_monkey"
 * @returns Object with tier keys and arrays of featured matches, or empty object if none found
 */
export function getAllFeaturedMatchesForSign(
  signCombination: string
): Record<string, string[]> {
  const normalized = signCombination.toLowerCase();
  return FEATURED_MATCHES.featured_matches[normalized] || {};
}

/**
 * Check if a match is featured for a given sign combination
 * @param userSignCombination - e.g., "aquarius_monkey"
 * @param matchSignCombination - e.g., "gemini_rat"
 * @param tier - Optional tier to check (if not provided, checks all tiers)
 * @returns true if the match is featured, false otherwise
 */
export function isFeaturedMatch(
  userSignCombination: string,
  matchSignCombination: string,
  tier?: string
): boolean {
  const normalized = userSignCombination.toLowerCase();
  const matchNormalized = matchSignCombination.toLowerCase();
  const featured = FEATURED_MATCHES.featured_matches[normalized];
  
  if (!featured) return false;
  
  if (tier) {
    // Check specific tier
    return featured[tier]?.includes(matchNormalized) || false;
  } else {
    // Check all tiers
    return Object.values(featured).some(tierMatches => 
      tierMatches.includes(matchNormalized)
    );
  }
}

