# Match Engine Update - Chinese Patterns

This update integrates a new Chinese pattern detection system into the match engine with precise same-sign scoring based on Western element relationships.

## New Files

### 1. `src/lib/matchEngine/chinesePatterns.ts`
Core Chinese pattern detection logic with the following features:
- **9 Pattern Types**: Including SAME_SIGN, SAME_SIGN_SELF_PUNISH, SAN_HE, LIU_HE, LIU_CHONG, LIU_HAI, XING, PO, and NONE
- **Self-Punish Detection**: Automatically identifies the 4 self-punishing animals (Dragon, Horse, Rooster, Pig)
- **Priority-Based Detection**: Patterns are detected in a specific priority order to ensure accuracy
- **Bidirectional Compatibility**: Functions to convert between old and new pattern formats

### 2. `src/lib/matchEngine/index.ts`
Export file for easy imports from the matchEngine module.

### 3. `src/lib/matchEngine/example.ts`
Example usage showing how to integrate the new pattern detection with your profiles.

### 4. `src/lib/matchEngine/test.ts`
Comprehensive test file covering all pattern types.

## Updated Files

### `src/lib/matchEngine.ts`
**Key Changes:**
1. **Import New Pattern Detection**: Added imports for `getPrimaryChinesePatternTag` and related types
2. **Enhanced MatchContext**: Added optional `chinesePatternTag` field to store the original pattern tag
3. **Element-Aware Same-Sign Scoring**: Implemented specific scoring for SAME_SIGN and SAME_SIGN_SELF_PUNISH based on Western element relationships
4. **Auto-Detection**: `buildMatchContext` now automatically detects patterns if not provided
5. **Re-exports**: Convenient re-exports of pattern detection functions

## Pattern Types

| Pattern Tag | Description | Score Range |
|------------|-------------|-------------|
| `SAN_HE` | Triple Harmony (trine alliance) | High (75+) |
| `LIU_HE` | Secret Friends (supportive bond) | Good (70-85) |
| `LIU_CHONG` | Six Conflicts (opposites attract) | Variable (52-70) |
| `SAME_SIGN` | Same Chinese zodiac sign (non-self-punishing) | 58-68* |
| `SAME_SIGN_SELF_PUNISH` | Same sign for Dragon/Horse/Rooster/Pig | 54-64* |
| `LIU_HAI` | Six Harms (sensitive pairing) | Lower (30-55) |
| `XING` | Punishment (friction) | Lower (30-55) |
| `PO` | Break (instability) | Lower-Moderate (35-55) |
| `NONE` | Neutral (no strong pattern) | Moderate (50-70) |

*Same-sign scores vary by Western element relationship:
- **Same element**: 68 / 64
- **Compatible elements**: 65 / 61
- **Semi-compatible**: 62 / 58
- **Clash**: 58 / 54

## Usage Examples

### Basic Pattern Detection

```typescript
import {
  ChineseAnimal,
  ChinesePatternTag,
  getPrimaryChinesePatternTag,
} from "@/lib/matchEngine/chinesePatterns";

const animalA: ChineseAnimal = "Dragon";
const animalB: ChineseAnimal = "Rooster";

const pattern: ChinesePatternTag = getPrimaryChinesePatternTag(animalA, animalB);
// Returns: "LIU_HE" (Secret Friends)
```

### Complete Match Score Calculation

```typescript
import { buildMatchContext, computeMatchScore } from "@/lib/matchEngine";

type Profile = {
  chineseAnimal: ChineseAnimal;
  westernSign: WesternSign;
  birthYear: number;
};

function computeMatch(profileA: Profile, profileB: Profile) {
  // Build context - pattern detection happens automatically
  const ctx = buildMatchContext(
    profileA.westernSign,
    profileB.westernSign,
    profileA.chineseAnimal,
    profileB.chineseAnimal,
    profileA.birthYear,
    profileB.birthYear
  );

  // Compute score
  const result = computeMatchScore(ctx);
  
  return {
    score: result.score,  // 0-100
    tier: result.tier,     // "Soulmate", "Harmonious Match", etc.
  };
}
```

### Same-Sign Example (Element-Aware Scoring)

```typescript
// Dragon + Dragon with same Fire element
const ctx1 = buildMatchContext(
  "Aries",    // Fire
  "Leo",      // Fire
  "Dragon",   // Self-punish animal
  "Dragon",
  1988,
  2000
);
const result1 = computeMatchScore(ctx1);
// Expected: pattern = SAME_SIGN_SELF_PUNISH, score ≈ 64

// Dragon + Dragon with clashing elements
const ctx2 = buildMatchContext(
  "Aries",    // Fire
  "Cancer",   // Water (clash)
  "Dragon",
  "Dragon",
  1988,
  2000
);
const result2 = computeMatchScore(ctx2);
// Expected: pattern = SAME_SIGN_SELF_PUNISH, score ≈ 54
```

## Pattern Priority Order

When detecting patterns, the system follows this priority:

1. **Same Sign** (including self-punish) - Checked FIRST
2. **Liu Chong** (Six Conflicts) - Strong opposition
3. **Liu Hai** (Six Harms) - Harmful patterns
4. **San He** (Triple Harmony) - Harmonious trine
5. **Liu He** (Secret Friends) - Supportive pairs
6. **Xing** (Punishment) - Friction patterns
7. **Po** (Break) - Breaking patterns
8. **None** - Neutral/no pattern

This ensures same-sign matches are never incorrectly classified as San He or other patterns.

## Self-Punishing Animals

Only these 4 animals self-punish when matched with themselves:
- Dragon (龍)
- Horse (馬)
- Rooster (雞)
- Pig (豬)

Other animals in same-sign matches receive the regular `SAME_SIGN` tag.

## Compatibility with Existing Code

The update is **backward compatible**:
- Existing code using `buildMatchContext` with explicit patterns still works
- New code can omit the pattern parameter for automatic detection
- Helper functions convert between old and new pattern formats
- All existing types and functions remain unchanged

## Testing

Run the test file to verify all patterns work correctly:

```bash
# Note: Adjust based on your project setup
npx ts-node src/lib/matchEngine/test.ts
```

Or import and use in your test suite:

```typescript
import { getPrimaryChinesePatternTag } from "@/lib/matchEngine";

test("San He detection", () => {
  const pattern = getPrimaryChinesePatternTag("Rat", "Dragon");
  expect(pattern).toBe("SAN_HE");
});
```

## Migration Guide

### Before (Old Code)
```typescript
// Had to manually determine pattern or use legacy system
const pattern = getChinesePattern(animal1, animal2); // from lib/compat/engine
const ctx = buildMatchContext(west1, west2, chinese1, chinese2, year1, year2, pattern);
```

### After (New Code)
```typescript
// Pattern detection is automatic
const ctx = buildMatchContext(west1, west2, chinese1, chinese2, year1, year2);
// or explicitly get the pattern
const pattern = getPrimaryChinesePatternTag(chinese1, chinese2);
```

## Notes

- Same-sign scoring now considers Western element relationships for more nuanced results
- Self-punishing signs (Dragon, Horse, Rooster, Pig) receive lower scores when matched with themselves
- The system maintains the existing 70/30 Chinese/Western weighting
- Wu Xing (Five Elements) adjustments still apply on top of base scores
- All patterns are properly integrated with the tier system (Soulmate, Twin Flame, etc.)

## Files Modified

- `src/lib/matchEngine.ts` - Core match engine with new pattern integration
- `src/lib/matchEngine/chinesePatterns.ts` - NEW: Pattern detection logic
- `src/lib/matchEngine/index.ts` - NEW: Module exports
- `src/lib/matchEngine/example.ts` - NEW: Usage examples
- `src/lib/matchEngine/test.ts` - NEW: Test suite

## Next Steps

1. ✅ Pattern detection system implemented
2. ✅ Same-sign scoring with element awareness added
3. ✅ Integration with existing match engine complete
4. ⏭️ Run tests in your environment
5. ⏭️ Update UI components to display pattern tags if needed
6. ⏭️ Consider adding pattern descriptions/explanations for users

