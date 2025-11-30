# Wu Xing Score Integration Guide

## Current State Analysis

Your `evaluateMatch()` function in `engine/astromatch-engine.ts` currently:
1. Calculates a single `baseScore` based on pattern conditions
2. Doesn't separate Chinese vs Western scoring
3. Uses complex conditional logic for different combinations

## Integration Option 1: Quick Add Wu Xing Bonus (Minimal Changes)

Add Wu Xing adjustment to existing score:

```typescript
// At the top of astromatch-engine.ts
import { 
  getWuXingScoreBonus, 
  type WuXing, 
  type ChinesePattern 
} from "@/lib/connectionText";

// Update interface to accept year elements
export function evaluateMatch(
  westA: West,
  eastA: East,
  westB: West,
  eastB: East,
  yearElementA?: WuXing,  // <-- NEW
  yearElementB?: WuXing   // <-- NEW
): MatchResult {
  const asp = westAspect(westA,westB);
  const elemRel = elementRelation(westA,westB);
  const sameWest = asp === "same";
  const oppWest = asp === "opposite";
  const sameEast = eastA === eastB;

  const cRel =
    sameEast ? "same-animal" :
    sameTrine(eastA,eastB) ? "same-trine" :
    supportive(eastA,eastB) ? "supportive" :
    oppositeEast(eastA,eastB) ? "opposite" :
    damageEast(eastA,eastB) ? "damage" : "none";

  const badges: Badge[] = [];

  // Your existing baseScore logic
  let baseScore = 50;
  // ... all your existing conditions ...

  // Add tiny hash for variation
  let score = baseScore + tinyHash(`${westA}${eastA}`,`${westB}${eastB}`);

  // ⭐ NEW: Apply Wu Xing adjustment
  const wuXingBonus = getWuXingScoreBonus(
    cRel as ChinesePattern,  // may need mapping
    yearElementA,
    yearElementB
  );
  score += wuXingBonus;

  // Clamp
  score = Math.max(0, Math.min(100, score));

  // Rest of your tier assignment logic...
  let tier: Tier;
  if(score >= 95) tier = "Soulmate";
  else if(score >= 85) tier = "Twin Flame";
  // ... etc ...

  return {
    tier,
    color: TIER_COLORS[tier],
    score,
    badges,
    western: { aspect:asp, elements:{ a:WEST_ELEMENTS[westA], b:WEST_ELEMENTS[westB], relation:elemRel }},
    chinese: { relation:cRel as MatchResult["chinese"]["relation"] }
  };
}
```

### Issue: cRel Mapping

Your `cRel` values don't match `ChinesePattern` types exactly. You'll need a mapper:

```typescript
function mapCRelToPattern(cRel: string): ChinesePattern {
  switch(cRel) {
    case "same-animal": return "same_animal";
    case "same-trine": return "same_trine";
    case "opposite": return "liu_chong";  // opposition
    case "damage": return "liu_hai";       // harm/damage
    case "supportive": return "liu_he";    // secret friend or san_he
    default: return "none";
  }
}
```

Then use it:
```typescript
const pattern = mapCRelToPattern(cRel);
const wuXingBonus = getWuXingScoreBonus(pattern, yearElementA, yearElementB);
```

---

## Integration Option 2: Refactor for 70/30 Split (Recommended)

Break down your scoring into separate Chinese and Western components:

```typescript
import { 
  computeFinalMatchScore, 
  type MatchScoreInput,
  type WuXing 
} from "@/lib/connectionText";

export function evaluateMatch(
  westA: West,
  eastA: East,
  westB: West,
  eastB: East,
  yearElementA?: WuXing,
  yearElementB?: WuXing
): MatchResult {
  const asp = westAspect(westA, westB);
  const elemRel = elementRelation(westA, westB);
  const sameWest = asp === "same";
  const oppWest = asp === "opposite";
  const sameEast = eastA === eastB;

  const cRel =
    sameEast ? "same-animal" :
    sameTrine(eastA, eastB) ? "same-trine" :
    supportive(eastA, eastB) ? "supportive" :
    oppositeEast(eastA, eastB) ? "opposite" :
    damageEast(eastA, eastB) ? "damage" : "none";

  const badges: Badge[] = [];

  // Calculate separate Chinese and Western base scores
  const baseChineseScore = calculateChineseScore(cRel, sameEast);
  const baseWesternScore = calculateWesternScore(asp, elemRel, sameWest, oppWest);

  // Map to ChinesePattern
  const pattern = mapCRelToPattern(cRel);

  // Use Wu Xing scoring system
  const finalScore = computeFinalMatchScore({
    baseChineseScore,
    baseWesternScore,
    chinesePattern: pattern,
    yearElementA,
    yearElementB,
  });

  // Determine tier based on final score
  let tier: Tier;
  if (finalScore >= 95) tier = "Soulmate";
  else if (finalScore >= 85) tier = "Twin Flame";
  else if (finalScore >= 75) tier = "Excellent";
  else if (finalScore >= 60) tier = "Favourable";
  else if (finalScore >= 50) tier = "Neutral";
  else if (finalScore >= 35) tier = "Magnetic Opposites";
  else tier = "Difficult";

  // Add badges
  if ((oppWest || cRel === "opposite") && tier !== "Magnetic Opposites") {
    badges.push("Magnetic Opposites");
  }
  if (tier === "Difficult" && cRel === "opposite") {
    badges.push("Opposites Attract — not recommended");
  }

  return {
    tier,
    color: TIER_COLORS[tier],
    score: finalScore,
    badges,
    western: { aspect: asp, elements: { a: WEST_ELEMENTS[westA], b: WEST_ELEMENTS[westB], relation: elemRel } },
    chinese: { relation: cRel as MatchResult["chinese"]["relation"] }
  };
}

// Helper: Calculate Chinese compatibility score
function calculateChineseScore(cRel: string, sameEast: boolean): number {
  if (cRel === "same-animal") return sameEast ? 70 : 65;
  if (cRel === "same-trine") return 90;  // San He level
  if (cRel === "supportive") return 85;  // Liu He level
  if (cRel === "opposite") return 45;    // Liu Chong
  if (cRel === "damage") return 30;      // Liu Hai
  return 55; // Neutral
}

// Helper: Calculate Western compatibility score
function calculateWesternScore(
  asp: string, 
  elemRel: string, 
  sameWest: boolean, 
  oppWest: boolean
): number {
  let score = 60; // Base neutral

  // Aspect adjustments
  if (asp === "same") score += 15;
  else if (asp === "trine") score += 20;
  else if (asp === "sextile") score += 15;
  else if (asp === "opposite") score += 10; // High voltage
  else if (asp === "square") score -= 10;
  else if (asp === "quincunx") score -= 5;
  else if (asp === "semi-sextile") score += 5;

  // Element adjustments
  if (elemRel === "same") score += 15;
  else if (elemRel === "compatible") score += 10;
  else if (elemRel === "incompatible") score -= 5;

  return Math.max(40, Math.min(95, score));
}

// Helper: Map cRel to ChinesePattern
function mapCRelToPattern(cRel: string): ChinesePattern {
  switch(cRel) {
    case "same-animal": return "same_animal";
    case "same-trine": return "san_he";      // San He alliance
    case "supportive": return "liu_he";       // Secret friend
    case "opposite": return "liu_chong";      // Opposition/clash
    case "damage": return "liu_hai";          // Harm/damage
    default: return "none";
  }
}
```

---

## Integration Option 3: Where You're Actually Calling It

Based on your example code, here's where you'd integrate in your match calculation:

```typescript
// In your match calculation logic (likely in matches/page.tsx or similar)

import { 
  computeFinalMatchScore,
  buildConnectionLines,
  type MatchScoreInput,
  type ConnectionContext 
} from "@/lib/connectionText";

// When generating a match
function calculateMatch(userA, userB) {
  // Get your existing scores
  const baseChineseScore = getChinesePatternScore(userA, userB); // your existing function
  const baseWesternScore = getWesternCompatibilityScore(userA, userB); // your existing function
  const chinesePattern = getChinesePatternCode(userA, userB); // "san_he", "liu_chong", etc.

  // ⭐ Calculate final score with Wu Xing
  const finalScore = computeFinalMatchScore({
    baseChineseScore,
    baseWesternScore,
    chinesePattern,
    yearElementA: userA.chineseElement, // e.g. "Metal"
    yearElementB: userB.chineseElement, // e.g. "Water"
  });

  // Generate connection text
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
    westAspect: getWesternAspect(userA.sunSign, userB.sunSign),
  };

  const lines = buildConnectionLines(ctx);

  return {
    score: finalScore,
    ...lines,
    // ... other match data
  };
}
```

---

## Recommendation

**I recommend Option 1 (Quick Add)** for immediate integration:

1. **Less disruptive** — Minimal changes to existing logic
2. **Quick to implement** — Just add Wu Xing bonus to current score
3. **Easy to test** — Keep existing behavior, just adds ±6 adjustment
4. **Backward compatible** — Works with missing year element data

**Then migrate to Option 2** when you have time to refactor for cleaner separation of concerns.

---

## Testing Checklist

After integration:

- [ ] Test with year elements present (should apply ±6 adjustment)
- [ ] Test with year elements missing (should return 0, no change)
- [ ] Verify San He + supportive elements gets +6
- [ ] Verify San He + clashing elements gets -6
- [ ] Verify Liu Chong + clashing elements gets -2 (not -6)
- [ ] Check tier boundaries don't break (scores near 90, 80, 70, etc.)
- [ ] Verify ConnectionBox toggle appears when wuXingLine exists
- [ ] Test with real user data from database

---

## Year Element Extraction

You'll need to extract year elements from birth years:

```typescript
import type { WuXing } from "@/lib/connectionText";

export function getYearElement(birthYear: number): WuXing {
  const lastDigit = birthYear % 10;
  
  if (lastDigit === 0 || lastDigit === 1) return "Metal";
  if (lastDigit === 2 || lastDigit === 3) return "Water";
  if (lastDigit === 4 || lastDigit === 5) return "Wood";
  if (lastDigit === 6 || lastDigit === 7) return "Fire";
  if (lastDigit === 8 || lastDigit === 9) return "Earth";
  
  throw new Error(`Invalid birth year: ${birthYear}`);
}

// Usage
const user = {
  birthYear: 1980,
  // ...other fields
  chineseElement: getYearElement(1980), // "Metal"
};
```

---

## Summary

**Your example code is correct!** Just make sure:
1. ✅ `baseChineseScore` is 0-100
2. ✅ `baseWesternScore` is 0-100
3. ✅ `chinesePattern` matches `ChinesePattern` type
4. ✅ `yearElementA` and `yearElementB` are optional `WuXing` types
5. ✅ Extract year elements from birth years using last digit

The function will:
- Blend 70% Chinese + 30% Western
- Add Wu Xing adjustment (-6 to +6)
- Clamp to [0, 100]
- Return final integer score

Perfect for integration! 🎉

