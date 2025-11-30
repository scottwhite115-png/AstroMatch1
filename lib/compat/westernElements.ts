// westernElements.ts

export type Element = 'Fire' | 'Earth' | 'Air' | 'Water';

export type WestRelation =
  | 'same_element'
  | 'compatible_element'
  | 'semi_compatible'
  | 'opposing';

export interface WesternElementInfo {
  elementA: Element;
  elementB: Element;
  relation: WestRelation;
  relationType: string;    // e.g. "same element", "compatible elements"
  headingLine: string;     // e.g. "Aquarius × Pisces — Air + Water (semi-compatible)"
  meaningLine: string;     // e.g. "A thoughtful meeting of logic and intuition..."
}

// ---------------- Sign → Element mapping ----------------

export const SIGN_TO_ELEMENT: Record<string, Element> = {
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

// ---------------- Element relationship logic ----------------

export function getElementRelation(
  elementA: Element,
  elementB: Element
): { relation: WestRelation; relationType: string } {
  if (elementA === elementB) {
    return { relation: 'same_element', relationType: 'same element' };
  }

  // Compatible
  if (
    (elementA === 'Fire' && elementB === 'Air') ||
    (elementA === 'Air' && elementB === 'Fire') ||
    (elementA === 'Water' && elementB === 'Earth') ||
    (elementA === 'Earth' && elementB === 'Water')
  ) {
    return { relation: 'compatible_element', relationType: 'compatible elements' };
  }

  // Semi-compatible
  if (
    (elementA === 'Fire' && elementB === 'Earth') ||
    (elementA === 'Earth' && elementB === 'Fire') ||
    (elementA === 'Air' && elementB === 'Water') ||
    (elementA === 'Water' && elementB === 'Air')
  ) {
    return { relation: 'semi_compatible', relationType: 'semi-compatible elements' };
  }

  // Opposing / difficult combinations
  return { relation: 'opposing', relationType: 'opposing elements' };
}

// ---------------- Specific Sign Pairings ----------------
// Import combined pairings from separate files
import { getWesternPairLines } from "./westernPairLines";

// ---------------- PURE descriptive meanings (Tone E) ----------------

export function getWesternElementMeaning(
  elementA: Element,
  elementB: Element
): string {
  const key = `${elementA}-${elementB}`;

  switch (key) {
    // Same elements
    case 'Fire-Fire':
      return 'A bold, energetic connection with strong chemistry and emotional intensity.';
    case 'Earth-Earth':
      return 'A steady, grounded bond built on reliability, routine, and shared practicality.';
    case 'Air-Air':
      return 'A lively mental connection where ideas flow easily and understanding comes naturally.';
    case 'Water-Water':
      return 'A deep emotional resonance marked by intuition, sensitivity, and unspoken understanding.';

    // Compatible elements
    case 'Fire-Air':
    case 'Air-Fire':
      return 'A bright, expressive energy where inspiration and curiosity constantly spark off each other.';
    case 'Water-Earth':
    case 'Earth-Water':
      return 'A calm, supportive connection where emotional depth meets stability and quiet strength.';

    // Semi-compatible
    case 'Fire-Earth':
    case 'Earth-Fire':
      return 'A dynamic blend of passion and steadiness, drawing heat and structure into the same space.';
    case 'Air-Water':
    case 'Water-Air':
      return 'A thoughtful meeting of logic and intuition, where ideas are coloured by feeling.';

    // Opposing (explicit clashes)
    case 'Fire-Water':
    case 'Water-Fire':
      return 'A powerful, reactive chemistry where emotion and passion amplify each other.';
    case 'Air-Earth':
    case 'Earth-Air':
      return 'A contrast of speed and stillness, bringing together motion, focus, and grounded presence.';

    default:
      return 'A complex blend of different temperaments, creating a layered and multidimensional connection.';
  }
}

// ---------------- Top-level helper for Connection Box ----------------

export function buildWesternSection(
  signA: string,
  signB: string
): WesternElementInfo {
  const elementA = SIGN_TO_ELEMENT[signA];
  const elementB = SIGN_TO_ELEMENT[signB];

  if (!elementA || !elementB) {
    throw new Error(`Unknown signs passed: ${signA}, ${signB}`);
  }

  const { relation, relationType } = getElementRelation(elementA, elementB);
  const meaningLine = getWesternElementMeaning(elementA, elementB);

  const headingLine = `${signA} × ${signB} — ${elementA} + ${elementB} (${relationType})`;

  return {
    elementA,
    elementB,
    relation,
    relationType,
    headingLine,
    meaningLine,
  };
}

export function getWesternPatternLines(
  signA: string,
  signB: string
): { heading: string; description: string } {
  const elementA = SIGN_TO_ELEMENT[signA];
  const elementB = SIGN_TO_ELEMENT[signB];

  if (!elementA || !elementB) {
    throw new Error(`Unknown signs passed: ${signA}, ${signB}`);
  }

  // Check for sign-specific pairings first
  const specificPairing = getWesternPairLines(signA, signB);
  if (specificPairing) {
    return {
      heading: specificPairing.heading,
      description: specificPairing.description,
    };
  }

  // Fall back to element-based descriptions
  const { relationType } = getElementRelation(elementA, elementB);
  const description = getWesternElementMeaning(elementA, elementB);
  
  // Capitalize the relation type (e.g., "compatible elements" → "Compatible Elements")
  const capitalizeRelationType = (rt: string): string => {
    // Handle hyphenated words (e.g., "semi-compatible" → "Semi-Compatible")
    return rt
      .split('-')
      .map(part => 
        part.split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
      )
      .join('-');
  };
  
  const capitalizedRelation = capitalizeRelationType(relationType);
  const heading = `${signA} × ${signB} — ${elementA} + ${elementB}\n(${capitalizedRelation})`;

  return { heading, description };
}
