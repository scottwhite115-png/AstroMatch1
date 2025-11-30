// /lib/classifierAdapter.ts
// Adapter to integrate the new astroMatchClassifier with the existing match engine system
//
// This file uses descriptions from:
// - Chinese Zodiac Compatibility Guide (from /app/astrology/page.tsx)
// - Western Zodiac Element Compatibility (from /app/astrology/page.tsx)
//
// All descriptions match the compatibility charts exactly.

import { classifyPair, type WestSign, type EastAnimal, type Classification } from '@/engine/astroMatchClassifier';
import { RANK_THEME, type RankKey } from '@/data/rankTheme';
import { getWesternSignGlyph, getChineseSignGlyph, capitalizeSign } from '@/lib/zodiacHelpers';
import type { ConnectionBoxData } from '@/components/ConnectionBoxSimple';
import { applySameChineseSignBand, type WesternElement, type ChineseAnimal } from '@/lib/matchEngine/chineseSameSignBand';

// Trine grouping for Chinese zodiac
const TRINES: Record<EastAnimal, string> = {
  rat: "visionaries", dragon: "visionaries", monkey: "visionaries",
  ox: "strategists", snake: "strategists", rooster: "strategists",
  tiger: "adventurers", horse: "adventurers", dog: "adventurers",
  rabbit: "artists", goat: "artists", pig: "artists",
};

// Helper to capitalize trine name
function capitalizeTrine(trine: string): string {
  return trine.charAt(0).toUpperCase() + trine.slice(1);
}

// Map new classifier tiers to existing rank keys
const TIER_TO_RANK: Record<string, RankKey> = {
  soulmate: "perfect",
  twin_flame: "excellent",
  excellent: "excellent",
  very_good: "good",  // New tier: Same trine + opposing/non-compatible West
  sparky_friends: "good",
  opposites_attract: "good",  // Changed from "fair" to "good" - Opposites Attract is still a good connection
  difficult: "challenging",
  neutral: "good",  // Changed from "fair" to "good" - Neutral should not be "fair"
};

// Map new classifier tiers to display labels
// Note: Good Friends label removed - sparky_friends now maps to Neutral Match
const TIER_TO_LABEL: Record<string, string> = {
  soulmate: "Soulmate Match",
  twin_flame: "Twin Flame Match",
  excellent: "Excellent Match",
  very_good: "Excellent Match",  // Same trine + opposing/semi-compatible West
  sparky_friends: "Neutral Match", // Changed from "Good Friends" to "Neutral Match"
  opposites_attract: "Opposites Attract",
  difficult: "Difficult Match",
  neutral: "Neutral Match",
};

// Map new classifier tiers to colors
// Note: sparky_friends now uses Neutral Match color
const TIER_TO_COLOR: Record<string, string> = {
  soulmate: "rgb(212, 175, 55)",      // Gold
  twin_flame: "rgb(255, 140, 0)",    // Astromatch Orange (bright orange)
  excellent: "rgb(219, 39, 119)",     // Hot Pink (more vibrant)
  very_good: "rgb(219, 39, 119)",     // Hot Pink (same as excellent since both show "Excellent Match")
  sparky_friends: "rgb(34, 139, 34)", // Green (changed from Blue to Neutral Match color)
  opposites_attract: "rgb(239, 68, 68)", // Red
  difficult: "rgb(239, 68, 68)",      // Red
  neutral: "rgb(34, 139, 34)",        // Green (changed from Slate to Green)
};

// Helper to normalize sign names (capitalized to lowercase)
function normalizeWestSign(sign: string): WestSign {
  const normalized = sign.toLowerCase() as WestSign;
  return normalized;
}

function normalizeEastAnimal(animal: string): EastAnimal {
  const normalized = animal.toLowerCase() as EastAnimal;
  return normalized;
}

// Same-sign blurbs for Chinese zodiac
const SAME_SIGN_BLURBS: Record<EastAnimal, { title: string; summary: string }> = {
  rat: {
    title: "Rat × Rat — Same Sign",
    summary: "Clever, social, scheming. Great teamwork, but anxiety doubles.",
  },
  ox: {
    title: "Ox × Ox — Same Sign",
    summary: "Loyal, methodical. Rock-solid partnership; slow to adapt.",
  },
  tiger: {
    title: "Tiger × Tiger — Same Sign",
    summary: "Bold, passionate. Intense loyalty, but tempers flare together.",
  },
  rabbit: {
    title: "Rabbit × Rabbit — Same Sign",
    summary: "Gentle, artistic. Peaceful and nurturing; may avoid conflict too much.",
  },
  dragon: {
    title: "Dragon × Dragon — Same Sign",
    summary: "Ambitious, charismatic. Power couple potential; ego clashes likely.",
  },
  snake: {
    title: "Snake × Snake — Same Sign",
    summary: "Wise, intuitive. Deep mental bond; can become isolated or suspicious.",
  },
  horse: {
    title: "Horse × Horse — Same Sign",
    summary: "Free-spirited, energetic. Fun and active; commitment issues x2.",
  },
  goat: {
    title: "Goat × Goat — Same Sign",
    summary: "Kind, creative. Emotionally safe; indecisiveness paralyzes both.",
  },
  monkey: {
    title: "Monkey × Monkey — Same Sign",
    summary: "Witty, inventive. Endless fun; chaos and unreliability doubled.",
  },
  rooster: {
    title: "Rooster × Rooster — Same Sign",
    summary: "Organized, proud. Efficient duo; criticism turns toxic.",
  },
  dog: {
    title: "Dog × Dog — Same Sign",
    summary: "Loyal, honest. Ultimate trust; pessimism or stubbornness amplified.",
  },
  pig: {
    title: "Pig × Pig — Same Sign",
    summary: "Generous, easygoing. Comfortable and joyful; laziness or overindulgence.",
  },
};

// Helper to get Chinese relation description
function getChineseRelationDescription(eastA: EastAnimal, eastB: EastAnimal, classification: Classification): {
  title: string;
  tagline: string;
  summary: string;
} {
  const a = capitalizeSign(eastA);
  const b = capitalizeSign(eastB);
  
  // Check for same Chinese sign first
  if (classification.badges.includes("Same Chinese Sign") || eastA === eastB) {
    const sameSignBlurb = SAME_SIGN_BLURBS[eastA];
    if (sameSignBlurb) {
      return {
        title: sameSignBlurb.title,
        tagline: "Same-Sign Dynamic",
        summary: sameSignBlurb.summary,
      };
    }
  }
  
  // Check for specific relations based on badges
  if (classification.badges.includes("Same Trine")) {
    const trineName = TRINES[eastA];
    const trineDisplay = capitalizeTrine(trineName);
    // Use specific descriptions from astrology charts
    let summary = "";
    if (trineName === "visionaries") {
      summary = "Ambitious, magnetic, and quick-minded. You share intuition, creativity, and drive — natural leaders who thrive on excitement and challenge.";
    } else if (trineName === "strategists") {
      summary = "Disciplined, wise, and self-reliant. You value loyalty, logic, and refinement — a steady, enduring rhythm built on trust and respect.";
    } else if (trineName === "adventurers") {
      summary = "Passionate, loyal, and freedom-loving. Courageous spirits who follow their heart — driven by ideals, justice, and authenticity.";
    } else if (trineName === "artists") {
      summary = "Gentle, romantic, and intuitive. Sensitive souls who seek beauty, peace, and emotional understanding in love and life.";
    } else {
      summary = `You share the same trine (${trineDisplay}), creating natural harmony and understanding. This connection flows with ease and mutual respect.`;
    }
    return {
      title: `Same Trine: ${trineDisplay}`,
      tagline: classification.tier === "soulmate" ? "Perfect harmony" : "Natural alignment",
      summary,
    };
  }
  
  if (classification.badges.includes("Secret Friend")) {
    return {
      title: "Secret Friend (Six Harmonies)",
      tagline: "Hidden support and mutual understanding",
      summary: "You share a secret friendship bond. This connection offers hidden support, mutual understanding, and complementary strengths.",
    };
  }
  
  if (classification.badges.includes("Conflict")) {
    return {
      title: "⚡ Magnetic Opposites (Six Conflicts)",
      tagline: "Opposites attract with magnetic chemistry",
      summary: "Opposing instincts — sparks can fly, but friction grows easily. These pairs often teach each other powerful life lessons, not comfort.",
    };
  }
  
  if (classification.badges.includes("Clash")) {
    return {
      title: "⚔️ Clash (冲) – Challenging Match",
      tagline: "High divorce risk, Major relocation/fight possibility",
      summary: "Clash personalities create intense friction. High divorce risk and major relocation or fight possibilities. This connection requires exceptional maturity, clear communication, and willingness to navigate significant challenges together.",
    };
  }

  if (classification.badges.includes("Harm")) {
    return {
      title: "💔 Harm (害) – Challenging Match",
      tagline: "Emotional betrayal, Family gossip",
      summary: "Harm personalities create emotional tension. Risk of emotional betrayal and family gossip. This connection requires strong boundaries, trust-building, and careful navigation of family dynamics to avoid misunderstandings.",
    };
  }

  if (classification.badges.includes("Punishment")) {
    return {
      title: "⚖️ Punishment (刑) – Challenging Match",
      tagline: "Self-sabotage in love, Karmic lesson year",
      summary: "Punishment personalities face karmic lessons. Self-sabotage in love and karmic lesson year challenges. This connection requires deep self-awareness, breaking old patterns, and learning to trust the process of growth together.",
    };
  }

  if (classification.badges.includes("Break")) {
    return {
      title: "💥 Break (破) – Challenging Match",
      tagline: "Trust erosion, Project failure",
      summary: "Break personalities struggle with trust. Trust erosion and project failure risks. This connection requires rebuilding trust, managing expectations, and supporting each other through setbacks without letting failures define the relationship.",
    };
  }

  if (classification.badges.includes("Damage")) {
    return {
      title: "🚫 Six Damages – Challenging Match",
      tagline: "High friction requires significant effort",
      summary: "This pairing faces significant challenges. Instincts clash and motivation pulls in opposite directions. Growth requires exceptional patience and communication.",
    };
  }
  
  if (classification.badges.includes("Lively Pair")) {
    const trineA = TRINES[eastA];
    const trineB = TRINES[eastB];
    const trineDisplayA = capitalizeTrine(trineA);
    const trineDisplayB = capitalizeTrine(trineB);
    // For Cross trine, just show "Cross-Trine" without trine names
    // For Same Trine, show "Same Trine: [TrineName]" with description
    const trineLabel = trineA !== trineB ? `Cross-Trine` : `Same Trine: ${trineDisplayA}`;
    // Use guide descriptions
    let summary = "";
    if (trineA === trineB) {
      // Same Trine - use guide descriptions
      if (trineA === "visionaries") {
        summary = "Ambitious, magnetic, and quick-minded. You share intuition, creativity, and drive — natural leaders who thrive on excitement and challenge.";
      } else if (trineA === "strategists") {
        summary = "Disciplined, wise, and self-reliant. You value loyalty, logic, and refinement — a steady, enduring rhythm built on trust and respect.";
      } else if (trineA === "adventurers") {
        summary = "Passionate, loyal, and freedom-loving. Courageous spirits who follow their heart — driven by ideals, justice, and authenticity.";
      } else if (trineA === "artists") {
        summary = "Gentle, romantic, and intuitive. Sensitive souls who seek beauty, peace, and emotional understanding in love and life.";
      }
    } else {
      // Cross trine - use guide description
      summary = "You move to different tempos. Connection comes from curiosity and compromise — attraction through contrast, growth through patience.";
    }
    return {
      title: trineLabel,
      tagline: "Dynamic energy with potential challenges",
      summary,
    };
  }
  
  // Default: Cross trine (no special relationship)
  const trineA = TRINES[eastA];
  const trineB = TRINES[eastB];
  const trineDisplayA = capitalizeTrine(trineA);
  const trineDisplayB = capitalizeTrine(trineB);
  // For Cross trine, just show "Cross trine" without trine names
  // For Same Trine, show "Same Trine: [TrineName]" with description
  const trineLabel = trineA !== trineB ? `Cross trine` : `Same Trine: ${trineDisplayA}`;
  // Use guide descriptions
  let summary = "";
  if (trineA === trineB) {
    // Same Trine - use guide descriptions
    if (trineA === "visionaries") {
      summary = "Ambitious, magnetic, and quick-minded. You share intuition, creativity, and drive — natural leaders who thrive on excitement and challenge.";
    } else if (trineA === "strategists") {
      summary = "Disciplined, wise, and self-reliant. You value loyalty, logic, and refinement — a steady, enduring rhythm built on trust and respect.";
    } else if (trineA === "adventurers") {
      summary = "Passionate, loyal, and freedom-loving. Courageous spirits who follow their heart — driven by ideals, justice, and authenticity.";
    } else if (trineA === "artists") {
      summary = "Gentle, romantic, and intuitive. Sensitive souls who seek beauty, peace, and emotional understanding in love and life.";
    }
  } else {
    // Cross trine - use guide description
    summary = "You move to different tempos. Connection comes from curiosity and compromise — attraction through contrast, growth through patience.";
  }
  return {
    title: trineLabel,
    tagline: "Mixed connection",
    summary,
  };
}

// Helper to get Western relation description
function getWesternRelationDescription(westA: string, westB: string, classification: Classification): {
  title: string;
  summary: string;
} {
  const a = capitalizeSign(westA);
  const b = capitalizeSign(westB);
  
  const WEST_ELEMENT: Record<string, string> = {
    aries: "fire", leo: "fire", sagittarius: "fire",
    taurus: "earth", virgo: "earth", capricorn: "earth",
    gemini: "air", libra: "air", aquarius: "air",
    cancer: "water", scorpio: "water", pisces: "water",
  };
  
  const elemA = WEST_ELEMENT[westA.toLowerCase()] || "";
  const elemB = WEST_ELEMENT[westB.toLowerCase()] || "";
  
  let elementRelation = "";
  let summary = "";
  
  // Check for Magnetic Opposites (West) first - this takes priority
  if (classification.badges.includes("Magnetic Opposites (West)")) {
    elementRelation = `⚡ Magnetic Opposites`;
    summary = "You are magnetic opposites. This creates intense attraction and chemistry, but requires maturity, patience, and balance to thrive.";
  } else if (classification.badges.includes("Same Element (West)")) {
    const elem = elemA.charAt(0).toUpperCase() + elemA.slice(1);
    elementRelation = `${elem} x ${elem} same element`;
    // Use specific descriptions from astrology charts
    if (elemA === "fire") {
      summary = "Two flames burning bright — passionate, inspiring, and bold. The danger lies only in competing heat.";
    } else if (elemA === "earth") {
      summary = "Grounded and practical. You build together slowly and surely, valuing security and shared purpose.";
    } else if (elemA === "air") {
      summary = "A meeting of minds — communicative, curious, and light-hearted. The spark thrives on ideas and freedom.";
    } else if (elemA === "water") {
      summary = "Deep emotional flow. You understand each other's moods intuitively — soulful, nurturing, and healing.";
    } else {
      summary = `Both share the ${elemA} element, creating natural harmony and understanding. You move in sync with similar energy and rhythm.`;
    }
  } else if (classification.badges.includes("Compatible Elements (West)") || classification.badges.includes("Compatible West Elements")) {
    const elem1 = elemA.charAt(0).toUpperCase() + elemA.slice(1);
    const elem2 = elemB.charAt(0).toUpperCase() + elemB.slice(1);
    elementRelation = `${elem1} x ${elem2} Compatible Elements`;
    // Use specific descriptions from astrology charts
    if ((elemA === "fire" && elemB === "air") || (elemA === "air" && elemB === "fire")) {
      summary = "Air fuels Fire. This match is vibrant, creative, and full of movement — expect fast ideas and shared adventures.";
    } else if ((elemA === "earth" && elemB === "water") || (elemA === "water" && elemB === "earth")) {
      summary = "Water nourishes Earth. Stable and tender, this connection brings emotional depth to practical strength.";
    }
  } else if (classification.badges.includes("Opposite Elements (West)") || classification.badges.includes("Opposite West Elements")) {
    const elem1 = elemA.charAt(0).toUpperCase() + elemA.slice(1);
    const elem2 = elemB.charAt(0).toUpperCase() + elemB.slice(1);
    elementRelation = `${elem1} x ${elem2} opposing elements`;
    // Use specific descriptions from astrology charts
    if ((elemA === "fire" && elemB === "water") || (elemA === "water" && elemB === "fire")) {
      summary = "Steam and storm — intense attraction but turbulent emotions. You must respect each other's pace.";
    } else if ((elemA === "air" && elemB === "earth") || (elemA === "earth" && elemB === "air")) {
      summary = "Different speeds — one seeks change, the other stability. Growth comes through patience and curiosity.";
    } else {
      summary = "Opposing elements create tension and contrast. This can lead to growth through challenge, but requires patience and understanding.";
    }
  } else {
    // Semi-compatible or mixed elements
    const elem1 = elemA ? (elemA.charAt(0).toUpperCase() + elemA.slice(1)) : "";
    const elem2 = elemB ? (elemB.charAt(0).toUpperCase() + elemB.slice(1)) : "";
    // Check for semi-compatible pairs
    if ((elemA === "fire" && elemB === "earth") || (elemA === "earth" && elemB === "fire")) {
      elementRelation = `${elem1} x ${elem2} semi-compatible elements`;
      summary = "Fire's enthusiasm can warm Earth's steadiness, if grounded in respect and timing.";
    } else if ((elemA === "air" && elemB === "water") || (elemA === "water" && elemB === "air")) {
      elementRelation = `${elem1} x ${elem2} semi-compatible elements`;
      summary = "Mind meets emotion — fascinating, if communication stays gentle and open.";
    } else {
      elementRelation = elem1 && elem2 ? `${elem1} x ${elem2} mixed elements` : `${a} × ${b}`;
      summary = "Complementary energies create dynamic balance.";
    }
  }
  
  return {
    title: elementRelation ? `${a} × ${b} — ${elementRelation}` : `${a} × ${b}`,
    summary,
  };
}

// Helper to get Western element from sign
function getWesternElement(sign: string): WesternElement {
  const WEST_ELEMENT: Record<string, WesternElement> = {
    aries: "Fire", leo: "Fire", sagittarius: "Fire",
    taurus: "Earth", virgo: "Earth", capricorn: "Earth",
    gemini: "Air", libra: "Air", aquarius: "Air",
    cancer: "Water", scorpio: "Water", pisces: "Water",
  };
  
  return WEST_ELEMENT[sign.toLowerCase()] || "Fire";
}

// Helper to map pattern from badges to pattern type
function getChinesePatternFromBadges(badges: string[]): "SAN_HE" | "LIU_HE" | "LIU_CHONG" | "LIU_HAI" | "XING" | "PO" | "NONE" {
  if (badges.includes("Same Trine")) return "SAN_HE";
  if (badges.includes("Secret Friend")) return "LIU_HE";
  if (badges.includes("Conflict")) return "LIU_CHONG";
  if (badges.includes("Harm")) return "LIU_HAI";
  if (badges.includes("Punishment")) return "XING";
  if (badges.includes("Break")) return "PO";
  return "NONE";
}

// Calculate score from classification (0-100 scale)
// More conservative scoring - lower base scores and smaller modifier
function calculateScore(classification: Classification, eastA: EastAnimal, eastB: EastAnimal, westA: string, westB: string): number {
  const baseScores: Record<string, number> = {
    soulmate: 92,
    twin_flame: 85,
    excellent: 75,
    very_good: 68,  // Same trine + opposing/non-compatible West - good but not excellent
    sparky_friends: 58,  // Neutral Match (formerly Good Friends) - base score
    opposites_attract: 62,  // Boosted from 52 to ensure > 60% (base 62 + modifier ensures > 60%)
    difficult: 35,
    neutral: 48,
  };
  
  let score = baseScores[classification.tier] || 48;
  
  // Adjust based on classification score (which is a simple numeric)
  // The classification.score is already calculated in the classifier
  // Use smaller modifier scale for more conservative scoring
  score += classification.score * 1.2; // Reduced from 2.0 to 1.2
  
  // Special boost for Opposites Attract to ensure it's always > 60%
  if (classification.tier === "opposites_attract") {
    score = Math.max(score, 61); // Ensure minimum of 61%
  }
  
  // Apply same Chinese sign band (fixed scoring for same animals)
  const elementA = getWesternElement(westA);
  const elementB = getWesternElement(westB);
  const chinesePattern = getChinesePatternFromBadges(classification.badges);
  
  score = applySameChineseSignBand({
    baseScore: score,
    chineseA: capitalizeSign(eastA) as ChineseAnimal,
    chineseB: capitalizeSign(eastB) as ChineseAnimal,
    elementA,
    elementB,
    chinesePattern,
  });
  
  // Clamp to 0-100
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Main adapter function that uses the new classifier
 */
export function computeMatchWithClassifier(
  aWest: string,
  aEast: string,
  bWest: string,
  bEast: string
): ConnectionBoxData {
  // Normalize sign names to lowercase
  const westA = normalizeWestSign(aWest);
  const westB = normalizeWestSign(bWest);
  const eastA = normalizeEastAnimal(aEast);
  const eastB = normalizeEastAnimal(bEast);
  
  // Get classification from new classifier
  const classification = classifyPair(westA, eastA, westB, eastB);
  
  // Map tier to rank key
  const rankKey = TIER_TO_RANK[classification.tier] || "good";  // Changed from "fair" to "good"
  const rankLabel = TIER_TO_LABEL[classification.tier] || "Neutral Match";
  const theme = RANK_THEME[rankKey];
  
  // Calculate score
  const score = calculateScore(classification, eastA, eastB, westA, westB);
  
  // Get Chinese relation description
  const chineseRel = getChineseRelationDescription(eastA, eastB, classification);
  const east_relation = `${capitalizeSign(eastA)} × ${capitalizeSign(eastB)} — ${chineseRel.title}`;
  const east_summary = chineseRel.summary;
  const east_tagline = chineseRel.tagline;
  
  // Get Western relation description
  const westRel = getWesternRelationDescription(westA, westB, classification);
  const west_relation = westRel.title;
  const west_summary = westRel.summary;
  
  // Build tagline
  let tagline = classification.reason || chineseRel.tagline;
  if (classification.tier === "opposites_attract") {
    tagline = "Opposites Attract";
  } else if (classification.tier === "soulmate") {
    tagline = "Perfect Harmony";
  } else if (classification.tier === "twin_flame") {
    tagline = "Twin Flame Connection";
  }
  
  // Combine all badges and tags
  const tags = [...classification.badges];
  if (classification.tier === "opposites_attract") {
    tags.push("⚡ Magnetic Opposites");
  }
  
  return {
    score,
    rankKey,
    rankLabel,
    rank: rankLabel,
    emoji: theme.emoji,
    // Always use TIER_TO_COLOR first, never fall back to theme.colorRgb to avoid old colors
    colorRgb: TIER_TO_COLOR[classification.tier] || TIER_TO_COLOR["neutral"] || "rgb(148, 163, 184)",
    connectionLabel: rankLabel,
    tagline,
    east_tagline,
    east_relation,
    east_summary,
    west_relation,
    west_summary,
    tags,
    notes: classification.badges,
    tier: classification.tier,  // Return the actual tier name (e.g., "soulmate", "twin_flame")
    a: {
      west: capitalizeSign(aWest),
      east: capitalizeSign(aEast),
      westGlyph: getWesternSignGlyph(capitalizeSign(aWest)),
      eastGlyph: getChineseSignGlyph(capitalizeSign(aEast)),
    },
    b: {
      west: capitalizeSign(bWest),
      east: capitalizeSign(bEast),
      westGlyph: getWesternSignGlyph(capitalizeSign(bWest)),
      eastGlyph: getChineseSignGlyph(capitalizeSign(bEast)),
    },
  };
}

