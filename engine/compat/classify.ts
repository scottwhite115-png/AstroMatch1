import { TIER_TOOLTIP, type Tier } from "@/engine/labels";
import {
  WEST_ELEMENT,
  TRINE,
  EAST_OPPOSITE,
  CN_BEST,
  CN_GOOD,
  CN_WORST,
  type WestSign,
  type EastAnimal,
} from "@/engine/compat/maps";

const sameElement = (a: WestSign, b: WestSign) => WEST_ELEMENT[a] === WEST_ELEMENT[b];
const compatible = (a: WestSign, b: WestSign) => {
  const ea = WEST_ELEMENT[a], eb = WEST_ELEMENT[b];
  return (ea === "fire" && eb === "air") || (ea === "air" && eb === "fire") ||
         (ea === "earth" && eb === "water") || (ea === "water" && eb === "earth");
};
const semi = (a: WestSign, b: WestSign) => {
  const ea = WEST_ELEMENT[a], eb = WEST_ELEMENT[b];
  return (ea === "fire" && eb === "earth") || (ea === "earth" && eb === "fire") ||
         (ea === "air" && eb === "water") || (ea === "water" && eb === "air");
};
const opposite = (a: WestSign, b: WestSign) => {
  const ea = WEST_ELEMENT[a], eb = WEST_ELEMENT[b];
  return (ea === "fire" && eb === "water") || (ea === "water" && eb === "fire") ||
         (ea === "air" && eb === "earth") || (ea === "earth" && eb === "air");
};
const sameTrine = (a: EastAnimal, b: EastAnimal) => TRINE[a] === TRINE[b];
const mutual = (a: EastAnimal, b: EastAnimal, m: Record<EastAnimal, EastAnimal[]>) =>
  !!(m[a]?.includes(b) && m[b]?.includes(a));

const SEMI_PROMOTED: Array<[WestSign, WestSign]> = [
  ["aquarius", "scorpio"], ["scorpio", "aquarius"],
  ["libra", "pisces"],     ["pisces", "libra"],
  ["gemini", "cancer"],    ["cancer", "gemini"],
  ["aries", "taurus"],     ["taurus", "aries"],
  ["leo", "capricorn"],    ["capricorn", "leo"],
  ["sagittarius", "virgo"],["virgo", "sagittarius"],
];
const isPromotedSemi = (a: WestSign, b: WestSign) =>
  SEMI_PROMOTED.some(([x, y]) => x === a && y === b);

export type ClassifyInput = {
  westA: WestSign;
  eastA: EastAnimal;
  westB: WestSign;
  eastB: EastAnimal;
  requireCnBestForPerfect?: boolean;
  allowSameWestInPerfect?: boolean;
};

export function classify(input: ClassifyInput): { tier: Tier; badges: string[]; tooltip: string } {
  const {
    westA,
    westB,
    eastA,
    eastB,
    requireCnBestForPerfect = true,
    allowSameWestInPerfect = false,
  } = input;

  const badges: string[] = [];
  if (westA === westB) badges.push("Same West");
  if (sameTrine(eastA, eastB)) badges.push("Same Trine");

  if (EAST_OPPOSITE[eastA] === eastB) {
    badges.push("Magnetic Opposites");
    return { tier: "challenging", badges, tooltip: TIER_TOOLTIP["challenging"] };
  }
  if (CN_WORST[eastA] === eastB || CN_WORST[eastB] === eastA) {
    badges.push("CN Worst");
    return { tier: "challenging", badges, tooltip: TIER_TOOLTIP["challenging"] };
  }

  if (sameTrine(eastA, eastB)) {
    const perfectGate =
      sameElement(westA, westB) &&
      (!requireCnBestForPerfect || mutual(eastA, eastB, CN_BEST)) &&
      (allowSameWestInPerfect || westA !== westB);

    if (perfectGate) {
      if (requireCnBestForPerfect) badges.push("CN Best");
      return { tier: "perfect", badges, tooltip: TIER_TOOLTIP["perfect"] };
    }

    if (sameElement(westA, westB)) {
      if (westA === westB) return { tier: "good", badges, tooltip: TIER_TOOLTIP["good"] };
      return { tier: "excellent", badges, tooltip: TIER_TOOLTIP["excellent"] };
    }
    if (compatible(westA, westB)) {
      return { tier: "excellent", badges, tooltip: TIER_TOOLTIP["excellent"] };
    }
    if (semi(westA, westB)) {
      const promoted = isPromotedSemi(westA, westB);
      const tier = promoted ? "excellent" : "good";
      return { tier, badges, tooltip: TIER_TOOLTIP[tier] };
    }
    return { tier: "good", badges, tooltip: TIER_TOOLTIP["good"] };
  }

  const pairKey = (a: EastAnimal, b: EastAnimal) => `${a}-${b}`;
  const COMP_TRINE = new Set([
    "monkey-snake","snake-monkey","dragon-rooster","rooster-dragon",
    "rat-ox","ox-rat","tiger-pig","pig-tiger","horse-goat","goat-horse","dog-rabbit","rabbit-dog"
  ]);
  if (COMP_TRINE.has(pairKey(eastA, eastB))) {
    badges.push("Compatible Trine");
    if (opposite(westA, westB)) return { tier: "fair", badges, tooltip: TIER_TOOLTIP["fair"] };
    return { tier: "good", badges, tooltip: TIER_TOOLTIP["good"] };
  }

  if (mutual(eastA, eastB, CN_BEST) || CN_GOOD[eastA]?.includes(eastB) || CN_GOOD[eastB]?.includes(eastA)) {
    badges.push(mutual(eastA, eastB, CN_BEST) ? "CN Best" : "CN Good");
    if (opposite(westA, westB)) return { tier: "fair", badges, tooltip: TIER_TOOLTIP["fair"] };
    return { tier: "good", badges, tooltip: TIER_TOOLTIP["good"] };
  }

  if (sameElement(westA, westB) || compatible(westA, westB)) {
    return { tier: "fair", badges, tooltip: TIER_TOOLTIP["fair"] };
  }
  if (semi(westA, westB)) {
    return { tier: "fair", badges, tooltip: TIER_TOOLTIP["fair"] };
  }

  if (opposite(westA, westB)) {
    return { tier: "challenging", badges, tooltip: TIER_TOOLTIP["challenging"] };
  }
  return { tier: "fair", badges, tooltip: TIER_TOOLTIP["fair"] };
}

