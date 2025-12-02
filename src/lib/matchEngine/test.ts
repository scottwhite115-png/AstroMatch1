// Test file for the updated match engine
// Run with: npx ts-node src/lib/matchEngine/test.ts

import {
  buildMatchContext,
  computeMatchScore,
  getPrimaryChinesePatternTag,
  ChinesePatternTag,
} from "../matchEngine.js";

console.log("🧪 Testing Updated Match Engine with Chinese Patterns\n");

// Test 1: San He (Harmonious Trine) - Rat + Dragon
console.log("Test 1: San He (Harmonious Trine)");
console.log("Profile A: Rat (1984) + Aries");
console.log("Profile B: Dragon (1988) + Leo");
const pattern1 = getPrimaryChinesePatternTag("Rat", "Dragon");
console.log(`Pattern: ${pattern1}`);
const ctx1 = buildMatchContext("Aries", "Leo", "Rat", "Dragon", 1984, 1988);
const result1 = computeMatchScore(ctx1);
console.log(`Score: ${result1.score}, Tier: ${result1.tier}`);
console.log(`✓ Expected: SAN_HE, High score (75-90+)\n`);

// Test 2: Liu He (Secret Friends) - Dragon + Rooster
console.log("Test 2: Liu He (Secret Friends)");
console.log("Profile A: Dragon (1988) + Leo");
console.log("Profile B: Rooster (1993) + Taurus");
const pattern2 = getPrimaryChinesePatternTag("Dragon", "Rooster");
console.log(`Pattern: ${pattern2}`);
const ctx2 = buildMatchContext("Leo", "Taurus", "Dragon", "Rooster", 1988, 1993);
const result2 = computeMatchScore(ctx2);
console.log(`Score: ${result2.score}, Tier: ${result2.tier}`);
console.log(`✓ Expected: LIU_HE, Good score (70-85)\n`);

// Test 3: Liu Chong (Opposites) - Rat + Horse
console.log("Test 3: Liu Chong (Opposites)");
console.log("Profile A: Rat (1984) + Aries");
console.log("Profile B: Horse (1990) + Sagittarius");
const pattern3 = getPrimaryChinesePatternTag("Rat", "Horse");
console.log(`Pattern: ${pattern3}`);
const ctx3 = buildMatchContext("Aries", "Sagittarius", "Rat", "Horse", 1984, 1990);
const result3 = computeMatchScore(ctx3);
console.log(`Score: ${result3.score}, Tier: ${result3.tier}`);
console.log(`✓ Expected: LIU_CHONG, Variable score (typically 52-70)\n`);

// Test 4: Same Sign (non-self-punish) - Rat + Rat
console.log("Test 4: Same Sign (Rat + Rat)");
console.log("Profile A: Rat (1984) + Aries (Fire)");
console.log("Profile B: Rat (1996) + Leo (Fire)");
const pattern4 = getPrimaryChinesePatternTag("Rat", "Rat");
console.log(`Pattern: ${pattern4}`);
const ctx4 = buildMatchContext("Aries", "Leo", "Rat", "Rat", 1984, 1996);
const result4 = computeMatchScore(ctx4);
console.log(`Score: ${result4.score}, Tier: ${result4.tier}`);
console.log(`✓ Expected: SAME_SIGN, Score ~68 (same element)\n`);

// Test 5: Same Sign Self-Punish - Dragon + Dragon
console.log("Test 5: Same Sign Self-Punish (Dragon + Dragon)");
console.log("Profile A: Dragon (1988) + Aries (Fire)");
console.log("Profile B: Dragon (2000) + Leo (Fire)");
const pattern5 = getPrimaryChinesePatternTag("Dragon", "Dragon");
console.log(`Pattern: ${pattern5}`);
const ctx5 = buildMatchContext("Aries", "Leo", "Dragon", "Dragon", 1988, 2000);
const result5 = computeMatchScore(ctx5);
console.log(`Score: ${result5.score}, Tier: ${result5.tier}`);
console.log(`✓ Expected: SAME_SIGN_SELF_PUNISH, Score ~64 (same element)\n`);

// Test 6: Same Sign Self-Punish with Clash - Horse + Horse
console.log("Test 6: Same Sign Self-Punish with Clash");
console.log("Profile A: Horse (1990) + Aries (Fire)");
console.log("Profile B: Horse (2002) + Cancer (Water)");
const pattern6 = getPrimaryChinesePatternTag("Horse", "Horse");
console.log(`Pattern: ${pattern6}`);
const ctx6 = buildMatchContext("Aries", "Cancer", "Horse", "Horse", 1990, 2002);
const result6 = computeMatchScore(ctx6);
console.log(`Score: ${result6.score}, Tier: ${result6.tier}`);
console.log(`✓ Expected: SAME_SIGN_SELF_PUNISH, Score ~54 (clash element)\n`);

// Test 7: Liu Hai (Six Harms) - Rat + Goat
console.log("Test 7: Liu Hai (Six Harms)");
console.log("Profile A: Rat (1984) + Capricorn");
console.log("Profile B: Goat (1991) + Taurus");
const pattern7 = getPrimaryChinesePatternTag("Rat", "Goat");
console.log(`Pattern: ${pattern7}`);
const ctx7 = buildMatchContext("Capricorn", "Taurus", "Rat", "Goat", 1984, 1991);
const result7 = computeMatchScore(ctx7);
console.log(`Score: ${result7.score}, Tier: ${result7.tier}`);
console.log(`✓ Expected: LIU_HAI, Lower score (typically 30-55)\n`);

// Test 8: Xing (Punishment) - Rat + Rabbit
console.log("Test 8: Xing (Punishment)");
console.log("Profile A: Rat (1984) + Aries");
console.log("Profile B: Rabbit (1987) + Pisces");
const pattern8 = getPrimaryChinesePatternTag("Rat", "Rabbit");
console.log(`Pattern: ${pattern8}`);
const ctx8 = buildMatchContext("Aries", "Pisces", "Rat", "Rabbit", 1984, 1987);
const result8 = computeMatchScore(ctx8);
console.log(`Score: ${result8.score}, Tier: ${result8.tier}`);
console.log(`✓ Expected: XING, Lower score (typically 30-55)\n`);

// Test 9: Po (Break) - Rat + Rooster
console.log("Test 9: Po (Break)");
console.log("Profile A: Rat (1984) + Aries");
console.log("Profile B: Rooster (1993) + Virgo");
const pattern9 = getPrimaryChinesePatternTag("Rat", "Rooster");
console.log(`Pattern: ${pattern9}`);
const ctx9 = buildMatchContext("Aries", "Virgo", "Rat", "Rooster", 1984, 1993);
const result9 = computeMatchScore(ctx9);
console.log(`Score: ${result9.score}, Tier: ${result9.tier}`);
console.log(`✓ Expected: PO, Lower-moderate score (typically 35-55)\n`);

// Test 10: None (Neutral) - Rat + Tiger
console.log("Test 10: None (Neutral)");
console.log("Profile A: Rat (1984) + Aries");
console.log("Profile B: Tiger (1986) + Sagittarius");
const pattern10 = getPrimaryChinesePatternTag("Rat", "Tiger");
console.log(`Pattern: ${pattern10}`);
const ctx10 = buildMatchContext("Aries", "Sagittarius", "Rat", "Tiger", 1984, 1986);
const result10 = computeMatchScore(ctx10);
console.log(`Score: ${result10.score}, Tier: ${result10.tier}`);
console.log(`✓ Expected: NONE, Moderate score (typically 50-70)\n`);

console.log("✅ All tests completed!");

