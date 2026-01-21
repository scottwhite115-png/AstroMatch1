'use client';

import React from 'react';
import type { CardOverlay as CardOverlayType } from '@/lib/cardOverlay';

interface CardOverlayProps {
  card: CardOverlayType;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export function CardOverlay({ 
  card, 
  size = 'md',
  position = 'top-right' 
}: CardOverlayProps) {
  console.log('[CardOverlay] Component rendering with card:', card);
  
  // Get suit symbol
  const getSuitSymbol = (suit: string): string => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'spades': return '♠';
      case 'clubs': return '♣';
      default: return '';
    }
  };

  // Get suit color - use inline style for red to ensure visibility in both light and dark modes
  const getSuitColor = (suit: string): { className?: string; style?: React.CSSProperties } => {
    if (suit === 'hearts' || suit === 'diamonds') {
      return { style: { color: '#ef4444' } }; // Bright red, visible in both modes
    }
    return { className: 'text-gray-900 dark:text-gray-100' };
  };

  // Size classes
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  };

  const pipSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  // Position classes
  const positionClasses = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2',
  };

  // Edge style
  const edgeClass = 
    card.edgeStyle === 'danger' ? 'ring-2 ring-red-500' :
    card.edgeStyle === 'warning' ? 'ring-2 ring-amber-500' :
    '';

  return (
    <div 
      className={`
        absolute ${positionClasses[position]} z-50
        bg-white
        rounded-md shadow-xl
        border-2 border-gray-800
        ${edgeClass}
      `}
      style={{ 
        pointerEvents: 'none',
        width: '60px',
        height: '84px',
      }}
    >
      {/* Top-left rank and suit */}
      <div className="absolute top-1 left-1.5 flex flex-col items-center leading-none">
        <div 
          className={`text-lg font-bold ${getSuitColor(card.suit).className || ''}`}
          style={getSuitColor(card.suit).style}
        >
          {card.rank}
        </div>
        <div 
          className={`text-lg -mt-0.5 ${getSuitColor(card.suit).className || ''}`}
          style={getSuitColor(card.suit).style}
        >
          {getSuitSymbol(card.suit)}
        </div>
      </div>
      
      {/* Bottom-right rank and suit (rotated 180deg) */}
      <div className="absolute bottom-1 right-1.5 flex flex-col items-center leading-none rotate-180">
        <div 
          className={`text-lg font-bold ${getSuitColor(card.suit).className || ''}`}
          style={getSuitColor(card.suit).style}
        >
          {card.rank}
        </div>
        <div 
          className={`text-lg -mt-0.5 ${getSuitColor(card.suit).className || ''}`}
          style={getSuitColor(card.suit).style}
        >
          {getSuitSymbol(card.suit)}
        </div>
      </div>
      
      {/* Center pip (trine indicator) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="text-xs font-bold text-gray-400">
          {card.pip}
        </div>
      </div>
    </div>
  );
}

// Trine name helper
export function getTrineName(pip: string): string {
  switch (pip) {
    case 'A': return 'Visionaries';
    case 'B': return 'Strategists';
    case 'C': return 'Adventurers';
    case 'D': return 'Artists';
    default: return '';
  }
}

// Full card info tooltip/popup component
interface CardInfoProps {
  card: CardOverlayType;
}

export function CardInfo({ card }: CardInfoProps) {
  const getSuitSymbol = (suit: string): string => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'spades': return '♠';
      case 'clubs': return '♣';
      default: return '';
    }
  };

  const getSuitName = (suit: string): string => {
    switch (suit) {
      case 'hearts': return 'Hearts (San He)';
      case 'diamonds': return 'Diamonds (Liu He)';
      case 'spades': return 'Spades (Liu Chong)';
      case 'clubs': return 'Clubs (Same Sign / Neutral)';
      default: return '';
    }
  };

  // Get suit color - use inline style for red to ensure visibility in both light and dark modes
  const getSuitColor = (suit: string): { className?: string; style?: React.CSSProperties } => {
    if (suit === 'hearts' || suit === 'diamonds') {
      return { style: { color: '#ef4444' } }; // Bright red, visible in both modes
    }
    return { className: 'text-gray-900 dark:text-gray-100' };
  };

  const suitColorStyle = getSuitColor(card.suit);

  return (
    <div className="p-4 bg-white rounded-lg shadow-xl border border-gray-200 min-w-[250px]">
      {/* Card display */}
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200">
        <div 
          className={`text-5xl font-bold ${suitColorStyle.className || ''}`}
          style={suitColorStyle.style}
        >
          {card.rank}
          <span className="ml-1">{getSuitSymbol(card.suit)}</span>
        </div>
        <div className="text-sm text-gray-600">
          <div className="font-semibold">{getSuitName(card.suit)}</div>
          <div>Trine: {getTrineName(card.pip)}</div>
        </div>
      </div>

      {/* Pills */}
      <div className="flex flex-wrap gap-2">
        {card.pills.map((pill, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700"
          >
            {pill}
          </span>
        ))}
      </div>
    </div>
  );
}
