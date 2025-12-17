import type { Tier } from "./labels";

export function tierFromScore(score: number): Tier {
  if (score >= 90) return "perfect";
  if (score >= 75) return "excellent";
  if (score >= 60) return "good";
  if (score >= 45) return "fair";
  return "challenging";
}

