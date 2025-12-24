"use client";

import React, { useState, useRef } from "react";
import ProfilePhotoCarouselWithRanking from "@/components/ProfilePhotoCarouselWithRanking";
import { ConnectionBoxNew } from "@/components/ConnectionBoxNew";
import type { ConnectionBoxData } from "@/components/ConnectionBoxSimple";
import { getEnergyRatings } from "@/src/lib/energyRatings";
import { computeWuXingRelation } from "@/src/lib/matchEngine";
import { deriveConnectionOverview } from "@/lib/patternOneLiner";

interface MatchProfileCardProps {
  profile: {
    id: number;
    name: string;
    age: number;
    photos: string[];
    aboutMe?: string;
    occupation?: string;
    city?: string;
    height?: string;
    children?: string;
    religion?: string;
    prompts?: Array<{ question: string; answer: string }>;
    westernSign?: string;
    easternSign?: string;
    relationshipGoals?: string[];
    selectedRelationshipGoals?: string[];
    interests?: any;
    selectedOrganizedInterests?: any;
  };
  connectionBoxData?: ConnectionBoxData;
  theme?: "light" | "dark";
  onPhotoChange?: (index: number) => void;
  onMessageClick?: () => void;
  onPass?: () => void;
  onLike?: () => void;
  showProfileToggle?: boolean;
  onShowProfileToggle?: () => void;
  showElementsToggle?: boolean;
  onShowElementsToggle?: () => void;
  isNewMatch?: boolean;
  matchedAt?: string;
}

const MessageCircle = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className={className} style={style}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

// Helper function to map match labels to ConnectionBoxNew tiers (legacy format)
function mapToLegacyTier(rankLabel?: string, rank?: string): "Soulmate" | "Twin Flame" | "Excellent" | "Favourable" | "Neutral" | "Opposites Attract" | "Difficult" {
  const label = (rankLabel || rank || "").toLowerCase();
  
  if (label.includes("soulmate")) return "Soulmate";
  if (label.includes("twin flame")) return "Twin Flame";
  if (label.includes("excellent") || label.includes("harmonious")) return "Excellent";
  if (label.includes("favourable") || label.includes("favorable")) return "Favourable";
  if (label.includes("opposites attract") || label.includes("magnetic opposites")) return "Opposites Attract";
  if (label.includes("difficult") || label.includes("challenging")) return "Difficult";
  
  return "Neutral";
}

// Helper function to map match labels to new MatchTier format for taglines
function mapToNewTier(rankLabel?: string, rank?: string): "Soulmate Match" | "Twin Flame Match" | "Harmonious Match" | "Neutral Match" | "Opposites Attract" | "Difficult Match" {
  const label = (rankLabel || rank || "").toLowerCase();
  
  if (label.includes("soulmate")) return "Soulmate Match";
  if (label.includes("twin flame")) return "Twin Flame Match";
  if (label.includes("excellent") || label.includes("harmonious")) return "Harmonious Match";
  if (label.includes("opposites attract") || label.includes("magnetic opposites")) return "Opposites Attract";
  if (label.includes("difficult") || label.includes("challenging")) return "Difficult Match";
  
  return "Neutral Match";
}

// Helper function to capitalize first letter
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Helper function to get gradient colors based on tier
// Helper to get pattern-based gradient colors
function getPatternGradientColors(pattern?: string): { start: string; end: string } {
  if (!pattern) return { start: '#60a5fa', end: '#3b82f6' }; // blue-400 to blue-500 (same as NO_PATTERN)
  
  const patternUpper = pattern.toUpperCase();
  
  // San He - Triple Harmony (Gold)
  if (patternUpper.includes('SAN_HE') || patternUpper.includes('TRIPLE HARMONY')) {
    return { start: '#fbbf24', end: '#f59e0b' }; // amber-400 to amber-500
  }
  
  // Liu He - Secret Friends (Purple)
  if (patternUpper.includes('LIU_HE') || patternUpper.includes('SECRET ALLIES')) {
    return { start: '#c084fc', end: '#e879f9' }; // purple-400 to fuchsia-400
  }
  
  // Same Animal/Sign (Teal)
  if (patternUpper.includes('SAME_ANIMAL') || patternUpper.includes('SAME ANIMAL') || 
      patternUpper.includes('SAME_SIGN') || patternUpper.includes('SAME SIGN')) {
    return { start: '#2dd4bf', end: '#14b8a6' }; // teal-400 to teal-500
  }
  
  // No Pattern (Blue)
  if (patternUpper.includes('NO_PATTERN') || patternUpper.includes('NO MAJOR')) {
    return { start: '#60a5fa', end: '#3b82f6' }; // blue-400 to blue-500
  }
  
  // Liu Chong - Six Conflicts (Orange)
  if (patternUpper.includes('LIU_CHONG') || patternUpper.includes('SIX CONFLICTS')) {
    return { start: '#fb923c', end: '#f97316' }; // orange-400 to orange-500
  }
  
  // Liu Hai - Six Harms (Rose)
  if (patternUpper.includes('LIU_HAI') || patternUpper.includes('SIX HARMS')) {
    return { start: '#fb7185', end: '#f43f5e' }; // rose-400 to rose-500
  }
  
  // Xing - Punishment (Red)
  if (patternUpper.includes('XING') || patternUpper.includes('PUNISHMENT')) {
    return { start: '#f87171', end: '#ef4444' }; // red-400 to red-500
  }
  
  // Po - Break (Crimson)
  if (patternUpper.includes('PO') || patternUpper.includes('BREAK')) {
    return { start: '#f43f5e', end: '#e11d48' }; // rose-500 to rose-600
  }
  
  // Default neutral (use blue, same as NO_PATTERN)
  return { start: '#60a5fa', end: '#3b82f6' }; // blue-400 to blue-500
}

function getTierGradientColors(tier: string): { start: string; end: string } {
  const tierLower = tier.toLowerCase();
  
  if (tierLower.includes('soulmate')) {
    return { start: '#fbbf24', end: '#fb923c' }; // amber-300 to orange-400
  }
  if (tierLower.includes('twin flame')) {
    return { start: '#e879f9', end: '#fb7185' }; // fuchsia-400 to pink-400
  }
  if (tierLower.includes('excellent') || tierLower.includes('harmonious')) {
    return { start: '#34d399', end: '#2dd4bf' }; // emerald-400 to teal-400
  }
  if (tierLower.includes('favourable')) {
    return { start: '#7dd3fc', end: '#6ee7b7' }; // sky-300 to emerald-300
  }
  if (tierLower.includes('opposites attract') || tierLower.includes('magnetic')) {
    return { start: '#67e8f9', end: '#c084fc' }; // cyan-300 to purple-400
  }
  if (tierLower.includes('difficult') || tierLower.includes('challenging')) {
    return { start: '#f87171', end: '#dc2626' }; // red-400 to red-600
  }
  // Neutral default (use blue, same as NO_PATTERN)
  return { start: '#60a5fa', end: '#3b82f6' }; // blue-400 to blue-500
}


export default function MatchProfileCard({
  profile,
  connectionBoxData,
  theme = "dark",
  onPhotoChange,
  onMessageClick,
  onPass,
  onLike,
  showProfileToggle: externalShowProfile,
  onShowProfileToggle: externalOnShowProfileToggle,
  showElementsToggle: externalShowElements,
  onShowElementsToggle: externalOnShowElementsToggle,
  isNewMatch,
  matchedAt,
}: MatchProfileCardProps) {
  // Use external state if provided, otherwise use internal state
  const [internalShowProfile, setInternalShowProfile] = useState(false);
  const [internalShowElements, setInternalShowElements] = useState(true); // Default to true - connection box always open
  
  const showProfile = externalShowProfile !== undefined ? externalShowProfile : internalShowProfile;
  const showElements = externalShowElements !== undefined ? externalShowElements : internalShowElements; // Always true - connection box always visible
  
  const handleShowProfileToggle = () => {
    console.log('[MatchProfileCard] Profile toggle clicked', { externalOnShowProfileToggle: !!externalOnShowProfileToggle, showProfile });
    if (externalOnShowProfileToggle) {
      externalOnShowProfileToggle();
    } else {
      if (showProfile) {
        setInternalShowProfile(false);
      } else {
        setInternalShowProfile(true);
        setInternalShowElements(false);
      }
    }
  };
  
  const handleShowElementsToggle = () => {
    console.log('[MatchProfileCard] Elements toggle clicked', { externalOnShowElementsToggle: !!externalOnShowElementsToggle, showElements });
    if (externalOnShowElementsToggle) {
      externalOnShowElementsToggle();
    } else {
      if (showElements) {
        setInternalShowElements(false);
      } else {
        setInternalShowElements(true);
        setInternalShowProfile(false);
      }
    }
  };
  
  const connectionBoxRef = useRef<HTMLDivElement>(null);
  
  // Extract the appropriate western sign based on what's provided in profile
  // profile.westernSign is the display sign (already adjusted by parent for tropical/sidereal)
  const displayWesternSign = profile.westernSign;
  const displayEasternSign = profile.easternSign;
  // Map ConnectionBoxData to ConnectionBoxNew props
  const tier = connectionBoxData ? mapToLegacyTier(connectionBoxData.rankLabel, connectionBoxData.rank) : "Neutral";
  const newTier = connectionBoxData ? mapToNewTier(connectionBoxData.rankLabel, connectionBoxData.rank) : "Neutral Match";
  const westA = connectionBoxData?.a?.west ? capitalize(connectionBoxData.a.west) : "Unknown";
  const eastA = connectionBoxData?.a?.east ? capitalize(connectionBoxData.a.east) : "Unknown";
  const westB = connectionBoxData?.b?.west ? capitalize(connectionBoxData.b.west) : "Unknown";
  const eastB = connectionBoxData?.b?.east ? capitalize(connectionBoxData.b.east) : "Unknown";
  
  // Get the descriptive lines from connectionBoxData
  const chineseLine = connectionBoxData?.east_relation || `${eastA} × ${eastB}`;
  const westernLine = connectionBoxData?.west_relation || `${westA} × ${westB}`;
  const wuXingLine = connectionBoxData?.wuXingLine; // Wu Xing (Five Elements) line
  
  // Use custom overview if available, otherwise derive from pattern + score
  const connectionBlurb = connectionBoxData?.insight && connectionBoxData.insight.trim().length > 0
    ? connectionBoxData.insight
    : connectionBoxData?.pattern && connectionBoxData?.score
    ? deriveConnectionOverview(
        connectionBoxData.pattern as import('@/lib/matchEngine').ChinesePattern,
        connectionBoxData.score
      )
    : undefined;
  
  // Calculate energy ratings dynamically if we have the necessary data
  const energyRatings = connectionBoxData?.chinesePattern && 
    connectionBoxData?.westAspect && 
    connectionBoxData?.westElementRelation &&
    connectionBoxData?.wuXingA &&
    connectionBoxData?.wuXingB
    ? getEnergyRatings({
        tier: newTier,
        chinesePattern: connectionBoxData.chinesePattern,
        westAspect: connectionBoxData.westAspect,
        westElementRelation: connectionBoxData.westElementRelation,
        wuXingRelation: computeWuXingRelation(
          connectionBoxData.wuXingA,
          connectionBoxData.wuXingB
        ),
        sameSunSign: westA.toLowerCase() === westB.toLowerCase(), // Check if same sun sign
      })
    : {
        chemistry: 4,
        harmony: 4,
        stability: 3.5,
        spark: 3,
      }; // Fallback placeholder
  
  // Get gradient colors based on pattern (not tier)
  const patternColors = getPatternGradientColors(connectionBoxData?.pattern);
  
  const hasOpenDropdown = showProfile || showElements;
  
  // Debug logging
  React.useEffect(() => {
    console.log('[MatchProfileCard] State update:', {
      showProfile,
      showElements,
      hasOpenDropdown,
      hasConnectionBoxData: !!connectionBoxData,
      externalShowProfile,
      externalShowElements,
      willRenderDropdown: hasOpenDropdown && !!connectionBoxData,
    });
  }, [showProfile, showElements, hasOpenDropdown, connectionBoxData, externalShowProfile, externalShowElements]);

  return (
    <div className="w-full">
      {/* Outer border wrapper for entire profile card - matches profile view tab exactly */}
        {profile.photos.length > 0 && (
          <div
            style={{
              background: `linear-gradient(to right, ${patternColors.start}, ${patternColors.end})`,
              padding: '4px',
              borderRadius: '1.5rem',
              boxSizing: 'border-box',
              width: '100%',
            }}
          >
            <div
              style={{
                borderRadius: '1.5rem',
                background: `linear-gradient(to right, ${patternColors.start}, ${patternColors.end})`,
                overflow: 'visible',
              }}
            >
              {/* Photo Carousel with Border - matches profile view tab exactly */}
              {profile.photos.length > 0 && (
                <div
                  className="w-full rounded-3xl relative"
                  style={{ 
                    background: `linear-gradient(to right, ${patternColors.start}, ${patternColors.end})`,
                    padding: '4px',
                    borderRadius: '1.5rem',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                  }}
                >
                  <div className="w-full rounded-3xl overflow-hidden" style={{ margin: '0', padding: '0', borderRadius: '1.5rem', backgroundColor: theme === "light" ? "#f9fafb" : "#0f172a" }}>
                    <ProfilePhotoCarouselWithRanking
                      images={profile.photos}
                      profileName={profile.name}
                      profileAge={profile.age}
                      connectionBoxData={connectionBoxData}
                      theme={theme}
                      showDropdown={false}
                      badgePosition="overlay-bottom"
                      aboutMeText={profile.aboutMe}
                      selectedOccupation={profile.occupation}
                      selectedCity={profile.city}
                      cityInput={profile.city || ""}
                      selectedHeight={profile.height}
                      selectedChildrenOption={profile.children}
                      selectedReligion={profile.religion}
                      westernSign={displayWesternSign}
                      easternSign={displayEasternSign}
                      onPhotoChange={onPhotoChange}
                      showProfileToggle={false}
                      onShowProfileToggle={() => {}}
                      showElementsToggle={false}
                      onShowElementsToggle={() => {}}
                      onMessageClick={onMessageClick}
                      patternColors={patternColors}
                      isNewMatch={isNewMatch}
                      matchedAt={matchedAt}
                    />
                  </div>
                </div>
              )}

              {/* Match Box - Always visible, matches profile view tab exactly */}
              {connectionBoxData && profile.photos.length > 0 && (
                <div className="relative w-full" style={{ marginTop: '-4px', marginBottom: '-34px', zIndex: 10 }}>
                  <ConnectionBoxNew
                    tier={newTier}
                    score={connectionBoxData.score}
                    westA={westA}
                    eastA={eastA}
                    westB={westB}
                    eastB={eastB}
                    chineseLine={chineseLine}
                    sunMatchBlurb={connectionBoxData.westernSignLine || ""}
                    westernLine={westernLine}
                    wuXingLine={wuXingLine}
                    chineseElementA={connectionBoxData.a?.chineseElement}
                    chineseElementB={connectionBoxData.b?.chineseElement}
                    connectionBlurb={connectionBlurb || undefined}
                    theme={theme}
                    aboutMe={profile.aboutMe}
                    age={profile.age}
                    city={profile.city}
                    occupation={profile.occupation}
                    height={profile.height}
                    children={profile.children}
                    religion={profile.religion}
                    chinesePattern={connectionBoxData.chinesePattern}
                    westAspect={connectionBoxData.westAspect}
                    westElementRelation={connectionBoxData.westElementRelation}
                    isChineseOpposite={connectionBoxData.isChineseOpposite}
                    isLivelyPair={connectionBoxData.isLivelyPair}
                    showProfile={false}
                    showElements={true}
                    patternFullLabel={connectionBoxData.patternFullLabel}
                    pillLabel={connectionBoxData.pillLabel}
                    baseTagline={connectionBoxData.baseTagline}
                    patternEmoji={connectionBoxData.patternEmoji}
                    pattern={connectionBoxData.pattern}
                    chemistryStars={connectionBoxData.chemistryStars}
                    stabilityStars={connectionBoxData.stabilityStars}
                    patternColors={patternColors}
                    relationshipGoals={profile.relationshipGoals || profile.selectedRelationshipGoals}
                    interests={profile.interests || profile.selectedOrganizedInterests}
                    onPass={onPass}
                    onLike={onLike}
                    onMessage={onMessageClick}
                    onViewProfile={() => {
                      if (externalOnShowProfileToggle) {
                        externalOnShowProfileToggle();
                      } else {
                        setInternalShowProfile(false);
                      }
                    }}
                  />
                </div>
              )}

              {/* Profile Dropdown - Overlays profile box when open - matches profile view tab exactly */}
              {showProfile && connectionBoxData && profile.photos.length > 0 && (
                <div 
                  className="w-full"
                  style={{ 
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    marginTop: '-36px',
                  }}
                >
                  <div
                    style={{
                      background: `linear-gradient(to right, ${patternColors.start}, ${patternColors.end})`,
                      padding: '0 4px 4px 4px',
                      borderRadius: '1.5rem',
                      boxSizing: 'border-box',
                      width: '100%',
                    }}
                  >
                    <div
                      style={{
                        borderRadius: 'calc(1.5rem - 3px)',
                        backgroundColor: theme === "light" ? "#ffffff" : "#1e293b",
                        overflow: 'hidden',
                      }}
                    >
                      <ConnectionBoxNew
                        tier={newTier}
                        score={connectionBoxData.score}
                        westA={westA}
                        eastA={eastA}
                        westB={westB}
                        eastB={eastB}
                        chineseLine={chineseLine}
                        sunMatchBlurb={connectionBoxData.westernSignLine || ""}
                        westernLine={westernLine}
                        wuXingLine={wuXingLine}
                        chineseElementA={connectionBoxData.a?.chineseElement}
                        chineseElementB={connectionBoxData.b?.chineseElement}
                        connectionBlurb={connectionBlurb || undefined}
                        theme={theme}
                        aboutMe={profile.aboutMe}
                        age={profile.age}
                        city={profile.city}
                        occupation={profile.occupation}
                        height={profile.height}
                        children={profile.children}
                        religion={profile.religion}
                        chinesePattern={connectionBoxData.chinesePattern}
                        westAspect={connectionBoxData.westAspect}
                        westElementRelation={connectionBoxData.westElementRelation}
                        isChineseOpposite={connectionBoxData.isChineseOpposite}
                        isLivelyPair={connectionBoxData.isLivelyPair}
                        showProfile={true}
                        showElements={false}
                        patternFullLabel={connectionBoxData.patternFullLabel}
                        pillLabel={connectionBoxData.pillLabel}
                        baseTagline={connectionBoxData.baseTagline}
                        patternEmoji={connectionBoxData.patternEmoji}
                        pattern={connectionBoxData.pattern}
                        chemistryStars={connectionBoxData.chemistryStars}
                        stabilityStars={connectionBoxData.stabilityStars}
                        patternColors={patternColors}
                        relationshipGoals={profile.relationshipGoals || profile.selectedRelationshipGoals}
                        interests={profile.interests || profile.selectedOrganizedInterests}
                        onPass={onPass}
                        onLike={onLike}
                        onMessage={onMessageClick}
                        onViewProfile={() => {
                          if (externalOnShowProfileToggle) {
                            externalOnShowProfileToggle();
                          } else {
                            setInternalShowProfile(false);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
}
