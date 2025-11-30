// components/MatchLabelPill.tsx

import { getPatternPillLabel, getPatternChineseSymbol } from "@/lib/astrology/patternLabels";

interface MatchLabelPillProps {
  pattern: string; // Accept string to handle both pattern type systems
  score: number;
  variant?: "standalone" | "inline"; // "standalone" has its own background, "inline" uses parent styling
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

  // For standalone variant, use the black background with backdrop blur
  return (
    <span
      className="
        inline-flex items-center rounded-full
        bg-black/60 px-2.5 py-1
        text-xs font-medium text-white
        backdrop-blur-sm
      "
    >
      {pillLabel}
    </span>
  );
}
