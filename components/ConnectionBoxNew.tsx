import React, { useState } from "react";
import clsx from "clsx";
import {
  MatchTier,
  ChinesePattern,
  WestAspect,
  WestElementRelation,
} from "@/lib/matchEngine";
import { getPatternTagline } from "@/lib/matchTaglines";
import { getWestStarsFromAspect, getChineseStarsFromPattern } from "@/lib/starRatings";
// NEW: Import pattern label helpers
import { 
  getPatternHeaderLabel, 
  getPatternIcon, 
  getPatternTagline as getNewPatternTagline 
} from "@/lib/astrology/patternLabels";
import { 
  formatSignComboLine, 
  formatElementsLine,
  type SideForLabels,
  type ChineseElement
} from "@/lib/astrology/elementsLine";
import { normalizeWesternSign, getWesternElement, getWesternModality, type WesternSign } from "@/lib/astrology/westMeta";
import { getChineseSignGlyph } from "@/lib/zodiacHelpers";

// Helper to remove "Match" from tier labels for display
function formatTierLabel(tier: string): string {
  return tier.replace(/\s+Match$/i, '').trim();
}

// Helper to get pattern-based gradient for buttons (matches photo carousel pill)
function getPatternGradientForButtons(pattern?: string): string {
  if (!pattern) return 'from-slate-300 via-slate-400 to-slate-300';
  
  const patternUpper = pattern.toUpperCase();
  
  // San He / SAN_HE - Triple Harmony (Gold/Amber)
  if (patternUpper.includes('SAN_HE') || patternUpper.includes('TRIPLE HARMONY')) {
    return 'from-amber-400 via-yellow-400 to-amber-500';
  }
  
  // Liu He / LIU_HE - Secret Friends (Purple/Pink)
  if (patternUpper.includes('LIU_HE') || patternUpper.includes('SECRET ALLIES') || patternUpper.includes('SECRET FRIENDS')) {
    return 'from-purple-400 via-fuchsia-400 to-pink-400';
  }
  
  // Same Animal / SAME_SIGN (Teal/Cyan)
  if (patternUpper.includes('SAME_SIGN') || patternUpper.includes('SAME ANIMAL') || patternUpper.includes('SAME_SIGN') || patternUpper.includes('SAME SIGN')) {
    return 'from-teal-400 via-cyan-400 to-sky-400';
  }
  
  // No Pattern / NEUTRAL (Blue/Slate)
  if (patternUpper.includes('NO_PATTERN') || patternUpper.includes('NO MAJOR') || patternUpper.includes('NEUTRAL')) {
    return 'from-blue-400 via-indigo-400 to-blue-500';
  }
  
  // Liu Chong / LIU_CHONG - Six Conflicts (Orange/Red)
  if (patternUpper.includes('LIU_CHONG') || patternUpper.includes('SIX CONFLICTS')) {
    return 'from-orange-400 via-orange-500 to-red-500';
  }
  
  // Liu Hai / LIU_HAI - Six Harms (Rose/Pink)
  if (patternUpper.includes('LIU_HAI') || patternUpper.includes('SIX HARMS')) {
    return 'from-rose-400 via-pink-500 to-rose-500';
  }
  
  // Xing - Punishment (Red)
  if (patternUpper.includes('XING') || patternUpper.includes('PUNISHMENT')) {
    return 'from-red-500 via-red-600 to-red-700';
  }
  
  // Po - Break (Red/Crimson)
  if (patternUpper.includes('PO') || patternUpper.includes('BREAK')) {
    return 'from-red-600 via-rose-700 to-red-800';
  }
  
  // Fallback
  return 'from-slate-300 via-slate-400 to-slate-300';
}

// Star rating component
const MAX_STARS = 5;

// Simple 1–5 star display (rounded), gold stars
function StarBar({ value, theme = "dark" }: { value: number; theme?: "light" | "dark" }) {
  const clamped = Math.max(1, Math.min(5, Math.round(value)));
  const full = clamped;
  const empty = 5 - full;

  return (
    <span className="inline-flex items-center gap-0.5 text-[11px] text-yellow-400">
      {"★".repeat(full)}
      <span className={theme === "light" ? "text-gray-300" : "text-slate-600/60"}>
        {"★".repeat(empty)}
      </span>
    </span>
  );
}

interface EnergyRatings {
  chemistry: number;
  harmony: number;
  stability: number;
  spark: number;
}

function EnergyRow({ label, value, theme = "dark" }: { label: string; value: number; theme?: "light" | "dark" }) {
  return (
    <div className={`flex items-center justify-between text-[11px] ${theme === "light" ? "text-gray-700" : "text-slate-300"}`}>
      <span>{label}</span>
      <StarBar value={value} theme={theme} />
    </div>
  );
}

// Drop this inside your toggle dropdown content
function EnergyRatingsBlock({ ratings, theme = "dark" }: { ratings: EnergyRatings; theme?: "light" | "dark" }) {
  const { chemistry, harmony, stability, spark } = ratings;

  return (
    <div className={`mt-2 space-y-1 border-t pt-2 ${theme === "light" ? "border-gray-300/60" : "border-slate-700/60"}`}>
      <EnergyRow label="Chemistry" value={chemistry} theme={theme} />
      <EnergyRow label="Harmony" value={harmony} theme={theme} />
      <EnergyRow label="Stability" value={stability} theme={theme} />
      <EnergyRow label="Spark" value={spark} theme={theme} />
    </div>
  );
}

// Simple gold star row for 0–5 stars (supports half stars)
function StarRow({ value, theme = "dark" }: { value?: number; theme?: "light" | "dark" }) {
  // Always show 5 stars, even if value is 0 or undefined
  const clamped = Math.max(0, Math.min(5, value ?? 0));
  const full = Math.floor(clamped);
  const hasHalf = (clamped % 1) >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  return (
    <div className="inline-flex items-center text-[12px] leading-none" style={{ gap: '1px' }}>
      {/* Full stars */}
      {Array.from({ length: full }).map((_, i) => (
        <span key={`full-${i}`} className="text-yellow-400 inline-block">★</span>
      ))}
      {/* Half star - render with clipping */}
      {hasHalf && (
        <span className="relative inline-block text-yellow-400 align-top" style={{ width: '0.55em', overflow: 'hidden' }}>
          ★
        </span>
      )}
      {/* Empty stars */}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`empty-${i}`} className={`inline-block ${theme === "light" ? "text-gray-300" : "text-slate-600/60"}`}>★</span>
      ))}
    </div>
  );
}

type LegacyMatchTier =
  | "Soulmate"
  | "Twin Flame"
  | "Excellent"
  | "Favourable"
  | "Neutral"
  | "Opposites Attract"
  | "Difficult";

interface ConnectionBoxProps {
  tier: LegacyMatchTier | MatchTier;
  score: number; // 0–100
  westA: string; // "Aquarius"
  eastA: string; // "Monkey"
  westB: string; // "Leo"
  eastB: string; // "Goat"
  chineseLine: string; // Monkey × Horse — No major classical pattern...
  sunMatchBlurb: string; // Aquarius × Aquarius — Independent, user-minded...
  westernLine: string; // Aquarius × Aquarius — Air × Air... (element line)
  wuXingLine?: string; // Metal Monkey × Metal Horse — Elemental harmony...
  connectionBlurb?: string;
  theme?: "light" | "dark";
  // Chinese year elements (for elements line)
  chineseElementA?: string; // "Metal", "Wood", etc.
  chineseElementB?: string;
  // Profile details
  aboutMe?: string;
  age?: number;
  city?: string;
  occupation?: string;
  height?: string;
  children?: string;
  religion?: string;
  // NEW pattern fields for taglines and star ratings
  chinesePattern?: ChinesePattern;
  westAspect?: WestAspect;
  westElementRelation?: WestElementRelation;
  isChineseOpposite?: boolean;
  isLivelyPair?: boolean;
  // Compatibility summary stars (0-5)
  westCompatStars?: number; // from Sun-sign compatibility summary
  eastCompatStars?: number; // from Chinese compatibility summary
  // NEW: Match engine result fields
  patternFullLabel?: string; // e.g. "🌟 San He 三合 · Triple Harmony · 92%"
  pillLabel?: string; // e.g. "92% · Triple Harmony"
  baseTagline?: string; // Pattern explanation line
  patternEmoji?: string; // Pattern emoji
  pattern?: string; // ChinesePattern for reference
  chemistryStars?: number; // 0-5 chemistry rating
  stabilityStars?: number; // 0-5 stability rating
  // NEW: matchEngineCore fields
  patternLabelEn?: string; // e.g. "Triple Harmony"
  patternLabelZh?: string; // e.g. "三合"
  patternTagline?: string; // e.g. "Classic trine alliance with strong, long-term harmony."
  connectionOverview?: string; // e.g. "Very strong, flowing harmony with excellent long-term potential."
  // Show profile control (controlled from parent)
  showProfile?: boolean;
  // Show elements control (controlled from parent)
  showElements?: boolean;
  // Energy ratings - REMOVED (now using Chemistry/Stability from match engine)
  // energyRatings?: EnergyRatings;
  // Action handlers
  onPass?: () => void;
  onLike?: () => void;
  onMessage?: () => void;
  onViewProfile?: () => void;
}

const tierStyles: Record<
  LegacyMatchTier | MatchTier,
  { bg: string; text: string; border: string }
> = {
  Soulmate: {
    // luminous gold
    bg: "from-amber-300 via-yellow-300 to-orange-300",
    text: "text-slate-950",
    border: "border-amber-200/80",
  },
  "Twin Flame": {
    // hot romantic flame
    bg: "from-fuchsia-400 via-pink-500 to-orange-400",
    text: "text-slate-950",
    border: "border-pink-300/80",
  },
  Excellent: {
    // strong, healthy green
    bg: "from-emerald-300 via-emerald-400 to-teal-400",
    text: "text-slate-950",
    border: "border-emerald-200/80",
  },
  Favourable: {
    // lighter, friendly aqua
    bg: "from-sky-300 via-cyan-300 to-emerald-300",
    text: "text-slate-950",
    border: "border-sky-200/80",
  },
  Neutral: {
    // soft blue-grey (light mode) / slate on navy (dark mode)
    bg: "from-slate-300 via-slate-400 to-slate-300",
    text: "text-slate-950",
    border: "border-slate-200/80",
  },
  "Opposites Attract": {
    // cosmic clash: cool→warm
    bg: "from-cyan-300 via-indigo-400 to-fuchsia-400",
    text: "text-slate-950",
    border: "border-indigo-300/80",
  },
  Difficult: {
    // warning
    bg: "from-red-400 via-rose-500 to-red-600",
    text: "text-red-50",
    border: "border-rose-300/80",
  },
  // New tiers from updated match engine
  "Soulmate Match": {
    bg: "from-amber-300 via-yellow-300 to-orange-300",
    text: "text-slate-950",
    border: "border-amber-200/80",
  },
  "Twin Flame Match": {
    bg: "from-fuchsia-400 via-pink-500 to-orange-400",
    text: "text-slate-950",
    border: "border-pink-300/80",
  },
  "Harmonious Match": {
    bg: "from-emerald-300 via-emerald-400 to-teal-400",
    text: "text-slate-950",
    border: "border-emerald-200/80",
  },
  "Neutral Match": {
    bg: "from-slate-300 via-slate-400 to-slate-300",
    text: "text-slate-950",
    border: "border-slate-200/80",
  },
  "Difficult Match": {
    bg: "from-red-400 via-rose-500 to-red-600",
    text: "text-red-50",
    border: "border-rose-300/80",
  },
};

const tierGradientText: Record<LegacyMatchTier | MatchTier, string> = {
  Soulmate: "bg-gradient-to-r from-amber-200 via-yellow-200 to-orange-200",
  "Twin Flame":
    "bg-gradient-to-r from-fuchsia-300 via-pink-400 to-orange-300",
  Excellent:
    "bg-gradient-to-r from-emerald-200 via-emerald-300 to-teal-300",
  Favourable:
    "bg-gradient-to-r from-sky-200 via-cyan-200 to-emerald-200",
  Neutral:
    "bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200",
  "Opposites Attract":
    "bg-gradient-to-r from-orange-300 via-orange-400 to-red-400", // warm coral/orange gradient
  Difficult:
    "bg-gradient-to-r from-red-200 via-rose-300 to-red-300",
  // New tiers
  "Soulmate Match": "bg-gradient-to-r from-amber-200 via-yellow-200 to-orange-200",
  "Twin Flame Match": "bg-gradient-to-r from-fuchsia-300 via-pink-400 to-orange-300",
  "Harmonious Match": "bg-gradient-to-r from-emerald-200 via-emerald-300 to-teal-300",
  "Neutral Match": "bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200",
  "Difficult Match": "bg-gradient-to-r from-red-200 via-rose-300 to-red-300",
};

function SectionHeading({
  tier,
  children,
  theme = "dark",
}: {
  tier: LegacyMatchTier | MatchTier;
  children: React.ReactNode;
  theme?: "light" | "dark";
}) {
  // Use solid color for Neutral tier, gradient for others
  if (tier === "Neutral" || tier === "Neutral Match") {
    return (
      <h2
        className="text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase"
        style={{ 
          color: theme === "light" ? "#42526B" : "#E5E7EB" 
        }}
      >
        {children}
      </h2>
    );
  }
  
  return (
    <h2
      className={`
        text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase
        bg-clip-text text-transparent
        ${tierGradientText[tier]}
      `}
    >
      {children}
    </h2>
  );
}

export const ConnectionBoxNew: React.FC<ConnectionBoxProps> = ({
  tier,
  score,
  westA,
  eastA,
  westB,
  eastB,
  chineseLine,
  sunMatchBlurb,
  westernLine,
  wuXingLine,
  connectionBlurb,
  theme = "dark",
  chineseElementA,
  chineseElementB,
  aboutMe,
  age,
  city,
  occupation,
  height,
  children,
  religion,
  chinesePattern,
  westAspect,
  westElementRelation,
  isChineseOpposite = false,
  isLivelyPair = false,
  westCompatStars,
  eastCompatStars,
  showProfile = false,
  showElements = false,
  // energyRatings, // REMOVED - no longer used
  // NEW: Match engine fields
  patternFullLabel,
  pillLabel,
  baseTagline,
  patternEmoji,
  pattern,
  chemistryStars,
  stabilityStars,
  // NEW: matchEngineCore fields
  patternLabelEn,
  patternLabelZh,
  patternTagline,
  connectionOverview,
  onPass,
  onLike,
  onMessage,
  onViewProfile,
}) => {
  const styles = tierStyles[tier];
  
  // DEBUG: Log star ratings
  console.log('[ConnectionBoxNew] Star ratings received:', {
    chemistryStars,
    stabilityStars,
    patternFullLabel,
    pillLabel,
  });
  
  // Calculate star ratings from patterns if not explicitly provided
  const westStars = westCompatStars ?? (
    (westAspect && westElementRelation)
      ? getWestStarsFromAspect(westAspect, westElementRelation, westA === westB)
      : undefined
  );
  
  const eastStars = eastCompatStars ?? (
    chinesePattern
      ? getChineseStarsFromPattern(chinesePattern, isLivelyPair)
      : undefined
  );
  
  // Check if we have any element information to show
  const hasAnyElementInfo = Boolean(wuXingLine || westernLine);
  
  // Determine if we have profile details to show
  const hasProfileDetails = Boolean(
    aboutMe || age || city || occupation || height || children || religion
  );

  // Get computed pattern tagline if we have the required fields
  const computedPatternTagline = (chinesePattern && westAspect && westElementRelation)
    ? getPatternTagline({
        tier: tier as MatchTier,
        chinesePattern,
        westAspect,
        westElementRelation,
        isChineseOpposite,
      })
    : undefined;

  // Determine overview text (single line under sign row)
  const overviewText = (() => {
    // Prioritize connectionOverview from new engine
    if (connectionOverview) {
      return connectionOverview;
    }
    if (pattern === "NO_PATTERN") {
      if (connectionBlurb && connectionBlurb.trim().length > 0) {
        return connectionBlurb;
      }
      return "The connection can feel flexible and open-ended.";
    }
    return connectionBlurb || patternTagline || computedPatternTagline;
  })();
  
  // Debug logging for taglines
  if (chinesePattern && westAspect && westElementRelation) {
    console.log('[ConnectionBox] Tagline Debug:', {
      tier,
      chinesePattern,
      westAspect,
      westElementRelation,
      isChineseOpposite,
      tagline: patternTagline
    });
  }
  
  // Get gradient colors for headings based on tier
  const getGradientColors = (tier: LegacyMatchTier | MatchTier): { start: string; end: string } => {
    switch (tier) {
      case "Soulmate":
        return { start: "#f59e0b", end: "#fb923c" }; // amber-500 to orange-400
      case "Twin Flame":
        return { start: "#c026d3", end: "#fb923c" }; // fuchsia-600 to orange-400
      case "Excellent":
        return { start: "#34d399", end: "#2dd4bf" }; // emerald-400 to teal-400
      case "Favourable":
        return { start: "#38bdf8", end: "#34d399" }; // sky-400 to emerald-400
      case "Neutral":
        // Match the gradient from the rank label pill: slate-300 via slate-400 to slate-300
        return theme === "light" 
          ? { start: "#b0bec9", end: "#b0bec9" } // Slightly darker than slate-300
          : { start: "#27364A", end: "#27364A" }; // slate on navy background
      case "Opposites Attract":
        // Match the rank label pill gradient: cyan-300 via indigo-400 to fuchsia-400
        return { start: "#67e8f9", end: "#c084fc" }; // cyan-300 to fuchsia-400
      case "Difficult":
        return { start: "#f87171", end: "#dc2626" }; // red-400 to red-600
      // New tiers
      case "Soulmate Match":
        return { start: "#f59e0b", end: "#fb923c" }; // amber-500 to orange-400
      case "Twin Flame Match":
        return { start: "#c026d3", end: "#fb923c" }; // fuchsia-600 to orange-400
      case "Harmonious Match":
        return { start: "#34d399", end: "#2dd4bf" }; // emerald-400 to teal-400
      case "Neutral Match":
        return theme === "light" 
          ? { start: "#b0bec9", end: "#b0bec9" } // Slightly darker than slate-300
          : { start: "#27364A", end: "#27364A" };
      case "Difficult Match":
        return { start: "#f87171", end: "#dc2626" }; // red-400 to red-600
      default:
        return { start: "#94a3b8", end: "#94a3b8" }; // slate-400
    }
  };
  
  // Get gradient colors based on pattern (for new match engine)
  const getPatternGradientColors = (pattern?: string): { start: string; end: string } => {
    if (!pattern) return { start: "#94a3b8", end: "#94a3b8" }; // slate-400
    
    const patternUpper = pattern.toUpperCase();
    
    // San He - Triple Harmony (Gold/Amber)
    if (patternUpper.includes('SAN_HE') || patternUpper.includes('TRIPLE HARMONY')) {
      return { start: "#fbbf24", end: "#fb923c" }; // amber-400 to orange-400
    }
    
    // Liu He - Secret Friends (Purple/Pink)
    if (patternUpper.includes('LIU_HE') || patternUpper.includes('SECRET FRIENDS')) {
      return { start: "#c084fc", end: "#f472b6" }; // purple-400 to pink-400
    }
    
    // Same Animal (Teal/Cyan)
    if (patternUpper.includes('SAME_SIGN') || patternUpper.includes('SAME ANIMAL')) {
      return { start: "#2dd4bf", end: "#22d3ee" }; // teal-400 to cyan-400
    }
    
    // No Pattern (Blue)
    if (patternUpper.includes('NO_PATTERN') || patternUpper.includes('NO MAJOR')) {
      return { start: "#60a5fa", end: "#818cf8" }; // blue-400 to indigo-400
    }
    
    // Liu Chong - Six Conflicts (Orange/Red)
    if (patternUpper.includes('LIU_CHONG') || patternUpper.includes('SIX CONFLICTS')) {
      return { start: "#fb923c", end: "#ef4444" }; // orange-400 to red-500
    }
    
    // Liu Hai - Six Harms (Rose/Pink)
    if (patternUpper.includes('LIU_HAI') || patternUpper.includes('SIX HARMS')) {
      return { start: "#fb7185", end: "#f472b6" }; // rose-400 to pink-400
    }
    
    // Xing - Punishment (Red)
    if (patternUpper.includes('XING') || patternUpper.includes('PUNISHMENT')) {
      return { start: "#f87171", end: "#dc2626" }; // red-400 to red-600
    }
    
    // Po - Break (Crimson)
    if (patternUpper.includes('PO') || patternUpper.includes('BREAK')) {
      return { start: "#f43f5e", end: "#be123c" }; // rose-500 to rose-700
    }
    
    // Default
    return { start: "#94a3b8", end: "#94a3b8" }; // slate-400
  };
  
  // Parse patternFullLabel to extract individual pieces
  // Example: "🌟 San He 三合 · Triple Harmony · 92%" or "Liu He 六合 · \"Secret Friends\" · 82%"
  const parsePatternLabel = (label?: string) => {
    if (!label) return { labelEn: '', labelZh: '', emoji: patternEmoji || '' };
    
    // Remove emoji and score from the label
    let cleaned = label.replace(/[🌟💫⚠️◽🪞✨]+/g, '').trim();
    cleaned = cleaned.replace(/·\s*\d+%\s*$/, '').trim();
    
    // Split by the middle dot to separate Chinese/English parts
    const parts = cleaned.split('·').map(p => p.trim());
    
    if (parts.length >= 2) {
      // First part has Chinese characters (e.g., "San He 三合" or "Liu He 六合")
      // Second part is English label (e.g., "Triple Harmony" or "Secret Friends")
      const firstPart = parts[0];
      const labelEn = parts[1].replace(/^[""]|[""]$/g, ''); // Remove quotes if present
      
      // Extract Chinese characters from first part (e.g., "三合" from "San He 三合")
      const zhMatch = firstPart.match(/[\u4e00-\u9fa5]+/);
      const labelZh = zhMatch ? zhMatch[0] : '';
      
      return { labelEn, labelZh, emoji: patternEmoji || '' };
    }
    
    return { labelEn: cleaned, labelZh: '', emoji: patternEmoji || '' };
  };

  const parsedPattern = parsePatternLabel(patternFullLabel);
  
  // Get Chinese characters and pinyin for the pattern if available
  const getPatternChinese = (patternKey?: string): { pinyin: string; hanzi: string } => {
    if (!patternKey) return { pinyin: '', hanzi: '' };
    const key = patternKey.toUpperCase();
    switch (key) {
      case 'SAN_HE':
      case 'TRIPLE HARMONY':
        return { pinyin: 'San He', hanzi: '三合' };
      case 'LIU_HE':
      case 'SECRET FRIENDS':
        return { pinyin: 'Liu He', hanzi: '六合' };
      case 'LIU_CHONG':
      case 'SIX CONFLICTS':
        return { pinyin: 'Liu Chong', hanzi: '六冲' };
      case 'LIU_HAI':
      case 'SIX HARMS':
        return { pinyin: 'Liu Hai', hanzi: '六害' };
      case 'XING':
      case 'PUNISHMENT':
        return { pinyin: 'Xing', hanzi: '刑' };
      case 'PO':
      case 'BREAK':
        return { pinyin: 'Po', hanzi: '破' };
      case 'SAME_SIGN':
      case 'SAME_SIGN':
        return { pinyin: '', hanzi: '' };
      default:
        return { pinyin: '', hanzi: '' };
    }
  };
  
  // Use pattern-based colors if pattern is available, otherwise fall back to tier-based colors
  const gradientColors = pattern ? getPatternGradientColors(pattern) : getGradientColors(tier);
  
  // Use new pattern helpers for display
  const patternIconNew = pattern ? getPatternIcon(pattern as any) : (patternEmoji || parsedPattern.emoji || '');
  const patternLabelBase = pattern ? getPatternHeaderLabel(pattern as any) : (patternLabelEn || parsedPattern.labelEn || '');
  
  // Safely build pattern label - don't crash if data is missing
  let patternLabelNew = patternLabelBase || tier || 'Match';
  
  // Only try to enhance the label if we have the base data
  if (patternLabelBase && pattern) {
    try {
      const chineseInfo = getPatternChinese(pattern);
      if (chineseInfo.pinyin && chineseInfo.hanzi) {
        // Check if pinyin is already in the label
        if (!patternLabelBase.includes(chineseInfo.pinyin)) {
          // Format: "Triple Harmony (San He 三合)"
          const englishPart = patternLabelBase.replace(chineseInfo.hanzi, '').trim();
          if (englishPart) {
            patternLabelNew = `${englishPart} (${chineseInfo.pinyin} ${chineseInfo.hanzi})`;
          }
        }
      }
    } catch (error) {
      console.error('[ConnectionBoxNew] Error formatting pattern label:', error);
      // Just use the base label or tier
    }
  }
  
  // Safely get pattern tagline
  let patternTaglineNew = '';
  try {
    patternTaglineNew = pattern ? getNewPatternTagline(pattern as any) : (patternTagline || baseTagline || '');
  } catch (error) {
    console.error('[ConnectionBoxNew] Error getting pattern tagline:', error);
    patternTaglineNew = patternTagline || baseTagline || '';
  }

  // Build formatted labels for connection overview
  const userALabel = `${westA} / ${eastA || ''}`;
  const userBLabel = `${westB} / ${eastB || ''}`;
  
  // Build elements line if we have Chinese elements
  let elementsLineText: string | undefined;
  if (chineseElementA && chineseElementB) {
    try {
      const westANormalized = normalizeWesternSign(westA);
      const westBNormalized = normalizeWesternSign(westB);
      const westAMod = getWesternModality(westANormalized);
      const westAElem = getWesternElement(westANormalized);
      const westBMod = getWesternModality(westBNormalized);
      const westBElem = getWesternElement(westBNormalized);
      
      // Format: "Fixed Air / Metal × Mutable Air / Earth"
      elementsLineText = `${westAMod} ${westAElem} / ${chineseElementA} × ${westBMod} ${westBElem} / ${chineseElementB}`;
    } catch (error) {
      console.error('[ConnectionBoxNew] Error building elements line:', error);
    }
  }
  
  // Use connectionBlurb or overviewText as the overview text
  const connectionOverviewText = overviewText;

  return (
    <>
      {/* Connection Box - Compatibility Info - Only show when elements toggle is open */}
      {showElements && (
        <div 
          className={clsx(
            "w-full max-w-xl rounded-2xl p-4 sm:p-5 backdrop-blur-md flex flex-col",
            theme === "light" 
              ? "bg-white" 
              : "bg-slate-900/90"
          )}
          style={{ 
            minHeight: '400px',
            paddingBottom: '24px',
            border: `1.5px solid ${gradientColors.start}`,
          }}
        >
          {/* Pattern + sun sign + elements */}
          <div className="space-y-4 text-xs sm:text-sm flex-1">
            
            {/* ===== TOP SECTION - NEW CLEANER FORMAT ===== */}
            <div className="mb-4">
              {/* Pattern header in a pill */}
              <div className="flex items-center justify-center">
                <div 
                  className="inline-flex items-center rounded-full px-4 py-2 text-base font-semibold shadow-lg whitespace-nowrap text-white"
                  style={{
                    background: `linear-gradient(to right, ${gradientColors.start}, ${gradientColors.end})`,
                  }}
                >
                  {`${patternLabelNew || tier || 'Match'} · ${score}%`}
                </div>
              </div>

              {/* One-line pattern description */}
              {patternTaglineNew && pattern !== "NO_PATTERN" && (
                <p className={clsx(
                  "mt-1 text-base text-center",
                  theme === "light" ? "text-gray-600" : "text-slate-400"
                )}>
                  {patternTaglineNew}
                </p>
              )}

              {/* Special neutral line for No Major Pattern */}
              {pattern === "NO_PATTERN" && (
                <p className={clsx(
                  "mt-1 text-base text-center",
                  theme === "light" ? "text-gray-600" : "text-slate-400"
                )}>
                  Neutral in Chinese astrology; no strong harmony or conflict pattern.
                </p>
              )}

            </div>

            {/* Astrology sign combinations - below match pill and description */}
            <div className="px-3 py-1 flex items-center justify-center w-full overflow-hidden">
              {/* Center the entire line as one unit with consistent smaller font */}
              <div className="flex items-center gap-1 justify-center whitespace-nowrap">
                {/* Left signs */}
                <span className={clsx(
                  "font-bold text-base", // Smaller consistent size
                  theme === "light" ? "text-slate-700" : "text-slate-200"
                )}>
                  {userALabel}
                </span>
                
                {/* Heart icon in the center */}
                <span className={clsx(
                  "text-base flex-shrink-0", // Matches text size
                  theme === "light" ? "text-pink-500" : "text-pink-400"
                )}>
                  ♥
                </span>
                
                {/* Right signs */}
                <span className={clsx(
                  "font-bold text-base", // Smaller consistent size
                  theme === "light" ? "text-slate-700" : "text-slate-200"
                )}>
                  {userBLabel}
                </span>
              </div>
            </div>

            {/* ===== ASTROLOGY BREAKDOWN ===== */}
            {hasAnyElementInfo && (
              <div className="space-y-2">
                
                {/* Chinese Connection */}
                <div className={clsx(
                  "rounded-xl px-3 py-1.5",
                  theme === "light" 
                    ? "bg-slate-50 text-slate-700" 
                    : "bg-slate-800/50 text-slate-200"
                )}>
                  <div className={clsx(
                    "space-y-0.5 text-sm sm:text-base leading-snug text-left",
                    theme === "light" ? "text-slate-600" : "text-slate-300"
                  )}>
                    {/* Chinese zodiac signs on their own line */}
                    <p className={`font-semibold text-sm whitespace-nowrap ${theme === "light" ? "text-black" : "text-white"}`}>{eastA || ''} × {eastB || ''}</p>
                    
                    {/* Rest of the Chinese line (pattern description) */}
                    {chineseLine && (
                      <p className="text-sm">{chineseLine.replace(/^[^—]*—\s*/, '')}</p>
                    )}
                    
                    {/* Chinese Year Elements - displayed under the Chinese connection */}
                    {(wuXingLine || elementsLineText) && (
                      <p className={clsx(
                        "text-sm pt-0.5",
                        theme === "light" ? "text-slate-600" : "text-slate-300"
                      )}>
                        {wuXingLine || elementsLineText}
                      </p>
                    )}
                  </div>
                </div>

                {/* Western Connection */}
                <div className={clsx(
                  "rounded-xl px-3 py-1.5",
                  theme === "light" 
                    ? "bg-slate-50 text-slate-700" 
                    : "bg-slate-800/50 text-slate-200"
                )}>
                  <div className={clsx(
                    "space-y-0.5 text-sm sm:text-base leading-snug text-left",
                    theme === "light" ? "text-slate-600" : "text-slate-300"
                  )}>
                    {/* Western zodiac signs on their own line */}
                    <p className={`font-semibold text-sm whitespace-nowrap ${theme === "light" ? "text-black" : "text-white"}`}>{westA} × {westB}</p>
                    
                    {/* Sun sign description */}
                    {sunMatchBlurb && (
                      <p className="text-sm">{sunMatchBlurb.replace(/^[^—]*—\s*/, '')}</p>
                    )}
                    
                    {/* Element line - match Chinese elements styling */}
                    {westernLine && <p className="text-sm">{westernLine}</p>}
                  </div>
                </div>

              </div>
            )}

            {/* Action Buttons Row - Inside connection box, after Western connection */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="grid grid-cols-4 gap-2">
                {/* Pass Button */}
                <button
                  onClick={onPass}
                  className="inline-flex items-center justify-center rounded-full px-3 py-2.5 text-xs font-semibold tracking-wide text-white transition-opacity hover:opacity-90 shadow-lg active:scale-95"
                  style={{
                    background: `linear-gradient(to right, ${gradientColors.start}, ${gradientColors.end})`
                  }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>

                {/* Like Button */}
                <button
                  onClick={onLike}
                  className="inline-flex items-center justify-center rounded-full px-3 py-2.5 text-xs font-semibold tracking-wide text-white transition-opacity hover:opacity-90 shadow-lg active:scale-95"
                  style={{
                    background: `linear-gradient(to right, ${gradientColors.start}, ${gradientColors.end})`
                  }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </button>

                {/* Chat Button */}
                <button
                  onClick={onMessage}
                  className="inline-flex items-center justify-center rounded-full px-3 py-2.5 text-xs font-semibold tracking-wide text-white transition-opacity hover:opacity-90 shadow-lg active:scale-95"
                  style={{
                    background: `linear-gradient(to right, ${gradientColors.start}, ${gradientColors.end})`
                  }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  </svg>
                </button>

                {/* Profile Button */}
                <button
                  onClick={onViewProfile}
                  className="inline-flex items-center justify-center rounded-full px-3 py-2.5 text-xs font-semibold tracking-wide text-white transition-opacity hover:opacity-90 shadow-lg active:scale-95"
                  style={{
                    background: `linear-gradient(to right, ${gradientColors.start}, ${gradientColors.end})`
                  }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </button>
              </div>
            </div>

          </div>

          {/* Optional blurb */}
          {false && connectionBlurb && (
            <>
              <div className={clsx(
                "my-3 h-px w-full",
                theme === "light" ? "bg-gray-300/60" : "bg-slate-700/60"
              )} />
              <p className={clsx(
                "text-xs leading-relaxed",
                theme === "light" ? "text-gray-700" : "text-white/80"
              )}>
                {connectionBlurb}
              </p>
            </>
          )}
        </div>
      )}

      {/* Profile Details Box - Separate background box */}
      {hasProfileDetails && showProfile && (
        <div 
          className={clsx(
            "w-full max-w-xl rounded-2xl border p-4 sm:p-5 backdrop-blur-md mt-3",
            theme === "light" 
              ? "bg-white border-gray-200" 
              : "bg-slate-900/90 border-white/10"
          )}
        >
          {/* About me section */}
          {aboutMe && (
            <div className={clsx(aboutMe && (age || city || occupation || height || children || religion) ? "mb-4" : "")}>
              <div className="mb-3">
                <div
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide text-white ${styles.border}`}
                  style={{
                    background: `linear-gradient(to right, ${gradientColors.start}, ${gradientColors.end})`,
                  }}
                >
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-white" />
                  About Me
                </div>
              </div>
              <p className={clsx(
                "text-sm leading-relaxed",
                theme === "light" ? "text-gray-700" : "text-white/90"
              )}>
                {aboutMe}
              </p>
            </div>
          )}

          {/* Divider between About Me and Essentials */}
          {aboutMe && (age || city || occupation || height || children || religion) && (
            <div className={clsx(
              "my-4 h-px w-full bg-gradient-to-r from-transparent to-transparent",
              theme === "light" ? "via-gray-300/50" : "via-slate-500/50"
            )} />
          )}

          {/* Essentials section */}
          {(age || city || occupation || height || children || religion) && (
            <div>
              <div className="mb-3">
                <div
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide text-white ${styles.border}`}
                  style={{
                    background: `linear-gradient(to right, ${gradientColors.start}, ${gradientColors.end})`,
                  }}
                >
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-white" />
                  Essentials
                </div>
              </div>
              <div className="space-y-2 text-base">
                {age && (
                  <div className={clsx(
                    "flex items-center gap-2 font-medium",
                    theme === "light" ? "text-gray-700" : "text-gray-100"
                  )}>
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke={gradientColors.start} strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <path d="M16 2v4M8 2v4M3 10h18"/>
                    </svg>
                    <span>{age} years old</span>
                  </div>
                )}
                {city && (
                  <div className={clsx(
                    "flex items-center gap-2 font-medium",
                    theme === "light" ? "text-gray-700" : "text-gray-100"
                  )}>
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill={gradientColors.start}>
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span>{city}</span>
                  </div>
                )}
                {occupation && (
                  <div className={clsx(
                    "flex items-center gap-2 font-medium",
                    theme === "light" ? "text-gray-700" : "text-gray-100"
                  )}>
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill={gradientColors.start}>
                      <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm10 15H4V8h16v11z"/>
                    </svg>
                    <span>{occupation}</span>
                  </div>
                )}
                {height && (
                  <div className={clsx(
                    "flex items-center gap-2 font-medium",
                    theme === "light" ? "text-gray-700" : "text-gray-100"
                  )}>
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke={gradientColors.start} strokeWidth="2">
                      <path d="M12 5v14M5 12l7-7 7 7M5 19l7-7 7 7"/>
                    </svg>
                    <span>{height}</span>
                  </div>
                )}
                {children && (
                  <div className={clsx(
                    "flex items-center gap-2 font-medium",
                    theme === "light" ? "text-gray-700" : "text-gray-100"
                  )}>
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill={gradientColors.start}>
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    <span>{children}</span>
                  </div>
                )}
                {religion && (
                  <div className={clsx(
                    "flex items-center gap-2 font-medium",
                    theme === "light" ? "text-gray-700" : "text-gray-100"
                  )}>
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke={gradientColors.start} strokeWidth="2">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                    </svg>
                    <span>{religion}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};


