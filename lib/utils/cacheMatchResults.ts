/**
 * Browser-side cache for compatibility lookups
 * Reduces server load by caching recent match results in localStorage
 */

import type { MatchResult } from "@/lib/loadMatchMatrix";

const CACHE_KEY = "astroMatchCache";
const MAX_CACHE = 50; // Increased limit for better performance
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CachedMatch {
  userSign: string;
  partnerSign: string;
  result: MatchResult;
  timestamp: number;
}

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

/**
 * Get cached compatibility result
 */
export function getCachedMatch(
  userSign: string,
  partnerSign: string
): MatchResult | null {
  if (!isBrowser()) return null;

  try {
    const cache: CachedMatch[] = JSON.parse(
      localStorage.getItem(CACHE_KEY) || "[]"
    );

    const now = Date.now();
    const cached = cache.find(
      (c) =>
        c.userSign === userSign &&
        c.partnerSign === partnerSign &&
        now - c.timestamp < CACHE_TTL_MS
    );

    return cached?.result || null;
  } catch (error) {
    console.error("Error reading match cache:", error);
    return null;
  }
}

/**
 * Save compatibility result to cache
 */
export function saveMatchToCache(
  userSign: string,
  partnerSign: string,
  result: MatchResult
): void {
  if (!isBrowser()) return;

  try {
    const cache: CachedMatch[] = JSON.parse(
      localStorage.getItem(CACHE_KEY) || "[]"
    );

    // Remove any existing duplicate
    const filtered = cache.filter(
      (c) => !(c.userSign === userSign && c.partnerSign === partnerSign)
    );

    // Prepend the new entry
    filtered.unshift({
      userSign,
      partnerSign,
      result,
      timestamp: Date.now(),
    });

    // Limit cache size
    const trimmed = filtered.slice(0, MAX_CACHE);

    localStorage.setItem(CACHE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error("Error saving to match cache:", error);
  }
}

/**
 * Clear expired cache entries
 */
export function cleanExpiredCache(): void {
  if (!isBrowser()) return;

  try {
    const cache: CachedMatch[] = JSON.parse(
      localStorage.getItem(CACHE_KEY) || "[]"
    );

    const now = Date.now();
    const valid = cache.filter((c) => now - c.timestamp < CACHE_TTL_MS);

    localStorage.setItem(CACHE_KEY, JSON.stringify(valid));
  } catch (error) {
    console.error("Error cleaning match cache:", error);
  }
}

/**
 * Clear all cached matches
 */
export function clearMatchCache(): void {
  if (!isBrowser()) return;

  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.error("Error clearing match cache:", error);
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats(): {
  total: number;
  valid: number;
  expired: number;
  size: string;
} | null {
  if (!isBrowser()) return null;

  try {
    const cache: CachedMatch[] = JSON.parse(
      localStorage.getItem(CACHE_KEY) || "[]"
    );

    const now = Date.now();
    const valid = cache.filter((c) => now - c.timestamp < CACHE_TTL_MS);
    const expired = cache.length - valid.length;

    // Calculate approximate size in KB
    const cacheStr = localStorage.getItem(CACHE_KEY) || "[]";
    const sizeKB = new Blob([cacheStr]).size / 1024;

    return {
      total: cache.length,
      valid: valid.length,
      expired,
      size: `${sizeKB.toFixed(2)} KB`,
    };
  } catch (error) {
    console.error("Error getting cache stats:", error);
    return null;
  }
}

/**
 * Get all cached user signs (for user profiles)
 */
export function getCachedUserSigns(): string[] {
  if (!isBrowser()) return [];

  try {
    const cache: CachedMatch[] = JSON.parse(
      localStorage.getItem(CACHE_KEY) || "[]"
    );

    const now = Date.now();
    const uniqueSigns = new Set<string>();

    cache.forEach((c) => {
      if (now - c.timestamp < CACHE_TTL_MS) {
        uniqueSigns.add(c.userSign);
      }
    });

    return Array.from(uniqueSigns);
  } catch (error) {
    console.error("Error getting cached user signs:", error);
    return [];
  }
}

/**
 * Batch get cached matches for multiple partners
 */
export function getBatchCachedMatches(
  userSign: string,
  partnerSigns: string[]
): Map<string, MatchResult> {
  const results = new Map<string, MatchResult>();

  if (!isBrowser()) return results;

  try {
    const cache: CachedMatch[] = JSON.parse(
      localStorage.getItem(CACHE_KEY) || "[]"
    );

    const now = Date.now();
    const validCache = cache.filter((c) => now - c.timestamp < CACHE_TTL_MS);

    partnerSigns.forEach((partnerSign) => {
      const match = validCache.find(
        (c) => c.userSign === userSign && c.partnerSign === partnerSign
      );
      if (match) {
        results.set(partnerSign, match.result);
      }
    });

    return results;
  } catch (error) {
    console.error("Error getting batch cached matches:", error);
    return results;
  }
}

/**
 * Hook-friendly wrapper for cache operations
 */
export const matchCache = {
  get: getCachedMatch,
  set: saveMatchToCache,
  clear: clearMatchCache,
  clean: cleanExpiredCache,
  stats: getCacheStats,
  batch: getBatchCachedMatches,
};

