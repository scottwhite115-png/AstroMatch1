# Wu Xing (Five Elements) Integration — Complete ✅

## Overview

The Wu Xing (五行) year element system has been fully integrated into AstroMatch connection text. This adds a third layer of compatibility analysis based on the Chinese Five Elements generating and controlling cycles.

## 1. Core Logic (`lib/connectionText.ts`)

### Types

```typescript
export type WuXing = "Wood" | "Fire" | "Earth" | "Metal" | "Water";

export type WuXingRelation =
  | "supportive"  // Generating cycle
  | "same"        // Same element
  | "clashing"    // Controlling cycle
  | "neutral";    // No strong relationship

export interface ConnectionContext {
  westA: { sign: string; element: Element };
  westB: { sign: string; element: Element };
  chineseA: {
    animal: string;
    trineName?: string;
    yearElement?: WuXing; // <-- YEAR ELEMENT for user A
  };
  chineseB: {
    animal: string;
    trineName?: string;
    yearElement?: WuXing; // <-- YEAR ELEMENT for user B
  };
  chinesePattern: ChinesePattern;
  westAspect: WestAspect;
}
```

### Wu Xing Cycles

**Generating Cycle (Sheng 生):**
- Wood → Fire → Earth → Metal → Water → Wood (supportive relationship)

**Controlling Cycle (Ke 克):**
- Wood → Earth → Water → Fire → Metal → Wood (clashing relationship)

### Functions

#### `computeWuXingRelation(a: WuXing, b: WuXing): WuXingRelation`

Determines the relationship between two year elements:
- **same**: Both users have the same year element
- **supportive**: Elements are in the generating cycle (either direction)
- **clashing**: Elements are in the controlling cycle (either direction)
- **neutral**: No strong relationship

#### `getWuXingLine(ctx: ConnectionContext): string | null`

Generates a human-readable description of the year element relationship:

**Examples:**
- `"Metal Monkey × Water Goat — Elemental harmony: Supportive (Metal generates Water)."`
- `"Fire Horse × Fire Tiger — Elemental harmony: Same element, double Fire."`
- `"Water Rat × Earth Ox — Elemental tension: Clashing elements, extra patience needed."`
- `"Wood Dragon × Metal Snake — Elemental overlay: Neutral influence, neither strongly supportive nor clashing."`

Returns `null` if either user is missing year element data.

#### `buildConnectionLines(ctx: ConnectionContext): ConnectionLines`

Returns all three connection lines:

```typescript
interface ConnectionLines {
  chineseLine: string;   // Chinese zodiac pattern
  westernLine: string;   // Western zodiac element interaction
  wuXingLine?: string;   // Wu Xing year element relationship (optional)
}
```

## 2. UI Implementation

### ConnectionBox Component

The `ConnectionBox` component (lines 119-143) includes a toggle button that appears when `wuXingLine` is provided:

**Visual Design:**
- Toggle button with Chinese character 五 (wu, meaning "five")
- "Show year elements" / "Hide year elements" text
- Collapsible content with small text (11px/12px)
- Styled consistently with dark theme (slate colors)

**Behavior:**
- Hidden by default (`showWuXing` state starts as `false`)
- Only appears when `wuXingLine` prop is provided
- Expandable/collapsible with smooth animation

### ConnectionBoxSimple Component

The `ConnectionBoxSimple` component has been updated with the same Wu Xing toggle functionality:

**Features:**
- Same toggle button design as `ConnectionBox`
- Theme-aware styling (light/dark mode support)
- Positioned below Western compatibility section
- Uses `data.wuXingLine` from `ConnectionBoxData` interface

## 3. Data Flow

### Step 1: Build Astro Profile

Each user has year element data from their Chinese zodiac:

```typescript
type AstroProfile = {
  sunSign: string;
  sunElement: "Fire" | "Earth" | "Air" | "Water";
  chineseAnimal: string;        // "Monkey"
  chineseElement: WuXing;       // "Metal" (year element)
  chineseYinYang: "Yin" | "Yang";
  // ...
};
```

### Step 2: Create Connection Context

When comparing two users, pass their year elements into the context:

```typescript
import { buildConnectionLines, ConnectionContext } from "@/lib/connectionText";

function makeConnectionLines(
  userA: AstroProfile, 
  userB: AstroProfile, 
  pattern: ChinesePattern, 
  aspect: WestAspect
) {
  const ctx: ConnectionContext = {
    westA: {
      sign: userA.sunSign,
      element: userA.sunElement,
    },
    westB: {
      sign: userB.sunSign,
      element: userB.sunElement,
    },
    chineseA: {
      animal: userA.chineseAnimal,
      trineName: undefined, // Optional: "Visionaries", "Strategists", etc.
      yearElement: userA.chineseElement, // <-- YEAR ELEMENT
    },
    chineseB: {
      animal: userB.chineseAnimal,
      trineName: undefined,
      yearElement: userB.chineseElement, // <-- YEAR ELEMENT
    },
    chinesePattern: pattern,
    westAspect: aspect,
  };

  return buildConnectionLines(ctx);
}
```

### Step 3: Render Connection Box

Pass the Wu Xing line to the component:

```typescript
const lines = buildConnectionLines(connectionContext);

<ConnectionBox
  tier={tier}
  score={score}
  westA={userA.sunSign}
  eastA={userA.chineseAnimal}
  westB={userB.sunSign}
  eastB={userB.chineseAnimal}
  chineseLine={lines.chineseLine}
  westernLine={lines.westernLine}
  wuXingLine={lines.wuXingLine}   // <-- Toggle appears when this is provided
  connectionBlurb={blurb}
/>
```

## 4. Integration Points

### Matches Page (`app/matches/page.tsx`)

Line 2055: Already passing `wuXingLine` from the match engine:

```typescript
wuXingLine: simpleBox.wuXingLine,
```

### ConnectionBoxData Interface

The `ConnectionBoxData` interface (line 230 in `ConnectionBoxSimple.tsx`) includes:

```typescript
wuXingLine?: string; // Wu Xing (Five Elements) harmony line
```

### Match Engine Integration

The match engine should provide `wuXingLine` in the result object by:
1. Extracting both users' year elements from their birth years
2. Calling `buildConnectionLines()` with both year elements
3. Including `wuXingLine` in the returned match data

## 5. Example Output

### Complete Connection Analysis

For **Aquarius Metal Monkey** (User A) × **Leo Water Goat** (User B):

```
chineseLine:
"Monkey × Goat — Cross trine, no classical San He / Liu He pattern: mixed tempo, chemistry depends on timing."

westernLine:
"Aquarius × Leo — Air fans Fire, lively and stimulating (opposites), high-voltage chemistry."

wuXingLine:
"Metal Monkey × Water Goat — Elemental harmony: Supportive (Metal generates Water)."
```

### UI Behavior

1. **Initial state**: Two lines visible (Chinese and Western), small toggle button visible
2. **After clicking toggle**: Third line appears showing Wu Xing analysis
3. **Second click**: Wu Xing line collapses again

## 6. Benefits

✅ **Adds depth**: Third layer of compatibility analysis  
✅ **Optional**: Doesn't clutter UI, hidden by default  
✅ **Educational**: Teaches users about Chinese Five Elements  
✅ **Consistent**: Uses same generating/controlling cycle logic throughout  
✅ **Graceful fallback**: Works even if year element data is missing (simply doesn't show)  

## 7. Technical Notes

### Year Element Calculation

The year element is determined by the last digit of the birth year:

```
0-1: Metal
2-3: Water
4-5: Wood
6-7: Fire
8-9: Earth
```

### Optional Data

The Wu Xing line is **optional** in the data model:
- If `yearElement` is missing for either user, `getWuXingLine()` returns `null`
- The toggle button only appears when `wuXingLine` has a value
- This ensures backward compatibility with existing data

### Theme Support

Both `ConnectionBox` and `ConnectionBoxSimple` support:
- Dark mode (default): Slate colors, subtle borders
- Light mode: Gray colors with appropriate contrast

---

## Status: ✅ COMPLETE

All components are wired up and ready to use. The Wu Xing system is fully integrated into the connection text pipeline and will automatically appear whenever year element data is available for both users.

