// lib/matchEngineHelpers.ts
// Helper functions for the new match engine that integrate with existing codebase

import {
  calculateWestAspect,
  calculateWestElementRelation,
  type WesternSign,
  type WesternElement,
  type WestAspect,
  type WestElementRelation,
  type ChineseAnimal,
  type ChinesePattern,
  getWuXingYearElement,
} from './matchEngine';
import { getChinesePattern } from './compat/engine';

// Re-export types for convenience
export type { WesternSign, WesternElement, WestAspect, WestElementRelation, ChineseAnimal, ChinesePattern } from './matchEngine';

/**
 * Get Western aspect between two signs
 * Alias for calculateWestAspect with proper type handling
 */
export function getWestAspect(
  signA: string | WesternSign,
  signB: string | WesternSign
): WestAspect {
  // Normalize to capitalized format
  const normalize = (s: string | WesternSign): WesternSign => {
    if (typeof s === 'string') {
      return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() as WesternSign;
    }
    return s;
  };
  
  return calculateWestAspect(normalize(signA), normalize(signB));
}

/**
 * Get Western element relation
 * Alias for calculateWestElementRelation
 */
export function getWestElementRelation(
  elementA: string | WesternElement,
  elementB: string | WesternElement
): WestElementRelation {
  const normalize = (e: string | WesternElement): WesternElement => {
    if (typeof e === 'string') {
      return e.charAt(0).toUpperCase() + e.slice(1).toLowerCase() as WesternElement;
    }
    return e;
  };
  
  return calculateWestElementRelation(normalize(elementA), normalize(elementB));
}

/**
 * Get Chinese pattern code from two animals
 * Uses existing getChinesePattern from lib/compat/engine.ts
 * Returns the pattern code that matches the ChinesePattern type
 */
export function getChinesePatternCode(
  animalA: string | ChineseAnimal,
  animalB: string | ChineseAnimal
): ChinesePattern {
  // Normalize to lowercase for existing system
  const normalize = (a: string | ChineseAnimal): string => {
    const str = typeof a === 'string' ? a : a;
    return str.toLowerCase();
  };
  
  const animalALower = normalize(animalA);
  const animalBLower = normalize(animalB);
  
  // Use existing pattern detection (expects lowercase)
  const pattern = getChinesePattern(animalALower as any, animalBLower as any);
  
  // Check if same animal first (before pattern detection)
  if (animalALower === animalBLower) {
    return 'SAME_SIGN';
  }
  
  // Map to new pattern type
  const patternMap: Record<string, ChinesePattern> = {
    'san_he': 'SAN_HE',
    'liu_he': 'LIU_HE',
    'liu_chong': 'LIU_CHONG',
    'liu_hai': 'LIU_HAI',
    'xing': 'XING',
    'po': 'PO',
    'same_trine': 'SAN_HE', // Same trine is a type of San He
    'cross_trine': 'SAN_HE',
    'same_animal': 'SAME_SIGN',
    'neutral': 'NO_PATTERN',
    'none': 'NO_PATTERN',
  };
  
  const mappedPattern = patternMap[pattern] || 'NO_PATTERN';
  return mappedPattern;
}

/**
 * Check if two Chinese animals are opposites (liu_chong pattern)
 */
export function isChineseOppositePair(
  animalA: string | ChineseAnimal,
  animalB: string | ChineseAnimal
): boolean {
  const pattern = getChinesePatternCode(animalA, animalB);
  return pattern === 'liu_chong';
}

/**
 * Check if two Chinese animals form a "lively pair"
 * Lively pairs are typically Liu Chong (opposites) which create dynamic energy
 */
export function isLivelyPair(
  animalA: string | ChineseAnimal,
  animalB: string | ChineseAnimal
): boolean {
  // Lively pairs are Liu Chong (opposites) - they create dynamic, magnetic energy
  return isChineseOppositePair(animalA, animalB);
}

/**
 * Get Wu Xing year element from birth year
 * Re-exported for convenience
 */
export { getWuXingYearElement };

/**
 * Build connection box props from a MatchContext
 * Calculates scores, star ratings, and formats data for display
 */
export function buildConnectionBoxProps(
  ctx: import('./matchEngine').MatchContext,
  options?: {
    chineseLine?: string;
    westernLine?: string;
    patternTagline?: string;
  }
) {
  const { computeMatchScore } = require('./matchEngine');
  const { getWestStarsFromAspect, getChineseStarsFromPattern } = require('./starRatings');
  const { getPatternTagline } = require('./matchTaglines');
  
  // Compute match score and tier
  const result = computeMatchScore(ctx);
  
  // Determine if signs are the same
  const sameSign = ctx.westA.sign === ctx.westB.sign;
  
  // Calculate star ratings
  const westStars = getWestStarsFromAspect(
    ctx.westAspect,
    ctx.westElementRelation,
    sameSign
  );
  
  const eastStars = getChineseStarsFromPattern(
    ctx.chinesePattern,
    ctx.isLivelyPair
  );
  
  // Get pattern tagline if not provided
  const patternTagline = options?.patternTagline || getPatternTagline({
    tier: result.tier,
    chinesePattern: ctx.chinesePattern,
    westAspect: ctx.westAspect,
    westElementRelation: ctx.westElementRelation,
    isChineseOpposite: ctx.isChineseOpposite,
  });
  
  return {
    tier: result.tier,
    score: result.score,
    westA: ctx.westA.sign,
    eastA: ctx.chineseA.animal,
    westB: ctx.westB.sign,
    eastB: ctx.chineseB.animal,
    westStars,
    eastStars,
    chineseLine: options?.chineseLine || '',
    westernLine: options?.westernLine || '',
    patternTagline,
    // Include pattern data for future use
    chinesePattern: ctx.chinesePattern,
    westAspect: ctx.westAspect,
    westElementRelation: ctx.westElementRelation,
    isChineseOpposite: ctx.isChineseOpposite,
    isLivelyPair: ctx.isLivelyPair,
  };
}
