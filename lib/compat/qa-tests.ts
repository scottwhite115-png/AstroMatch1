/**
 * Quick QA Tests for New Compatibility Engine
 * Run these to verify the engine is working correctly
 */

import { buildCompatibilityBox, getRank, deriveElement, deriveTrine } from "./engine";
import type { UserAstro } from "./types";

// Test cases from the provided checklist
const tests = [
  {
    name: "Scorpio Dragon × Scorpio Dragon",
    a: { west_sign: "scorpio" as const, east_sign: "dragon" as const, element: "water" as const, trine: 1 as const },
    b: { west_sign: "scorpio" as const, east_sign: "dragon" as const, element: "water" as const, trine: 1 as const },
    expectedRank: 5,
    expectedLabel: "Excellent Match",
  },
  {
    name: "Taurus Ox × Aquarius Snake",
    a: { west_sign: "taurus" as const, east_sign: "ox" as const, element: "earth" as const, trine: 2 as const },
    b: { west_sign: "aquarius" as const, east_sign: "snake" as const, element: "air" as const, trine: 2 as const },
    expectedRank: 4,
    expectedLabel: "Great Match",
  },
  {
    name: "Aquarius Monkey × Gemini Rat",
    a: { west_sign: "aquarius" as const, east_sign: "monkey" as const, element: "air" as const, trine: 1 as const },
    b: { west_sign: "gemini" as const, east_sign: "rat" as const, element: "air" as const, trine: 1 as const },
    expectedRank: 5,
    expectedLabel: "Excellent Match",
  },
  {
    name: "Leo Tiger × Aries Rat",
    a: { west_sign: "leo" as const, east_sign: "tiger" as const, element: "fire" as const, trine: 3 as const },
    b: { west_sign: "aries" as const, east_sign: "rat" as const, element: "fire" as const, trine: 1 as const },
    expectedRank: 3,
    expectedLabel: "Good Match",
  },
  {
    name: "Virgo Ox × Libra Horse",
    a: { west_sign: "virgo" as const, east_sign: "ox" as const, element: "earth" as const, trine: 2 as const },
    b: { west_sign: "libra" as const, east_sign: "horse" as const, element: "air" as const, trine: 3 as const },
    expectedRank: 2,
    expectedLabel: "Needs Work",
  },
  {
    name: "Aries Rat × Cancer Horse (ENEMIES)",
    a: { west_sign: "aries" as const, east_sign: "rat" as const, element: "fire" as const, trine: 1 as const },
    b: { west_sign: "cancer" as const, east_sign: "horse" as const, element: "water" as const, trine: 3 as const },
    expectedRank: 1,
    expectedLabel: "Challenging",
  },
];

// Run tests
export function runQATests() {
  console.log("🧪 Running Compatibility Engine QA Tests...\n");
  
  let passed = 0;
  let failed = 0;

  tests.forEach((test, idx) => {
    const rank = getRank(test.a, test.b);
    const box = buildCompatibilityBox(test.a, test.b);
    
    const rankMatch = rank === test.expectedRank;
    const labelMatch = box.label === test.expectedLabel;
    
    if (rankMatch && labelMatch) {
      console.log(`✅ Test ${idx + 1}: ${test.name}`);
      console.log(`   Rank: ${rank} (${box.label})`);
      console.log(`   Trine: ${box.trine.heading}`);
      console.log(`   Element: ${box.element.heading}\n`);
      passed++;
    } else {
      console.log(`❌ Test ${idx + 1}: ${test.name}`);
      console.log(`   Expected: Rank ${test.expectedRank} (${test.expectedLabel})`);
      console.log(`   Got: Rank ${rank} (${box.label})`);
      console.log(`   Trine: ${box.trine.heading}`);
      console.log(`   Element: ${box.element.heading}\n`);
      failed++;
    }
  });

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${tests.length} tests`);
  return { passed, failed, total: tests.length };
}

// Helper function to create UserAstro from sign strings
export function createUserAstro(westSign: string, eastSign: string): UserAstro {
  return {
    west_sign: westSign.toLowerCase() as any,
    east_sign: eastSign.toLowerCase() as any,
    element: deriveElement(westSign),
    trine: deriveTrine(eastSign),
  };
}


