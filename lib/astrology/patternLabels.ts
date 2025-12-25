// lib/astrology/patternLabels.ts

export type ChinesePattern =
  | "SAN_HE"
  | "LIU_HE"
  | "SAME_SIGN"
  | "NEUTRAL"
  | "LIU_CHONG"
  | "LIU_HAI"
  | "XING"
  | "PO";

/**
 * Short label used in the small pill, before the score.
 * Returns English translation phrase only (Chinese symbols handled separately).
 * Example:
 *   "Triple Harmony 三合 · 87%"
 */
export function getPatternPillLabel(pattern: ChinesePattern): string {
  switch (pattern) {
    case "SAN_HE":
      return "Soulmate Match";
    case "LIU_HE":
      return "Secret Friends Match";
    case "SAME_SIGN":
      return "Same Sign";
    case "NEUTRAL":
      return "Neutral";
    case "LIU_CHONG":
      return "Magnetic Opposites";
    case "LIU_HAI":
      return "Challenging Match";
    case "XING":
      return "Punishment";
    case "PO":
      return "Break";
    default:
      return "Neutral"; // Default to Neutral for any undefined or unknown patterns
  }
}

/**
 * Returns just the Chinese characters for the pattern.
 * Used to display alongside the English translation.
 */
export function getPatternChineseSymbol(pattern: ChinesePattern): string {
  switch (pattern) {
    case "SAN_HE":
      return "三合";
    case "LIU_HE":
      return "六合";
    case "SAME_SIGN":
      return "";
    case "NEUTRAL":
      return "";
    case "LIU_CHONG":
      return "六冲";
    case "LIU_HAI":
      return "六害";
    case "XING":
      return "刑";
    case "PO":
      return "破";
    default:
      return "";
  }
}

/**
 * Header label for the connection box pattern title.
 * This appears next to the score.
 *
 * e.g. "Six Conflicts 六冲", "Triple Harmony 三合", "Neutral 无显著格局"
 */
export function getPatternHeaderLabel(pattern: ChinesePattern): string {
  switch (pattern) {
    case "SAN_HE":
      return "Triple Harmony 三合";
    case "LIU_HE":
      return "Six Harmonies 六合";
    case "SAME_SIGN":
      return "Same Sign";
    case "NEUTRAL":
      return "Neutral 中";
    case "LIU_CHONG":
      return "Six Conflicts 六冲";
    case "LIU_HAI":
      return "Six Harms 六害";
    case "XING":
      return "Punishment 刑";
    case "PO":
      return "Break 破";
    default:
      return "Neutral 中";
  }
}

/**
 * Optional icon per pattern (feel free to change or remove).
 */
export function getPatternIcon(pattern: ChinesePattern): string {
  switch (pattern) {
    case "SAN_HE":
      return "🌟";
    case "LIU_HE":
      return "💫";
    case "SAME_SIGN":
      return "✨";
    case "NEUTRAL":
      return "◽";
    case "LIU_CHONG":
      return "⚠️";
    case "LIU_HAI":
      return "🌀";
    case "XING":
      return "⚔️";
    case "PO":
      return "💥";
    default:
      return "◽";
  }
}

/**
 * Short educational tagline explaining the Chinese structure.
 * This sits directly under the % header.
 */
export function getPatternTagline(pattern: ChinesePattern | "NO_PATTERN"): string {
  // Handle NO_PATTERN as alias for NEUTRAL (from matchEngine)
  if (pattern === "NO_PATTERN") {
    pattern = "NEUTRAL";
  }
  
  switch (pattern) {
    case "SAN_HE":
      return "High natural harmony and shared rhythm; when you're aligned, this connection moves fast and far.";
    case "LIU_HE":
      return "Quietly strong bond that feels safe, loyal, and steady when you choose each other.";
    case "SAME_SIGN":
      return "Mirror-match energy with strong familiarity and shared habits; comforting, but not automatically harmonious.";
    case "NEUTRAL":
      return "No classical pattern; the vibe depends more on personal charts, timing, and your Western signs.";
    case "LIU_CHONG":
      return "Magnetic opposites with sharp edges; big lessons, not automatic comfort.";
    case "LIU_HAI":
      return "Sensitive pattern where small misreads can snowball; this match needs extra patience and very clear communication.";
    case "XING":
      return "Tension and sharp edges; situations can feel strict or demanding.";
    case "PO":
      return "This bond tends to disrupt old patterns; growth is possible but rarely feels easy or predictable.";
    default:
      return "No classical pattern; the vibe depends more on personal charts, timing, and your Western signs.";
  }
}

/**
 * Convenience: full pattern header line without score.
 * You can prepend icon or append % as you like.
 */
export function getPatternHeaderText(pattern: ChinesePattern): string {
  const icon = getPatternIcon(pattern);
  const label = getPatternHeaderLabel(pattern);
  return `${icon} ${label}`;
}

/**
 * Prefix for the big connection box heading, before the score.
 *
 * Examples (after you append " · 87%"):
 *   "San He 三合 · Triple Harmony"
 *   "Liu He 六合 · Six Harmonies"
 *   "Liu Chong 六冲 · Six Conflicts"
 *   "Neutral · No Strong Pattern"
 */
export function getPatternHeadingPrefix(pattern: ChinesePattern): string {
  switch (pattern) {
    case "SAN_HE":
      // best-case Chinese pattern
      return "San He 三合 · Triple Harmony";

    case "LIU_HE":
      // softer, ally-style pattern
      return "Liu He 六合 · Six Harmonies";

    case "SAME_SIGN":
      // same Chinese animal – intense mirror vibe
      return "Same Sign · Mirror Match";

    case "NEUTRAL":
      // no strong classical Chinese pattern
      return "Neutral · No Strong Pattern";

    case "LIU_CHONG":
      // clash / conflict pattern
      return "Liu Chong 六冲 · Six Conflicts";

    case "LIU_HAI":
      // "six harms" – steady irritation
      return "Liu Hai 六害 · Hidden Harms";

    case "XING":
      // punishment style entanglement
      return "Xing 刑 · Punishment Pattern";

    case "PO":
      // rupture / break pattern
      return "Po 破 · Break & Rupture";
      
    default:
      // Default to Neutral for any undefined or unknown patterns
      return "Neutral · No Strong Pattern";
  }
}

/**
 * Helper if you want the fully formatted heading in one go.
 * Example:
 *   getPatternHeading("SAN_HE", 87)
 *   → "San He 三合 · Triple Harmony · 87%"
 */
export function getPatternHeading(
  pattern: ChinesePattern,
  score: number
): string {
  return `${getPatternHeadingPrefix(pattern)} · ${Math.round(score)}%`;
}
