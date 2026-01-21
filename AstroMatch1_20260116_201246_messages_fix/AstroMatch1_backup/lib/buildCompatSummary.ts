import type { MatchScore, Person } from "@/lib/engine";
import { chineseNuance } from "@/data/chineseNuance";
import { applyBookOverrides } from "@/lib/applyBookOverrides";
import type { West, East } from "@/data/newAstrologyOverrides";

export type CompatSummary = {
  coreVibe: number; chemistry: number; communication: number;
  lifestyle: number; longTerm: number; growth: number;
};

const clamp = (n:number, lo=55, hi=96)=>Math.max(lo, Math.min(hi, Math.round(n)));

// Apply Chinese zodiac nuance adjustments based on comprehensive pair data
function applyChineseNuance(a: Person, b: Person, scores: CompatSummary): CompatSummary {
  const key = `${a.east}-${b.east}`;
  const rev = `${b.east}-${a.east}`;
  const entry = chineseNuance[key] || chineseNuance[rev];
  
  if (entry) {
    // Map chemistry delta to our chemistry score
    scores.chemistry += entry.chem;
    
    // Map long-term delta to longTerm score
    scores.longTerm += entry.long;
    
    // Also influence lifestyle based on long-term compatibility
    // (pairs that work long-term usually have compatible lifestyles)
    scores.lifestyle += Math.round(entry.long * 0.5);
    
    // High chemistry pairs need extra communication work
    if (entry.chem >= 10) {
      scores.communication -= 2; // high spark can overshadow communication needs
    }
    
    // Challenging pairs (negative long-term) need growth focus
    if (entry.long < 0) {
      scores.growth += 3; // more room and need for growth
    }
  }
  
  return scores;
}

export function buildCompatSummary(a: Person, b: Person, r: MatchScore): CompatSummary {
  const reasons = r.reasons.join(" ");
  const W = r.breakdown.western, E = r.breakdown.eastern, score = r.score;

  const airAir     = /Western:\s*[A-Za-z]+\s*\(Air,.*\)\s*×\s*[A-Za-z]+\s*\(Air,/.test(reasons);
  const fixedPair  = /Fixed.*×.*Fixed/.test(reasons);
  const mutablePair= /Mutable.*×.*Mutable/.test(reasons);
  const eastTrine  = /same trine/i.test(reasons);
  const eastClash  = /clash/i.test(reasons);

  const coreVibe = clamp(score);

  let chemistry = W + (airAir ? 2 : 0) + (eastTrine ? 2 : 0) - (eastClash ? 4 : 0);
  let communication = (W + score) / 2 + (airAir ? 2 : 0) - (fixedPair ? 1 : 0);
  let lifestyle = (E + score) / 2 + (mutablePair ? 1 : 0) + (eastTrine ? 2 : 0) - (eastClash ? 4 : 0);
  let longTerm = (score * 0.6 + lifestyle * 0.4) - (eastClash ? 3 : 0) - (fixedPair ? 1 : 0);
  let growth = (score + communication + lifestyle) / 3 + (mutablePair ? 2 : 0) - (eastClash ? 2 : 0);

  let summary: CompatSummary = {
    coreVibe: clamp(coreVibe),
    chemistry: clamp(chemistry),
    communication: clamp(communication),
    lifestyle: clamp(lifestyle),
    longTerm: clamp(longTerm),
    growth: clamp(growth),
  };

  // Apply comprehensive Chinese zodiac nuance adjustments
  summary = applyChineseNuance(a, b, summary);

  // Apply book-based astrology overrides for specific sign combinations
  const bookAdjusted = applyBookOverrides(
    { west: a.west as West, east: a.east as East },
    { west: b.west as West, east: b.east as East },
    {
      chemistry: summary.chemistry,
      longTerm: summary.longTerm,
      communication: summary.communication
    }
  );
  summary.chemistry = bookAdjusted.chemistry;
  summary.longTerm = bookAdjusted.longTerm;
  summary.communication = bookAdjusted.communication;

  // Re-clamp after adjustments
  return {
    coreVibe: clamp(summary.coreVibe),
    chemistry: clamp(summary.chemistry),
    communication: clamp(summary.communication),
    lifestyle: clamp(summary.lifestyle),
    longTerm: clamp(summary.longTerm),
    growth: clamp(summary.growth),
  };
}


