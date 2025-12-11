# Overlay Score Caps Implementation

## Overview
Implemented score capping logic to prevent matches with multiple damage overlays from appearing as "top-tier" connections when they're actually high-effort relationships.

## The Problem
Diana's profile (Rabbit + Snake = Liu He with Xing + Po overlays) was showing **91%** compatibility, which visually competed with pure "Soulmate Match" tier connections. However, with 2 damage overlays (Xing + Po), this connection:
- Has a strong underlying bond (Liu He)
- But requires significant effort and emotional maturity
- Should be labeled "Challenging Match"
- Should have a score that reflects the difficulty (not 91%)

## The Solution

### 1. New Function: `calculateMatchScoreWithOverlays()`
Location: `lib/matchEngine.ts`

This new function applies score caps based on the number of damage overlays:

```typescript
export function calculateMatchScoreWithOverlays(
  input: MatchInput,
  overlays: ChinesePattern[]
): number
```

**Capping Logic:**

For harmonious base patterns (San He, Liu He):

- **2+ damage overlays:**
  - With good Western elements (same/compatible): Cap at **84%**
  - With neutral/poor Western elements: Cap at **82%**

- **1 damage overlay:**
  - With good Western elements: Cap at **86%**
  - With neutral/poor Western elements: Cap at **82%**

- **0 damage overlays:**
  - No cap applied (can reach high 80s / low 90s naturally)

**Damage overlays** = LIU_HAI (六害), XING (刑), PO (破)

### 2. Updated `buildMatchResult()` 
Location: `lib/matchEngine.ts`

Now accepts an optional `overlays` parameter:

```typescript
export function buildMatchResult(
  input: MatchInput, 
  overlays?: ChinesePattern[]
): MatchResult
```

If overlays are provided, it uses the new capping logic. Otherwise, it falls back to the original calculation.

### 3. Updated `buildSimpleConnectionBox()`
Location: `lib/compat/engine.ts`

Now passes overlay patterns to the match engine:

```typescript
const overlayPatterns: any[] = chinesePatternResult.all
  .filter((p: string) => p !== chinesePattern) // Exclude the primary pattern
  .map((p: string) => {
    const overlayMap: Record<string, string> = {
      'liu_hai': 'LIU_HAI',
      'xing': 'XING',
      'po': 'PO',
      'liu_chong': 'LIU_CHONG',
    };
    return overlayMap[p];
  })
  .filter((p: string) => p !== undefined);

matchEngineResult = buildMatchResult({
  pattern: patternKey,
  westernElementRelation: westElemRelation,
  westernAspectRelation: westAspectRelation,
  wuXingRelation,
}, overlayPatterns);
```

## Results

### Diana's Profile (Snake - 1989)
**Before:** 91% (misleadingly high)
**After:** ~82-84% (accurately reflects the challenge)

**Match Details:**
- Base Pattern: Liu He (Secret Friends)
- Overlays: Xing + Po (2 damage overlays)
- Label: "Challenging Match"
- Tagline: One of the lesson taglines (growth-oriented)

### Score Band Philosophy

**High 90s (90-98%):**
- Reserved for pure San He with excellent Western elements
- No damage overlays
- True "Soulmate Match" tier

**High 80s (86-91%):**
- Pure Liu He with good elements (no overlays)
- San He with some challenge
- "Secret Friends" / "Strong Harmony" tier

**Low-Mid 80s (78-86%):**
- Liu He or San He with 1-2 damage overlays
- "Challenging Match" tier
- Strong bond but requires work

**Below 78%:**
- Conflict patterns (Liu Chong, Liu Hai, Xing, Po as primary)
- "Magnetic Opposites" / "Difficult Match" tier

## Files Modified

1. `lib/matchEngine.ts`
   - Added `calculateMatchScoreWithOverlays()` function
   - Updated `buildMatchResult()` to accept overlays parameter

2. `lib/compat/engine.ts`
   - Updated `buildSimpleConnectionBox()` to extract and pass overlays
   - Added overlay mapping logic

## Testing

To test the changes:
1. Check Diana's profile (Snake, 1989) - should show ~82-84% instead of 91%
2. Check other Liu He profiles with no overlays - should remain in high 80s / low 90s
3. Check San He profiles - should remain in high 90s if no overlays

## Notes

- This change only affects scores where overlays are present
- Pure harmony patterns (no overlays) are unaffected
- The visual pill label and tagline already correctly reflect "Challenging Match"
- Now the score matches the narrative


