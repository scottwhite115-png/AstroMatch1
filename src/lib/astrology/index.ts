// src/lib/astrology/index.ts

/**
 * Timezone-aware Chinese Zodiac calculation
 * 
 * This module provides accurate Chinese zodiac calculations that properly
 * handle Chinese New Year boundaries across different timezones.
 */

export { getChineseZodiacWithTimeZone, getChineseZodiacSimple } from './getChineseZodiacWithTimeZone';
export type { BirthInput } from './getChineseZodiacWithTimeZone';
export { CHINESE_NEW_YEAR_BEIJING } from './chineseNewYear';
export { CHINESE_ANIMAL_BY_YEAR, ANIMALS_IN_ORDER } from './chineseAnimals';
export type { ChineseAnimal } from './chineseAnimals';

