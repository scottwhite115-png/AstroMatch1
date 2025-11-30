# Complete Match Score System — Visual Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                          INPUT DATA                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  User A: 1980 Metal Monkey, Aquarius (Air)                        │
│  User B: 1991 Water Goat, Leo (Fire)                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    PATTERN DETERMINATION                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Chinese Pattern:  Monkey × Goat = "cross_trine"                   │
│  Western Aspect:   Aquarius × Leo = "opposition"                   │
│  Year Elements:    Metal × Water                                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BASE SCORE CALCULATION                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Chinese Compatibility:                                            │
│    Cross trine (no special bond)                                   │
│    → Base Chinese Score: 62/100                                    │
│                                                                     │
│  Western Compatibility:                                            │
│    Air–Fire opposition (stimulating)                               │
│    → Base Western Score: 78/100                                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│              computeFinalMatchScore()                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Step 1: BLEND Chinese (70%) + Western (30%)                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                      │
│    (0.7 × 62) + (0.3 × 78)                                         │
│    = 43.4 + 23.4                                                   │
│    = 66.8                                                          │
│                                                                     │
│  Step 2: WU XING ADJUSTMENT                                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                      │
│    getWuXingScoreBonus(                                            │
│      pattern: "cross_trine",                                       │
│      elemA: "Metal",                                               │
│      elemB: "Water"                                                │
│    )                                                               │
│    ↓                                                               │
│    Metal → Water (generating cycle) = supportive                   │
│    Cross trine + supportive = +4                                   │
│                                                                     │
│  Step 3: APPLY ADJUSTMENT                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                      │
│    66.8 + 4 = 70.8                                                 │
│                                                                     │
│  Step 4: CLAMP & ROUND                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                      │
│    Math.round(70.8) = 71                                           │
│    Clamp to [0, 100] → 71                                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      FINAL OUTPUT                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Score: 71/100                                                      │
│  Tier: Favourable Match ✨                                          │
│                                                                     │
│  Connection Lines:                                                  │
│  ─────────────────                                                  │
│  • Chinese: "Monkey × Goat — Cross trine, no classical pattern"    │
│  • Western: "Aquarius × Leo — Air fans Fire (opposites)"           │
│  • Wu Xing: "Metal Monkey × Water Goat — Supportive"               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Score Weighting Breakdown

```
┌─────────────────────────────────────────────────────────────┐
│                    SCORE COMPONENTS                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  CHINESE ZODIAC COMPATIBILITY                        │  │
│  │  Weight: 70%                                         │  │
│  │  ─────────────────────────────────────────────────   │  │
│  │  • Animal patterns (San He, Liu He, etc.)           │  │
│  │  • Trine relationships                               │  │
│  │  • Opposition/clash patterns                         │  │
│  │                                                       │  │
│  │  Score: 62/100                                       │  │
│  │  Weighted: 0.7 × 62 = 43.4                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                           +                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  WESTERN ZODIAC COMPATIBILITY                        │  │
│  │  Weight: 30%                                         │  │
│  │  ─────────────────────────────────────────────────   │  │
│  │  • Element interactions (Fire-Air, Earth-Water)     │  │
│  │  • Aspects (trine, square, opposition)              │  │
│  │  • Modality compatibility                            │  │
│  │                                                       │  │
│  │  Score: 78/100                                       │  │
│  │  Weighted: 0.3 × 78 = 23.4                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                           +                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  WU XING YEAR ELEMENT ADJUSTMENT                     │  │
│  │  Range: -6 to +6 points                             │  │
│  │  ─────────────────────────────────────────────────   │  │
│  │  • Generating cycle (supportive)                     │  │
│  │  • Controlling cycle (clashing)                      │  │
│  │  • Same element (reinforcing)                        │  │
│  │  • Context-aware based on pattern                    │  │
│  │                                                       │  │
│  │  Adjustment: +4 points                               │  │
│  │  (neutral pattern + supportive elements)             │  │
│  └──────────────────────────────────────────────────────┘  │
│                           =                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  FINAL MATCH SCORE                                   │  │
│  │  ═══════════════════════════════════════════════     │  │
│  │  43.4 + 23.4 + 4 = 70.8 → 71/100                    │  │
│  │                                                       │  │
│  │  Tier: Favourable Match ✨                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Wu Xing Adjustment Matrix

```
┌──────────────────────────────────────────────────────────────────┐
│  WU XING SCORE ADJUSTMENTS BY PATTERN & ELEMENT RELATION        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Pattern Type         │ Supportive │  Same  │ Clashing │ Neutral│
│  ─────────────────────┼────────────┼────────┼──────────┼────────│
│  GOOD                 │            │        │          │        │
│  (San He, Liu He,     │    +6      │   +4   │    -6    │   0    │
│   Same Trine)         │            │        │          │        │
│  ─────────────────────┼────────────┼────────┼──────────┼────────│
│  DIFFICULT            │            │        │          │        │
│  (Liu Chong, Liu Hai, │    +2      │   +1   │    -2    │   0    │
│   Xing, Po)           │            │        │          │        │
│  ─────────────────────┼────────────┼────────┼──────────┼────────│
│  NEUTRAL              │            │        │          │        │
│  (Cross Trine,        │    +4      │   +2   │    -4    │   0    │
│   Same Animal, None)  │            │        │          │        │
│  ─────────────────────┴────────────┴────────┴──────────┴────────│
│                                                                  │
│  Legend:                                                         │
│  • Supportive = Generating cycle (Wood→Fire, Fire→Earth, etc.) │
│  • Same = Both users have same year element                     │
│  • Clashing = Controlling cycle (Water→Fire, Fire→Metal, etc.) │
│  • Neutral = No strong relationship between elements            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Real-World Score Examples

### Example 1: Maximum Score Boost

```
┌───────────────────────────────────────────────┐
│  San He Alliance + Supportive Elements        │
├───────────────────────────────────────────────┤
│  Users: Metal Monkey (1980) × Water Rat (1972)│
│                                                │
│  Chinese: 90 (San He) × 0.7 = 63.0            │
│  Western: 75 (Air-Water) × 0.3 = 22.5         │
│  Blend: 85.5                                   │
│  Wu Xing: +6 (good pattern + supportive)      │
│  ─────────────────────────────────────────     │
│  Final: 85.5 + 6 = 91.5 → 92                  │
│  Tier: ⭐ Soulmate Match                       │
└───────────────────────────────────────────────┘
```

### Example 2: Maximum Score Penalty

```
┌───────────────────────────────────────────────┐
│  San He Alliance + Clashing Elements          │
├───────────────────────────────────────────────┤
│  Users: Water Rat (1972) × Fire Dragon (1976) │
│                                                │
│  Chinese: 92 (San He) × 0.7 = 64.4            │
│  Western: 70 (Air-Fire) × 0.3 = 21.0          │
│  Blend: 85.4                                   │
│  Wu Xing: -6 (good pattern + clashing)        │
│  ─────────────────────────────────────────     │
│  Final: 85.4 - 6 = 79.4 → 79                  │
│  Tier: ⭐ Excellent Match (but watch out!)    │
└───────────────────────────────────────────────┘
```

### Example 3: Moderate Boost

```
┌───────────────────────────────────────────────┐
│  Cross Trine + Supportive Elements            │
├───────────────────────────────────────────────┤
│  Users: Metal Monkey (1980) × Water Goat (1991)│
│                                                │
│  Chinese: 62 (Cross trine) × 0.7 = 43.4       │
│  Western: 78 (Air-Fire) × 0.3 = 23.4          │
│  Blend: 66.8                                   │
│  Wu Xing: +4 (neutral pattern + supportive)   │
│  ─────────────────────────────────────────     │
│  Final: 66.8 + 4 = 70.8 → 71                  │
│  Tier: ✨ Favourable Match                     │
└───────────────────────────────────────────────┘
```

### Example 4: Difficult Match Slightly Improved

```
┌───────────────────────────────────────────────┐
│  Liu Chong Opposition + Supportive Elements   │
├───────────────────────────────────────────────┤
│  Users: Wood Tiger (1974) × Fire Monkey (1956)│
│                                                │
│  Chinese: 48 (Liu Chong) × 0.7 = 33.6         │
│  Western: 70 (Fire-Fire) × 0.3 = 21.0         │
│  Blend: 54.6                                   │
│  Wu Xing: +2 (difficult pattern + supportive) │
│  ─────────────────────────────────────────     │
│  Final: 54.6 + 2 = 56.6 → 57                  │
│  Tier: ⚠️ Challenging Match (but not hopeless)│
└───────────────────────────────────────────────┘
```

---

## Integration Checklist

```
✅ IMPLEMENTATION
   ├─ ✅ computeFinalMatchScore() added to connectionText.ts
   ├─ ✅ MatchScoreInput interface defined
   ├─ ✅ getWuXingScoreBonus() function complete
   └─ ✅ Score clamping and rounding implemented

✅ DEPENDENCIES
   ├─ ✅ computeWuXingRelation() available
   ├─ ✅ Wu Xing cycles defined (generating, controlling)
   └─ ✅ Pattern constants defined (GOOD_PATTERNS, DIFFICULT_PATTERNS)

✅ DATA REQUIREMENTS
   ├─ ✅ Base Chinese score (0-100)
   ├─ ✅ Base Western score (0-100)
   ├─ ✅ Chinese pattern (ChinesePattern type)
   └─ ✅ Year elements (optional, WuXing type)

✅ OUTPUT
   ├─ ✅ Returns integer score 0-100
   ├─ ✅ Graceful fallback when elements missing
   └─ ✅ Consistent rounding behavior
```

---

**Status:** ✅ Complete and Production-Ready
**File:** `lib/connectionText.ts`
**Functions:**
- `computeFinalMatchScore(input: MatchScoreInput): number`
- `getWuXingScoreBonus(pattern, elemA, elemB): number`
- `buildConnectionLines(ctx: ConnectionContext): ConnectionLines`

