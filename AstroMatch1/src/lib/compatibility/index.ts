// src/lib/compatibility/index.ts

// Export all types
export type { ChinesePatternId, WesternAspect } from './types';

// Export all label functions
export {
  isChineseConflictPattern,
  isChineseNeutralPattern,
  getChineseMatchLabel,
  type ChineseMatchLabelId,
  type ChineseMatchLabel,
} from './chineseLabels';

// Export score adjustments
export { adjustForNeutralChineseHighWestern } from './scoreAdjustments';

// Export helpers
export { mapToChinesePatternId } from './helpers';

