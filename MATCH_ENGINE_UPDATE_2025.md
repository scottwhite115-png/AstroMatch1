# Match Engine Update - November 2025

## Overview
The match engine has been updated with a simplified, pattern-based scoring system from ChatGPT that focuses on clear score bands and metadata for each Chinese pattern.

## Key Changes

### 1. **New Pattern System**
- Changed from lowercase patterns (`san_he`, `liu_he`) to uppercase (`SAN_HE`, `LIU_HE`)
- Added `NO_PATTERN` and `SAME_ANIMAL` as explicit patterns
- Each pattern now has metadata including:
  - Emoji (🌟, 💫, 🪞, etc.)
  - English label ("Triple Harmony", "Secret Friends", etc.)
  - Full label with Chinese characters
  - Tagline explanation
  - Score bands (min, max, highStart, midStart)

### 2. **Score Band System**
Each pattern is constrained to specific score ranges:
- **SAN_HE** (Triple Harmony): 75-96
- **LIU_HE** (Secret Friends): 72-94
- **SAME_ANIMAL**: 68-88
- **NO_PATTERN**: 52-82
- **LIU_CHONG** (Six Conflicts): 38-72
- **LIU_HAI** (Six Harms): 35-68
- **XING** (Punishment): 35-66
- **PO** (Break): 32-64

### 3. **Simplified Scoring**
The new engine uses base scores with modest adjustments:
- **Pattern Base Scores**: 84 (SAN_HE), 80 (LIU_HE), 75 (SAME_ANIMAL), etc.
- **Element Relation**: +6 (same), +4 (compatible), +1 (semi), -4 (mismatch)
- **Aspect**: +4 (soft), 0 (neutral), -6 (hard), -4 (opposition)
- **Wu Xing**: +4 (generating), +2 (same), -4 (controlling), 0 (other)

### 4. **New Return Format**
The `buildMatchResult()` function now returns:
```typescript
{
  score: number,
  pattern: ChinesePattern,
  patternEmoji: string,
  patternShortLabelEn: string,
  patternFullLabel: string,
  pillLabel: string,
  baseTagline: string
}
```

### 5. **Backward Compatibility**
All legacy exports and functions have been preserved:
- `computeMatchScore(ctx: MatchContext)` - Legacy wrapper
- `West`, `East` type aliases
- Helper functions: `calculateWestAspect`, `getWesternSignElement`, etc.
- Automatic conversion between uppercase/lowercase pattern formats
- Conversion functions for legacy element and aspect relations

## How to Use

### New API (Recommended)
```typescript
import { buildMatchResult, type MatchInput } from "@/lib/matchEngine";

const input: MatchInput = {
  pattern: "SAN_HE",
  westernElementRelation: "SAME_ELEMENT",
  westernAspectRelation: "SOFT",
  wuXingRelation: "GENERATING"
};

const result = buildMatchResult(input);
console.log(result.pillLabel); // "92% · Triple Harmony"
```

### Legacy API (Still Supported)
```typescript
import { computeMatchScore, type MatchContext } from "@/lib/matchEngine";

const ctx: MatchContext = {
  westA: { sign: "Leo", element: "Fire" },
  westB: { sign: "Sagittarius", element: "Fire" },
  westAspect: "trine",
  westElementRelation: "same",
  chineseA: { animal: "Rabbit", yearElement: "Wood" },
  chineseB: { animal: "Pig", yearElement: "Water" },
  chinesePattern: "san_he"
};

const result = computeMatchScore(ctx);
console.log(result.score, result.tier);
```

## Migration Notes

### Pattern Name Changes
If you're using pattern names directly:
- `"san_he"` → `"SAN_HE"`
- `"liu_he"` → `"LIU_HE"`
- `"same_animal"` → `"SAME_ANIMAL"`
- `"none"` → `"NO_PATTERN"`
- `"liu_chong"` → `"LIU_CHONG"`
- `"liu_hai"` → `"LIU_HAI"`
- `"xing"` → `"XING"`
- `"po"` → `"PO"`

The legacy wrapper automatically converts lowercase to uppercase, so existing code will continue to work.

### Element Relation Changes
- `"same"` → `"SAME_ELEMENT"`
- `"compatible"` → `"COMPATIBLE_ELEMENT"`
- `"semi_compatible"` → `"SEMI_COMPATIBLE"`
- `"clash"` / `"neutral"` → `"MISMATCH"`

### Aspect Relation Changes
- `"trine"` / `"sextile"` → `"SOFT"`
- `"square"` → `"HARD"`
- `"opposition"` → `"OPPOSITION"`
- `"same_sign"` / `"none"` → `"NEUTRAL"`

### Wu Xing Relation Changes
- `"supportive"` → `"GENERATING"`
- `"same"` → `"SAME"`
- `"clashing"` → `"CONTROLLING"`
- `"neutral"` → `"OTHER"`

## Benefits

1. **Clearer Boundaries**: Each pattern has explicit min/max scores
2. **Better UI Integration**: Rich metadata (emojis, labels, taglines) built into the engine
3. **Simplified Logic**: Fewer edge cases, clearer scoring rules
4. **Pattern-First Design**: Chinese pattern drives the score, Western signs provide adjustments
5. **Maintainability**: Easier to tune individual patterns without affecting others

## Testing

The engine is backward compatible, so all existing code should continue to work. The development server on port 3000 is already using the updated engine.

Test the new engine by:
1. Navigate to the matches page
2. Check that scores and tiers display correctly
3. Verify that different pattern combinations produce expected score ranges
4. Confirm that the connection boxes show the new pattern labels and emojis

## Date
Updated: November 24, 2025

