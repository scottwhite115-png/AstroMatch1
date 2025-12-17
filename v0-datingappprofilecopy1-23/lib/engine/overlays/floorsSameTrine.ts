import type { WestSign, EastAnimal, Tier } from "./chineseOverlay";

export interface FloorConfig {
  /** If true, identical East+West (e.g., Aquarius Monkey × Aquarius Monkey) is Twin Flame (not Soulmate) */
  identicalSameSignTwinFlame?: boolean; // default true
}

const WEST_ELEMENT: Record<WestSign, "fire" | "earth" | "air" | "water"> = {
  aries: "fire", leo: "fire", sagittarius: "fire",
  taurus: "earth", virgo: "earth", capricorn: "earth",
  gemini: "air", libra: "air", aquarius: "air",
  cancer: "water", scorpio: "water", pisces: "water",
};

// Classify West relation for elements
type WestRel = "same" | "compatible" | "semi" | "opposite";
function westRelation(a: WestSign, b: WestSign): WestRel {
  const ea = WEST_ELEMENT[a];
  const eb = WEST_ELEMENT[b];
  if (ea === eb) return "same";
  const compat =
    (ea === "fire" && eb === "air") ||
    (ea === "air" && eb === "fire") ||
    (ea === "earth" && eb === "water") ||
    (ea === "water" && eb === "earth");
  if (compat) return "compatible";
  const opposite =
    (ea === "fire" && eb === "water") ||
    (ea === "water" && eb === "fire") ||
    (ea === "air" && eb === "earth") ||
    (ea === "earth" && eb === "air");
  if (opposite) return "opposite";
  // remaining pairs are semi-compatible (Fire↔Earth, Air↔Water)
  return "semi";
}

const TRINE: Record<EastAnimal, "visionaries" | "strategists" | "adventurers" | "artists"> = {
  rat: "visionaries", dragon: "visionaries", monkey: "visionaries",
  ox: "strategists", snake: "strategists", rooster: "strategists",
  tiger: "adventurers", horse: "adventurers", dog: "adventurers",
  rabbit: "artists", goat: "artists", pig: "artists",
};

const ORDER: Tier[] = ["Soulmate", "Twin Flame", "Excellent", "Good", "Fair", "Learning", "Challenging"];
const maxTier = (a: Tier, b: Tier) => (ORDER.indexOf(a) <= ORDER.indexOf(b) ? a : b);
const sameTrine = (a: EastAnimal, b: EastAnimal) => TRINE[a] === TRINE[b];

export function applySameTrineFloors(
  westA: WestSign,
  westB: WestSign,
  eastA: EastAnimal,
  eastB: EastAnimal,
  currentTier: Tier,
  cfg: FloorConfig = { identicalSameSignTwinFlame: true },
): Tier {
  let tier = currentTier;
  if (!sameTrine(eastA, eastB)) return tier;

  const rel = westRelation(westA, westB);
  const identicalCombo = eastA === eastB && westA === westB;

  if (rel === "same") {
    if (identicalCombo) {
      tier = maxTier(tier, cfg.identicalSameSignTwinFlame ? "Twin Flame" : "Soulmate");
    } else {
      tier = maxTier(tier, "Twin Flame");
    }
  } else if (rel === "compatible") {
    tier = maxTier(tier, "Twin Flame");
  } else if (rel === "semi") {
    tier = maxTier(tier, "Excellent");
  } else {
    tier = maxTier(tier, "Good");
  }

  return tier;
}

