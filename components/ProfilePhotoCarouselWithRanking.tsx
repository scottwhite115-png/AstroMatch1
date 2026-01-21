"use client";

import { useState, useEffect, useRef } from "react";
import type { ConnectionBoxData } from "@/components/ConnectionBoxSimple";
import ConnectionBoxSimple from "@/components/ConnectionBoxSimple";
import PhotoCarouselWithGestures from "@/components/PhotoCarouselWithGestures";
import { LabelPill } from "@/ui/LabelPill";
import { getWesternSignGlyph, getChineseSignGlyph } from "@/lib/zodiacHelpers";
import { MatchLabelPill } from "@/components/MatchLabelPill";
import { CardOverlay } from "@/components/CardOverlay";

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

const MessageCircle = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={style}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

// FourPointedStar component removed - connection box is now permanently open

// Helper to get tier gradient colors
// Helper to get pattern-based solid color for borders, text, etc.
function getPatternColor(pattern?: string): string {
  if (!pattern) return 'rgb(96, 165, 250)'; // blue-400 (same as NO_PATTERN)
  
  const patternUpper = pattern.toUpperCase();
  
  // San He - Triple Harmony (Gold)
  if (patternUpper.includes('SAN_HE') || patternUpper.includes('TRIPLE HARMONY')) {
    return 'rgb(251, 191, 36)'; // amber-400
  }
  
// Liu He - Six Harmoniess (Purple)
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
  
  // Default neutral (use blue, same as NO_PATTERN)
  return 'rgb(96, 165, 250)'; // blue-400
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
  // Neutral default (use blue gradient, same as NO_PATTERN)
  return 'from-blue-400 via-blue-500 to-blue-400';
}

// Helper to get pattern-based gradient colors for the new pill
function getPatternGradient(pattern?: string): string {
  if (!pattern) return 'from-slate-300 via-slate-400 to-slate-300';
  
  const patternUpper = pattern.toUpperCase();
  
  // San He / SAN_HE - Triple Harmony (Gold/Amber)
  if (patternUpper.includes('SAN_HE') || patternUpper.includes('TRIPLE HARMONY')) {
    return 'from-amber-400 via-yellow-400 to-amber-500';
  }
  
  // Liu He / LIU_HE - Six Harmoniess (Purple/Pink)
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
  
  // Liu Chong - Six Conflicts (Orange/Red)
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
  patternColors?: { start: string; end: string };
  isNewMatch?: boolean; // Whether this is a new match (created within last 24 hours)
  matchedAt?: string; // ISO timestamp of when the match was created
  alwaysOpenDropdown?: boolean; // Whether to keep the dropdown always open
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
  patternColors,
  isNewMatch = false,
  matchedAt,
  alwaysOpenDropdown = false,
}: ProfilePhotoCarouselWithRankingProps) {
  // Determine if this is a new match (within last 24 hours)
  const isActuallyNewMatch = isNewMatch || (matchedAt ? (() => {
    const matchDate = new Date(matchedAt);
    const now = new Date();
    const hoursSinceMatch = (now.getTime() - matchDate.getTime()) / (1000 * 60 * 60);
    return hoursSinceMatch < 24; // Show "New Match" if match was created within last 24 hours
  })() : false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showDropdownMenuInternal, setShowDropdownMenuInternal] = useState(alwaysOpenDropdown);
  
  // Force dropdown to always be open when alwaysOpenDropdown is true
  const showDropdownMenu = alwaysOpenDropdown ? true : showDropdownMenuInternal;
  
  // Force dropdown to stay open when alwaysOpenDropdown is true
  useEffect(() => {
    if (alwaysOpenDropdown) {
      setShowDropdownMenuInternal(true);
    }
  }, [alwaysOpenDropdown]);
  const [dropdownHeight, setDropdownHeight] = useState('auto');
  const [carouselWidth, setCarouselWidth] = useState<number | null>(null);
  
  // DEBUG: Log connection box data with explicit values (only once per connectionBoxData change)
  useEffect(() => {
    console.log('[ProfilePhotoCarouselWithRanking] Received props:', {
      profileName,
      hasConnectionBoxData: !!connectionBoxData,
      hasCard: !!connectionBoxData?.card,
      cardData: connectionBoxData?.card,
      pattern: connectionBoxData?.pattern,
      score: connectionBoxData?.score,
      showDropdown,
      alwaysOpenDropdown,
    });
  }, [connectionBoxData, profileName, showDropdown, alwaysOpenDropdown]);
  
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

  // Close dropdown when clicking outside (unless alwaysOpenDropdown is true)
  useEffect(() => {
    if (alwaysOpenDropdown) return; // Don't close if always open
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isDropdownButton = (target as Element)?.closest('[data-dropdown-button]');
      const isPhotoCarousel = (target as Element)?.closest('.photo-carousel-container');
      
      if (dropdownRef.current && !dropdownRef.current.contains(target) && !isDropdownButton && !isPhotoCarousel) {
        if (!alwaysOpenDropdown) {
          setShowDropdownMenuInternal(false);
        }
      }
    };

    if (showDropdownMenuInternal && !alwaysOpenDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdownMenuInternal, alwaysOpenDropdown]);

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
    
    // Re-measure when dropdown opens or when alwaysOpenDropdown is true
    let dropdownTimeout: NodeJS.Timeout | null = null;
    if (showDropdownMenu || alwaysOpenDropdown) {
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
  }, [showDropdownMenu, alwaysOpenDropdown]);

  // Auto-resize dropdown based on content
  useEffect(() => {
    if ((showDropdownMenu || alwaysOpenDropdown) && contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      const minHeight = 410; // Just a tiny bit longer than connection box
      const maxHeight = window.innerHeight * 0.8; // 80% of viewport height
      
      const newHeight = Math.max(minHeight, Math.min(contentHeight + 32, maxHeight)); // +32 for padding
      setDropdownHeight(`${newHeight}px`);
    }
  }, [showDropdownMenu, alwaysOpenDropdown, aboutMeText, selectedDeepPrompts, deepPromptAnswers, selectedOccupation, selectedCity, cityInput, selectedHeight, selectedChildrenOption, selectedReligion, birthInfo]);


  // Get suit symbol for card display
  const getSuitSymbol = (suit: string): string => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'spades': return '♠';
      case 'clubs': return '♣';
      default: return '';
    }
  };

  // Get suit color for card display - red for hearts/diamonds, black for spades/clubs
  const getSuitColor = (suit: string): string => {
    // Use a vibrant red that's clearly visible in both light and dark modes
    // #ef4444 = red-500 (bright, visible in both themes)
    return suit === 'hearts' || suit === 'diamonds' ? '#ef4444' : '#1f2937';
  };

  return (
    <div className="w-full" ref={carouselRef} style={{ position: 'static', width: '100%', maxWidth: '100%' }}>
      {/* Photo Carousel with Gestures - with white playing card border */}
      <div
        className="photo-carousel-container w-full aspect-[3/4.2] relative"
        style={{ 
          borderRadius: '1rem',
          margin: '0', 
          padding: '0',
          border: '3px solid #000000',
          overflow: 'hidden',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* Additional border layer for consistent corner rendering - positioned outside to be visible */}
        <div
          style={{
            position: 'absolute',
            top: '-3px',
            left: '-3px',
            right: '-3px',
            bottom: '-3px',
            borderRadius: '1rem',
            border: '3px solid #000000',
            pointerEvents: 'none',
            zIndex: 50,
          }}
        />
        <PhotoCarouselWithGestures
          images={images}
          currentPhotoIndex={currentPhotoIndex}
          onPhotoChange={(index) => {
            setCurrentPhotoIndex(index);
            onPhotoChange?.(index);
          }}
          className="w-full h-full bg-black"
          style={{ 
            borderRadius: 'calc(1rem - 3px)',
            overflow: 'hidden',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
          }}
        >
        {/* Photo Navigation Areas - Only show when not zoomed */}
        {/* Left side for previous photo */}
        <div
          onTouchStart={(e) => handleTouchStart(e, 'prev')}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => handleTouchEnd('prev')}
          className="absolute left-0 top-0 w-1/3 cursor-pointer z-10"
          style={{
            bottom: connectionBoxData && badgePosition === "bottom-bar" ? '80px' : '0',
            pointerEvents: 'auto',
          }}
        />
        {/* Right side for next photo - but exclude button area */}
        <div
          onTouchStart={(e) => {
            // Don't interfere with button clicks
            const target = e.target as HTMLElement;
            if (target.closest('button')) {
              return;
            }
            handleTouchStart(e, 'next');
          }}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => handleTouchEnd('next')}
          className="absolute right-0 top-0 cursor-pointer z-10"
          style={{
            bottom: connectionBoxData && badgePosition === "bottom-bar" ? '80px' : '0',
            width: 'calc(33% - 80px)', // Exclude button area (buttons are ~64px wide + padding)
            pointerEvents: 'auto',
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

        {/* Name and Age Overlay - REMOVED for playing card style */}

        {/* Dropdown controls removed for simplified overlay */}

        {/* Photo Navigation Arrows removed (touch-only navigation) */}

        {/* Profile Button - Bottom Right (bottom position) */}
        {showProfileToggle && onShowProfileToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              console.log('[Photo Carousel] Profile button clicked');
              onShowProfileToggle();
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              e.preventDefault();
              console.log('[Photo Carousel] Profile button touched');
              onShowProfileToggle();
            }}
            className="absolute right-4 z-[100] flex items-center justify-center w-14 h-14 rounded-full transition-all hover:scale-110 active:scale-95"
            data-interactive="true"
            style={{
              bottom: '16px', // Position at bottom with padding
              backgroundColor: 'transparent',
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: patternColors?.start || (connectionBoxData 
                ? getPatternColor(connectionBoxData.pattern)
                : (theme === "light" ? "rgb(148, 163, 184)" : "rgba(255, 255, 255, 0.3)")),
              backdropFilter: 'blur(10px)',
              boxShadow: theme === "light" 
                ? `0 2px 12px rgba(0, 0, 0, 0.15)` 
                : `0 2px 12px rgba(0, 0, 0, 0.5)`,
              pointerEvents: 'auto',
              touchAction: 'manipulation',
            }}
            aria-label="Toggle profile"
          >
            <svg 
              className="w-7 h-7" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="white" 
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        )}

        {/* Chat Button - REMOVED for playing card style */}

        {/* New Match Badge - Top Left */}
        {isActuallyNewMatch && (
          <div className="absolute top-4 left-4 z-30">
            <div 
              className="px-3 py-1.5 rounded-full flex items-center gap-1.5"
              style={{
                backgroundColor: 'rgba(34, 197, 94, 0.9)', // Green background with transparency
                backdropFilter: 'blur(10px)',
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: '#22c55e', // Green border
                boxShadow: theme === "light" 
                  ? `0 2px 12px rgba(34, 197, 94, 0.4)` 
                  : `0 2px 12px rgba(34, 197, 94, 0.6)`,
              }}
            >
              <span className="text-xs font-bold text-white">
                NEW MATCH
              </span>
            </div>
          </div>
        )}

        {/* White Border Frame Overlay - Playing Card Style */}
        <div 
          className="absolute inset-0 z-40"
          style={{ 
            pointerEvents: 'none',
            border: '40px solid white',
            borderRadius: 'calc(1rem - 3px)',
            boxShadow: 'inset 0 0 0 2px rgba(0, 0, 0, 0.1)'
          }}
        />

        {/* Playing Card Symbols - Top Left and Bottom Right */}
        {connectionBoxData?.card && (() => {
          const card = connectionBoxData.card;
          const suitSymbol = getSuitSymbol(card.suit);
          const suitColor = getSuitColor(card.suit);
          
          console.log(`[Card Symbols] Rendering for ${profileName}:`, card, 'suit:', card.suit, 'color:', suitColor);
          
          return (
            <>
              {/* Top-left rank and suit */}
              <div 
                className="absolute top-2 left-2 flex flex-col items-center leading-none z-50 card-suit-overlay"
                style={{ pointerEvents: 'none' }}
              >
                <div 
                  className={`text-3xl font-bold ${suitColor === '#ef4444' ? 'card-suit-red' : 'card-suit-black'}`}
                  style={{ 
                    color: suitColor,
                    fill: suitColor,
                  }}
                >
                  {card.rank}
                </div>
                <div 
                  className={`text-3xl -mt-1 ${suitColor === '#ef4444' ? 'card-suit-red' : 'card-suit-black'}`}
                  style={{ 
                    color: suitColor,
                    fill: suitColor,
                  }}
                >
                  {suitSymbol}
                </div>
              </div>
              
              {/* Bottom-right rank and suit (rotated 180deg) */}
              <div 
                className="absolute bottom-2 right-2 flex flex-col items-center leading-none rotate-180 z-50 card-suit-overlay"
                style={{ pointerEvents: 'none' }}
              >
                <div 
                  className={`text-3xl font-bold ${suitColor === '#ef4444' ? 'card-suit-red' : 'card-suit-black'}`}
                  style={{ 
                    color: suitColor,
                    fill: suitColor,
                  }}
                >
                  {card.rank}
                </div>
                <div 
                  className={`text-3xl -mt-1 ${suitColor === '#ef4444' ? 'card-suit-red' : 'card-suit-black'}`}
                  style={{ 
                    color: suitColor,
                    fill: suitColor,
                  }}
                >
                  {suitSymbol}
                </div>
              </div>
            </>
          );
        })()}

        {/* Ranking Badge - Top Right (if badgePosition is "top-right") */}
        {connectionBoxData && badgePosition === "top-right" && (
          <div className="absolute top-4 z-20" style={{ right: '16px' }}>
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
      </div>

      {/* Dropdown Menu - Below Carousel - Always visible when alwaysOpenDropdown is true */}
      {showDropdown && alwaysOpenDropdown && (
        <div 
          ref={dropdownRef}
          className="rounded-lg"
          style={{
            width: carouselWidth !== null ? `${carouselWidth}px` : '100%',
            backgroundColor: theme === "light" ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(10px)',
            marginTop: '0px',
            height: alwaysOpenDropdown ? dropdownHeight : 'auto',
            maxHeight: 'none',
            overflowY: 'visible',
          }}
        >
          <div ref={contentRef} className="p-4 pb-6 space-y-4">
            {/* Connection Box - Match Engine Details */}
            {connectionBoxData && (
              <ConnectionBoxSimple 
                data={{
                  ...connectionBoxData,
                  children: connectionBoxData.children || selectedChildrenOption || undefined
                }} 
                alwaysExpanded={true} 
              />
            )}
          </div>
        </div>
      )}

      {/* OLD CONNECTION DROPDOWN REMOVED - Now using ConnectionBoxSimple component below the carousel */}
    </div>
  );
}

