// /lib/matchEngine.config.ts
// Match Engine Configuration - Rules and Settings

export interface ChineseOppositesConfig {
  enabled: boolean;
  pairs: [string, string][];
  stability_penalty?: number; // Optional: can be negative for penalty or positive for bonus
  bonus?: number; // Bonus for opposite Chinese signs (polarity attraction)
  spark_bonus_if_west_opposite: number;
  cap_after_spark: number;
  overrides?: Array<{
    a: string;
    b: string;
    spark_bonus_if_west_opposite?: number;
    stability_penalty?: number;
    bonus?: number;
  }>;
}

export interface WesternOppositesConfig {
  enabled: boolean;
  pairs: [string, string][];
  bonus?: number; // Bonus for opposite Western signs
}

export interface SameWesternSignConfig {
  enabled: boolean;
  score_delta_default: number;
  score_delta_if_same_chinese_trine: number;
  score_delta_if_same_chinese_animal: number;
  score_softened_if_strong_east?: number;  // optional nuance
  tier_caps: {
    default_max_score: number;
    if_same_chinese_trine: number;
    if_same_chinese_animal: number;
  };
}

export interface MatchEngineConfig {
  rules: {
    chinese_opposites: ChineseOppositesConfig;
    opposite_western_signs: WesternOppositesConfig;
    same_western_sign: SameWesternSignConfig;
  };
}

export const engineConfig: MatchEngineConfig = {
  rules: {
    chinese_opposites: {
      enabled: true,
      // The six traditional clash (opposite) pairs
      pairs: [
        ["Rat", "Horse"],
        ["Ox", "Goat"],
        ["Tiger", "Monkey"],
        ["Rabbit", "Rooster"],
        ["Dragon", "Dog"],
        ["Snake", "Pig"]
      ],

      // Bonus for opposite Chinese signs (polarity attraction)
      bonus: 6, // Increased bonus for opposite Chinese signs (magnetic opposites)

      // Optional stability penalty (can be negative for penalty or omitted)
      // stability_penalty: -8,  // Removed - now using bonus instead

      // Optional short-term chemistry: only if Western Suns are opposite
      // (i.e., both polarities line up → spark, but still capped)
      spark_bonus_if_west_opposite: 6, // increased spark bonus

      // Guardrails so clashes never read as top-tier romances
      cap_after_spark: 95,            // increased cap to allow higher scores for magnetic opposites

      // Per-pair overrides if you want a bit more/less spark on specific clashes
      overrides: [
        { a: "Tiger", b: "Monkey", bonus: 6, spark_bonus_if_west_opposite: 6 }, // Magnetic opposites
        { a: "Dragon", b: "Dog", bonus: 6, spark_bonus_if_west_opposite: 6 }, // Magnetic opposites
        // Add more specific overrides as needed
      ]
    },
    opposite_western_signs: {
      enabled: true,
      // The six Western zodiac opposite pairs
      pairs: [
        ["Aries", "Libra"],
        ["Taurus", "Scorpio"],
        ["Gemini", "Sagittarius"],
        ["Cancer", "Capricorn"],
        ["Leo", "Aquarius"],
        ["Virgo", "Pisces"]
      ],
      bonus: 4 // Small bonus for opposite Western signs (polarity attraction)
    },
    same_western_sign: {
      enabled: true,
      score_delta_default: -4,
      score_delta_if_same_chinese_trine: -6,
      score_delta_if_same_chinese_animal: -9,
      score_softened_if_strong_east: -2,  // optional nuance
      // Prevent inflated Soulmate tier
      tier_caps: {
        default_max_score: 94,
        if_same_chinese_trine: 84,
        if_same_chinese_animal: 100
      }
    }
  }
};

// Helper function to check if two Chinese signs are opposites
export function isChineseOpposite(a: string, b: string, pairs: [string, string][]): boolean {
  return pairs.some(([x, y]) => (a === x && b === y) || (a === y && b === x));
}

// Helper function to get override for a specific pair
export function getChineseOppositeOverride(
  a: string,
  b: string,
  overrides: { a: string; b: string; spark_bonus_if_west_opposite?: number; stability_penalty?: number; bonus?: number }[]
): { a: string; b: string; spark_bonus_if_west_opposite?: number; stability_penalty?: number; bonus?: number } | undefined {
  return overrides.find(o => (o.a === a && o.b === b) || (o.a === b && o.b === a));
}

