import React, { useState } from "react";
import { getWesternSignGlyph } from "@/lib/zodiacHelpers";
import { 
  getMatchLabel, 
  type WesternElementRelation as MatchLabelWesternRelation,
  type PrimaryMatchLabel 
} from "@/lib/matchLabelEngine";
import {
  ChineseBasePattern,
  ChineseOverlayPattern,
  WesternElementRelation,
  deriveArchetype,
  deriveWesternEase,
  getChineseBaseChip,
  getChineseOverlayChips,
  getWesternChip,
  getConnectionBlurb,
  type Chip,
} from '@/lib/connectionUi';

/** ===== Types ===== */

type WesternElement = "Fire" | "Earth" | "Air" | "Water";

type ElementRelation =
  | "same"
  | "compatible"
  | "semiCompatible"
  | "opposite";

type PrimaryLabel = PrimaryMatchLabel;

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
  interests?: {[category: string]: string[]};
  relationshipGoals?: string[];
  
  // Theme
  theme?: "light" | "dark";
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
): { primaryLabel: PrimaryLabel; tagline: string } {
  const westernRelation = convertToWesternRelation(elementRelation);

  const result = getMatchLabel({
    chineseBase: basePattern,
    chineseOverlays: overlays,
    westernRelation,
    score: score !== undefined ? score : 75, // Default to mid-range if no score
    sameWesternSign: sameWesternSign ?? false
  });

  return {
    primaryLabel: result.primaryLabel,
    tagline: result.subLabel
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
): PrimaryLabel {
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
  primaryLabel: PrimaryLabel,
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
  interests,
  relationshipGoals,
  theme = "dark",
}) => {
  const [showOverview, setShowOverview] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

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
  
  // Use the label from getMatchLabel (which already handles Liu Chong → Magnetic Opposites)
  const primaryLabel: PrimaryMatchLabel = initialPrimaryLabel;

  const hasAnyOverlay = chineseOverlays.length > 0;

  // 1) Base chip: regular base pattern chip
  const baseChipNew: Chip = getChineseBaseChip(chineseBase);

  // 2) Overlay chips: includes Liu Chong + damage patterns
  const overlayChips = getChineseOverlayChips(chineseOverlays);
  const westernChipNew = getWesternChip(elements.a, elements.b, westernRelation);

  // Only show "No strong pattern" when there are no overlays at all
  const showBaseChip = chineseBase !== 'NO_PATTERN' || !hasAnyOverlay;

  const blurb = getConnectionBlurb(archetype, ease, sameWesternSign, hasDamage);

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

  // Get gradient colors based on primary label
  const getGradientColors = (): { start: string; end: string } => {
    switch (primaryLabel) {
      case "Soulmate Match":
        return { start: "#fbbf24", end: "#fb923c" }; // amber-400 to orange-400
      case "Twin Flame Match":
        return { start: "#c026d3", end: "#fb923c" }; // fuchsia-600 to orange-400
      case "Secret Friends Match":
        return { start: "#c084fc", end: "#f472b6" }; // purple-400 to pink-400
      case "Strong Harmony Match":
        return { start: "#f59e0b", end: "#ec4899" }; // amber-500 to pink-500
      case "Mirror Match":
        return { start: "#06b6d4", end: "#8b5cf6" }; // cyan-500 to violet-500
      case "Magnetic Opposites":
        return { start: "#67e8f9", end: "#c084fc" }; // cyan-300 to purple-400
      case "Challenging Match":
        return { start: "#fb7185", end: "#ef4444" }; // rose-400 to red-500
      case "Neutral Match":
        return { start: "#60a5fa", end: "#818cf8" }; // blue-400 to indigo-400
      default:
        return { start: "#94a3b8", end: "#94a3b8" }; // slate-400
    }
  };

  const gradientColors = getGradientColors();

  return (
    <div 
      className="w-full max-w-xl rounded-2xl p-[2px] shadow-xl"
      style={{
        background: `linear-gradient(to right, ${gradientColors.start}, ${gradientColors.end})`,
      }}
    >
      <div 
        className={`w-full h-full rounded-2xl p-4 sm:p-5 backdrop-blur-md ${
          theme === "light" ? "bg-white" : "bg-slate-900/90"
        }`}
      >
        {/* Top row: sign combinations with emojis */}
        <div className="py-1 w-full mb-4">
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
            <span className={`text-2xl flex-shrink-0 self-center ${
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
        <div className="mb-2 flex justify-center">
          <div 
            className={`inline-flex items-center rounded-full px-4 py-2 text-lg font-bold shadow-lg whitespace-nowrap border-2 ${
              theme === "light" ? "bg-white" : "bg-slate-900"
            }`}
            style={{
              borderColor: gradientColors.start,
              color: theme === "light" ? gradientColors.start : "white",
            }}
          >
            <span>{primaryLabel}</span>
            {typeof score === "number" && (
              <span className="ml-2 text-base opacity-80" style={{ fontWeight: 'bold' }}>
                {score}%
              </span>
            )}
          </div>
        </div>

        {/* Tagline under the pill */}
        {blurb && (
          <p className={`text-lg text-center leading-relaxed mb-3 ${
            theme === "light" ? "text-slate-600" : "text-slate-300"
          }`}>
            {blurb}
          </p>
        )}

        {/* Pattern breakdown chips */}
        <div className="mt-2 flex flex-wrap justify-center gap-2 mb-4">
          {/* base Chinese pattern chip - only show if not NO_PATTERN or if there are no overlays */}
          {showBaseChip && (
            <span
              key={baseChipNew.icon + baseChipNew.label}
              className={`px-3 py-1 rounded-full text-base inline-flex items-center gap-1 ${
                theme === "light" 
                  ? "bg-slate-200 text-slate-700" 
                  : "bg-slate-900 text-slate-200"
              }`}
            >
              <span>{baseChipNew.icon}</span>
              <span>{baseChipNew.label}</span>
            </span>
          )}

          {/* overlay chips, if any */}
          {overlayChips.map((chip) => (
            <span
              key={chip.icon + chip.label}
              className={`px-3 py-1 rounded-full text-base inline-flex items-center gap-1 ${
                theme === "light" 
                  ? "bg-slate-200 text-slate-700" 
                  : "bg-slate-900 text-slate-200"
              }`}
            >
              <span>{chip.icon}</span>
              <span>{chip.label}</span>
            </span>
          ))}

          {/* western chip */}
          <span
            key={westernChipNew.icon + westernChipNew.label}
            className={`${westernChipNew.label.includes('–') ? 'px-1' : 'px-3'} py-1.5 rounded-full text-base inline-flex items-center justify-center gap-1 ${
              theme === "light" 
                ? "bg-slate-200 text-slate-700" 
                : "bg-slate-900 text-slate-200"
            }`}
            style={{
              maxWidth: westernChipNew.label.includes('–') ? '140px' : 'fit-content',
              width: 'fit-content',
              minWidth: 'min-content',
              display: 'inline-flex',
              flexWrap: 'wrap',
              textAlign: 'center',
              lineHeight: '1.3',
            }}
          >
            {westernChipNew.icon && <span className="flex-shrink-0">{westernChipNew.icon}</span>}
            <span 
              className="whitespace-normal text-center"
              style={{ 
                textWrap: 'balance',
                wordBreak: 'break-word',
                maxWidth: '100%',
                minWidth: 0,
                flex: '1 1 auto',
              }}
            >
              {(() => {
                // Split label at "·" to help with balancing
                const parts = westernChipNew.label.split(' · ');
                if (parts.length === 2) {
                  return (
                    <>
                      <span className="whitespace-nowrap">{parts[0]}</span>
                      {parts[1] && (
                        <>
                          <span className="mx-1">·</span>
                          <span>{parts[1]}</span>
                        </>
                      )}
                    </>
                  );
                }
                return westernChipNew.label;
              })()}
            </span>
          </span>
        </div>

        {/* Action Buttons Row */}
        <div className="mt-4 mb-4">
          <div className="grid grid-cols-3 gap-2">
            {/* Profile Button */}
            <button
              onClick={() => {
                if (!showAbout) {
                  setShowAbout(true);
                  setShowOverview(false);
                } else {
                  setShowAbout(false);
                }
              }}
              className={`inline-flex items-center justify-center rounded-full px-1.5 py-2 text-xs font-semibold tracking-wide transition-opacity hover:opacity-90 shadow-lg active:scale-95 border-2 ${
                theme === "light" ? "bg-white" : "bg-slate-900"
              }`}
              style={{
                borderColor: gradientColors.start,
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" style={{ stroke: theme === "light" ? "#000000" : "#ffffff" }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </button>

            {/* Star Button (Connection Overview) */}
            <button
              onClick={() => {
                if (!showOverview) {
                  setShowOverview(true);
                  setShowAbout(false);
                } else {
                  setShowOverview(false);
                }
              }}
              className={`inline-flex items-center justify-center rounded-full px-1.5 py-2 text-xs font-semibold tracking-wide transition-opacity hover:opacity-90 shadow-lg active:scale-95 border-2 ${
                theme === "light" ? "bg-white" : "bg-slate-900"
              }`}
              style={{
                borderColor: gradientColors.start,
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" strokeWidth="2" style={{ stroke: theme === "light" ? "#000000" : "#ffffff" }}>
                <path d="M12 2L14.09 8.26L22 9.27L17 14.14L18.18 22.02L12 18.77L5.82 22.02L7 14.14L2 9.27L9.91 8.26L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Chat Button */}
            <button
              className={`inline-flex items-center justify-center rounded-full px-1.5 py-2 text-xs font-semibold tracking-wide transition-opacity hover:opacity-90 shadow-lg active:scale-95 border-2 ${
                theme === "light" ? "bg-white" : "bg-slate-900"
              }`}
              style={{
                borderColor: gradientColors.start,
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" strokeWidth="2" style={{ stroke: theme === "light" ? "#000000" : "#ffffff" }}>
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Dropdowns - Connection Overview */}
        {showOverview && (connectionOverviewText || westernCompatibilityDescription) && (
          <div className={`rounded-2xl px-2 py-2 text-lg mb-3 relative z-20 ${
            theme === "light" 
              ? "bg-slate-100/90 text-slate-800" 
              : "bg-slate-800/50 text-slate-200"
          }`}>
            {/* Chinese Zodiac Compatibility Section */}
            {connectionOverviewText && (
              <div className="mb-2">
                {/* Chinese Signs Display with Icons */}
                {chineseAnimalA && chineseAnimalB && userAChineseIcon && userBChineseIcon && (
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-3xl">{userAChineseIcon}</span>
                    <span className={`font-semibold text-xl ${
                      theme === "light" ? "text-slate-700" : "text-slate-200"
                    }`}>
                      {chineseAnimalA}
                    </span>
                    <span className={`text-2xl ${
                      theme === "light" ? "text-pink-500" : "text-pink-400"
                    }`}>
                      ♥
                    </span>
                    <span className={`font-semibold text-xl ${
                      theme === "light" ? "text-slate-700" : "text-slate-200"
                    }`}>
                      {chineseAnimalB}
                    </span>
                    <span className="text-3xl">{userBChineseIcon}</span>
                  </div>
                )}
                
                {chineseHeadingWithoutSignPair && (
                  <h4 className={`text-xl font-bold mb-1.5 ${
                    theme === "light" ? "text-slate-900" : "text-slate-100"
                  }`}>
                    {chineseHeadingWithoutSignPair}
                  </h4>
                )}
                {/* TAGLINE - Display if available */}
                {connectionOverviewTagline && (
                  <p className={`text-xl italic mb-2 ${
                    theme === "light" ? "text-black" : "text-white"
                  }`}>
                    {connectionOverviewTagline}
                  </p>
                )}
                <div className="leading-relaxed whitespace-pre-line">
                  {connectionOverviewText}
                </div>
              </div>
            )}
            
            {/* Western Sun Sign Compatibility Section */}
            {westernCompatibilityDescription && (
              <div className={connectionOverviewText ? "pt-2" : ""}>
                {/* Western Signs Display with Icons */}
                {westernSignA && westernSignB && (
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-3xl">{getWesternSignGlyph(westernSignA)}</span>
                    <span className={`font-semibold text-xl ${
                      theme === "light" ? "text-slate-700" : "text-slate-200"
                    }`}>
                      {westernSignA}
                    </span>
                    <span className={`text-2xl ${
                      theme === "light" ? "text-pink-500" : "text-pink-400"
                    }`}>
                      ♥
                    </span>
                    <span className={`font-semibold text-xl ${
                      theme === "light" ? "text-slate-700" : "text-slate-200"
                    }`}>
                      {westernSignB}
                    </span>
                    <span className="text-3xl">{getWesternSignGlyph(westernSignB)}</span>
                  </div>
                )}
                
                {westernHeadingWithoutSignPair && (
                  <h4 className={`text-xl font-bold mb-1.5 ${
                    theme === "light" ? "text-slate-900" : "text-slate-100"
                  }`}>
                    {westernHeadingWithoutSignPair}
                  </h4>
                )}
                {/* TAGLINE - Display if available */}
                {westernCompatibilityTagline && (
                  <p className={`text-xl italic mb-2 ${
                    theme === "light" ? "text-black" : "text-white"
                  }`}>
                    {westernCompatibilityTagline}
                  </p>
                )}
                <div className="leading-relaxed whitespace-pre-line">
                  {westernCompatibilityDescription}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dropdowns - About Partner */}
        {showAbout && (aboutPartnerText || relationshipGoals || interests || city || occupation || age || height) && (
          <div className={`rounded-2xl px-3 py-3 text-sm space-y-4 relative z-20 ${
            theme === "light" 
              ? "bg-slate-100/90 text-slate-800" 
              : "bg-slate-800/50 text-slate-200"
          }`}>
            {/* About Me */}
            {aboutPartnerText && (
              <div>
                <h4 
                  className="text-base font-semibold mb-1.5"
                  style={{ 
                    background: `linear-gradient(135deg, ${gradientColors.start}, ${gradientColors.end})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  About me
                </h4>
                <p className="leading-relaxed text-2xl font-bold">{aboutPartnerText}</p>
              </div>
            )}

            {/* Relationship Goals */}
            {relationshipGoals && relationshipGoals.length > 0 && (
              <div>
                <h4 
                  className="text-base font-semibold mb-1.5"
                  style={{ 
                    background: `linear-gradient(135deg, ${gradientColors.start}, ${gradientColors.end})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Relationship Goals
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {relationshipGoals.map((goal: string, index: number) => (
                    <span
                      key={index}
                      className={`px-2 py-0.5 rounded-full text-xl font-medium ${
                        theme === "light"
                          ? "text-slate-800"
                          : "text-slate-200"
                      }`}
                      style={{
                        background: theme === "light"
                          ? `linear-gradient(135deg, ${gradientColors.start}15, ${gradientColors.end}15)`
                          : `linear-gradient(135deg, ${gradientColors.start}25, ${gradientColors.end}25)`,
                        border: `1.5px solid ${gradientColors.start}`,
                        boxShadow: `0 2px 4px ${gradientColors.start}20`
                      }}
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Interests */}
            {interests && Object.keys(interests).length > 0 && (
              <div>
                <h4 
                  className="text-base font-semibold mb-1.5"
                  style={{ 
                    background: `linear-gradient(135deg, ${gradientColors.start}, ${gradientColors.end})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Interests
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(interests).map(([category, interestList]) =>
                    (interestList as string[]).map((interest: string, index: number) => (
                      <span
                        key={`${category}-${index}`}
                        className={`px-2 py-0.5 rounded-full text-xl font-medium ${
                          theme === "light"
                            ? "text-slate-800"
                            : "text-slate-200"
                        }`}
                        style={{
                          background: theme === "light"
                            ? `linear-gradient(135deg, ${gradientColors.start}15, ${gradientColors.end}15)`
                            : `linear-gradient(135deg, ${gradientColors.start}25, ${gradientColors.end}25)`,
                          border: `1.5px solid ${gradientColors.start}`,
                          boxShadow: `0 2px 4px ${gradientColors.start}20`
                        }}
                      >
                        {interest}
                      </span>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Essentials - Location, Occupation, Age, Height */}
            {(city || occupation || age || height) && (
              <div>
                <h4 
                  className="text-base font-semibold mb-1.5"
                  style={{ 
                    background: `linear-gradient(135deg, ${gradientColors.start}, ${gradientColors.end})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Essentials
                </h4>
                <div className="space-y-1 text-xl">
                  {/* Location */}
                  {city && (
                    <div className={`flex items-center gap-1.5 ${theme === "light" ? "text-slate-700" : "text-slate-300"}`}>
                      <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      <span>{city}</span>
                    </div>
                  )}
                  {/* Occupation */}
                  {occupation && (
                    <div className={`flex items-center gap-1.5 ${theme === "light" ? "text-slate-700" : "text-slate-300"}`}>
                      <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm10 15H4V8h16v11z"/>
                      </svg>
                      <span>{occupation}</span>
                    </div>
                  )}
                  {/* Age */}
                  {age && (
                    <div className={`flex items-center gap-1.5 ${theme === "light" ? "text-slate-700" : "text-slate-300"}`}>
                      <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <path d="M16 2v4M8 2v4M3 10h18"/>
                      </svg>
                      <span>{age} years old</span>
                    </div>
                  )}
                  {/* Height */}
                  {height && (
                    <div className={`flex items-center gap-1.5 ${theme === "light" ? "text-slate-700" : "text-slate-300"}`}>
                      <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12l7-7 7 7M5 19l7-7 7 7"/>
                      </svg>
                      <span>{height}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
