export type AstroPeriod = 'DAILY' | 'WEEKLY' | 'MONTHLY';
export type AstroSystem = 'VEDIC' | 'WESTERN_TROPICAL' | 'WESTERN_SIDEREAL';

export type Sign =
  | 'aries' | 'taurus' | 'gemini' | 'cancer' | 'leo' | 'virgo'
  | 'libra' | 'scorpio' | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

export type HoroscopeResult = {
  title?: string;
  content: string;
  source?: string;
};

