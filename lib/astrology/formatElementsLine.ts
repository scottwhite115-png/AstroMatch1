// lib/astrology/formatElementsLine.ts

import type { WesternSign } from "./westMeta";
import { getWesternElement, getWesternModality } from "./westMeta";

// Import ChineseElement from the existing chineseZodiac module
export type ChineseElement = "Wood" | "Fire" | "Earth" | "Metal" | "Water";

interface SideForElements {
  westSign: WesternSign;
  chineseElement: ChineseElement; // Year element (Wu Xing)
}

/**
 * Format the complete elements line for the connection box.
 * 
 * Example output:
 *   "Fixed Air / Metal × Mutable Air / Earth"
 * 
 * This combines:
 * - Western modality (Cardinal/Fixed/Mutable)
 * - Western element (Fire/Earth/Air/Water)
 * - Chinese year element (Wood/Fire/Earth/Metal/Water)
 * 
 * @param a - First person's Western sign + Chinese year element
 * @param b - Second person's Western sign + Chinese year element
 * @returns Formatted string showing both sides' modality/element/year-element
 */
export function formatElementsLine(
  a: SideForElements,
  b: SideForElements
): string {
  const aMod = getWesternModality(a.westSign);      // e.g. "Fixed"
  const aElem = getWesternElement(a.westSign);      // e.g. "Air"
  const aChEl = a.chineseElement;                   // e.g. "Metal"

  const bMod = getWesternModality(b.westSign);      // e.g. "Mutable"
  const bElem = getWesternElement(b.westSign);      // e.g. "Air"
  const bChEl = b.chineseElement;                   // e.g. "Earth"

  // Format: "Fixed Air / Metal × Mutable Air / Earth"
  return `${aMod} ${aElem} / ${aChEl} × ${bMod} ${bElem} / ${bChEl}`;
}

