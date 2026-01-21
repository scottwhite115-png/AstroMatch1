import React, { useState, useEffect } from "react";
import { getWesternSignGlyph } from "@/lib/zodiacHelpers";

const ChevronDown = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="m6 9 6 6 6-6" />
  </svg>
)

// Updated imports for new matchLabelEngine
import { 
  getMatchLabel,
  deriveArchetype,
  getConnectionTagline,
  getElementLine,
  hasDamageOverlay,
  type ChineseBasePattern,
  type ChineseOverlayPattern,
  type ConnectionArchetype,
  type Element
} from "@/lib/matchLabelEngine";
import {
  WesternElementRelation,
  deriveWesternEase,
  getChineseBaseChip,
  getChineseOverlayChips,
  getWesternChip,
  type Chip,
} from '@/lib/connectionUi';

/** ===== Types ===== */

type WesternElement = "Fire" | "Earth" | "Air" | "Water";

type ElementRelation =
  | "same"
  | "compatible"
  | "semiCompatible"
  | "opposite";

// PrimaryLabel is now just a string from getMatchLabel

type ChineseBasePattern =
  | "SAN_HE"
  | "LIU_HE"
  | "SAME_SIGN"
  | "NO_PATTERN";

type ChineseOverlayPattern =
  | "LIU_CHONG"
  | "LIU_HAI"
  | "XING"
  | "PO";

type SanHeTrineName = "Visionaries" | "Strategists" | "Adventurers" | "Artists";

type ConnectionArchetype =
  | 'TRIPLE_HARMONY'
  | 'SUPPORTIVE_ALLY'
  | 'MIRROR'
  | 'OPEN_PATTERN'
  | 'OPPOSITES'
  | 'LESSON_REPAIR';

type WesternEase = 'EASY' | 'MEDIUM' | 'HARD';
type ScoreBand = 'TOP' | 'HIGH' | 'MID' | 'LOW';

interface ConnectionBoxProps {
  // Basic profile info
  userAName: string;
  userBName: string;
  userASignLabel: string; // e.g. "Aquarius / Monkey"
  userBSignLabel: string; // e.g. "Pisces / Rat"

  // Western + Chinese icons separately
  userAWestIcon?: React.ReactNode;   // ♒️
  userAChineseIcon?: React.ReactNode; // 🐒
  userBWestIcon?: React.ReactNode;   // ♓️
  userBChineseIcon?: React.ReactNode; // 🐀

  score?: number; // 0–100

  // Chinese pattern data from match engine
  basePattern: ChineseBasePattern;
  overlays?: ChineseOverlayPattern[]; // can be [] or undefined
  sanHeTrineName?: SanHeTrineName;   // only when basePattern === "SAN_HE"
  isOppositeBranches: boolean;       // true if Rat–Horse, Ox–Goat, etc.

  sameChineseAnimal?: boolean;
  sameWesternSign?: boolean;

  // Western elements
  elements: {
    a: WesternElement;
    b: WesternElement;
  };
  elementRelationOverride?: ElementRelation;

  // Long-form text for dropdowns
  connectionOverviewText?: string;
  connectionOverviewHeading?: string; // e.g. "Rat × Ox — Secret Friends (Liu He 六合)"
  connectionOverviewTagline?: string; // e.g. "Quietly reliable bond"
  
  // Western compatibility (separate section)
  westernCompatibilityHeading?: string; // e.g. "Aries × Taurus — Semi-Compatible (Fire + Earth)"
  westernCompatibilityTagline?: string; // e.g. "Speed vs stability"
  westernCompatibilityDescription?: string;
  westernSignA?: string; // e.g. "Aries"
  westernSignB?: string; // e.g. "Taurus"
  westernElementA?: WesternElement; // e.g. "Fire"
  westernElementB?: WesternElement; // e.g. "Earth"
  
  aboutPartnerText?: string;
  
  // Profile details
  age?: number;
  city?: string;
  occupation?: string;
  height?: string;
  children?: string;
  interests?: {[category: string]: string[]};
  relationshipGoals?: string[];
  
  // Theme
  theme?: "light" | "dark";
  
  // Pattern colors (if provided, will override calculated colors)
  patternColors?: { start: string; end: string };
  
  // External control of dropdowns
  showProfile?: boolean;
  showElements?: boolean;
}

/** ===== Helper functions ===== */

function getElementRelation(
  a: WesternElement,
  b: WesternElement
): ElementRelation {
  if (a === b) return "same";

  const pair = [a, b].sort().join("-");

  // Compatible: easy synergy
  if (pair === "Air-Fire" || pair === "Earth-Water") return "compatible";

  // Semi-compatible: workable but different tempo
  if (pair === "Air-Water" || pair === "Earth-Fire") return "semiCompatible";

  // Opposite / clashing: most volatile
  // Fire–Water, Air–Earth, plus any remaining "other" combinations
  return "opposite";
}

/**
 * Convert ElementRelation to WesternElementRelation for the match label engine
 */
function convertToWesternRelation(elementRelation: ElementRelation): MatchLabelWesternRelation {
  switch (elementRelation) {
    case "same":
      return 'SAME';
    case "compatible":
      return 'COMPATIBLE';
    case "semiCompatible":
      return 'SEMI_COMPATIBLE';
    case "opposite":
      return 'CLASH';
    default:
      return 'NEUTRAL';
  }
}

/**
 * Convert ElementRelation to connectionUi WesternElementRelation
 */
function convertToConnectionUIWesternRelation(elementRelation: ElementRelation): WesternElementRelation {
  switch (elementRelation) {
    case "same":
      return 'SAME';
    case "compatible":
      return 'COMPATIBLE';
    case "semiCompatible":
      return 'SEMI_COMPATIBLE';
    case "opposite":
      return 'CLASH';
    default:
      return 'NEUTRAL';
  }
}

/**
 * Get match label and tagline from the new match label engine
 */
function getMatchLabelAndTagline(
  basePattern: ChineseBasePattern,
  overlays: ChineseOverlayPattern[] = [],
  isOppositeBranches: boolean,
  elementRelation: ElementRelation,
  sameChineseAnimal?: boolean,
  sameWesternSign?: boolean,
  score?: number
): { primaryLabel: string; tagline: string } {
  const finalScore = score !== undefined ? score : 75;
  const archetype = deriveArchetype(basePattern, overlays);
  
  // Get the match label using new API
  const primaryLabel = getMatchLabel(archetype, basePattern, overlays, finalScore);
  
  // Get the tagline using new API
  const tagline = getConnectionTagline(archetype, basePattern, overlays);

  return {
    primaryLabel,
    tagline
  };
}

/**
 * Legacy wrapper function for backward compatibility
 */
function getPrimaryLabel(
  basePattern: ChineseBasePattern,
  overlays: ChineseOverlayPattern[] = [],
  isOppositeBranches: boolean,
  elementRelation: ElementRelation,
  sameChineseAnimal?: boolean,
  sameWesternSign?: boolean,
  score?: number
): string {
  const { primaryLabel } = getMatchLabelAndTagline(
    basePattern,
    overlays,
    isOppositeBranches,
    elementRelation,
    sameChineseAnimal,
    sameWesternSign,
    score
  );
  return primaryLabel;
}

/**
 * Chip text for base pattern (with emojis + labels).
 */
function getBasePatternChip(
  basePattern: ChineseBasePattern,
  sanHeTrineName?: SanHeTrineName
): string {
  switch (basePattern) {
    case "SAN_HE":
      return `🌟 San He 三合 · Triple Harmony${
        sanHeTrineName ? ` · ${sanHeTrineName} trine` : ""
      }`;
    case "LIU_HE":
      return "💫 Liu He 六合 · Secret Friends";
    case "SAME_SIGN":
      return "🪞 Same Sign 同生肖";
    case "NO_PATTERN":
    default:
      return "◽ Neutral 中";
  }
}

/**
 * Chips for overlay / damage patterns.
 */
function getOverlayChips(overlays: ChineseOverlayPattern[] = []): string[] {
  return overlays.map((p) => {
    switch (p) {
      case "LIU_CHONG":
        return "⚠️ Liu Chong 六冲 · Six Conflicts";
      case "LIU_HAI":
        return "💔 Liu Hai 六害 · Six Harms";
      case "XING":
        return "🔥 Xing 刑 · Punishment Pattern";
      case "PO":
        return "💥 Po 破 · Break Pattern";
      default:
        return "";
    }
  }).filter(Boolean);
}

/**
 * Chip for element relationship.
 */
function getElementChip(
  a: WesternElement,
  b: WesternElement,
  relation: ElementRelation
): string {
  const label = `${a} + ${b}`;

  switch (relation) {
    case "same":
      return `${label} · Same element – built-in understanding`;
    case "compatible":
      return `${label} · Compatible – easy, natural flow`;
    case "semiCompatible":
      return `${label} · Semi-compatible – different pace that can blend`;
    case "opposite":
    default:
      return `${label} · Element clash – strong attraction and tension`;
  }
}

/**
 * One-line headline under the chips.
 */
function getHeadlineSummary(
  primaryLabel: string,
  basePattern: ChineseBasePattern,
  overlays: ChineseOverlayPattern[] = [],
  isOppositeBranches: boolean
): string {
  const hasDamage = overlays.length > 0;

  // Special cases first
  if (primaryLabel === "Soulmate Match") {
    return "Triple Harmony with same element – classic soulmate-style flow and shared rhythm.";
  }

  if (primaryLabel === "Twin Flame Match") {
    return "Triple Harmony with supportive elements – intense, high-growth twin flame style energy.";
  }

  if (primaryLabel === "Secret Friends Match" && basePattern === "LIU_HE") {
    if (hasDamage) {
      return "Secret Friends pattern under tension – loyalty is there, but the dynamic needs patience.";
    }
    return "Secret Friends pattern – quietly strong, loyal and steady when you choose each other.";
  }

  if (primaryLabel === "Magnetic Opposites") {
    if (hasDamage) {
      return "Magnetic opposite with a clash pattern – high spark, low default harmony.";
    }
    return "Polarity pair – strong pull, different styles to integrate.";
  }

  if (primaryLabel === "Challenging Match") {
    if (basePattern === "SAME_SIGN" && hasDamage) {
      return "Same-sign mirror with a punishment pattern – ultra-familiar, but can feel intense or self-critical.";
    }
    if (basePattern === "SAN_HE" || basePattern === "LIU_HE") {
      return "Strong underlying bond with heavy tension patterns – powerful connection that isn't low-effort.";
    }
    if (hasDamage) {
      return "Classical challenge pattern – big lessons, best with a lot of honesty and skill.";
    }
    return "Tension between charts – chemistry may exist, but the pattern asks for extra care.";
  }

  // Neutral
  if (basePattern === "SAME_SIGN") {
    return "Mirror-match energy with strong familiarity and shared habits; comforting, but not automatically harmonious.";
  }
  if (basePattern === "NO_PATTERN") {
    return "No major classical pattern – the vibe depends more on your personal charts, timing, and Western signs.";
  }

  if (isOppositeBranches) {
    return "Opposite branches – memorable, not always easy.";
  }

  return "Balanced overall pattern – not extreme, room to write your own story.";
}

/** ===== Component ===== */

export const ConnectionBox: React.FC<ConnectionBoxProps> = ({
  userAName,
  userBName,
  userASignLabel,
  userBSignLabel,
  userAWestIcon,
  userAChineseIcon,
  userBWestIcon,
  userBChineseIcon,
  score,
  basePattern,
  overlays = [],
  sanHeTrineName,
  isOppositeBranches,
  sameChineseAnimal,
  sameWesternSign,
  elements,
  elementRelationOverride,
  connectionOverviewText,
  connectionOverviewHeading,
  connectionOverviewTagline,
  westernCompatibilityHeading,
  westernCompatibilityTagline,
  westernCompatibilityDescription,
  westernSignA,
  westernSignB,
  westernElementA,
  westernElementB,
  aboutPartnerText,
  age,
  city,
  occupation,
  height,
  children,
  interests,
  relationshipGoals,
  theme = "dark",
  patternColors,
  showProfile: externalShowProfile,
  showElements: externalShowElements,
}) => {
  const [internalShowOverview, setInternalShowOverview] = useState(false);
  const [internalShowAbout, setInternalShowAbout] = useState(false);
  const [showMatchLabelDropdown, setShowMatchLabelDropdown] = useState(false);
  
  // Use external props if provided, otherwise use internal state
  const showOverview = externalShowElements !== undefined ? externalShowElements : internalShowOverview;
  const showAbout = externalShowProfile !== undefined ? externalShowProfile : internalShowAbout;
  
  // Debug logging
  React.useEffect(() => {
    console.log('[ConnectionBox] connectionOverviewText value:', connectionOverviewText);
    console.log('[ConnectionBox] westernCompatibilityDescription value:', westernCompatibilityDescription);
    console.log('[ConnectionBox] showMatchLabelDropdown value:', showMatchLabelDropdown);
    console.log('[ConnectionBox] Dropdown state:', {
      externalShowProfile,
      externalShowElements,
      showAbout,
      showOverview,
      hasConnectionOverview: !!(connectionOverviewText || westernCompatibilityDescription),
      hasAboutContent: !!(aboutPartnerText || relationshipGoals || interests || city || occupation || age || height || children),
      connectionOverviewText,
      westernCompatibilityDescription,
    });
  }, [externalShowProfile, externalShowElements, showAbout, showOverview, connectionOverviewText, westernCompatibilityDescription, aboutPartnerText, relationshipGoals, interests, city, occupation, age, height, children]);

  const elementRelation =
    elementRelationOverride ?? getElementRelation(elements.a, elements.b);

  const { primaryLabel: initialPrimaryLabel, tagline } = getMatchLabelAndTagline(
    basePattern,
    overlays,
    isOppositeBranches,
    elementRelation,
    sameChineseAnimal,
    sameWesternSign,
    score
  );

  // NEW: Calculate chips and blurb using connectionUi helpers
  const chineseBase: ChineseBasePattern = basePattern;
  const chineseOverlays: ChineseOverlayPattern[] = overlays ?? [];
  const westernRelation: WesternElementRelation = convertToConnectionUIWesternRelation(elementRelation);

  const archetype = deriveArchetype(chineseBase, chineseOverlays);
  const ease = deriveWesternEase(westernRelation);
  
  // hasDamage is used for blurb selection
  const hasDamage = chineseOverlays.some(
    o => o === 'LIU_HAI' || o === 'XING' || o === 'PO'
  );
  
  // Use the label from getMatchLabel (which already handles Liu Chong → Six Conflicts)
  const primaryLabel: string = initialPrimaryLabel;

  const hasAnyOverlay = chineseOverlays.length > 0;

  // 1 Base chip: regular base pattern chip
  const baseChipNew: Chip = getChineseBaseChip(chineseBase);

  // 2 Overlay chips: includes Liu Chong + damage patterns
  const overlayChips = getChineseOverlayChips(chineseOverlays);
  const westernChipNew = getWesternChip(elements.a, elements.b, westernRelation);

  // Only show "No strong pattern" when there are no overlays at all
  const showBaseChip = chineseBase !== 'NO_PATTERN' || !hasAnyOverlay;

  const blurb = getConnectionTagline(archetype, chineseBase, chineseOverlays);

  // Keep existing chip functions for backward compatibility (not used in new UI)
  const baseChip = getBasePatternChip(basePattern, sanHeTrineName);
  const overlayChipsLegacy = getOverlayChips(overlays);
  const elementChip = getElementChip(
    elements.a,
    elements.b,
    elementRelation
  );

  // Remove sign pair from western heading (everything before the dash)
  const westernHeadingWithoutSignPair = westernCompatibilityHeading
    ? (() => {
        const parts = westernCompatibilityHeading.split(/[—–]/);
        return parts.length > 1 ? parts.slice(1).join('—').trim() : westernCompatibilityHeading;
      })()
    : undefined;

  // Extract Chinese animal names from sign labels (format: "Aquarius / Monkey")
  const chineseAnimalA = userASignLabel.split(' / ')[1] || '';
  const chineseAnimalB = userBSignLabel.split(' / ')[1] || '';

  // Remove sign pair from Chinese heading (everything before the dash)
  const chineseHeadingWithoutSignPair = connectionOverviewHeading
    ? (() => {
        const parts = connectionOverviewHeading.split(/[—–]/);
        return parts.length > 1 ? parts.slice(1).join('—').trim() : connectionOverviewHeading;
      })()
    : undefined;

  // Get gradient colors based on pattern (matching MatchProfileCard logic exactly)
  // MatchProfileCard checks base patterns first, then overlays
  const getGradientColors = () => {
    // Check base pattern first (matching MatchProfileCard order)
    // San He - Triple Harmony (Gold)
    if (basePattern === "SAN_HE") {
      return { start: '#fbbf24', end: '#f59e0b' };
    }
    
    // Liu He - Secret Friends (Purple)
    if (basePattern === "LIU_HE") {
      return { start: '#c084fc', end: '#e879f9' };
    }
    
    // Same Animal/Sign (Teal)
    if (basePattern === "SAME_SIGN" || basePattern === "SAME_ANIMAL") {
      return { start: '#2dd4bf', end: '#14b8a6' };
    }
    
    // No Pattern (Blue)
    if (basePattern === "NO_PATTERN") {
      return { start: '#60a5fa', end: '#3b82f6' };
    }
    
    // Default neutral (use blue, same as NO_PATTERN)
    return { start: '#60a5fa', end: '#3b82f6' };
  };

  // Use provided patternColors if available, otherwise calculate
  const gradientColors = patternColors || getGradientColors();

  return (
    <div className="w-full">
      {/* Match Box - Signs, Match Label Pill, and Blurb - border removed */}
        <div 
          className="w-full"
          style={{
            borderRadius: '1.5rem',
            padding: '1.5rem 1.5rem 1.5rem 1.5rem',
            backgroundColor: theme === "light" ? "#ffffff" : "#1e293b",
            position: 'relative',
          }}
        >
        {/* Sign combinations with emojis */}
        <div className="py-2 w-full mb-3">
          <div className="flex items-center gap-2">
            {/* Left side - emojis and label */}
            <div className="flex flex-col items-center flex-1 min-w-0">
              {/* Left sign emojis */}
              <div className="flex items-center gap-1 mb-1">
                {userAWestIcon && <span className="text-3xl">{userAWestIcon}</span>}
                {userAChineseIcon && <span className="text-3xl">{userAChineseIcon}</span>}
              </div>
              {/* Left sign label */}
              <span className={`font-bold text-base whitespace-nowrap ${
                theme === "light" ? "text-slate-700" : "text-slate-200"
              }`}>
                {userASignLabel}
              </span>
            </div>
            
            {/* Heart icon in the center */}
            <span className={`text-xl flex-shrink-0 self-center ${
              theme === "light" ? "text-pink-500" : "text-pink-400"
            }`}>
              ♥
            </span>
            
            {/* Right side - emojis and label */}
            <div className="flex flex-col items-center flex-1 min-w-0">
              {/* Right sign emojis */}
              <div className="flex items-center gap-1 mb-1">
                {userBWestIcon && <span className="text-3xl">{userBWestIcon}</span>}
                {userBChineseIcon && <span className="text-3xl">{userBChineseIcon}</span>}
              </div>
              {/* Right sign label */}
              <span className={`font-bold text-base whitespace-nowrap ${
                theme === "light" ? "text-slate-700" : "text-slate-200"
              }`}>
                {userBSignLabel}
              </span>
            </div>
          </div>
        </div>
        {/* Primary label pill */}
        <div className="mb-4 mt-2 flex flex-col items-center justify-center w-full" style={{ position: 'relative', zIndex: 10000 }}>
              <div 
                className={`inline-flex items-center rounded-full px-4 py-2 text-lg font-bold shadow-lg whitespace-nowrap border-2 cursor-pointer transition-all ${
                  theme === "light" ? "bg-white" : "bg-slate-900"
                }`}
                style={{
                  borderColor: gradientColors.start,
                  color: theme === "light" ? "black" : "white",
                  position: 'relative',
                  zIndex: 10001
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Match pill clicked, current state:', showMatchLabelDropdown);
                  setShowMatchLabelDropdown(!showMatchLabelDropdown);
                  console.log('Match pill clicked, new state:', !showMatchLabelDropdown);
                }}
              >
                <span>{primaryLabel}</span>
                {typeof score === "number" && (
                  <>
                    <span className={`ml-2 text-lg font-bold ${theme === "light" ? "text-black" : "text-white"}`}>
                      {score}%
                    </span>
                    <ChevronDown className={`ml-2 w-5 h-5 transition-transform ${showMatchLabelDropdown ? "rotate-180" : ""} ${theme === "light" ? "text-black" : "text-white"}`} />
                  </>
                )}
              </div>

          {/* Tagline under the pill */}
          {tagline && (
            <div className={`text-center px-4 mt-3 text-base font-bold ${
              theme === "light" ? "text-slate-700" : "text-slate-300"
            }`}>
              {tagline}
            </div>
          )}

          {/* Match Label Dropdown - Shows astrology details when pill is clicked */}
          {showMatchLabelDropdown && (
            <div 
              style={{
                position: 'absolute',
                top: '100%',
                left: '-1.5rem',
                right: '-1.5rem',
                zIndex: 10002,
                marginTop: '0.5rem',
              }}
              onClick={(e) => e.stopPropagation()}
            >
                    <div
                      style={{
                        borderRadius: '1.5rem',
                        backgroundColor: theme === "light" ? "#ffffff" : "#1e293b",
                        padding: '1.5rem',
                        overflow: 'hidden',
                      }}
                    >
                    {/* Chinese Zodiac Compatibility Section */}
                    {connectionOverviewText && (
                      <div className="mb-4 text-center">
                        {/* Chinese Signs Display */}
                        {chineseAnimalA && chineseAnimalB && (
                          <div className="flex items-center justify-center gap-1.5 mb-2">
                            {userAChineseIcon && <span className="text-2xl">{userAChineseIcon}</span>}
                            <span className={`font-bold text-lg ${
                              theme === "light" ? "text-slate-700" : "text-slate-200"
                            }`}>
                              {chineseAnimalA}
                            </span>
                            <span className={`text-lg ${
                              theme === "light" ? "text-pink-500" : "text-pink-400"
                            }`}>
                              ♥
                            </span>
                            <span className={`font-bold text-lg ${
                              theme === "light" ? "text-slate-700" : "text-slate-200"
                            }`}>
                              {chineseAnimalB}
                            </span>
                            {userBChineseIcon && <span className="text-2xl">{userBChineseIcon}</span>}
                          </div>
                        )}
                        
                        {chineseHeadingWithoutSignPair && (
                          <div className="mb-1 text-center">
                            {chineseHeadingWithoutSignPair
                              .split(/,|;/)
                              .map(part => part.trim())
                              .filter(part => part.length > 0)
                              .map((pattern, index) => (
                                <h4 
                                  key={index}
                                  className={`text-lg font-bold ${
                                    theme === "light" ? "text-slate-900" : "text-slate-100"
                                  }`}
                                >
                                  {pattern}
                                </h4>
                              ))}
                          </div>
                        )}
                        {/* TAGLINE - Display if available */}
                        {connectionOverviewTagline && (
                          <p className={`text-lg italic font-bold mb-0.5 text-center ${
                            theme === "light" ? "text-black" : "text-white"
                          }`}>
                            {connectionOverviewTagline}
                          </p>
                        )}
                        <div className="leading-relaxed whitespace-pre-line text-center" style={{ marginBottom: '0', paddingBottom: '0', lineHeight: '1.5' }}>
                          {connectionOverviewText}
                        </div>
                      </div>
                    )}
                    
                    {/* Western Sun Sign Compatibility Section */}
                    {westernCompatibilityDescription && (
                      <div className={`${connectionOverviewText ? "pt-4 border-t" : ""} text-center ${
                        theme === "light" ? "border-gray-200" : "border-indigo-400/20"
                      }`}
                      style={{ paddingBottom: '1rem' }}
                      >
                        {/* Western Signs Display */}
                        {westernSignA && westernSignB && (
                          <div className="flex items-center justify-center gap-1.5 mb-2">
                            {userAWestIcon && <span className="text-2xl">{userAWestIcon}</span>}
                            <span className={`font-bold text-lg ${
                              theme === "light" ? "text-slate-700" : "text-slate-200"
                            }`}>
                              {westernSignA}
                            </span>
                            <span className={`text-lg ${
                              theme === "light" ? "text-pink-500" : "text-pink-400"
                            }`}>
                              ♥
                            </span>
                            <span className={`font-bold text-lg ${
                              theme === "light" ? "text-slate-700" : "text-slate-200"
                            }`}>
                              {westernSignB}
                            </span>
                            {userBWestIcon && <span className="text-2xl">{userBWestIcon}</span>}
                          </div>
                        )}
                        
                        {westernHeadingWithoutSignPair && (
                          <h4 className={`text-lg mb-1 text-center font-bold ${
                            theme === "light" ? "text-slate-900" : "text-slate-100"
                          }`}>
                            {westernHeadingWithoutSignPair}
                          </h4>
                        )}
                        {/* TAGLINE - Display if available */}
                        {westernCompatibilityTagline && (
                          <p className={`text-lg italic font-bold mb-0.5 text-center ${
                            theme === "light" ? "text-black" : "text-white"
                          }`}>
                            {westernCompatibilityTagline}
                          </p>
                        )}
                        <div className="leading-relaxed whitespace-pre-line text-center" style={{ marginBottom: '0', paddingBottom: '0', lineHeight: '1.5' }}>
                          {westernCompatibilityDescription}
                        </div>
                      </div>
                    )}

                    {/* Fallback if no content */}
                    {!connectionOverviewText && !westernCompatibilityDescription && (
                      <div className={`text-center py-4 ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>
                        <p>No compatibility information available</p>
                      </div>
                    )}
                      </div>
                  </div>
                )}
        </div>

        {/* Blurb - Mirror-style match text */}
        {/* Blurb - REMOVED */}

        {/* Profile Information - Combined into match box */}
        {(aboutPartnerText || relationshipGoals || interests || city || occupation || age || height || children) && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: showMatchLabelDropdown ? 'none' : `1px solid ${theme === "light" ? "#e2e8f0" : "#334155"}` }}>
            {/* About Me */}
            {aboutPartnerText && (
              <div style={{ marginBottom: '1.5rem', marginTop: '0' }}>
                <h4 
                  className="text-lg font-semibold mb-0.5"
                  style={{ 
                    background: `linear-gradient(135deg, ${gradientColors.start}, ${gradientColors.end})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    paddingLeft: '1rem',
                    paddingRight: '1rem'
                  }}
                >
                  About me
                </h4>
                <p 
                  className={`text-2xl font-bold leading-relaxed whitespace-pre-wrap ${theme === "light" ? "text-slate-700" : "text-slate-300"}`}
                  style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
                >
                  {aboutPartnerText}
                </p>
              </div>
            )}

            {/* Relationship Goals */}
            {relationshipGoals && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 
                  className="text-lg font-semibold mb-0.5"
                  style={{ 
                    background: `linear-gradient(135deg, ${gradientColors.start}, ${gradientColors.end})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    paddingLeft: '1rem',
                    paddingRight: '1rem'
                  }}
                >
                  Relationship Goals
                </h4>
                <div 
                  className="flex flex-wrap gap-2"
                  style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
                >
                  {typeof relationshipGoals === 'string' ? (
                    <span 
                      className="px-3 py-1.5 rounded-full text-base font-medium text-white"
                      style={{
                        background: 'linear-gradient(135deg, #f472b6 0%, #d946ef 100%)',
                        boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)',
                      }}
                    >
                      {relationshipGoals}
                    </span>
                  ) : Array.isArray(relationshipGoals) ? (
                    relationshipGoals.map((goal, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1.5 rounded-full text-base font-medium text-white"
                        style={{
                          background: 'linear-gradient(135deg, #f472b6 0%, #d946ef 100%)',
                          boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)',
                        }}
                      >
                        {goal}
                      </span>
                    ))
                  ) : null}
                </div>
              </div>
            )}

            {/* Interests */}
            {interests && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 
                  className="text-lg font-semibold mb-0.5"
                  style={{ 
                    background: `linear-gradient(135deg, ${gradientColors.start}, ${gradientColors.end})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    paddingLeft: '1rem',
                    paddingRight: '1rem'
                  }}
                >
                  Interests
                </h4>
                <div 
                  className="flex flex-wrap gap-2"
                  style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
                >
                  {typeof interests === 'string' ? (
                    <span 
                      className="px-3 py-1.5 rounded-full text-base font-medium text-white"
                      style={{
                        background: 'linear-gradient(135deg, #f472b6 0%, #d946ef 100%)',
                        boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)',
                      }}
                    >
                      {interests}
                    </span>
                  ) : Array.isArray(interests) ? (
                    interests.map((interest, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1.5 rounded-full text-base font-medium text-white"
                        style={{
                          background: 'linear-gradient(135deg, #f472b6 0%, #d946ef 100%)',
                          boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)',
                        }}
                      >
                        {interest}
                      </span>
                    ))
                  ) : typeof interests === 'object' ? (
                    Object.entries(interests)
                      .flatMap(([category, interestList]) => 
                        Array.isArray(interestList) ? interestList : []
                      )
                      .map((interest, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1.5 rounded-full text-base font-medium text-white"
                          style={{
                            background: 'linear-gradient(135deg, #f472b6 0%, #d946ef 100%)',
                            boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)',
                          }}
                        >
                          {interest}
                        </span>
                      ))
                  ) : null}
                </div>
              </div>
            )}

            {/* Essentials */}
            {(city || occupation || age || height || children) && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 
                  className="text-lg font-semibold mb-0.5"
                  style={{ 
                    background: `linear-gradient(135deg, ${gradientColors.start}, ${gradientColors.end})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    paddingLeft: '1rem',
                    paddingRight: '1rem'
                  }}
                >
                  Essentials
                </h4>
                <div className="grid grid-cols-1 gap-3" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                  {/* Location */}
                  {city && (
                    <div className={`flex items-center gap-1.5 text-xl ${theme === "light" ? "text-slate-700" : "text-slate-300"}`}>
                      <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <span>{city}</span>
                    </div>
                  )}
                  
                  {/* Occupation */}
                  {occupation && (
                    <div className={`flex items-center gap-1.5 text-xl ${theme === "light" ? "text-slate-700" : "text-slate-300"}`}>
                      <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                      </svg>
                      <span>{occupation}</span>
                    </div>
                  )}

                  {/* Age */}
                  {age && (
                    <div className={`flex items-center gap-1.5 text-xl ${theme === "light" ? "text-slate-700" : "text-slate-300"}`}>
                      <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      <span>{age} years old</span>
                    </div>
                  )}

                  {/* Height */}
                  {height && (
                    <div className={`flex items-center gap-1.5 text-xl ${theme === "light" ? "text-slate-700" : "text-slate-300"}`}>
                      <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="2" x2="12" y2="22"/>
                        <polyline points="8 6 12 2 16 6"/>
                        <polyline points="8 18 12 22 16 18"/>
                      </svg>
                      <span>{height}</span>
                    </div>
                  )}

                  {/* Children */}
                  {children && (
                    <div className={`flex items-center gap-1.5 text-xl ${theme === "light" ? "text-slate-700" : "text-slate-300"}`}>
                      <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                      <span>{children}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        </div>
      {/* Dropdowns - Match Overview */}
      {showOverview && (connectionOverviewText || westernCompatibilityDescription) && (
          <div className={`rounded-2xl text-lg relative z-20 ${
            theme === "light" 
              ? "text-slate-800" 
              : "text-slate-200"
          }`} style={{
            backgroundColor: 'transparent',
            marginLeft: '-1rem',
            marginRight: '-1rem',
            paddingLeft: '1rem',
            paddingRight: '1rem',
            paddingTop: '1rem',
            paddingBottom: '1rem',
            marginTop: '0',
            marginBottom: '0',
            borderRadius: '0',
          }}>
          </div>
        )}
    </div>
  );
};

