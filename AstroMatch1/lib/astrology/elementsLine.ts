// lib/astrology/elementsLine.ts
// Sign combo + elements formatting

import { getWesternElement, getWesternModality, type WesternSign } from "./westMeta";

export type ChineseAnimal =
  | "RAT"
  | "OX"
  | "TIGER"
  | "RABBIT"
  | "DRAGON"
  | "SNAKE"
  | "HORSE"
  | "GOAT"
  | "MONKEY"
  | "ROOSTER"
  | "DOG"
  | "PIG";

export type ChineseElement = "Wood" | "Fire" | "Earth" | "Metal" | "Water";

export interface SideForLabels {
  westSign: WesternSign;      // e.g. "AQUARIUS"
  westLabel: string;          // e.g. "Aquarius"
  chineseAnimal: ChineseAnimal;
  chineseLabel: string;       // e.g. "Monkey"
  chineseElement: ChineseElement;
}

/**
 * e.g. "Aquarius / Monkey × Gemini / Goat"
 */
export function formatSignComboLine(a: SideForLabels, b: SideForLabels): string {
  return `${a.westLabel} / ${a.chineseLabel} × ${b.westLabel} / ${b.chineseLabel}`;
}

/**
 * e.g. "Fixed Air / Metal × Mutable Air / Earth"
 */
export function formatElementsLine(a: SideForLabels, b: SideForLabels): string {
  const aMod = getWesternModality(a.westSign);
  const aElem = getWesternElement(a.westSign);
  const aChEl = a.chineseElement;

  const bMod = getWesternModality(b.westSign);
  const bElem = getWesternElement(b.westSign);
  const bChEl = b.chineseElement;

  return `${aMod} ${aElem} / ${aChEl} × ${bMod} ${bElem} / ${bChEl}`;
}

