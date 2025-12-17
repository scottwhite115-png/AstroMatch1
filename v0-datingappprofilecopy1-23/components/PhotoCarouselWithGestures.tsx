"use client";

import { useState, useRef, useEffect } from "react";

interface PhotoCarouselWithGesturesProps {
  images: string[];
  currentPhotoIndex: number;
  onPhotoChange: (index: number) => void;
  className?: string;
  children?: React.ReactNode;
}

export default function PhotoCarouselWithGestures({
  images,
  currentPhotoIndex,
  onPhotoChange,
  className = "",
  children,
}: PhotoCarouselWithGesturesProps) {
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [lastTouchDistance, setLastTouchDistance] = useState(0);
  const [lastTouchCenter, setLastTouchCenter] = useState({ x: 0, y: 0 });
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [panStartPoint, setPanStartPoint] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenScale, setFullScreenScale] = useState(1);
  const [fullScreenTranslateX, setFullScreenTranslateX] = useState(0);
  const [fullScreenTranslateY, setFullScreenTranslateY] = useState(0);
  
  // For infinite loop
  const [slideIndex, setSlideIndex] = useState(1); // Start at 1 (first real image)
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const frameRef = useRef<number>();
  const transitionTimeoutRef = useRef<number>();

  // Create looped array: [last, ...all images, first]
  const loopedImages = images.length > 1 
    ? [images[images.length - 1], ...images, images[0]] 
    : images;

  // Sync with parent's currentPhotoIndex
  useEffect(() => {
    if (images.length <= 1) return;
    
    // Only sync if we're not in the middle of a loop transition
    const targetSlideIndex = currentPhotoIndex + 1;
    if (slideIndex !== targetSlideIndex && slideIndex !== 0 && slideIndex !== loopedImages.length - 1) {
      setIsTransitionEnabled(true);
      setSlideIndex(targetSlideIndex);
    }
  }, [currentPhotoIndex, images.length, slideIndex, loopedImages.length]);

  // Handle infinite loop wraparound
  useEffect(() => {
    if (images.length <= 1 || !isTransitionEnabled) return;

    // Clear any existing timeout
    if (transitionTimeoutRef.current) {
      window.clearTimeout(transitionTimeoutRef.current);
    }

    // After transition completes, check if we need to jump
    transitionTimeoutRef.current = window.setTimeout(() => {
      if (slideIndex === 0) {
        // At clone of last image, jump to real last image
        setIsTransitionEnabled(false);
        setSlideIndex(images.length);
      } else if (slideIndex === loopedImages.length - 1) {
        // At clone of first image, jump to real first image
        setIsTransitionEnabled(false);
        setSlideIndex(1);
      }
    }, 300);

    return () => {
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [slideIndex, isTransitionEnabled, images.length, loopedImages.length]);

  // Reset zoom when photo changes
  useEffect(() => {
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
    setIsZoomed(false);
    setIsTransitioning(false);
    setIsFullScreen(false);
    setFullScreenScale(1);
    setFullScreenTranslateX(0);
    setFullScreenTranslateY(0);
  }, [currentPhotoIndex]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const getDistance = (touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getCenter = (touch1: Touch, touch2: Touch) => {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    };
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    // Don't handle click if on a button or interactive element
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('[data-dropdown-button]')) {
      return;
    }
    
    // Only handle click navigation when not zoomed
    if (scale <= 1.05 && !isFullScreen && !isZoomed) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const halfWidth = rect.width / 2;
      
      if (images.length <= 1) return;
      
      setIsTransitionEnabled(true);
      if (clickX < halfWidth) {
        // Left side - previous photo
        const newSlideIndex = slideIndex - 1;
        setSlideIndex(newSlideIndex);
        
        // Calculate actual photo index for parent
        if (newSlideIndex === 0) {
          // Moving to clone of last, but will jump to real last after transition
          setTimeout(() => onPhotoChange(images.length - 1), 0);
        } else {
          onPhotoChange(newSlideIndex - 1);
        }
      } else {
        // Right side - next photo
        const newSlideIndex = slideIndex + 1;
        setSlideIndex(newSlideIndex);
        
        // Calculate actual photo index for parent
        if (newSlideIndex === loopedImages.length - 1) {
          // Moving to clone of first, but will jump to real first after transition
          setTimeout(() => onPhotoChange(0), 0);
        } else {
          onPhotoChange(newSlideIndex - 1);
        }
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // Don't prevent default to allow child elements to handle clicks
    const target = e.target as HTMLElement;
    
    // Check if touch is on a button or interactive element
    if (target.closest('button') || target.closest('a') || target.closest('[data-dropdown-button]')) {
      return;
    }
    
    if (e.touches.length === 1) {
      // Single touch - pan or swipe
      const touch = e.touches[0];
      setLastPanPoint({ x: touch.clientX, y: touch.clientY });
      setPanStartPoint({ x: touch.clientX, y: touch.clientY });
      setHasMoved(false);
      
      // Always set panning true for single touch
      setIsPanning(true);
      
      // If we're already zoomed or in full-screen, mark as zoomed immediately
      if (scale > 1.05 || isFullScreen) {
        setIsZoomed(true);
        e.preventDefault(); // Prevent scrolling when zoomed
      }
    } else if (e.touches.length === 2) {
      // Two touches - pinch zoom
      e.preventDefault(); // Prevent default only for pinch
      const distance = getDistance(e.touches[0], e.touches[1]);
      const center = getCenter(e.touches[0], e.touches[1]);
      
      setLastTouchDistance(distance);
      setLastTouchCenter(center);
      setIsPanning(false);
      setHasMoved(false);
      
      // Enter full-screen mode immediately when pinch starts
      if (!isFullScreen && scale <= 1.05) {
        setIsFullScreen(true);
        setFullScreenScale(1);
        setFullScreenTranslateX(0);
        setFullScreenTranslateY(0);
      }
      
      // Cancel any pending animation frame for immediate response
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = undefined;
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    
    // Check if touch is on a button or interactive element
    if (target.closest('button') || target.closest('a') || target.closest('[data-dropdown-button]')) {
      return;
    }
    
    if (e.touches.length === 1) {
      // Single touch - check if we should start panning
      const touch = e.touches[0];
      
      // Check if we're in full-screen mode (which means we're zoomed)
      if (isFullScreen) {
        // We're zoomed in full-screen - always pan freely
        e.preventDefault();
        
        const deltaX = touch.clientX - lastPanPoint.x;
        const deltaY = touch.clientY - lastPanPoint.y;
        
        // Mark as moved if movement exceeds threshold
        const totalDeltaX = Math.abs(touch.clientX - panStartPoint.x);
        const totalDeltaY = Math.abs(touch.clientY - panStartPoint.y);
        if (totalDeltaX > 5 || totalDeltaY > 5) {
          setHasMoved(true);
        }
        
        // Free pan - no constraints, let it float anywhere
        setFullScreenTranslateX(prev => prev + deltaX);
        setFullScreenTranslateY(prev => prev + deltaY);
        
        setLastPanPoint({ x: touch.clientX, y: touch.clientY });
      } else {
        // Not zoomed - handle swipe for photo change
        if (isPanning) {
          const deltaX = touch.clientX - lastPanPoint.x;
          const deltaY = touch.clientY - lastPanPoint.y;
          
          const totalDeltaX = Math.abs(touch.clientX - panStartPoint.x);
          const totalDeltaY = Math.abs(touch.clientY - panStartPoint.y);
          
          if (totalDeltaX > 5 || totalDeltaY > 5) {
            setHasMoved(true);
          }
          
          // Check if this is a horizontal swipe
          if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(totalDeltaX) > 10) {
            e.preventDefault(); // Prevent scroll when swiping horizontally
          }
          setLastPanPoint({ x: touch.clientX, y: touch.clientY });
        }
      }
      
    } else if (e.touches.length === 2) {
      // Two touches - pinch zoom with improved smoothness
      e.preventDefault(); // Always prevent default for pinch
      setHasMoved(true);
      
      const distance = getDistance(e.touches[0], e.touches[1]);
      const center = getCenter(e.touches[0], e.touches[1]);
      
      if (lastTouchDistance > 0) {
        const scaleChange = distance / lastTouchDistance;
        // Smooth scaling for responsive zoom
        let newScale = fullScreenScale * scaleChange;
        
        // Clamp scale between 0.8 and 6 for deep zoom
        newScale = Math.max(0.8, Math.min(6, newScale));
        
        // Calculate how much to translate based on pinch center
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const centerX = center.x;
        const centerY = center.y;
        
        const scaleDiff = newScale - fullScreenScale;
        const newTranslateX = fullScreenTranslateX - (centerX - windowWidth / 2) * scaleDiff;
        const newTranslateY = fullScreenTranslateY - (centerY - windowHeight / 2) * scaleDiff;
        
        setFullScreenScale(newScale);
        setFullScreenTranslateX(newTranslateX);
        setFullScreenTranslateY(newTranslateY);
      }
      
      setLastTouchDistance(distance);
      setLastTouchCenter(center);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    
    // Check if touch is on a button or interactive element
    if (target.closest('button') || target.closest('a') || target.closest('[data-dropdown-button]')) {
      return;
    }
    
    // Cancel any pending animation frame
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = undefined;
    }
    
    if (e.touches.length === 0) {
      // All fingers released - check if we need to animate back
      
      // Check for swipe gesture when not zoomed
      if (isPanning && !isZoomed && !isFullScreen && hasMoved) {
        const touch = e.changedTouches[0];
        const totalDeltaX = touch.clientX - panStartPoint.x;
        const totalDeltaY = touch.clientY - panStartPoint.y;
        
        // Swipe threshold
        const swipeThreshold = 50;
        
        // Check if it's a horizontal swipe (more horizontal than vertical)
        if (Math.abs(totalDeltaX) > Math.abs(totalDeltaY) && Math.abs(totalDeltaX) > swipeThreshold) {
          if (images.length <= 1) return;
          
          setIsTransitionEnabled(true);
          if (totalDeltaX > 0) {
            // Swipe right - previous photo
            const newSlideIndex = slideIndex - 1;
            setSlideIndex(newSlideIndex);
            
            if (newSlideIndex === 0) {
              setTimeout(() => onPhotoChange(images.length - 1), 0);
            } else {
              onPhotoChange(newSlideIndex - 1);
            }
          } else {
            // Swipe left - next photo
            const newSlideIndex = slideIndex + 1;
            setSlideIndex(newSlideIndex);
            
            if (newSlideIndex === loopedImages.length - 1) {
              setTimeout(() => onPhotoChange(0), 0);
            } else {
              onPhotoChange(newSlideIndex - 1);
            }
          }
        }
      }
      // Note: Single tap navigation is handled by handleContainerClick onClick handler
      
      setIsPanning(false);
      setLastTouchDistance(0);
      setHasMoved(false);
      
      // Handle full-screen mode - animate back when all fingers released
      if (isFullScreen) {
        // Always animate back to normal when user completely releases
        setIsTransitioning(true);
        setIsFullScreen(false);
        setFullScreenScale(1);
        setFullScreenTranslateX(0);
        setFullScreenTranslateY(0);
        setIsZoomed(false);
        setTimeout(() => setIsTransitioning(false), 2000);
      }
    } else if (e.touches.length === 1) {
      // One finger still down - keep zoom active, just reset for single-finger pan
      const touch = e.touches[0];
      setLastPanPoint({ x: touch.clientX, y: touch.clientY });
      setPanStartPoint({ x: touch.clientX, y: touch.clientY });
      setLastTouchDistance(0);
      setHasMoved(false);
      setIsPanning(true);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isZoomed) {
      // Reset zoom
      setScale(1);
      setTranslateX(0);
      setTranslateY(0);
      setIsZoomed(false);
    } else {
      // Zoom in
      setScale(2);
      setIsZoomed(true);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    let newScale = scale * delta;
    
    // Clamp scale between 1 and 3
    newScale = Math.max(1, Math.min(3, newScale));
    
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = e.clientX - rect.left;
      const centerY = e.clientY - rect.top;
      
      // If zooming out to close to 1, reset everything with animation
      if (newScale <= 1.2) {
        setIsTransitioning(true);
        setScale(1);
        setTranslateX(0);
        setTranslateY(0);
        setIsZoomed(false);
        setTimeout(() => setIsTransitioning(false), 300);
      } else {
        const scaleDiff = newScale - scale;
        const newTranslateX = translateX - (centerX - rect.width / 2) * scaleDiff;
        const newTranslateY = translateY - (centerY - rect.height / 2) * scaleDiff;
        
        setScale(newScale);
        setTranslateX(newTranslateX);
        setTranslateY(newTranslateY);
        setIsZoomed(true);
      }
    }
  };

  // Close full-screen on tap
  const handleFullScreenTap = () => {
    if (isFullScreen && fullScreenScale <= 1.1) {
      setIsFullScreen(false);
      setFullScreenScale(1);
      setFullScreenTranslateX(0);
      setFullScreenTranslateY(0);
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        className={`relative overflow-hidden ${className}`}
        onClick={handleContainerClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
        style={{ 
          touchAction: isZoomed ? 'none' : 'pan-y',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <div
          className="h-full w-full flex transition-transform duration-300 ease-in-out"
          style={{ 
            transform: `translateX(-${slideIndex * 100}%)`,
            transition: isTransitionEnabled ? (isPanning ? 'none' : 'transform 0.3s ease-in-out') : 'none'
          }}
        >
          {loopedImages.map((src, i) => (
            <div
              key={i}
              className="h-full w-full flex-shrink-0 relative"
              style={{ minWidth: '100%' }}
            >
              <img
                ref={i === slideIndex ? imageRef : null}
                src={src}
                alt={`Photo ${i + 1}`}
                className="h-full w-full object-cover"
                style={{
                  transform: i === slideIndex 
                    ? `scale(${scale}) translate(${translateX / scale}px, ${translateY / scale}px)`
                    : 'none',
                  transformOrigin: 'center center',
                  transition: isTransitioning ? 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
                  userSelect: 'none',
                  pointerEvents: 'none',
                  willChange: 'transform',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  WebkitTransform: 'translateZ(0)',
                  opacity: i === slideIndex && isFullScreen ? 0 : 1,
                }}
                draggable={false}
              />
              {/* Black overlay when photo is zoomed in full-screen */}
              {i === slideIndex && isFullScreen && (
                <div className="absolute inset-0 bg-black" />
              )}
            </div>
          ))}
        </div>
        
        {/* Overlay children (indicators, buttons, etc.) */}
        {children}
      </div>

      {/* Full-Screen Zoom Overlay */}
      {isFullScreen && (
        <div
          className="fixed inset-0 bg-transparent z-[9999] flex items-center justify-center"
          onTouchStart={(e) => {
            if (e.touches.length === 1) {
              const touch = e.touches[0];
              setLastPanPoint({ x: touch.clientX, y: touch.clientY });
              e.preventDefault();
            } else if (e.touches.length === 2) {
              e.preventDefault();
              const distance = getDistance(e.touches[0], e.touches[1]);
              const center = getCenter(e.touches[0], e.touches[1]);
              setLastTouchDistance(distance);
              setLastTouchCenter(center);
            }
          }}
          onTouchMove={(e) => {
            if (e.touches.length === 2) {
              e.preventDefault();
              const distance = getDistance(e.touches[0], e.touches[1]);
              const center = getCenter(e.touches[0], e.touches[1]);
              
              if (lastTouchDistance > 0) {
                const scaleChange = distance / lastTouchDistance;
                // Smooth zoom
                const smoothedScaleChange = 1 + (scaleChange - 1) * 0.85;
                let newScale = fullScreenScale * smoothedScaleChange;
                newScale = Math.max(0.8, Math.min(8, newScale));
                
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;
                const centerX = center.x;
                const centerY = center.y;
                
                const scaleDiff = newScale - fullScreenScale;
                const newTranslateX = fullScreenTranslateX - (centerX - windowWidth / 2) * scaleDiff;
                const newTranslateY = fullScreenTranslateY - (centerY - windowHeight / 2) * scaleDiff;
                
                // Use requestAnimationFrame for smooth updates
                if (frameRef.current) {
                  cancelAnimationFrame(frameRef.current);
                }
                frameRef.current = requestAnimationFrame(() => {
                  setFullScreenScale(newScale);
                  setFullScreenTranslateX(newTranslateX);
                  setFullScreenTranslateY(newTranslateY);
                });
              }
              
              setLastTouchDistance(distance);
              setLastTouchCenter(center);
            } else if (e.touches.length === 1) {
              e.preventDefault();
              const touch = e.touches[0];
              if (lastPanPoint.x !== 0 || lastPanPoint.y !== 0) {
                const deltaX = touch.clientX - lastPanPoint.x;
                const deltaY = touch.clientY - lastPanPoint.y;
                // Smooth free pan - follow finger directly with requestAnimationFrame
                if (frameRef.current) {
                  cancelAnimationFrame(frameRef.current);
                }
                frameRef.current = requestAnimationFrame(() => {
                  setFullScreenTranslateX(prev => prev + deltaX);
                  setFullScreenTranslateY(prev => prev + deltaY);
                });
              }
              setLastPanPoint({ x: touch.clientX, y: touch.clientY });
            }
          }}
          onTouchEnd={(e) => {
            setLastTouchDistance(0);
            setLastPanPoint({ x: 0, y: 0 });
            
            // Always exit full-screen and reset when user releases
            setIsTransitioning(true);
            setIsFullScreen(false);
            setFullScreenScale(1);
            setFullScreenTranslateX(0);
            setFullScreenTranslateY(0);
            setTimeout(() => setIsTransitioning(false), 2000);
          }}
          onClick={handleFullScreenTap}
          style={{
            touchAction: 'none',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none',
          }}
        >
          <img
            src={images[currentPhotoIndex]}
            alt={`Photo ${currentPhotoIndex + 1}`}
            className="object-contain"
            style={{
              maxWidth: '100vw',
              maxHeight: '100vh',
              transform: `scale(${fullScreenScale}) translate(${fullScreenTranslateX / fullScreenScale}px, ${fullScreenTranslateY / fullScreenScale}px)`,
              transformOrigin: 'center center',
              transition: isTransitioning ? 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
              userSelect: 'none',
              pointerEvents: 'none',
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              touchAction: 'none',
            }}
            draggable={false}
          />
        </div>
      )}
    </>
  );
}
