// lib/matchEngine/chineseSameSignBand.ts

export type ChineseAnimal =
  | "Rat"
  | "Ox"
  | "Tiger"
  | "Rabbit"
  | "Dragon"
  | "Snake"
  | "Horse"
  | "Goat"
  | "Monkey"
  | "Rooster"
  | "Dog"
  | "Pig";

export type WesternElement = "Fire" | "Earth" | "Air" | "Water";

export type ElementRelationship = "same" | "compatible" | "semi" | "clash";

/**
 * Classify how two Western elements relate.
 * Adjust this mapping if your existing engine uses a slightly different scheme.
 */
export function getElementRelationship(
  a: WesternElement,
  b: WesternElement
): ElementRelationship {
  if (a === b) return "same";

  // Compatible pairs
  const compatiblePairs: [WesternElement, WesternElement][] = [
    ["Fire", "Air"],
    ["Air", "Fire"],
    ["Earth", "Water"],
    ["Water", "Earth"],
  ];

  if (compatiblePairs.some(([x, y]) => (x === a && y === b))) {
    return "compatible";
  }

  // Semi-compatible (soft friction but workable)
  const semiPairs: [WesternElement, WesternElement][] = [
    ["Fire", "Earth"],
    ["Earth", "Fire"],
    ["Air", "Water"],
    ["Water", "Air"],
  ];

  if (semiPairs.some(([x, y]) => (x === a && y === b))) {
    return "semi";
  }

  // Everything else we treat as clash / opposing
  return "clash";
}

/**
 * Apply the fixed band for SAME CHINESE ANIMAL pairs.
 *
 * Rules you confirmed:
 * - Same animal + same element        → 68%
 * - Same animal + compatible element  → 65%
 * - Same animal + semi-compatible     → 62%
 * - Same animal + opposing/clashing   → 58%
 *
 * This function returns the updated *final* score.
 */
export function applySameChineseSignBand(params: {
  baseScore: number; // whatever your engine computed before this step
  chineseA: ChineseAnimal;
  chineseB: ChineseAnimal;
  elementA: WesternElement;
  elementB: WesternElement;
  // Optional: if you already tag San He / Liu He, pass it in so we *don't* override those
  chinesePattern?: "SAN_HE" | "LIU_HE" | "LIU_CHONG" | "LIU_HAI" | "XING" | "PO" | "NONE";
}): number {
  const {
    baseScore,
    chineseA,
    chineseB,
    elementA,
    elementB,
    chinesePattern = "NONE",
  } = params;

  // Only apply this band when it's actually a same-animal pair
  if (chineseA !== chineseB) return baseScore;

  // Do NOT override explicit San He / Liu He / conflict tags
  if (chinesePattern === "SAN_HE" || chinesePattern === "LIU_HE") {
    return baseScore;
  }
  if (
    chinesePattern === "LIU_CHONG" ||
    chinesePattern === "LIU_HAI" ||
    chinesePattern === "XING" ||
    chinesePattern === "PO"
  ) {
    return baseScore;
  }

  const rel = getElementRelationship(elementA, elementB);

  const sameAnimalScoreMap: Record<ElementRelationship, number> = {
    same: 68,
    compatible: 65,
    semi: 62,
    clash: 58,
  };

  const overrideScore = sameAnimalScoreMap[rel];

  return overrideScore;
}

