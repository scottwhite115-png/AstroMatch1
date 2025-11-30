// astroMatchClassifierFinal.ts

// TypeScript — final version implementing:

// Soulmate, Twin Flame, Excellent, Good Friends, Opposites Attract, Difficult, Neutral

// - lively pair mapping

// - six harmonies / conflicts / damages

// - explicit overrides for top Aquarius-Monkey examples (and can be extended)

// - same Chinese-sign => Neutral

// - same-West cap configurable

import {
  CLASH_PAIRS,
  HARM_PAIRS,
  PUNISHMENT_PAIRS,
  BREAK_PAIRS,
  SIX_DAMAGES_PAIRS,
  SIX_HARMONY_PAIRS,
  TRINES,
  getChineseDifficultRelations,
  type ChineseAnimal,
} from "@/lib/chineseRelations";

export type WestSign =

  | "aries" | "taurus" | "gemini" | "cancer" | "leo" | "virgo"

  | "libra" | "scorpio" | "sagittarius" | "capricorn" | "aquarius" | "pisces";



export type EastAnimal = ChineseAnimal;



export type Tier =

  | "soulmate"

  | "twin_flame"

  | "excellent"

  | "very_good"  // Same trine + opposing/non-compatible West

  | "sparky_friends"

  | "opposites_attract"

  | "difficult"

  | "neutral";



export type Classification = {

  tier: Tier;

  badges: string[];    // explanatory badges, e.g., ["Same Trine","Secret Friend"]

  score: number;       // optional numeric score for ordering inside tiers

  reason?: string;

  flags?: {
    chineseDifficult?: string[];  // difficult relations from getChineseDifficultRelations
  };

};



// ------------------- CONFIG -------------------

export const config = {

  // When same West + same trine would otherwise be Soulmate/Twin Flame,

  // cap to this tier (prevents mirror topping). Set to "neutral" to be strict.

  sameWestCapTier: "excellent" as Tier,

};



// ------------------- WEST ELEMENTS -------------------

const WEST_ELEMENT: Record<WestSign, "fire"|"earth"|"air"|"water"> = {

  aries:"fire", leo:"fire", sagittarius:"fire",

  taurus:"earth", virgo:"earth", capricorn:"earth",

  gemini:"air", libra:"air", aquarius:"air",

  cancer:"water", scorpio:"water", pisces:"water",

};



function sameElement(a: WestSign, b: WestSign) {

  return WEST_ELEMENT[a] === WEST_ELEMENT[b];

}

function compatibleElement(a: WestSign, b: WestSign) {

  const ea = WEST_ELEMENT[a], eb = WEST_ELEMENT[b];

  return (ea === "fire" && eb === "air") || (ea === "air" && eb === "fire")

      || (ea === "earth" && eb === "water") || (ea === "water" && eb === "earth");

}

function oppositeElement(a: WestSign, b: WestSign) {

  const ea = WEST_ELEMENT[a], eb = WEST_ELEMENT[b];

  return (ea === "fire" && eb === "water") || (ea === "water" && eb === "fire")

      || (ea === "air" && eb === "earth") || (ea === "earth" && eb === "air");

}

// Western sign opposites (zodiac opposites, not just element opposites)
const WEST_OPPOSITES: Record<WestSign, WestSign> = {
  aries: "libra",
  taurus: "scorpio",
  gemini: "sagittarius",
  cancer: "capricorn",
  leo: "aquarius",
  virgo: "pisces",
  libra: "aries",
  scorpio: "taurus",
  sagittarius: "gemini",
  capricorn: "cancer",
  aquarius: "leo",
  pisces: "virgo",
};

function isWestOpposite(a: WestSign, b: WestSign) {
  return WEST_OPPOSITES[a] === b;
}



// ------------------- CHINESE SETS -------------------

// Trine grouping - now imported from chineseRelations.ts
// TRINES is an array of arrays: [["rat", "dragon", "monkey"], ["ox", "snake", "rooster"], ...]

// Six Harmonies (Liu He) -- secret friends - now imported from chineseRelations.ts
const SIX_HARMONIES = SIX_HARMONY_PAIRS;



// Six Conflicts (Opposites) - same as CLASH_PAIRS (六冲)
// Using CLASH_PAIRS from chineseRelations.ts
const SIX_CONFLICTS = CLASH_PAIRS;



// Chinese relations are now imported from @/lib/chineseRelations
// Using normalized pairs from the new structure:
// - CLASH_PAIRS (六冲)
// - HARM_PAIRS (六害) - same as SIX_DAMAGES_PAIRS
// - PUNISHMENT_PAIRS (相刑)
// - BREAK_PAIRS (六破)
// - SIX_DAMAGES_PAIRS (alias for HARM_PAIRS)

// Legacy aliases for backward compatibility
const SIX_DAMAGES = SIX_DAMAGES_PAIRS;
const CLASHES = CLASH_PAIRS;
const HARMS = HARM_PAIRS;
const PUNISHMENTS = PUNISHMENT_PAIRS;
const BREAKS = BREAK_PAIRS;



// Lively pair map (from your chart). Use sets for quick lookup.

const LIVELY_MAP: Record<EastAnimal, Set<EastAnimal>> = {

  rat: new Set<EastAnimal>(["rat","tiger","snake","dog","pig"]),

  ox: new Set<EastAnimal>(["ox","tiger","monkey","pig"]),

  tiger: new Set<EastAnimal>(["tiger","horse","dog","pig","rat","ox","rabbit","dragon","goat","rooster"]),

  rabbit: new Set<EastAnimal>(["rabbit","goat","dog","pig","tiger","snake","monkey"]), // fixed: "sheep" -> "goat"

  dragon: new Set<EastAnimal>(["dragon","rat","monkey","rooster","tiger","snake","horse","pig"]),

  snake: new Set<EastAnimal>(["snake","rat","rabbit","dragon","horse","goat","dog"]), // fixed: "sheep" -> "goat"

  horse: new Set<EastAnimal>(["horse","tiger","goat","dog","dragon","snake","monkey","rooster","pig"]), // fixed: "sheep" -> "goat"

  goat: new Set<EastAnimal>(["goat","rabbit","horse","pig","snake","monkey","rooster"]),

  monkey: new Set<EastAnimal>(["monkey","rat","dragon","ox","rabbit","horse","goat","rooster","dog"]), // fixed: "sheep" -> "goat"

  rooster: new Set<EastAnimal>(["rooster","ox","dragon","snake","tiger","horse","goat","monkey","pig"]), // fixed: "sheep" -> "goat"

  dog: new Set<EastAnimal>(["dog","tiger","rabbit","horse","snake","monkey","pig","rat"]),

  pig: new Set<EastAnimal>(["pig","goat","rabbit","tiger","rat","ox","dragon","horse","rooster","dog"]), // fixed: "sheep" -> "goat"

};



// ------------------- HELPERS -------------------

function isSameTrineChinese(a: EastAnimal, b: EastAnimal) {
  // Check if both animals are in the same trine array
  for (const trine of TRINES) {
    if (trine.includes(a) && trine.includes(b)) {
      return true;
    }
  }
  return false;
}

function isSixHarmony(a: EastAnimal, b: EastAnimal) {
  const pair: [EastAnimal, EastAnimal] = a < b ? [a, b] : [b, a];
  return SIX_HARMONY_PAIRS.some(([x, y]) => x === pair[0] && y === pair[1]);
}

function isConflictPair(a: EastAnimal, b: EastAnimal) {
  const pair: [EastAnimal, EastAnimal] = a < b ? [a, b] : [b, a];
  return CLASH_PAIRS.some(([x, y]) => x === pair[0] && y === pair[1]);
}

function isDamagePair(a: EastAnimal, b: EastAnimal) {
  const pair: [EastAnimal, EastAnimal] = a < b ? [a, b] : [b, a];
  return SIX_DAMAGES_PAIRS.some(([x, y]) => x === pair[0] && y === pair[1]);
}

// Helper functions using normalized pairs (pairs are already sorted in chineseRelations.ts)
function isClashPair(a: EastAnimal, b: EastAnimal) {
  const pair: [EastAnimal, EastAnimal] = a < b ? [a, b] : [b, a];
  return CLASH_PAIRS.some(([x, y]) => x === pair[0] && y === pair[1]);
}

function isHarmPair(a: EastAnimal, b: EastAnimal) {
  const pair: [EastAnimal, EastAnimal] = a < b ? [a, b] : [b, a];
  return HARM_PAIRS.some(([x, y]) => x === pair[0] && y === pair[1]);
}

function isPunishmentPair(a: EastAnimal, b: EastAnimal) {
  const pair: [EastAnimal, EastAnimal] = a < b ? [a, b] : [b, a];
  return PUNISHMENT_PAIRS.some(([x, y]) => x === pair[0] && y === pair[1]);
}

function isBreakPair(a: EastAnimal, b: EastAnimal) {
  const pair: [EastAnimal, EastAnimal] = a < b ? [a, b] : [b, a];
  return BREAK_PAIRS.some(([x, y]) => x === pair[0] && y === pair[1]);
}

// Least compatible Chinese sign pairs (from compatibility charts)
// These are pairs that should NOT get elevated to Good Friends even with opposite West signs
const LEAST_COMPATIBLE: Record<EastAnimal, EastAnimal[]> = {
  rat: ["horse", "goat", "rooster"],
  ox: ["goat", "horse", "dragon"],
  tiger: ["snake", "monkey"],
  rabbit: ["rooster", "dragon", "rat"],
  dragon: ["dog", "rabbit", "ox"],
  snake: ["tiger", "pig"],
  horse: ["rat", "ox", "rabbit"],
  goat: ["ox", "rat", "dragon"],
  monkey: ["tiger", "pig"],
  rooster: ["rabbit", "dog", "rat"],
  dog: ["dragon", "rooster", "ox"],
  pig: ["snake", "monkey", "pig"], // Pig is least compatible with itself
};

function isLeastCompatible(a: EastAnimal, b: EastAnimal) {
  return LEAST_COMPATIBLE[a]?.includes(b) || LEAST_COMPATIBLE[b]?.includes(a);
}

function isLivelyPair(a: EastAnimal, b: EastAnimal) {

  return (LIVELY_MAP[a]?.has(b) || LIVELY_MAP[b]?.has(a));

}

function isSecretFriend(a: EastAnimal, b: EastAnimal) {

  return isSixHarmony(a,b);

}



// ------------------- OVERRIDES -------------------

// explicit forced labels you asked for — easy to extend

const FORCE_OVERRIDES: { westA: WestSign; eastA: EastAnimal; westB: WestSign; eastB: EastAnimal; tier: Tier }[] = [

  // Soulmate overrides (same-trine + same Western element for the Aquarius Monkey examples you gave)

  { westA: "gemini", eastA: "rat", westB: "any" as any, eastB: "any" as any, tier: "soulmate" },

  { westA: "libra",  eastA: "rat", westB: "any" as any, eastB: "any" as any, tier: "soulmate" },

  { westA: "gemini", eastA: "dragon", westB: "any" as any, eastB: "any" as any, tier: "soulmate" },

  { westA: "libra",  eastA: "dragon", westB: "any" as any, eastB: "any" as any, tier: "soulmate" },



  // Twin Flame overrides (same-trine + compatible West)

  { westA: "aries",        eastA: "rat",    westB: "any" as any, eastB: "any" as any, tier: "twin_flame" },

  { westA: "sagittarius",  eastA: "rat",    westB: "any" as any, eastB: "any" as any, tier: "twin_flame" },

  { westA: "aries",        eastA: "dragon", westB: "any" as any, eastB: "any" as any, tier: "twin_flame" },

  { westA: "sagittarius",  eastA: "dragon", westB: "any" as any, eastB: "any" as any, tier: "twin_flame" },

];



// helper to consult overrides in a flexible way

function checkOverrides(wA: WestSign, eA: EastAnimal, wB: WestSign, eB: EastAnimal): Tier | null {

  // check both directions; overrides use "westA, eastA" being the partner side we target

  // The override specifies a specific westA/eastA combination that should force a tier

  // We check if this combination appears in either position of the pair (wA/eA or wB/eB)

  for (const ov of FORCE_OVERRIDES) {

    // Check if override's westA/eastA matches either side of the pair

    const matchesFirst = (ov.westA === wA && ov.eastA === eA);

    const matchesSecond = (ov.westA === wB && ov.eastA === eB);

    // Also check reverse (in case the override is meant to match the other side)

    const matchesFirstReverse = (ov.westA === wB && ov.eastA === eA);

    const matchesSecondReverse = (ov.westA === wA && ov.eastA === eB);

    if (matchesFirst || matchesSecond || matchesFirstReverse || matchesSecondReverse) {

      return ov.tier;

    }

  }

  return null;

}



// ------------------- CLASSIFIER -------------------

export function classifyPair(

  westA: WestSign,

  eastA: EastAnimal,

  westB: WestSign,

  eastB: EastAnimal

): Classification {

  const badges: string[] = [];

  let score = 0;



  // flags - declare early so it can be used in early returns
  const flags: { chineseDifficult?: string[] } = {};

  // 0) same Chinese-sign -> always return Good Friends (regardless of Western compatibility)
  if (eastA === eastB) {
    badges.push("Same Chinese Sign");
    // Same Chinese sign always returns Good Friends, regardless of Western compatibility
    return { tier: "sparky_friends", badges, score: 0.5, reason: "Same Chinese animal - shown as Good Friends", flags };
  }

  // 0.5) check explicit overrides (top-priority)
  const forced = checkOverrides(westA, eastA, westB, eastB);

  if (forced) {
    return { tier: forced, badges: ["Forced Override"], score: 6.0, reason: "Manual override / apex match", flags };
  }

  // Check for difficult Chinese relations first
  const difficultRelations = getChineseDifficultRelations(eastA, eastB);

  const sameTrine = isSameTrineChinese(eastA, eastB);
  console.log(`[CLASSIFIER DEBUG] ${westA}-${eastA} × ${westB}-${eastB} | sameTrine=${sameTrine}, secret=${isSecretFriend(eastA, eastB)}`);

  const secret = isSecretFriend(eastA, eastB);

  const conflict = isConflictPair(eastA, eastB);

  const damage = isDamagePair(eastA, eastB);

  const clash = isClashPair(eastA, eastB);

  const harm = isHarmPair(eastA, eastB);

  const punishment = isPunishmentPair(eastA, eastB);

  const break_ = isBreakPair(eastA, eastB);

  const lively = isLivelyPair(eastA, eastB);
  
  // If there are difficult relations, store them in flags
  if (difficultRelations.length > 0) {
    flags.chineseDifficult = difficultRelations;
  }

  const sameWest = westA === westB;

  // Western sign relationship flags
  // Check zodiac opposites first (this takes priority over element compatibility)
  const westOpp = isWestOpposite(westA, westB);
  
  // Compatible means: same element OR compatible elements, BUT NOT zodiac opposites
  const westIsCompatible = !westOpp && (compatibleElement(westA, westB) || sameElement(westA, westB));

  const westIsNonCompatible = !westIsCompatible && !westOpp;



  // --- Micro-weights for ordering ---

  if (sameTrine) { score += 3.0; badges.push("Same Trine"); }

  if (secret) { score += 2.0; badges.push("Secret Friend"); }

  if (lively) { score += 0.5; badges.push("Lively Pair"); }

  if (conflict) { score -= 4.0; badges.push("Conflict"); }

  if (damage) { score -= 3.0; badges.push("Damage"); }

  if (clash) { score -= 3.5; badges.push("Clash"); }

  if (harm) { score -= 3.5; badges.push("Harm"); }

  if (punishment) { score -= 3.5; badges.push("Punishment"); }

  if (break_) { score -= 3.5; badges.push("Break"); }



  // Western element badges (check zodiac opposites first)
  if (westOpp) { badges.push("Magnetic Opposites (West)"); score += 1.0; }
  else if (sameElement(westA, westB)) { badges.push("Same Element (West)"); score += 2.0; }
  else if (compatibleElement(westA, westB)) { badges.push("Compatible West Elements"); score += 1.0; }
  else if (oppositeElement(westA, westB)) { badges.push("Opposite West Elements"); score -= 1.0; }



  if (sameWest) { score += 0.25; }



  // ---------- Priority resolution ----------

  // A) Check for difficult relations first (using getChineseDifficultRelations)
  // This includes: Clashes, Harms, Punishments, Breaks, and Six Damages
  // These take priority over Conflicts to ensure they're always "Difficult Match"
  
  if (difficultRelations.length > 0) {
    // Determine the primary reason based on the first difficult relation found
    const primaryRelation = difficultRelations[0];
    let reason = "";
    
    switch (primaryRelation) {
      case "clash":
        reason = "Clash (冲) - High divorce risk, Major relocation/fight possibility";
        break;
      case "harm":
        reason = "Harm (害) - Emotional betrayal, Family gossip";
        break;
      case "punishment":
        reason = "Punishment (刑) - Self-sabotage in love, Karmic lesson year";
        break;
      case "break":
        reason = "Break (破) - Trust erosion, Project failure";
        break;
      case "sixDamages":
        reason = "Six Damages (六害) - Worst compatibility";
        break;
    }
    
    return { 
      tier: "difficult", 
      badges, 
      score, 
      reason,
      flags 
    };
  }

  // B) Conflicts -> Opposites Attract (only if not already a difficult relation)
  // Boost score to ensure it's above 60%

  if (conflict) {
    // Ensure score is boosted for Opposites Attract to be > 60%
    const boostedScore = Math.max(score, 3.0); // Minimum score of 3.0 ensures > 60% after calculation
    return { tier: "opposites_attract", badges, score: boostedScore, reason: "Six Conflicts (Magnetic Opposites) applied", flags };
  }



  // D) Soulmate (same-trine + same Western element)

  if (sameTrine && sameElement(westA, westB)) {

    if (sameWest) {

      badges.push("Same West (cap applied)");

      return { tier: config.sameWestCapTier, badges, score, reason: "Same West + Same Trine capped per config", flags };

    }

    console.log(`[CLASSIFIER] SOULMATE detected: ${westA}-${eastA} × ${westB}-${eastB} | sameTrine=${sameTrine}, sameElement=${sameElement(westA, westB)}`);
    return { tier: "soulmate", badges, score, reason: "Same Chinese trine + same Western element", flags };

  }



  // E) Twin Flame (same-trine + compatible Western elements, but NOT zodiac opposites)

  if (sameTrine && westIsCompatible && !westOpp) {

    if (sameWest) {

      badges.push("Same West (cap applied)");

      return { tier: config.sameWestCapTier, badges, score, reason: "Same West + Same Trine (cap applied)", flags };

    }

    return { tier: "twin_flame", badges, score, reason: "Same Chinese trine + compatible Western elements", flags };

  }



  // F) Excellent: strong Chinese or Western support (same-trine + decent west OR secret friend + decent west)

  if ((sameTrine && westIsCompatible && !westOpp)

      || (secret && westIsCompatible && !westOpp)) {

    return { tier: "excellent", badges, score, reason: "Excellent: strong Chinese + Western alignment", flags };

  }



  // F.5) Very Good: same trine + opposing/non-compatible West
  // This takes priority over Good Friends when same trine is involved
  if (sameTrine && (westOpp || westIsNonCompatible)) {

    return { tier: "very_good", badges, score, reason: "Same trine + opposing/non-compatible West => Excellent Match", flags };

  }



  // G) Good Friends: 
  // - lively pair + same OR compatible West (but NOT same trine, and NOT zodiac opposites)
  // - OR opposite West signs (unless Chinese signs are least compatible)
  // Same trine cases are handled above

  // Check if opposite West signs should elevate to Good Friends
  if (westOpp && !sameTrine && !isLeastCompatible(eastA, eastB)) {
    return { tier: "sparky_friends", badges, score, reason: "Opposite West signs => Good Friends", flags };
  }

  // Lively pair + compatible West (but NOT same trine, and NOT zodiac opposites)
  if (lively && !sameTrine && !westOpp && (sameElement(westA, westB) || compatibleElement(westA, westB))) {
    return { tier: "sparky_friends", badges, score, reason: "Lively pair + same/compatible West => Good Friends", flags };
  }

  // H) Lively pair but no Western support -> Difficult

  if (lively) {
    return { tier: "difficult", badges, score, reason: "Lively pair w/out West support -> Difficult", flags };
  }



  // I) Fallback default = Neutral

  return { tier: "neutral", badges, score, reason: "Default: no strong pattern matched", flags };

}



// ------------------- UTIL: generate 144 grid for a base -------------------

export const ALL_WEST: WestSign[] = ["aries","taurus","gemini","cancer","leo","virgo","libra","scorpio","sagittarius","capricorn","aquarius","pisces"];

export const ALL_EAST: EastAnimal[] = ["rat","ox","tiger","rabbit","dragon","snake","horse","goat","monkey","rooster","dog","pig"];



export function generateFullGridFor(baseWest: WestSign, baseEast: EastAnimal) {

  const grid: { west: WestSign; east: EastAnimal; classification: Classification }[] = [];

  for (const w of ALL_WEST) {

    for (const e of ALL_EAST) {

      grid.push({ west: w, east: e, classification: classifyPair(baseWest, baseEast, w, e) });

    }

  }

  return grid;

}
