// src/lib/match/connectionThemes.ts
import elementsData from "@/lib/compat/elements.json";
import trineData from "@/lib/compat/trine.json";
import type { Fusion } from "./types";

// Helper to get element key
function getElementKey(e1: string, e2: string): string {
  const sorted = [e1, e2].sort();
  return `${sorted[0]}-${sorted[1]}`;
}

// Helper to get trine relationship
function getTrineRelation(t1: number, t2: number): string {
  if (t1 === t2) return String(t1);
  return "cross";
}

// Map Western signs to elements
const elementMap: Record<string, string> = {
  aries: "fire", leo: "fire", sagittarius: "fire",
  taurus: "earth", virgo: "earth", capricorn: "earth",
  gemini: "air", libra: "air", aquarius: "air",
  cancer: "water", scorpio: "water", pisces: "water"
};

// Map Chinese signs to trines
const trineMap: Record<string, number> = {
  rat: 1, dragon: 1, monkey: 1,
  ox: 2, snake: 2, rooster: 2,
  tiger: 3, horse: 3, dog: 3,
  rabbit: 4, goat: 4, pig: 4
};

// Check if signs are enemies
const enemyPairs = new Set([
  "rat-horse", "horse-rat",
  "ox-goat", "goat-ox",
  "tiger-monkey", "monkey-tiger",
  "rabbit-rooster", "rooster-rabbit",
  "dragon-dog", "dog-dragon",
  "snake-pig", "pig-snake"
]);

export function getConnectionTheme(user: Fusion, partner: Fusion): string {
  // Get elements
  const userElement = elementMap[user.west] || "fire";
  const partnerElement = elementMap[partner.west] || "fire";
  const elementKey = getElementKey(userElement, partnerElement);
  
  // Get trines
  const userTrine = trineMap[user.east] || 1;
  const partnerTrine = trineMap[partner.east] || 1;
  
  // Check for enemies
  const pairKey = `${user.east}-${partner.east}`;
  const isEnemy = enemyPairs.has(pairKey);
  
  // Get trine relation
  const trineRelation = isEnemy ? "enemies" : getTrineRelation(userTrine, partnerTrine);
  
  // Get element blurb
  const elementBlurb = (elementsData as any).blurbs[elementKey];
  const elementLine = elementBlurb?.summary_line || "";
  
  // Get trine blurb
  const trineBlurb = (trineData as any)[trineRelation];
  const trineLine = trineBlurb?.summary_line || "";
  
  // Combine into a cohesive theme
  if (elementLine && trineLine) {
    // Both have strong descriptions - prioritize the more specific one
    if (trineRelation === "1" || trineRelation === "2" || trineRelation === "3" || trineRelation === "4") {
      // Same trine - this is more specific
      return trineLine;
    } else if (isEnemy) {
      // Enemies - highlight the challenge
      return trineLine;
    } else {
      // Cross-trine - use element as primary
      return elementLine;
    }
  }
  
  // Fallback
  return elementLine || trineLine || "Two hearts meeting under the stars — discover what unfolds.";
}

