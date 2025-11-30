# Wu Xing Score Adjustment System

## Overview

The `getWuXingScoreBonus()` function provides score adjustments based on the interaction between:
1. **Chinese zodiac pattern** (San He, Liu He, Liu Chong, etc.)
2. **Year element compatibility** (supportive, same, clashing, neutral)

This creates a more nuanced scoring system where year elements can either amplify or dampen the base pattern compatibility.

## Core Logic

### Score Range
- **Maximum bonus:** +6 points
- **Maximum penalty:** -6 points
- **No adjustment:** 0 points (when neutral or missing data)

### Pattern Categories

**Good Patterns** (naturally supportive):
- `san_he` — San He 三合 alliance
- `liu_he` — Liu He 六合 "secret friend"
- `same_trine` — Same trine members

**Difficult Patterns** (naturally challenging):
- `liu_chong` — Liu Chong 六冲 opposition
- `liu_hai` — Liu Hai 六害 harm
- `xing` — Xing 刑 punishment
- `po` — Po 破 break

**Neutral Patterns** (neither particularly good nor bad):
- `cross_trine` — Different trines
- `same_animal` — Same animal
- `none` — No special pattern

## Scoring Matrix

### Supportive Elements (Generating Cycle)

| Pattern Type | Adjustment | Reasoning |
|--------------|-----------|-----------|
| Good pattern | **+6** | Already great animal match + supportive elements = maximum harmony |
| Difficult pattern | **+2** | Elements provide some relief to challenging pattern |
| Neutral pattern | **+4** | Solid boost from elemental support |

**Examples:**
- San He + Metal→Water: +6 (Metal Monkey × Water Rat)
- Liu Chong + Wood→Fire: +2 (Wood Tiger × Fire Monkey)
- Cross trine + Fire→Earth: +4 (Fire Horse × Earth Ox)

### Same Element

| Pattern Type | Adjustment | Reasoning |
|--------------|-----------|-----------|
| Good pattern | **+4** | Reinforces already good pattern |
| Difficult pattern | **+1** | Small help, but doesn't fix core issues |
| Neutral pattern | **+2** | Modest boost from shared energy |

**Examples:**
- San He + Fire/Fire: +4 (Fire Horse × Fire Tiger)
- Liu Chong + Water/Water: +1 (Water Rat × Water Horse)
- Cross trine + Earth/Earth: +2 (Earth Ox × Earth Snake)

### Clashing Elements (Controlling Cycle)

| Pattern Type | Adjustment | Reasoning |
|--------------|-----------|-----------|
| Good pattern | **-6** | Elements undermine otherwise excellent pattern |
| Difficult pattern | **-2** | Already challenging, don't make it worse |
| Neutral pattern | **-4** | Clear drag on compatibility |

**Examples:**
- San He + Water→Fire: -6 (Water Rat × Fire Dragon — rare clash)
- Liu Chong + Metal→Wood: -2 (Metal Rooster × Wood Rabbit)
- Cross trine + Earth→Water: -4 (Earth Dog × Water Pig)

### Neutral Elements

| Pattern Type | Adjustment | Reasoning |
|--------------|-----------|-----------|
| Any pattern | **0** | No significant interaction |

**Examples:**
- Any pattern + Wood/Metal: 0 (not in generating or controlling cycle)

## Integration Example

### In Your Match Engine

```typescript
import { 
  getWuXingScoreBonus, 
  buildConnectionLines,
  type ConnectionContext 
} from "@/lib/connectionText";

function calculateMatchScore(
  userA: AstroProfile,
  userB: AstroProfile,
  pattern: ChinesePattern,
  aspect: WestAspect
): number {
  // Base score from other factors (zodiac patterns, aspects, etc.)
  let score = calculateBaseScore(userA, userB, pattern, aspect);
  
  // Apply Wu Xing adjustment
  const wuXingBonus = getWuXingScoreBonus(
    pattern,
    userA.chineseElement, // year element
    userB.chineseElement  // year element
  );
  
  score += wuXingBonus;
  
  // Clamp to valid range
  return Math.max(0, Math.min(100, score));
}
```

### Complete Example with Connection Lines

```typescript
import { 
  getWuXingScoreBonus,
  buildConnectionLines,
  type ConnectionContext,
  type ChinesePattern,
  type WestAspect
} from "@/lib/connectionText";

interface AstroProfile {
  sunSign: string;
  sunElement: "Fire" | "Earth" | "Air" | "Water";
  chineseAnimal: string;
  chineseElement: WuXing; // year element
}

function generateMatch(userA: AstroProfile, userB: AstroProfile) {
  // Determine patterns
  const chinesePattern: ChinesePattern = determineChinesePattern(
    userA.chineseAnimal,
    userB.chineseAnimal
  );
  const westAspect: WestAspect = determineWestAspect(
    userA.sunSign,
    userB.sunSign
  );
  
  // Calculate base score (from other compatibility factors)
  let score = 75; // example base score
  
  // Add Wu Xing adjustment
  const wuXingBonus = getWuXingScoreBonus(
    chinesePattern,
    userA.chineseElement,
    userB.chineseElement
  );
  
  score += wuXingBonus;
  score = Math.max(0, Math.min(100, score));
  
  // Generate connection lines
  const ctx: ConnectionContext = {
    westA: { sign: userA.sunSign, element: userA.sunElement },
    westB: { sign: userB.sunSign, element: userB.sunElement },
    chineseA: {
      animal: userA.chineseAnimal,
      yearElement: userA.chineseElement,
    },
    chineseB: {
      animal: userB.chineseAnimal,
      yearElement: userB.chineseElement,
    },
    chinesePattern,
    westAspect,
  };
  
  const lines = buildConnectionLines(ctx);
  
  return {
    score,
    wuXingBonus, // for debugging/display
    ...lines,
  };
}
```

## Real-World Examples

### Example 1: San He + Supportive Elements (Maximum Harmony)

**Users:**
- User A: 1980 Metal Monkey, Aquarius
- User B: 1972 Water Rat, Pisces

**Analysis:**
- Chinese Pattern: `san_he` (Monkey-Rat alliance)
- Year Elements: Metal → Water (generating cycle, **supportive**)
- Base Score: 85
- Wu Xing Bonus: **+6** (good pattern + supportive elements)
- **Final Score: 91**

**Lines:**
```
chineseLine: "Monkey × Rat — San He 三合 alliance: natural teamwork"
westernLine: "Aquarius × Pisces — Air–Water (semi-compatible)"
wuXingLine: "Metal Monkey × Water Rat — Elemental harmony: Supportive (Metal generates Water)."
```

### Example 2: Liu Chong + Clashing Elements (Difficult Match)

**Users:**
- User A: 1972 Water Rat, Aquarius
- User B: 1966 Fire Horse, Leo

**Analysis:**
- Chinese Pattern: `liu_chong` (Rat-Horse opposition)
- Year Elements: Water → Fire (controlling cycle, **clashing**)
- Base Score: 55
- Wu Xing Bonus: **-2** (difficult pattern + clashing elements, but not overkill)
- **Final Score: 53**

**Lines:**
```
chineseLine: "Rat × Horse — Liu Chong 六冲 opposition: strong pull, strong friction"
westernLine: "Aquarius × Leo — Air fans Fire (opposites), high-voltage chemistry"
wuXingLine: "Water Rat × Fire Horse — Elemental tension: Clashing elements, extra patience needed."
```

### Example 3: San He + Clashing Elements (Mixed Signals)

**Users:**
- User A: 1972 Water Rat, Aquarius
- User B: 1976 Fire Dragon, Aries

**Analysis:**
- Chinese Pattern: `san_he` (Rat-Dragon alliance)
- Year Elements: Water → Fire (controlling cycle, **clashing**)
- Base Score: 82
- Wu Xing Bonus: **-6** (good pattern undermined by clashing elements)
- **Final Score: 76**

**Interpretation:** The Chinese zodiac animals are highly compatible (San He alliance), but the year elements create tension. The relationship has great potential but requires awareness of elemental friction.

### Example 4: Cross Trine + Supportive Elements (Pleasant Surprise)

**Users:**
- User A: 1980 Metal Monkey, Aquarius
- User B: 1991 Water Goat, Leo

**Analysis:**
- Chinese Pattern: `cross_trine` (different trines, no special bond)
- Year Elements: Metal → Water (generating cycle, **supportive**)
- Base Score: 68
- Wu Xing Bonus: **+4** (neutral pattern gets solid boost)
- **Final Score: 72**

**Interpretation:** The zodiac animals don't have a classical connection, but the supportive year elements provide a nice foundation for the relationship.

## Technical Implementation Notes

### Missing Data Handling

```typescript
const bonus = getWuXingScoreBonus(pattern, elemA, elemB);
// Returns 0 if elemA or elemB is undefined
// Score remains unchanged when year element data is missing
```

### Score Clamping

Always clamp the final score to valid range:

```typescript
score = Math.max(0, Math.min(100, score));
```

### When to Apply

Apply Wu Xing bonus **after** calculating base compatibility but **before** any tier/label classification:

```
1. Calculate base score (zodiac patterns + aspects + other factors)
2. Apply Wu Xing bonus ← HERE
3. Clamp to 0-100
4. Determine tier (Soulmate, Excellent, etc.)
5. Generate connection lines
```

## Score Impact Summary

| Element Relation | Good Pattern | Difficult Pattern | Neutral Pattern |
|------------------|--------------|-------------------|-----------------|
| **Supportive** | +6 | +2 | +4 |
| **Same** | +4 | +1 | +2 |
| **Clashing** | -6 | -2 | -4 |
| **Neutral** | 0 | 0 | 0 |

## Benefits

✅ **Nuanced Scoring**: Year elements add depth to compatibility calculation
✅ **Balanced Adjustments**: -6 to +6 range doesn't overpower base score
✅ **Context-Aware**: Adjustments consider existing pattern quality
✅ **Graceful Fallback**: Returns 0 when data is missing
✅ **Educational**: Users learn how elements interact with zodiac patterns

## Integration Checklist

- [ ] Import `getWuXingScoreBonus` in match engine
- [ ] Ensure user data includes `chineseElement` (year element)
- [ ] Determine `ChinesePattern` before calling function
- [ ] Apply bonus after base score calculation
- [ ] Clamp final score to 0-100 range
- [ ] Test with various pattern + element combinations
- [ ] Document adjustment in match details (optional)

---

**Status:** ✅ Complete and ready for integration
**Location:** `lib/connectionText.ts`
**Function:** `getWuXingScoreBonus(pattern, elemA, elemB)`

