// matchWithBlurb.ts - Complete matching with human-readable description

import { scoreMatch, type Person } from "@/lib/simpleMatch";
import { buildBlurb } from "@/lib/buildBlurb";
import type { East } from "@/lib/eastWestHelpers";

/**
 * Generate contextual eastNote based on the relationship type
 */
function generateEastNote(a: Person, b: Person): string {
  const { east: aEast, east: bEast } = a;
  
  // Same animal
  if (aEast === bEast) {
    return "Mirror match — you understand each other's rhythms instantly.";
  }
  
  // Check for trine
  const trines = [
    ["Rat", "Dragon", "Monkey"],
    ["Ox", "Snake", "Rooster"],
    ["Tiger", "Horse", "Dog"],
    ["Rabbit", "Goat", "Pig"],
  ];
  const inTrine = trines.some(t => t.includes(aEast) && t.includes(bEast));
  if (inTrine) {
    return "Kindred rhythm — you 'get' each other fast.";
  }
  
  // Check for secret friends
  const sf: Record<East, East> = {
    Rat: "Ox", Ox: "Rat", Tiger: "Pig", Pig: "Tiger",
    Rabbit: "Dog", Dog: "Rabbit", Dragon: "Rooster", Rooster: "Dragon",
    Snake: "Monkey", Monkey: "Snake", Horse: "Goat", Goat: "Horse"
  };
  if (sf[aEast] === bEast) {
    return "Quiet allies — you stabilize each other naturally.";
  }
  
  // Check for clash
  const clash = new Set(["Rat-Horse", "Ox-Goat", "Tiger-Monkey", "Rabbit-Rooster", "Dragon-Dog", "Snake-Pig"]);
  const isClash = clash.has(`${aEast}-${bEast}`) || clash.has(`${bEast}-${aEast}`);
  if (isClash) {
    return "Magnetic tension — exciting but needs honest communication.";
  }
  
  // Neutral/workable
  return "Different styles that complement when you meet halfway.";
}

/**
 * Generate contextual tip based on elements and tier
 */
function generateTip(a: Person, b: Person, tier: string): string {
  const sameElement = a.element === b.element;
  
  if (tier === "Exceptional" || tier === "Highly Compatible") {
    if (sameElement) {
      return "Keep plans flexible; curiosity is your glue.";
    }
    return "Lean into your differences — they're your strength.";
  }
  
  if (tier === "Balanced") {
    if (a.element === "Fire" || b.element === "Fire") {
      return "Give space for cooldowns; patience builds trust.";
    }
    return "Small daily check-ins prevent big misunderstandings.";
  }
  
  // Challenging
  if (sameElement && a.modality === "Fixed" && b.modality === "Fixed") {
    return "Practice flexibility — being 'right' isn't worth the distance.";
  }
  return "Focus on shared goals; compromise is your superpower here.";
}

/**
 * Complete matching with automatic blurb generation
 */
export function matchWithBlurb(a: Person, b: Person) {
  const { score, tier, east, west, layer } = scoreMatch(a, b);
  
  const eastNote = generateEastNote(a, b);
  const tip = generateTip(a, b, tier);
  
  const blurbLines = buildBlurb({
    tier,
    elementA: a.element,
    elementB: b.element,
    eastA: a.east,
    eastB: b.east,
    eastNote,
    tip,
    score,
  });
  
  return {
    score,
    tier,
    east,
    west,
    layer,
    blurb: blurbLines,
  };
}

/**
 * Example usage:
 * 
 * const result = matchWithBlurb(
 *   { west: "Aquarius", east: "Rat", element: "Air", modality: "Fixed" },
 *   { west: "Gemini", east: "Dragon", element: "Air", modality: "Mutable" }
 * );
 * 
 * console.log(result.blurb);
 * // [
 * //   "Compatibility: Exceptional | Air + Air — fast ideas & easy flow. (Trine Allies — kindred spirits.)",
 * //   "Kindred rhythm — you 'get' each other fast.",
 * //   "Keep plans flexible; curiosity is your glue.",
 * //   "Overall Match: 92 %"
 * // ]
 */


