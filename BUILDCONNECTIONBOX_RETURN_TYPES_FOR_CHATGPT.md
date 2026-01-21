# buildConnectionBox() Return Types for ChatGPT

## Function Signature

```typescript
export function buildConnectionBox(
  userA: UserProfile, 
  userB: UserProfile,
  yearElementA?: WuXing,
  yearElementB?: WuXing
): SimpleConnectionBox
```

**Location**: `/lib/compat/engine.ts` line 2412

---

## Return Type: SimpleConnectionBox

**Location**: `/lib/compat/types.ts` lines 94-127

```typescript
export interface SimpleConnectionBox {
  // Core match information
  matchLabel: string;          // e.g. "Soulmate Match"
  score: number;               // e.g. 95 (0-100)
  headingLine: string;         // "Soulmate Match · 95%"
  pairLine: string;            // "Aquarius/Monkey × Sagittarius/Rabbit"
  
  // Chinese zodiac information
  chineseLine: string;         // "Monkey × Rabbit — Liu He (六合) "Six Harmonies / Six Harmoniess" (Cross-Trine)"
  chineseDescription?: string; // Pattern-specific description paragraph
  chineseTagline?: string;     // Tagline from detailed compatibility (e.g. "Action and antics")
  
  // Western zodiac information
  westernSignLine: string;     // "Aquarius × Pisces — Dreamy and imaginative; Aquarius thinks in systems..."
  westernLine: string;         // "Aquarius × Pisces — Air–Water (semi-compatible)"
  westernDescription?: string; // Western element meaning line
  westernTagline?: string;     // Tagline from detailed compatibility (e.g. "Systems and ideas")
  
  // Wu Xing (Five Elements)
  wuXingLine?: string;         // Optional Wu Xing harmony line
  
  // Overview paragraph
  overview: string;            // Blended compatibility paragraph
  
  // Pattern metadata (from match engine)
  chinesePattern?: import('@/lib/matchEngine').ChinesePattern;
  westAspect?: import('@/lib/matchEngine').WestAspect;
  westElementRelation?: import('@/lib/matchEngine').WestElementRelation;
  isChineseOpposite?: boolean;
  isLivelyPair?: boolean;
  
  // NEW: Match engine result fields for photo carousel pill
  pillLabel?: string;              // e.g. "92% · Triple Harmony"
  pattern?: import('@/lib/matchEngine').ChinesePattern; // For gradient lookup
  patternFullLabel?: string;       // e.g. "🌟 San He 三合 · Triple Harmony · 92%"
  baseTagline?: string;            // Pattern-specific tagline
  patternEmoji?: string;           // Pattern emoji (e.g. "🌟")
  chemistryStars?: number;         // Chemistry star rating (0-5, in 0.5 steps)
  stabilityStars?: number;         // Stability star rating (0-5, in 0.5 steps)
  
  // Additional matchEngineCore fields
  patternLabelEn?: string;         // e.g. "Triple Harmony"
  patternLabelZh?: string;         // e.g. "三合"
  patternTagline?: string;         // e.g. "Classic trine alliance with strong, long-term harmony."
  connectionOverview?: string;     // e.g. "Very strong, flowing harmony with excellent long-term potential."
}
```

---

## MatchResult Type (from buildMatchResult)

**Location**: `/lib/matchEngine.ts` lines 50-60

```typescript
export interface MatchResult {
  score: number;                // 0–100
  pattern: ChinesePattern;      // e.g. "SAN_HE", "LIU_HE", "SAME_SIGN", etc.
  patternEmoji: string;         // e.g. "🌟"
  patternShortLabelEn: string;  // "Triple Harmony"
  patternFullLabel: string;     // "🌟 San He 三合 · Triple Harmony · 92%"
  pillLabel: string;            // "92% · Triple Harmony"
  baseTagline: string;          // Pattern explanation line
  chemistryStars: number;       // 0–5 in 0.5 steps
  stabilityStars: number;       // 0–5 in 0.5 steps
}
```

**Note**: `buildConnectionBox()` internally calls `buildMatchResult()` which returns `MatchResult`, and then maps those fields into `SimpleConnectionBox`.

---

## ChinesePattern Type Values

**Location**: `/lib/matchEngine.ts` lines 10-15

```typescript
export type ChinesePattern =
  | "SAN_HE"      // Triple Harmony (三合)
  | "LIU_HE"      // Six Harmonies (六合)
  | "SAME_SIGN"   // Same Chinese Animal
  | "NO_PATTERN"  // Neutral
  | "LIU_CHONG"   // Six Conflicts (六冲)
  | "LIU_HAI"     // Six Harms (六害)
  | "XING"        // Punishment (刑)
  | "PO";         // Break (破)
```

---

## UI Overlay Props Shape for Carousel

Based on the `SimpleConnectionBox` fields used in the photo carousel, the overlay props would be:

```typescript
interface CarouselOverlayProps {
  // From MatchResult / SimpleConnectionBox
  pillLabel?: string;              // "92% · Triple Harmony"
  patternFullLabel?: string;       // "🌟 San He 三合 · Triple Harmony · 92%"
  baseTagline?: string;            // Pattern tagline
  patternEmoji?: string;           // "🌟"
  chemistryStars?: number;         // 0-5 (0.5 steps)
  stabilityStars?: number;         // 0-5 (0.5 steps)
  
  // Additional metadata
  pattern?: ChinesePattern;        // For gradient/color lookup
  score?: number;                  // 0-100 for score-based styling
  matchLabel?: string;             // "Soulmate Match", etc.
  
  // Pattern labels
  patternLabelEn?: string;         // "Triple Harmony"
  patternLabelZh?: string;         // "三合"
}
```

---

## Key Fields for Card Rank/Suit/Trine Pip Functions

For `deriveCardRank()`, `deriveCardSuit()`, and `deriveTrinePip()`, you'll likely need:

### deriveCardRank()
- Input: `score: number` (0-100) from `SimpleConnectionBox.score`
- Or: `matchLabel: string` from `SimpleConnectionBox.matchLabel`
- Or: `pattern: ChinesePattern` from `SimpleConnectionBox.pattern`

### deriveCardSuit()
- Input: `pattern: ChinesePattern` from `SimpleConnectionBox.pattern`
- Or: `patternLabelEn: string` from `SimpleConnectionBox.patternLabelEn`
- Or: `chinesePattern?: ChinesePattern` from `SimpleConnectionBox.chinesePattern`

### deriveTrinePip()
- Input: `chineseLine: string` from `SimpleConnectionBox.chineseLine`
- Or: `pattern: ChinesePattern` from `SimpleConnectionBox.pattern`
- Trine names: "Visionaries", "Strategists", "Adventurers", "Artists"
- Trine IDs: 1, 2, 3, 4

**Trine mapping** (from `/lib/compat/engine.ts`):
- Trine 1 (Visionaries): Rat, Dragon, Monkey
- Trine 2 (Strategists): Ox, Snake, Rooster  
- Trine 3 (Adventurers): Tiger, Horse, Dog
- Trine 4 (Artists): Rabbit, Goat, Pig

---

## Example SimpleConnectionBox Return Value

```typescript
{
  matchLabel: "Soulmate Match",
  score: 95,
  headingLine: "Soulmate Match · 95%",
  pairLine: "Aquarius/Monkey × Sagittarius/Rabbit",
  chineseLine: "Monkey × Rat — San He (三合) \"Three Harmonies\" (Same Trine: Visionaries 三会)",
  westernSignLine: "Aquarius × Sagittarius — Dreamy and imaginative...",
  westernLine: "Aquarius × Sagittarius — Air–Fire (compatible)",
  overview: "Aquarius brings clarity while Sagittarius brings adventure...",
  pillLabel: "95% · Triple Harmony",
  pattern: "SAN_HE",
  patternFullLabel: "🌟 San He 三合 · Triple Harmony · 95%",
  baseTagline: "Two souls moving in perfect rhythm – effortless harmony and shared purpose.",
  patternEmoji: "🌟",
  chemistryStars: 5,
  stabilityStars: 5,
  patternLabelEn: "Triple Harmony",
  patternLabelZh: "三合",
  chinesePattern: "SAN_HE",
  westElementRelation: "COMPATIBLE",
  chemistryStars: 5,
  stabilityStars: 5
}
```

---

## Notes for ChatGPT

1. **buildConnectionBox()** returns `SimpleConnectionBox`, which contains all the fields from `MatchResult` plus additional display fields.

2. **Key pattern fields**:
   - `pattern` (ChinesePattern): Primary pattern for card suit/rank derivation
   - `score` (number): For card rank derivation
   - `chineseLine`: Contains trine information for trine pip derivation

3. **Trine information** can be extracted from:
   - `chineseLine`: Contains text like "(Same Trine: Visionaries 三会)"
   - Pattern type: SAN_HE patterns belong to one of 4 trines
   - `pairLine`: Contains animal names (e.g. "Monkey", "Rat") which can map to trines

4. **Card derivation functions** should accept `SimpleConnectionBox` as input (or specific fields extracted from it).

5. **All fields marked with `?` are optional**, so your functions should handle undefined values.
