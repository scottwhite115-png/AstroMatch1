export type WestSign =
  | "aries" | "taurus" | "gemini" | "cancer" | "leo" | "virgo"
  | "libra" | "scorpio" | "sagittarius" | "capricorn" | "aquarius" | "pisces";

export type Element = "fire" | "earth" | "air" | "water";

export type EastSign =
  | "rat" | "ox" | "tiger" | "rabbit" | "dragon" | "snake"
  | "horse" | "goat" | "monkey" | "rooster" | "dog" | "pig";

export type TrineId = 1 | 2 | 3 | 4;

export type Gender = "male" | "female" | "nonbinary" | "unspecified";

export type Rank = 1 | 2 | 3 | 4 | 5;

export interface UserAstro {
  west_sign: WestSign;
  east_sign: EastSign;
  element: Element;   // derived from west_sign (store on profile)
  trine: TrineId;     // derived from east_sign (store on profile)
  gender?: Gender;    // optional
}

import type { Tier } from "@/engine/labels";

export interface ConnectionBox {
  rating: Rank;
  label: string;         // e.g. "Excellent"
  fusion: string;        // rank-based intro line
  score?: number;        // 0-100 percentage score
  newRank?: string;      // New engine rank (e.g., "excellent", "soulmate")
  theme?: string;        // New engine theme/tagline
  emoji?: string;        // Rank emoji from new engine
  tier: Tier;

  // --- SUMMARY (for compact Connection Box)
  summary: {
    chinese_heading: string;   // e.g., "Monkey × Rat — Same Trine: Visionaries"
    chinese_line: string;      // e.g., "Natural understanding and shared rhythm …"
    western_heading: string;   // e.g., "Aquarius × Gemini — Same Element: Air × Air"
    western_line: string;      // e.g., "A meeting of minds …"
  };

  // --- DROPDOWN (expanded content)
  dropdown: {
    chinese: {
      heading: string;         // same as summary heading
      expanded: string;        // 2–4 sentences narrative paragraph
      love_tip: string;
      watch_tip: string;
    };
    western: {
      heading: string;         // same as summary heading
      expanded: string;        // 2–4 sentences narrative paragraph
      nurture_tip: string;
      caution_tip: string;
    };
  };
}