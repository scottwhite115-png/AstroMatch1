// /data/newAstrologyOverrides.ts
// Book-based astrology overrides for specific Western-Eastern sign combinations
// These add nuanced adjustments based on traditional astrology texts

export type West =
  | "Aries" | "Taurus" | "Gemini" | "Cancer" | "Leo" | "Virgo"
  | "Libra" | "Scorpio" | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces";

export type East =
  | "Rat" | "Ox" | "Tiger" | "Rabbit" | "Dragon" | "Snake"
  | "Horse" | "Goat" | "Monkey" | "Rooster" | "Dog" | "Pig";

type WestFilter = West[] | "any";

export interface BookOverride {
  targetAnimal: East;                                  // animal to favor/avoid
  westFilter?: WestFilter;                             // optional western filter
  delta: { chem?: number; long?: number; comm?: number }; // small, realistic nudges
  note?: string;                                       // optional blurb seed
}

export type BookOverridesMap = Record<`${West}-${East}`, BookOverride[]>;

// ---- STARTER OVERRIDES (extracted from your PDF's compatibilities) ----
// Aquarius/Rat compatibilities: favour Ox/Dragon (Gemini/Libra/Sag), Monkey (Aries/Libra/Sag),
// and be cautious about Horse (Taurus/Leo/Scorpio), Rabbit with Leo, Rooster with Scorpio.
export const bookOverrides: BookOverridesMap = {
  "Aquarius-Rat": [
    { targetAnimal: "Ox",     westFilter: ["Gemini","Libra","Sagittarius"], delta: { chem:+6, long:+4, comm:+2 }, note: "Steady, admiring partner." },
    { targetAnimal: "Dragon", westFilter: ["Gemini","Libra","Sagittarius"], delta: { chem:+6, long:+4, comm:+2 }, note: "Dynamic ally; inspiring plans." },
    { targetAnimal: "Monkey", westFilter: ["Aries","Libra","Sagittarius"],  delta: { chem:+6, long:+4, comm:+2 }, note: "Witty, loyal, joyful match." },

    { targetAnimal: "Horse",  westFilter: ["Taurus","Leo","Scorpio"],       delta: { chem:-6, long:-4, comm:-2 }, note: "Exciting but unstable pacing." },
    { targetAnimal: "Rabbit", westFilter: ["Leo"],                           delta: { chem:-6, long:-4 },          note: "Style clash; tender vs. showy." },
    { targetAnimal: "Rooster",westFilter: ["Scorpio"],                       delta: { chem:-6, long:-4, comm:-2 }, note: "Critique vs independence friction." },
  ],

  // Add more profiles here as we expand from the snippets file.
};

/**
 * Apply book overrides to a compatibility score
 * @param myWest - User's Western sign
 * @param myEast - User's Eastern sign
 * @param theirWest - Partner's Western sign
 * @param theirEast - Partner's Eastern sign
 * @returns Delta adjustments and optional note
 */
export function getBookOverride(
  myWest: West,
  myEast: East,
  theirWest: West,
  theirEast: East
): { delta: { chem?: number; long?: number; comm?: number }; note?: string } | null {
  const key = `${myWest}-${myEast}` as keyof BookOverridesMap;
  const overrides = bookOverrides[key];
  
  if (!overrides) return null;
  
  for (const override of overrides) {
    // Check if this override applies to the target animal
    if (override.targetAnimal !== theirEast) continue;
    
    // Check if western filter matches (if specified)
    if (override.westFilter && override.westFilter !== "any") {
      if (!override.westFilter.includes(theirWest)) continue;
    }
    
    // Found a matching override!
    return {
      delta: override.delta,
      note: override.note
    };
  }
  
  return null;
}

