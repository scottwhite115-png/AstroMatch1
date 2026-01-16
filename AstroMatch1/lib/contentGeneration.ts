// /lib/contentGeneration.ts
// Auto-generate compatibility descriptions based on trine/element patterns

import { TRINE } from './matchExplainAndScore';

// Bitfield flag constants
export const FLAGS = {
  SAME_TRINE: 1,
  SAME_WEST_SIGN: 2,
  SAME_EAST_SIGN: 4,
  COMPATIBLE_ELEMENTS: 16,
  HIGH_SYNERGY: 32,
};

// Element relationships
type ElementRelation = 'same' | 'compatible' | 'semi' | 'conflicting';

interface TrineLabel {
  label: string;
  comment: string;
}

interface ElementLabel {
  label: string;
  comment: string;
}

// Get trine label and comment based on flags and signs
export function getTrineLabel(
  eastA: string,
  eastB: string,
  flags: number
): TrineLabel {
  const aT = TRINE[eastA];
  const bT = TRINE[eastB];
  const sameTrine = aT.group === bT.group;
  const sameSign = eastA === eastB;

  if (sameSign) {
    return {
      label: `${eastA} × ${eastB} — Same Sign (${aT.group})`,
      comment: sameTrine
        ? 'Shared rhythm strengthens mutual understanding.'
        : 'Identical energy; balance independence with connection.',
    };
  }

  if (sameTrine) {
    return {
      label: `${eastA} × ${eastB} — Same Trine (${aT.group})`,
      comment: 'Shared pace and instincts create natural flow.',
    };
  }

  // Cross-trine
  return {
    label: `${eastA} × ${eastB} — Cross Trine (${aT.group} meets ${bT.group})`,
    comment: 'Different rhythms; coordination brings strength.',
  };
}

// Get element label and comment based on relationship
export function getElementLabel(
  westA: string,
  westB: string,
  elemRelation: ElementRelation
): ElementLabel {
  const elemA = getElement(westA);
  const elemB = getElement(westB);
  const sameSign = westA === westB;

  if (elemRelation === 'same') {
    if (sameSign) {
      return {
        label: `${westA} × ${westB} — Same Sign (${elemA})`,
        comment: 'Perfect mirror; nurture growth through shared vision.',
      };
    }
    return {
      label: `${westA} × ${westB} — ${elemA} × ${elemB}`,
      comment: getElementComment(elemA, 'same'),
    };
  }

  if (elemRelation === 'compatible') {
    return {
      label: `${westA} × ${westB} — ${elemA} × ${elemB} (compatible)`,
      comment: getElementComment(elemA, 'compatible', elemB),
    };
  }

  if (elemRelation === 'semi') {
    return {
      label: `${westA} × ${westB} — ${elemA} × ${elemB} (supportive)`,
      comment: getElementComment(elemA, 'semi', elemB),
    };
  }

  // Conflicting
  return {
    label: `${westA} × ${westB} — ${elemA} × ${elemB} (contrast)`,
    comment: getElementComment(elemA, 'conflicting', elemB),
  };
}

// Get element for a sign
function getElement(sign: string): string {
  const ELEM: Record<string, string> = {
    Aries: 'Fire',
    Leo: 'Fire',
    Sagittarius: 'Fire',
    Taurus: 'Earth',
    Virgo: 'Earth',
    Capricorn: 'Earth',
    Gemini: 'Air',
    Libra: 'Air',
    Aquarius: 'Air',
    Cancer: 'Water',
    Scorpio: 'Water',
    Pisces: 'Water',
  };
  return ELEM[sign] || 'Unknown';
}

// Get comment for element relationship
function getElementComment(
  elemA: string,
  relation: string,
  elemB?: string
): string {
  if (relation === 'same') {
    const comments: Record<string, string> = {
      Fire: 'Shared passion; balance intensity with rest.',
      Earth: 'Grounded stability; add spontaneity for vitality.',
      Air: 'Mental harmony; emotional depth completes the bond.',
      Water: 'Emotional resonance; boundaries maintain healthy flow.',
    };
    return comments[elemA] || 'Shared outlook strengthens connection.';
  }

  if (relation === 'compatible') {
    if (elemA === 'Fire' || elemB === 'Air') {
      return 'Fire inspires Air; ideas fuel action naturally.';
    }
    if (elemA === 'Earth' || elemB === 'Water') {
      return 'Earth grounds Water; nurture meets structure.';
    }
    if (elemA === 'Air' || elemB === 'Fire') {
      return 'Air lifts Fire; vision sparks momentum.';
    }
    if (elemA === 'Water' || elemB === 'Earth') {
      return 'Water nourishes Earth; emotion builds security.';
    }
  }

  if (relation === 'semi') {
    if ((elemA === 'Fire' && elemB === 'Earth') || (elemA === 'Earth' && elemB === 'Fire')) {
      return 'Different tempos; patience bridges the gap.';
    }
    if ((elemA === 'Air' && elemB === 'Water') || (elemA === 'Water' && elemB === 'Air')) {
      return 'Logic meets feeling; both perspectives matter.';
    }
  }

  if (relation === 'conflicting') {
    if ((elemA === 'Fire' && elemB === 'Water') || (elemA === 'Water' && elemB === 'Fire')) {
      return 'Passion versus depth; respect differences.';
    }
    if ((elemA === 'Earth' && elemB === 'Air') || (elemA === 'Air' && elemB === 'Earth')) {
      return 'Practicality meets idealism; balance needed.';
    }
  }

  return 'Different strengths complement each other.';
}

// Generate short description (for lower tiers or auto-generated content)
export function shortDescription(
  westA: string,
  eastA: string,
  westB: string,
  eastB: string,
  elemRelation: ElementRelation,
  flags: number
): string {
  const east = getTrineLabel(eastA, eastB, flags);
  const west = getElementLabel(westA, westB, elemRelation);
  return `Different strengths, shared growth. ${east.comment} ${west.comment}`;
}

// Generate tier-appropriate body text
export function generateBodyText(
  score: number,
  sameTrine: boolean,
  elemRelation: ElementRelation,
  sameWestSign: boolean,
  sameEastSign: boolean
): string {
  // Soulmate tier (90-100)
  if (score >= 90) {
    if (sameWestSign && sameEastSign) {
      return 'A perfect mirror. You understand each other instinctively, sharing rhythm, outlook, and natural chemistry. Independence and intimacy balance effortlessly.';
    }
    if (sameTrine && elemRelation === 'same') {
      return 'Maximum alignment. Shared pace and perspective create effortless flow. You inspire growth in each other while maintaining individual authenticity.';
    }
    if (sameTrine && elemRelation === 'compatible') {
      return 'Natural synergy. Different strengths complement seamlessly. The bond feels light yet deeply engaging, with mutual respect as its foundation.';
    }
    return 'Rare harmony. What feels effortless is actually a perfect balance of differences working in concert. Trust and vision align naturally.';
  }

  // Excellent tier (70-84)
  if (score >= 70) {
    if (sameTrine) {
      return 'Strong foundation. You share core rhythm and values. The connection thrives when ideas turn into shared action and communication stays open.';
    }
    if (elemRelation === 'same' || elemRelation === 'compatible') {
      return 'Workable chemistry. Different approaches balance each other well. Respect for differences turns potential friction into creative tension.';
    }
    return 'Solid potential. You appreciate different perspectives and grow through them. Patience and clear communication build lasting trust.';
  }

  // Good tier (55-69)
  if (score >= 55) {
    if (sameTrine) {
      return 'Shared rhythm helps, but execution matters. You understand each other but risk moving too fast or scattering focus. Ground ideas in reality.';
    }
    if (elemRelation === 'same') {
      return 'Similar outlook, but routine can dull spark. Add variety and emotional check-ins to keep the connection fresh and engaged.';
    }
    return 'Workable with effort. Strengths emerge when you honor differences and communicate directly. Small consistent actions build trust.';
  }

  // Learning tier (40-54)
  if (score >= 40) {
    if (sameTrine) {
      return 'Fast chemistry, but shadows surface quickly. What feels familiar can also trigger old patterns. Growth comes through honest self-awareness.';
    }
    if (elemRelation === 'conflicting') {
      return 'Core differences test patience. One seeks what the other avoids. The lesson: integration, not compromise. Meeting in the middle transforms both.';
    }
    return 'Karmic pairing. The attraction reveals what needs healing. Success requires vulnerability, humility, and willingness to learn from friction.';
  }

  // Challenging tier (25-39)
  return 'Fundamental differences. What attracts initially often becomes the source of conflict. Requires exceptional maturity and shared commitment to work.';
}

// Generate headline based on score tier
export function getHeadlineForTier(score: number): string {
  if (score >= 95) return 'Perfect Harmony';
  if (score >= 85) return 'Magnetic Synergy';
  if (score >= 70) return 'Kindred Spirits';
  if (score >= 55) return 'Cosmic Companions';
  if (score >= 40) return 'Karmic Teachers';
  if (score >= 25) return 'Opposite Orbits';
  return 'Crossed Paths';
}

// Generate connection label based on score tier
export function getConnectionLabelForTier(score: number): string {
  if (score >= 95) return 'Destined Union';
  if (score >= 85) return 'Magnetic Synergy';
  if (score >= 70) return 'Excellent Connection';
  if (score >= 55) return 'Good Connection';
  if (score >= 40) return 'Learning Connection';
  if (score >= 25) return 'Challenging Connection';
  return 'Incompatible Connection';
}

// Get tier-appropriate advice phrases
export function getTierAdvice(
  score: number,
  sameTrine: boolean,
  elemRelation: ElementRelation
): { east: string; west: string } {
  // Soulmate tier
  if (score >= 90) {
    const east = sameTrine
      ? 'Natural rhythm; nurture emotional depth alongside mental sync.'
      : 'Different paces blend well; respect boundaries to maintain harmony.';
    
    const west =
      elemRelation === 'same'
        ? 'Shared outlook; remember to grow individually too.'
        : 'Complementary strengths; celebrate differences as assets.';
    
    return { east, west };
  }

  // Excellent tier
  if (score >= 70) {
    const east = sameTrine
      ? 'Shared goals; channel energy collaboratively, not competitively.'
      : 'Different rhythms; align priorities early for smoother flow.';
    
    const west =
      elemRelation === 'same'
        ? 'Similar styles; add variety to prevent routine fatigue.'
        : elemRelation === 'compatible'
        ? 'Natural balance; keep communication clear during stress.'
        : 'Workable contrast; patience builds understanding.';
    
    return { east, west };
  }

  // Good tier
  if (score >= 55) {
    const east = sameTrine
      ? 'Quick connection; ground momentum with follow-through.'
      : 'Different tempos; coordinate direction to stay aligned.';
    
    const west =
      elemRelation === 'same'
        ? 'Shared mode; emotional check-ins prevent complacency.'
        : elemRelation === 'conflicting'
        ? 'Contrasting needs; respect differences, avoid fixing.'
        : 'Different but workable; patience smooths friction.';
    
    return { east, west };
  }

  // Learning tier
  if (score >= 40) {
    const east = sameTrine
      ? 'Familiar patterns; awareness prevents old habits.'
      : 'Divergent rhythms; honesty clears hidden tension.';
    
    const west =
      elemRelation === 'conflicting'
        ? 'Opposite modes; the lesson is integration, not victory.'
        : 'Different styles; vulnerability builds trust.';
    
    return { east, west };
  }

  // Challenging tier
  return {
    east: 'Fundamental differences; exceptional patience required.',
    west: 'Contrasting needs; shared values must be strong.',
  };
}

// Complete auto-generation function
export function generateCompatibilityContent(
  westA: string,
  eastA: string,
  westB: string,
  eastB: string,
  score: number,
  sameTrine: boolean,
  elemRelation: ElementRelation,
  sameWestSign: boolean,
  sameEastSign: boolean,
  flags: number
) {
  const headline = getHeadlineForTier(score);
  const connectionLabel = getConnectionLabelForTier(score);
  const body = generateBodyText(score, sameTrine, elemRelation, sameWestSign, sameEastSign);
  const eastLabel = getTrineLabel(eastA, eastB, flags);
  const westLabel = getElementLabel(westA, westB, elemRelation);
  const advice = getTierAdvice(score, sameTrine, elemRelation);

  return {
    headline,
    connectionLabel,
    body,
    east_west_notes: {
      east: {
        label: eastLabel.label,
        text: advice.east,
      },
      west: {
        label: westLabel.label,
        text: advice.west,
      },
    },
  };
}

