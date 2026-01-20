// /components/ConnectionBoxSimple.tsx

"use client";

import React, { useState } from "react";
import type { RankKey } from "@/data/rankTheme";
import { useTheme } from "@/contexts/ThemeContext";
import type { Tier } from "@/engine/labels";
import { TIER_LABEL } from "@/engine/labels";
import type { MatchResult as AstroMatchResult } from "@/engine/astromatch-engine";
import type { ChinesePattern, WestAspect, WestElementRelation, WuXing } from "@/src/lib/matchEngine";
import { getWesternPairLines } from "@/lib/compat/westernPairLines";
import { getChinesePairLines } from "@/lib/compat/chinesePairLines";
import { getChineseConnectionOverview } from "@/lib/compat/chineseConnectionOverview";
import { deriveChinesePatternId, patternResultToFlags } from "@/lib/compat/matchChinesePattern";
import { getChinesePatternResult, type ChineseAnimal as ChineseAnimalId } from "@/lib/compat/engine";
import { getChineseConnectionBlurb } from "@/lib/compat/chineseConnectionBlurbs";
import { getConnectionBoxWestEntry } from "@/data/connectionBoxWest";
import { getWestCompatibilitySummary, type WestSign as WestSignCompat } from "@/data/westCompatibility";
import { getChinesePatternLabel, type ChineseAnimal as ChineseAnimalPattern } from "@/data/chinesePatterns";
import { getPatternHeading, getPatternPillLabel } from "@/lib/astrology/patternLabels";
import { getElementPairLine } from "@/lib/chineseElements";
import type { ChineseElement, ChineseAnimal } from "@/lib/chineseZodiac";
import { CHINESE_ANIMAL_CHAR, CHINESE_ELEMENT_CHAR } from "@/lib/chineseZodiac";
import { WEST_SIGN_SYMBOL, WEST_SIGN_ELEMENT } from "@/lib/westernZodiac";
import type { WestSign } from "@/lib/westernZodiac";
import { matchLabelTaglines } from "@/data/matchLabels";
import type { MatchLabel } from "@/data/matchLabels";
import { MATCH_LABEL_COLOR_CLASSES } from "@/data/matchLabelStyles";
import { StarRating } from "@/components/StarRating";
import { getChineseDetailedCompat, getWesternDetailedCompat } from "@/data/detailedCompatDescriptions";

const labelOverrides: Record<string, string> = {
  "Soulmate Connection": "Soulmate Match",
  "Soulmate Match": "Soulmate Match",
  "Soulmate": "Soulmate Match",
  "Twin Flame Connection": "Twin Flame Match",
  "Twin Flame Match": "Twin Flame Match",
  "Twin Flame": "Twin Flame Match",
  "Destined Harmony": "Destined Harmony",
  "Magnetic Connection": "Magnetic Connection",
  "Excellent Match": "Excellent Match",
  "Excellent": "Excellent Match",
  "Very Good Match": "Excellent Match",
  "Very Good": "Excellent Match",
  "Favourable Match": "Favourable Match",
  "Favourable": "Favourable Match",
  "Good Match": "Neutral Match",
  "Compatible Match": "Compatible Match",
  "Good Connection": "Neutral Match",
  "Good": "Neutral Match",
  "Sparky Friends": "Neutral Match",
  "Sparky Friends Match": "Neutral Match",
  "Good Friends": "Neutral Match",
  "Good Friends Match": "Neutral Match",
  "Opposites Attract": "Opposites Attract",
  "Opposites Attract Match": "Opposites Attract",
  "Mixed Match": "Mixed Match",
  // Removed "Fair Match" - no longer used in new classifier
  "Learning Match": "Learning Match",
  "Neutral Connection": "Neutral Match",
  "Neutral Match": "Neutral Match",
  "Neutral": "Neutral Match",
  "Challenging Connection": "Challenging Match",
  "Challenging Match": "Challenging Match",
  "Challenging": "Challenging Match",
  "Incompatible Match": "Incompatible Match",
  "Difficult Connection": "Difficult Match",
  "Difficult Match": "Difficult Match",
  "Difficult": "Difficult Match",
};

// Helper to remove "Match" from tier labels for display
function formatTierLabel(tier: string): string {
  return tier.replace(/\s+Match$/i, '').trim();
}

const ASPECT_LABELS: Record<AstroMatchResult["western"]["aspect"], string> = {
  same: "Conjunct",
  trine: "Trine",
  sextile: "Sextile",
  square: "Square",
  "semi-sextile": "Semi-sextile",
  quincunx: "Quincunx",
  opposite: "Opposite",
};

const ELEMENT_RELATIONS: Record<AstroMatchResult["western"]["elements"]["relation"], string> = {
  same: "Same Element",
  compatible: "Compatible Elements",
  incompatible: "Contrasting Elements",
};

const CHINESE_RELATION_LABEL: Record<AstroMatchResult["chinese"]["relation"], string> = {
  "same-animal": "Same animal pair",
  "same-trine": "Same trine alliance",
  supportive: "Supportive partners",
  opposite: "Magnetic opposites",
  damage: "Six damages",
  none: "Neutral alignment",
};

function firstSentence(text?: string): string | null {
  if (!text) return null;
  const trimmed = text.trim();
  if (!trimmed) return null;
  const dotIndex = trimmed.indexOf(".");
  if (dotIndex === -1 || dotIndex > 280) {
    // No full stop or very long first sentence – just take a safe slice
    return trimmed.slice(0, 220).trim() + (trimmed.length > 220 ? "..." : "");
  }
  return trimmed.slice(0, dotIndex + 1).trim();
}

// Utility function to limit text to approximately 2 lines (~120 characters or 2 sentences, whichever is shorter)
function limitToTwoLines(text: string): string {
  if (!text) return text;
  
  // First try to limit by character count (approximately 2 lines)
  if (text.length <= 120) {
    return text;
  }
  
  // If longer, try to limit to 2 sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  
  if (sentences.length <= 2) {
    // If 2 sentences are still too long, truncate to ~120 characters
    if (sentences.join(' ').length > 120) {
      return text.substring(0, 120).trim() + (text.length > 120 ? '...' : '');
    }
    return sentences.join(' ').trim();
  }
  
  // Return first 2 sentences, but cap at ~120 characters
  const twoSentences = sentences.slice(0, 2).join(' ').trim();
  if (twoSentences.length > 120) {
    return twoSentences.substring(0, 120).trim() + '...';
  }
  
  return twoSentences;
}

// Helper function to make Chinese pattern names and symbols bold
function makeChinesePatternsBold(text: string): React.ReactNode {
  if (!text) return text;
  
  // Pattern names and their Chinese symbols to make bold
  const patterns = [
    { name: 'San He', symbol: '三合' },
    { name: 'Liu He', symbol: '六合' },
    { name: 'Liu Chong', symbol: '六冲' },
    { name: 'Liu Hai', symbol: '六害' },
    { name: 'Xing', symbol: '刑' },
    { name: 'Po', symbol: '破' },
  ];
  
  // Create a regex pattern that matches each pattern name followed by its symbol
  // This handles cases like "San He 三合" or "Liu Chong 六冲"
  let result: React.ReactNode[] = [];
  let lastIndex = 0;
  let textToProcess = text;
  
  // Find all matches and their positions
  const matches: Array<{ start: number; end: number; pattern: string }> = [];
  
  patterns.forEach(({ name, symbol }) => {
    // Match pattern name followed by symbol (with optional space)
    const regex = new RegExp(`(${name}\\s*${symbol})`, 'g');
    let match;
    while ((match = regex.exec(textToProcess)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        pattern: match[0],
      });
    }
  });
  
  // Sort matches by start position
  matches.sort((a, b) => a.start - b.start);
  
  // Remove overlapping matches (keep the first one)
  const nonOverlappingMatches: Array<{ start: number; end: number; pattern: string }> = [];
  matches.forEach((match) => {
    const overlaps = nonOverlappingMatches.some(
      (existing) => !(match.end <= existing.start || match.start >= existing.end)
    );
    if (!overlaps) {
      nonOverlappingMatches.push(match);
    }
  });
  
  // Build the result array with text segments and bold pattern names
  nonOverlappingMatches.forEach((match) => {
    // Add text before the match
    if (match.start > lastIndex) {
      result.push(textToProcess.substring(lastIndex, match.start));
    }
    // Add the bold pattern name
    result.push(<strong key={`bold-${match.start}`}>{match.pattern}</strong>);
    lastIndex = match.end;
  });
  
  // Add remaining text
  if (lastIndex < textToProcess.length) {
    result.push(textToProcess.substring(lastIndex));
  }
  
  // If no matches found, return original text
  if (result.length === 0) {
    return text;
  }
  
  return <>{result}</>;
}

export interface ConnectionBoxData {
  score: number;
  rank: string;
  rankLabel?: string;
  rankKey?: RankKey;  // Add optional rankKey for theme lookup
  emoji: string;
  colorRgb: string;
  connectionLabel: string;
  tagline?: string; // Optional tagline for UI badge
  east_tagline?: string; // Optional Chinese compatibility tagline
  tags?: string[];
  insight?: string; // NEW: Optional insight paragraph
  longformBody?: string; // NEW: Longform detailed description
  hasOverride?: boolean; // NEW: Flag for override scores
  hasLongform?: boolean; // NEW: Flag for longform content
  east_relation: string;
  east_summary: string;
  east_description?: string; // Pattern-specific description for Chinese compatibility
  east_tagline?: string; // NEW: Tagline from detailed compatibility (e.g. "Action and antics")
  west_relation: string;
  west_summary: string;
  west_description?: string; // Western element meaning description
  west_tagline?: string; // NEW: Tagline from detailed compatibility (e.g. "Systems and ideas")
  wuXingLine?: string; // NEW: Wu Xing (Five Elements) harmony line
  westernSignLine?: string; // Western sun-sign specific blurb
  // NEW: Match engine result fields
  pillLabel?: string; // e.g. "92% · Triple Harmony" - for photo carousel pill
  patternFullLabel?: string; // e.g. "🌟 San He 三合 · Triple Harmony · 92%" - for dropdown header
  baseTagline?: string; // Pattern explanation line - for dropdown description
  patternEmoji?: string; // Pattern emoji for display
  pattern?: string; // ChinesePattern type - for gradient lookup
  chemistryStars?: number; // 0–5 in 0.5 steps - for star rating display
  stabilityStars?: number; // 0–5 in 0.5 steps - for star rating display
  card?: import('@/lib/cardOverlay').CardOverlay; // NEW: Playing card overlay for photo carousel
  a: { west: string; east: string; westGlyph: string; eastGlyph: string; chineseElement?: string };
  b: { west: string; east: string; westGlyph: string; eastGlyph: string; chineseElement?: string };
  tier?: Tier;
  // Profile sections
  aboutMeText?: string;
  selectedDeepPrompts?: string[];
  deepPromptAnswers?: {[key: string]: string};
  selectedRelationshipGoals?: string[];
  selectedOrganizedInterests?: {[category: string]: string[]};
  // Essentials
  age?: number;
  occupation?: string;
  city?: string;
  distance?: number; // Distance in kilometers
  height?: string;
  children?: string;
  religion?: string;
  astroMatch?: AstroMatchResult;
  // Pattern fields for taglines
  chinesePattern?: ChinesePattern;
  westAspect?: WestAspect;
  westElementRelation?: WestElementRelation;
  isChineseOpposite?: boolean;
  isLivelyPair?: boolean;
  wuXingA?: WuXing; // Wu Xing element for User A
  wuXingB?: WuXing; // Wu Xing element for User B
  // NEW: Connection UI fields for ConnectionBoxTop component
  connectionUI?: {
    primaryLabel: string;
    chineseBase: import('@/lib/connectionUi').ChineseBasePattern;
    chineseOverlays: import('@/lib/connectionUi').ChineseOverlayPattern[];
    westernRelation: import('@/lib/connectionUi').WesternElementRelation;
  };
}

interface ConnectionBoxSimpleProps {
  data: ConnectionBoxData;
  alwaysExpanded?: boolean;
  hideHeader?: boolean; // Hide the emoji, rank, and score header
}

export default function ConnectionBoxSimple({ data, alwaysExpanded = false, hideHeader = false }: ConnectionBoxSimpleProps) {
  const [showWuXing, setShowWuXing] = useState(false);
  const [showProfile, setShowProfile] = useState(true); // New state for profile toggle
  
  // DEBUG: Log the data to see what's available
  console.log('[ConnectionBoxSimple] Received data:', {
    patternFullLabel: data.patternFullLabel,
    baseTagline: data.baseTagline,
    chemistryStars: data.chemistryStars,
    stabilityStars: data.stabilityStars,
    pattern: data.pattern,
    pillLabel: data.pillLabel,
    hasAllFields: !!(data.patternFullLabel && data.baseTagline),
  });
  
  // Use precomputed lines from data if available, otherwise fall back to computing them
  const west = data.west_relation 
    ? { heading: data.west_relation, description: data.west_summary || data.west_description || '' }
    : (data.a?.west && data.b?.west 
        ? getWesternPairLines(data.a.west, data.b.west)
        : null);
  
  // Use precomputed Chinese lines from data if available, otherwise fall back to computing them
  const chinese = data.east_relation
    ? { heading: data.east_relation, description: data.east_summary || '' }
    : (data.a?.east && data.b?.east 
        ? getChinesePairLines(data.a.east, data.b.east)
        : null);
  
  // Get Chinese connection overview using new pattern system
  const chineseOverview = (() => {
    if (!data.a?.east || !data.b?.east) return null;
    
    try {
      const animalA = data.a.east.toLowerCase() as ChineseAnimalId;
      const animalB = data.b.east.toLowerCase() as ChineseAnimalId;
      const patternResult = getChinesePatternResult(animalA, animalB);
      const flags = patternResultToFlags(patternResult, animalA, animalB);
      const patternId = deriveChinesePatternId(flags);
      return getChineseConnectionOverview(patternId);
    } catch (error) {
      console.error('[ConnectionBox] Error generating Chinese overview:', error);
      return null;
    }
  })();
  
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(alwaysExpanded);
  const astroMatch = data.astroMatch;
  // Helper to capitalize first letter
  const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Get Chinese blurb from new backend
  const chineseBlurb = data.a?.east && data.b?.east
    ? getChineseConnectionBlurb(
        capitalize(data.a.east) as ChineseAnimal,
        capitalize(data.b.east) as ChineseAnimal
      )
    : null;

  // NEW: Get Chinese pattern label using the cleaner helper
  const chinesePatternLabel = data.a?.east && data.b?.east
    ? getChinesePatternLabel(
        capitalize(data.a.east) as ChineseAnimalPattern,
        capitalize(data.b.east) as ChineseAnimalPattern
      )
    : null;

  // Get Chinese pattern info
  const chinesePattern = (() => {
    if (!data.a?.east || !data.b?.east) return null;
    try {
      const animalA = data.a.east.toLowerCase() as ChineseAnimalId;
      const animalB = data.b.east.toLowerCase() as ChineseAnimalId;
      const patternResult = getChinesePatternResult(animalA, animalB);
      const flags = patternResultToFlags(patternResult, animalA, animalB);
      const patternId = deriveChinesePatternId(flags);
      const overview = getChineseConnectionOverview(patternId);
      return overview;
    } catch (error) {
      console.error('[ConnectionBox] Error getting Chinese pattern:', error);
      return null;
    }
  })();

  const westBoxBlurb =
    data.a?.west && data.b?.west
      ? (() => {
          try {
            const signA = capitalize(data.a.west) as WestSign;
            const signB = capitalize(data.b.west) as WestSign;
            console.log('[ConnectionBox] Looking up West entry for:', signA, signB);
            const result = getConnectionBoxWestEntry(signA, signB);
            if (result) {
              console.log('[ConnectionBox] Found West entry:', result);
            } else {
              console.warn('[ConnectionBox] No West entry found for:', signA, signB, 'Raw values:', data.a.west, data.b.west);
            }
            return result;
          } catch (error) {
            console.error('[ConnectionBox] Error getting West entry:', error instanceof Error ? error.message : String(error), 'Raw values:', data.a.west, data.b.west);
            return null;
          }
        })()
      : null;
  
  // NEW: Get Western compatibility using the cleaner helper
  const westSummary = data.a?.west && data.b?.west
    ? getWestCompatibilitySummary(
        capitalize(data.a.west) as WestSignCompat,
        capitalize(data.b.west) as WestSignCompat
      )
    : null;
  
  const chineseHeading =
    data.east_relation ||  // PRIORITIZE precomputed beautiful line from new engine
    (chinesePatternLabel && data.a?.east && data.b?.east
      ? `${data.a.east} × ${data.b.east} — ${chinesePatternLabel}`
      : null) ||
    (chinesePattern && data.a?.east && data.b?.east
      ? `${data.a.east} × ${data.b.east} — ${chinesePattern.patternLabel}`
      : null) ||
    chinese?.heading;
  
  const chineseDescription =
    chineseBlurb ||
    data.east_summary ||
    data.east_description ||
    chinese?.description;
  
  // Debug logging
  if (chinesePatternLabel) {
    console.log('[ConnectionBox] Using NEW chinesePatterns helper:', chinesePatternLabel);
  }
  if (chineseBlurb) {
    console.log('[ConnectionBox] Using NEW Chinese blurb:', chineseBlurb);
  } else {
    console.log('[ConnectionBox] Using FALLBACK Chinese data:', { heading: chineseHeading, description: chineseDescription });
  }
  
  // Calculate Chinese element compatibility if both elements are available
  const chineseElementPair = (() => {
    if (!data.a?.chineseElement || !data.b?.chineseElement) return null;
    try {
      return getElementPairLine(
        data.a.chineseElement as ChineseElement,
        data.b.chineseElement as ChineseElement
      );
    } catch (error) {
      console.error('[ConnectionBox] Error calculating Chinese element compatibility:', error);
      return null;
    }
  })();
  const westHeading =
    data.west_relation ||  // PRIORITIZE precomputed beautiful line from new engine
    westSummary?.heading ||
    (westBoxBlurb
      ? `${data.a.west} × ${data.b.west} — ${westBoxBlurb.tagline}`
      : null) ||
    west?.heading;
  const westElementLabel = westSummary?.elementLabel || westBoxBlurb?.elementLabel;
  const westDescription =
    westSummary?.blurb ||
    westBoxBlurb?.description ||
    data.west_summary ||
    data.west_description ||
    west?.description;
  
  // Debug logging
  if (westSummary) {
    console.log('[ConnectionBox] Using NEW westCompatibility helper:', westSummary);
  } else if (westBoxBlurb) {
    console.log('[ConnectionBox] Using legacy West data:', { heading: westHeading, elementLabel: westElementLabel, description: westDescription });
  } else {
    console.log('[ConnectionBox] Using FALLBACK West data:', { heading: westHeading, description: westDescription });
  }
  
  // Get detailed compatibility descriptions from Astrolab pages (same as CompatibilitySection)
  // PRIORITY: Use detailed compat data as the primary source for connection overview
  const chineseDetailedCompat = data.a?.east && data.b?.east
    ? getChineseDetailedCompat(
        data.a.east.toLowerCase().trim(),
        data.b.east.toLowerCase().trim()
      )
    : null;
  
  const westernDetailedCompat = data.a?.west && data.b?.west
    ? getWesternDetailedCompat(
        data.a.west.toLowerCase().trim(),
        data.b.west.toLowerCase().trim()
      )
    : null;
  
  // Filter out specific combinations that should not be shown (same exclusions as ConnectionBox)
  const shouldExcludeChinese = chineseDetailedCompat && (
    chineseDetailedCompat.heading.includes("Monkey × Rooster") ||
    chineseDetailedCompat.heading.includes("Rooster × Monkey")
  );
  const shouldExcludeWestern = westernDetailedCompat && (
    westernDetailedCompat.heading.includes("Aquarius × Aries") ||
    westernDetailedCompat.heading.includes("Aries × Aquarius")
  );
  
  const finalChineseDetailedCompat = shouldExcludeChinese ? null : chineseDetailedCompat;
  const finalWesternDetailedCompat = shouldExcludeWestern ? null : westernDetailedCompat;
  
  // Verify updated compatibility data is being used (Rat, Ox, Tiger, Dragon, Snake)
  if (finalChineseDetailedCompat && data.a?.east && data.b?.east) {
    const signA = data.a.east.toLowerCase();
    const signB = data.b.east.toLowerCase();
    const updatedSigns = ['rat', 'ox', 'tiger', 'dragon', 'snake'];
    if (updatedSigns.includes(signA) || updatedSigns.includes(signB)) {
      console.log(`[ConnectionBox] ✅ Using updated compatibility data for ${signA} × ${signB}:`, {
        heading: finalChineseDetailedCompat.heading,
        tagline: finalChineseDetailedCompat.tagline,
        descriptionLength: finalChineseDetailedCompat.description.length
      });
    }
  }
  
  // Use detailed compat descriptions if available, otherwise fall back to existing descriptions
  // Parse Chinese heading to extract sign pair and pattern
  // CRITICAL: Always use detailed compat data (heading, tagline, description) when available
  const chineseOverviewParsed = finalChineseDetailedCompat ? (() => {
    const headingParts = finalChineseDetailedCompat.heading.split(/[—–]/);
    return {
      fullHeading: finalChineseDetailedCompat.heading, // Store full heading from updated data
      signPair: headingParts[0]?.trim() || (data.a?.east && data.b?.east ? `${data.a.east} × ${data.b.east}` : ''),
      patternInfo: headingParts[1]?.trim() || null,
      tagline: finalChineseDetailedCompat.tagline || null, // ALWAYS use tagline from detailed compat
      description: finalChineseDetailedCompat.description || chineseDescription || '' // ALWAYS use description from detailed compat
    };
  })() : {
    fullHeading: chineseHeading || (data.a?.east && data.b?.east ? `${data.a.east} × ${data.b.east}` : ''),
    signPair: chineseHeading || (data.a?.east && data.b?.east ? `${data.a.east} × ${data.b.east}` : ''),
    patternInfo: null,
    tagline: null,
    description: chineseDescription || ''
  };
  
  // Parse Western heading to extract sign pair and element info
  // CRITICAL: Always use detailed compat data (heading, tagline, description) when available
  const westernOverviewParsed = finalWesternDetailedCompat ? (() => {
    const headingParts = finalWesternDetailedCompat.heading.split(/[—–]/);
    return {
      fullHeading: finalWesternDetailedCompat.heading, // Store full heading from updated data
      signPair: headingParts[0]?.trim() || (data.a?.west && data.b?.west ? `${data.a.west} × ${data.b.west}` : ''),
      elementInfo: headingParts[1]?.trim() || null,
      tagline: finalWesternDetailedCompat.tagline || null, // ALWAYS use tagline from detailed compat
      description: finalWesternDetailedCompat.description || westDescription || '' // ALWAYS use description from detailed compat
    };
  })() : {
    fullHeading: westHeading || (data.a?.west && data.b?.west ? `${data.a.west} × ${data.b.west}` : ''),
    signPair: westHeading || (data.a?.west && data.b?.west ? `${data.a.west} × ${data.b.west}` : ''),
    elementInfo: null,
    tagline: null,
    description: westDescription || ''
  };
  
  // Separate heading and tagline for better display
  const chineseOverviewHeading = chineseOverviewParsed.signPair;
  const chineseOverviewTagline = chineseOverviewParsed.tagline;
  const chineseOverviewPattern = chineseOverviewParsed.patternInfo;
  const chineseOverviewDescription = chineseOverviewParsed.description;
  
  const westernOverviewHeading = westernOverviewParsed.signPair;
  const westernOverviewTagline = westernOverviewParsed.tagline;
  const westernOverviewElement = westernOverviewParsed.elementInfo;
  const westernOverviewDescription = westernOverviewParsed.description;
  
  // Always show sections if we have sign data - prioritize detailed compat descriptions
  // Include tagline in the check so sections show even if only tagline is available
  const hasChineseSection = Boolean(
    data.a?.east && data.b?.east && 
    (chineseOverviewHeading || chineseOverviewDescription || chineseOverviewPattern || chineseOverviewTagline)
  );
  const hasWesternSection = Boolean(
    data.a?.west && data.b?.west && 
    (westernOverviewHeading || westernOverviewDescription || westernOverviewElement || westernOverviewTagline)
  );
  
  // CRITICAL DEBUG: Log everything to ensure taglines are found and displayed
  console.log('🔍 [ConnectionBox] TAGLINE DEBUG:', {
    chinese: {
      hasData: !!(data.a?.east && data.b?.east),
      signs: data.a?.east && data.b?.east ? `${data.a.east} × ${data.b.east}` : 'N/A',
      detailedCompatFound: !!finalChineseDetailedCompat,
      taglineFromData: finalChineseDetailedCompat?.tagline || 'NOT FOUND',
      taglineInParsed: chineseOverviewTagline || 'NOT IN PARSED',
      hasSection: hasChineseSection,
      willRender: hasChineseSection && !!chineseOverviewTagline
    },
    western: {
      hasData: !!(data.a?.west && data.b?.west),
      signs: data.a?.west && data.b?.west ? `${data.a.west} × ${data.b.west}` : 'N/A',
      detailedCompatFound: !!finalWesternDetailedCompat,
      taglineFromData: finalWesternDetailedCompat?.tagline || 'NOT FOUND',
      taglineInParsed: westernOverviewTagline || 'NOT IN PARSED',
      hasSection: hasWesternSection,
      willRender: hasWesternSection && !!westernOverviewTagline
    }
  });
  
  // EXPLICIT DEBUG: Log the exact tagline strings
  if (finalChineseDetailedCompat?.tagline) {
    console.log('✅ [ConnectionBox] Chinese tagline FOUND:', `"${finalChineseDetailedCompat.tagline}"`);
  } else {
    console.log('❌ [ConnectionBox] Chinese tagline NOT FOUND');
  }
  if (finalWesternDetailedCompat?.tagline) {
    console.log('✅ [ConnectionBox] Western tagline FOUND:', `"${finalWesternDetailedCompat.tagline}"`);
  } else {
    console.log('❌ [ConnectionBox] Western tagline NOT FOUND');
  }
  // Use tier color from classifier, but override for specific match labels
  // Always prioritize data.colorRgb (from classifier) over astroMatch.color to avoid old colors
  const isMagneticOppositesCheck = astroMatch?.chinese.relation === "opposite" || 
    data.rankLabel?.includes("Opposites Attract") || 
    data.rankLabel?.includes("Six Conflicts") ||
    data.rank?.includes("Six Conflicts") ||
    data.tier === "opposites_attract";
  
  // Match engine color scheme (RGB values matching match engine colors with theme support)
  // In light mode, use darker versions for visibility
  const matchLabelColors: Record<string, string> = theme === "light" ? {
    "Soulmate Match": "rgb(202, 138, 4)",        // darker yellow for light mode
    "Twin Flame Match": "rgb(234, 88, 12)",      // darker orange for light mode
    "Excellent Match": "rgb(219, 39, 119)",      // darker pink for light mode
    "Favourable Match": "rgb(2, 132, 199)",      // darker sky for light mode
    "Neutral Match": "rgb(5, 150, 105)",         // darker emerald for light mode
    "Opposites Attract": "rgb(147, 51, 234)",    // darker purple for light mode
    "Six Conflicts": "rgb(147, 51, 234)",   // darker purple for light mode
    "Difficult Match": "rgb(71, 85, 105)",       // darker slate for light mode
  } : {
    "Soulmate Match": "rgb(253, 224, 71)",       // text-yellow-300
    "Twin Flame Match": "rgb(251, 146, 60)",     // text-orange-400
    "Excellent Match": "rgb(236, 72, 153)",      // text-pink-500
    "Favourable Match": "rgb(56, 189, 248)",     // text-sky-400
    "Neutral Match": "rgb(52, 211, 153)",        // text-emerald-400
    "Opposites Attract": "rgb(192, 132, 252)",   // text-purple-400
    "Six Conflicts": "rgb(192, 132, 252)",  // text-purple-400
    "Difficult Match": "rgb(203, 213, 225)",     // text-slate-300
  };
  
  const oppositesAttractColor = theme === "light" ? "rgb(147, 51, 234)" : "rgb(192, 132, 252)"; // Purple for Opposites Attract (theme-aware)
  
  // Always prioritize classifier result (data.rankLabel or data.rank) over astroMatch
  const baseRankSource = data.rankLabel || data.rank || (astroMatch
    ? `${astroMatch.tier} Match`
    : (data.tier ? TIER_LABEL[data.tier] : undefined));
  const flattenedLabel = baseRankSource ? (labelOverrides[baseRankSource] || baseRankSource) : "Connection";
  const rankText = astroMatch
    ? flattenedLabel
    : (() => {
        const lower = flattenedLabel.toLowerCase();
        // Don't add "Connection" to labels that already include "connection" or "match"
        if (lower.includes("connection") || lower.includes("match")) {
          return flattenedLabel;
        }
        return `${flattenedLabel} Connection`;
      })();
  
  // Determine primary color based on match label
  const primaryColor = (() => {
    // First check if it's Opposites Attract / Six Conflicts
    if (isMagneticOppositesCheck) {
      return oppositesAttractColor;
    }
    // Try to get color from match label mapping
    const labelColor = matchLabelColors[flattenedLabel] || matchLabelColors[rankText];
    if (labelColor) {
      return labelColor;
    }
    // Fallback to classifier color or default
    return data.colorRgb || astroMatch?.color || "#FFD700";
  })();
  
  // Use the tier color consistently - Six Conflicts should always use purple
  // isMagneticOpposites is already determined above via isMagneticOppositesCheck
  const isMagneticOpposites = isMagneticOppositesCheck;
  // Remove score percentage - just show rank label
  const headerText = (() => {
    const text = isMagneticOpposites ? "Six Conflicts" : rankText;
    return formatTierLabel(text);
  })();
  
  // EXACT colors from Match Engine Ranking chart - return both class AND inline style
  const getMatchEngineColor = (text: string): { colorClass: string; colorStyle: string } => {
    const normalized = text.toLowerCase().trim();
    
    if (normalized.includes("soulmate")) {
      return { 
        colorClass: theme === "light" ? "text-yellow-700" : "text-yellow-300",
        colorStyle: theme === "light" ? "#ca8a04" : "#fde047"
      };
    }
    if (normalized.includes("twin flame")) {
      return { 
        colorClass: theme === "light" ? "text-orange-600" : "text-orange-400",
        colorStyle: theme === "light" ? "#ea580c" : "#fb923c"
      };
    }
    if (normalized.includes("excellent")) {
      return { 
        colorClass: theme === "light" ? "text-pink-600" : "text-pink-400",
        colorStyle: theme === "light" ? "#db2777" : "#ec4899"
      };
    }
    if (normalized.includes("favourable")) {
      return { 
        colorClass: theme === "light" ? "text-sky-700" : "text-sky-400",
        colorStyle: theme === "light" ? "#0284c7" : "#38bdf8"
      };
    }
    if (normalized.includes("neutral")) {
      return { 
        colorClass: theme === "light" ? "text-emerald-600" : "text-emerald-400",
        colorStyle: theme === "light" ? "#059669" : "#34d399"
      };
    }
    if (normalized.includes("opposites attract") || normalized.includes("magnetic opposites")) {
      return { 
        colorClass: theme === "light" ? "text-purple-600" : "text-purple-400",
        colorStyle: theme === "light" ? "#9333ea" : "#c084fc"
      };
    }
    if (normalized.includes("difficult")) {
      return { 
        colorClass: theme === "light" ? "text-slate-700" : "text-slate-300",
        colorStyle: theme === "light" ? "#475569" : "#cbd5e1"
      };
    }
    
    return { 
      colorClass: theme === "light" ? "text-black" : "text-white",
      colorStyle: theme === "light" ? "#000000" : "#ffffff"
    };
  };
  
  const matchColor = getMatchEngineColor(headerText);
  const labelColorClass = matchColor.colorClass;
  const labelColorStyle = matchColor.colorStyle;
  const hasProfileDetails = Boolean(
    data.aboutMeText ||
    (data.selectedRelationshipGoals && data.selectedRelationshipGoals.length > 0) ||
    (data.selectedOrganizedInterests && Object.keys(data.selectedOrganizedInterests).length > 0) ||
    data.city ||
    data.occupation ||
    data.age ||
    data.height ||
    data.children
  );
  
  // DEBUG: Log profile data being received
  console.log('[ConnectionBoxSimple] Profile data check:', {
    hasProfileDetails,
    aboutMeText: !!data.aboutMeText,
    relationshipGoals: data.selectedRelationshipGoals?.length || 0,
    interests: data.selectedOrganizedInterests ? Object.keys(data.selectedOrganizedInterests).length : 0,
    city: !!data.city,
    occupation: !!data.occupation,
    age: !!data.age,
    height: !!data.height,
    showProfile,
    selectedRelationshipGoals: data.selectedRelationshipGoals,
    selectedOrganizedInterests: data.selectedOrganizedInterests
  });
  
  // FINAL DEBUG: Log everything before render
  console.log('[ConnectionBox] FINAL VALUES:', {
    headerText,
    labelColorClass,
    theme,
    flattenedLabel,
    rankText,
    'data.rankLabel': data.rankLabel,
    'data.rank': data.rank,
  });
  
  return (
    <div className="min-h-[400px] flex flex-col">
      {/* Compact Header - Always Visible (unless hideHeader is true) */}
      {!hideHeader && !alwaysExpanded && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 hover:opacity-90 transition-opacity"
        >
          {/* Top Row: Rank, Score, Chevron */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-2xl font-semibold">
              <span className="truncate" style={{ color: labelColorStyle, WebkitTextFillColor: labelColorStyle }}>{headerText}</span>
            </div>
            <svg
              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
      )}

      {/* Expanded Content */}
      {(isExpanded || alwaysExpanded) && (
        <div className="pb-6 pt-0 flex-1 flex flex-col" style={{ gap: '0' }}>
          {/* Combined Match Details */}
          <div
            className="px-4 py-4 rounded-lg space-y-4 flex-1"
            style={{ 
              backgroundColor: theme === "light" ? "rgba(0, 0, 0, 0.03)" : "rgba(255, 255, 255, 0.05)", 
              marginBottom: '0',
              border: `1.5px solid ${labelColorStyle}`,
              minHeight: '100%',
            }}
          >
            {/* Pattern Header - Chinese pattern label pill */}
            {(data.patternFullLabel || data.pillLabel || data.pattern) && (
              <div className="space-y-2 pb-4 flex justify-center" style={{ borderBottom: `1px solid ${theme === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)"}` }}>
                {/* Chinese Pattern Label Pill */}
                {(data.patternFullLabel || (data.pattern && data.score)) && (
                  <div className="inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold" 
                    style={{ 
                      color: theme === "light" ? "#1f2937" : "#f3f4f6",
                      border: `2px solid ${labelColorStyle}`,
                      backgroundColor: 'transparent',
                    }}
                  >
                    {data.patternFullLabel || (data.pattern && data.score ? getPatternHeading(data.pattern as ChinesePattern, data.score) : '')}
                  </div>
                )}
                
                {/* Fallback pill */}
                {!data.patternFullLabel && !data.pattern && data.pillLabel && (
                  <div className="inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold"
                    style={{ 
                      color: theme === "light" ? "#1f2937" : "#f3f4f6",
                      border: `2px solid ${labelColorStyle}`,
                      backgroundColor: 'transparent',
                    }}
                  >
                    {data.pillLabel}
                  </div>
                )}
                
                {/* Base tagline - REMOVED */}
                
                {/* Star Ratings */}
                {(data.chemistryStars !== undefined || data.stabilityStars !== undefined) && (
                  <div className="mt-3 space-y-2 text-sm">
                    {data.chemistryStars !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${theme === "light" ? "text-slate-700" : "text-slate-300"}`}>Chemistry ✨</span>
                        <StarRating 
                          value={data.chemistryStars} 
                          starSize="w-5 h-5"
                          fillColor="text-amber-400"
                          emptyColor={theme === "light" ? "text-gray-300" : "text-gray-600"}
                        />
                      </div>
                    )}
                    {data.stabilityStars !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${theme === "light" ? "text-slate-700" : "text-slate-300"}`}>Stability 🌱</span>
                        <StarRating 
                          value={data.stabilityStars} 
                          starSize="w-5 h-5"
                          fillColor="text-emerald-400"
                          emptyColor={theme === "light" ? "text-gray-300" : "text-gray-600"}
                        />
                      </div>
                    )}
                  </div>
                )}
                
                {/* Debug info - remove after confirming it works */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded text-xs">
                    <div>Pattern: {data.pattern || 'undefined'}</div>
                    <div>Full Label: {data.patternFullLabel || 'undefined'}</div>
                    <div>Pill Label: {data.pillLabel || 'undefined'}</div>
                    <div>Chemistry: {data.chemistryStars ?? 'undefined'}</div>
                    <div>Stability: {data.stabilityStars ?? 'undefined'}</div>
                  </div>
                )}
              </div>
            )}

            {/* Main Match Info */}
            <div className="pb-2">
              {/* Header: Label · Score% on same line */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="text-xl font-semibold">
                  <span style={{ color: labelColorStyle, WebkitTextFillColor: labelColorStyle }}>{headerText}</span>
                </div>
                <div className="text-xl font-semibold">
                  <span style={{ color: labelColorStyle, WebkitTextFillColor: labelColorStyle }}>{data.score}%</span>
                </div>
              </div>
              {/* Tagline from matchLabelTaglines */}
              {/* Tagline from matchLabelTaglines - REMOVED */}

              {/* Connection Overview Section - Removed, kept only for Astrology/education screens */}

              {/* Chinese Compatibility Section - ALWAYS SHOW IF WE HAVE SIGN DATA */}
              {data.a?.east && data.b?.east && (() => {
                // FORCE tagline to be extracted from detailed compat if available
                const displayTagline = finalChineseDetailedCompat?.tagline || chineseOverviewTagline;
                
                return (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 p-4 space-y-2 mb-0">
                    <h3 className={`text-sm font-semibold ${theme === "light" ? "text-slate-800" : "text-slate-200"} mb-2`}>
                      Chinese Overview
                    </h3>
                    {chineseOverviewHeading && (
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-xs font-semibold ${theme === "light" ? "text-slate-700" : "text-slate-300"} flex-1`}>
                          {makeChinesePatternsBold(chineseOverviewHeading)}
                        </h4>
                      </div>
                    )}
                    {chineseOverviewPattern && (
                      <p className={`text-xs font-medium ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>
                        {makeChinesePatternsBold(chineseOverviewPattern)}
                      </p>
                    )}
                    {/* TAGLINE - Display if available */}
                    {displayTagline && (
                      <p className={`text-xs italic mb-2 ${theme === "light" ? "text-black" : "text-white"}`}>
                        {displayTagline}
                      </p>
                    )}
                    {chineseOverviewDescription && (
                      <p className={`text-xs ${theme === "light" ? "text-slate-600" : "text-slate-400"} leading-relaxed`}>
                        {makeChinesePatternsBold(chineseOverviewDescription)}
                      </p>
                    )}
                    
                    {/* Chinese Year Elements - displayed under the Chinese connection */}
                    {chineseElementPair && (
                      <p className={`text-xs mt-2 ${theme === "light" ? "text-slate-700" : "text-slate-300"}`}>
                        {chineseElementPair.heading}
                      </p>
                    )}
                  </div>
                );
              })()}

              {/* Western Compatibility Section - ALWAYS SHOW IF WE HAVE SIGN DATA */}
              {data.a?.west && data.b?.west && (() => {
                // FORCE tagline to be extracted from detailed compat if available
                const displayTagline = finalWesternDetailedCompat?.tagline || westernOverviewTagline;
                
                return (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 p-4 space-y-2 mb-0">
                    <h3 className={`text-sm font-semibold ${theme === "light" ? "text-slate-800" : "text-slate-200"} mb-2`}>
                      Western Overview
                    </h3>
                    {westernOverviewHeading && (
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-xs font-semibold ${theme === "light" ? "text-slate-700" : "text-slate-300"} flex-1`}>
                          {westernOverviewHeading}
                        </h4>
                      </div>
                    )}
                    {/* TAGLINE - Display if available */}
                    {displayTagline && (
                      <p className={`text-xs italic mb-2 ${theme === "light" ? "text-black" : "text-white"}`}>
                        {displayTagline}
                      </p>
                    )}
                    {westernOverviewDescription && (
                      <p className={`text-xs ${theme === "light" ? "text-slate-600" : "text-slate-400"} leading-relaxed`}>
                        {westernOverviewDescription}
                      </p>
                    )}

                    {/* Wu Xing (Year Elements) Toggle */}
                    {data.wuXingLine && (
                      <>
                        <div className="flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => setShowWuXing((prev) => !prev)}
                            className={`mt-2 inline-flex items-center gap-1 text-[11px] font-medium transition ${
                              theme === "light" 
                                ? "text-gray-600 hover:text-black" 
                                : "text-slate-300 hover:text-slate-100"
                            }`}
                          >
                            <span className={`inline-block h-3 w-3 rounded-full border text-[9px] leading-[9px] text-center ${
                              theme === "light" ? "border-gray-400" : "border-slate-500/60"
                            }`}>
                              五
                            </span>
                            <span>
                              {showWuXing ? "Hide year elements" : "Show year elements"}
                            </span>
                            <span className="text-[10px]">
                              {showWuXing ? "▲" : "▼"}
                            </span>
                          </button>

                          {/* Show Profile Toggle - Adjacent to Show elements */}
                          {hasProfileDetails && (
                            <button
                              type="button"
                              onClick={() => setShowProfile((prev) => !prev)}
                              className={`mt-2 inline-flex items-center gap-1 text-[11px] font-medium transition ${
                                theme === "light" 
                                  ? "text-gray-600 hover:text-black" 
                                  : "text-slate-300 hover:text-slate-100"
                              }`}
                            >
                              <span className={`inline-block h-3 w-3 rounded-full border text-[9px] leading-[9px] text-center ${
                                theme === "light" ? "border-gray-400" : "border-slate-500/60"
                              }`}>
                                👤
                              </span>
                              <span>
                                {showProfile ? "Hide profile" : "Show profile"}
                              </span>
                              <span className="text-[10px]">
                                {showProfile ? "▲" : "▼"}
                              </span>
                            </button>
                          )}
                        </div>

                        {showWuXing && (
                          <p className={`mt-1 text-[11px] sm:text-xs ${
                            theme === "light" ? "text-gray-600" : "text-slate-300"
                          }`}>
                            {data.wuXingLine}
                          </p>
                        )}
                      </>
                    )}

                    {/* Show Profile Toggle - Standalone when Wu Xing not available */}
                    {!data.wuXingLine && hasProfileDetails && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setShowProfile((prev) => !prev)}
                          className={`mt-2 inline-flex items-center gap-1 text-[11px] font-medium transition ${
                            theme === "light" 
                              ? "text-gray-600 hover:text-black" 
                              : "text-slate-300 hover:text-slate-100"
                          }`}
                        >
                          <span className={`inline-block h-3 w-3 rounded-full border text-[9px] leading-[9px] text-center ${
                            theme === "light" ? "border-gray-400" : "border-slate-500/60"
                          }`}>
                            👤
                          </span>
                          <span>
                            {showProfile ? "Hide profile" : "Show profile"}
                          </span>
                          <span className="text-[10px]">
                            {showProfile ? "▲" : "▼"}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {hasProfileDetails && showProfile && (
              <>
                <div className="space-y-4 pb-2">
                  {/* About Me */}
                  {data.aboutMeText && (
                    <div>
                      <h4
                        className="text-base font-semibold mb-2 flex items-center gap-2"
                        style={{ color: primaryColor, fontFamily: 'inherit' }}
                      >
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={primaryColor}
                          strokeWidth="2"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span style={{ fontFamily: 'inherit', display: 'inline-block' }}>About me</span>
                      </h4>
                      <p className={`text-2xl leading-relaxed ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
                        {data.aboutMeText}
                      </p>
                    </div>
                  )}

                  {/* Relationship Goals */}
                  {data.selectedRelationshipGoals && data.selectedRelationshipGoals.length > 0 && (
                    <div>
                      <h4
                        className="text-base font-semibold mb-2 flex items-center gap-2"
                        style={{ color: primaryColor, fontFamily: 'inherit' }}
                      >
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={primaryColor}
                          strokeWidth="2"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span style={{ fontFamily: 'inherit', display: 'inline-block' }}>Relationship Goals</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {data.selectedRelationshipGoals.map((goal: string, index: number) => (
                          <span
                            key={index}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              theme === "light"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-gray-800 text-gray-200"
                            }`}
                            style={{ border: `1px solid ${primaryColor}` }}
                          >
                            {goal}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interests */}
                  {data.selectedOrganizedInterests && Object.keys(data.selectedOrganizedInterests).length > 0 && (
                    <div>
                      <h4
                        className="text-base font-semibold mb-2 flex items-center gap-2"
                        style={{ color: primaryColor, fontFamily: 'inherit' }}
                      >
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={primaryColor}
                          strokeWidth="2"
                        >
                          <path d="M12 2v20M2 12h20"/>
                        </svg>
                        <span style={{ fontFamily: 'inherit', display: 'inline-block' }}>Interests</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(data.selectedOrganizedInterests).map(([category, interests]) =>
                          (interests as string[]).map((interest: string, index: number) => (
                            <span
                              key={`${category}-${index}`}
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                theme === "light"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-gray-800 text-gray-200"
                              }`}
                              style={{ border: `1px solid ${primaryColor}` }}
                            >
                              {interest}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* Essentials - Location, Occupation, Age, Height, Children */}
                  {(data.city || data.occupation || data.age || data.height || data.children) && (
                    <div>
                      <h4
                        className="text-base font-semibold mb-3 flex items-center gap-2"
                        style={{ color: primaryColor, fontFamily: 'inherit' }}
                      >
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={primaryColor}
                          strokeWidth="2"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span style={{ fontFamily: 'inherit', display: 'inline-block' }}>Essentials</span>
                      </h4>
                      <div className="space-y-2 text-2xl">
                        {/* Location */}
                        {data.city && (
                          <div className={`flex items-center gap-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-100"}`}>
                            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill={primaryColor}>
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                            </svg>
                            <span>
                              {data.city}
                              {data.distance !== undefined && (
                                <span className="opacity-70"> • {data.distance} km</span>
                              )}
                            </span>
                          </div>
                        )}
                        {/* Occupation */}
                        {data.occupation && (
                          <div className={`flex items-center gap-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-100"}`}>
                            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill={primaryColor}>
                              <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm10 15H4V8h16v11z"/>
                            </svg>
                            <span>{data.occupation}</span>
                          </div>
                        )}
                        {/* Age */}
                        {data.age && (
                          <div className={`flex items-center gap-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-100"}`}>
                            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                              <path d="M16 2v4M8 2v4M3 10h18"/>
                            </svg>
                            <span>{data.age} years old</span>
                          </div>
                        )}
                        {/* Height */}
                        {data.height && (
                          <div className={`flex items-center gap-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-100"}`}>
                            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="2">
                              <path d="M12 5v14M5 12l7-7 7 7M5 19l7-7 7 7"/>
                            </svg>
                            <span>{data.height}</span>
                          </div>
                        )}
                        {/* Children */}
                        {data.children && data.children.trim() !== "" && (
                          <div className={`flex items-center gap-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-100"}`}>
                            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="2">
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                              <circle cx="9" cy="7" r="4"></circle>
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            <span>{data.children}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


