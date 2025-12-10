// lib/astrology/matchEngineCore.ts

// ---- Types ----------------------------------------------------------

export type ChinesePattern =
  | "SAN_HE"     // San He 三合 - Triple Harmony
  | "LIU_HE"     // Liu He 六合 - Secret Friends
  | "SAME_SIGN"  // Same animal sign
  | "NEUTRAL"    // No major pattern
  | "LIU_CHONG"  // 六冲 - Six Conflicts
  | "LIU_HAI"    // 六害 - Six Harms
  | "XING"       // 刑 - Punishment
  | "PO";        // 破 - Break

// High-level Western harmony bucket.
// Map your aspect/element logic into these.
export type WestHarmony =
  | "VERY_HARMONIOUS"   // same element, trine
  | "HARMONIOUS"        // sextile, friendly, compatible elements
  | "MIXED"             // conjunction, same sign, neutral elements
  | "TENSE"             // square, quincunx, awkward
  | "OPPOSITION";       // full opposition, strong tension

export interface MatchInput {
  chinesePattern: ChinesePattern;
  westHarmony: WestHarmony;
}

export interface PatternMeta {
  code: ChinesePattern;
  emoji: string;
  labelEn: string;
  labelZh?: string;
  tagline: string; // explains the Chinese pattern itself
}

export interface MatchResult {
  score: number;          // 0–100 style integer (e.g. 54, 78, etc.)
  pattern: PatternMeta;   // labels + tagline for the Chinese pattern
  connectionOverview: string; // one-line overall vibe
}

// ---- Core constants (Chinese-led bands) -----------------------------

// Base values before we add the small West adjustment
const CHINESE_BASE: Record<ChinesePattern, number> = {
  SAN_HE: 88,     // Triple Harmony · strongest overall
  LIU_HE: 84,     // Secret Friends · very strong
  SAME_SIGN: 78,  // Same animal · strong, but below San He / Liu He
  NEUTRAL: 58,    // Mid-range only

  LIU_CHONG: 44,  // Six Conflicts – clashy/sparky
  LIU_HAI: 42,    // Six Harms – draining / wearing
  XING: 40,       // Punishment – tense, sharp
  PO: 38,         // Break – brittle / unstable
};

// Clamp bands ensure each pattern stays in its lane.
// This is where we enforce things like:
// - Neutral never above 65
// - All conflicts below 50
const CHINESE_BOUNDS: Record<ChinesePattern, [number, number]> = {
  SAN_HE: [84, 96],      // Triple Harmony
  LIU_HE: [80, 92],      // Secret Friends
  SAME_SIGN: [74, 82],   // Same animal
  NEUTRAL: [50, 65],     // Neutral, mid-range only

  LIU_CHONG: [40, 49],   // Six Conflicts (e.g. Monkey–Tiger)
  LIU_HAI: [38, 47],     // Six Harms    (e.g. Monkey–Pig)
  XING: [36, 45],        // Punishment
  PO: [34, 43],          // Break
};

// Small Western adjustment – Chinese still dominates (approx 70/30)
const WEST_DELTAS: Record<WestHarmony, number> = {
  VERY_HARMONIOUS: +5, // same element, trine
  HARMONIOUS: +3,      // sextile, compatible elements
  MIXED: +1,           // conjunction / neutral
  TENSE: -2,           // square / quincunx
  OPPOSITION: -3,      // full opposition
};

// ---- Helpers --------------------------------------------------------

function clampChineseScore(
  pattern: ChinesePattern,
  basePlusWest: number
): number {
  const [min, max] = CHINESE_BOUNDS[pattern];
  return Math.min(max, Math.max(min, basePlusWest));
}

export function getPatternMeta(pattern: ChinesePattern): PatternMeta {
  switch (pattern) {
    case "SAN_HE":
      return {
        code: pattern,
        emoji: "🌟",
        labelEn: "Triple Harmony",
        labelZh: "三合",
        tagline: "Classic trine alliance with strong, long-term harmony.",
      };
    case "LIU_HE":
      return {
        code: pattern,
        emoji: "💫",
        labelEn: "Secret Friends",
        labelZh: "六合",
        tagline: "Close one-to-one bond with a quietly supportive tone.",
      };
    case "SAME_SIGN":
      return {
        code: pattern,
        emoji: "🪞",
        labelEn: "Same Sign",
        labelZh: "同生肖",
        tagline: "Same animal energy; very familiar, can feel like a mirror.",
      };
    case "NEUTRAL":
      return {
        code: pattern,
        emoji: "◽",
        labelEn: "Neutral",
        labelZh: "无显著格局",
        tagline: "No strong harmony or conflict in the Chinese system.",
      };
    case "LIU_CHONG":
      return {
        code: pattern,
        emoji: "⚠️",
        labelEn: "Six Conflicts",
        labelZh: "六冲",
        tagline: "Opposing branches with on–off movement and repeated clashes.",
      };
    case "LIU_HAI":
      return {
        code: pattern,
        emoji: "💔",
        labelEn: "Six Harms",
        labelZh: "六害",
        tagline: "Mixed flow with subtle drains, hurt feelings or wear-and-tear.",
      };
    case "XING":
      return {
        code: pattern,
        emoji: "🔥",
        labelEn: "Punishment",
        labelZh: "刑",
        tagline: "Tense, sharp-edged dynamic with strong emotional reactions.",
      };
    case "PO":
      return {
        code: pattern,
        emoji: "💥",
        labelEn: "Break",
        labelZh: "破",
        tagline: "Stop–start energy with a tendency toward breaks or disruptions.",
      };
  }
}

// Connection overview = one-line vibe for the *whole* match,
// based on pattern + where the score falls in that pattern's band.
export function getConnectionOverview(
  pattern: ChinesePattern,
  score: number
): string {
  switch (pattern) {
    case "SAN_HE":
      if (score >= 92) {
        return "Very strong, flowing harmony with excellent long-term potential.";
      }
      if (score >= 88) {
        return "Steady, supportive harmony with a warm, long-term feel.";
      }
      return "Supportive harmony with some differences in style and rhythm.";

    case "LIU_HE":
      if (score >= 88) {
        return "Close, trusted friend-style bond with strong one-to-one energy.";
      }
      if (score >= 82) {
        return "Supportive, companion-like connection with a personal tone.";
      }
      return "Gentle, friend-like closeness with room to grow over time.";

    case "SAME_SIGN":
      if (score >= 80) {
        return "Strong mirror effect; intense familiarity with amplified traits.";
      }
      if (score >= 76) {
        return "Familiar, same-vibe pairing with a lot of shared patterns.";
      }
      return "Similar instincts; feels recognisable, sometimes almost too similar.";

    case "NEUTRAL":
      if (score >= 62) {
        return "Mid-range connection with flexible potential and open outcomes.";
      }
      if (score >= 56) {
        return "Moderate connection where personality and timing matter most.";
      }
      return "Looser, more open-ended connection without strong pulls either way.";

    case "LIU_CHONG":
      if (score >= 46) {
        return "";
      }
      return "Live-wire chemistry with clashes that can surface quickly.";

    case "LIU_HAI":
      if (score >= 44) {
        return "Uneven flow with warm moments mixed with subtle drains or doubts.";
      }
      return "Sensitive, easily-worn connection where small hurts can add up.";

    case "XING":
      if (score >= 42) {
        return "Edgy, reactive atmosphere with a sharper emotional tone.";
      }
      return "Tense, prickly connection that can feel punishing at times.";

    case "PO":
      if (score >= 40) {
        return "Stop–start feel; effort holds things together against disruptions.";
      }
      return "Fragile, break-prone connection with frequent resets or distance.";
  }
}

// ---- Main entry point -----------------------------------------------

// This is the function you actually call from your match engine.
// You feed in:
// - chinesePattern (from your existing pattern lookup: San He, Liu He, etc.)
// - westHarmony (you classify using your existing aspect/element logic)
// It returns the final score + pattern meta + overview line.
export function computeMatchResult(input: MatchInput): MatchResult {
  const { chinesePattern, westHarmony } = input;

  const base = CHINESE_BASE[chinesePattern];
  const westDelta = WEST_DELTAS[westHarmony];

  const raw = base + westDelta;
  const clamped = clampChineseScore(chinesePattern, raw);
  const score = Math.round(clamped);

  // Debug logging for NEUTRAL pattern
  if (chinesePattern === "NEUTRAL") {
    console.log('[matchEngineCore] NEUTRAL DEBUG:', {
      base,
      westHarmony,
      westDelta,
      raw,
      clamped,
      finalScore: score,
      bounds: CHINESE_BOUNDS[chinesePattern]
    });
  }

  const pattern = getPatternMeta(chinesePattern);
  const connectionOverview = getConnectionOverview(chinesePattern, score);

  return {
    score,
    pattern,
    connectionOverview,
  };
}
