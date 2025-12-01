// src/lib/compatibility/helpers.ts

import type { ChinesePatternId } from './types';

/**
 * Map from the main match engine's ChinesePattern to the new ChinesePatternId
 */
export function mapToChinesePatternId(
  pattern: string | null | undefined
): ChinesePatternId | null {
  if (!pattern) return 'neutral';
  
  const patternLower = pattern.toLowerCase();
  
  switch (patternLower) {
    case 'san_he':
      return 'san_he';
    case 'liu_he':
      return 'liu_he';
    case 'liu_chong':
      return 'liu_chong';
    case 'liu_hai':
      return 'liu_hai';
    case 'xing':
      return 'xing';
    case 'po':
      return 'po';
    case 'same_animal':
      return 'same_sign';
    case 'none':
    case 'neutral':
    case 'cross_trine':
      return 'neutral';
    default:
      return 'neutral';
  }
}

