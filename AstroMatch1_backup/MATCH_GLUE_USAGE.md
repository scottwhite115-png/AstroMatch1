# Match Glue Usage Guide

## Quick Start

```typescript
import { buildMatchResultForProfiles, type ProfileAstroCore } from "@/lib/matchGlue";

// Your user profiles with minimal astro data
const userA = {
  astro: {
    westernSign: "Leo",
    chineseAnimal: "Rabbit",
    wuXingElement: "Wood"
  }
};

const userB = {
  astro: {
    westernSign: "Sagittarius",
    chineseAnimal: "Pig",
    wuXingElement: "Water"
  }
};

// Build the match result
const result = buildMatchResultForProfiles(userA.astro, userB.astro);
```

## UI Integration

### Photo Carousel Pill
```typescript
// On the photo overlay
<div className="match-pill">
  {result.pillLabel}  // "92% · Triple Harmony"
</div>
```

### Astrology Dropdown Header
```typescript
// In the expanded connection box
<div className="pattern-header">
  <h3>{result.patternFullLabel}</h3>  // "🌟 San He 三合 · Triple Harmony · 92%"
  <p>{result.baseTagline}</p>         // "Classic trine alliance. Long-term life harmony."
</div>
```

### Full Result Object
```typescript
{
  score: 92,                           // 0-100 match score
  pattern: "SAN_HE",                   // Chinese pattern type
  patternEmoji: "🌟",                  // Pattern emoji
  patternShortLabelEn: "Triple Harmony", // Short English label
  patternFullLabel: "🌟 San He 三合 · Triple Harmony · 92%", // Full display label
  pillLabel: "92% · Triple Harmony",   // Compact pill format
  baseTagline: "Classic trine alliance. Long-term life harmony." // Explanation
}
```

## ProfileAstroCore Interface

```typescript
interface ProfileAstroCore {
  westernSign: WesternSign;      // "Aries" | "Taurus" | ... | "Pisces"
  chineseAnimal: ChineseAnimal;  // "Rat" | "Ox" | ... | "Pig"
  wuXingElement: WuXingElement;  // "Wood" | "Fire" | "Earth" | "Metal" | "Water"
}
```

## Pattern Labels

The system returns beautiful labels for all Chinese patterns:

- **🌟 San He** (三合) - "Triple Harmony" - Score: 75-96
- **💫 Liu He** (六合) - "Secret Friends" - Score: 72-94
- **🪞 Same Animal** (同生肖) - "Same Animal Match" - Score: 68-88
- **◽ No Pattern** (无显著格局) - "No Major Pattern" - Score: 52-82
- **⚠️ Liu Chong** (六冲) - "Six Conflicts" - Score: 38-72
- **💔 Liu Hai** (六害) - "Six Harms" - Score: 35-68
- **🔥 Xing** (刑) - "Punishment Pattern" - Score: 35-66
- **💥 Po** (破) - "Break Pattern" - Score: 32-64

## Score Adjustments

The base pattern score is adjusted by:
- **Western Element Relation**: -4 to +6 points
- **Western Aspect**: -4 to +4 points
- **Wu Xing Relation**: -4 to +4 points

Final scores are clamped within each pattern's allowed band.

## Integration with Existing Systems

The glue layer automatically uses your existing systems:
- ✅ `getChinesePattern()` - Pattern detection
- ✅ `WESTERN_ELEMENT_BY_SIGN` - Element lookup
- ✅ `SIGN_ORDER` - Aspect calculation
- ✅ Wu Xing cycles - Element relations

## Example: Matches Page

```typescript
// In your matches page component
filteredProfiles.forEach(profile => {
  const result = buildMatchResultForProfiles(
    currentUser.astro,
    profile.astro
  );
  
  // Pass to connection box
  const boxData: ConnectionBoxData = {
    score: result.score,
    pillLabel: result.pillLabel,
    patternFullLabel: result.patternFullLabel,
    baseTagline: result.baseTagline,
    patternEmoji: result.patternEmoji,
    // ... other fields
  };
});
```

## Benefits

1. **One function call** - All calculations handled automatically
2. **Rich metadata** - Labels, emojis, explanations included
3. **Type safe** - Full TypeScript support
4. **Pattern-driven** - Chinese astrology takes center stage
5. **Consistent** - Uses your existing pattern/element/aspect systems

## Migration from Old Code

Before:
```typescript
// Manual calculation with multiple steps
const pattern = detectPattern(a, b);
const aspect = calculateAspect(a.sign, b.sign);
const elementRel = calculateElementRelation(a, b);
// ... more calculations
const score = computeScore(pattern, aspect, elementRel, ...);
```

After:
```typescript
// Single function call
const result = buildMatchResultForProfiles(a.astro, b.astro);
```

## Date
Created: November 24, 2025

