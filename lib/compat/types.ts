import type { ChinesePatternType } from "@/lib/chinesePatternSystem";
import type { Tier } from "@/engine/labels";

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

// Type aliases for compatibility
export type SunSign = WestSign;
export type Animal = EastSign;

export interface UserAstro {
  west_sign: WestSign;
  east_sign: EastSign;
  element: Element;   // derived from west_sign (store on profile)
  trine: TrineId;     // derived from east_sign (store on profile)
  gender?: Gender;    // optional
}

// User profile interface with astrology data
export interface UserProfile {
  sunSign: SunSign;  // e.g. "aquarius"
  animal: Animal;    // e.g. "monkey"
}

// Western zodiac pair information
export interface WesternPairInfo {
  relationKey: "same_element" | "compatible" | "semi_compatible" | "opposites" | "mismatch";
  label: string;        // "Compatible (Air + Fire)", "Same Element (Fire + Fire)", etc.
  elementA: string;     // "Air"
  elementB: string;     // "Fire"
  // Extended fields for engine use (not in base interface but present in data)
  intro?: string;        // 1–2 sentences
  dynamics?: string;     // 1–2 sentences
  growth?: string;      // 1–2 sentences
}

// Pattern metadata for Chinese zodiac patterns
export interface PatternMeta {
  key: string;          // "san_he", "liu_he", "liu_chong", "liu_hai", "xing", "po", "friendly"
  label: string;        // "Liu He (六合)"
  translation: string;  // "Six Harmonies"
  headlineTag: string;  // "Supportive Pair", "Opposing Pair", etc.
  // Extended fields for engine use (not in base interface but present in data)
  blurbHint?: string;    // sentence/mini-paragraph to weave into the Overview
  tone?: "very_supportive" | "supportive" | "conflict" | "harmful" | "punishment" | "break" | "neutral";
}

// Pattern key type
export type PatternKey =
  | "san_he"
  | "same_trine"
  | "same_animal"
  | "liu_he"
  | "liu_chong"
  | "liu_hai"
  | "xing"
  | "po"
  | "friendly";

// Chinese zodiac pair information
export interface ChinesePairInfo {
  primaryPattern: PatternKey; // "san_he" | "liu_he" | "liu_chong" | "liu_hai" | "xing" | "po" | "friendly"
}

// Animal metadata with labels
export interface AnimalMeta {
  label_en: string;     // "Monkey"
}

// ConnectionBoxTop - simplified top-level display information
export interface ConnectionBoxTop {
  headingLine: string;  // e.g. "Soulmate Match · 95%"
  pairLine: string;     // "Aquarius/Monkey × Sagittarius/Rabbit"
  chineseLine: string;  // "Monkey × Rabbit — Liu He (六合) "Six Harmonies" Supportive Pair"
  westernLine: string;  // "Aquarius × Sagittarius — Compatible (Air + Fire)"
  score: number;        // numeric if you need it separately
  matchLabel: string;   // label alone if needed
}

// Simplified ConnectionBox interface for new implementation
export interface SimpleConnectionBox {
  matchLabel: string;          // e.g. "Soulmate Match"
  score: number;               // e.g. 95
  headingLine: string;         // "Soulmate Match · 95%"
  pairLine: string;            // "Aquarius/Monkey × Sagittarius/Rabbit"
  chineseLine: string;         // "Monkey × Rabbit — Liu He (六合) "Six Harmonies / Six Harmoniess" (Cross-Trine)"
  chineseDescription?: string; // Pattern-specific description paragraph
  chineseTagline?: string;     // NEW: Tagline from detailed compatibility (e.g. "Action and antics")
  westernSignLine: string;     // "Aquarius × Pisces — Dreamy and imaginative; Aquarius thinks in systems..."
  westernLine: string;         // "Aquarius × Pisces — Air–Water (semi-compatible)"
  westernDescription?: string; // Western element meaning line
  westernTagline?: string;     // NEW: Tagline from detailed compatibility (e.g. "Systems and ideas")
  wuXingLine?: string;         // Optional Wu Xing (Five Elements) harmony line
  overview: string;            // blended paragraph
  // Pattern fields for taglines and star ratings
  chinesePattern?: import('@/src/lib/matchEngine').ChinesePattern;
  westAspect?: import('@/src/lib/matchEngine').WestAspect;
  westElementRelation?: import('@/src/lib/matchEngine').WestElementRelation;
  isChineseOpposite?: boolean;
  isLivelyPair?: boolean;
  // NEW: Match engine result fields for photo carousel pill
  pillLabel?: string;              // e.g. "92% · Triple Harmony"
  pattern?: import('@/lib/matchEngine').ChinesePattern; // For gradient lookup
  patternFullLabel?: string;       // e.g. "🌟 San He 三合 · Triple Harmony · 92%"
  baseTagline?: string;            // Pattern-specific tagline
  patternEmoji?: string;           // Pattern emoji (e.g. "🌟")
  chemistryStars?: number;         // Chemistry star rating (0-5)
  stabilityStars?: number;         // Stability star rating (0-5)
  // NEW: matchEngineCore fields
  patternLabelEn?: string;         // e.g. "Triple Harmony"
  patternLabelZh?: string;         // e.g. "三合"
  patternTagline?: string;         // e.g. "Classic trine alliance with strong, long-term harmony."
  connectionOverview?: string;     // e.g. "Very strong, flowing harmony with excellent long-term potential."
}

// Original ConnectionBox interface (kept for backward compatibility)
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