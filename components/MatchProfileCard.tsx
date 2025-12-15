"use client";

import { useState } from "react";
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
  };
  connectionBoxData?: ConnectionBoxData;
  theme?: "light" | "dark";
  onPhotoChange?: (index: number) => void;
  onMessageClick?: () => void;
  onPass?: () => void;
  onLike?: () => void;
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
  if (!pattern) return { start: '#94a3b8', end: '#94a3b8' }; // slate-400
  
  const patternUpper = pattern.toUpperCase();
  
  // San He - Triple Harmony (Gold)
  if (patternUpper.includes('SAN_HE') || patternUpper.includes('TRIPLE HARMONY')) {
    return { start: '#fbbf24', end: '#f59e0b' }; // amber-400 to amber-500
  }
  
  // Liu He - Secret Friends (Purple)
  if (patternUpper.includes('LIU_HE') || patternUpper.includes('SECRET ALLIES')) {
    return { start: '#c084fc', end: '#e879f9' }; // purple-400 to fuchsia-400
  }
  
  // Same Animal (Teal)
  if (patternUpper.includes('SAME_ANIMAL') || patternUpper.includes('SAME ANIMAL')) {
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
  
  // Default neutral
  return { start: '#94a3b8', end: '#94a3b8' }; // slate-400
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
  // Neutral default
  return { start: '#94a3b8', end: '#94a3b8' }; // slate-400
}


export default function MatchProfileCard({
  profile,
  connectionBoxData,
  theme = "dark",
  onPhotoChange,
  onMessageClick,
  onPass,
  onLike,
}: MatchProfileCardProps) {
  const [showProfile, setShowProfile] = useState(false);
  const [showElements, setShowElements] = useState(true); // Always show connection box
  
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
  
  return (
    <div
      className={`w-full rounded-3xl ${theme === "light" ? "bg-gray-50" : "bg-slate-900"} overflow-hidden flex flex-col`}
      style={{ minHeight: "calc(100vh - 180px)" }}
    >
      {/* Photo Carousel with Ranking */}
      {profile.photos.length > 0 && (
        <div className="relative px-2 mb-3">
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
            showProfileToggle={showProfile}
            onShowProfileToggle={() => setShowProfile(!showProfile)}
            showElementsToggle={true} // Always true - connection box always visible
            onShowElementsToggle={() => {}} // No-op - toggle disabled
            onMessageClick={onMessageClick}
          />
        </div>
      )}

      {/* Connection Box - Only shown when at least one toggle is open */}
      {(showProfile || showElements) && (
        <div className={`px-2 mt-auto pb-32 relative ${
          theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"
        }`} style={{
          // Extend padding beyond card boundaries to match page background during swipes
          position: 'relative',
          marginLeft: '-1rem',
          marginRight: '-1rem',
          marginBottom: '-1rem',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          paddingBottom: 'calc(8rem + 1rem)',
        }}>
          {/* Connection box with higher z-index so dropdowns appear above padding */}
          <div className="relative" style={{ zIndex: 10 }}>
            {connectionBoxData ? (
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
                showProfile={showProfile}
                showElements={showElements}
                // NEW: Pass match engine fields
                patternFullLabel={connectionBoxData.patternFullLabel}
                pillLabel={connectionBoxData.pillLabel}
                baseTagline={connectionBoxData.baseTagline}
                patternEmoji={connectionBoxData.patternEmoji}
                pattern={connectionBoxData.pattern}
                chemistryStars={connectionBoxData.chemistryStars}
                stabilityStars={connectionBoxData.stabilityStars}
                // Pass relationship goals and interests
                relationshipGoals={profile.relationshipGoals || profile.selectedRelationshipGoals}
                interests={profile.interests || profile.selectedOrganizedInterests}
                // Action handlers
                onPass={onPass}
                onLike={onLike}
                onMessage={onMessageClick}
                onViewProfile={() => setShowProfile(!showProfile)}
              />
            ) : (
              <div className="p-4 text-center text-gray-500">Loading connection data...</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
