// Example usage of the updated match engine with new Chinese patterns

import {
  ChineseAnimal,
  ChinesePatternTag,
  getPrimaryChinesePatternTag,
} from "./chinesePatterns";
import { buildMatchContext, computeMatchScore, WesternSign } from "../matchEngine";

// Example Profile Type
type Profile = {
  chineseAnimal: ChineseAnimal;
  westernSign: WesternSign;
  birthYear: number;
  // ...other fields
};

/**
 * Example function showing how to compute match score using the new pattern detection
 */
export function computeMatchBetweenProfiles(
  profileA: Profile,
  profileB: Profile
): { score: number; tier: string; pattern: ChinesePatternTag } {
  // 1. Get Chinese animals from profiles
  const animalA = profileA.chineseAnimal;
  const animalB = profileB.chineseAnimal;

  // 2. Detect Chinese pattern using the new pattern detection
  const chinesePattern: ChinesePatternTag = getPrimaryChinesePatternTag(
    animalA,
    animalB
  );

  // 3. Build match context (pattern detection happens automatically if not provided)
  const ctx = buildMatchContext(
    profileA.westernSign,
    profileB.westernSign,
    animalA,
    animalB,
    profileA.birthYear,
    profileB.birthYear
    // Note: chinesePattern is optional - if omitted, it will be auto-detected
  );

  // 4. Compute the match score
  const result = computeMatchScore(ctx);

  return {
    score: result.score,
    tier: result.tier,
    pattern: chinesePattern,
  };
}

/**
 * Simple example with hardcoded values
 */
export function example() {
  const profileA: Profile = {
    chineseAnimal: "Dragon",
    westernSign: "Leo",
    birthYear: 1988,
  };

  const profileB: Profile = {
    chineseAnimal: "Rooster",
    westernSign: "Taurus",
    birthYear: 1993,
  };

  const match = computeMatchBetweenProfiles(profileA, profileB);

  console.log(`Match Score: ${match.score}`);
  console.log(`Match Tier: ${match.tier}`);
  console.log(`Chinese Pattern: ${match.pattern}`);
  // Expected output:
  // Match Score: ~75-85
  // Match Tier: Harmonious Match or Dynamic Match
  // Chinese Pattern: LIU_HE (Dragon-Rooster are secret friends)
}

/**
 * Example with same-sign patterns
 */
export function exampleSameSign() {
  // Dragon is a self-punishing sign
  const dragon1: Profile = {
    chineseAnimal: "Dragon",
    westernSign: "Aries", // Fire
    birthYear: 1988,
  };

  const dragon2: Profile = {
    chineseAnimal: "Dragon",
    westernSign: "Leo", // Fire (same element)
    birthYear: 2000,
  };

  const match = computeMatchBetweenProfiles(dragon1, dragon2);

  console.log(`Match Score: ${match.score}`);
  console.log(`Match Tier: ${match.tier}`);
  console.log(`Chinese Pattern: ${match.pattern}`);
  // Expected output:
  // Chinese Pattern: SAME_SIGN_SELF_PUNISH
  // Score: ~64 (due to same Western element and self-punish)
}

