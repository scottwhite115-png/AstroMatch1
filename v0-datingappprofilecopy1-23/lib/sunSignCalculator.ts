// lib/sunSignCalculator.ts
// Utility functions to calculate Tropical (Western) and Sidereal (Vedic) sun signs

export type SunSign = 
  | "Aries" | "Taurus" | "Gemini" | "Cancer" 
  | "Leo" | "Virgo" | "Libra" | "Scorpio" 
  | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces";

export type SunSignSystem = "tropical" | "sidereal";

interface DateRange {
  month: number;
  day: number;
}

// Tropical (Western) Sun Sign Dates - Based on Seasons
const TROPICAL_DATES: Record<SunSign, { start: DateRange; end: DateRange }> = {
  Aries: { start: { month: 3, day: 21 }, end: { month: 4, day: 19 } },
  Taurus: { start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },
  Gemini: { start: { month: 5, day: 21 }, end: { month: 6, day: 20 } },
  Cancer: { start: { month: 6, day: 21 }, end: { month: 7, day: 22 } },
  Leo: { start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
  Virgo: { start: { month: 8, day: 23 }, end: { month: 9, day: 22 } },
  Libra: { start: { month: 9, day: 23 }, end: { month: 10, day: 22 } },
  Scorpio: { start: { month: 10, day: 23 }, end: { month: 11, day: 21 } },
  Sagittarius: { start: { month: 11, day: 22 }, end: { month: 12, day: 21 } },
  Capricorn: { start: { month: 12, day: 22 }, end: { month: 1, day: 19 } },
  Aquarius: { start: { month: 1, day: 20 }, end: { month: 2, day: 18 } },
  Pisces: { start: { month: 2, day: 19 }, end: { month: 3, day: 20 } },
};

// Sidereal (Vedic) Sun Sign Dates - Shifted ~23 days earlier
const SIDEREAL_DATES: Record<SunSign, { start: DateRange; end: DateRange }> = {
  Aries: { start: { month: 4, day: 13 }, end: { month: 5, day: 14 } },
  Taurus: { start: { month: 5, day: 15 }, end: { month: 6, day: 14 } },
  Gemini: { start: { month: 6, day: 15 }, end: { month: 7, day: 16 } },
  Cancer: { start: { month: 7, day: 17 }, end: { month: 8, day: 16 } },
  Leo: { start: { month: 8, day: 17 }, end: { month: 9, day: 16 } },
  Virgo: { start: { month: 9, day: 17 }, end: { month: 10, day: 17 } },
  Libra: { start: { month: 10, day: 18 }, end: { month: 11, day: 16 } },
  Scorpio: { start: { month: 11, day: 17 }, end: { month: 12, day: 15 } },
  Sagittarius: { start: { month: 12, day: 16 }, end: { month: 1, day: 14 } },
  Capricorn: { start: { month: 1, day: 15 }, end: { month: 2, day: 12 } },
  Aquarius: { start: { month: 2, day: 13 }, end: { month: 3, day: 14 } },
  Pisces: { start: { month: 3, day: 15 }, end: { month: 4, day: 12 } },
};

/**
 * Calculate tropical (Western) sun sign from birthdate
 */
export function getTropicalSunSign(month: number, day: number): SunSign {
  return getSunSignFromDates(month, day, TROPICAL_DATES);
}

/**
 * Calculate sidereal (Vedic) sun sign from birthdate
 */
export function getSiderealSunSign(month: number, day: number): SunSign {
  return getSunSignFromDates(month, day, SIDEREAL_DATES);
}

/**
 * Get both tropical and sidereal sun signs from a birthdate
 */
export function getBothSunSigns(month: number, day: number): {
  tropical: SunSign;
  sidereal: SunSign;
} {
  return {
    tropical: getTropicalSunSign(month, day),
    sidereal: getSiderealSunSign(month, day),
  };
}

export function getBothSunSignsFromBirthdate(birthdate?: string | null): {
  tropical: SunSign | null;
  sidereal: SunSign | null;
} {
  if (!birthdate) {
    return { tropical: null, sidereal: null };
  }

  const parts = birthdate.split("-");
  if (parts.length < 3) {
    return { tropical: null, sidereal: null };
  }

  const month = Number.parseInt(parts[1], 10);
  const day = Number.parseInt(parts[2], 10);

  if (Number.isNaN(month) || Number.isNaN(day)) {
    return { tropical: null, sidereal: null };
  }

  return getBothSunSigns(month, day);
}

function updateDisplayedSunSign(system?: SunSignSystem, signsOverride?: { tropical: SunSign | null; sidereal: SunSign | null }) {
  if (typeof window === "undefined") return;

  const signs = signsOverride ?? getSavedSunSigns();
  const preferred = system ?? getSunSignSystem();

  const displaySign = preferred === "sidereal" ? signs.sidereal : signs.tropical;

  if (displaySign) {
    localStorage.setItem("userSunSign", displaySign.toLowerCase());
  }
}

/**
 * Helper function to determine sun sign from date ranges
 */
function getSunSignFromDates(
  month: number,
  day: number,
  dates: Record<SunSign, { start: DateRange; end: DateRange }>
): SunSign {
  for (const [sign, range] of Object.entries(dates)) {
    const { start, end } = range;
    
    // Handle signs that wrap around the year (e.g., Capricorn, Sagittarius)
    if (start.month > end.month) {
      // Sign spans December-January
      if (
        (month === start.month && day >= start.day) ||
        (month === end.month && day <= end.day)
      ) {
        return sign as SunSign;
      }
    } else {
      // Normal case - sign within same year
      if (
        (month === start.month && day >= start.day) ||
        (month === end.month && day <= end.day) ||
        (month > start.month && month < end.month)
      ) {
        return sign as SunSign;
      }
    }
  }
  
  // Fallback (should never reach here with correct date ranges)
  return "Aries";
}

/**
 * Get the sun sign to display based on user's preference
 */
export function getDisplaySunSign(
  tropicalSign: SunSign,
  siderealSign: SunSign,
  preferredSystem: SunSignSystem
): SunSign {
  return preferredSystem === "sidereal" ? siderealSign : tropicalSign;
}

/**
 * Get sun sign system from localStorage
 */
export function getSunSignSystem(): SunSignSystem {
  if (typeof window === "undefined") return "tropical";
  const stored = localStorage.getItem("sunSignSystem");
  return (stored as SunSignSystem) || "tropical";
}

/**
 * Save sun sign system to localStorage
 */
export function setSunSignSystem(system: SunSignSystem): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("sunSignSystem", system);
  updateDisplayedSunSign(system);
}

/**
 * Save both sun signs to localStorage
 */
export function saveSunSigns(tropicalSign: SunSign, siderealSign: SunSign): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("tropicalSunSign", tropicalSign);
  localStorage.setItem("siderealSunSign", siderealSign);
  updateDisplayedSunSign(undefined, { tropical: tropicalSign, sidereal: siderealSign });
}

/**
 * Get both sun signs from localStorage
 */
export function getSavedSunSigns(): { tropical: SunSign | null; sidereal: SunSign | null } {
  if (typeof window === "undefined") return { tropical: null, sidereal: null };
  return {
    tropical: localStorage.getItem("tropicalSunSign") as SunSign | null,
    sidereal: localStorage.getItem("siderealSunSign") as SunSign | null,
  };
}

export { updateDisplayedSunSign };

