// src/lib/astrology/getChineseZodiacWithTimeZone.ts

import { DateTime } from 'luxon';
import { CHINESE_NEW_YEAR_BEIJING } from './chineseNewYear';
import { CHINESE_ANIMAL_BY_YEAR, ChineseAnimal } from './chineseAnimals';

/**
 * Input for timezone-aware Chinese zodiac calculation
 */
export interface BirthInput {
  isoDateTime: string; // e.g. '1980-02-16T21:55'
  timeZone: string;    // e.g. 'Australia/Sydney'
}

/**
 * Calculate Chinese zodiac animal with proper timezone handling
 * 
 * This function:
 * 1. Parses the birth moment in the user's timezone
 * 2. Converts to UTC for comparison
 * 3. Gets the Chinese New Year moment in Beijing time (UTC+8)
 * 4. Compares the UTC timestamps to determine the correct animal
 * 
 * @example
 * // Born Feb 16, 1980 at 9:55 PM in Sydney
 * const animal = getChineseZodiacWithTimeZone({
 *   isoDateTime: '1980-02-16T21:55',
 *   timeZone: 'Australia/Sydney',
 * });
 * // Returns: 'Monkey' (born after CNY in Beijing)
 * 
 * @param input - Birth date, time, and timezone
 * @returns The Chinese zodiac animal
 */
export function getChineseZodiacWithTimeZone(
  input: BirthInput
): ChineseAnimal {
  const { isoDateTime, timeZone } = input;

  // 1. Birth moment in the person's local timezone
  const birthLocal = DateTime.fromISO(isoDateTime, { zone: timeZone });
  if (!birthLocal.isValid) {
    throw new Error(`Invalid birth datetime or timezone: ${isoDateTime} in ${timeZone}`);
  }

  const gregYear = birthLocal.year;

  const cnyStr = CHINESE_NEW_YEAR_BEIJING[gregYear];
  if (!cnyStr) {
    // Fallback to simple calculation for years not in our table
    console.warn(`Chinese New Year not defined for year ${gregYear}, using fallback`);
    return fallbackCalculation(gregYear);
  }

  // 2. CNY moment in Beijing (Asia/Shanghai, +08:00)
  const cnyBeijing = DateTime.fromISO(cnyStr, { setZone: true });
  if (!cnyBeijing.isValid) {
    throw new Error(`Invalid CNY timestamp for year ${gregYear}: ${cnyStr}`);
  }

  // 3. Compare instants in UTC to avoid timezone illusions
  const birthUtc = birthLocal.toUTC();
  const cnyUtc = cnyBeijing.toUTC();

  // If born BEFORE the CNY instant → previous Zodiac year
  const zodiacYear = birthUtc < cnyUtc ? gregYear - 1 : gregYear;

  const animal = CHINESE_ANIMAL_BY_YEAR[zodiacYear];
  if (!animal) {
    throw new Error(`Chinese animal not defined for year ${zodiacYear}`);
  }

  return animal;
}

/**
 * Fallback calculation using simplified year-based logic
 * Used when exact CNY date is not available
 */
function fallbackCalculation(year: number): ChineseAnimal {
  const animals: ChineseAnimal[] = [
    'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
    'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
  ];
  
  // 1900 was year of the Rat (index 0)
  const index = (year - 1900) % 12;
  return animals[(index + 12) % 12]; // Ensure positive index
}

/**
 * Simple version that only requires a date (assumes midnight in user's timezone)
 * Useful for onboarding when we might not have exact birth time
 */
export function getChineseZodiacSimple(
  birthDate: string,  // e.g. '1980-02-16'
  timeZone: string = 'UTC'
): ChineseAnimal {
  return getChineseZodiacWithTimeZone({
    isoDateTime: `${birthDate}T00:00:00`,
    timeZone,
  });
}

