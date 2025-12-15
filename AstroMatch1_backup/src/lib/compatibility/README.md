# Compatibility Scoring System

## Overview

This module provides scoring adjustments for neutral Chinese zodiac patterns combined with strong Western aspects. The main purpose is to boost scores for matches that have:

- **Neutral Chinese pattern** (no strong harmony or conflict)
- **Strong Western aspect** (opposition, trine, sextile)

This creates the **"Opposites Attract"** label for neutral Chinese + Western opposition combinations.

## Files

### 1. `types.ts`
Defines the core types:
- `ChinesePatternId`: neutral, same_sign, san_he, liu_he, liu_chong, liu_hai, xing, po
- `WesternAspect`: same_sign, opposition, trine, sextile, square, quincunx, semi_sextile, none

### 2. `chineseLabels.ts`
Provides helper functions and label mapping:
- `isChineseNeutralPattern()`: Checks if a pattern is neutral
- `isChineseConflictPattern()`: Checks if a pattern is a conflict type
- `getChineseMatchLabel()`: Returns pill text and taglines for each pattern

### 3. `scoreAdjustments.ts`
Contains the scoring adjustment logic:
- `adjustForNeutralChineseHighWestern()`: Applies score boosts based on Western aspects

### 4. `helpers.ts`
Utility functions:
- `mapToChinesePatternId()`: Converts from main engine's ChinesePattern to ChinesePatternId

### 5. `index.ts`
Barrel export file for convenient imports

## How It Works

### Score Adjustment Rules

For **neutral Chinese patterns only**:

1. **Western Opposition**: +6 points
   - Example: 56 → 62 (boosts into "Opposites Attract" range)
   - This creates magnetic attraction despite neutral Chinese compatibility

2. **Western Trine or Sextile**: +4 points
   - Example: 56 → 60
   - Smaller boost for harmonious aspects

3. **Score Cap**: Maximum of 74 points
   - Keeps neutral patterns from reaching top-tier labels

### Integration with Match Engine

The adjustment is applied in the main match scoring flow:

1. Calculate base Chinese score (70% weight)
2. Calculate base Western score (30% weight)
3. Apply Wu Xing (year element) adjustments
4. **Apply neutral Chinese + high Western boost** ← NEW
5. Determine tier based on final score
6. Calibrate score within tier range

### Example Scenarios

**Scenario 1: Neutral Chinese + Western Opposition**
- Chinese: Rat × Snake (neutral pattern)
- Western: Leo × Aquarius (opposition)
- Base score: 56
- After adjustment: 56 + 6 = **62**
- Result: **"Opposites Attract"** label

**Scenario 2: Neutral Chinese + Western Trine**
- Chinese: Tiger × Pig (neutral pattern)
- Western: Aries × Leo (trine)
- Base score: 58
- After adjustment: 58 + 4 = **62**
- Result: **"Dynamic Match"** or **"Neutral Match"**

**Scenario 3: Harmonious Chinese + Western Opposition**
- Chinese: Rat × Dragon (san_he - harmonious)
- Western: Leo × Aquarius (opposition)
- Base score: 78
- After adjustment: **78** (no change - not neutral)
- Result: **"Harmonious Match"** or **"Twin Flame"**

## Usage

```typescript
import { adjustForNeutralChineseHighWestern, mapToChinesePatternId } from '@/src/lib/compatibility';

// In your match scoring function
const chinesePatternId = mapToChinesePatternId(chinesePattern);
const adjustedScore = adjustForNeutralChineseHighWestern(
  baseScore,
  chinesePatternId,
  westernAspect
);
```

## Match Label Thresholds

After adjustment, scores are mapped to labels:

- **90+**: Soulmate (with super harmonious patterns)
- **84+**: Twin Flame (same trine + intense West)
- **78+**: Harmonious Match
- **64+**: Dynamic Match
- **56+**: **Opposites Attract** (if opposition aspect)
- **52+**: Neutral Match
- **<52**: Difficult Match

## Benefits

1. **More Accurate Labels**: Neutral Chinese patterns with strong Western opposition now get the "Opposites Attract" label
2. **Score Fairness**: Balanced boost keeps neutral patterns realistic (capped at 74)
3. **Western Influence**: Recognizes that Western aspects matter even when Chinese patterns are neutral
4. **Modular Design**: Easy to adjust boost values or add more conditions

## Future Enhancements

Potential improvements:
- Add boosts for other Western aspects (square, quincunx)
- Apply different boosts based on specific neutral pattern types
- Consider Wu Xing elements in the adjustment logic
- Add user feedback tracking to calibrate boost values

