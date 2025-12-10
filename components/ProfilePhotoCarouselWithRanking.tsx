"use client";

import { useState, useEffect, useRef } from "react";
import type { ConnectionBoxData } from "@/components/ConnectionBoxSimple";
import ConnectionBoxSimple from "@/components/ConnectionBoxSimple";
import PhotoCarouselWithGestures from "@/components/PhotoCarouselWithGestures";
import { LabelPill } from "@/ui/LabelPill";
import { getWesternSignGlyph, getChineseSignGlyph } from "@/lib/zodiacHelpers";
import { MatchLabelPill } from "@/components/MatchLabelPill";

const X = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="m18 6-12 12" />
    <path d="m6 6 12 12" />
  </svg>
);

const ChevronLeft = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRight = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

// Helper to get tier gradient colors
// Helper to get pattern-based solid color for borders, text, etc.
function getPatternColor(pattern?: string): string {
  if (!pattern) return 'rgb(148, 163, 184)'; // slate-400
  
  const patternUpper = pattern.toUpperCase();
  
  // San He - Triple Harmony (Gold)
  if (patternUpper.includes('SAN_HE') || patternUpper.includes('TRIPLE HARMONY')) {
    return 'rgb(251, 191, 36)'; // amber-400
  }
  
// Liu He - Secret Friends (Purple)
  if (patternUpper.includes('LIU_HE') || patternUpper.includes('SECRET ALLIES')) {
    return 'rgb(192, 132, 252)'; // purple-400
  }
  
  // Same Animal (Teal)
  if (patternUpper.includes('SAME_ANIMAL') || patternUpper.includes('SAME ANIMAL')) {
    return 'rgb(45, 212, 191)'; // teal-400
  }
  
  // No Pattern (Blue)
  if (patternUpper.includes('NO_PATTERN') || patternUpper.includes('NO MAJOR')) {
    return 'rgb(96, 165, 250)'; // blue-400
  }
  
  // Liu Chong - Six Conflicts (Orange)
  if (patternUpper.includes('LIU_CHONG') || patternUpper.includes('SIX CONFLICTS')) {
    return 'rgb(251, 146, 60)'; // orange-400
  }
  
  // Liu Hai - Six Harms (Rose)
  if (patternUpper.includes('LIU_HAI') || patternUpper.includes('SIX HARMS')) {
    return 'rgb(251, 113, 133)'; // rose-400
  }
  
  // Xing - Punishment (Red)
  if (patternUpper.includes('XING') || patternUpper.includes('PUNISHMENT')) {
    return 'rgb(248, 113, 113)'; // red-400
  }
  
  // Po -破 Break (Crimson)
  if (patternUpper.includes('PO') || patternUpper.includes('BREAK')) {
    return 'rgb(244, 63, 94)'; // rose-500
  }
  
  // Default neutral
  return 'rgb(148, 163, 184)'; // slate-400
}

function getTierGradient(tier?: string): string {
  const tierLower = (tier || '').toLowerCase();
  
  if (tierLower.includes('soulmate')) {
    return 'from-amber-300 via-yellow-300 to-orange-300';
  }
  if (tierLower.includes('twin flame')) {
    return 'from-fuchsia-400 via-pink-500 to-orange-400';
  }
  if (tierLower.includes('excellent') || tierLower.includes('harmonious')) {
    return 'from-emerald-300 via-emerald-400 to-teal-400';
  }
  if (tierLower.includes('favourable')) {
    return 'from-sky-300 via-cyan-300 to-emerald-300';
  }
  if (tierLower.includes('opposites attract') || tierLower.includes('magnetic')) {
    return 'from-cyan-300 via-indigo-400 to-fuchsia-400';
  }
  if (tierLower.includes('difficult') || tierLower.includes('challenging')) {
    return 'from-red-400 via-rose-500 to-red-600';
  }
  // Neutral default
  return 'from-slate-300 via-slate-400 to-slate-300';
}

// Helper to get pattern-based gradient colors for the new pill
function getPatternGradient(pattern?: string): string {
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
  if (patternUpper.includes('SAME_ANIMAL') || patternUpper.includes('SAME ANIMAL') || patternUpper.includes('SAME_SIGN') || patternUpper.includes('SAME SIGN')) {
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

interface ProfilePhotoCarouselWithRankingProps {
  images: string[];
  profileName: string;
  profileAge: number;
  connectionBoxData?: ConnectionBoxData;
  theme?: "light" | "dark";
  showDropdown?: boolean;
  onPhotoChange?: (index: number) => void;
  badgePosition?: "top-right" | "overlay-bottom" | "bottom-bar" | "none";
  aboutMeText?: string;
  selectedRelationshipGoals?: string[];
  selectedInterests?: string[];
  selectedDeepPrompts?: string[];
  deepPromptAnswers?: Record<string, string>;
  selectedOccupation?: string;
  selectedCity?: string;
  cityInput?: string;
  selectedHeight?: string;
  selectedChildrenOption?: string;
  selectedReligion?: string;
  birthInfo?: { birthdate: string };
  westernSign?: string;
  easternSign?: string;
  showProfileToggle?: boolean;
  onShowProfileToggle?: () => void;
  showElementsToggle?: boolean;
  onShowElementsToggle?: () => void;
  onMessageClick?: () => void;
}

export default function ProfilePhotoCarouselWithRanking({
  images,
  profileName,
  profileAge,
  connectionBoxData,
  theme = "dark",
  showDropdown = true,
  onPhotoChange,
  badgePosition = "top-right",
  aboutMeText,
  selectedRelationshipGoals = [],
  selectedInterests = [],
  selectedDeepPrompts = [],
  deepPromptAnswers = {},
  selectedOccupation,
  selectedCity,
  cityInput,
  selectedHeight,
  selectedChildrenOption,
  selectedReligion,
  birthInfo,
  westernSign,
  easternSign,
  showProfileToggle = false,
  onShowProfileToggle,
  showElementsToggle = false,
  onShowElementsToggle,
  onMessageClick,
}: ProfilePhotoCarouselWithRankingProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const [dropdownHeight, setDropdownHeight] = useState('auto');
  const [carouselWidth, setCarouselWidth] = useState<number | null>(null);
  
  // DEBUG: Log connection box data with explicit values (only once per connectionBoxData change)
  useEffect(() => {
  if (connectionBoxData) {
      console.log('[Photo Carousel]', 
      'pattern:', connectionBoxData.pattern,
        'score:', connectionBoxData.score
      );
    }
  }, [connectionBoxData]);
  
  // Touch tracking for tap vs swipe detection
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null);
  const [hasMoved, setHasMoved] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const nextPhoto = () => {
    const newIndex = (currentPhotoIndex + 1) % images.length;
    setCurrentPhotoIndex(newIndex);
    onPhotoChange?.(newIndex);
  };

  const prevPhoto = () => {
    const newIndex = (currentPhotoIndex - 1 + images.length) % images.length;
    setCurrentPhotoIndex(newIndex);
    onPhotoChange?.(newIndex);
  };

  // Touch handlers for tap vs swipe detection
  const handleTouchStart = (e: React.TouchEvent, direction: 'prev' | 'next') => {
    const touch = e.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setHasMoved(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPos) return;
    
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartPos.x);
    const deltaY = Math.abs(touch.clientY - touchStartPos.y);
    
    // If moved more than 10px, consider it a swipe
    if (deltaX > 10 || deltaY > 10) {
      setHasMoved(true);
    }
  };

  const handleTouchEnd = (direction: 'prev' | 'next') => {
    // Only trigger photo change if finger didn't move (was a tap, not a swipe)
    if (!hasMoved && touchStartPos) {
      if (direction === 'prev') {
        prevPhoto();
      } else {
        nextPhoto();
      }
    }
    setTouchStartPos(null);
    setHasMoved(false);
  };

  const getRankColor = (rankKey?: string) => {
    switch (rankKey) {
      case "perfect": return "rgb(212, 175, 55)";
      case "excellent": return "rgb(34, 197, 94)";
      case "good": return "rgb(251, 191, 36)";
      case "fair": return "rgb(56, 189, 248)";
      case "challenging": return "rgb(239, 68, 68)";
      default: return "rgb(168, 85, 247)";
    }
  };

  const getRankTextClass = (rankKey?: string) => {
    switch (rankKey) {
      case "perfect": return "text-yellow-500";
      case "excellent": return "text-emerald-500";
      case "good": return "text-amber-500";
      case "fair": return "text-sky-500";
      case "challenging": return "text-rose-500";
      default: return "text-amber-500";
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isDropdownButton = (target as Element)?.closest('[data-dropdown-button]');
      const isPhotoCarousel = (target as Element)?.closest('.photo-carousel-container');
      
      if (dropdownRef.current && !dropdownRef.current.contains(target) && !isDropdownButton && !isPhotoCarousel) {
        setShowDropdownMenu(false);
      }
    };

    if (showDropdownMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdownMenu]);

  // Get carousel width for dropdown - measure the actual carousel element
  useEffect(() => {
    const updateCarouselWidth = () => {
      // Find the actual carousel element by class name
      const carouselElement = carouselRef.current?.querySelector('.photo-carousel-container') as HTMLElement;
      if (carouselElement) {
        setCarouselWidth(carouselElement.offsetWidth);
      }
    };
    
    // Initial measurement
    updateCarouselWidth();
    
    // Also try after a short delay to ensure DOM is ready
    const timeout = setTimeout(updateCarouselWidth, 100);
    
    // Re-measure when dropdown opens
    let dropdownTimeout: NodeJS.Timeout | null = null;
    if (showDropdownMenu) {
      dropdownTimeout = setTimeout(updateCarouselWidth, 50);
    }
    
    const handleResize = () => {
      updateCarouselWidth();
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
      if (dropdownTimeout) clearTimeout(dropdownTimeout);
    };
  }, [showDropdownMenu]);

  // Auto-resize dropdown based on content
  useEffect(() => {
    if (showDropdownMenu && contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      const minHeight = 410; // Just a tiny bit longer than connection box
      const maxHeight = window.innerHeight * 0.8; // 80% of viewport height
      
      const newHeight = Math.max(minHeight, Math.min(contentHeight + 32, maxHeight)); // +32 for padding
      setDropdownHeight(`${newHeight}px`);
    }
  }, [showDropdownMenu, aboutMeText, selectedDeepPrompts, deepPromptAnswers, selectedOccupation, selectedCity, cityInput, selectedHeight, selectedChildrenOption, selectedReligion, birthInfo]);


  return (
    <div className="w-full" ref={carouselRef} style={{ position: 'static', width: '100%', maxWidth: '100%' }}>
      {/* Photo Carousel with Gestures */}
      <PhotoCarouselWithGestures
        images={images}
        currentPhotoIndex={currentPhotoIndex}
        onPhotoChange={(index) => {
          setCurrentPhotoIndex(index);
          onPhotoChange?.(index);
        }}
        className="photo-carousel-container w-full aspect-[3/4] rounded-2xl bg-black"
      >
        {/* Photo Navigation Areas - Only show when not zoomed */}
        <div
          onTouchStart={(e) => handleTouchStart(e, 'prev')}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => handleTouchEnd('prev')}
          className="absolute left-0 top-0 w-1/3 cursor-pointer z-10"
          style={{
            bottom: connectionBoxData && badgePosition === "bottom-bar" ? '80px' : '0'
          }}
        />
        <div
          onTouchStart={(e) => handleTouchStart(e, 'next')}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => handleTouchEnd('next')}
          className="absolute right-0 top-0 w-1/3 cursor-pointer z-10"
          style={{
            bottom: connectionBoxData && badgePosition === "bottom-bar" ? '80px' : '0'
          }}
        />

        {/* Photo Indicators */}
        <div className="absolute top-2 left-0 right-0 flex justify-center gap-1 px-16 z-10">
          {images.map((_, index) => (
            <div
              key={index}
              className="h-1 flex-1 rounded-full transition-all"
              style={{
                backgroundColor: index === currentPhotoIndex ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.3)',
              }}
            />
          ))}
        </div>

        {/* Name and Age Overlay - Bottom Left */}
        {profileName && (
          <div className="absolute bottom-0 left-0 right-0" style={{ zIndex: 10 }}>
            <div className="px-5 pb-2">
              <div className="text-white font-semibold text-3xl mb-1">
                {profileName}
              </div>
              {/* Geo Location */}
              {(selectedCity || cityInput) && (
                <div className="text-white text-lg font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  {selectedCity || cityInput}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dropdown controls removed for simplified overlay */}

        {/* Photo Navigation Arrows removed (touch-only navigation) */}

        {/* Ranking Badge - Top Right (if badgePosition is "top-right") */}
        {connectionBoxData && badgePosition === "top-right" && (
          <div className="absolute top-4 right-4 z-20">
            <div 
              className="px-4 py-2 rounded-full flex items-center gap-2"
              style={{
                backgroundColor: 'transparent',
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: getPatternColor(connectionBoxData.pattern),
                boxShadow: theme === "light" 
                  ? `0 2px 12px rgba(0, 0, 0, 0.15)` 
                  : `0 2px 12px rgba(0, 0, 0, 0.5)`,
              }}
            >
              <span 
                className="text-sm font-bold"
                style={{ color: getPatternColor(connectionBoxData.pattern) }}
              >
                {connectionBoxData.score}%
              </span>
              {connectionBoxData.tier && (
                <span className="ml-2">
                  <LabelPill
                    tier={connectionBoxData.tier}
                    label={connectionBoxData.rankLabel || connectionBoxData.rank}
                  />
                </span>
              )}
            </div>
          </div>
        )}
      </PhotoCarouselWithGestures>

      {/* Dropdown Menu - Below Carousel */}
      {showDropdown && showDropdownMenu && carouselWidth !== null && (
        <div 
          ref={dropdownRef}
          className="rounded-lg"
          style={{
            width: `${carouselWidth}px`,
            backgroundColor: theme === "light" ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(10px)',
            marginTop: '0px',
            height: 'auto',
            maxHeight: 'none',
            overflowY: 'visible',
          }}
        >
          <div ref={contentRef} className="p-4 pb-6 space-y-4">
            {/* Connection Box - Match Engine Details */}
            {connectionBoxData && (
              <ConnectionBoxSimple data={connectionBoxData} alwaysExpanded={true} />
            )}
          </div>
        </div>
      )}

      {/* OLD CONNECTION DROPDOWN REMOVED - Now using ConnectionBoxSimple component below the carousel */}
    </div>
  );
}

