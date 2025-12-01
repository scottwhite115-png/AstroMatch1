// src/lib/compatibility/chineseLabels.ts

import type { ChinesePatternId } from './types';

export const isChineseConflictPattern = (
  pattern: ChinesePatternId | null | undefined,
) => {
  if (!pattern) return false;
  return pattern === 'liu_hai' || pattern === 'xing' || pattern === 'po';
};

export const isChineseNeutralPattern = (
  pattern: ChinesePatternId | null | undefined,
) => {
  // treat missing as neutral too, just in case
  return !pattern || pattern === 'neutral';
};

export type ChineseMatchLabelId =
  | 'neutral'
  | 'same_sign'
  | 'san_he'
  | 'liu_he'
  | 'liu_chong'
  | 'liu_hai'
  | 'xing'
  | 'po';

export interface ChineseMatchLabel {
  id: ChineseMatchLabelId;
  pillText: string;
  tagline: string;
}

export function getChineseMatchLabel(
  chinesePattern: ChinesePatternId | null,
): ChineseMatchLabel {
  // ✅ True neutral
  if (isChineseNeutralPattern(chinesePattern)) {
    return {
      id: 'neutral',
      pillText: '中 · Neutral',
      tagline: 'No strong harmony or conflict pattern.',
    };
  }

  switch (chinesePattern) {
    case 'same_sign':
      return {
        id: 'same_sign',
        pillText: '同支 · Same Sign',
        tagline: 'Same sign – double dose of one energy; high familiarity, medium harmony.',
      };

    case 'san_he':
      return {
        id: 'san_he',
        pillText: '三合 · Harmonious Trine',
        tagline: 'San He alliance – natural teamwork and long-term ease.',
      };

    case 'liu_he':
      return {
        id: 'liu_he',
        pillText: '六合 · Secret Allies',
        tagline: 'Liu He "secret friends" – supportive, protective bond.',
      };

    case 'liu_chong':
      return {
        id: 'liu_chong',
        pillText: '六冲 · Opposites',
        tagline: 'Magnetic opposites, high spark, low harmony; intense and memorable.',
      };

    case 'liu_hai':
      return {
        id: 'liu_hai',
        pillText: '六害 · Harm',
        tagline: 'Liu Hai "harm" – sensitive to misunderstandings; needs careful handling.',
      };

    case 'xing':
      return {
        id: 'xing',
        pillText: '刑 · Punishment',
        tagline: 'Xing "punishment" – friction, criticism and tests of patience.',
      };

    case 'po':
      return {
        id: 'po',
        pillText: '破 · Break',
        tagline: 'Po "break" – stop-start energy; things tend to crack under pressure.',
      };

    default:
      // fallback safety
      return {
        id: 'neutral',
        pillText: '中 · Neutral',
        tagline: 'No strong harmony or conflict pattern.',
      };
  }
}

