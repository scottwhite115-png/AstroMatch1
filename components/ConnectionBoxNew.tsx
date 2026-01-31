// ConnectionBoxNew - Backward Compatible Adapter for New ConnectionBox Design
// This component accepts both old tier-based props and new base/overlay pattern props

import React from "react";
import { ConnectionBox } from "./ConnectionBox";
import type {
  MatchTier,
  ChinesePattern,
  WestAspect,
  WestElementRelation,
  ChineseAnimal,
} from "@/lib/matchEngine";
import { getWesternSignGlyph, getChineseSignGlyph } from "@/lib/zodiacHelpers";
import type { SanHeTrineName } from "@/lib/matchEngineEnhanced";
import { 
  detectBasePattern,
  detectOverlayPatterns,
  areOppositeBranches,
  normalizeChineseAnimal
} from "@/lib/matchEngineEnhanced";
import { 
  getChineseDetailedCompat, 
  getWesternDetailedCompat 
} from "@/data/detailedCompatDescriptions";

// Helper to map WestElementRelation to element type
function getElementFromSign(sign: string): "Fire" | "Earth" | "Air" | "Water" {
  const signLower = sign.toLowerCase();
  
  // Fire signs
  if (["aries", "leo", "sagittarius"].includes(signLower)) return "Fire";
  // Earth signs
  if (["taurus", "virgo", "capricorn"].includes(signLower)) return "Earth";
  // Air signs
  if (["gemini", "libra", "aquarius"].includes(signLower)) return "Air";
  // Water signs
  if (["cancer", "scorpio", "pisces"].includes(signLower)) return "Water";
  
  return "Fire"; // fallback
}

interface ConnectionBoxNewProps {
  tier: MatchTier;
  score: number;
  westA: string;
  eastA: string;
  westB: string;
  eastB: string;
  chineseLine: string;
  sunMatchBlurb: string;
  westernLine: string;
  wuXingLine?: string;
  connectionBlurb?: string;
  theme?: "light" | "dark";
  chineseElementA?: string;
  chineseElementB?: string;
  aboutMe?: string;
  age?: number;
  city?: string;
  occupation?: string;
  height?: string;
  children?: string;
  religion?: string;
  interests?: {[category: string]: string[]};
  relationshipGoals?: string[];
  chinesePattern?: ChinesePattern;
  westAspect?: WestAspect;
  westElementRelation?: WestElementRelation;
  isChineseOpposite?: boolean;
  isLivelyPair?: boolean;
  westCompatStars?: number;
  eastCompatStars?: number;
  patternFullLabel?: string;
  pillLabel?: string;
  baseTagline?: string;
  patternEmoji?: string;
  pattern?: string;
  chemistryStars?: number;
  stabilityStars?: number;
  patternColors?: { start: string; end: string };
  patternLabelEn?: string;
  patternLabelZh?: string;
  patternTagline?: string;
  connectionOverview?: string;
  showProfile?: boolean;
  showElements?: boolean;
  onPass?: () => void;
  onLike?: () => void;
  onMessage?: () => void;
  onViewProfile?: () => void;
}

export const ConnectionBoxNew: React.FC<ConnectionBoxNewProps> = (props) => {
  const {
    westA,
    eastA,
    westB,
    eastB,
    score,
    connectionBlurb,
    aboutMe,
    theme = "dark",
    chinesePattern,
    isChineseOpposite = false,
  } = props;

  // Normalize Chinese animals
  const animalA = normalizeChineseAnimal(eastA);
  const animalB = normalizeChineseAnimal(eastB);

  // Detect ALL patterns from actual animals (not just from chinesePattern string)
  // This ensures we get ALL patterns: base + all overlays
  const { basePattern, sanHeTrineName } = detectBasePattern(animalA, animalB);
  const overlays = detectOverlayPatterns(animalA, animalB);
  const isOppositeBranches = areOppositeBranches(animalA, animalB);

  // Get Western elements from signs
  const elementA = getElementFromSign(westA);
  const elementB = getElementFromSign(westB);

  // Build sign labels
  const userASignLabel = `${westA} / ${eastA}`;
  const userBSignLabel = `${westB} / ${eastB}`;

  // Get icons
  const userAWestIcon = getWesternSignGlyph(westA);
  const userAChineseIcon = getChineseSignGlyph(eastA);
  const userBWestIcon = getWesternSignGlyph(westB);
  const userBChineseIcon = getChineseSignGlyph(eastB);

  // Get compatibility descriptions from detailed compat data
  // Use normalized/lowercased sign names to ensure proper lookup
  const chineseCompat = getChineseDetailedCompat(animalA.toLowerCase(), animalB.toLowerCase());
  const westernCompat = getWesternDetailedCompat(westA.toLowerCase(), westB.toLowerCase());
  
  console.log('[ConnectionBoxNew] Lookup params:', {
    animalA: animalA.toLowerCase(),
    animalB: animalB.toLowerCase(),
    westA: westA.toLowerCase(),
    westB: westB.toLowerCase(),
    chineseCompat: chineseCompat ? 'FOUND' : 'NULL',
    westernCompat: westernCompat ? 'FOUND' : 'NULL',
  });

  // Chinese Zodiac Compatibility
  let connectionOverviewHeading = "";
  let connectionOverviewTagline = "";
  let connectionOverviewText = "";
  
  if (chineseCompat) {
    connectionOverviewHeading = chineseCompat.heading;
    connectionOverviewTagline = chineseCompat.tagline;
    connectionOverviewText = chineseCompat.description;
    console.log('[ConnectionBoxNew] Chinese compat data:', {
      heading: connectionOverviewHeading,
      tagline: connectionOverviewTagline,
      text: connectionOverviewText,
      animalA,
      animalB,
    });
  } else {
    // Fallback: Show at least the pattern information
    connectionOverviewHeading = `${animalA} × ${animalB} — ${basePattern}`;
    connectionOverviewTagline = "Click for details";
    connectionOverviewText = `${animalA} and ${animalB} compatibility information. Base pattern: ${basePattern}${overlays.length > 0 ? `, overlays: ${overlays.join(', ')}` : ''}.`;
    console.log('[ConnectionBoxNew] No detailed compat found, using fallback for:', animalA, animalB);
  }
  
  // REMOVED: Fallback to connectionBlurb - we don't want pattern one-liners displayed
  
  // Western Sun Sign Compatibility (separate section)
  const westernCompatibilityHeading = westernCompat?.heading || "";
  const westernCompatibilityTagline = westernCompat?.tagline || "";
  const westernCompatibilityDescription = westernCompat?.description || "";

  // Build about partner text
  const aboutPartnerText = aboutMe || "";

  // Check if same Western sign
  const sameWesternSign = westA.toLowerCase() === westB.toLowerCase();
  
  // Check if same Chinese animal
  const sameChineseAnimal = eastA.toLowerCase() === eastB.toLowerCase();

  return (
    <ConnectionBox
      userAName="You"
      userBName="Match"
      userASignLabel={userASignLabel}
      userBSignLabel={userBSignLabel}
      userAWestIcon={userAWestIcon}
      userAChineseIcon={userAChineseIcon}
      userBWestIcon={userBWestIcon}
      userBChineseIcon={userBChineseIcon}
      score={score}
      basePattern={basePattern}
      overlays={overlays}
      sanHeTrineName={sanHeTrineName}
      isOppositeBranches={isOppositeBranches || isChineseOpposite}
      sameChineseAnimal={sameChineseAnimal}
      sameWesternSign={sameWesternSign}
      elements={{
        a: elementA,
        b: elementB,
      }}
      connectionOverviewText={connectionOverviewText}
      connectionOverviewHeading={connectionOverviewHeading}
      connectionOverviewTagline={connectionOverviewTagline}
      westernCompatibilityHeading={westernCompatibilityHeading}
      westernCompatibilityTagline={westernCompatibilityTagline}
      westernCompatibilityDescription={westernCompatibilityDescription}
      westernSignA={westA}
      westernSignB={westB}
      westernElementA={elementA}
      westernElementB={elementB}
      aboutPartnerText={aboutPartnerText}
      age={props.age}
      city={props.city}
      occupation={props.occupation}
      height={props.height}
      children={props.children}
      interests={props.interests}
      relationshipGoals={props.relationshipGoals}
      theme={theme}
      patternColors={props.patternColors}
      onMessage={props.onMessage}
      onPass={props.onPass}
      onLike={props.onLike}
      showProfile={props.showProfile}
      showElements={props.showElements}
    />
  );
};
