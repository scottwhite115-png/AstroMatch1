export type WestSign =
  | "aries" | "taurus" | "gemini" | "cancer" | "leo" | "virgo"
  | "libra" | "scorpio" | "sagittarius" | "capricorn" | "aquarius" | "pisces";

export type EastAnimal =
  | "rat" | "ox" | "tiger" | "rabbit" | "dragon" | "snake"
  | "horse" | "goat" | "monkey" | "rooster" | "dog" | "pig";

export type Tier =
  | "Soulmate"
  | "Twin Flame"
  | "Excellent"
  | "Good"
  | "Fair"
  | "Learning"
  | "Challenging";

export interface OverlayInput {
  westA: WestSign;
  westB: WestSign;
  eastA: EastAnimal;
  eastB: EastAnimal;
  /** current tier from the core engine (before overlay) */
  currentTier: Tier;
}

export interface OverlayResult {
  tier: Tier;
  badges: string[];
  tagline?: string;
}

// ---------- Western elements ----------
const WEST_ELEMENT: Record<WestSign, "fire" | "earth" | "air" | "water"> = {
  aries: "fire", leo: "fire", sagittarius: "fire",
  taurus: "earth", virgo: "earth", capricorn: "earth",
  gemini: "air", libra: "air", aquarius: "air",
  cancer: "water", scorpio: "water", pisces: "water",
};

const isSameElement = (a: WestSign, b: WestSign) => WEST_ELEMENT[a] === WEST_ELEMENT[b];

const isCompatibleElements = (a: WestSign, b: WestSign) => {
  const ea = WEST_ELEMENT[a];
  const eb = WEST_ELEMENT[b];
  return (
    (ea === "fire" && eb === "air") ||
    (ea === "air" && eb === "fire") ||
    (ea === "earth" && eb === "water") ||
    (ea === "water" && eb === "earth")
  );
};

// ---------- Chinese “best match” sets (mutual preferred partners) ----------
const BEST_MATCH: Record<EastAnimal, EastAnimal[]> = {
  rat: ["ox", "dragon", "monkey"],
  ox: ["rat", "snake", "rooster"],
  tiger: ["dragon", "horse", "pig"],
  rabbit: ["goat", "monkey", "dog", "pig"],
  dragon: ["rooster", "rat", "monkey"],
  snake: ["dragon", "rooster"],
  horse: ["tiger", "goat", "rabbit"],
  goat: ["horse", "rabbit", "pig"],
  monkey: ["ox", "rabbit"],
  rooster: ["ox", "snake"],
  dog: ["rabbit"],
  pig: ["tiger", "rabbit", "goat"],
};

const areMutualBestMatches = (a: EastAnimal, b: EastAnimal) =>
  BEST_MATCH[a]?.includes(b) && BEST_MATCH[b]?.includes(a);

// ---------- Chinese opposite pairs (East polarity) ----------
const EAST_OPPOSITE: Record<EastAnimal, EastAnimal> = {
  rat: "horse", ox: "goat", tiger: "monkey", rabbit: "rooster",
  dragon: "dog", snake: "pig", horse: "rat", goat: "ox",
  monkey: "tiger", rooster: "rabbit", dog: "dragon", pig: "snake",
};

const areEastOpposites = (a: EastAnimal, b: EastAnimal) => EAST_OPPOSITE[a] === b;

// ---------- Chinese taglines (short, paraphrased) ----------
const TAGLINE: Partial<Record<`${EastAnimal}-${EastAnimal}`, string>> = {
  // Rat
  "rat-ox": "Happy & steady; build-and-bloom partners.",
  "rat-dragon": "Strategic spark; momentum comes easy.",
  "rat-monkey": "Witty duo; lively pace and fast wins.",
  // Ox
  "ox-snake": "Quiet power; trust and depth.",
  "ox-rooster": "Order meets craft; polished teamwork.",
  // Tiger
  "tiger-dragon": "Big vision, bold moves.",
  "tiger-horse": "High energy, shared horizon.",
  "tiger-pig": "Warm support, fearless stride.",
  // Rabbit
  "rabbit-goat": "Gentle harmony; creative home base.",
  "rabbit-monkey": "Playful minds; charm and quick fixes.",
  "rabbit-dog": "Loyal hearts; safe and true.",
  "rabbit-pig": "Soft strength; ease and comfort.",
  // Dragon
  "dragon-rooster": "Presentation + precision; standout pair.",
  "dragon-rat": "Lead + strategist; climb together.",
  "dragon-monkey": "Charisma + ingenuity; rapid lift.",
  // Snake
  "snake-dragon": "Magnetism with purpose.",
  "snake-rooster": "Insight + polish; sharp results.",
  // Horse
  "horse-tiger": "Adventure partners; courage to spare.",
  "horse-goat": "Care + freedom; balanced tempo.",
  "horse-rabbit": "Kind pace; easy affection.",
  // Goat
  "goat-horse": "Light, social, sunny.",
  "goat-rabbit": "Artful nest; tender rhythm.",
  "goat-pig": "Generous hearts; simple joys.",
  // Monkey
  "monkey-ox": "Steady builder meets clever solver.",
  "monkey-rabbit": "",
  // Rooster
  "rooster-ox": "Method + endurance; clean execution.",
  "rooster-snake": "Insight + polish; sharp results.",
  // Dog
  "dog-rabbit": "Devotion and care; safe harbor.",
  // Pig
  "pig-tiger": "Courage wrapped in kindness.",
  "pig-rabbit": "Gentle warmth; lasting ease.",
  "pig-goat": "Comfort, creativity, and calm.",
};

const taglineFor = (a: EastAnimal, b: EastAnimal): string | undefined => {
  const k1 = `${a}-${b}` as const;
  const k2 = `${b}-${a}` as const;
  return TAGLINE[k1] ?? TAGLINE[k2];
};

// ---------- Tier helpers ----------
const ORDER: Tier[] = [
  "Soulmate",
  "Twin Flame",
  "Excellent",
  "Good",
  "Fair",
  "Learning",
  "Challenging",
];

const rank = (t: Tier) => ORDER.indexOf(t);
const betterTier = (a: Tier, b: Tier) => (rank(a) <= rank(b) ? a : b); // smaller index = higher tier
const worseTier = (a: Tier, b: Tier) => (rank(a) >= rank(b) ? a : b);

// ---------- The overlay ----------
export function applyChineseOverlay(input: OverlayInput): OverlayResult {
  const westA = input.westA.toLowerCase() as WestSign;
  const westB = input.westB.toLowerCase() as WestSign;
  const eastA = input.eastA.toLowerCase() as EastAnimal;
  const eastB = input.eastB.toLowerCase() as EastAnimal;

  let tier: Tier = input.currentTier;
  const badges: string[] = [];

  // 1) East opposites: floor to Fair, add badge (never elevate to Good)
  if (areEastOpposites(eastA, eastB)) {
    badges.push("Magnetic Opposites");
    tier = worseTier(tier, "Fair");
  }

  // 2) Best-match upgrade → Excellent when West are same or compatible elements
  if (areMutualBestMatches(eastA, eastB)) {
    if (isSameElement(westA, westB) || isCompatibleElements(westA, westB)) {
      tier = betterTier(tier, "Excellent");
    }
  }

  // 3) Attach a Chinese-compat tagline when present (non-blocking)
  const tagline = taglineFor(eastA, eastB);

  return { tier, badges, tagline };
}

