# Same Western Sign Rule - Marking Down Same Signs

## Overview

The match engine applies a **penalty** (marking down) when two profiles have the **same Western zodiac sign**. This rule prevents inflated compatibility scores for identical signs, as same signs can create intensity but also amplify challenges.

## Configuration

Located in: `/lib/matchEngine.config.ts`

```typescript
same_western_sign: {
  enabled: true,
  score_delta_default: -4,                    // Baseline penalty
  score_delta_if_same_chinese_trine: -6,      // If also same Chinese trine
  score_delta_if_same_chinese_animal: -9,     // If also same Chinese animal
  score_softened_if_strong_east: -2,         // Optional nuance if East is strong
  tier_caps: {
    default_max_score: 94,                     // Max score cap (default)
    if_same_chinese_trine: 84,                // Max score if same Chinese trine
    if_same_chinese_animal: 100               // Max score if same Chinese animal
  }
}
```

## Penalty Structure

The penalty is applied based on the combination of Western and Chinese zodiac matches:

| Scenario | Penalty | Max Score Cap | Reasoning |
|----------|---------|--------------|-----------|
| **Same Western Sign Only** | -4 | 94 | Baseline penalty for identical sun signs |
| **Same Western + Same Chinese Trine** | -6 | 84 | Double similarity creates more intensity/challenges |
| **Same Western + Same Chinese Animal** | -9 | 100 | Triple similarity - very intense, but can work if balanced |

### Special Case: Strong East Softening

If the Chinese zodiac compatibility is strong (score ≥ 80) and they're NOT the same Chinese animal, the penalty is softened:
- **Softened Penalty**: -2 (instead of -4)

This recognizes that strong Chinese zodiac harmony can help balance the intensity of same Western signs.

## Implementation

The rule is applied in `/lib/matchExplainAndScore.ts`:

```typescript
// Apply same Western sign PENALTY (marking down) instead of bonus
if (sameWestSign && sameWestRule?.enabled) {
  let delta = sameWestRule.score_delta_default; // baseline -4
  
  // Check if same Chinese trine
  if (sameTrine) {
    delta = sameWestRule.score_delta_if_same_chinese_trine; // -6
  }
  
  // Check if same Chinese animal
  if (sameEastSign) {
    delta = sameWestRule.score_delta_if_same_chinese_animal; // -9
  }
  
  // Apply penalty (negative delta)
  sameSignBonus += delta; // This will be negative (e.g., -4, -6, or -9)
}
```

## Examples

### Example 1: Leo × Leo (Different Chinese Signs)
- **Western**: Same sign (Leo × Leo)
- **Chinese**: Different (e.g., Rabbit × Tiger)
- **Penalty**: -4
- **Max Cap**: 94
- **Result**: Score reduced by 4 points, capped at 94

### Example 2: Leo × Leo (Same Chinese Trine)
- **Western**: Same sign (Leo × Leo)
- **Chinese**: Same trine (e.g., Rabbit × Goat - both Artists trine)
- **Penalty**: -6
- **Max Cap**: 84
- **Result**: Score reduced by 6 points, capped at 84

### Example 3: Leo × Leo (Same Chinese Animal)
- **Western**: Same sign (Leo × Leo)
- **Chinese**: Same animal (e.g., Rabbit × Rabbit)
- **Penalty**: -9
- **Max Cap**: 100 (no cap, but heavy penalty)
- **Result**: Score reduced by 9 points, but can still reach 100 if other factors are very strong

## Rationale

### Why Mark Down Same Signs?

1. **Intensity vs. Balance**: Same signs create intense connections but can amplify each other's weaknesses
2. **Lack of Complementarity**: Missing the balancing effect of different signs
3. **Potential for Conflict**: Similar traits can clash when both people have the same strengths/weaknesses
4. **Prevent Score Inflation**: Without this rule, same-sign matches could artificially score too high

### Why Different Penalties?

- **Same Western Only (-4)**: Moderate penalty - intensity but manageable
- **Same Western + Same Trine (-6)**: Stronger penalty - double similarity creates more challenges
- **Same Western + Same Animal (-9)**: Heaviest penalty - triple similarity is very intense, but can work if balanced by other factors

## Tier Caps

The tier caps prevent same-sign matches from reaching inflated tiers:

- **Default (94)**: Prevents reaching "Soulmate" tier (95-100) for same Western signs alone
- **Same Trine (84)**: Prevents reaching "Excellent" tier (85-94) when also same Chinese trine
- **Same Animal (100)**: Allows full range but with heavy -9 penalty, so only exceptional cases reach top tiers

## Relationship to Other Rules

- **Chinese Same Sign**: Still gets +4 bonus (not penalized)
- **Element Compatibility**: Still applies normally
- **Trine Bonuses**: Still apply normally
- **Synergy Bonuses**: Still apply for perfect/strong combinations

## Status

✅ **Enabled**: The rule is currently active in production  
📝 **Location**: `/lib/matchEngine.config.ts` and `/lib/matchExplainAndScore.ts`  
🔧 **Configurable**: Can be disabled or adjusted via config file

