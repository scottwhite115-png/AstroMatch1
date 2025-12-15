// lib/astrology/westMeta.ts
// Western elements + modalities

export type WesternSign =
  | "ARIES"
  | "TAURUS"
  | "GEMINI"
  | "CANCER"
  | "LEO"
  | "VIRGO"
  | "LIBRA"
  | "SCORPIO"
  | "SAGITTARIUS"
  | "CAPRICORN"
  | "AQUARIUS"
  | "PISCES";

export type WestElement = "Fire" | "Earth" | "Air" | "Water";
export type WestModality = "Cardinal" | "Fixed" | "Mutable";

export const WEST_SIGN_META: Record<
  WesternSign,
  { element: WestElement; modality: WestModality }
> = {
  // Cardinal
  ARIES:      { element: "Fire",  modality: "Cardinal" },
  CANCER:     { element: "Water", modality: "Cardinal" },
  LIBRA:      { element: "Air",   modality: "Cardinal" },
  CAPRICORN:  { element: "Earth", modality: "Cardinal" },

  // Fixed
  TAURUS:     { element: "Earth", modality: "Fixed" },
  LEO:        { element: "Fire",  modality: "Fixed" },
  SCORPIO:    { element: "Water", modality: "Fixed" },
  AQUARIUS:   { element: "Air",   modality: "Fixed" },

  // Mutable
  GEMINI:     { element: "Air",   modality: "Mutable" },
  VIRGO:      { element: "Earth", modality: "Mutable" },
  SAGITTARIUS:{ element: "Fire",  modality: "Mutable" },
  PISCES:     { element: "Water", modality: "Mutable" },
};

export function getWesternElement(sign: WesternSign): WestElement {
  return WEST_SIGN_META[sign].element;
}

export function getWesternModality(sign: WesternSign): WestModality {
  return WEST_SIGN_META[sign].modality;
}

/**
 * Helper to normalize capitalized sign names (e.g. "Aries") to uppercase enum ("ARIES")
 */
export function normalizeWesternSign(sign: string): WesternSign {
  return sign.toUpperCase() as WesternSign;
}
