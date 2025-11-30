// lib/chineseElements.ts

import type { ChineseElement } from "./chineseZodiac";

export type ElementRelation = "same" | "supportive" | "challenging" | "neutral";

const SHENG_PAIRS: [ChineseElement, ChineseElement][] = [
  ["Wood", "Fire"],
  ["Fire", "Earth"],
  ["Earth", "Metal"],
  ["Metal", "Water"],
  ["Water", "Wood"],
];

const KE_PAIRS: [ChineseElement, ChineseElement][] = [
  ["Wood", "Earth"],
  ["Earth", "Water"],
  ["Water", "Fire"],
  ["Fire", "Metal"],
  ["Metal", "Wood"],
];

function isPair(
  a: ChineseElement,
  b: ChineseElement,
  list: [ChineseElement, ChineseElement][]
): boolean {
  return list.some(
    ([x, y]) =>
      (x === a && y === b) ||
      (x === b && y === a)
  );
}

export function getElementRelation(
  a: ChineseElement,
  b: ChineseElement
): ElementRelation {
  if (a === b) return "same";
  if (isPair(a, b, SHENG_PAIRS)) return "supportive";
  if (isPair(a, b, KE_PAIRS)) return "challenging";
  return "neutral";
}

export function getElementPairLine(
  a: ChineseElement,
  b: ChineseElement
): { heading: string; description: string } {
  const relation = getElementRelation(a, b);

  let heading: string;
  let description: string;

  if (relation === "same") {
    heading = `${a} + ${b} — Same element`;
    description =
      "Strong resonance; you tend to understand each other's pace and priorities, but intensity needs balance.";
  } else if (relation === "supportive") {
    heading = `${a} + ${b} — Supportive 生 (Shēng)`;
    description =
      `${a} feeds ${b}, adding flow, teamwork, and momentum to the connection.`;
  } else if (relation === "challenging") {
    heading = `${a} + ${b} — Challenging 克 (Kè)`;
    description =
      `${a} and ${b} check and push each other, bringing tests that can lead to growth if handled maturely.`;
  } else {
    heading = `${a} + ${b} — Neutral`;
    description =
      "No strong help or clash from the elements; other parts of the match do more of the work.";
  }

  return { heading, description };
}

