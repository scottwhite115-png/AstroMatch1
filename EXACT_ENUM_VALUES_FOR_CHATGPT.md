# Exact Enum/String Values for ChatGPT - Drop-in Cursor Code

## 1. Chinese Base Pattern (chineseBase)

**Exact enum strings:**
```typescript
type ChineseBasePattern = 
  | 'SAN_HE'      // Triple Harmony (三合) - Same Trine
  | 'LIU_HE'      // Six Harmonies (六合) - Secret Friends
  | 'SAME_SIGN'   // Same Chinese Animal (同生肖)
  | 'NO_PATTERN'  // Neutral - No strong pattern
```

**Location**: `/lib/connectionUi.ts` line 3

**Usage example:**
```typescript
const chineseBase: ChineseBasePattern = 'SAN_HE';
// or 'LIU_HE', 'SAME_SIGN', 'NO_PATTERN'
```

---

## 2. Western Element Relation (westElemRel)

**Exact enum strings:**
```typescript
type WesternElementRelation =
  | 'SAME'            // Same Western element (e.g., Fire-Fire)
  | 'COMPATIBLE'      // Compatible elements (Fire-Air, Earth-Water)
  | 'SEMI_COMPATIBLE' // Semi-compatible elements (Fire-Earth, Air-Water)
  | 'NEUTRAL'         // Neutral/unknown
  | 'CLASH'           // Clashing elements (Fire-Water, Air-Earth)
```

**Location**: `/lib/connectionUi.ts` lines 5-10

**Note**: In the match engine (`/lib/matchEngine.ts`), these are defined as:
- `'SAME_ELEMENT'` → maps to `'SAME'`
- `'COMPATIBLE_ELEMENT'` → maps to `'COMPATIBLE'`
- `'SEMI_COMPATIBLE'` → maps to `'SEMI_COMPATIBLE'`
- `'MISMATCH'` → maps to `'CLASH'`

**Usage example:**
```typescript
const westElemRel: WesternElementRelation = 'SAME';
// or 'COMPATIBLE', 'SEMI_COMPATIBLE', 'NEUTRAL', 'CLASH'
```

**Mapping function** (from `/lib/compat/engine.ts` line 2008-2014):
```typescript
function mapToWesternElementRelation(rel: string): WesternElementRelation {
  if (rel === 'SAME_ELEMENT') return 'SAME';
  if (rel === 'COMPATIBLE_ELEMENT') return 'COMPATIBLE';
  if (rel === 'SEMI_COMPATIBLE') return 'SEMI_COMPATIBLE';
  if (rel === 'MISMATCH' || rel === 'INCOMPATIBLE') return 'CLASH';
  return 'NEUTRAL';
}
```

---

## 3. Same Western Sign & Western Opposition

**Same Western Sign:**
- **Type**: `boolean`
- **Representation**: `sameWesternSign?: boolean`
- **Value**: `true` if User A and User B have the same Western zodiac sign, `false` otherwise
- **Location**: `/lib/matchEngine.ts` line 46

**Usage:**
```typescript
const sameWestSign: boolean = true; // e.g., both are Leo
```

**Western Opposition:**
- **Type**: `WesternAspectRelation` (in match engine)
- **Enum values**: `'SOFT' | 'NEUTRAL' | 'HARD' | 'OPPOSITION'`
- **Opposition check**: `westernAspectRelation === 'OPPOSITION'`
- **Location**: `/lib/matchEngine.ts` line 26-30

**Usage:**
```typescript
type WesternAspectRelation =
  | 'SOFT'        // Trine or sextile aspects
  | 'NEUTRAL'     // Conjunction or no strong aspect
  | 'HARD'        // Square aspects
  | 'OPPOSITION'; // Opposite signs (Aries-Libra, etc.)

const westOpposition: WesternAspectRelation = 'OPPOSITION';
```

**Opposite sign pairs** (from `/lib/compat/engine.ts` lines 845-852):
```typescript
const OPPOSITE_AXES: [WestSignType, WestSignType][] = [
  ['aries', 'libra'],
  ['taurus', 'scorpio'],
  ['gemini', 'sagittarius'],
  ['cancer', 'capricorn'],
  ['leo', 'aquarius'],
  ['virgo', 'pisces'],
];
```

---

## 4. Overlays Array Values

**Exact enum strings:**
```typescript
type ChineseOverlayPattern = 
  | 'LIU_CHONG'   // Six Conflicts (六冲) - Magnetic Opposites
  | 'LIU_HAI'     // Six Harms (六害)
  | 'XING'        // Punishment (刑)
  | 'PO';         // Break (破)
```

**Location**: `/lib/connectionUi.ts` line 4

**Usage:**
```typescript
const overlays: ChineseOverlayPattern[] = ['LIU_HAI', 'XING'];
// Array can contain 0, 1, or multiple overlay patterns
```

---

## 5. Overlay Mapping Data - Exact Animal Pairs

**Location**: `/lib/compat/engine.ts` lines 681-707

### LIU_HAI (六害) - Six Harms Pairs:
```typescript
const LIU_HAI_PAIRS: [ChineseAnimal, ChineseAnimal][] = [
  ['rat', 'goat'],
  ['ox', 'horse'],
  ['tiger', 'snake'],
  ['rabbit', 'dragon'],
  ['monkey', 'pig'], // Monkey × Pig is Liu Hai (Six Harms)
  ['rooster', 'dog'],
];
```

**Applied when**: User A and User B are in any of these pairs (order-insensitive)

**Example**: Rat × Goat = LIU_HAI overlay

---

### XING (刑) - Punishment Pairs:
```typescript
const XING_PAIRS: [ChineseAnimal, ChineseAnimal][] = [
  ['rat', 'rabbit'],
  ['tiger', 'snake'],
  ['tiger', 'monkey'],
  ['snake', 'monkey'],
  ['goat', 'ox'],
  ['goat', 'dog'],
  ['ox', 'dog'],
];
```

**Applied when**: User A and User B are in any of these pairs (order-insensitive)

**Example**: Tiger × Snake = XING overlay
**Special case**: Same Sign + XING = "Self-Punishment" pattern

---

### PO (破) - Break Pairs:
```typescript
const PO_PAIRS: [ChineseAnimal, ChineseAnimal][] = [
  // Po pairs go here if any are identified classically
  // Currently EMPTY - no Po pairs defined
];
```

**Note**: Currently empty in the codebase. PO overlay would be applied if pairs are added here.

---

### LIU_CHONG (六冲) - Six Conflicts (for reference):
```typescript
const LIU_CHONG_PAIRS: [ChineseAnimal, ChineseAnimal][] = [
  ['rat', 'horse'],
  ['ox', 'goat'],
  ['tiger', 'monkey'],
  ['rabbit', 'rooster'],
  ['dragon', 'dog'],
  ['snake', 'pig'],
];
```

**Note**: LIU_CHONG is typically a BASE pattern (not overlay), but can appear as overlay when combined with other patterns.

---

## 6. How Overlays Are Applied in Match Engine

**Location**: `/lib/compat/engine.ts` lines 732-772

**Function**: `getChinesePatternResult(a: ChineseAnimal, b: ChineseAnimal)`

```typescript
export function getChinesePatternResult(
  a: ChineseAnimal,
  b: ChineseAnimal,
): ChinesePatternResult {
  const all: ChinesePattern[] = [];

  // Check for same animal first
  if (a === b) {
    return { primary: 'same_animal', all: ['same_animal'] };
  }

  // Check SAN_HE (same trine) - highest priority
  if (areInSameTrine(a, b)) {
    all.push('san_he');
  }

  // Check LIU_HE (Six Harmonies)
  if (isPairInList(a, b, LIU_HE_PAIRS)) {
    all.push('liu_he');
  }

  // Check PO (Break)
  if (isPairInList(a, b, PO_PAIRS)) {
    all.push('po');
  }

  // Check LIU_CHONG (Six Conflicts)
  if (isPairInList(a, b, LIU_CHONG_PAIRS)) {
    all.push('liu_chong');
  }

  // Check LIU_HAI (Six Harms) - OVERLAY
  if (isPairInList(a, b, LIU_HAI_PAIRS)) {
    all.push('liu_hai');
  }

  // Check XING (Punishment) - OVERLAY
  if (isPairInList(a, b, XING_PAIRS)) {
    all.push('xing');
  }

  // Primary pattern is first in priority order
  const primary: ChinesePattern = 
    all.length > 0 ? all[0] : 'neutral';

  return { primary, all: all.length > 0 ? all : ['neutral'] };
}
```

**Helper function** (order-insensitive pair checking):
```typescript
const isPairInList = (
  a: ChineseAnimal,
  b: ChineseAnimal,
  list: [ChineseAnimal, ChineseAnimal][]
): boolean =>
  list.some(
    ([x, y]) =>
      (x === a && y === b) ||
      (x === b && y === a),
  );
```

---

## 7. Overlay Application in Score Calculation

**Location**: `/lib/compat/engine.ts` lines 1948-1967

**How overlays are extracted and applied:**
```typescript
// Map overlay patterns to ChinesePattern type for match engine
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

// Then passed to buildMatchResult
matchEngineResult = buildMatchResult({
  pattern: patternKey as any,
  westernElementRelation: westElemRelation,
  westernAspectRelation: westAspectRelation,
  wuXingRelation,
  sameWesternSign: sameWesternSign,
}, overlayPatterns); // <-- overlays passed here
```

**Location**: `/lib/matchEngine.ts` lines 401-441

**Score calculation with overlays:**
```typescript
export function calculateMatchScoreWithOverlays(
  input: MatchInput,
  overlays: ChinesePattern[]
): number {
  // Start with base score
  let score = calculateMatchScore(input);

  // Apply overlay penalties
  const damageOverlays = overlays.filter(o => 
    o === 'LIU_HAI' || o === 'XING' || o === 'PO'
  );

  if (damageOverlays.length >= 2) {
    // 2+ damage overlays: cap score
    score = Math.min(score, 84);
  } else if (damageOverlays.length === 1) {
    // 1 damage overlay: cap score
    score = Math.min(score, 86);
  }

  // Clamp to pattern band
  score = clampToPatternBand(input.pattern, score);
  
  return Math.round(score);
}
```

---

## 8. Complete Example Usage

```typescript
// Example: Rat × Goat match
const userA: ChineseAnimal = 'rat';
const userB: ChineseAnimal = 'goat';

// Step 1: Get pattern result
const result = getChinesePatternResult(userA, userB);
// result.all = ['liu_hai'] (no base pattern, just overlay)
// result.primary = 'liu_hai'

// Step 2: Extract base pattern and overlays
const chineseBase: ChineseBasePattern = 
  extractChineseBase(result.primary) || 'NO_PATTERN';
// chineseBase = 'NO_PATTERN' (since liu_hai is overlay, not base)

const overlays: ChineseOverlayPattern[] = 
  result.all
    .filter(p => p === 'liu_hai' || p === 'xing' || p === 'po' || p === 'liu_chong')
    .map(p => p.toUpperCase()) as ChineseOverlayPattern[];
// overlays = ['LIU_HAI']

// Step 3: Get Western relation
const westElemRel: WesternElementRelation = 'COMPATIBLE';
const sameWestSign: boolean = false;
const westOpposition: WesternAspectRelation = 'NEUTRAL';

// Step 4: Calculate score (with overlays)
const score = calculateMatchScoreWithOverlays({
  pattern: 'NO_PATTERN',
  westernElementRelation: 'COMPATIBLE_ELEMENT',
  westernAspectRelation: 'NEUTRAL',
  sameWesternSign: false,
}, ['LIU_HAI']);
```

---

## 9. Chinese Animal Type Values

**Exact animal string values** (lowercase):
```typescript
type ChineseAnimal =
  | 'rat'
  | 'ox'
  | 'tiger'
  | 'rabbit'
  | 'dragon'
  | 'snake'
  | 'horse'
  | 'goat'
  | 'monkey'
  | 'rooster'
  | 'dog'
  | 'pig';
```

**Location**: `/lib/compat/engine.ts` lines 62-74

---

## 10. Summary - Quick Reference

| **Category** | **Enum Values** |
|-------------|----------------|
| **chineseBase** | `'SAN_HE'`, `'LIU_HE'`, `'SAME_SIGN'`, `'NO_PATTERN'` |
| **westElemRel** | `'SAME'`, `'COMPATIBLE'`, `'SEMI_COMPATIBLE'`, `'NEUTRAL'`, `'CLASH'` |
| **sameWestSign** | `boolean` (`true` / `false`) |
| **westOpposition** | `'SOFT'`, `'NEUTRAL'`, `'HARD'`, `'OPPOSITION'` |
| **overlays** | `'LIU_CHONG'`, `'LIU_HAI'`, `'XING'`, `'PO'` (array) |

**Overlay Pairs:**
- **LIU_HAI**: rat-goat, ox-horse, tiger-snake, rabbit-dragon, monkey-pig, rooster-dog
- **XING**: rat-rabbit, tiger-snake, tiger-monkey, snake-monkey, goat-ox, goat-dog, ox-dog
- **PO**: (currently empty)

**File Locations:**
- Type definitions: `/lib/connectionUi.ts`
- Pattern detection: `/lib/compat/engine.ts` lines 732-772
- Pair mappings: `/lib/compat/engine.ts` lines 681-707
- Score calculation: `/lib/matchEngine.ts` lines 401-441
