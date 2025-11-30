// /data/scoreOverrides.ts
// Manual score overrides for specific high-compatibility pairings
// Format: "sign_animal|sign_animal": { s: score, t: tier, f: flags }
// Flags: 1=sameTrine, 2=sameWestSign, 4=sameEastSign, 16=compatible, 32=synergy

export interface ScoreOverride {
  s: number;  // score (0-100)
  t: number;  // tier (5=soulmate, 4=twin_flame, 3=excellent)
  f: number;  // bitfield flags
}

export const SCORE_OVERRIDES: Record<string, ScoreOverride> = {
  // Tier 5: Soulmate (95-100)
  "aquarius_monkey|aquarius_monkey": { s: 100, t: 5, f: 1+2+4+16 },  // Same signs + same trine
  "aquarius_monkey|gemini_rat":      { s: 96,  t: 5, f: 4+32 },      // Same east trine + synergy
  "libra_dragon|pisces_dragon":      { s: 94,  t: 5, f: 1+32 },      // Same trine + synergy
  "capricorn_ox|virgo_snake":        { s: 93,  t: 5, f: 32 },        // High synergy
  "taurus_rabbit|cancer_sheep":      { s: 92,  t: 5, f: 4+32 },      // Compatible + synergy
  "scorpio_dragon|aquarius_monkey":  { s: 91,  t: 5, f: 0 },         // Raw compatibility
  "aries_rat|leo_monkey":            { s: 90,  t: 5, f: 4+32 },      // Same trine + synergy
  "gemini_rat|libra_monkey":         { s: 90,  t: 5, f: 4+16 },      // Compatible elements
  "pisces_pig|scorpio_snake":        { s: 90,  t: 5, f: 32 },        // Strong synergy

  // Tier 4: Twin Flame (85-89)
  "leo_dragon|sagittarius_tiger":    { s: 91,  t: 4, f: 16 },        // CORRECTED: Cross-trine, Fire×Fire compatible
  "aquarius_monkey|leo_rat":         { s: 88,  t: 4, f: 4+32 },      // Cross-trine synergy
  "aries_dragon|sagittarius_rat":    { s: 87,  t: 4, f: 4+16 },      // Compatible fire/air
  "cancer_rabbit|pisces_sheep":      { s: 86,  t: 4, f: 4+16 },      // Compatible water/earth

  // Tier 3: Excellent (70-84)
  "taurus_ox|virgo_ox":              { s: 83,  t: 3, f: 1+16 },      // Same element + trine
  "libra_monkey|aquarius_monkey":    { s: 82,  t: 3, f: 4+16 },      // Same east + compatible
};

// Helper to check if a pair has an override
export function getScoreOverride(pairId: string): ScoreOverride | null {
  // Try both directions
  const direct = SCORE_OVERRIDES[pairId];
  if (direct) return direct;
  
  // Try reversed
  const [a, b] = pairId.split('|');
  if (!a || !b) return null;
  const reversed = SCORE_OVERRIDES[`${b}|${a}`];
  return reversed || null;
}

// Helper to create pair ID (normalized)
export function createOverridePairId(westA: string, eastA: string, westB: string, eastB: string): string {
  const a = `${westA.toLowerCase()}_${eastA.toLowerCase()}`;
  const b = `${westB.toLowerCase()}_${eastB.toLowerCase()}`;
  // Sort alphabetically for consistent lookups
  return a <= b ? `${a}|${b}` : `${b}|${a}`;
}

