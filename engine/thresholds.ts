import type { Tier } from "./labels";

export function tierFromScore(score: number): Tier {
  if (score >= 95) return "Soulmate";
  if (score >= 85) return "Twin Flame";
  if (score >= 75) return "Excellent";
  if (score >= 60) return "Favourable";
  if (score >= 50) return "Neutral";
  if (score >= 35) return "Six Conflicts";
  return "Difficult";
}

