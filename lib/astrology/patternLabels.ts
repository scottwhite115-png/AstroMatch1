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

export type ChineseOverlayPattern = 'LIU_CHONG' | 'LIU_HAI' | 'XING' | 'PO';

export type ConnectionArchetype =
  | 'TRIPLE_HARMONY'   // San He
  | 'SUPPORTIVE_ALLY'  // Liu He
  | 'OPPOSITES'        // Liu Chong
  | 'LESSON_REPAIR'    // Hai / Xing / Po only
  | 'MIRROR'           // Same sign
  | 'OPEN_PATTERN';    // No big pattern

/**
 * Helper to check for damage overlays
 */
export function hasDamageOverlay(
  overlays: ChineseOverlayPattern[]
): boolean {
  return overlays.some(o => o === 'LIU_HAI' || o === 'XING' || o === 'PO');
}

/**
 * Helper to check for self-punishment
 */
export function hasSelfPunishment(
  pattern: ChinesePattern,
  overlays: ChineseOverlayPattern[]
): boolean {
  return pattern === 'SAME_SIGN' && overlays.includes('XING');
}

/**
 * Short label used in the small pill, before the score.
 * Returns English translation phrase only (Chinese symbols handled separately).
 * Example:
 *   "Triple Harmony 三合 · 87%"
 */
export function getPatternPillLabel(pattern: ChinesePattern): string {
  switch (pattern) {
    case "SAN_HE":
      return "Triple Harmony";
    case "LIU_HE":
      return "Six Harmonies";
    case "SAME_SIGN":
      return "Same Sign";
    case "NEUTRAL":
      return "Neutral";
    case "LIU_CHONG":
      return "Six Conflicts";
    case "LIU_HAI":
      return "Six Harms";
    case "XING":
      return "Punishment";
    case "PO":
      return "Breakpoint";
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
 * This sits directly under the match pill.
 */
export function getPatternTagline(
  pattern: ChinesePattern | "NO_PATTERN",
  overlays?: ChineseOverlayPattern[]
): string {
  // Handle NO_PATTERN as alias for NEUTRAL (from matchEngine)
  if (pattern === "NO_PATTERN") {
    pattern = "NEUTRAL";
  }
  
  const overlayArray = overlays || [];
  const hasLiuChong = overlayArray.includes('LIU_CHONG');
  const hasDamage = hasDamageOverlay(overlayArray);
  const selfPunish = hasSelfPunishment(pattern, overlayArray);

  // Magnetic Opposites / Six Conflicts
  if (hasLiuChong) {
    return 'Strong, opposite-style spark between very different types – exciting, vivid, and rarely boring.';
  }

  switch (pattern) {
    case "SAN_HE":
      // Soulmate / San He
      return "Two souls moving in perfect rhythm – effortless harmony and shared purpose.";
    case "LIU_HE":
      // Secret Friends / Six Harmonies
      return "Quiet, loyal connection that feels safe to lean on and good in everyday life.";
    case "SAME_SIGN":
      // Same Sign (Chinese)
      if (selfPunish) {
        return 'Familiar mirror where the same scenes repeat until one of you finally changes the script.';
      }
      return 'Mirror-like connection where you recognise your own strengths and blind spots in each other.';
    case "LIU_HAI":
      // Challenging Match (Six Harms specifically)
      return 'Lesson-heavy connection where attraction is mixed with extra tests and tension.';
    case "XING":
    case "PO":
      // Other challenging patterns
      return 'Lesson-heavy connection where attraction is mixed with extra tests and tension.';
    case "NEUTRAL":
    default:
      // Check if there's damage on a neutral base
      if (hasDamage) {
        return 'Lesson-heavy connection where attraction is mixed with extra tests and tension.';
      }
      // Pure neutral, no damage
      return 'Open-ended, easygoing connection that mostly becomes what you make of it together.';
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
