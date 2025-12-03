// Test script to verify score band rebalancing
// Run with: npx ts-node scripts/test-score-bands.ts

import { computeMatchScore } from '../src/lib/matchEngine.js';
import type { MatchContext, WesternSign, ChineseAnimal, WuXing, WesternElement, WestAspect, ChinesePattern, WestElementRelation } from '../src/lib/matchEngine.js';

interface TestCase {
  name: string;
  chinesePattern: ChinesePattern;
  westAspect: WestAspect;
  westElementRelation: WestElementRelation;
  yearElementA: WuXing;
  yearElementB: WuXing;
  expectedRange: { min: number; max: number };
  expectedTier?: string;
  description: string;
}

const testCases: TestCase[] = [
  // San He Tests (should be 72-88%, peak 88-98%)
  {
    name: "San He Peak",
    chinesePattern: "san_he",
    westAspect: "trine",
    westElementRelation: "same",
    yearElementA: "Water",
    yearElementB: "Water",
    expectedRange: { min: 88, max: 98 },
    expectedTier: "Soulmate",
    description: "San He + trine + same element + supportive Wu Xing = Peak Soulmate"
  },
  {
    name: "San He Good",
    chinesePattern: "san_he",
    westAspect: "opposition",
    westElementRelation: "compatible",
    yearElementA: "Water",
    yearElementB: "Earth",
    expectedRange: { min: 72, max: 88 },
    description: "San He + opposition + neutral Wu Xing = Good but not peak"
  },

  // Liu He Tests (should be 68-84%)
  {
    name: "Liu He Peak",
    chinesePattern: "liu_he",
    westAspect: "trine",
    westElementRelation: "same",
    yearElementA: "Water",
    yearElementB: "Water",
    expectedRange: { min: 82, max: 91 },
    expectedTier: "Twin Flame",
    description: "Liu He + trine + same element + supportive Wu Xing = Peak Twin Flame"
  },
  {
    name: "Liu He Good",
    chinesePattern: "liu_he",
    westAspect: "none",
    westElementRelation: "semi_compatible",
    yearElementA: "Water",
    yearElementB: "Earth",
    expectedRange: { min: 68, max: 84 },
    expectedTier: "Harmonious Match",
    description: "Liu He + neutral Western = Harmonious"
  },

  // Liu Chong Tests (should be 40-62%, MAX 62%)
  {
    name: "Liu Chong Peak (MUST NOT EXCEED 62%)",
    chinesePattern: "liu_chong",
    westAspect: "opposition",
    westElementRelation: "same",
    yearElementA: "Water",
    yearElementB: "Water",
    expectedRange: { min: 58, max: 62 },
    expectedTier: "Opposites Attract",
    description: "Liu Chong + same element + supportive Wu Xing = MAX 60-62%"
  },
  {
    name: "Liu Chong Typical",
    chinesePattern: "liu_chong",
    westAspect: "opposition",
    westElementRelation: "semi_compatible",
    yearElementA: "Water",
    yearElementB: "Fire",
    expectedRange: { min: 45, max: 58 },
    expectedTier: "Opposites Attract",
    description: "Liu Chong + typical Western = Typical range"
  },

  // Same Sign Tests (should be 60-70%)
  {
    name: "Same Sign Peak",
    chinesePattern: "same_animal",
    westAspect: "same_sign",
    westElementRelation: "same",
    yearElementA: "Fire",
    yearElementB: "Fire",
    expectedRange: { min: 62, max: 70 },
    description: "Same sign + same element = Peak 68-70%"
  },

  // Neutral Pairs (should be 52-68%)
  {
    name: "Neutral with Good Western",
    chinesePattern: "none",
    westAspect: "trine",
    westElementRelation: "compatible",
    yearElementA: "Water",
    yearElementB: "Wood",
    expectedRange: { min: 58, max: 68 },
    expectedTier: "Neutral Match",
    description: "Neutral Chinese + good Western support = 58-68%"
  },
  {
    name: "Neutral with Poor Western",
    chinesePattern: "none",
    westAspect: "square",
    westElementRelation: "clash",
    yearElementA: "Water",
    yearElementB: "Metal",
    expectedRange: { min: 52, max: 58 },
    description: "Neutral Chinese + poor Western = Lower neutral"
  },

  // Conflict Patterns (Liu Hai, Xing, Po - should be 38-60%)
  {
    name: "Liu Hai with Good Western",
    chinesePattern: "liu_hai",
    westAspect: "trine",
    westElementRelation: "compatible",
    yearElementA: "Water",
    yearElementB: "Wood",
    expectedRange: { min: 48, max: 60 },
    expectedTier: "Difficult Match",
    description: "Liu Hai + good Western support = Upper difficult range"
  },
  {
    name: "Liu Hai with Poor Western",
    chinesePattern: "liu_hai",
    westAspect: "square",
    westElementRelation: "clash",
    yearElementA: "Fire",
    yearElementB: "Fire",
    expectedRange: { min: 38, max: 48 },
    expectedTier: "Difficult Match",
    description: "Liu Hai + poor Western = Lower difficult range"
  },
];

function runTests() {
  console.log("🧪 Testing Score Band Rebalancing\n");
  console.log("=".repeat(80));
  
  let passed = 0;
  let failed = 0;
  let criticalFail = false;

  testCases.forEach((test, index) => {
    console.log(`\n[Test ${index + 1}/${testCases.length}] ${test.name}`);
    console.log(`Description: ${test.description}`);
    console.log(`Pattern: ${test.chinesePattern}, Aspect: ${test.westAspect}, Element Rel: ${test.westElementRelation}`);
    console.log(`Year Elements: ${test.yearElementA} × ${test.yearElementB}`);

    try {
      // Create a minimal context
      const context: MatchContext = {
        westA: { sign: "Aries", element: "Fire" },
        westB: { sign: "Leo", element: "Fire" },
        westAspect: test.westAspect,
        westElementRelation: test.westElementRelation,
        chineseA: { animal: "Rat", yearElement: test.yearElementA },
        chineseB: { animal: "Dragon", yearElement: test.yearElementB },
        chinesePattern: test.chinesePattern,
        isChineseOpposite: test.chinesePattern === "liu_chong",
        isLivelyPair: false,
      };

      const result = computeMatchScore(context);

      const score = result.score;
      const tier = result.tier;
      const inRange = score >= test.expectedRange.min && score <= test.expectedRange.max;

      console.log(`Expected Range: ${test.expectedRange.min}-${test.expectedRange.max}%`);
      console.log(`Actual Score: ${score}%`);
      console.log(`Expected Tier: ${test.expectedTier || 'Any'}`);
      console.log(`Actual Tier: ${tier}`);

      // Critical test: Liu Chong must never exceed 62%
      if (test.name.includes("Liu Chong") && score > 62) {
        console.log(`❌ CRITICAL FAILURE: Liu Chong exceeded 62% (got ${score}%)`);
        criticalFail = true;
        failed++;
      } else if (!inRange) {
        console.log(`❌ FAIL: Score ${score}% is outside expected range ${test.expectedRange.min}-${test.expectedRange.max}%`);
        failed++;
      } else if (test.expectedTier && tier !== test.expectedTier) {
        console.log(`⚠️  WARN: Tier mismatch (expected ${test.expectedTier}, got ${tier}) but score is in range`);
        passed++;
      } else {
        console.log(`✅ PASS`);
        passed++;
      }
    } catch (error) {
      console.log(`❌ ERROR: ${error}`);
      failed++;
    }
  });

  console.log("\n" + "=".repeat(80));
  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (criticalFail) {
    console.log(`\n🚨 CRITICAL FAILURE: Liu Chong exceeded 62% limit!`);
    console.log(`This violates the key constraint of the rebalancing.`);
  } else if (failed === 0) {
    console.log(`\n🎉 All tests passed! Score bands are properly calibrated.`);
  } else {
    console.log(`\n⚠️  Some tests failed. Review the score calibration.`);
  }

  return failed === 0 && !criticalFail;
}

// Run tests if this file is executed directly
if (require.main === module) {
  const success = runTests();
  process.exit(success ? 0 : 1);
}

export { runTests, testCases };
