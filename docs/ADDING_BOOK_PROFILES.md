# Adding Book-Based Profiles (Legal Approach)

## Why Manual Curation?

Automated extraction from copyrighted PDFs raises legal concerns. Instead, this approach:
- ✅ Respects copyright
- ✅ Lets you add editorial judgment
- ✅ Ensures quality control
- ✅ Allows you to modernize language

## Process

### 1. Read the Book Section
Open "The New Astrology" and read the compatibility section for a sign combination (e.g., "Aries-Ox").

### 2. Take Notes
Identify:
- **Favorable pairings**: Which animals are recommended? With which Western signs?
- **Cautionary pairings**: Which are warned against?
- **Reasoning**: Why does the author suggest these pairings?

### 3. Use the Template
Edit `scripts/add-book-profile.ts` with your notes:

```typescript
const PROFILE_TEMPLATE = {
  west: "Aries" as West,  // Change this
  east: "Ox" as East,     // Change this
  
  favorable: [
    {
      target: "Snake" as East,
      westernSigns: ["Taurus", "Virgo", "Capricorn"] as West[],
      reasoning: "Your interpretation in plain English",
      deltas: { chem: +6, long: +4, comm: +2 }
    },
    // Add more...
  ],
  
  cautionary: [
    {
      target: "Goat" as East,
      westernSigns: ["Cancer", "Pisces"] as West[],
      reasoning: "Your interpretation in plain English",
      deltas: { chem: -6, long: -4, comm: -2 }
    },
    // Add more...
  ]
};
```

### 4. Generate Code
Run: `pnpm ts-node scripts/add-book-profile.ts`

This outputs formatted code to paste into `data/newAstrologyOverrides.ts`.

### 5. Add to Overrides File
Paste the output into the `bookOverrides` object in `data/newAstrologyOverrides.ts`.

### 6. Rebuild
Run: `pnpm ts-node scripts/generate-compat-json.ts` to regenerate the full compatibility JSON with your new overrides baked in.

## Delta Guidelines

### Favorable Matches
- **Strong recommendation**: `{ chem: +8, long: +6, comm: +3 }`
- **Moderate recommendation**: `{ chem: +6, long: +4, comm: +2 }`
- **Subtle boost**: `{ chem: +3, long: +2, comm: +1 }`

### Cautionary Matches
- **Strong caution**: `{ chem: -8, long: -6, comm: -3 }`
- **Moderate caution**: `{ chem: -6, long: -4, comm: -2 }`
- **Subtle caution**: `{ chem: -3, long: -2, comm: -1 }`

## Priority Order

Add profiles in this order for maximum impact:

### Phase 1: High-Traffic Signs (Start Here)
1. Aquarius-Rat ✅ (Done)
2. Leo-Dragon
3. Scorpio-Snake
4. Aries-Tiger
5. Sagittarius-Horse

### Phase 2: Popular Combinations
6. Gemini-Monkey
7. Pisces-Rabbit
8. Virgo-Rooster
9. Taurus-Ox
10. Libra-Dog

### Phase 3: Complete the Rest
- Continue until all 144 combinations are covered

## Quality Checklist

Before adding a profile, ensure:
- [ ] You've read the actual book section
- [ ] Reasoning is in your own words
- [ ] Deltas are balanced (not all +8 or all -8)
- [ ] Western filters make astrological sense
- [ ] Notes are user-friendly, not jargon-heavy

## Example: Complete Profile

```typescript
"Pisces-Rabbit": [
  { targetAnimal: "Goat", westFilter: ["Taurus","Cancer","Capricorn"], delta: { chem:+7, long:+6, comm:+3 }, note: "Gentle, artistic harmony with emotional depth." },
  { targetAnimal: "Pig", westFilter: ["Cancer","Scorpio"], delta: { chem:+6, long:+7, comm:+2 }, note: "Nurturing, trusting connection." },
  { targetAnimal: "Dog", westFilter: ["Taurus","Virgo","Capricorn"], delta: { chem:+5, long:+6, comm:+4 }, note: "Loyal, protective partnership." },
  
  { targetAnimal: "Rooster", westFilter: ["Gemini","Sagittarius"], delta: { chem:-6, long:-5, comm:-3 }, note: "Critical energy clashes with sensitive nature." },
  { targetAnimal: "Dragon", westFilter: ["Aries","Leo"], delta: { chem:-5, long:-4 }, note: "Overwhelming presence for gentle soul." },
],
```

## Maintenance

As you add more profiles:
1. Commit after every 5-10 profiles
2. Test the app to verify scores change appropriately
3. Document any patterns you notice
4. Update this guide with insights

## Legal Note

Always write your own interpretations. Direct quotes or close paraphrasing from the book should be avoided. Think of the book as inspiration, not a source to copy.

