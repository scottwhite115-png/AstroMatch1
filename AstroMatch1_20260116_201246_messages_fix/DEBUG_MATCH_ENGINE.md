# Match Engine Debug Guide

## Issue: Match labels not displaying correctly

The match engine uses this flow:
1. `app/matches/page.tsx` calls `computeMatchWithClassifier()`
2. `lib/classifierAdapter.ts` calls `classifyPair()` from `engine/astroMatchClassifier.ts`
3. Classifier returns a tier like `"soulmate"`, `"twin_flame"`, `"neutral"`, etc.
4. Adapter maps tier to display label like `"Soulmate Match"`, `"Twin Flame Match"`, etc.

## Expected vs. Actual for Aquarius Monkey (Feb 16, 1980)

### Test Cases:

**Profile 1 - Luna: Libra-Rat**
- Expected: SOULMATE (same trine Monkey×Rat + Air×Air)
- Classifier should detect: `sameTrine = true`, `sameElement(Air, Air) = true`
- Should return: tier = `"soulmate"`
- Display label: `"Soulmate Match"`

**Profile 2 - Zara: Gemini-Dragon**
- Expected: SOULMATE (same trine Monkey×Dragon + Air×Air)
- Classifier should detect: `sameTrine = true`, `sameElement(Air, Air) = true`
- Should return: tier = `"soulmate"`
- Display label: `"Soulmate Match"`

**Profile 5 - Olivia: Aries-Rat**
- Expected: TWIN_FLAME (same trine Monkey×Rat + Fire×Air compatible)
- Classifier should detect: `sameTrine = true`, `compatibleElement(Fire, Air) = true`
- Should return: tier = `"twin_flame"`
- Display label: `"Twin Flame Match"`

## Debugging Steps

1. **Check which labels are actually showing**:
   - Open browser console (F12)
   - Look for any console.log outputs from the classifier
   - Check what `classifierResult.rankLabel` returns

2. **Verify user profile is correct**:
   - Check localStorage for "birthInfo"
   - Should show birthdate: "1980-02-16"
   - Western sign: "Aquarius" (Air)
   - Eastern sign: "Monkey" (Visionaries trine with Rat/Dragon)

3. **Common Issues**:
   - **Sign name mismatch**: Classifier expects lowercase ("aquarius", "monkey") but might receive capitalized
   - **Trine detection failing**: TRINES array in `lib/chineseRelations.ts` might not include Monkey/Rat/Dragon correctly
   - **Element detection failing**: Aquarius might not be recognized as Air
   - **Override rules**: Check FORCE_OVERRIDES in `astroMatchClassifier.ts` - these might be interfering

4. **Quick Test**:
   - In browser console, type:
   ```javascript
   localStorage.getItem("birthInfo")
   ```
   - Should show your birthdate and calculated signs

## Next Steps

Please tell me:
1. **Which profile** is showing the wrong label? (e.g., "Luna shows Neutral instead of Soulmate")
2. **What label** is it showing?
3. **Your user profile** - can you confirm it's Aquarius Monkey?

This will help me pinpoint exactly where the classifier is failing.

