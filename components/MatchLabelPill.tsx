// components/MatchLabelPill.tsx

import { getPatternPillLabel, getPatternChineseSymbol } from "@/lib/astrology/patternLabels";

interface MatchLabelPillProps {
  pattern: string; // Accept string to handle both pattern type systems
  score: number;
  variant?: "standalone" | "inline"; // "standalone" has its own background, "inline" uses parent styling
}

// Get color based on pattern for border and text
function getPatternColor(pattern: string): { border: string; text: string } {
  const patternUpper = pattern.toUpperCase();
  
  if (patternUpper.includes('SAN_HE') || patternUpper.includes('TRIPLE HARMONY')) {
    return { border: '#eab308', text: '#ca8a04' }; // yellow
  }
  if (patternUpper.includes('LIU_HE') || patternUpper.includes('SECRET ALLIES') || patternUpper.includes('SECRET FRIENDS')) {
    return { border: '#a855f7', text: '#9333ea' }; // purple
  }
  if (patternUpper.includes('SAME_ANIMAL') || patternUpper.includes('SAME ANIMAL') || patternUpper.includes('SAME_SIGN') || patternUpper.includes('SAME SIGN')) {
    return { border: '#06b6d4', text: '#0891b2' }; // cyan
  }
  if (patternUpper.includes('NO_PATTERN') || patternUpper.includes('NO MAJOR') || patternUpper.includes('NEUTRAL')) {
    return { border: '#06b6d4', text: '#0891b2' }; // cyan (neutral)
  }
  if (patternUpper.includes('LIU_CHONG') || patternUpper.includes('SIX CONFLICTS')) {
    return { border: '#f97316', text: '#ea580c' }; // orange
  }
  if (patternUpper.includes('LIU_HAI') || patternUpper.includes('SIX HARMS')) {
    return { border: '#f43f5e', text: '#e11d48' }; // rose
  }
  if (patternUpper.includes('XING') || patternUpper.includes('PUNISHMENT')) {
    return { border: '#ef4444', text: '#dc2626' }; // red
  }
  if (patternUpper.includes('PO') || patternUpper.includes('BREAK')) {
    return { border: '#ef4444', text: '#dc2626' }; // red
  }
  
  // Default neutral
  return { border: '#06b6d4', text: '#0891b2' };
}

export function MatchLabelPill({ pattern, score, variant = "standalone" }: MatchLabelPillProps) {
  if (!pattern || typeof score !== 'number') {
    console.warn('[MatchLabelPill] Missing pattern or score:', { pattern, score });
    return null;
  }

  // Get English translation and Chinese symbol separately
  const englishLabel = getPatternPillLabel(pattern);
  const chineseSymbol = getPatternChineseSymbol(pattern);
  
  // Build label: "English Translation 中文 · Score%"
  const pillLabel = chineseSymbol 
    ? `${englishLabel} ${chineseSymbol} · ${Math.round(score)}%`
    : `${englishLabel} · ${Math.round(score)}%`;

  if (!pillLabel) {
    console.warn('[MatchLabelPill] Could not get pill label for pattern:', pattern);
    return null;
  }

  // For inline variant, just return the text without wrapping span
  if (variant === "inline") {
    return (
      <span className="normal-case">
        {pillLabel}
      </span>
    );
  }

  // Get colors for this pattern
  const colors = getPatternColor(pattern);

  // For standalone variant, transparent background with colored border and text
  return (
    <span
      className="inline-flex items-center rounded-full border-2 px-2.5 py-1 text-xs font-medium bg-transparent"
      style={{
        borderColor: colors.border,
        color: colors.text,
        backgroundColor: 'transparent',
      }}
    >
      {pillLabel}
    </span>
  );
}
