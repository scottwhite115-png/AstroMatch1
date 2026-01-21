// /components/ConnectionBoxSimple.tsx

"use client";

import { useState } from "react";
import type { RankKey } from "@/data/rankTheme";
import { useTheme } from "@/contexts/ThemeContext";
import type { Tier } from "@/engine/labels";
import { TIER_LABEL } from "@/engine/labels";
import type { MatchResult as AstroMatchResult } from "@/engine/astromatch-engine";

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
  "Good Match": "Good Match",
  "Compatible Match": "Compatible Match",
  "Good Connection": "Good Match",
  "Good Match": "Good Match",
  "Good": "Good Match",
  "Sparky Friends": "Good Friends",
  "Sparky Friends Match": "Good Friends",
  "Good Friends": "Good Friends",
  "Good Friends Match": "Good Friends",
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
  west_relation: string;
  west_summary: string;
  a: { west: string; east: string; westGlyph: string; eastGlyph: string };
  b: { west: string; east: string; westGlyph: string; eastGlyph: string };
  tier?: Tier;
  // Profile sections
  aboutMeText?: string;
  selectedDeepPrompts?: string[];
  deepPromptAnswers?: {[key: string]: string};
  selectedRelationshipGoals?: string[];
  // Essentials
  age?: number;
  occupation?: string;
  city?: string;
  distance?: number; // Distance in kilometers
  height?: string;
  children?: string;
  religion?: string;
  astroMatch?: AstroMatchResult;
}

interface ConnectionBoxSimpleProps {
  data: ConnectionBoxData;
  alwaysExpanded?: boolean;
  hideHeader?: boolean; // Hide the emoji, rank, and score header
}

export default function ConnectionBoxSimple({ data, alwaysExpanded = false, hideHeader = false }: ConnectionBoxSimpleProps) {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(alwaysExpanded);
  const astroMatch = data.astroMatch;
  // Use tier color from classifier, but override for Magnetic Opposites
  // Always prioritize data.colorRgb (from classifier) over astroMatch.color to avoid old colors
  const isMagneticOppositesCheck = astroMatch?.chinese.relation === "opposite" || data.rankLabel?.includes("Opposites Attract") || data.tier === "opposites_attract";
  const oppositesAttractColor = "rgb(239, 68, 68)"; // Red color for Opposites Attract
  const primaryColor = isMagneticOppositesCheck ? oppositesAttractColor : (data.colorRgb || astroMatch?.color || "#FFD700");

  // Always prioritize classifier result (data.rankLabel or data.rank) over astroMatch
  const baseRankSource = data.rankLabel || data.rank || (astroMatch
    ? `${astroMatch.tier} Match`
    : (data.tier ? TIER_LABEL[data.tier] : undefined));
  const flattenedLabel = baseRankSource ? (labelOverrides[baseRankSource] || baseRankSource) : "Connection";
  const rankText = astroMatch
    ? flattenedLabel
    : (() => {
        const lower = flattenedLabel.toLowerCase();
        if (lower.includes("connection") || lower.includes("match")) {
          return flattenedLabel;
        }
        return `${flattenedLabel} Connection`;
      })();
  // Use the tier color consistently - Magnetic Opposites should always use red
  // isMagneticOpposites is already determined above via isMagneticOppositesCheck
  const isMagneticOpposites = isMagneticOppositesCheck;
  // rankColor is already set via primaryColor above, which handles Magnetic Opposites
  const rankColor = primaryColor;
  const rankStyle = { color: rankColor, WebkitTextFillColor: rankColor } as React.CSSProperties;
  // Always use classifier score, fallback to astroMatch only if classifier score not available
  const scoreValue = data.score ?? (astroMatch ? astroMatch.score : undefined);
  const scoreDisplay = typeof scoreValue === "number" ? Math.round(scoreValue) : undefined;
  const headerText = (() => {
    if (isMagneticOpposites) {
      return typeof scoreDisplay === "number"
        ? `Magnetic Opposites ${scoreDisplay}%`
        : "Magnetic Opposites";
    }
    if (typeof scoreDisplay === "number") {
      return `${rankText} ${scoreDisplay}%`;
    }
    return rankText;
  })();
  const hasProfileDetails = Boolean(
    data.aboutMeText ||
    data.age ||
    data.occupation ||
    data.city ||
    data.height ||
    data.children ||
    data.religion
  );
  
  return (
    <div>
      {/* Compact Header - Always Visible (unless hideHeader is true) */}
      {!hideHeader && (
        !alwaysExpanded ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full p-4 hover:opacity-90 transition-opacity"
          >
            {/* Top Row: Rank, Score, Chevron */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xl font-semibold" style={rankStyle}>
                <span className="truncate">{headerText}</span>
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
        ) : (
          <div className="p-3">
            {/* Top Row: Rank, Score (No Chevron when always expanded) */}
            <div className="flex items-center justify-start gap-2 mb-1" style={rankStyle}>
              <span className="text-2xl font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                {headerText}
              </span>
            </div>
          </div>
        )
      )}

      {/* Expanded Content */}
      {(isExpanded || alwaysExpanded) && (
        <div className="pb-2 pt-0">
          {/* Combined Match Details */}
          <div
            className="px-4 py-4 rounded-lg space-y-5"
            style={{ backgroundColor: theme === "light" ? "rgba(0, 0, 0, 0.03)" : "rgba(255, 255, 255, 0.05)", marginBottom: '0.75rem' }}
          >
            {/* Main Match Info */}
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="font-semibold text-2xl text-center" style={rankStyle}>
                  {headerText}
                </span>
              </div>

              {astroMatch?.badges?.length && !isMagneticOpposites ? (
                <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                  {astroMatch.badges.map((badge) => (
                    <span
                      key={badge}
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: theme === "light" ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.07)",
                        border: `1px solid ${primaryColor}`,
                        color: primaryColor,
                      }}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className={`flex items-center justify-center gap-2 text-lg mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-100"}`}>
                <span className="font-semibold">
                  {data.a.west}/{data.a.east}
                </span>
                <span className="font-bold">×</span>
                <span className="font-semibold">
                  {data.b.west}/{data.b.east}
                </span>
              </div>
            
              {data.tagline && data.tagline !== data.east_tagline && (
                <div className={`text-sm text-center mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>
                  {data.tagline}
                </div>
              )}

              {data.longformBody && (
                <p className={`text-base leading-relaxed ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
                  {data.longformBody}
                </p>
              )}

              {data.insight && !data.longformBody && (
                <p className={`text-base leading-relaxed ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
                  {data.insight}
                </p>
              )}
            </div>

            {/* Divider */}
            {/* EAST — Chinese rationale */}
            <div>
              <div className="font-semibold text-base mb-1.5" style={{ color: primaryColor, WebkitTextFillColor: primaryColor } as any}>
                {(() => {
                  const relation = data.east_relation;
                  const normalizedRelation = relation.includes("Same Sign")
                    ? relation.replace("Same Sign", "Same Trine")
                    : relation;
                  if (relation.includes("⚡ Magnetic Opposites")) {
                    const parts = normalizedRelation.split(" — ");
                    const prefix = parts[0] || "";
                    return (
                      <span>
                        {prefix}
                        {prefix && " — "}
                        <span className="inline-flex items-center gap-1.5">
                          <span className="text-base leading-none">⚡</span>
                          <span className="font-bold">Magnetic Opposites</span>
                        </span>
                      </span>
                    );
                  }
                  return normalizedRelation;
                })()}
              </div>
              <div className={`text-base leading-relaxed ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
                {data.east_summary}
              </div>
            </div>

            {/* Divider */}
            {/* WEST — Element rationale */}
            <div>
              <div className="font-semibold text-base mb-1.5" style={{ color: primaryColor, WebkitTextFillColor: primaryColor } as any}>
                {(() => {
                  const relation = data.west_relation;
                  if (relation.includes("⚡ Magnetic Opposites")) {
                    const parts = relation.split(" — ");
                    const prefix = parts[0] || "";
                    return (
                      <span>
                        {prefix}
                        {prefix && " — "}
                        <span className="inline-flex items-center gap-1.5">
                          <span className="text-base leading-none">⚡</span>
                          <span className="font-bold">Magnetic Opposites</span>
                        </span>
                      </span>
                    );
                  }
                  return relation;
                })()}
              </div>
              <div className={`text-base leading-relaxed ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
                {data.west_summary}
              </div>
            </div>
            {hasProfileDetails && (
              <>
                <div className={`h-px ${theme === "light" ? "bg-black/10" : "bg-white/10"}`} />
                <div className="space-y-4">
                  {data.aboutMeText && (
                    <div>
                      <h4
                        className="text-base font-semibold mb-2 flex items-center gap-2"
                        style={{ color: primaryColor }}
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
                        About me
                      </h4>
                      <p className={`text-lg leading-relaxed ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
                        {data.aboutMeText}
                      </p>
                    </div>
                  )}
                  {(data.age || data.occupation || data.city || data.height || data.children || data.religion) && (
                    <div>
                      <h4
                        className="text-base font-semibold mb-3 flex items-center gap-2"
                        style={{ color: primaryColor }}
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
                        Essentials
                      </h4>
                      <div className="space-y-2 text-base">
                        {data.age && (
                          <div className={`flex items-center gap-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-100"}`}>
                            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                              <path d="M16 2v4M8 2v4M3 10h18"/>
                            </svg>
                            <span>{data.age} years old</span>
                          </div>
                        )}
                        {data.city && (
                          <div className={`flex items-center gap-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-100"}`}>
                            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill={primaryColor}>
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
                        {data.occupation && (
                          <div className={`flex items-center gap-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-100"}`}>
                            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill={primaryColor}>
                              <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm10 15H4V8h16v11z"/>
                            </svg>
                            <span>{data.occupation}</span>
                          </div>
                        )}
                        {data.height && (
                          <div className={`flex items-center gap-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-100"}`}>
                            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="2">
                              <path d="M12 5v14M5 12l7-7 7 7M5 19l7-7 7 7"/>
                            </svg>
                            <span>{data.height}</span>
                          </div>
                        )}
                        {data.children && (
                          <div className={`flex items-center gap-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-100"}`}>
                            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill={primaryColor}>
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                            <span>{data.children}</span>
                          </div>
                        )}
                        {data.religion && (
                          <div className={`flex items-center gap-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-100"}`}>
                            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="2">
                              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                            </svg>
                            <span>{data.religion}</span>
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


