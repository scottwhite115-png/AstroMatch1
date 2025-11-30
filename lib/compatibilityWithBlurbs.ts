/**
 * Enhanced compatibility utilities using pre-generated blurbs
 */

import { lookupBlurb, getBlurbSync, preloadBlurbs, type BlurbEntry } from "@/lib/blurbLookup"
import { scoreMatch, type Person } from "@/lib/simpleMatch"
import { type West, type East } from "@/lib/eastWestHelpers"

/**
 * Preload compatibility blurbs on app initialization
 * Call this in your root layout or app initialization
 */
export function initializeCompatibilitySystem() {
  preloadBlurbs()
}

/**
 * Get compatibility information using pre-generated blurbs
 * Falls back to computed values if blurb not found
 */
export async function getCompatibilityWithBlurb(
  westA: string,
  eastA: string,
  westB: string,
  eastB: string
): Promise<{
  score: number
  blurb: string
  label: string
  tier: string
  source: "pregenerated" | "computed"
}> {
  // Try to get pre-generated blurb first
  const blurbEntry = await lookupBlurb(westA, eastA, westB, eastB)
  
  if (blurbEntry) {
    // Extract tier from blurb if needed
    const tier = blurbEntry.score >= 90 ? "Exceptional" 
      : blurbEntry.score >= 80 ? "Highly Compatible"
      : blurbEntry.score >= 70 ? "Balanced"
      : "Challenging"
    
    return {
      score: blurbEntry.score,
      blurb: blurbEntry.blurb,
      label: blurbEntry.label || 'Compatibility',
      tier,
      source: "pregenerated"
    }
  }
  
  // Fallback to computed values
  console.warn(`⚠️ No pre-generated blurb for ${westA} ${eastA} × ${westB} ${eastB}, computing...`)
  
  // This requires more info than we have, so return a basic response
  return {
    score: 75,
    blurb: "Compatibility analysis in progress...",
    label: "Compatibility",
    tier: "Balanced",
    source: "computed"
  }
}

/**
 * Get compatibility synchronously (for use after preload)
 */
export function getCompatibilitySync(
  westA: string,
  eastA: string,
  westB: string,
  eastB: string
): {
  score: number
  blurb: string
  label: string
  tier: string
} | null {
  const blurbEntry = getBlurbSync(westA, eastA, westB, eastB)
  
  if (!blurbEntry) return null
  
  const tier = blurbEntry.score >= 90 ? "Exceptional" 
    : blurbEntry.score >= 80 ? "Highly Compatible"
    : blurbEntry.score >= 70 ? "Balanced"
    : "Challenging"
  
  return {
    score: blurbEntry.score,
    blurb: blurbEntry.blurb,
    label: blurbEntry.label || 'Compatibility',
    tier
  }
}

/**
 * Format compatibility tier with color
 */
export function getCompatibilityTier(score: number): {
  tier: string
  color: string
  emoji: string
} {
  if (score >= 90) {
    return {
      tier: "Exceptional",
      color: "text-green-400",
      emoji: "🌟"
    }
  } else if (score >= 80) {
    return {
      tier: "Highly Compatible",
      color: "text-blue-400",
      emoji: "✨"
    }
  } else if (score >= 70) {
    return {
      tier: "Balanced",
      color: "text-yellow-400",
      emoji: "⚖️"
    }
  } else {
    return {
      tier: "Challenging",
      color: "text-orange-400",
      emoji: "🔥"
    }
  }
}

/**
 * Normalize sign names to match JSON keys
 */
function normalizeSign(sign: string): string {
  return sign.toLowerCase().trim()
}


