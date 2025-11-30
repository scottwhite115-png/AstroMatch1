/**
 * Compatibility utilities for integrating the match engine with the dating app
 */

import {
  getHybridSignature,
  type HybridSignature,
  type SiderealSign,
  type ChineseAnimal,
  type MatchExplanation,
} from "@/lib/match-engine"
import { scoreMatch, type WestSign, type EastAnimal } from "@/lib/engine"

/**
 * Calculate compatibility score from two birthdates
 */
export function calculateCompatibilityFromDates(
  birthdate1: Date,
  birthdate2: Date
): number {
  const sig1 = getHybridSignature(birthdate1, true)
  const sig2 = getHybridSignature(birthdate2, true)
  const A = { west: sig1.western as WestSign, east: sig1.animal as EastAnimal }
  const B = { west: sig2.western as WestSign, east: sig2.animal as EastAnimal }
  return scoreMatch(A, B).score
}

/**
 * Get detailed match explanation from two birthdates
 */
export function explainCompatibilityFromDates(
  birthdate1: Date,
  birthdate2: Date
): MatchExplanation {
  const sig1 = getHybridSignature(birthdate1, true)
  const sig2 = getHybridSignature(birthdate2, true)
  return explainScore(sig1, sig2)
}

/**
 * Calculate compatibility from zodiac signs directly
 * Useful when you already have the signs stored
 */
export function calculateCompatibilityFromSigns(
  western1: string,
  chinese1: string,
  western2: string,
  chinese2: string
): number {
  const sig1: HybridSignature = {
    western: normalizeWesternSign(western1),
    animal: normalizeChineseSign(chinese1),
  }
  const sig2: HybridSignature = {
    western: normalizeWesternSign(western2),
    animal: normalizeChineseSign(chinese2),
  }
  const A = { west: sig1.western as WestSign, east: sig1.animal as EastAnimal }
  const B = { west: sig2.western as WestSign, east: sig2.animal as EastAnimal }
  return scoreMatch(A, B).score
}

/**
 * Get detailed explanation from zodiac signs
 */
export function explainCompatibilityFromSigns(
  western1: string,
  chinese1: string,
  western2: string,
  chinese2: string
): MatchExplanation {
  const sig1: HybridSignature = {
    western: normalizeWesternSign(western1),
    animal: normalizeChineseSign(chinese1),
  }
  const sig2: HybridSignature = {
    western: normalizeWesternSign(western2),
    animal: normalizeChineseSign(chinese2),
  }
  // Build an explanation shape compatible with existing UI but driven by v2 engine
  const A = { west: sig1.western as WestSign, east: sig1.animal as EastAnimal }
  const B = { west: sig2.western as WestSign, east: sig2.animal as EastAnimal }
  const v2 = scoreMatch(A, B)

  // Map v2 breakdown into existing fields
  const score = v2.score
  const bullets = v2.reasons
  const subs = {
    coreVibe: v2.breakdown.western,
    chemistry: Math.round((v2.breakdown.western + v2.breakdown.eastern) / 2),
    communication: v2.breakdown.western,
    lifestyle: v2.breakdown.eastern,
    longTerm: Math.round(v2.breakdown.eastern * 0.9 + v2.breakdown.western * 0.1),
    growth: Math.round(v2.breakdown.eastern * 0.8 + v2.breakdown.western * 0.2),
  }

  return {
    score,
    bullets,
    subs,
    // Preserve any extra fields expected by UI if present in original type
  } as unknown as MatchExplanation
}

/**
 * Get zodiac signs from birthdate
 */
export function getZodiacSigns(birthdate: Date): {
  western: string
  chinese: string
  westernProper: SiderealSign
  chineseProper: ChineseAnimal
} {
  const signature = getHybridSignature(birthdate, true)
  return {
    western: signature.western.toLowerCase(),
    chinese: signature.animal.toLowerCase(),
    westernProper: signature.western,
    chineseProper: signature.animal,
  }
}

/**
 * Normalize western sign name (handles case-insensitive input)
 */
function normalizeWesternSign(sign: string): SiderealSign {
  const normalized = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase()
  const validSigns = [
    'Aries',
    'Taurus',
    'Gemini',
    'Cancer',
    'Leo',
    'Virgo',
    'Libra',
    'Scorpio',
    'Sagittarius',
    'Capricorn',
    'Aquarius',
    'Pisces',
  ]
  
  if (validSigns.includes(normalized)) {
    return normalized as SiderealSign
  }
  
  // Fallback
  console.warn(`Invalid western sign: ${sign}, defaulting to Aries`)
  return 'Aries'
}

/**
 * Normalize chinese animal name (handles case-insensitive input)
 */
function normalizeChineseSign(animal: string): ChineseAnimal {
  const normalized = animal.charAt(0).toUpperCase() + animal.slice(1).toLowerCase()
  const validAnimals = [
    'Rat',
    'Ox',
    'Tiger',
    'Rabbit',
    'Dragon',
    'Snake',
    'Horse',
    'Goat',
    'Monkey',
    'Rooster',
    'Dog',
    'Pig',
  ]
  
  if (validAnimals.includes(normalized)) {
    return normalized as ChineseAnimal
  }
  
  // Fallback
  console.warn(`Invalid chinese animal: ${animal}, defaulting to Rat`)
  return 'Rat'
}

/**
 * Get compatibility description from score
 */
export function getCompatibilityDescription(score: number): {
  level: string
  color: string
  emoji: string
} {
  if (score >= 90) {
    return {
      level: 'Exceptional Match',
      color: 'text-green-500',
      emoji: '🔥',
    }
  } else if (score >= 80) {
    return {
      level: 'Highly Compatible',
      color: 'text-green-400',
      emoji: '💫',
    }
  } else if (score >= 70) {
    return {
      level: 'Very Compatible',
      color: 'text-blue-400',
      emoji: '✨',
    }
  } else if (score >= 60) {
    return {
      level: 'Mixed Match',
      color: 'text-yellow-400',
      emoji: '⭐',
    }
  } else if (score >= 50) {
    return {
      level: 'Moderate Match',
      color: 'text-orange-400',
      emoji: '💛',
    }
  } else {
    return {
      level: 'Mixed Match',
      color: 'text-red-400',
      emoji: '🤔',
    }
  }
}

