/**
 * Central loader module - re-exports all data loading utilities
 */

export { getCompatibility, initMatrix } from "@/lib/match-matrix-service";
export { loadMatchMatrix } from "@/lib/loadMatchMatrix";
export type { MatchResult, MatchScores, Combo } from "@/lib/loadMatchMatrix";
export { getCachedMatch, saveMatchToCache, matchCache } from "@/lib/utils/cacheMatchResults";
export { kmBetween, milesBetween, isWithinRadius } from "@/lib/utils/haversine";

