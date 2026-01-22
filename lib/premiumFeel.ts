/**
 * 🔒 Premium Feel Layer (A5 FINAL)
 * 
 * This layer defines the soul of the app's motion and sensory language.
 * All animations, haptics, and visual treatments must conform to this doctrine.
 */

// ================================
// 1) Motion Timing Doctrine (Canonical)
// ================================

export const MOTION_TIMING = {
  TAROT_FLIP: 400, // 350-500ms
  FADE_IN_OUT: 180, // 120-220ms
  GLOW_TRANSITION: 550, // 400-700ms
  BUTTON_PRESS: 100, // 90-120ms
  MODAL_SLIDE: 320, // 280-360ms
  PAGE_TRANSITION: 375, // 300-450ms
} as const;

// Rules:
// • No animation under 90ms
// • No animation over 700ms
// • Never stack animations
// • Never jitter or bounce

// ================================
// 2) Easing Curves (Locked Set)
// ================================

export const EASING = {
  DEFAULT: 'ease-in-out',
  CALM: 'cubic-bezier(0.4, 0.0, 0.2, 1)', // Material-like calm
  FADE: 'ease-out', // For fades only
} as const;

// Never use:
// • elastic
// • bounce
// • overshoot
// • spring physics
// • back-ease

// ================================
// 3) Haptic Feedback Doctrine (iOS)
// ================================

export type HapticType = 'light' | 'soft' | 'warning' | 'rigid';

/**
 * Trigger haptic feedback (iOS only)
 * Haptics are extremely powerful and must be rare and meaningful.
 */
export function triggerHaptic(type: HapticType): void {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) {
    return; // Not supported or not iOS
  }

  // Haptic patterns (in milliseconds)
  const patterns: Record<HapticType, number | number[]> = {
    light: 10, // Light impact - for tarot flip midpoint
    soft: [10, 20, 10], // Soft success - for connection accepted/opened
    warning: [20, 10, 20], // Warning - for override archetype reveal
    rigid: 30, // Rigid - for error/block
  };

  const pattern = patterns[type];
  navigator.vibrate(pattern);
}

/**
 * 🔮 Allowed Haptic Moments:
 * - Tarot flip midpoint: light impact
 * - Connection accepted: soft success
 * - Connection opened ceremony: soft success
 * - Override archetype reveal (Fool / Death): warning
 * - Error / block: rigid
 * 
 * ❌ Never Use Haptics For:
 * - Scrolling
 * - Sorting
 * - Filtering
 * - Hover
 * - Card paging
 * - Button taps
 */

// ================================
// 4) Micro-Rewards (Extremely Subtle)
// ================================

export const MICRO_REWARDS = {
  // Gentle glow intensification on soulmate-tier cards
  SOULMATE_GLOW_INTENSITY: 1.15,
  
  // Soft shimmer on tarot title when revealed
  TAROT_SHIMER_DURATION: 2000,
  
  // Slow halo pulse on Lovers / Emperor
  HALO_PULSE_DURATION: 3000,
  
  // Slight brightness lift when unlocking a profile
  UNLOCK_BRIGHTNESS_LIFT: 1.1,
} as const;

/**
 * ❌ Never Do:
 * - Confetti
 * - Fireworks
 * - Coins
 * - Points
 * - Badges
 * - Streaks
 * - Gamification popups
 */

// ================================
// 5) Visual Breathing Doctrine
// ================================

export const SPACING = {
  GENEROUS_PADDING: '2rem', // 32px
  LARGE_MARGINS: '3rem', // 48px
  CARD_PADDING: '1.5rem', // 24px
  SECTION_GAP: '2.5rem', // 40px
  TEXT_LINE_HEIGHT: 1.6,
  MAX_SNIPPET_LINES: 2,
  MAX_CTA_PER_CARD: 1,
} as const;

// Rules:
// • Generous padding
// • Large margins
// • Negative space preserved
// • No dense text blocks
// • Max 2 lines per snippet
// • Max 1 CTA per card

// ================================
// 6) Color Temperature Doctrine
// ================================

export const COLOR_TEMPERATURE = {
  // Soft neutral backgrounds
  BACKGROUND_LIGHT: '#fafafa', // Warm off-white
  BACKGROUND_DARK: '#0f172a', // Muted charcoal
  
  // Warm off-whites
  OFF_WHITE: '#f8f9fa',
  
  // Muted charcoals
  CHARCOAL: '#1e293b',
  
  // Rose gold accents
  ROSE_GOLD: '#d4a574',
  
  // Indigo shadows
  INDIGO_SHADOW: '#4a148c',
} as const;

/**
 * Never use:
 * - Pure black (#000000)
 * - Neon colors
 * - Pure white (#ffffff)
 * - High-saturation primaries
 */

// ================================
// 7) Sound Design (Locked: None)
// ================================

/**
 * No sounds. Ever.
 * This is non-negotiable.
 */

// ================================
// 8) Override Moments (Special Handling)
// ================================

export const OVERRIDE_MOMENTS = {
  // Slightly longer fade-in for override archetypes
  FADE_IN_DURATION: 600, // vs normal 180ms
  
  // Subtle dimming of background
  BACKGROUND_DIMMING: 0.3, // 30% opacity overlay
  
  // Gentle warning haptic
  HAPTIC_TYPE: 'warning' as HapticType,
} as const;

/**
 * When revealing:
 * - The Fool
 * - Death
 * - Ten of Swords
 * 
 * Apply:
 * - Slightly longer fade-in
 * - Subtle dimming of background
 * - Gentle warning haptic
 * 
 * No drama. No fear tactics. Just gravitas.
 */

// ================================
// Helper Functions
// ================================

/**
 * Get animation style object with canonical timing and easing
 */
export function getAnimationStyle(
  duration: number,
  easing: string = EASING.DEFAULT,
  delay: number = 0
): React.CSSProperties {
  return {
    transition: `all ${duration}ms ${easing} ${delay}ms`,
  };
}

/**
 * Check if device supports haptics
 */
export function supportsHaptics(): boolean {
  return typeof window !== 'undefined' && 'vibrate' in navigator;
}
