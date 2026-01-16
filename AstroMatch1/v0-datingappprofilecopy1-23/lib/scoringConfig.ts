// scoringConfig.ts - Core scoring parameters and utility functions

// Chinese temperament carries a bit more weight than Western element
export const WEIGHTS = {
  east: 0.6,   // Chinese layer (trines/secret-friend/clash/adjacent)
  west: 0.4,   // Western layer (elements + tiny modality)
};

// East base bands — easy to reason about:
export const EAST_BASE = {
  sameTrine: 88,        // kindred spirits, day-to-day ease
  secretFriend: 86,     // quiet affinity
  clash: 64,            // attraction + friction, needs care
  adjacent: 78,         // neighbors on 12-year cycle
  sameAnimal: 82,       // like-with-like: quick bond + blind spots
  neutral: 80,          // workable default
};

// West base by element pairing (no jargon, very readable)
export const WEST_BASE = {
  "Air-Air": 88, "Fire-Fire": 86, "Water-Water": 82, "Earth-Earth": 82,
  "Air-Fire": 85, "Water-Earth": 85,
  "Fire-Earth": 74, "Air-Earth": 72, "Air-Water": 70, "Fire-Water": 68,
};

// Tiny modality nudges (keep these small)
export function modalityDelta(aMod: "Cardinal"|"Fixed"|"Mutable", bMod: "Cardinal"|"Fixed"|"Mutable") {
  if (aMod === "Fixed" && bMod === "Fixed") return -3;
  if (aMod === "Mutable" && bMod === "Mutable") return +2;
  if ((aMod === "Cardinal" && bMod === "Mutable") || (aMod === "Mutable" && bMod === "Cardinal")) return +1;
  return 0;
}

// Score rounding so numbers look intentional, not random.
export function quantizeScore(x: number) {
  // Map to neat steps users can remember
  // 96, 94, 92, 90, 88, 86, 84, 82, 80, 78, 76, 74, 72, 70, 68, 66, 64
  const STEPS = [96,94,92,90,88,86,84,82,80,78,76,74,72,70,68,66,64];
  const clamp = (v:number,min:number,max:number)=>Math.max(min,Math.min(max,v));
  const v = clamp(Math.round(x), 64, 96); // keep outcomes realistic
  let best = STEPS[0], diff = Infinity;
  for (const s of STEPS) { const d = Math.abs(s - v); if (d < diff) { diff = d; best = s; } }
  return best;
}

// Tier labels that align with the steps
export function tierOf(score: number): "Exceptional"|"Highly Compatible"|"Balanced"|"Challenging" {
  if (score >= 90) return "Exceptional";
  if (score >= 80) return "Highly Compatible";
  if (score >= 70) return "Balanced";
  return "Challenging";
}


