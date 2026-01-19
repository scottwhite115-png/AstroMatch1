// simpleMatch.ts - Streamlined matching engine using modular scoring

import { WEIGHTS, EAST_BASE, WEST_BASE, modalityDelta, quantizeScore, tierOf } from "@/lib/scoringConfig";
import { sameTrine, secretFriends, isClash, areAdjacent, pairKey, Element, East, West } from "@/lib/eastWestHelpers";
import { applyBookOverrides } from "@/lib/applyBookOverrides";

export type Person = { 
  west: West; 
  east: East; 
  element: Element; 
  modality: "Cardinal"|"Fixed"|"Mutable" 
};

export interface MatchResult {
  score: number;
  tier: "Exceptional"|"Highly Compatible"|"Balanced"|"Challenging";
  east: number;
  west: number;
  layer: {
    chemistry: number;
    longTerm: number;
    communication: number;
  };
}

export function scoreMatch(a: Person, b: Person): MatchResult {
  // EAST layer (temperament)
  let east = (() => {
    if (a.east === b.east) return EAST_BASE.sameAnimal;
    if (sameTrine(a.east, b.east)) return EAST_BASE.sameTrine;
    if (secretFriends(a.east, b.east)) return EAST_BASE.secretFriend;
    if (isClash(a.east, b.east)) return EAST_BASE.clash;
    if (areAdjacent(a.east, b.east)) return EAST_BASE.adjacent;
    return EAST_BASE.neutral;
  })();

  // WEST layer (element + tiny modality)
  const k = pairKey(a.element, b.element);
  let west = (WEST_BASE as any)[k] ?? 78; // safe default
  west += modalityDelta(a.modality, b.modality);

  // book-style micro nudges (paraphrased ideas only)
  const layer = applyBookOverrides(
    { west: a.west, east: a.east },
    { west: b.west, east: b.east },
    { chemistry: 0, longTerm: 0, communication: 0 }
  );
  
  // smear nudges into layers tastefully
  east = Math.max(55, Math.min(95, east + 0.6*layer.longTerm + 0.4*layer.chemistry));
  west = Math.max(55, Math.min(95, west + 0.5*layer.communication));

  // blend and quantize so output feels intentional
  const raw = WEIGHTS.east*east + WEIGHTS.west*west;
  const score = quantizeScore(raw);
  const tier = tierOf(score);

  return { score, tier, east, west, layer };
}


