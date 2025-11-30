"use client";

import React from "react";

interface StarRatingProps {
  value: number; // 0–5 in 0.5 steps
  maxStars?: number;
  starSize?: string; // Tailwind class like "w-4 h-4"
  fillColor?: string; // Tailwind class like "text-amber-400"
  emptyColor?: string; // Tailwind class like "text-gray-300"
}

/**
 * Display star rating from 0-5 in half-star increments.
 * Shows filled stars (★), half stars (⯨), and empty stars (☆).
 */
export function StarRating({ 
  value, 
  maxStars = 5,
  starSize = "text-sm",
  fillColor = "text-amber-400",
  emptyColor = "text-gray-400"
}: StarRatingProps) {
  const clampedValue = Math.max(0, Math.min(maxStars, value));
  const fullStars = Math.floor(clampedValue);
  const hasHalfStar = clampedValue % 1 >= 0.5;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of ${maxStars} stars`}>
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <span key={`full-${i}`} className={`${starSize} ${fillColor}`}>★</span>
      ))}
      
      {/* Half star */}
      {hasHalfStar && (
        <span className={`${starSize} ${fillColor} relative`}>
          <span className={`absolute inset-0 ${emptyColor}`}>☆</span>
          <span className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>★</span>
        </span>
      )}
      
      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <span key={`empty-${i}`} className={`${starSize} ${emptyColor} opacity-60`}>☆</span>
      ))}
    </div>
  );
}

