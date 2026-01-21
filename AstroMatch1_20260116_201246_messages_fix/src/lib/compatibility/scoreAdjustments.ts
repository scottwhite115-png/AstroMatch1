// src/lib/compatibility/scoreAdjustments.ts

import { isChineseNeutralPattern } from './chineseLabels';
import type { ChinesePatternId, WesternAspect } from './types';

/**
 * Adjusts score for neutral Chinese patterns with strong Western aspects.
 * This gives a boost to matches that have:
 * - Neutral Chinese pattern (no strong harmony or conflict)
 * - Strong Western aspect (opposition, trine, sextile)
 * 
 * This creates the "Opposites Attract" label for neutral Chinese + Western opposition.
 */
export function adjustForNeutralChineseHighWestern(
  baseScore: number,
  chinesePattern: ChinesePatternId,
  westernAspect: WesternAspect,
): number {
  let score = baseScore;

  // Only touch truly neutral Chinese pairs
  if (!isChineseNeutralPattern(chinesePattern)) {
    return score;
  }

  // Apply boosts based on Western aspect
  if (westernAspect === 'opposition') {
    score += 6; // e.g. 56 → 62 (boosts into "Opposites Attract" range)
  } else if (westernAspect === 'trine' || westernAspect === 'sextile') {
    score += 4; // Smaller boost for harmonious aspects
  }

  // Cap at 74 to keep it realistic
  if (score > 74) score = 74;
  if (score < 0) score = 0;

  return score;
}

