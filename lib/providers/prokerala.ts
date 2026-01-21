import type { HoroscopeProvider } from '../provider';
import type { AstroPeriod, HoroscopeResult, Sign } from '../types';

// NOTE: Prokerala uses OAuth2 client credentials flow.
// You will implement token fetch + endpoint call here.
export function prokeralaVedicProvider(): HoroscopeProvider {
  return {
    system: 'VEDIC',
    async getHoroscope({ period, sign, dateISO }): Promise<HoroscopeResult> {
      // TODO: Call Prokerala endpoint for horoscope/transit narrative for `sign` + `period` + `dateISO`
      // Return consistent shape.
      return {
        title: `${sign.toUpperCase()} · ${period}`,
        content: `TODO: Prokerala response mapped here for ${sign} (${period}) on ${dateISO}.`,
        source: 'prokerala',
      };
    },
  };
}

