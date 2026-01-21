// /lib/classifierAdapter.ts
// Adapter to integrate the new astroMatchClassifier with the existing match engine system

import { classifyPair, type WestSign, type EastAnimal, type Classification } from '@/engine/astroMatchClassifier';
import { RANK_THEME, type RankKey } from '@/data/rankTheme';
import { getWesternSignGlyph, getChineseSignGlyph, capitalizeSign } from '@/lib/zodiacHelpers';
import type { ConnectionBoxData } from '@/components/ConnectionBoxSimple';

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
const TIER_TO_LABEL: Record<string, string> = {
  soulmate: "Soulmate Match",
  twin_flame: "Twin Flame Match",
  excellent: "Excellent Match",
  very_good: "Excellent Match",  // Same trine + opposing/semi-compatible West
  sparky_friends: "Good Friends",
  opposites_attract: "Opposites Attract",
  difficult: "Difficult Match",
  neutral: "Neutral Match",
};

// Map new classifier tiers to colors
const TIER_TO_COLOR: Record<string, string> = {
  soulmate: "rgb(212, 175, 55)",      // Gold
  twin_flame: "rgb(255, 140, 0)",    // Astromatch Orange (bright orange)
  excellent: "rgb(219, 39, 119)",     // Hot Pink (more vibrant)
  very_good: "rgb(219, 39, 119)",     // Hot Pink (same as excellent since both show "Excellent Match")
  sparky_friends: "rgb(59, 130, 246)", // Blue
  opposites_attract: "rgb(239, 68, 68)", // Red
  difficult: "rgb(239, 68, 68)",      // Red
  neutral: "rgb(148, 163, 184)",      // Slate
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
    const trineGroups: Record<string, string> = {
      rat: "Visionaries", dragon: "Visionaries", monkey: "Visionaries",
      ox: "Strategists", snake: "Strategists", rooster: "Strategists",
      tiger: "Adventurers", horse: "Adventurers", dog: "Adventurers",
      rabbit: "Artists", goat: "Artists", pig: "Artists",
    };
    const group = trineGroups[eastA] || "Compatible";
    return {
      title: `Same Trine – ${group}`,
      tagline: classification.tier === "soulmate" ? "Perfect harmony" : "Natural alignment",
      summary: `You share the same trine (${group}), creating natural harmony and understanding. This connection flows with ease and mutual respect.`,
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
      summary: "You are magnetic opposites. This creates intense attraction and chemistry, but requires maturity, patience, and balance to thrive.",
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
    return {
      title: "Lively Pair",
      tagline: "Dynamic energy with potential challenges",
      summary: "You share a lively connection with dynamic energy. This can be exciting but may require effort to maintain balance and harmony.",
    };
  }
  
  return {
    title: `${a} × ${b}`,
    tagline: "Mixed connection",
    summary: "This connection has mixed signals. Compatibility depends on timing, effort, and mutual understanding.",
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
  
  if (classification.badges.includes("Same Element (West)")) {
    elementRelation = `Same Element: ${elemA.charAt(0).toUpperCase() + elemA.slice(1)}`;
    summary = `Both share the ${elemA} element, creating natural harmony and understanding. You move in sync with similar energy and rhythm.`;
  } else if (classification.badges.includes("Compatible Elements (West)")) {
    elementRelation = `Compatible Elements: ${elemA.charAt(0).toUpperCase() + elemA.slice(1)} ↔ ${elemB.charAt(0).toUpperCase() + elemB.slice(1)}`;
    if ((elemA === "fire" && elemB === "air") || (elemA === "air" && elemB === "fire")) {
      summary = "Air fuels Fire. Vibrant, creative, and full of movement — expect fast ideas and shared adventures.";
    } else if ((elemA === "earth" && elemB === "water") || (elemA === "water" && elemB === "earth")) {
      summary = "Water nourishes Earth. Stable and tender, this connection brings emotional depth to practical strength.";
    }
  } else if (classification.badges.includes("Opposite Elements (West)")) {
    elementRelation = `Opposite Elements: ${elemA.charAt(0).toUpperCase() + elemA.slice(1)} ↔ ${elemB.charAt(0).toUpperCase() + elemB.slice(1)}`;
    summary = "Opposing elements create tension and contrast. This can lead to growth through challenge, but requires patience and understanding.";
  } else {
    elementRelation = `${a} × ${b}`;
    summary = "Complementary energies create dynamic balance.";
  }
  
  return {
    title: elementRelation ? `${a} × ${b} — ${elementRelation}` : `${a} × ${b}`,
    summary,
  };
}

// Calculate score from classification (0-100 scale)
// More conservative scoring - lower base scores and smaller modifier
function calculateScore(classification: Classification): number {
  const baseScores: Record<string, number> = {
    soulmate: 92,
    twin_flame: 85,
    excellent: 75,
    very_good: 68,  // Same trine + opposing/non-compatible West - good but not excellent
    sparky_friends: 58,  // Good Friends - base score
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
  const score = calculateScore(classification);
  
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

