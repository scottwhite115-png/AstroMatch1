// lib/astrology/connectionOverview.ts
// Connection overview generator

import type { ChinesePattern } from "./patternLabels";
import type { WestElement, WestModality } from "./westMeta";

export interface OverviewContext {
  pattern: ChinesePattern;
  score: number; // 0–100
  a: { element: WestElement; modality: WestModality };
  b: { element: WestElement; modality: WestModality };
}

/**
 * Very light mapping to avoid obvious fluff.
 * One sentence, vibe only.
 *
 * If you prefer fully hand-written copy, you can:
 * - delete this function
 * - or only use it as a fallback when you have no custom text.
 */
export function generateConnectionOverview(ctx: OverviewContext): string {
  const { pattern, score, a, b } = ctx;

  const isSameElement = a.element === b.element;
  const isSameModality = a.modality === b.modality;

  const compatibleElements: Record<WestElement, WestElement[]> = {
    Fire: ["Air"],
    Air: ["Fire"],
    Earth: ["Water"],
    Water: ["Earth"],
  };

  const opposites: [WestElement, WestElement][] = [
    ["Fire", "Water"],
    ["Water", "Fire"],
    ["Air", "Earth"],
    ["Earth", "Air"],
  ];

  const isCompatibleElement = compatibleElements[a.element].includes(b.element);
  const isOppositeElement = opposites.some(
    ([x, y]) => x === a.element && y === b.element
  );

  const isHighScore = score >= 75;
  const isMidScore = score >= 55 && score < 75;
  const isLowScore = score < 55;

  // --- Base phrases by pattern
  if (pattern === "SAN_HE") {
    if (isHighScore && (isSameElement || isCompatibleElement)) {
      return "Warm, easy-flowing connection with strong natural chemistry and a feeling of being on the same side.";
    }
    if (isMidScore) {
      return "Gentle, cooperative connection that feels supportive, even if life rhythm and priorities sometimes diverge.";
    }
    return "Underlying goodwill and teamwork, with occasional patches where energy or timing feels a bit out of sync.";
  }

  if (pattern === "LIU_HE") {
    if (isHighScore) {
      return "Quietly supportive bond that feels like a built-in ally, with closeness that grows over time.";
    }
    if (isMidScore) {
      return "Soft, companion-style connection with a mix of comfort and distance, depending on mood and timing.";
    }
    return "Subtle, low-drama connection that can feel friendly but a little elusive or inconsistent in depth.";
  }

  if (pattern === "SAME_SIGN") {
    if (isSameElement && isSameModality) {
      return "Intense mirror connection, amplifying shared strengths and quirks in a way that's hard to ignore.";
    }
    return "Strong mirror effect with familiar patterns and habits, bringing both recognition and occasional overload.";
  }

  if (pattern === "LIU_CHONG") {
    if (isOppositeElement || isSameModality) {
      return "Charged, on–off connection with strong pull, sharp edges and recurring flashpoints.";
    }
    if (isMidScore) {
      return "Dynamic, stop–start connection that swings between attraction and irritation, rarely feeling neutral.";
    }
    return "Edgy, restless connection where small differences can snowball into bigger clashes if not given space.";
  }

  if (pattern === "LIU_HAI") {
    if (isLowScore) {
      return "Connection that can feel slowly draining, with minor frictions and mismatched expectations accumulating over time.";
    }
    return "Subtle, slightly tiring connection where goodwill exists but small annoyances can quietly build.";
  }

  if (pattern === "XING") {
    return "Tense, lesson-heavy connection that highlights boundaries, limits and where each person is pushed too far.";
  }

  if (pattern === "PO") {
    return "Intensity that often arrives in bursts, with a tendency toward sharp turns, sudden shifts or clean breaks.";
  }

  // NEUTRAL or anything else
  if (isHighScore) {
    return "Light, flexible connection that can grow in almost any direction depending on what you both choose to build.";
  }
  if (isMidScore) {
    return "Open-ended connection with some spark and some gaps, leaving plenty of room for free choice.";
  }
  return "Gentle, low-pressure connection that may skim the surface unless both people lean in more deliberately.";
}

