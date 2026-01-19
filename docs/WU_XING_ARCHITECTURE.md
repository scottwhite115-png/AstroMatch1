# Wu Xing System — Visual Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INPUT DATA                             │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 │
                    ┌────────────┴────────────┐
                    │                          │
         ┌──────────▼────────┐    ┌───────────▼──────────┐
         │     USER A        │    │      USER B          │
         │                   │    │                      │
         │ Birth: 1980-02-17 │    │  Birth: 1991-07-31  │
         │ Western: Aquarius │    │  Western: Leo       │
         │ Chinese: Monkey   │    │  Chinese: Goat      │
         │ Element: Metal    │    │  Element: Water     │
         └──────────┬────────┘    └───────────┬──────────┘
                    │                          │
                    └────────────┬─────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    buildConnectionLines()                           │
│                   (lib/connectionText.ts)                           │
│                                                                     │
│  Input: ConnectionContext {                                        │
│    westA: { sign: "Aquarius", element: "Air" }                    │
│    westB: { sign: "Leo", element: "Fire" }                        │
│    chineseA: { animal: "Monkey", yearElement: "Metal" }           │
│    chineseB: { animal: "Goat", yearElement: "Water" }             │
│    chinesePattern: "cross_trine"                                   │
│    westAspect: "opposition"                                        │
│  }                                                                  │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ getChinesePatternLine()                                     │   │
│  │ → "Monkey × Goat — Cross trine..."                         │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ getWesternElementLine()                                     │   │
│  │ → "Aquarius × Leo — Air fans Fire..."                      │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ getWuXingLine()                                             │   │
│  │   ↓                                                         │   │
│  │ computeWuXingRelation("Metal", "Water")                    │   │
│  │   → Metal generates Water (supportive)                     │   │
│  │   ↓                                                         │   │
│  │ → "Metal Monkey × Water Goat — Elemental harmony..."       │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Output: ConnectionLines {                                         │
│    chineseLine: "Monkey × Goat — Cross trine..."                  │
│    westernLine: "Aquarius × Leo — Air fans Fire..."               │
│    wuXingLine: "Metal Monkey × Water Goat — Elemental harmony..." │
│  }                                                                  │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          UI RENDERING                               │
│                   (ConnectionBox Component)                         │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                  ⭐ Excellent Match                         │   │
│  │                        82/100                               │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │                                                             │   │
│  │  Aquarius / Monkey  ×  Leo / Goat                          │   │
│  │                                                             │   │
│  ├─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤   │
│  │                                                             │   │
│  │  Monkey × Goat — Cross trine, no classical San He /        │   │
│  │  Liu He pattern: mixed tempo, chemistry depends on timing. │   │
│  │                                                             │   │
│  │  Aquarius × Leo — Air fans Fire, lively and stimulating    │   │
│  │  (opposites), high-voltage chemistry.                      │   │
│  │                                                             │   │
│  │  [五] Show year elements ▼       ← TOGGLE BUTTON           │   │
│  │      ▲                                                      │   │
│  │      └─ Only appears when wuXingLine exists                │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│                         [User clicks toggle]                       │
│                                 │                                   │
│                                 ▼                                   │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                  ⭐ Excellent Match                         │   │
│  │                        82/100                               │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │                                                             │   │
│  │  Aquarius / Monkey  ×  Leo / Goat                          │   │
│  │                                                             │   │
│  ├─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤   │
│  │                                                             │   │
│  │  Monkey × Goat — Cross trine, no classical San He /        │   │
│  │  Liu He pattern: mixed tempo, chemistry depends on timing. │   │
│  │                                                             │   │
│  │  Aquarius × Leo — Air fans Fire, lively and stimulating    │   │
│  │  (opposites), high-voltage chemistry.                      │   │
│  │                                                             │   │
│  │  [五] Hide year elements ▲                                  │   │
│  │                                                             │   │
│  │  Metal Monkey × Water Goat — Elemental harmony:            │   │
│  │  Supportive (Metal generates Water).    ← WU XING LINE     │   │
│  │                                                             │   │
│  └────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Wu Xing Cycle Diagrams

### Generating Cycle (Sheng 生) — Supportive

```
            WOOD 木
              │
              │ feeds
              ▼
            FIRE 火
              │
              │ creates (ash)
              ▼
           EARTH 土
              │
              │ produces (minerals)
              ▼
           METAL 金
              │
              │ collects (condensation)
              ▼
           WATER 水
              │
              │ nourishes
              └─────────────► WOOD 木
```

### Controlling Cycle (Ke 克) — Clashing

```
            WOOD 木
              │
              │ parts (roots break)
              ▼
           EARTH 土
              │
              │ absorbs (dams)
              ▼
           WATER 水
              │
              │ extinguishes
              ▼
            FIRE 火
              │
              │ melts
              ▼
           METAL 金
              │
              │ cuts
              └─────────────► WOOD 木
```

## Decision Tree

```
getWuXingLine(ctx)
      │
      ├─ No yearElement for A or B? ──► return null (no toggle)
      │
      └─ Both have yearElement
            │
            ├─ Same element? ──► "Same element, double {element}"
            │
            ├─ Generating cycle?
            │     │
            │     ├─ A generates B? ──► "Supportive ({A} generates {B})"
            │     └─ B generates A? ──► "Supportive ({B} generates {A})"
            │
            ├─ Controlling cycle? ──► "Clashing elements, extra patience"
            │
            └─ Otherwise ──► "Neutral influence"
```

## Component State Flow

```
ConnectionBox
      │
      ├─ wuXingLine prop exists?
      │     │
      │     YES ──► Show toggle button
      │     │        │
      │     │        ├─ showWuXing = false (default)
      │     │        │     └─► Button: "Show year elements ▼"
      │     │        │
      │     │        └─ showWuXing = true (after click)
      │     │              ├─► Button: "Hide year elements ▲"
      │     │              └─► Display wuXingLine text
      │     │
      │     NO ──► No toggle button, normal display
      │
      └─ Always show chineseLine + westernLine
```

## Data Flow Summary

```
Birth Year
    │
    └─► getYearElement() ──► WuXing element
                                  │
                                  │
User A yearElement ─────┐         │
                         │         │
User B yearElement ─────┼─────────┘
                         │
                         ▼
              ConnectionContext
                         │
                         ▼
          buildConnectionLines()
                         │
                         ├─► chineseLine
                         ├─► westernLine
                         └─► wuXingLine (optional)
                                  │
                                  ▼
                          ConnectionBox
                                  │
                                  └─► Toggle UI
```

## Integration Checklist

```
✅ Core Logic
   ├─ ✅ Types defined (WuXing, WuXingRelation)
   ├─ ✅ Cycles defined (generating, controlling)
   ├─ ✅ computeWuXingRelation() implemented
   ├─ ✅ getWuXingLine() implemented
   └─ ✅ buildConnectionLines() returns wuXingLine

✅ UI Components
   ├─ ✅ ConnectionBox has toggle (lines 119-143)
   ├─ ✅ ConnectionBoxSimple has toggle (updated)
   ├─ ✅ Theme support (light/dark)
   └─ ✅ Graceful fallback when data missing

✅ Data Integration
   ├─ ✅ ConnectionBoxData includes wuXingLine field
   ├─ ✅ Matches page passes wuXingLine
   └─ ✅ Year elements included in user data

✅ Documentation
   ├─ ✅ WU_XING_INTEGRATION_COMPLETE.md
   ├─ ✅ WU_XING_EXAMPLES.md
   ├─ ✅ WU_XING_QUICK_REFERENCE.md
   └─ ✅ WU_XING_ARCHITECTURE.md (this file)
```

## File Structure

```
/lib
  └─ connectionText.ts ................. Core Wu Xing logic

/components
  ├─ ConnectionBox.tsx ................. Primary UI with toggle
  └─ ConnectionBoxSimple.tsx ........... Alternative UI with toggle

/app
  └─ matches/page.tsx .................. Integration example

/docs
  ├─ WU_XING_INTEGRATION_COMPLETE.md ... Technical docs
  ├─ WU_XING_EXAMPLES.md ............... Visual examples
  ├─ WU_XING_QUICK_REFERENCE.md ........ Quick start guide
  └─ WU_XING_ARCHITECTURE.md ........... This file
```

---

**Status:** ✅ Complete — All systems operational
**Version:** 1.0.0
**Last Updated:** November 23, 2025

