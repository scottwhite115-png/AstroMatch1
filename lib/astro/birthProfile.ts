// lib/astro/birthProfile.ts

// ----------------- Types -----------------

export type WesternSign =
  | "Aries" | "Taurus" | "Gemini" | "Cancer"
  | "Leo" | "Virgo" | "Libra" | "Scorpio"
  | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces";

export type WesternElement = "Fire" | "Earth" | "Air" | "Water";

export type ChineseAnimal =
  | "Rat" | "Ox" | "Tiger" | "Rabbit" | "Dragon" | "Snake"
  | "Horse" | "Goat" | "Monkey" | "Rooster" | "Dog" | "Pig";

export type WuXingElement = "Wood" | "Fire" | "Earth" | "Metal" | "Water";

export type YinYang = "Yin" | "Yang";

export interface AstroProfile {
  birthDateISO: string;
  // Western
  sunSign: WesternSign;
  sunElement: WesternElement;
  sunGlyph: string;
  // Chinese
  chineseAnimal: ChineseAnimal;
  chineseAnimalEmoji: string;
  chineseElement: WuXingElement;
  chineseYinYang: YinYang;
}

// ----------------- Western zodiac -----------------

const WESTERN_SIGN_DATA: {
  sign: WesternSign;
  start: [number, number]; // [month, day] inclusive
  end: [number, number];   // [month, day] inclusive
  element: WesternElement;
  glyph: string;
}[] = [
  { sign: "Aries",       start: [3, 21], end: [4, 19], element: "Fire",  glyph: "♈️" },
  { sign: "Taurus",      start: [4, 20], end: [5, 20], element: "Earth", glyph: "♉️" },
  { sign: "Gemini",      start: [5, 21], end: [6, 20], element: "Air",   glyph: "♊️" },
  { sign: "Cancer",      start: [6, 21], end: [7, 22], element: "Water", glyph: "♋️" },
  { sign: "Leo",         start: [7, 23], end: [8, 22], element: "Fire",  glyph: "♌️" },
  { sign: "Virgo",       start: [8, 23], end: [9, 22], element: "Earth", glyph: "♍️" },
  { sign: "Libra",       start: [9, 23], end: [10, 22], element: "Air",  glyph: "♎️" },
  { sign: "Scorpio",     start: [10, 23], end: [11, 21], element: "Water", glyph: "♏️" },
  { sign: "Sagittarius", start: [11, 22], end: [12, 21], element: "Fire",  glyph: "♐️" },
  // Capricorn wraps year-end
  { sign: "Capricorn",   start: [12, 22], end: [1, 19], element: "Earth", glyph: "♑️" },
  { sign: "Aquarius",    start: [1, 20], end: [2, 18], element: "Air",    glyph: "♒️" },
  { sign: "Pisces",      start: [2, 19], end: [3, 20], element: "Water",  glyph: "♓️" },
];

function getWesternSign(date: Date): {
  sign: WesternSign;
  element: WesternElement;
  glyph: string;
} {
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate();

  for (const item of WESTERN_SIGN_DATA) {
    const [sm, sd] = item.start;
    const [em, ed] = item.end;

    if (sm <= em) {
      // normal range within same year
      if (
        (m > sm || (m === sm && d >= sd)) &&
        (m < em || (m === em && d <= ed))
      ) {
        return { sign: item.sign, element: item.element, glyph: item.glyph };
      }
    } else {
      // wraps around New Year (Capricorn)
      const inRange =
        (m > sm || (m === sm && d >= sd)) ||
        (m < em || (m === em && d <= ed));
      if (inRange) {
        return { sign: item.sign, element: item.element, glyph: item.glyph };
      }
    }
  }

  // Fallback (should never happen)
  return { sign: "Aquarius", element: "Air", glyph: "♒️" };
}

// ----------------- Chinese New Year boundaries -----------------

/**
 * Start of each Chinese zodiac year (Chinese New Year),
 * from 1948–2031, derived from the ChinaHighlights CNY chart.
 *
 * month is 1–12, day is 1–31.
 */
const CHINESE_NEW_YEAR_BY_YEAR: Record<number, { month: number; day: number }> = {
  1948: { month: 2, day: 10 },
  1949: { month: 1, day: 29 },
  1950: { month: 2, day: 17 },
  1951: { month: 2, day: 6 },
  1952: { month: 1, day: 27 },
  1953: { month: 2, day: 14 },
  1954: { month: 2, day: 3 },
  1955: { month: 1, day: 24 },
  1956: { month: 2, day: 12 },
  1957: { month: 1, day: 31 },
  1958: { month: 2, day: 18 },
  1959: { month: 2, day: 8 },

  1960: { month: 1, day: 28 },
  1961: { month: 2, day: 15 },
  1962: { month: 2, day: 5 },
  1963: { month: 1, day: 25 },
  1964: { month: 2, day: 13 },
  1965: { month: 2, day: 2 },
  1966: { month: 1, day: 21 },
  1967: { month: 2, day: 9 },
  1968: { month: 1, day: 30 },
  1969: { month: 2, day: 17 },
  1970: { month: 2, day: 6 },
  1971: { month: 1, day: 27 },

  1972: { month: 2, day: 15 },
  1973: { month: 2, day: 3 },
  1974: { month: 1, day: 23 },
  1975: { month: 2, day: 11 },
  1976: { month: 1, day: 31 },
  1977: { month: 2, day: 18 },
  1978: { month: 2, day: 7 },
  1979: { month: 1, day: 28 }, // Goat starts
  1980: { month: 2, day: 16 }, // Monkey starts
  1981: { month: 2, day: 5 },
  1982: { month: 1, day: 25 },
  1983: { month: 2, day: 13 },

  1984: { month: 2, day: 2 },
  1985: { month: 2, day: 19 },
  1986: { month: 2, day: 9 },
  1987: { month: 1, day: 29 },
  1988: { month: 2, day: 17 },
  1989: { month: 2, day: 6 },
  1990: { month: 1, day: 27 },
  1991: { month: 2, day: 15 },
  1992: { month: 2, day: 4 },
  1993: { month: 1, day: 23 },
  1994: { month: 2, day: 10 },
  1995: { month: 1, day: 30 },

  1996: { month: 2, day: 19 },
  1997: { month: 2, day: 7 },
  1998: { month: 1, day: 28 },
  1999: { month: 2, day: 16 },
  2000: { month: 2, day: 5 },
  2001: { month: 1, day: 24 },
  2002: { month: 2, day: 12 },
  2003: { month: 2, day: 1 },
  2004: { month: 1, day: 22 },
  2005: { month: 2, day: 9 },
  2006: { month: 1, day: 29 },
  2007: { month: 2, day: 17 },

  2008: { month: 2, day: 7 },
  2009: { month: 1, day: 26 },
  2010: { month: 2, day: 14 },
  2011: { month: 2, day: 3 },
  2012: { month: 1, day: 23 },
  2013: { month: 2, day: 10 },
  2014: { month: 1, day: 31 },
  2015: { month: 2, day: 19 },
  2016: { month: 2, day: 8 },
  2017: { month: 1, day: 28 },
  2018: { month: 2, day: 16 },
  2019: { month: 2, day: 4 },

  2020: { month: 1, day: 25 },
  2021: { month: 2, day: 12 },
  2022: { month: 2, day: 1 },
  2023: { month: 1, day: 22 },
  2024: { month: 2, day: 10 },
  2025: { month: 1, day: 29 },
  2026: { month: 2, day: 17 },
  2027: { month: 2, day: 6 },
  2028: { month: 1, day: 26 },
  2029: { month: 2, day: 13 },
  2030: { month: 2, day: 3 },
  2031: { month: 1, day: 22 },
};

function getChineseZodiacYear(date: Date): number {
  const year = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate();

  const cny = CHINESE_NEW_YEAR_BY_YEAR[year];

  // If we don't have a table entry (older than 1948 / later than 2031),
  // fall back to simple "year boundary" behaviour.
  if (!cny) return year;

  const isOnOrAfterNewYear =
    m > cny.month || (m === cny.month && d >= cny.day);

  // Before CNY ⇒ still previous zodiac year.
  return isOnOrAfterNewYear ? year : year - 1;
}

// ----------------- Chinese animal, element, yin/yang -----------------

const CHINESE_ANIMALS_IN_ORDER: ChineseAnimal[] = [
  "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake",
  "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig",
];

const CHINESE_ANIMAL_EMOJI: Record<ChineseAnimal, string> = {
  Rat: "🐀",
  Ox: "🐂",
  Tiger: "🐅",
  Rabbit: "🐇",
  Dragon: "🐉",
  Snake: "🐍",
  Horse: "🐎",
  Goat: "🐐",
  Monkey: "🐒",
  Rooster: "🐓",
  Dog: "🐕",
  Pig: "🐖",
};

// Heavenly stems map nicely to Wu Xing + Yin/Yang.
// Standard mapping: index = (year - 4) mod 10.
const STEM_ELEMENTS: WuXingElement[] = [
  "Wood", "Wood",
  "Fire", "Fire",
  "Earth", "Earth",
  "Metal", "Metal",
  "Water", "Water",
];

const STEM_YIN_YANG: YinYang[] = [
  "Yang", "Yin",
  "Yang", "Yin",
  "Yang", "Yin",
  "Yang", "Yin",
  "Yang", "Yin",
];

function getChineseAnimalAndStemInfo(date: Date): {
  animal: ChineseAnimal;
  element: WuXingElement;
  yinYang: YinYang;
} {
  const zodiacYear = getChineseZodiacYear(date);

  // 1900 was a Rat year; keep cycle anchored there.
  const animalIndex = ((zodiacYear - 1900) % 12 + 12) % 12;
  const animal = CHINESE_ANIMALS_IN_ORDER[animalIndex];

  // Heavenly stem element + yin/yang based on zodiacYear.
  const stemIndex = ((zodiacYear - 4) % 10 + 10) % 10;
  const element = STEM_ELEMENTS[stemIndex];
  const yinYang = STEM_YIN_YANG[stemIndex];

  return { animal, element, yinYang };
}

// ----------------- Public API -----------------

export function buildAstroProfileFromISO(isoDate: string): AstroProfile | null {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return null;
  return buildAstroProfile(date);
}

export function buildAstroProfile(date: Date): AstroProfile {
  const { sign, element: sunElement, glyph } = getWesternSign(date);
  const {
    animal,
    element: chineseElement,
    yinYang: chineseYinYang,
  } = getChineseAnimalAndStemInfo(date);

  return {
    birthDateISO: date.toISOString().slice(0, 10),
    sunSign: sign,
    sunElement,
    sunGlyph: glyph,
    chineseAnimal: animal,
    chineseAnimalEmoji: CHINESE_ANIMAL_EMOJI[animal],
    chineseElement,
    chineseYinYang,
  };
}
















