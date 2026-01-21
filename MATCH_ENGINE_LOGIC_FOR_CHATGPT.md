# AstroMatch Engine Logic for ChatGPT (CURRENT VERSION - 2025)

## Overview
The AstroMatch engine calculates compatibility scores (0-100%) between User A and User B using a hybrid system that combines Chinese zodiac patterns with Western astrological elements and aspects. The engine is located in `/lib/matchEngine.ts` and is called via `buildMatchResult()` from `/lib/compat/engine.ts`.

## Core Scoring System

### Step 1: Identify Chinese Pattern (Eastern Zodiac)

**Chinese Patterns (in priority order):**
1. **SAN_HE (三合) - Triple Harmony / Same Trine**
   - Same trine groups: 
     - Rat, Dragon, Monkey (Visionaries)
     - Ox, Snake, Rooster (Strategists) 
     - Tiger, Horse, Dog (Adventurers)
     - Rabbit, Goat, Pig (Artists)
   - Score range: 72-98%
   - Base scores by Wu Xing element relation:
     - Same element: 90
     - Compatible (generating cycle): 88
     - Semi-compatible (neutral): 85
     - Clash (controlling cycle): 82

2. **LIU_HE (六合) - Six Harmonies**
   - Pairs: Rat-Ox, Tiger-Pig, Rabbit-Dog, Dragon-Rooster, Snake-Monkey, Horse-Goat
   - Score range: 68-91%
   - Base scores by element relation:
     - Same element: 86
     - Compatible: 84
     - Semi-compatible: 80
     - Clash: 76

3. **SAME_SIGN (同生肖) - Same Chinese Animal**
   - User A and User B have the same Chinese zodiac animal
   - **CRITICAL**: Score is ALWAYS capped at **70% maximum** (via `applySameSignCap` function)
   - Score range: 68-82% in base calculation, but final cap is **70%**
   - Base scores by element relation:
     - Same element: 76 (capped to 70%)
     - Compatible: 74 (capped to 70%)
     - Semi-compatible: 72 (capped to 70%)
     - Clash: 70 (stays at 70%)

4. **NO_PATTERN - Neutral**
   - No significant Chinese pattern
   - Score range: 52-68% (hard cap at 65%)
   - Base scores: 56-64 depending on element relation

5. **LIU_CHONG (六冲) - Six Conflicts / Magnetic Opposites**
   - Opposite pairs: Rat-Horse, Ox-Goat, Tiger-Monkey, Rabbit-Rooster, Dragon-Dog, Snake-Pig
   - Score range: 35-49% (hard clamp)
   - Base scores: 48-60 depending on element relation, then clamped to 35-49%
   - Label: "Six Conflicts"
   - **Note**: This is the "magnetic opposites" pattern - strong attraction but high tension

6. **LIU_HAI (六害), XING (刑), PO (破) - Damage Patterns**
   - Score ranges: 38-60%
   - Applied as overlays on base patterns

### Step 2: Determine Element Relations (Wu Xing - Five Elements)

**Year Element Relations:**
- **SAME**: Both users have same year element (Wood, Fire, Earth, Metal, Water) → +2 to score
- **GENERATING**: Productive cycle (e.g., Wood→Fire, Fire→Earth) → +4 to score
- **CONTROLLING**: Controlling cycle (e.g., Fire→Metal, Metal→Wood) → -4 to score
- **OTHER**: Neutral → 0 adjustment

**Element Relations mapped to base scoring:**
- `same` element relation → highest base score
- `compatible` element relation (generating cycle) → second highest
- `semi` element relation (neutral) → medium base score
- `clash` element relation (controlling cycle) → lowest base score

### Step 3: Calculate Western Element Compatibility

**Western Elements:** Fire, Earth, Air, Water

**Element Relations:**
- **SAME_ELEMENT**: Same Western element (e.g., both Fire signs) → +6 to score
- **COMPATIBLE_ELEMENT**: Fire-Air, Earth-Water → +4 to score
- **SEMI_COMPATIBLE**: Mixed compatibility → +1 to score
- **MISMATCH**: Clashing elements (Fire-Water, Air-Earth) → -4 to score

### Step 4: Western Aspect Adjustments

**Aspect Relations:**
- **SOFT**: Trine or sextile aspects → +4 to score
- **NEUTRAL**: Conjunction or no strong aspect → 0 adjustment
- **HARD**: Square aspects → -6 to score
- **OPPOSITION**: Opposite signs (Aries-Libra, Taurus-Scorpio, etc.) → -4 to score
  - **Note**: Opposite signs create "magnetic opposites" dynamic - strong attraction but tension

### Step 5: Same Western Sign Penalty

**CRITICAL RULE**: If User A and User B have the **same Western sign**:
- Apply **-8 penalty** to the score
- This prevents same-sign matches from scoring too high
- Same Western sign + harmony patterns → Maximum is Favourable (60-74%) or Neutral (50-59%)
- Same Western sign CANNOT be Soulmate/Twin Flame/Excellent Match

### Step 6: Score Calculation Formula

```typescript
// Base score from Chinese pattern + Wu Xing element relation
let score = getChineseBaseScore(pattern, elementRelation)

// Add Western adjustments
score += scoreFromWesternElementRelation(westernElementRelation)  // +6, +4, +1, or -4
score += scoreFromWesternAspect(westernAspectRelation)           // +4, 0, -6, or -4
score += scoreFromWuXing(wuXingRelation)                        // +4, +2, 0, or -4
score += sameSignAdjustment(sameWesternSign)                    // -8 if same Western sign

// Clamp to pattern's allowed band
score = clampToPatternBand(pattern, score)

// Special caps
if (pattern === "NO_PATTERN" && score > 65) score = 65
if (pattern === "SAME_SIGN" && score > 82) score = 82  // But then capped to 70% later

// FINAL: Apply same-sign cap (CRITICAL - overrides everything)
if (chineseBase === 'SAME_SIGN') {
  score = Math.min(score, 70)  // Same Chinese sign ALWAYS capped at 70%
}
```

**Pattern Band Clamping:**
Each pattern has min/max bounds (from PATTERN_META):
- SAN_HE: 72-98%
- LIU_HE: 68-91%
- SAME_SIGN: 68-82% (but final cap is 70% via `applySameSignCap`)
- NO_PATTERN: 52-68% (hard cap at 65%)
- LIU_CHONG: 35-49% (hard clamp)

### Step 7: Special Rules & Caps

**Same Chinese Sign Caps:**
- **Function**: `applySameSignCap(score, 'SAME_SIGN')`
- **Rule**: Same Chinese animal matches are **ALWAYS capped at 70% maximum**
- **Location**: Applied AFTER all other calculations in `/lib/compat/engine.ts` line 2020
- **Important**: Even if the base calculation reaches 82%, it gets reduced to 70%

**Same Western Sign Caps:**
- Same Western sign matches **cannot** be Soulmate/Twin Flame/Excellent
- Maximum is Favourable (60-74%) or Neutral (50-59%)
- Applied through -8 penalty + pattern-specific caps
- From `computeMatch` function in `/lib/compat/engine.ts`:
  - Same Western sign + harmony patterns → Favourable only (60-74%)
  - Same Western sign + tension patterns → Difficult (max 49%)

**Magnetic Opposites:**
- **Liu Chong (六冲)** = Chinese opposites (Rat-Horse, Ox-Goat, etc.)
- **Western Opposition** = Opposite signs (Aries-Libra, Taurus-Scorpio, etc.)
- Both create "magnetic opposites" dynamic: strong attraction but high tension
- Liu Chong always results in "Six Conflicts" label (35-49% score)
- Western opposition gives -4 penalty but can still score higher with strong Chinese patterns

**San He Combinations:**
- San He + same element + same Western sign → Special cap (from old engine: 84-86%)
- San He + strong West (same/compatible element, NOT same sign) → Soulmate (95+) or Twin Flame (88-94)
- San He + semi/opposing West → Excellent (75+)

**Damage Overlay Effects:**
- When LIU_HAI, XING, or PO overlays exist on harmonious patterns:
  - 2+ overlays: cap at 78-84%
  - 1 overlay: cap at 82-86%

## Example Calculations

### Example 1: Same Trine (SAN_HE) - High Score
- User A: Rat (Wood element), Aquarius (Air)
- User B: Dragon (Wood element), Gemini (Air)
- **Pattern**: SAN_HE (same trine: Visionaries)
- **Wu Xing**: SAME element (Wood-Wood) → elementRelation = 'same'
- **Western**: SAME_ELEMENT (Air-Air) → +6
- **Aspect**: SOFT (trine) → +4
- **Same Western Sign**: No → 0 penalty
- **Calculation**: 
  - Base: 90 (San He + same element)
  - +6 (Western same element)
  - +4 (soft aspect)
  - +2 (Wu Xing same)
  - = 102, clamped to 98% (San He max)
- **Result**: 98% - Triple Harmony Match / Soulmate Match

### Example 2: Same Sign Match - Capped at 70%
- User A: Rabbit (Wood element), Aries (Fire)
- User B: Rabbit (Wood element), Aries (Fire)
- **Pattern**: SAME_SIGN
- **Wu Xing**: SAME element → elementRelation = 'same'
- **Western**: SAME_ELEMENT (Fire-Fire) → +6
- **Aspect**: SOFT → +4
- **Same Western Sign**: Yes → -8 penalty
- **Calculation**:
  - Base: 76 (Same Sign + same element)
  - +6 (Western same element)
  - +4 (soft aspect)
  - +2 (Wu Xing same)
  - -8 (same Western sign penalty)
  - = 80, but `applySameSignCap` reduces to **70%**
- **Result**: 70% - Same Sign Match (NOT 82%, NOT 80%)

### Example 3: Magnetic Opposites (Liu Chong)
- User A: Rat (Wood), Leo (Fire)
- User B: Horse (Fire), Aquarius (Air)
- **Pattern**: LIU_CHONG (Chinese opposites: Rat-Horse)
- **Wu Xing**: Different elements → elementRelation = 'semi'
- **Western**: COMPATIBLE_ELEMENT (Fire-Air) → +4
- **Aspect**: OPPOSITION (Leo-Aquarius) → -4
- **Same Western Sign**: No → 0 penalty
- **Calculation**:
  - Base: 52 (Liu Chong + semi element)
  - +4 (Western compatible)
  - -4 (opposition aspect)
  - = 52, but clamped to 35-49% range (Liu Chong hard clamp)
  - Final: ~42-49%
- **Result**: 35-49% - Six Conflicts Match (Magnetic Opposites)

### Example 4: Same Trine + Same Western Sign - Capped
- User A: Rat (Wood), Leo (Fire)
- User B: Dragon (Wood), Leo (Fire)
- **Pattern**: SAN_HE (same trine)
- **Wu Xing**: SAME element → +2
- **Western**: SAME_ELEMENT (Fire-Fire) → +6
- **Aspect**: SOFT → +4
- **Same Western Sign**: Yes → -8 penalty
- **Calculation**:
  - Base: 90 (San He + same element)
  - +6 (Western same element)
  - +4 (soft aspect)
  - +2 (Wu Xing same)
  - -8 (same Western sign)
  - = 94, but same Western sign caps it at Favourable (60-74%)
- **Result**: 60-74% - Favourable Match (NOT Soulmate/Twin Flame)

## Match Label Assignments (Final Output)

Based on score and pattern:
- **95-100%**: "Soulmate Match" (requires San He + strong Western support, NOT same Western sign)
- **85-94%**: "Twin Flame Match" (requires San He + strong Western, NOT same Western sign)
- **75-84%**: "Excellent Match" or "Triple Harmony Match"
- **60-74%**: "Favourable Match" or "Six Harmonies Match"
- **50-59%**: "Neutral Match"
- **35-49%**: "Six Conflicts" (Liu Chong pattern - Magnetic Opposites)
- **0-34%**: "Difficult Match"

**Label Modifiers:**
- Same Chinese Sign → "Same Sign Match" (68-70%, capped at 70%)
- Liu Chong → "Six Conflicts Match" or "Six Conflicts" (35-49%)
- Liu He → "Six Harmonies Match" (68-91%)
- San He → "Triple Harmony Match" (72-98%)

## Key Rules Summary

1. **Same Chinese Sign (Same Animal)**: **ALWAYS capped at 70% maximum** (not 82%)
2. **Same Western Sign**: -8 penalty, prevents high-tier matches (Soulmate/Twin Flame/Excellent)
3. **Same Trine (San He)**: Highest scoring pattern, 72-98% range
4. **Liu Chong (Six Conflicts)**: Magnetic opposites pattern, 35-49% range
5. **Score calculation**: Base (pattern + Wu Xing element) + Western adjustments + aspect + same-sign penalties
6. **Pattern clamping**: Each pattern has hard min/max boundaries
7. **Magnetic Opposites**: Created by Liu Chong (Chinese) or Western opposition (-4 penalty)
8. **Final cap**: `applySameSignCap` function ensures same Chinese sign never exceeds 70%

## Implementation Functions (Actual Code Locations)

Key functions to reference in `/lib/matchEngine.ts` and `/lib/compat/engine.ts`:

1. **`buildMatchResult(input: MatchInput, overlays?: ChinesePattern[])`** - Main entry point
   - Location: `/lib/matchEngine.ts` line 600
   - Calls `calculateMatchScore` or `calculateMatchScoreWithOverlays`

2. **`calculateMatchScore(input: MatchInput)`** - Core scoring function
   - Location: `/lib/matchEngine.ts` line 359
   - Uses `getChineseBaseScore` for base, then adds adjustments

3. **`getChineseBaseScore(pattern, elementRelation)`** - Gets base score from Chinese pattern
   - Location: `/lib/matchEngine.ts` line 188
   - Returns base score based on pattern + Wu Xing element relation

4. **`applySameSignCap(score, chineseBase)`** - Caps same-sign matches at 70%
   - Location: `/lib/connectionUi.ts` line 76
   - **CRITICAL**: This is called AFTER all other calculations and caps same sign at 70%

5. **`clampToPatternBand(pattern, score)`** - Ensures score stays in pattern's allowed range
   - Location: `/lib/matchEngine.ts` line 343
   - Uses PATTERN_META to get min/max bounds

6. **`buildConnectionBox(userA, userB, yearElementA?, yearElementB?)`** - Main production function
   - Location: `/lib/compat/engine.ts` line 2412
   - This is what's actually called in the matches page
   - Applies final `applySameSignCap` at line 2020

## Notes for ChatGPT

- **Same Chinese Sign**: Always check `applySameSignCap` - it caps at **70%**, NOT 82%
- **Same Western Sign**: Always applies -8 penalty and prevents Soulmate/Twin Flame/Excellent tiers
- **San He (same trine)**: Highest scoring pattern when combined with strong Western support
- **Liu Chong**: "Magnetic Opposites" pattern, always results in Six Conflicts (35-49%)
- **Pattern bands** are absolute - scores cannot exceed the max for each pattern type
- **Magnetic Opposites**: Both Chinese (Liu Chong) and Western (opposition) create this dynamic
- **Final score**: Always check if `applySameSignCap` was applied - it's the final override
- **Order matters**: Base score → adjustments → pattern clamp → same-sign cap (final)

## Critical Corrections from Previous Documentation

1. ❌ **WRONG**: Same sign can reach 82%
   ✅ **CORRECT**: Same sign is **always capped at 70%** via `applySameSignCap`

2. ❌ **WRONG**: Missing magnetic opposites logic
   ✅ **CORRECT**: Liu Chong (Six Conflicts) is the magnetic opposites pattern (35-49%)

3. ❌ **WRONG**: Same Western sign penalty not clearly explained
   ✅ **CORRECT**: -8 penalty + prevents Soulmate/Twin Flame/Excellent tiers (max Favourable 60-74%)

4. ✅ **CORRECT**: 70/30 weighting mentioned but actual implementation uses additive adjustments
   - The base score comes from pattern + element relation
   - Then Western adjustments are added (not weighted 30%)
