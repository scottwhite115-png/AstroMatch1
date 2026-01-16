"use client";

import { useState, useEffect, useRef } from "react";
import type { ConnectionBoxData } from "@/components/ConnectionBoxSimple";
import ConnectionBoxSimple from "@/components/ConnectionBoxSimple";
import PhotoCarouselWithGestures from "@/components/PhotoCarouselWithGestures";
import { LabelPill } from "@/ui/LabelPill";

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
}: ProfilePhotoCarouselWithRankingProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const [dropdownHeight, setDropdownHeight] = useState('auto');
  const [carouselWidth, setCarouselWidth] = useState<number | null>(null);
  
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
            <div className="px-5 pb-4">
              <div className="text-white font-semibold text-3xl">
                {profileName}
              </div>
            </div>
          </div>
        )}

        {/* Dropdown controls removed for simplified overlay */}

        {/* Photo Navigation Arrows removed (touch-only navigation) */}

        {/* Ranking Badge - Top Right (if badgePosition is "top-right") */}
        {connectionBoxData && badgePosition === "top-right" && (
          <div className="absolute top-4 right-4 z-20">
            <div 
              className="px-4 py-2 rounded-full backdrop-blur-sm flex items-center gap-2"
              style={{
                backgroundColor: theme === "light" ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.7)',
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: getRankColor(connectionBoxData.rankKey),
                boxShadow: theme === "light" 
                  ? `0 2px 12px rgba(0, 0, 0, 0.15)` 
                  : `0 2px 12px rgba(0, 0, 0, 0.5)`,
              }}
            >
              <span 
                className="text-sm font-bold"
                style={{ color: getRankColor(connectionBoxData.rankKey) }}
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

