// src/lib/astrology/chineseAnimals.ts

/**
 * Chinese Zodiac Animals
 * The 12 animals in their traditional order
 */
export type ChineseAnimal =
  | 'Rat'
  | 'Ox'
  | 'Tiger'
  | 'Rabbit'
  | 'Dragon'
  | 'Snake'
  | 'Horse'
  | 'Goat'
  | 'Monkey'
  | 'Rooster'
  | 'Dog'
  | 'Pig';

/**
 * Map each Gregorian year to its Chinese zodiac animal
 * This maps the year when the animal's lunar year BEGINS
 */
export const CHINESE_ANIMAL_BY_YEAR: Record<number, ChineseAnimal> = {
  // 1960s
  1960: 'Rat',
  1961: 'Ox',
  1962: 'Tiger',
  1963: 'Rabbit',
  1964: 'Dragon',
  1965: 'Snake',
  1966: 'Horse',
  1967: 'Goat',
  1968: 'Monkey',
  1969: 'Rooster',
  
  // 1970s
  1970: 'Dog',
  1971: 'Pig',
  1972: 'Rat',
  1973: 'Ox',
  1974: 'Tiger',
  1975: 'Rabbit',
  1976: 'Dragon',
  1977: 'Snake',
  1978: 'Horse',
  1979: 'Goat',
  
  // 1980s
  1980: 'Monkey',
  1981: 'Rooster',
  1982: 'Dog',
  1983: 'Pig',
  1984: 'Rat',
  1985: 'Ox',
  1986: 'Tiger',
  1987: 'Rabbit',
  1988: 'Dragon',
  1989: 'Snake',
  
  // 1990s
  1990: 'Horse',
  1991: 'Goat',
  1992: 'Monkey',
  1993: 'Rooster',
  1994: 'Dog',
  1995: 'Pig',
  1996: 'Rat',
  1997: 'Ox',
  1998: 'Tiger',
  1999: 'Rabbit',
  
  // 2000s
  2000: 'Dragon',
  2001: 'Snake',
  2002: 'Horse',
  2003: 'Goat',
  2004: 'Monkey',
  2005: 'Rooster',
  2006: 'Dog',
  2007: 'Pig',
  2008: 'Rat',
  2009: 'Ox',
  
  // 2010s
  2010: 'Tiger',
  2011: 'Rabbit',
  2012: 'Dragon',
  2013: 'Snake',
  2014: 'Horse',
  2015: 'Goat',
  2016: 'Monkey',
  2017: 'Rooster',
  2018: 'Dog',
  2019: 'Pig',
  
  // 2020s
  2020: 'Rat',
  2021: 'Ox',
  2022: 'Tiger',
  2023: 'Rabbit',
  2024: 'Dragon',
  2025: 'Snake',
  2026: 'Horse',
  2027: 'Goat',
  2028: 'Monkey',
  2029: 'Rooster',
  
  // 2030s
  2030: 'Dog',
  2031: 'Pig',
  2032: 'Rat',
  2033: 'Ox',
  2034: 'Tiger',
  2035: 'Rabbit',
};

/**
 * The 12 animals in order for calculation purposes
 */
export const ANIMALS_IN_ORDER: ChineseAnimal[] = [
  'Rat',
  'Ox',
  'Tiger',
  'Rabbit',
  'Dragon',
  'Snake',
  'Horse',
  'Goat',
  'Monkey',
  'Rooster',
  'Dog',
  'Pig',
];

