// lib/hooks/useSunSign.ts
// React hook to get the correct sun sign to display based on user's preference

'use client';

import { useState, useEffect } from 'react';
import {
  getSunSignSystem,
  getSavedSunSigns,
  getDisplaySunSign,
  getBothSunSigns,
  saveSunSigns,
  type SunSign,
  type SunSignSystem,
} from '@/lib/sunSignCalculator';

/**
 * Hook to get the correct sun sign to display based on user's system preference
 * @param month - Birth month (1-12)
 * @param day - Birth day
 * @returns The sun sign to display based on current system preference
 */
export function useSunSign(month: number | null, day: number | null): SunSign | null {
  const [displaySign, setDisplaySign] = useState<SunSign | null>(null);
  const [system, setSystem] = useState<SunSignSystem>('tropical');

  useEffect(() => {
    if (!month || !day) {
      setDisplaySign(null);
      return;
    }

    // Get current system preference
    const currentSystem = getSunSignSystem();
    setSystem(currentSystem);

    // Try to get saved sun signs first
    const saved = getSavedSunSigns();
    
    if (saved.tropical && saved.sidereal) {
      // Use saved signs
      const sign = getDisplaySunSign(saved.tropical, saved.sidereal, currentSystem);
      setDisplaySign(sign);
    } else {
      // Calculate both signs
      const { tropical, sidereal } = getBothSunSigns(month, day);
      
      // Save them for future use
      saveSunSigns(tropical, sidereal);
      
      // Display the correct one
      const sign = getDisplaySunSign(tropical, sidereal, currentSystem);
      setDisplaySign(sign);
    }

    // Listen for system changes
    const handleSystemChange = () => {
      const newSystem = getSunSignSystem();
      setSystem(newSystem);
      
      // Recalculate display sign
      const signs = getSavedSunSigns();
      if (signs.tropical && signs.sidereal) {
        const sign = getDisplaySunSign(signs.tropical, signs.sidereal, newSystem);
        setDisplaySign(sign);
      } else {
        const { tropical, sidereal } = getBothSunSigns(month, day);
        saveSunSigns(tropical, sidereal);
        const sign = getDisplaySunSign(tropical, sidereal, newSystem);
        setDisplaySign(sign);
      }
    };

    window.addEventListener('sunSignSystemChanged', handleSystemChange);
    
    return () => {
      window.removeEventListener('sunSignSystemChanged', handleSystemChange);
    };
  }, [month, day]);

  return displaySign;
}

/**
 * Hook to get both sun signs for a given birthdate
 * @param month - Birth month (1-12)
 * @param day - Birth day
 * @returns Both tropical and sidereal sun signs
 */
export function useBothSunSigns(month: number | null, day: number | null): {
  tropical: SunSign | null;
  sidereal: SunSign | null;
} {
  const [signs, setSigns] = useState<{ tropical: SunSign | null; sidereal: SunSign | null }>({
    tropical: null,
    sidereal: null,
  });

  useEffect(() => {
    if (!month || !day) {
      setSigns({ tropical: null, sidereal: null });
      return;
    }

    // Try to get saved sun signs first
    const saved = getSavedSunSigns();
    
    if (saved.tropical && saved.sidereal) {
      setSigns(saved);
    } else {
      // Calculate both signs
      const calculated = getBothSunSigns(month, day);
      
      // Save them
      saveSunSigns(calculated.tropical, calculated.sidereal);
      
      setSigns(calculated);
    }
  }, [month, day]);

  return signs;
}

/**
 * Hook to get the current sun sign system preference
 * @returns The current system ('tropical' or 'sidereal')
 */
export function useSunSignSystem(): SunSignSystem {
  const [system, setSystem] = useState<SunSignSystem>('tropical');

  useEffect(() => {
    // Get initial value
    const currentSystem = getSunSignSystem();
    setSystem(currentSystem);

    // Listen for changes
    const handleSystemChange = () => {
      const newSystem = getSunSignSystem();
      setSystem(newSystem);
    };

    window.addEventListener('sunSignSystemChanged', handleSystemChange);
    
    return () => {
      window.removeEventListener('sunSignSystemChanged', handleSystemChange);
    };
  }, []);

  return system;
}

