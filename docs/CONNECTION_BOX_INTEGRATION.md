# Connection Box Integration Guide

## Overview

This document explains how to integrate sun sign relationship blurbs and element compatibility into connection boxes.

## Data Structure

### ConnectionBoxProps (UI Component)

```typescript
interface ConnectionBoxProps {
  tier: MatchTier;
  score: number;
  westA: string;  // "Aquarius"
  eastA: string;  // "Monkey"
  westB: string;  // "Leo"
  eastB: string;  // "Goat"
  
  chineseLine: string;      // "Monkey × Horse — No major classical pattern..."
  sunMatchBlurb: string;    // "Aquarius × Aquarius — Independent, future-minded..."
  westernLine: string;      // "Aquarius × Aquarius — Air × Air (compatible)"
  wuXingLine?: string;      // "Metal Monkey × Metal Horse — Elemental harmony..."
  
  connectionBlurb?: string;
}
```

### ConnectionBoxData (Data Layer)

```typescript
interface ConnectionBoxData {
  // ... other fields ...
  east_relation: string;        // Chinese zodiac line
  west_relation: string;        // Western element line
  westernSignLine?: string;     // Sun sign relationship blurb
  wuXingLine?: string;          // Wu Xing year elements line
}
```

## Integration Pattern

### Step 1: Build Connection Text

```typescript
import { getSunMatchBlurb, WesternSign } from "@/lib/connectionSunVibes";
import { buildConnectionLines, ConnectionContext } from "@/lib/connectionText";

function buildConnectionTextForPair(userA: AstroProfile, userB: AstroProfile) {
  const context: ConnectionContext = {
    westA: { sign: userA.sunSign, element: userA.sunElement },
    westB: { sign: userB.sunSign, element: userB.sunElement },
    chineseA: {
      animal: userA.chineseAnimal,
      trineName: userA.chineseTrineName,
      yearElement: userA.chineseElement,
    },
    chineseB: {
      animal: userB.chineseAnimal,
      trineName: userB.chineseTrineName,
      yearElement: userB.chineseElement,
    },
    chinesePattern: getChinesePatternCode(userA, userB),
    westAspect: getWestAspect(userA.sunSign, userB.sunSign),
  };

  const { chineseLine, westernLine, wuXingLine } =
    buildConnectionLines(context);

  const sunMatchBlurb = getSunMatchBlurb(
    userA.sunSign as WesternSign,
    userB.sunSign as WesternSign
  );

  return {
    chineseLine,
    sunMatchBlurb,
    westernLine,
    wuXingLine,
  };
}
```

### Step 2: Store in ConnectionBoxData

```typescript
const connectionData: ConnectionBoxData = {
  // ... other fields ...
  east_relation: chineseLine,
  west_relation: westernLine,
  westernSignLine: sunMatchBlurb,  // Sun sign blurb
  wuXingLine: wuXingLine,          // Year elements (optional)
};
```

### Step 3: Render in UI Component

```typescript
<ConnectionBoxNew
  tier={tier}
  score={score}
  westA={westA}
  eastA={eastA}
  westB={westB}
  eastB={eastB}
  chineseLine={connectionBoxData.east_relation}
  sunMatchBlurb={connectionBoxData.westernSignLine || ""}
  westernLine={connectionBoxData.west_relation}
  wuXingLine={connectionBoxData.wuXingLine}
/>
```

## UI Display Structure

```
┌─────────────────────────────────────┐
│ NEUTRAL • 59/100                    │
│ Aquarius / Monkey × Libra / Rooster │
├─────────────────────────────────────┤
│ Monkey × Rooster — No major pattern │ ← chineseLine (always visible)
│ Aquarius × Libra — Airy, idealistic│ ← sunMatchBlurb (always visible)
│                                     │
│ [☉] Show elements ▼                  │ ← Combined elements toggle
│   └─ When expanded:                 │
│      • Metal Monkey × Metal Horse   │ ← wuXingLine (if exists)
│      • Air × Air (compatible)       │ ← westernLine (always)
└─────────────────────────────────────┘
```

## Key Features

### 1. Always Visible
- **Chinese pattern line** - Zodiac animal compatibility
- **Sun sign blurb** - Personality-based relationship insight

### 2. Optional Elements Dropdown
- **Wu Xing line** - Year element harmony (if data exists)
- **Western element line** - Elemental compatibility (Air, Fire, Water, Earth)

### 3. Smart Toggle
- Only appears if `wuXingLine` OR `westernLine` exists
- Shows both element types in single dropdown
- Icon: ☉ (sun symbol)
- Text: "Show elements" / "Hide elements"

## Example Sun Sign Blurbs

```typescript
// Aries × Leo
"Aries × Leo — Dramatic, confident and warm; huge chemistry if pride doesn't take over."

// Pisces × Pisces
"Pisces × Pisces — Soft, intuitive and romantic; beautiful connection if you keep one foot on the ground."

// Gemini × Scorpio
"Gemini × Scorpio — Light banter meets deep focus; honesty and consistency are make-or-break."

// Aquarius × Libra
"Aquarius × Libra — Airy, idealistic and friendly; great for friendship that grows into more."
```

## Files Modified

1. **`lib/connectionSunVibes.ts`** - Sun sign blurb database (78 pairs)
2. **`lib/connectionText.ts`** - `buildConnectionLines()` function (existing)
3. **`components/ConnectionBoxNew.tsx`** - UI component with unified elements toggle
4. **`components/ConnectionBoxSimple.tsx`** - `ConnectionBoxData` interface
5. **`components/MatchProfileCard.tsx`** - Props mapping
6. **`app/matches/page.tsx`** - Data generation and imports

## Benefits

- ✅ **More personal** - Sign-specific insights vs generic element compatibility
- ✅ **Cleaner UI** - Single toggle for all element information
- ✅ **Consistent style** - Chinese and Western blurbs match in tone/format
- ✅ **Optional details** - Element info available but not overwhelming
- ✅ **Theme support** - Works in both light and dark modes
- ✅ **Backward compatible** - Existing data flows preserved

## Migration Notes

If you have existing connection boxes using the old structure:

### Old Props (deprecated)
```typescript
westernLine: string;      // Was always visible
westernSignLine?: string; // Old name
```

### New Props (current)
```typescript
sunMatchBlurb: string;    // Always visible (new name, replaces westernSignLine)
westernLine: string;      // Moved to elements dropdown
```

The `westernSignLine` field in `ConnectionBoxData` is kept for backward compatibility but maps to `sunMatchBlurb` in the UI component.

