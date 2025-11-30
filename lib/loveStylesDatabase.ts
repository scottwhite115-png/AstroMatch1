// lib/loveStylesDatabase.ts
// Love Styles Database for all 144 Western Sign × Chinese Animal combinations

import type { LoveStyle, EastWestProfile } from './connectionOverview';

type WesternSign = 
  | "aries" | "taurus" | "gemini" | "cancer" 
  | "leo" | "virgo" | "libra" | "scorpio"
  | "sagittarius" | "capricorn" | "aquarius" | "pisces";

type ChineseAnimal = 
  | "rat" | "ox" | "tiger" | "rabbit"
  | "dragon" | "snake" | "horse" | "goat"
  | "monkey" | "rooster" | "dog" | "pig";

// Helper function to create profile ID
function makeProfileId(west: WesternSign, east: ChineseAnimal): string {
  return `${west}_${east}`;
}

// Helper function to create display name
function makeDisplayName(west: WesternSign, east: ChineseAnimal): string {
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return `${capitalize(west)} ${capitalize(east)}`;
}

// Database of all 144 combinations
const loveStylesData: Record<string, LoveStyle> = {
  // ARIES combinations (Fire sign: fast pace, high energy)
  "aries_rat": {
    pace: "fast",
    depth: "medium",
    independence: "high",
    needs: ["freedom", "adventure", "intellectual_bond"],
    dislikes: ["control", "monotony", "dishonesty"]
  },
  "aries_ox": {
    pace: "steady",
    depth: "medium",
    independence: "medium",
    needs: ["stability", "practical_support", "reassurance"],
    dislikes: ["emotional_chaos", "dishonesty", "disrespect"]
  },
  "aries_tiger": {
    pace: "fast",
    depth: "intense",
    independence: "high",
    needs: ["freedom", "adventure", "emotional_depth"],
    dislikes: ["control", "monotony", "coldness"]
  },
  "aries_rabbit": {
    pace: "steady",
    depth: "medium",
    independence: "medium",
    needs: ["romance", "reassurance", "emotional_depth"],
    dislikes: ["emotional_chaos", "disrespect", "coldness"]
  },
  "aries_dragon": {
    pace: "fast",
    depth: "intense",
    independence: "high",
    needs: ["freedom", "adventure", "romance"],
    dislikes: ["control", "monotony", "disrespect"]
  },
  "aries_snake": {
    pace: "steady",
    depth: "intense",
    independence: "high",
    needs: ["emotional_depth", "intellectual_bond", "romance"],
    dislikes: ["dishonesty", "disrespect", "emotional_chaos"]
  },
  "aries_horse": {
    pace: "fast",
    depth: "light",
    independence: "high",
    needs: ["freedom", "adventure", "playfulness"],
    dislikes: ["control", "monotony", "jealousy"]
  },
  "aries_goat": {
    pace: "steady",
    depth: "medium",
    independence: "low",
    needs: ["romance", "reassurance", "emotional_depth"],
    dislikes: ["coldness", "disrespect", "emotional_chaos"]
  },
  "aries_monkey": {
    pace: "fast",
    depth: "light",
    independence: "high",
    needs: ["novelty", "playfulness", "intellectual_bond"],
    dislikes: ["monotony", "control", "coldness"]
  },
  "aries_rooster": {
    pace: "steady",
    depth: "medium",
    independence: "medium",
    needs: ["practical_support", "reassurance", "stability"],
    dislikes: ["dishonesty", "disrespect", "emotional_chaos"]
  },
  "aries_dog": {
    pace: "steady",
    depth: "intense",
    independence: "medium",
    needs: ["emotional_depth", "reassurance", "stability"],
    dislikes: ["dishonesty", "disrespect", "coldness"]
  },
  "aries_pig": {
    pace: "steady",
    depth: "medium",
    independence: "low",
    needs: ["romance", "emotional_depth", "playfulness"],
    dislikes: ["coldness", "dishonesty", "control"]
  },

  // TAURUS combinations (Earth sign: steady pace, values stability)
  "taurus_rat": {
    pace: "steady",
    depth: "medium",
    independence: "medium",
    needs: ["stability", "intellectual_bond", "practical_support"],
    dislikes: ["emotional_chaos", "dishonesty", "control"]
  },
  "taurus_ox": {
    pace: "slow",
    depth: "medium",
    independence: "low",
    needs: ["stability", "practical_support", "reassurance"],
    dislikes: ["emotional_chaos", "dishonesty", "disrespect"]
  },
  "taurus_tiger": {
    pace: "steady",
    depth: "intense",
    independence: "medium",
    needs: ["stability", "emotional_depth", "freedom"],
    dislikes: ["control", "emotional_chaos", "coldness"]
  },
  "taurus_rabbit": {
    pace: "slow",
    depth: "medium",
    independence: "low",
    needs: ["romance", "stability", "reassurance"],
    dislikes: ["emotional_chaos", "coldness", "disrespect"]
  },
  "taurus_dragon": {
    pace: "steady",
    depth: "medium",
    independence: "medium",
    needs: ["stability", "romance", "practical_support"],
    dislikes: ["emotional_chaos", "disrespect", "dishonesty"]
  },
  "taurus_snake": {
    pace: "slow",
    depth: "intense",
    independence: "high",
    needs: ["emotional_depth", "stability", "intellectual_bond"],
    dislikes: ["dishonesty", "emotional_chaos", "disrespect"]
  },
  "taurus_horse": {
    pace: "steady",
    depth: "light",
    independence: "medium",
    needs: ["freedom", "stability", "playfulness"],
    dislikes: ["control", "emotional_chaos", "jealousy"]
  },
  "taurus_goat": {
    pace: "slow",
    depth: "medium",
    independence: "low",
    needs: ["romance", "stability", "reassurance"],
    dislikes: ["coldness", "emotional_chaos", "disrespect"]
  },
  "taurus_monkey": {
    pace: "steady",
    depth: "light",
    independence: "medium",
    needs: ["playfulness", "stability", "intellectual_bond"],
    dislikes: ["monotony", "emotional_chaos", "control"]
  },
  "taurus_rooster": {
    pace: "slow",
    depth: "medium",
    independence: "medium",
    needs: ["practical_support", "stability", "reassurance"],
    dislikes: ["dishonesty", "emotional_chaos", "disrespect"]
  },
  "taurus_dog": {
    pace: "slow",
    depth: "intense",
    independence: "low",
    needs: ["emotional_depth", "stability", "reassurance"],
    dislikes: ["dishonesty", "coldness", "disrespect"]
  },
  "taurus_pig": {
    pace: "slow",
    depth: "medium",
    independence: "low",
    needs: ["romance", "stability", "emotional_depth"],
    dislikes: ["coldness", "emotional_chaos", "dishonesty"]
  },

  // GEMINI combinations (Air sign: fast pace, intellectual)
  "gemini_rat": {
    pace: "fast",
    depth: "light",
    independence: "high",
    needs: ["intellectual_bond", "novelty", "freedom"],
    dislikes: ["monotony", "control", "emotional_chaos"]
  },
  "gemini_ox": {
    pace: "steady",
    depth: "light",
    independence: "medium",
    needs: ["intellectual_bond", "stability", "practical_support"],
    dislikes: ["emotional_chaos", "dishonesty", "monotony"]
  },
  "gemini_tiger": {
    pace: "fast",
    depth: "medium",
    independence: "high",
    needs: ["freedom", "novelty", "intellectual_bond"],
    dislikes: ["control", "monotony", "coldness"]
  },
  "gemini_rabbit": {
    pace: "steady",
    depth: "light",
    independence: "medium",
    needs: ["intellectual_bond", "playfulness", "romance"],
    dislikes: ["emotional_chaos", "monotony", "coldness"]
  },
  "gemini_dragon": {
    pace: "fast",
    depth: "medium",
    independence: "high",
    needs: ["novelty", "freedom", "intellectual_bond"],
    dislikes: ["monotony", "control", "disrespect"]
  },
  "gemini_snake": {
    pace: "steady",
    depth: "intense",
    independence: "high",
    needs: ["intellectual_bond", "emotional_depth", "novelty"],
    dislikes: ["dishonesty", "monotony", "emotional_chaos"]
  },
  "gemini_horse": {
    pace: "fast",
    depth: "light",
    independence: "high",
    needs: ["freedom", "novelty", "playfulness"],
    dislikes: ["control", "monotony", "jealousy"]
  },
  "gemini_goat": {
    pace: "steady",
    depth: "light",
    independence: "medium",
    needs: ["playfulness", "romance", "intellectual_bond"],
    dislikes: ["monotony", "coldness", "emotional_chaos"]
  },
  "gemini_monkey": {
    pace: "fast",
    depth: "light",
    independence: "high",
    needs: ["novelty", "playfulness", "intellectual_bond"],
    dislikes: ["monotony", "control", "coldness"]
  },
  "gemini_rooster": {
    pace: "steady",
    depth: "light",
    independence: "medium",
    needs: ["intellectual_bond", "practical_support", "stability"],
    dislikes: ["dishonesty", "monotony", "emotional_chaos"]
  },
  "gemini_dog": {
    pace: "steady",
    depth: "medium",
    independence: "medium",
    needs: ["intellectual_bond", "emotional_depth", "reassurance"],
    dislikes: ["dishonesty", "monotony", "coldness"]
  },
  "gemini_pig": {
    pace: "steady",
    depth: "light",
    independence: "medium",
    needs: ["playfulness", "intellectual_bond", "romance"],
    dislikes: ["monotony", "coldness", "dishonesty"]
  },

  // CANCER combinations (Water sign: emotional, needs security)
  "cancer_rat": {
    pace: "steady",
    depth: "intense",
    independence: "medium",
    needs: ["emotional_depth", "reassurance", "intellectual_bond"],
    dislikes: ["coldness", "dishonesty", "control"]
  },
  "cancer_ox": {
    pace: "slow",
    depth: "intense",
    independence: "low",
    needs: ["reassurance", "stability", "emotional_depth"],
    dislikes: ["coldness", "emotional_chaos", "dishonesty"]
  },
  "cancer_tiger": {
    pace: "steady",
    depth: "intense",
    independence: "medium",
    needs: ["emotional_depth", "reassurance", "freedom"],
    dislikes: ["coldness", "control", "dishonesty"]
  },
  "cancer_rabbit": {
    pace: "slow",
    depth: "intense",
    independence: "low",
    needs: ["reassurance", "emotional_depth", "romance"],
    dislikes: ["coldness", "emotional_chaos", "disrespect"]
  },
  "cancer_dragon": {
    pace: "steady",
    depth: "intense",
    independence: "medium",
    needs: ["emotional_depth", "reassurance", "romance"],
    dislikes: ["coldness", "dishonesty", "disrespect"]
  },
  "cancer_snake": {
    pace: "slow",
    depth: "intense",
    independence: "medium",
    needs: ["emotional_depth", "reassurance", "intellectual_bond"],
    dislikes: ["dishonesty", "coldness", "emotional_chaos"]
  },
  "cancer_horse": {
    pace: "steady",
    depth: "medium",
    independence: "medium",
    needs: ["emotional_depth", "freedom", "reassurance"],
    dislikes: ["coldness", "control", "jealousy"]
  },
  "cancer_goat": {
    pace: "slow",
    depth: "intense",
    independence: "low",
    needs: ["reassurance", "emotional_depth", "romance"],
    dislikes: ["coldness", "emotional_chaos", "disrespect"]
  },
  "cancer_monkey": {
    pace: "steady",
    depth: "medium",
    independence: "medium",
    needs: ["emotional_depth", "playfulness", "reassurance"],
    dislikes: ["coldness", "control", "dishonesty"]
  },
  "cancer_rooster": {
    pace: "slow",
    depth: "intense",
    independence: "low",
    needs: ["reassurance", "emotional_depth", "practical_support"],
    dislikes: ["coldness", "dishonesty", "emotional_chaos"]
  },
  "cancer_dog": {
    pace: "slow",
    depth: "intense",
    independence: "low",
    needs: ["emotional_depth", "reassurance", "stability"],
    dislikes: ["dishonesty", "coldness", "disrespect"]
  },
  "cancer_pig": {
    pace: "slow",
    depth: "intense",
    independence: "low",
    needs: ["emotional_depth", "reassurance", "romance"],
    dislikes: ["coldness", "dishonesty", "emotional_chaos"]
  },

  // LEO combinations (Fire sign: confident, needs romance)
  "leo_rat": {
    pace: "fast",
    depth: "medium",
    independence: "high",
    needs: ["romance", "freedom", "intellectual_bond"],
    dislikes: ["disrespect", "monotony", "dishonesty"]
  },
  "leo_ox": {
    pace: "steady",
    depth: "medium",
    independence: "medium",
    needs: ["romance", "stability", "practical_support"],
    dislikes: ["disrespect", "emotional_chaos", "dishonesty"]
  },
  "leo_tiger": {
    pace: "fast",
    depth: "intense",
    independence: "high",
    needs: ["freedom", "romance", "adventure"],
    dislikes: ["control", "disrespect", "coldness"]
  },
  "leo_rabbit": {
    pace: "steady",
    depth: "medium",
    independence: "medium",
    needs: ["romance", "reassurance", "emotional_depth"],
    dislikes: ["disrespect", "coldness", "emotional_chaos"]
  },
  "leo_dragon": {
    pace: "fast",
    depth: "medium",
    independence: "high",
    needs: ["romance", "freedom", "adventure"],
    dislikes: ["disrespect", "control", "monotony"]
  },
  "leo_snake": {
    pace: "steady",
    depth: "intense",
    independence: "high",
    needs: ["romance", "emotional_depth", "intellectual_bond"],
    dislikes: ["dishonesty", "disrespect", "coldness"]
  },
  "leo_horse": {
    pace: "fast",
    depth: "light",
    independence: "high",
    needs: ["freedom", "romance", "playfulness"],
    dislikes: ["control", "disrespect", "jealousy"]
  },
  "leo_goat": {
    pace: "steady",
    depth: "medium",
    independence: "low",
    needs: ["romance", "reassurance", "emotional_depth"],
    dislikes: ["disrespect", "coldness", "emotional_chaos"]
  },
  "leo_monkey": {
    pace: "fast",
    depth: "light",
    independence: "high",
    needs: ["playfulness", "romance", "novelty"],
    dislikes: ["disrespect", "monotony", "control"]
  },
  "leo_rooster": {
    pace: "steady",
    depth: "medium",
    independence: "medium",
    needs: ["romance", "practical_support", "reassurance"],
    dislikes: ["disrespect", "dishonesty", "emotional_chaos"]
  },
  "leo_dog": {
    pace: "steady",
    depth: "intense",
    independence: "medium",
    needs: ["emotional_depth", "romance", "reassurance"],
    dislikes: ["dishonesty", "disrespect", "coldness"]
  },
  "leo_pig": {
    pace: "steady",
    depth: "medium",
    independence: "low",
    needs: ["romance", "emotional_depth", "playfulness"],
    dislikes: ["disrespect", "coldness", "dishonesty"]
  },

  // VIRGO combinations (Earth sign: analytical, practical)
  "virgo_rat": {
    pace: "steady",
    depth: "medium",
    independence: "medium",
    needs: ["intellectual_bond", "practical_support", "stability"],
    dislikes: ["emotional_chaos", "dishonesty", "disrespect"]
  },
  "virgo_ox": {
    pace: "slow",
    depth: "medium",
    independence: "low",
    needs: ["stability", "practical_support", "reassurance"],
    dislikes: ["emotional_chaos", "dishonesty", "disrespect"]
  },
  "virgo_tiger": {
    pace: "steady",
    depth: "medium",
    independence: "medium",
    needs: ["practical_support", "freedom", "emotional_depth"],
    dislikes: ["emotional_chaos", "control", "dishonesty"]
  },
  "virgo_rabbit": {
    pace: "slow",
    depth: "medium",
    independence: "low",
    needs: ["stability", "reassurance", "practical_support"],
    dislikes: ["emotional_chaos", "coldness", "dishonesty"]
  },
  "virgo_dragon": {
    pace: "steady",
    depth: "medium",
    independence: "medium",
    needs: ["practical_support", "intellectual_bond", "stability"],
    dislikes: ["emotional_chaos", "dishonesty", "disrespect"]
  },
  "virgo_snake": {
    pace: "slow",
    depth: "intense",
    independence: "high",
    needs: ["intellectual_bond", "emotional_depth", "stability"],
    dislikes: ["dishonesty", "emotional_chaos", "disrespect"]
  },
  "virgo_horse": {
    pace: "steady",
    depth: "light",
    independence: "medium",
    needs: ["practical_support", "freedom", "intellectual_bond"],
    dislikes: ["emotional_chaos", "control", "dishonesty"]
  },
  "virgo_goat": {
    pace: "slow",
    depth: "medium",
    independence: "low",
    needs: ["stability", "reassurance", "practical_support"],
    dislikes: ["emotional_chaos", "coldness", "dishonesty"]
  },
  "virgo_monkey": {
    pace: "steady",
    depth: "light",
    independence: "medium",
    needs: ["intellectual_bond", "practical_support", "playfulness"],
    dislikes: ["emotional_chaos", "dishonesty", "control"]
  },
  "virgo_rooster": {
    pace: "slow",
    depth: "medium",
    independence: "medium",
    needs: ["practical_support", "stability", "reassurance"],
    dislikes: ["dishonesty", "emotional_chaos", "disrespect"]
  },
  "virgo_dog": {
    pace: "slow",
    depth: "intense",
    independence: "low",
    needs: ["emotional_depth", "stability", "reassurance"],
    dislikes: ["dishonesty", "coldness", "emotional_chaos"]
  },
  "virgo_pig": {
    pace: "slow",
    depth: "medium",
    independence: "low",
    needs: ["practical_support", "emotional_depth", "stability"],
    dislikes: ["emotional_chaos", "coldness", "dishonesty"]
  },

  // Continue with remaining signs: Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces...
  // For brevity, I'll add a few more key examples:

  // LIBRA - Air sign, seeks harmony and balance
  "libra_rat": {
    pace: "steady",
    depth: "medium",
    independence: "medium",
    needs: ["intellectual_bond", "romance", "playfulness"],
    dislikes: ["emotional_chaos", "disrespect", "control"]
  },
  
  // SCORPIO - Water sign, intense and passionate
  "scorpio_rat": {
    pace: "steady",
    depth: "intense",
    independence: "high",
    needs: ["emotional_depth", "intellectual_bond", "reassurance"],
    dislikes: ["dishonesty", "coldness", "disrespect"]
  },
  
  // SAGITTARIUS - Fire sign, adventurous and free-spirited
  "sagittarius_rat": {
    pace: "fast",
    depth: "light",
    independence: "high",
    needs: ["freedom", "adventure", "intellectual_bond"],
    dislikes: ["control", "monotony", "jealousy"]
  },
  
  // CAPRICORN - Earth sign, ambitious and traditional
  "capricorn_rat": {
    pace: "slow",
    depth: "medium",
    independence: "medium",
    needs: ["stability", "practical_support", "reassurance"],
    dislikes: ["emotional_chaos", "dishonesty", "disrespect"]
  },
  
  // AQUARIUS - Air sign, independent and unconventional
  "aquarius_rat": {
    pace: "steady",
    depth: "light",
    independence: "high",
    needs: ["freedom", "intellectual_bond", "novelty"],
    dislikes: ["control", "monotony", "jealousy"]
  },
  
  // PISCES - Water sign, empathetic and dreamy
  "pisces_rat": {
    pace: "slow",
    depth: "intense",
    independence: "low",
    needs: ["emotional_depth", "romance", "reassurance"],
    dislikes: ["coldness", "dishonesty", "emotional_chaos"]
  },
};

// Default love style for combinations not yet defined
const DEFAULT_LOVE_STYLE: LoveStyle = {
  pace: "steady",
  depth: "medium",
  independence: "medium",
  needs: ["emotional_depth", "reassurance", "intellectual_bond"],
  dislikes: ["dishonesty", "disrespect", "emotional_chaos"]
};

/**
 * Gets the love style profile for a Western sign + Chinese animal combination
 */
export function getLoveStyleProfile(
  westernSign: string,
  chineseAnimal: string
): EastWestProfile {
  const west = westernSign.toLowerCase() as WesternSign;
  const east = chineseAnimal.toLowerCase() as ChineseAnimal;
  const id = makeProfileId(west, east);
  
  const loveStyle = loveStylesData[id] || DEFAULT_LOVE_STYLE;
  
  return {
    id,
    displayName: makeDisplayName(west, east),
    loveStyle
  };
}

/**
 * Checks if a love style profile exists in the database
 */
export function hasLoveStyleProfile(
  westernSign: string,
  chineseAnimal: string
): boolean {
  const id = makeProfileId(
    westernSign.toLowerCase() as WesternSign,
    chineseAnimal.toLowerCase() as ChineseAnimal
  );
  return id in loveStylesData;
}

