/**
 * React hook for fetching compatibility with client-side caching
 */

import { useState, useEffect } from "react";
import type { MatchResult } from "@/lib/loadMatchMatrix";
import { getCachedMatch, saveMatchToCache } from "@/lib/utils/cacheMatchResults";

interface UseCompatibilityResult {
  data: MatchResult | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Fetch compatibility between two zodiac combinations
 * Automatically caches results in localStorage
 */
export function useCompatibility(
  userSign: string | null,
  partnerSign: string | null
): UseCompatibilityResult {
  const [data, setData] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompatibility = async () => {
    if (!userSign || !partnerSign) {
      setData(null);
      return;
    }

    // Check cache first
    const cached = getCachedMatch(userSign, partnerSign);
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }

    // Fetch from server
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/compatibility?user=${encodeURIComponent(userSign)}&partner=${encodeURIComponent(partnerSign)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: MatchResult = await response.json();
      
      // Save to cache
      saveMatchToCache(userSign, partnerSign, result);
      
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch compatibility";
      setError(errorMessage);
      console.error("Error fetching compatibility:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompatibility();
  }, [userSign, partnerSign]);

  return {
    data,
    loading,
    error,
    refetch: fetchCompatibility,
  };
}

/**
 * Fetch compatibility for multiple partners at once
 */
export function useBatchCompatibility(
  userSign: string | null,
  partnerSigns: string[]
): {
  data: Map<string, MatchResult>;
  loading: boolean;
  error: string | null;
} {
  const [data, setData] = useState<Map<string, MatchResult>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userSign || partnerSigns.length === 0) {
      setData(new Map());
      return;
    }

    const fetchBatch = async () => {
      setLoading(true);
      setError(null);

      try {
        const results = new Map<string, MatchResult>();

        // Fetch all matches in parallel
        await Promise.all(
          partnerSigns.map(async (partnerSign) => {
            // Check cache first
            const cached = getCachedMatch(userSign, partnerSign);
            if (cached) {
              results.set(partnerSign, cached);
              return;
            }

            // Fetch from server
            const response = await fetch(
              `/api/compatibility?user=${encodeURIComponent(userSign)}&partner=${encodeURIComponent(partnerSign)}`
            );

            if (response.ok) {
              const result: MatchResult = await response.json();
              saveMatchToCache(userSign, partnerSign, result);
              results.set(partnerSign, result);
            }
          })
        );

        setData(results);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch compatibility";
        setError(errorMessage);
        console.error("Error fetching batch compatibility:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBatch();
  }, [userSign, JSON.stringify(partnerSigns)]);

  return { data, loading, error };
}

/**
 * Get compatibility score only (lighter weight)
 */
export function useCompatibilityScore(
  userSign: string | null,
  partnerSign: string | null
): {
  score: number | null;
  loading: boolean;
  error: string | null;
} {
  const { data, loading, error } = useCompatibility(userSign, partnerSign);

  return {
    score: data?.overall ?? null,
    loading,
    error,
  };
}

