# Score Band Rebalance - December 2025

## Overview

This document outlines the comprehensive rebalancing of the AstroMatch scoring system to create more appropriate score bands for each Chinese pattern while maintaining the existing 70/30 Chinese/Western weighting.

## Previous Issues

1. **Liu Chong** (六冲) was scoring too high: 38-72% range with peak at 70%
2. **Same sign** scores were appropriate but could be refined: 58-68%
3. **San He/Liu He** had room for better differentiation
4. Score bands were too compressed, making it hard to distinguish pattern quality

## New Score Bands

### A. Base Chinese Pattern Bands (before Western tweaks)

#### San He 三合 (Same Trine - Top Harmony)
- **Target Range**: 72-88% → Soulmate / Twin Flame territory
- **Implementation**: Base score +53 (from 50) = ~103 raw → 72-88% after 70/30 blend + adjustments
- **Peak scores**: 88-98% with strong Western aspects + Wu Xing harmony

#### Liu He 六合 (Secret Friend)
- **Target Range**: 68-84%
- **Implementation**: Base score +47 (from 50) = ~97 raw → 68-84% after 70/30 blend + adjustments
- **Peak scores**: 82-91% with strong Western aspects + Wu Xing harmony

#### Same Sign (Same Chinese Animal)
- **Target Range**: 60-70% base
- **Most combos**: 62-67%
- **Push to 68-70%**: Only when Western is genuinely strong (same/compatible element + nice aspect)
- **Implementation**:
  - Same element: 70%
  - Compatible element: 67%
  - Semi-compatible: 64%
  - Clash: 60%
- **Self-punishing signs** (Dragon, Horse, Rooster, Pig): 56-66% range

#### Neutral Pairs (cross_trine, none)
- **Target Range**: 52-68%
- **Allows neutral pairs to climb when Western is very supportive**
- **Implementation**: Base score +0 (stays at 50) → 52-68% with Western support

#### Liu Chong 六冲 (Opposites)
- **Target Range**: 40-62% base
- **Typical scores**: 45-58%
- **Best case** (Aquarius-Leo with good elements, strong Wu Xing): **max 60-62%**
- **Key constraint**: Keeps them clearly below San He / Liu He / peak same-sign
- **Implementation**: Base score -15 (from 50) = ~35 raw → 40-62% after adjustments
- **Calibration tiers**:
  - Peak (same Western element + Wu Xing harmony): 58-62%
  - Strong (same/compatible Western + some harmony): 54-60%
  - Moderate (compatible/semi Western): 50-56%
  - Difficult (clash/neutral Western): 45-52%

#### Other Conflict Patterns (Liu Hai 六害, Xing 刑, Po 破)
- **Target Range**: 38-60% depending on stack
- **Implementation**:
  - Liu Hai: Base score -20 (from 50) = ~30 raw
  - Xing: Base score -20 (from 50) = ~30 raw
  - Po: Base score -17 (from 50) = ~33 raw
- **Calibration tiers**:
  - Best case (same Western + Wu Xing): 54-60%
  - Good support: 48-56%
  - Moderate support: 42-50%
  - Worst case (poor Western + no Wu Xing): 38-46%

## Tier Threshold Updates

To accommodate the new score bands, tier thresholds have been adjusted:

### Soulmate ⭐
- **Threshold**: ≥85% with San He + strong Western aspects
- **Range**: 88-98%
- **Requirements**: San He pattern + (trine OR same_sign) Western aspect

### Twin Flame 🔥
- **Threshold**: ≥80%
- **Range**: 82-91%
- **Requirements**: 
  - Same_trine + (opposition OR same_sign) Western, OR
  - Liu He with score ≥84%

### Harmonious Match 💚
- **Threshold**: ≥72%
- **Range**: 72-84%
- **Includes**: Liu He, San He without perfect Western, peak same-sign

### Dynamic Match 💙
- **Threshold**: ≥63%
- **Range**: 63-71%
- **Includes**: Good same-sign, decent patterns with moderate support

### Opposites Attract ❤️‍🔥
- **Threshold**: ≥48% AND (Chinese opposite OR Western opposition)
- **Range**: 48-62%
- **Note**: Liu Chong max is 62%, so this tier properly captures opposites

### Neutral Match ⚪
- **Threshold**: ≥52% AND NOT a difficult pattern
- **Range**: 52-62%
- **Includes**: Middle-of-the-road matches without strong conflict patterns

### Difficult Match 🔴
- **Threshold**: <52% OR has difficult Chinese pattern
- **Range**: 38-51%
- **Includes**: Low scores, clear difficult patterns (Liu Hai, Xing, Po)

## Technical Implementation

### 1. Dynamic Chinese/Western Weighting

The match engine now uses **pattern-based dynamic weighting** instead of a fixed 70/30 ratio:

**Strong Patterns (70% Chinese / 30% Western):**
- San He (三合)
- Liu He (六合)
- Same Sign (同生肖)
- Liu Chong (六冲)
- Liu Hai (六害)
- Xing (刑)
- Po (破)

**Neutral Patterns (65% Chinese / 35% Western):**
- No pattern (none)
- Cross trine
- Same trine

This allows Western aspects to have more influence when Chinese patterns are weak or neutral, creating more nuanced scoring.

### 2. Base Chinese Score Function
Updated `getBaseChineseScore()` to use new base modifiers:
- San He: +53 (was +25)
- Liu He: +47 (was +20)
- Liu Chong: -15 (was -20)
- Liu Hai: -20 (was -15)
- Xing: -20 (was -15)
- Po: -17 (was -12)

### 2. Same-Sign Score Maps
Refined to achieve 60-70% base range with element awareness:
- Same element: 70% (was 68%)
- Compatible: 67% (was 65%)
- Semi: 64% (was 62%)
- Clash: 60% (was 58%)

### 3. Calibration Function
Updated `calibrateScoreForLabel()` to properly constrain each tier:
- **Soulmate**: 92-98% (harmony) or 88-94% (no harmony)
- **Twin Flame**: 86-91% (harmony) or 82-87% (no harmony)
- **Harmonious**: 78-84% (harmony) or 72-79% (no harmony)
- **Neutral**: 64-68% (harmony) or 58-64% (no harmony)
- **Opposites (Liu Chong)**: Maximum 58-62% at peak
- **Difficult patterns**: Granular 38-60% based on Western support

### 4. Tier Assignment Logic
Updated `getMatchTier()` thresholds:
- Soulmate: ≥85% (was ≥90%)
- Twin Flame: ≥80% (was ≥84%)
- Harmonious: ≥72% (was ≥78%)
- Dynamic: ≥63% (was ≥64%)
- Opposites: ≥48% (was ≥56%)
- Neutral: ≥52% (unchanged)

## Impact Summary

### What Changed
1. **Liu Chong properly constrained**: Max 62% instead of 70%
2. **San He elevated**: Now clearly in 72-88% range, reaching 88-98% at peak
3. **Liu He differentiated**: Clear 68-84% band, distinct from San He
4. **Same-sign refined**: Tighter 60-70% base with Western influence
5. **Neutral pairs have room**: 52-68% allows Western support to show
6. **Conflict patterns granular**: 38-60% with proper Western/Wu Xing consideration
7. **Dynamic weighting**: Strong patterns use 70/30, neutral patterns use 65/35 Chinese/Western ratio

### What Stayed the Same
1. **Core Chinese/Western split**: Still Chinese-dominant, but now adaptive (70/30 or 65/35)
2. **Wu Xing adjustments**: Still apply on top of base scores (+6/-6 range)
3. **Tier label meanings**: Same conceptual categories
4. **Western scoring**: Base Western score function unchanged
5. **Pattern detection**: No changes to pattern identification logic

## Testing Recommendations

After this rebalance, test these key scenarios:

1. **San He pairs** (e.g., Rat-Dragon-Monkey):
   - Should score 72-88% typically
   - Peak at 88-98% with trine/same_sign + supportive Wu Xing

2. **Liu He pairs** (e.g., Rat-Ox):
   - Should score 68-84% typically
   - Peak at 82-91% with strong Western + Wu Xing

3. **Liu Chong pairs** (e.g., Rat-Horse):
   - Should score 45-58% typically
   - **Max 60-62%** even with best Western + Wu Xing
   - Verify never exceeds 62%

4. **Same-sign pairs**:
   - Normal: 62-67%
   - Strong Western: 68-70%
   - Self-punishing (Dragon-Dragon): 56-66%

5. **Conflict patterns** (Liu Hai, Xing, Po):
   - Should range 38-60%
   - Good Western support: can reach 54-60%
   - Poor support: drop to 38-46%

## Files Modified

- `/src/lib/matchEngine.ts`: Core scoring and calibration logic
- `/SCORE_BAND_REBALANCE_2025.md`: This documentation

## Migration Notes

This is a **score-only change** - no database migrations needed. Existing matches will be recalculated with new scores on next computation.

Users may notice:
- San He/Liu He matches scoring higher (more prestigious)
- Liu Chong matches scoring lower (max 62% instead of 70%)
- Same-sign matches more consistent within 60-70% range
- Better score separation between pattern types

---

**Created**: December 3, 2025  
**Author**: Score Band Rebalancing Initiative  
**Status**: Implemented ✅

