# Wu Xing Integration — Quick Reference

## ✅ What's Been Implemented

### 1. Core Logic (`lib/connectionText.ts`)

All Wu Xing functionality is complete:
- ✅ Types: `WuXing`, `WuXingRelation`, updated `ConnectionContext`
- ✅ Generating cycle: Wood → Fire → Earth → Metal → Water
- ✅ Controlling cycle: Wood → Earth → Water → Fire → Metal
- ✅ `computeWuXingRelation()`: Determines supportive/same/clashing/neutral
- ✅ `getWuXingLine()`: Generates human-readable descriptions
- ✅ `buildConnectionLines()`: Returns all 3 lines (Chinese, Western, Wu Xing)

### 2. UI Components

Both components now support Wu Xing:

#### ConnectionBox (`components/ConnectionBox.tsx`)
- ✅ Lines 21, 75: `wuXingLine?: string` prop
- ✅ Line 79: `showWuXing` state
- ✅ Lines 119-143: Toggle button + collapsible content
- ✅ Chinese character 五 (wu) in button
- ✅ "Show/Hide year elements" text with ▼/▲ arrows

#### ConnectionBoxSimple (`components/ConnectionBoxSimple.tsx`)
- ✅ Line 230: `wuXingLine?: string` in `ConnectionBoxData`
- ✅ Line 257: `showWuXing` state
- ✅ Lines 655-681: Wu Xing toggle in Western section
- ✅ Theme-aware styling (light/dark mode)

### 3. Data Integration

#### Matches Page (`app/matches/page.tsx`)
- ✅ Line 2055: Passing `wuXingLine: simpleBox.wuXingLine`
- ✅ Lines 2061, 2068: `chineseElement` included for both users

## 🔧 How to Use

### Basic Usage

```typescript
import { buildConnectionLines } from "@/lib/connectionText";

// 1. Get user data with year elements
const userA = {
  sunSign: "Aquarius",
  sunElement: "Air",
  chineseAnimal: "Monkey",
  yearElement: "Metal", // from birth year 1980
};

const userB = {
  sunSign: "Leo",
  sunElement: "Fire",
  chineseAnimal: "Goat",
  yearElement: "Water", // from birth year 1991
};

// 2. Build connection context
const ctx = {
  westA: { sign: userA.sunSign, element: userA.sunElement },
  westB: { sign: userB.sunSign, element: userB.sunElement },
  chineseA: {
    animal: userA.chineseAnimal,
    yearElement: userA.yearElement, // <-- KEY
  },
  chineseB: {
    animal: userB.chineseAnimal,
    yearElement: userB.yearElement, // <-- KEY
  },
  chinesePattern: "cross_trine",
  westAspect: "opposition",
};

// 3. Generate all connection lines
const lines = buildConnectionLines(ctx);

// 4. Render in UI
<ConnectionBox
  tier="Excellent"
  score={82}
  westA={userA.sunSign}
  eastA={userA.chineseAnimal}
  westB={userB.sunSign}
  eastB={userB.chineseAnimal}
  chineseLine={lines.chineseLine}
  westernLine={lines.westernLine}
  wuXingLine={lines.wuXingLine}  // <-- Toggle appears automatically
/>
```

### Year Element Calculation

```typescript
function getYearElement(birthYear: number): WuXing {
  const lastDigit = birthYear % 10;
  
  if (lastDigit === 0 || lastDigit === 1) return "Metal";
  if (lastDigit === 2 || lastDigit === 3) return "Water";
  if (lastDigit === 4 || lastDigit === 5) return "Wood";
  if (lastDigit === 6 || lastDigit === 7) return "Fire";
  if (lastDigit === 8 || lastDigit === 9) return "Earth";
  
  throw new Error(`Invalid birth year: ${birthYear}`);
}
```

## 📊 Output Examples

### Supportive (Generating Cycle)

```
"Metal Monkey × Water Goat — Elemental harmony: Supportive (Metal generates Water)."
```

### Same Element

```
"Fire Horse × Fire Tiger — Elemental harmony: Same element, double Fire."
```

### Clashing (Controlling Cycle)

```
"Water Rat × Earth Ox — Elemental tension: Clashing elements, extra patience needed."
```

### Neutral

```
"Wood Dragon × Metal Snake — Elemental overlay: Neutral influence, neither strongly supportive nor clashing."
```

## 🎨 UI Behavior

### Default State (Collapsed)
- Wu Xing line hidden
- Toggle button shows: `[五] Show year elements ▼`
- Two lines visible: Chinese pattern + Western elements

### Expanded State
- Wu Xing line visible
- Toggle button shows: `[五] Hide year elements ▲`
- Three lines visible: Chinese + Western + Wu Xing

### Missing Data
- If either user missing `yearElement`: toggle doesn't appear
- Graceful fallback: ConnectionBox works normally with 2 lines

## 🔍 Where It's Used

Currently integrated in:
- ✅ `app/matches/page.tsx` — Matches list
- ✅ `components/ConnectionBox.tsx` — Match detail view
- ✅ `components/ConnectionBoxSimple.tsx` — Simplified view

Ready to integrate in:
- 🔄 Profile view pages
- 🔄 Match detail pages
- 🔄 Astrology education pages

## 🎯 Key Benefits

1. **Three-layer analysis**: Western + Chinese zodiac + Year elements
2. **Educational**: Teaches users about Five Elements theory
3. **Non-intrusive**: Hidden by default, expandable on demand
4. **Consistent**: Same logic used throughout app
5. **Graceful**: Works even when data is missing

## 📝 Quick Checklist

To add Wu Xing to a new page:

- [ ] Ensure user data includes `yearElement` field
- [ ] Pass `yearElement` to `ConnectionContext`
- [ ] Call `buildConnectionLines(ctx)`
- [ ] Pass `wuXingLine` to ConnectionBox component
- [ ] Test with different element combinations
- [ ] Verify toggle appears and works

## 🚀 Status

**✅ COMPLETE AND PRODUCTION READY**

All code is implemented, tested, and integrated. The Wu Xing system is fully functional and will automatically appear whenever year element data is available for both users in a match.

---

## 📚 Further Reading

- `WU_XING_INTEGRATION_COMPLETE.md` — Comprehensive technical documentation
- `docs/WU_XING_EXAMPLES.md` — Visual examples and reference tables
- `lib/connectionText.ts` — Source code with inline comments

---

**Last Updated:** November 23, 2025

