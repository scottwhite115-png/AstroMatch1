// lib/applyChineseNuance.ts
// Fast lookup for pre-computed Chinese zodiac nuance
import nuanceMatrix from "@/data/chinese_nuance_matrix.json";

export type East = 
  | "Rat" | "Ox" | "Tiger" | "Rabbit" | "Dragon" | "Snake"
  | "Horse" | "Goat" | "Monkey" | "Rooster" | "Dog" | "Pig";

export interface ChineseNuanceResult {
  chem: number;   // chemistry delta (±15)
  long: number;   // long-term delta (±12)
  tone: "great" | "good" | "mixed" | "hard";
  notes: string[]; // 2 human-readable insights
}

/**
 * Fast O(1) lookup of pre-computed Chinese zodiac nuance
 * @param aEast - First person's Eastern zodiac animal
 * @param bEast - Second person's Eastern zodiac animal
 * @returns Nuance data with chemistry, long-term, tone, and notes
 */
export function applyChineseNuance(aEast: string, bEast: string): ChineseNuanceResult {
  const key = `${aEast}-${bEast}`;
  const entry = (nuanceMatrix as any)[key];
  
  if (!entry) {
    // Fallback for invalid inputs
    return {
      chem: 0,
      long: 0,
      tone: "mixed",
      notes: [
        "Different strengths that can fit well.",
        "Care and clarity keep it strong."
      ]
    };
  }
  
  return entry as ChineseNuanceResult;
}

/**
 * Get all nuance data for a specific animal (useful for profile displays)
 * @param animal - The Eastern zodiac animal
 * @returns Object with all pairings for this animal
 */
export function getAllPairingsFor(animal: East): Record<East, ChineseNuanceResult> {
  const result = {} as Record<East, ChineseNuanceResult>;
  const animals: East[] = ["Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat","Monkey","Rooster","Dog","Pig"];
  
  for (const other of animals) {
    result[other] = applyChineseNuance(animal, other);
  }
  
  return result;
}

/**
 * Get the top N most compatible animals for a given animal
 * @param animal - The Eastern zodiac animal
 * @param limit - Number of top matches to return (default: 5)
 * @returns Array of [animal, score] tuples sorted by compatibility
 */
export function getTopMatches(animal: East, limit: number = 5): Array<[East, number]> {
  const pairings = getAllPairingsFor(animal);
  const animals: East[] = ["Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat","Monkey","Rooster","Dog","Pig"];
  
  return animals
    .filter(a => a !== animal) // exclude self
    .map(a => [a, pairings[a].long + pairings[a].chem] as [East, number])
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

