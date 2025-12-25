// /lib/matchEngineAdapter.ts
// Adapter to integrate the new match engine (matchEngineV2) with the existing system

import { computeScore, normalizeSun, normalizeAnimal, type ScoreOutput, SETTINGS } from './matchEngineV2';
import { classifyMatch } from './matchCategory';
import { getMatchLabel, type PersonSign, type Label as LegacyLabel } from "@/engine/matchEngine";
import { RANK_THEME } from "@/data/rankTheme";
import { TIER_LABEL, type Tier } from "@/engine/labels";
import { tierFromScore } from "@/engine/thresholds";

type Element = 'fire' | 'earth' | 'air' | 'water';
type ElementRelation = 'same' | 'compatible' | 'semi' | 'conflicting';

const WEST_ELEMENT: Record<string, Element> = {
  aries: 'fire',
  taurus: 'earth',
  gemini: 'air',
  cancer: 'water',
  leo: 'fire',
  virgo: 'earth',
  libra: 'air',
  scorpio: 'water',
  sagittarius: 'fire',
  capricorn: 'earth',
  aquarius: 'air',
  pisces: 'water',
};

const ELEMENT_RELATION_LABEL: Record<ElementRelation, string> = {
  same: 'Same Element',
  compatible: 'Compatible Elements',
  semi: 'Semi-Compatible',
  conflicting: 'Opposing Elements',
};

const ELEMENT_NARRATIVES: Record<string, string> = {
  'fire_fire': 'Two flames burning bright — passionate, inspiring, and bold. The danger lies only in competing heat.',
  'earth_earth': 'Grounded and practical. You build together slowly and surely, valuing security and shared purpose.',
  'air_air': 'A meeting of minds — communicative, curious, and light-hearted. The spark thrives on ideas and freedom.',
  'water_water': 'Deep emotional flow. You understand each other intuitively — soulful, nurturing, and healing.',
  'fire_air': 'Air fuels Fire. Vibrant, creative, and full of movement — expect fast ideas and shared adventures.',
  'air_fire': 'Air fuels Fire. Vibrant, creative, and full of movement — expect fast ideas and shared adventures.',
  'earth_water': 'Water nourishes Earth. Stable and tender, this connection brings emotional depth to practical strength.',
  'water_earth': 'Water nourishes Earth. Stable and tender, this connection brings emotional depth to practical strength.',
  'fire_earth': "Fire's enthusiasm can warm Earth's steadiness when grounded in respect and timing.",
  'earth_fire': "Fire's enthusiasm can warm Earth's steadiness when grounded in respect and timing.",
  'air_water': 'Mind meets emotion — fascinating, if communication stays gentle and open.',
  'water_air': 'Mind meets emotion — fascinating, if communication stays gentle and open.',
  'fire_water': 'Steam and storm — intense attraction but turbulent emotions. Respect each other’s pace.',
  'water_fire': 'Steam and storm — intense attraction but turbulent emotions. Respect each other’s pace.',
  'air_earth': 'Different speeds — one seeks change, the other stability. Growth comes through patience and curiosity.',
  'earth_air': 'Different speeds — one seeks change, the other stability. Growth comes through patience and curiosity.',
};

const TRINE_GROUPS: Array<{ name: string; animals: Array<'rat' | 'ox' | 'tiger' | 'rabbit' | 'dragon' | 'snake' | 'horse' | 'goat' | 'monkey' | 'rooster' | 'dog' | 'pig'>; tagline: string; summary: string }> = [
  {
    name: 'Visionaries',
    animals: ['rat', 'dragon', 'monkey'],
    tagline: 'Ambitious, magnetic, and quick-minded.',
    summary: 'Ambitious, magnetic, and quick-minded. You share intuition, creativity, and drive — natural leaders who thrive on excitement and challenge.',
  },
  {
    name: 'Strategists',
    animals: ['ox', 'snake', 'rooster'],
    tagline: 'Disciplined, wise, and self-reliant.',
    summary: 'Disciplined, wise, and self-reliant. You value loyalty, logic, and refinement — a steady, enduring rhythm built on trust and respect.',
  },
  {
    name: 'Adventurers',
    animals: ['tiger', 'horse', 'dog'],
    tagline: 'Passionate, loyal, and freedom-loving.',
    summary: 'Passionate, loyal, and freedom-loving. Courageous spirits who follow their heart — driven by ideals, justice, and authenticity.',
  },
  {
    name: 'Artists',
    animals: ['rabbit', 'goat', 'pig'],
    tagline: 'Gentle, romantic, and intuitive.',
    summary: 'Gentle, romantic, and intuitive. Sensitive souls who seek beauty, peace, and emotional understanding in love and life.',
  },
];

const OPPOSITE_PAIRS: Record<string, string> = {
  rat: 'horse',
  horse: 'rat',
  ox: 'goat',
  goat: 'ox',
  tiger: 'monkey',
  monkey: 'tiger',
  rabbit: 'rooster',
  rooster: 'rabbit',
  dragon: 'dog',
  dog: 'dragon',
  snake: 'pig',
  pig: 'snake',
};

const SIX_DAMAGES_SET = new Set([
  "rat-goat", "goat-rat",
  "ox-horse", "horse-ox",
  "tiger-snake", "snake-tiger",
  "rabbit-dragon", "dragon-rabbit",
  "monkey-pig", "pig-monkey",
  "rooster-dog", "dog-rooster",
]);

function describeChineseRelation(aEast: string, bEast: string) {
  const a = normalizeAnimal(aEast);
  const b = normalizeAnimal(bEast);

  const group = TRINE_GROUPS.find(g => g.animals.includes(a as any) && g.animals.includes(b as any));
  if (group) {
    return {
      relation: 'same' as const,
      title: `Same Trine – ${group.name}`,
      tagline: group.tagline,
      summary: group.summary,
    };
  }

  if (SIX_DAMAGES_SET.has(`${a}-${b}`)) {
    return {
      relation: 'damage' as const,
      title: 'Six Damages – Worst Match',
      tagline: 'Fragile chemistry and recurring friction — patience runs thin quickly.',
      summary: 'Instincts clash and motivation pulls in opposite directions. This pairing tends to reopen the same wounds unless both people slow down, communicate openly, and set generous boundaries. Most find the effort rarely worth the strain.',
    };
  }

  if (OPPOSITE_PAIRS[a] === b) {
    return {
      relation: 'opposite' as const,
      title: 'Opposing – Natural Enemies',
      tagline: 'Opposing instincts — sparks can fly, but friction grows easily.',
      summary: 'Opposing instincts — sparks can fly, but friction grows easily. These pairs often teach each other powerful life lessons, not comfort.',
    };
  }

  return {
    relation: 'cross' as const,
    title: 'Cross-Trine – Mixed Trines',
    tagline: 'You move to different tempos.',
    summary: 'You move to different tempos. Connection comes from curiosity and compromise — attraction through contrast, growth through patience.',
  };
}

function describeElementRelation(aWest: string, bWest: string) {
  const a = normalizeSun(aWest);
  const b = normalizeSun(bWest);
  const elemA = WEST_ELEMENT[a];
  const elemB = WEST_ELEMENT[b];
  if (!elemA || !elemB) return null;

  let relation: ElementRelation = 'conflicting';
  if (elemA === elemB) {
    relation = 'same';
  } else if (
    (elemA === 'fire' && elemB === 'air') ||
    (elemA === 'air' && elemB === 'fire') ||
    (elemA === 'earth' && elemB === 'water') ||
    (elemA === 'water' && elemB === 'earth')
  ) {
    relation = 'compatible';
  } else if (
    (elemA === 'fire' && elemB === 'earth') ||
    (elemA === 'earth' && elemB === 'fire') ||
    (elemA === 'air' && elemB === 'water') ||
    (elemA === 'water' && elemB === 'air')
  ) {
    relation = 'semi';
  } else {
    relation = 'conflicting';
  }

  const formatElement = (el: Element) => el.charAt(0).toUpperCase() + el.slice(1);
  const comboKey = `${elemA}_${elemB}`;

  return {
    relation,
    comboLabel: `${formatElement(elemA)} × ${formatElement(elemB)}`,
    descriptorLabel: ELEMENT_RELATION_LABEL[relation],
    narrative: ELEMENT_NARRATIVES[comboKey] || ELEMENT_NARRATIVES[`${elemB}_${elemA}`] || 'Complementary energies create dynamic balance.',
  };
}
import type { West, East } from './matchEngine';
import { getWesternBaseScoreSeeded } from './matchExplainAndScore';
import { sameTrine, secretFriends, isClash, areAdjacent } from './eastWestHelpers';
import { getWesternSignGlyph, getChineseSignGlyph } from './zodiacHelpers';
import type { RankKey } from '@/data/rankTheme';

// Eastern base scores (from engine.ts)
const EAST_BASE = {
  sameTrine: 88,
  secretFriend: 86,
  clash: 64,
  adjacent: 78,
  sameAnimal: 68, // Same sign pairs should never score above 68
  neutral: 80,
};

/**
 * Calculate base scores for Western and Eastern compatibility
 * These are used as inputs to the new match engine
 */
function calculateBaseScores(
  aWest: West,
  aEast: East,
  bWest: West,
  bEast: East
): { baseWest: number; baseEast: number } {
  // Calculate Western base score using existing function
  const legacyWesternScore = (westA: string, westB: string): number => {
    // Simple element-based scoring as fallback
    const elements: Record<string, string> = {
      aries: "fire", leo: "fire", sagittarius: "fire",
      taurus: "earth", virgo: "earth", capricorn: "earth",
      gemini: "air", libra: "air", aquarius: "air",
      cancer: "water", scorpio: "water", pisces: "water"
    };
    const eA = elements[westA.toLowerCase()];
    const eB = elements[westB.toLowerCase()];
    if (eA === eB) return 85;
    if ((eA === "fire" && eB === "air") || (eA === "air" && eB === "fire")) return 80;
    if ((eA === "earth" && eB === "water") || (eA === "water" && eB === "earth")) return 80;
    return 70;
  };
  
  const baseWest = getWesternBaseScoreSeeded(aWest, bWest, legacyWesternScore);
  
  // Calculate Eastern base score
  let baseEast = EAST_BASE.neutral;
  if (aEast === bEast) {
    baseEast = EAST_BASE.sameAnimal;
  } else if (sameTrine(aEast, bEast)) {
    baseEast = EAST_BASE.sameTrine;
  } else if (secretFriends(aEast, bEast)) {
    baseEast = EAST_BASE.secretFriend;
  } else if (isClash(aEast, bEast)) {
    baseEast = EAST_BASE.clash;
  } else if (areAdjacent(aEast, bEast)) {
    baseEast = EAST_BASE.adjacent;
  }
  
  return {
    baseWest,
    baseEast
  };
}

/**
 * Convert the new match engine output to the existing ConnectionBoxData format
 */
export function adaptScoreOutputToConnectionBox(
  scoreOutput: ScoreOutput,
  aWest: string,
  aEast: string,
  bWest: string,
  bEast: string
) {
  // Map tier names to existing rank keys
  const tierMap: Record<string, Tier> = {
    "Soulmate Match": "perfect",
    "Destined Harmony": "perfect",
    "Twin Flame Match": "excellent",
    "Magnetic Connection": "excellent",
    "Excellent Match": "excellent",
    "Compatible Match": "good",
    "Mixed Match": "good",
    "Fair Match": "fair",
    "Learning Match": "fair",
    "Challenging Match": "challenging",
    "Incompatible Match": "challenging",
  };

  const fallbackTier = tierFromScore(scoreOutput.total);
  const rankKey = (tierMap[scoreOutput.tier] || fallbackTier) as RankKey;

  const viewerSigns: PersonSign = {
    west: aWest as PersonSign['west'],
    east: aEast as PersonSign['east'],
  };
  const partnerSigns: PersonSign = {
    west: bWest as PersonSign['west'],
    east: bEast as PersonSign['east'],
  };
  const matchLabel = getMatchLabel(viewerSigns, partnerSigns);
  const labelTierMap: Record<LegacyLabel, Tier> = {
    "Soulmate Connection": "perfect",
    "Best Connection": "perfect",
    "Best Match": "perfect",
    "Best Matches": "perfect",
    "Good Connection": "excellent",
    "Good Match": "excellent",
    "Neutral Connection": "fair",
    "Neutral Match": "fair",
    "Good Harmony": "good",
    "Challenging Connection": "challenging",
    "Difficult Connection": "challenging",
    "Difficult Match": "challenging",
    "Difficult Matches": "challenging",
  };
  const resolvedTier = (labelTierMap[matchLabel.label] || rankKey) as RankKey;
  const tierLabel = matchLabel.label;
  const theme = RANK_THEME[resolvedTier];

  const classification = classifyMatch(aWest, aEast, bWest, bEast);

  // Extract relationship tags and blurbs from score output
  // The tags array contains strings like "Same Trine: Natural Harmony", "⚡ Six Conflicts", etc.
  const eastTags = scoreOutput.tags.filter(t =>
    t.includes("Same Trine") || t.includes("Six Conflicts") || t.includes("Cross-Trine")
  );
  const westTags = scoreOutput.tags.filter(t =>
    t.includes("Six Conflicts") || t.includes("Mirror Effect")
  );

  const chineseRelation = describeChineseRelation(aEast, bEast);

  let east_relation = `${aEast} × ${bEast} — ${chineseRelation.title}`;
  if (chineseRelation.relation === 'opposite') {
    east_relation = `${aEast} × ${bEast} — ⚡ Six Conflicts • ${chineseRelation.title}`;
  } else if (chineseRelation.relation === 'damage') {
    east_relation = `${aEast} × ${bEast} — 🚫 Six Damages • ${chineseRelation.title}`;
  }
  const east_summary = chineseRelation.summary;

  const displayTagline = chineseRelation.relation === 'opposite'
    ? 'Opposites Attract'
    : scoreOutput.tagline;

  // Build west_relation and west_summary
  // IMPORTANT: Verify that signs are actually opposites before showing "Six Conflicts"
  const westTag = westTags[0] || "";
  
  // Double-check that signs are actually opposites if tag says "Six Conflicts"
  let verifiedWestTag = westTag;
  if (westTag.includes("Six Conflicts")) {
    const normalizedA = normalizeSun(aWest);
    const normalizedB = normalizeSun(bWest);
    const WEST_OPPOSITES: Record<string, string> = {
      aries: "libra", taurus: "scorpio", gemini: "sagittarius", cancer: "capricorn",
      leo: "aquarius", virgo: "pisces", libra: "aries", scorpio: "taurus",
      sagittarius: "gemini", capricorn: "cancer", aquarius: "leo", pisces: "virgo"
    };
    const isActuallyOpposite = WEST_OPPOSITES[normalizedA] === normalizedB || WEST_OPPOSITES[normalizedB] === normalizedA;
    if (!isActuallyOpposite) {
      // Remove the tag if signs are not actually opposites
      verifiedWestTag = "";
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[Adapter] Removed incorrect "Six Conflicts" tag for ${aWest} × ${bWest} (not actually opposites)`);
      }
    }
  }
  
  const elementDetails = describeElementRelation(aWest, bWest);
 
   let west_relation = `${aWest} × ${bWest}`;
  if (elementDetails) {
    const elementDescriptor = `${elementDetails.descriptorLabel}: ${elementDetails.comboLabel}`;
    if (verifiedWestTag) {
      west_relation = `${aWest} × ${bWest} — ${verifiedWestTag} • ${elementDescriptor}`;
    } else {
      west_relation = `${aWest} × ${bWest} — ${elementDescriptor}`;
    }
  } else if (verifiedWestTag) {
    west_relation = `${aWest} × ${bWest} — ${verifiedWestTag}`;
  }
  
  // Get the correct blurb based on the tag
  let west_summary = "";
  if (verifiedWestTag.includes("Six Conflicts")) {
    west_summary = SETTINGS.blurbs.west_opposite;
  } else if (verifiedWestTag.includes("Mirror Effect")) {
    west_summary = SETTINGS.blurbs.west_same_sign;
  } else if (elementDetails) {
    west_summary = elementDetails.narrative;
  } else {
    west_summary = "Complementary energies create dynamic balance.";
  }
  
  // Debug logging for tag extraction
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Adapter] Tag extraction for ${aEast}×${bEast}:`, {
      allTags: scoreOutput.tags,
      eastTags,
      derivedRelation: east_relation,
      east_summary: east_summary.substring(0, 80)
    });
  }

  const combinedTags = new Set<string>([
    ...scoreOutput.tags,
    ...(matchLabel.notes ?? []),
  ]);
  classification.badges.forEach(badge => combinedTags.add(badge));

  const rankDisplay = `${tierLabel}`;

  return {
    score: scoreOutput.total,
    rankKey: resolvedTier,
    rankLabel: tierLabel,
    rank: tierLabel,
    emoji: theme?.emoji ?? '✨',
    colorRgb: theme?.colorRgb ?? 'rgb(168, 85, 247)',
    connectionLabel: rankDisplay,
    tagline: displayTagline,
    east_tagline: chineseRelation.tagline,
    east_relation,
    east_summary,
    west_relation,
    west_summary,
    // Additional fields for compatibility
    tags: Array.from(combinedTags),
    notes: matchLabel.notes?.length ? matchLabel.notes : scoreOutput.notes,
    eastScore: scoreOutput.eastScore,
    westScore: scoreOutput.westScore,
    tier: resolvedTier,
  };
}

/**
 * Main adapter function that uses the new match engine
 */
export function computeMatchWithNewEngine(
  aWest: West,
  aEast: East,
  bWest: West,
  bEast: East,
  userSignKey?: string,
  partnerSignKey?: string
) {
  // Calculate base scores using existing functions
  const { baseWest, baseEast } = calculateBaseScores(aWest, aEast, bWest, bEast);
  
  // Normalize to new engine format
  const sunA = normalizeSun(aWest);
  const sunB = normalizeSun(bWest);
  const animalA = normalizeAnimal(aEast);
  const animalB = normalizeAnimal(bEast);
  
  // Create sign keys for featured match lookup if not provided
  const userKey = userSignKey || `${aWest.toLowerCase()}_${aEast.toLowerCase()}`;
  const partnerKey = partnerSignKey || `${bWest.toLowerCase()}_${bEast.toLowerCase()}`;
  
  // Compute score using new engine
  const scoreOutput = computeScore({
    westA: sunA,
    westB: sunB,
    eastA: animalA,
    eastB: animalB,
    baseWest,
    baseEast,
    userSignKey: userKey,
    partnerSignKey: partnerKey
  });
  
  // Detect same Western sign and same Chinese animal
  const sameWesternSign = sunA.toLowerCase() === sunB.toLowerCase();
  const sameChineseAnimal = animalA.toLowerCase() === animalB.toLowerCase();
  
  let finalScore = scoreOutput.total;
  
  // If same Western sign or same animal causes Neutral classification, ensure tier reflects this
  // matchEngineV2 uses "Learning Match" (40-54) and "Mixed Match" (55-69) for neutral ranges
  const isNeutralTier = scoreOutput.tier === "Learning Match" || 
                        scoreOutput.tier === "Mixed Match" || 
                        scoreOutput.tier === "Fair Match" ||
                        scoreOutput.tier === "Neutral Match";
  
  // Force Neutral Match tier when sameWestSign or sameAnimal applies
  // This ensures the cap logic works correctly
  if ((sameWesternSign || sameChineseAnimal) && !isNeutralTier) {
    // Check if score is in neutral range (60-74) - if so, it's a Neutral Match
    if (finalScore >= 60 && finalScore < 75) {
      scoreOutput.tier = "Neutral Match";
      console.log('[Match Engine Adapter] Setting tier to Neutral Match due to sameWestSign or sameChineseAnimal');
    }
  }
  
  // If both are same (user comparing to themselves), always set to Neutral Match
  if (sameWesternSign && sameChineseAnimal) {
    scoreOutput.tier = "Neutral Match";
    console.log('[Match Engine Adapter] Same sign and animal detected, forcing Neutral Match tier');
  }
  
  // Cap for same sign pairs - should never score above 68
  // If same West sign OR same animal, cap the final score at 68
  if ((sameWesternSign || sameChineseAnimal) && finalScore > 68) {
    console.log('[Match Engine Adapter] Capping same sign score at 68%:', {
      sameWesternSign,
      sameChineseAnimal,
      tier: scoreOutput.tier,
      originalScore: finalScore
    });
    finalScore = 68;
    // Update the scoreOutput with the capped score
    scoreOutput.total = finalScore;
  }
  
  // Debug logging for development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[New Engine] ${aWest}-${aEast} × ${bWest}-${bEast}:`, {
      baseWest,
      baseEast,
      finalScore: scoreOutput.total,
      tier: scoreOutput.tier,
      tags: scoreOutput.tags,
      eastScore: scoreOutput.eastScore,
      westScore: scoreOutput.westScore,
      notes: scoreOutput.notes
    });
  }
  
  // Adapt to existing format
  const adapted = adaptScoreOutputToConnectionBox(scoreOutput, aWest, aEast, bWest, bEast);
  
  // Add required a and b fields for ConnectionBoxData
  return {
    ...adapted,
    a: {
      west: aWest,
      east: aEast,
      westGlyph: getWesternSignGlyph(aWest),
      eastGlyph: getChineseSignGlyph(aEast)
    },
    b: {
      west: bWest,
      east: bEast,
      westGlyph: getWesternSignGlyph(bWest),
      eastGlyph: getChineseSignGlyph(bEast)
    }
  };
}

