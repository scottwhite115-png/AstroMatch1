import type { AstroPeriod, AstroSystem, HoroscopeResult, Sign } from './types';

export interface HoroscopeProvider {
  system: AstroSystem;
  getHoroscope(input: { period: AstroPeriod; sign: Sign; dateISO: string }): Promise<HoroscopeResult>;
}

