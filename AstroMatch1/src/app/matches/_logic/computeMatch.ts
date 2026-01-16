// Example: src/app/matches/_logic/computeMatch.ts
import { scorePair } from "@/src/lib/match/engine";
import type { Fusion } from "@/src/lib/match/types";

export function computeForFeed(viewer: Fusion, candidates: Fusion[]) {
  return candidates
    .map(c => ({ candidate: c, result: scorePair(viewer, c) }))
    .sort((a,b) => b.result.score - a.result.score);
}

// UI example: 
// result.rank → pick aura color
// result.theme → one-line under the score

