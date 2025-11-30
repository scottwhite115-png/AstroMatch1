/**
 * Advanced User Ranking Algorithm
 * Combines compatibility, distance, and activity recency into a weighted score
 */

import { kmBetween } from "@/lib/utils/haversine";
import { getCompatibility } from "@/lib/match-matrix-service";
import { saveMatchToCache } from "@/lib/utils/cacheMatchResults";
import type { MatchResult } from "@/lib/loadMatchMatrix";

export type UserLite = {
  id: string;
  westEast: string;   // e.g. "Aquarius-Monkey"
  lat: number;
  lon: number;
  lastActive?: number; // epoch ms
  photo?: string;
  [key: string]: any; // Additional profile fields
};

export type RankOptions = {
  limit?: number;              // how many to return
  maxDistanceKm?: number;      // hard cutoff
  weights?: {                  // overall score = wC*compat + wD*distance + wA*activity
    compat: number;            // default 0.7
    distance: number;          // default 0.2
    activity: number;          // default 0.1
  };
  distanceCurveKm?: number;    // distance soft-decay, default 50 km (lower = steeper)
  activityHalfLifeHrs?: number;// activity half-life for freshness, default 48h
};

export type RankedUser = {
  id: string;
  user: UserLite;
  km: number;
  compat: MatchResult;
  distance_score: number;
  activity_score: number;
  overall: number;
  color: "green" | "yellow" | "red" | "grey";
};

const DEFAULTS: Required<RankOptions> = {
  limit: 24,
  maxDistanceKm: 300, // tweak per market density
  weights: { compat: 0.7, distance: 0.2, activity: 0.1 },
  distanceCurveKm: 50,
  activityHalfLifeHrs: 48,
};

/**
 * Distance scoring with exponential decay
 * Returns 1.0 at 0km, ~0.5 at curve km, approaches 0 at infinity
 */
function distanceScore(km: number, curve: number): number {
  return 1 / (1 + km / curve);
}

/**
 * Activity scoring with exponential decay
 * Returns 1.0 for "now", 0.5 at half-life, approaches 0 for very old
 */
function activityScore(lastActive?: number, halfLifeHrs: number = 48): number {
  if (!lastActive) return 0.5; // neutral for unknown
  const ageHrs = (Date.now() - lastActive) / 36e5; // 36e5 = milliseconds in hour
  // exponential decay: 0.5^(age/halfLife)
  return Math.max(0, Math.min(1, Math.pow(0.5, ageHrs / halfLifeHrs)));
}

/**
 * Rank nearby users by weighted combination of compatibility, distance, and activity
 */
export async function rankNearbyUsers(
  me: UserLite,
  candidates: UserLite[],
  opts?: RankOptions
): Promise<RankedUser[]> {
  const o: Required<RankOptions> = {
    ...DEFAULTS,
    ...(opts || {}),
    weights: { ...DEFAULTS.weights, ...(opts?.weights || {}) }
  };

  // Pre-filter by distance hard cutoff
  const within = candidates
    .map(c => ({ c, km: kmBetween(me, c) }))
    .filter(x => x.km <= o.maxDistanceKm);

  // Compute compatibility + composed score
  const enriched = await Promise.all(
    within.map(async ({ c, km }) => {
      const compat = await getCompatibility(me.westEast, c.westEast);
      const ds = distanceScore(km, o.distanceCurveKm);
      const as = activityScore(c.lastActive, o.activityHalfLifeHrs);

      // normalize compat.overall [0..100] -> [0..1]
      const compNorm = Math.max(0, Math.min(1, compat.overall / 100));

      const overall =
        o.weights.compat * compNorm +
        o.weights.distance * ds +
        o.weights.activity * as;

      // opportunistic cache (so profile pages load instantly)
      saveMatchToCache(me.westEast, c.westEast, compat);

      return {
        id: c.id,
        user: c,
        km,
        compat,
        distance_score: ds,
        activity_score: as,
        overall: Number(overall.toFixed(4)),
        color: compat.color,
      };
    })
  );

  // Sort by overall DESC, then compat DESC, then distance ASC
  enriched.sort((a, b) =>
    b.overall - a.overall ||
    b.compat.overall - a.compat.overall ||
    a.km - b.km
  );

  // Trim to limit
  return enriched.slice(0, o.limit);
}

/**
 * Rank with custom strategy presets
 */
export const rankingStrategies = {
  /**
   * Balanced - Default strategy (70% compat, 20% distance, 10% activity)
   */
  balanced: (me: UserLite, candidates: UserLite[], limit?: number) =>
    rankNearbyUsers(me, candidates, { limit }),

  /**
   * Soulmate - Pure compatibility focus (95% compat, 5% activity)
   */
  soulmate: (me: UserLite, candidates: UserLite[], limit?: number) =>
    rankNearbyUsers(me, candidates, {
      limit,
      maxDistanceKm: 1000, // Ignore distance mostly
      weights: { compat: 0.95, distance: 0, activity: 0.05 },
    }),

  /**
   * Nearby - Prioritize proximity (40% compat, 50% distance, 10% activity)
   */
  nearby: (me: UserLite, candidates: UserLite[], limit?: number) =>
    rankNearbyUsers(me, candidates, {
      limit,
      maxDistanceKm: 50,
      weights: { compat: 0.4, distance: 0.5, activity: 0.1 },
      distanceCurveKm: 15, // Steeper distance decay
    }),

  /**
   * Active - Prioritize recent users (50% compat, 20% distance, 30% activity)
   */
  active: (me: UserLite, candidates: UserLite[], limit?: number) =>
    rankNearbyUsers(me, candidates, {
      limit,
      weights: { compat: 0.5, distance: 0.2, activity: 0.3 },
      activityHalfLifeHrs: 24, // Faster activity decay
    }),

  /**
   * Discovery - More variety (60% compat, 30% distance, 10% activity)
   */
  discovery: (me: UserLite, candidates: UserLite[], limit?: number) =>
    rankNearbyUsers(me, candidates, {
      limit,
      maxDistanceKm: 200,
      weights: { compat: 0.6, distance: 0.3, activity: 0.1 },
      distanceCurveKm: 100, // Gentler distance decay
    }),
};

/**
 * Get score breakdown for UI display
 */
export function getScoreBreakdown(ranked: RankedUser, weights = DEFAULTS.weights) {
  const compNorm = ranked.compat.overall / 100;
  return {
    compatibility: {
      raw: ranked.compat.overall,
      normalized: Number(compNorm.toFixed(3)),
      contribution: Number((compNorm * weights.compat).toFixed(3)),
    },
    distance: {
      km: ranked.km,
      score: ranked.distance_score,
      contribution: Number((ranked.distance_score * weights.distance).toFixed(3)),
    },
    activity: {
      score: ranked.activity_score,
      contribution: Number((ranked.activity_score * weights.activity).toFixed(3)),
    },
    overall: ranked.overall,
  };
}

/**
 * Format ranking for display
 */
export function formatRanking(ranked: RankedUser): string {
  const breakdown = getScoreBreakdown(ranked);
  return `
Overall: ${(ranked.overall * 100).toFixed(1)}%
├─ Compatibility: ${breakdown.compatibility.raw}% (contributes ${(breakdown.compatibility.contribution * 100).toFixed(1)}%)
├─ Distance: ${ranked.km.toFixed(1)}km (contributes ${(breakdown.distance.contribution * 100).toFixed(1)}%)
└─ Activity: ${(ranked.activity_score * 100).toFixed(0)}% (contributes ${(breakdown.activity.contribution * 100).toFixed(1)}%)
  `.trim();
}

