import React, { useState } from "react";

/** ===== Types ===== */

type WesternElement = "Fire" | "Earth" | "Air" | "Water";

type ElementRelation =
  | "same"
  | "compatible"
  | "semiCompatible"
  | "opposite";

type PrimaryLabel =
  | "Soulmate Match"
  | "Twin Flame Match"
  | "Secret Friends Match"
  | "Magnetic Opposites"
  | "Challenging Match"
  | "Neutral Match";

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

interface ConnectionBoxUpdatedProps {
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
  aboutPartnerText?: string;
  
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

function getPrimaryLabel(
  basePattern: ChineseBasePattern,
  overlays: ChineseOverlayPattern[] = [],
  isOppositeBranches: boolean,
  elementRelation: ElementRelation,
  sameChineseAnimal?: boolean,
  sameWesternSign?: boolean
): PrimaryLabel {
  const hasDamage = overlays.length > 0;

  // 1) Opposite branches ALWAYS show as Magnetic Opposites.
  // Liu Chong etc. are then shown in description, not as label.
  if (isOppositeBranches) {
    return "Magnetic Opposites";
  }

  // 2) Non-opposite damage patterns → Challenging Match
  if (hasDamage) {
    return "Challenging Match";
  }

  // 3) SAN_HE logic
  if (basePattern === "SAN_HE") {
    const canUseTopTier = !sameChineseAnimal && !sameWesternSign;

    if (elementRelation === "same" && canUseTopTier) {
      return "Soulmate Match";
    }

    if (
      (elementRelation === "compatible" ||
        elementRelation === "semiCompatible") &&
      canUseTopTier
    ) {
      return "Twin Flame Match";
    }

    if (elementRelation === "opposite") {
      return "Challenging Match";
    }

    // Fallback: treat as warm but not cosmic
    return "Secret Friends Match";
  }

  // 4) LIU_HE logic
  if (basePattern === "LIU_HE") {
    if (
      elementRelation === "same" ||
      elementRelation === "compatible" ||
      elementRelation === "semiCompatible"
    ) {
      return "Secret Friends Match";
    }
    return "Challenging Match";
  }

  // 5) SAME_SIGN logic
  if (basePattern === "SAME_SIGN") {
    // If there were overlays we would already have returned Challenging above.
    // Pure Same Sign → Neutral vibe (familiar, not automatically easy).
    return "Neutral Match";
  }

  // 6) NO_PATTERN
  return "Neutral Match";
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

  if (primaryLabel === "Secret Friends Match") {
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

export const ConnectionBoxUpdated: React.FC<ConnectionBoxUpdatedProps> = ({
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
  aboutPartnerText,
  theme = "dark",
}) => {
  const [showOverview, setShowOverview] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const elementRelation =
    elementRelationOverride ?? getElementRelation(elements.a, elements.b);

  const primaryLabel = getPrimaryLabel(
    basePattern,
    overlays,
    isOppositeBranches,
    elementRelation,
    sameChineseAnimal,
    sameWesternSign
  );

  const baseChip = getBasePatternChip(basePattern, sanHeTrineName);
  const overlayChips = getOverlayChips(overlays);
  const elementChip = getElementChip(
    elements.a,
    elements.b,
    elementRelation
  );
  const headline = getHeadlineSummary(
    primaryLabel,
    basePattern,
    overlays,
    isOppositeBranches
  );

  // Get gradient colors based on primary label
  const getGradientColors = (): { start: string; end: string } => {
    switch (primaryLabel) {
      case "Soulmate Match":
        return { start: "#fbbf24", end: "#fb923c" }; // amber-400 to orange-400
      case "Twin Flame Match":
        return { start: "#c026d3", end: "#fb923c" }; // fuchsia-600 to orange-400
      case "Secret Friends Match":
        return { start: "#c084fc", end: "#f472b6" }; // purple-400 to pink-400
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
                {userAWestIcon && <span className="text-2xl">{userAWestIcon}</span>}
                {userAChineseIcon && <span className="text-2xl">{userAChineseIcon}</span>}
              </div>
              {/* Left sign label */}
              <span className={`font-bold text-sm whitespace-nowrap ${
                theme === "light" ? "text-slate-700" : "text-slate-200"
              }`}>
                {userASignLabel}
              </span>
            </div>
            
            {/* Heart icon in the center */}
            <span className={`text-lg flex-shrink-0 self-center ${
              theme === "light" ? "text-pink-500" : "text-pink-400"
            }`}>
              ♥
            </span>
            
            {/* Right side - emojis and label */}
            <div className="flex flex-col items-center flex-1 min-w-0">
              {/* Right sign emojis */}
              <div className="flex items-center gap-1 mb-1">
                {userBChineseIcon && <span className="text-2xl">{userBChineseIcon}</span>}
                {userBWestIcon && <span className="text-2xl">{userBWestIcon}</span>}
              </div>
              {/* Right sign label */}
              <span className={`font-bold text-sm whitespace-nowrap ${
                theme === "light" ? "text-slate-700" : "text-slate-200"
              }`}>
                {userBSignLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Primary label pill */}
        <div className="mb-3 flex justify-center">
          <div 
            className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-bold shadow-lg whitespace-nowrap border-2 ${
              theme === "light" ? "bg-white" : "bg-slate-900"
            }`}
            style={{
              borderColor: gradientColors.start,
              color: theme === "light" ? gradientColors.start : "white",
            }}
          >
            <span>{primaryLabel}</span>
            {typeof score === "number" && (
              <span className="ml-2 text-xs opacity-80">
                {score}%
              </span>
            )}
          </div>
        </div>

        {/* Pattern breakdown chips */}
        <div className="space-y-2 text-xs leading-snug mb-4">
          <div className="flex flex-wrap gap-1 justify-center">
            <span className={`rounded-full border px-2 py-0.5 text-[10px] ${
              theme === "light" 
                ? "border-slate-400/80 bg-slate-200/80 text-slate-700" 
                : "border-slate-600/80 bg-slate-800/80 text-slate-200"
            }`}>
              {baseChip}
            </span>
            {isOppositeBranches && (
              <span className={`rounded-full border px-2 py-0.5 text-[10px] ${
                theme === "light" 
                  ? "border-slate-400/80 bg-slate-200/80 text-slate-700" 
                  : "border-slate-600/80 bg-slate-800/80 text-slate-200"
              }`}>
                Opposite branches
              </span>
            )}
            {overlayChips.map((chip) => (
              <span
                key={chip}
                className={`rounded-full border px-2 py-0.5 text-[10px] ${
                  theme === "light" 
                    ? "border-slate-400/80 bg-slate-200/80 text-slate-700" 
                    : "border-slate-600/80 bg-slate-800/80 text-slate-200"
                }`}
              >
                {chip}
              </span>
            ))}
            <span className={`rounded-full border px-2 py-0.5 text-[10px] ${
              theme === "light" 
                ? "border-slate-400/80 bg-slate-200/80 text-slate-700" 
                : "border-slate-600/80 bg-slate-800/80 text-slate-200"
            }`}>
              {elementChip}
            </span>
          </div>

          {/* Headline summary */}
          <p className={`text-[12px] text-center leading-relaxed ${
            theme === "light" ? "text-slate-700" : "text-slate-300"
          }`}>
            {headline}
          </p>
        </div>

        {/* Action Buttons Row */}
        <div className="mt-4 mb-4">
          <div className="grid grid-cols-3 gap-2">
            {/* Profile Button */}
            <button
              onClick={() => setShowAbout(!showAbout)}
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
              onClick={() => setShowOverview(!showOverview)}
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
        {showOverview && connectionOverviewText && (
          <div className={`rounded-2xl px-3 py-3 text-[12px] mb-3 ${
            theme === "light" 
              ? "bg-slate-100/90 text-slate-800" 
              : "bg-slate-800/50 text-slate-200"
          }`}>
            <h3 className={`text-sm font-semibold mb-2 ${
              theme === "light" ? "text-slate-900" : "text-slate-100"
            }`}>
              Connection Overview
            </h3>
            <p className="leading-relaxed">{connectionOverviewText}</p>
          </div>
        )}

        {/* Dropdowns - About Partner */}
        {showAbout && aboutPartnerText && (
          <div className={`rounded-2xl px-3 py-3 text-[12px] ${
            theme === "light" 
              ? "bg-slate-100/90 text-slate-800" 
              : "bg-slate-800/50 text-slate-200"
          }`}>
            <h3 className={`text-sm font-semibold mb-2 ${
              theme === "light" ? "text-slate-900" : "text-slate-100"
            }`}>
              About {userBName}
            </h3>
            <p className="leading-relaxed">{aboutPartnerText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

