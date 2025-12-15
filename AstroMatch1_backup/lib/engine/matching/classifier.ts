// /lib/engine/matching/classifier.ts
// Classification helper for match labels without changing underlying score logic.

export type WestSign =
  | "aries" | "taurus" | "gemini" | "cancer" | "leo" | "virgo"
  | "libra" | "scorpio" | "sagittarius" | "capricorn" | "aquarius" | "pisces";

export type EastAnimal =
  | "rat" | "ox" | "tiger" | "rabbit" | "dragon" | "snake"
  | "horse" | "goat" | "monkey" | "rooster" | "dog" | "pig";

export type Category =
  | "Best Match"
  | "Strong Match"
  | "Mixed Match"
  | "Magnetic Opposites"
  | "Challenging";

export interface InputPair {
  westA: WestSign; eastA: EastAnimal;
  westB: WestSign; eastB: EastAnimal;
}

export interface Classified {
  category: Category;
  badges: string[];
  reason?: string;
}

const WEST_ELEMENT: Record<WestSign, "fire" | "earth" | "air" | "water"> = {
  aries: "fire", leo: "fire", sagittarius: "fire",
  taurus: "earth", virgo: "earth", capricorn: "earth",
  gemini: "air", libra: "air", aquarius: "air",
  cancer: "water", scorpio: "water", pisces: "water",
};

type WestRel = "same" | "compatible" | "semi" | "opposite";

function westRelation(a: WestSign, b: WestSign): WestRel {
  const ea = WEST_ELEMENT[a], eb = WEST_ELEMENT[b];
  if (ea === eb) return "same";

  const compat =
    (ea === "fire" && eb === "air") || (ea === "air" && eb === "fire") ||
    (ea === "earth" && eb === "water") || (ea === "water" && eb === "earth");
  if (compat) return "compatible";

  const opp =
    (ea === "fire" && eb === "water") || (ea === "water" && eb === "fire") ||
    (ea === "air" && eb === "earth")  || (ea === "earth" && eb === "air");
  if (opp) return "opposite";

  return "semi";
}

const TRINE: Record<EastAnimal, "visionaries" | "strategists" | "adventurers" | "artists"> = {
  rat: "visionaries", dragon: "visionaries", monkey: "visionaries",
  ox: "strategists", snake: "strategists", rooster: "strategists",
  tiger: "adventurers", horse: "adventurers", dog: "adventurers",
  rabbit: "artists", goat: "artists", pig: "artists",
};

const EAST_OPPOSITE: Record<EastAnimal, EastAnimal> = {
  rat: "horse", ox: "goat", tiger: "monkey", rabbit: "rooster",
  dragon: "dog", snake: "pig", horse: "rat", goat: "ox",
  monkey: "tiger", rooster: "rabbit", dog: "dragon", pig: "snake",
};

const sameTrine = (a: EastAnimal, b: EastAnimal) => TRINE[a] === TRINE[b];
const eastOpposites = (a: EastAnimal, b: EastAnimal) => EAST_OPPOSITE[a] === b;

const CN_BEST: Record<EastAnimal, EastAnimal[]> = {
  rat: ["dragon", "monkey"],
  ox: ["snake", "rooster"],
  tiger: ["horse", "dog"],
  rabbit: ["goat", "pig"],
  dragon: ["rat", "monkey"],
  snake: ["rooster", "ox"],
  horse: ["tiger", "dog"],
  goat: ["rabbit", "pig"],
  monkey: ["rat", "dragon"],
  rooster: ["ox", "snake"],
  dog: ["tiger", "horse"],
  pig: ["rabbit", "goat"],
};

const CN_GOOD: Record<EastAnimal, EastAnimal[]> = {
  rat: ["ox"],
  ox: ["rat"],
  tiger: ["pig"],
  rabbit: ["dog"],
  dragon: ["rooster"],
  snake: ["monkey"],
  horse: ["goat"],
  goat: ["horse"],
  monkey: ["snake"],
  rooster: ["dragon"],
  dog: ["rabbit"],
  pig: ["tiger"],
};

const CN_WORST: Record<EastAnimal, EastAnimal> = {
  rat: "goat",
  ox: "horse",
  tiger: "snake",
  rabbit: "dragon",
  dragon: "rabbit",
  snake: "tiger",
  horse: "ox",
  goat: "rat",
  monkey: "pig",
  rooster: "dog",
  dog: "rooster",
  pig: "monkey",
};

const isMutualBest = (a: EastAnimal, b: EastAnimal) =>
  CN_BEST[a]?.includes(b) && CN_BEST[b]?.includes(a);

export interface ClassifierConfig {
  capIdenticalWestToGood?: boolean;
  showChineseBestBadge?: boolean;
}

const DEFAULT_CFG: Required<ClassifierConfig> = {
  capIdenticalWestToGood: true,
  showChineseBestBadge: true,
};

export function classify(pair: InputPair, cfg: ClassifierConfig = {}): Classified {
  const { capIdenticalWestToGood, showChineseBestBadge } = { ...DEFAULT_CFG, ...cfg };
  const { westA, westB, eastA, eastB } = pair;

  const badges: string[] = [];
  const rel = westRelation(westA, westB);
  const sameWest = westA === westB;
  const trine = sameTrine(eastA, eastB);
  const oppEast = eastOpposites(eastA, eastB);
  const cnBest = isMutualBest(eastA, eastB);
  const cnGood = CN_GOOD[eastA]?.includes(eastB) || CN_GOOD[eastB]?.includes(eastA);
  const cnWorst = CN_WORST[eastA] === eastB || CN_WORST[eastB] === eastA;

  if (oppEast) {
    badges.push("Magnetic Opposites");
    return { category: "Magnetic Opposites", badges, reason: "East opposites" };
  }

  if (capIdenticalWestToGood && sameWest) {
    badges.push("Same Sign (West)");
    return { category: "Mixed Match", badges, reason: "Identical West cap" };
  }

  if (cnWorst) {
    return { category: "Challenging", badges, reason: "Card: Worst Match" };
  }

  if (trine) {
    badges.push("Same Trine");
    if (rel === "same") {
      return { category: "Best Match", badges, reason: "Same trine + same element" };
    }
    if (rel === "compatible" || rel === "semi") {
      return { category: "Strong Match", badges, reason: "Same trine + compatible/semi element" };
    }
    return { category: "Mixed Match", badges, reason: "Same trine + opposite element" };
  }

  if (cnBest) {
    if (showChineseBestBadge) badges.push("Chinese Best Match");
    if (rel === "same" || rel === "compatible") {
      return { category: "Strong Match", badges, reason: "CN Best-Match + Air/Fire" };
    }
    if (rel === "semi") {
      return { category: "Mixed Match", badges, reason: "CN Best-Match + semi" };
    }
    return { category: "Challenging", badges, reason: "CN Best-Match + Earth-opposite" };
  }

  if (cnGood && (rel === "same" || rel === "compatible")) {
    badges.push("Chinese Good Match");
    return { category: "Mixed Match", badges, reason: "CN Good + same/compatible" };
  }

  if (rel === "same" || rel === "compatible") {
    return { category: "Mixed Match", badges, reason: "Cross-trine + same/compatible element" };
  }

  return { category: "Challenging", badges, reason: "Default: weak alignment" };
}

export function build144ForBase(baseWest: WestSign, baseEast: EastAnimal) {
  const westAll: WestSign[] = ["aries","taurus","gemini","cancer","leo","virgo","libra","scorpio","sagittarius","capricorn","aquarius","pisces"];
  const eastAll: EastAnimal[] = ["rat","ox","tiger","rabbit","dragon","snake","horse","goat","monkey","rooster","dog","pig"];

  const out: Array<{ west: WestSign; east: EastAnimal; result: Classified }> = [];
  for (const w of westAll) {
    for (const e of eastAll) {
      if (w === baseWest && e === baseEast) continue;
      const result = classify({ westA: baseWest, eastA: baseEast, westB: w, eastB: e });
      out.push({ west: w, east: e, result });
    }
  }
  return out;
}

