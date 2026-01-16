# Book Overrides System

## Overview
The book overrides system adds an additional layer of astrological nuance based on traditional astrology texts. It applies specific adjustments for certain Western-Eastern sign combinations when paired with other signs.

## Architecture

### Files Created
1. **`/data/newAstrologyOverrides.ts`** - Data structure and rules
2. **`/lib/applyBookOverrides.ts`** - Application logic
3. **Integration in `/lib/buildCompatSummary.ts`** - Applied after Chinese nuance adjustments

## How It Works

### Example: Aquarius-Rat
Based on the book text, Aquarius-Rat has specific preferences:

**Favorable matches:**
- Ox (if Gemini, Libra, or Sagittarius): +6 chemistry, +4 long-term, +2 communication
- Dragon (if Gemini, Libra, or Sagittarius): +6 chemistry, +4 long-term, +2 communication
- Monkey (if Aries, Libra, or Sagittarius): +6 chemistry, +4 long-term, +2 communication

**Unfavorable matches:**
- Horse (if Taurus, Leo, or Scorpio): -6 chemistry, -4 long-term, -2 communication
- Rabbit/Cat (if Leo): -6 chemistry, -4 long-term
- Rooster (if Scorpio): -6 chemistry, -4 long-term, -2 communication

### Application Order
1. Base compatibility scores calculated (Western + Eastern)
2. Chinese nuance matrix applied (67 pair combinations)
3. **Book overrides applied** (specific sign combination rules)
4. Final clamping (55-96 range)

### Symmetry
The system checks BOTH directions:
- Does Person A have rules about Person B?
- Does Person B have rules about Person A?

This ensures that if Aquarius-Rat likes Gemini-Ox, AND Gemini-Ox has reciprocal preferences, both adjustments apply.

## Adding New Overrides

To add more sign combinations from the book:

```typescript
export const bookOverrides: BookOverridesMap = {
  // ... existing entries
  
  "Pisces-Dragon": [
    { 
      targetAnimal: "Snake", 
      westFilter: ["Taurus", "Virgo", "Capricorn"], 
      delta: { chem: +5, long: +6 }, 
      note: "Grounded wisdom meets mystical power." 
    },
    // ... more rules
  ],
};
```

## Testing

### Check if overrides apply:
```typescript
// In browser console or test file:
import { getBookOverride } from '@/data/newAstrologyOverrides';

const result = getBookOverride('Aquarius', 'Rat', 'Gemini', 'Ox');
// Should return: { delta: { chem: 6, long: 4, comm: 2 }, note: "Steady, admiring partner." }
```

### Verify in matches page:
- User: Aquarius-Rat
- Profile 1: Gemini-Ox → Should see boosted scores
- Profile 2: Leo-Horse → Should see reduced scores (if Leo-Horse)
- Profile 3: Scorpio-Horse → Should see reduced scores

## Delta Ranges

### Chemistry (chem)
- High boost: +6 to +8 (exceptional affinity)
- Moderate boost: +3 to +5
- Moderate penalty: -3 to -5
- High penalty: -6 to -8 (strong aversion)

### Long-term (long)
- High boost: +6 to +8 (stable, lasting)
- Moderate boost: +3 to +5
- Moderate penalty: -3 to -5
- High penalty: -6 to -8 (unstable)

### Communication (comm)
- Boost: +2 to +4 (easy dialogue)
- Penalty: -2 to -4 (friction in expression)

## Performance

- Lookup: O(n) where n = number of rules per profile (typically 5-10)
- Memory: Minimal - rules stored as static object
- No API calls or database queries required
- Applies in milliseconds during score calculation

## Future Enhancements

1. **More profiles**: Extract all 144 combinations from the book
2. **Gender-specific rules**: Add conditional logic based on gender
3. **Intensity levels**: Some book recommendations are stronger than others
4. **Blurb integration**: Use the `note` field to generate custom compatibility bullets
5. **Visual indicators**: Show when book overrides significantly change a score

