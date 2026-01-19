// Chinese Zodiac Pair Nuances (Generated from nuanceEngine)
// Based on traditional public-domain astrology patterns + original interpretations

import { computeChineseNuance, type East } from "@/lib/nuanceEngine";

export type ChineseNuanceEntry = {
  chem: number;
  long: number;
  note: string;
};

// Generate all 144 combinations dynamically
const ANIMALS: East[] = ["Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat","Monkey","Rooster","Dog","Pig"];

// Build the full nuance map on module load
export const chineseNuance: Record<string, ChineseNuanceEntry> = {};

for (const a of ANIMALS) {
  for (const b of ANIMALS) {
    const result = computeChineseNuance(a, b, "unspecified");
    const key = `${a}-${b}`;
    chineseNuance[key] = {
      chem: result.chem,
      long: result.long,
      note: result.notes.join(" ")
    };
  }
}

// Export the compute function for dynamic polarity-aware calculations
export { computeChineseNuance } from "@/lib/nuanceEngine";
