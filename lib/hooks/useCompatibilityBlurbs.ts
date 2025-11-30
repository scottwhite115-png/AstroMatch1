"use client"

/**
 * React hook for compatibility with pre-generated blurbs
 */

import { useState, useEffect } from "react"
import { getCompatibilityWithBlurb, getCompatibilitySync } from "@/lib/compatibilityWithBlurbs"

export interface CompatibilityData {
  score: number
  blurb: string
  tier: string
  loading: boolean
  error: string | null
}

/**
 * Hook to get compatibility between two zodiac combinations
 */
export function useCompatibility(
  westA: string | null,
  eastA: string | null,
  westB: string | null,
  eastB: string | null
): CompatibilityData {
  const [data, setData] = useState<CompatibilityData>({
    score: 0,
    blurb: "",
    tier: "",
    loading: true,
    error: null
  })

  useEffect(() => {
    if (!westA || !eastA || !westB || !eastB) {
      setData({
        score: 0,
        blurb: "Missing zodiac information",
        tier: "Unknown",
        loading: false,
        error: "Incomplete zodiac data"
      })
      return
    }

    // Try sync first (if already loaded)
    const syncResult = getCompatibilitySync(westA, eastA, westB, eastB)
    if (syncResult) {
      setData({
        ...syncResult,
        loading: false,
        error: null
      })
      return
    }

    // Load async
    setData(prev => ({ ...prev, loading: true }))
    
    getCompatibilityWithBlurb(westA, eastA, westB, eastB)
      .then(result => {
        setData({
          score: result.score,
          blurb: result.blurb,
          tier: result.tier,
          loading: false,
          error: null
        })
      })
      .catch(err => {
        console.error("Error loading compatibility:", err)
        setData({
          score: 0,
          blurb: "Unable to load compatibility",
          tier: "Unknown",
          loading: false,
          error: err.message
        })
      })
  }, [westA, eastA, westB, eastB])

  return data
}

/**
 * Hook for batch compatibility lookups
 * Useful for profile lists
 */
export function useBatchCompatibility(
  userWest: string | null,
  userEast: string | null,
  profiles: Array<{ id: string; westernSign: string; easternSign: string }>
): Map<string, { score: number; blurb: string; tier: string }> {
  const [compatibilityMap, setCompatibilityMap] = useState<Map<string, any>>(new Map())

  useEffect(() => {
    if (!userWest || !userEast || profiles.length === 0) return

    const loadBatch = async () => {
      const newMap = new Map()
      
      for (const profile of profiles) {
        try {
          const result = await getCompatibilityWithBlurb(
            userWest,
            userEast,
            profile.westernSign,
            profile.easternSign
          )
          newMap.set(profile.id, {
            score: result.score,
            blurb: result.blurb,
            tier: result.tier
          })
        } catch (err) {
          console.error(`Failed to load compatibility for ${profile.id}:`, err)
        }
      }
      
      setCompatibilityMap(newMap)
    }

    loadBatch()
  }, [userWest, userEast, profiles])

  return compatibilityMap
}


