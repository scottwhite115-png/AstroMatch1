/**
 * Location-aware matching utilities
 * Combines compatibility scoring with geographic distance
 */

import { kmBetween, filterByDistance } from "@/lib/utils/haversine";
import { getCompatibility } from "@/lib/match-matrix-service";
import type { MatchResult } from "@/lib/loadMatchMatrix";

export interface LocationProfile {
  id: string;
  westernSign: string;
  chineseSign: string;
  lat: number;
  lon: number;
  [key: string]: any; // Additional profile fields
}

export interface ScoredMatch extends LocationProfile {
  distance: number;
  compatibility: MatchResult;
  overallScore: number; // Weighted combination of compatibility and distance
}

/**
 * Calculate weighted match score based on compatibility and distance
 * Default: 70% compatibility, 30% proximity
 */
export function calculateMatchScore(
  compatibilityScore: number,
  distanceKm: number,
  maxDistanceKm: number = 100,
  compatibilityWeight: number = 0.7
): number {
  // Normalize distance to 0-100 scale (closer = higher score)
  const distanceScore = Math.max(0, 100 - (distanceKm / maxDistanceKm) * 100);
  
  // Weighted combination
  const proxi
mityWeight = 1 - compatibilityWeight;
  const overallScore = 
    compatibilityScore * compatibilityWeight +
    distanceScore * proximityWeight;
  
  return Math.round(overallScore);
}

/**
 * Find matches within a radius, sorted by compatibility
 */
export async function findMatchesNearby(
  userSign: string,
  userLocation: { lat: number; lon: number },
  profiles: LocationProfile[],
  radiusKm: number = 50,
  minCompatibility: number = 60
): Promise<ScoredMatch[]> {
  // Filter by distance first
  const nearby = filterByDistance(userLocation, profiles, radiusKm);
  
  // Calculate compatibility for each nearby profile
  const scoredMatches = await Promise.all(
    nearby.map(async (profile) => {
      const partnerSign = `${profile.westernSign}-${profile.chineseSign}`;
      const compatibility = await getCompatibility(userSign, partnerSign);
      
      // Calculate combined score
      const overallScore = calculateMatchScore(
        compatibility.overall,
        profile.distance,
        radiusKm
      );
      
      return {
        ...profile,
        compatibility,
        overallScore,
      };
    })
  );
  
  // Filter by minimum compatibility and sort by overall score
  return scoredMatches
    .filter((match) => match.compatibility.overall >= minCompatibility)
    .sort((a, b) => b.overallScore - a.overallScore);
}

/**
 * Get top N matches balancing compatibility and distance
 */
export async function getTopLocalMatches(
  userSign: string,
  userLocation: { lat: number; lon: number },
  profiles: LocationProfile[],
  options: {
    limit?: number;
    maxDistanceKm?: number;
    minCompatibility?: number;
    compatibilityWeight?: number;
  } = {}
): Promise<ScoredMatch[]> {
  const {
    limit = 10,
    maxDistanceKm = 100,
    minCompatibility = 60,
    compatibilityWeight = 0.7,
  } = options;
  
  // Get all nearby matches
  const matches = await findMatchesNearby(
    userSign,
    userLocation,
    profiles,
    maxDistanceKm,
    minCompatibility
  );
  
  // Recalculate scores with custom weight
  if (compatibilityWeight !== 0.7) {
    matches.forEach((match) => {
      match.overallScore = calculateMatchScore(
        match.compatibility.overall,
        match.distance,
        maxDistanceKm,
        compatibilityWeight
      );
    });
    
    matches.sort((a, b) => b.overallScore - a.overallScore);
  }
  
  return matches.slice(0, limit);
}

/**
 * Group matches by distance ranges
 */
export function groupMatchesByDistance(
  matches: ScoredMatch[]
): {
  nearby: ScoredMatch[];      // 0-10 km
  local: ScoredMatch[];       // 10-25 km
  regional: ScoredMatch[];    // 25-50 km
  distant: ScoredMatch[];     // 50+ km
} {
  return {
    nearby: matches.filter((m) => m.distance <= 10),
    local: matches.filter((m) => m.distance > 10 && m.distance <= 25),
    regional: matches.filter((m) => m.distance > 25 && m.distance <= 50),
    distant: matches.filter((m) => m.distance > 50),
  };
}

/**
 * Find highly compatible matches regardless of distance
 */
export async function findSoulmates(
  userSign: string,
  userLocation: { lat: number; lon: number },
  profiles: LocationProfile[],
  minCompatibility: number = 90
): Promise<ScoredMatch[]> {
  const matches = await Promise.all(
    profiles.map(async (profile) => {
      const partnerSign = `${profile.westernSign}-${profile.chineseSign}`;
      const compatibility = await getCompatibility(userSign, partnerSign);
      const distance = kmBetween(userLocation, profile);
      
      return {
        ...profile,
        distance,
        compatibility,
        overallScore: compatibility.overall, // Pure compatibility, no distance factor
      };
    })
  );
  
  return matches
    .filter((match) => match.compatibility.overall >= minCompatibility)
    .sort((a, b) => {
      // Sort by compatibility first, then by distance
      if (b.compatibility.overall !== a.compatibility.overall) {
        return b.compatibility.overall - a.compatibility.overall;
      }
      return a.distance - b.distance;
    });
}

/**
 * Calculate distance penalty (for UI display)
 */
export function getDistancePenalty(distanceKm: number): {
  penalty: number;
  description: string;
} {
  if (distanceKm <= 10) {
    return { penalty: 0, description: "Nearby - Easy to meet" };
  } else if (distanceKm <= 25) {
    return { penalty: 5, description: "Local - Worth the drive" };
  } else if (distanceKm <= 50) {
    return { penalty: 10, description: "Regional - Plan ahead" };
  } else if (distanceKm <= 100) {
    return { penalty: 15, description: "Distant - Special trips" };
  } else {
    return { penalty: 25, description: "Very far - Consider carefully" };
  }
}

/**
 * Optimize search radius based on available matches
 */
export async function findOptimalRadius(
  userSign: string,
  userLocation: { lat: number; lon: number },
  profiles: LocationProfile[],
  targetMatches: number = 10,
  minCompatibility: number = 70
): Promise<{
  radiusKm: number;
  matchCount: number;
  avgCompatibility: number;
}> {
  const radii = [10, 25, 50, 100, 200];
  
  for (const radius of radii) {
    const matches = await findMatchesNearby(
      userSign,
      userLocation,
      profiles,
      radius,
      minCompatibility
    );
    
    if (matches.length >= targetMatches) {
      const avgCompatibility =
        matches.reduce((sum, m) => sum + m.compatibility.overall, 0) /
        matches.length;
      
      return {
        radiusKm: radius,
        matchCount: matches.length,
        avgCompatibility: Math.round(avgCompatibility),
      };
    }
  }
  
  // If no radius has enough matches, return the largest
  const matches = await findMatchesNearby(
    userSign,
    userLocation,
    profiles,
    200,
    minCompatibility
  );
  
  return {
    radiusKm: 200,
    matchCount: matches.length,
    avgCompatibility: matches.length > 0
      ? Math.round(
          matches.reduce((sum, m) => sum + m.compatibility.overall, 0) /
            matches.length
        )
      : 0,
  };
}

