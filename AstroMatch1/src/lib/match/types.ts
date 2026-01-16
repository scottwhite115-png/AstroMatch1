// src/lib/match/types.ts
export type West =
  | "aries"|"taurus"|"gemini"|"cancer"|"leo"|"virgo"
  | "libra"|"scorpio"|"sagittarius"|"capricorn"|"aquarius"|"pisces";

export type East =
  | "rat"|"ox"|"tiger"|"rabbit"|"dragon"|"snake"
  | "horse"|"goat"|"monkey"|"rooster"|"dog"|"pig";

export type Rank =
  | "soulmate"|"twin_flame"|"excellent"|"good"|"learning"|"challenging"|"incompatible";

export interface Fusion { west: West; east: East; }

export interface MatchResult {
  score: number;         // 0–100
  rank: Rank;
  reasons: string[];     // brief contributing factors
  theme: string;         // 1-line connection theme
  tags: string[];        // quick filters (e.g., ["air","visionary_trine","trine"])
}

