import React from "react";
import { getChineseDetailedCompat, getWesternDetailedCompat } from "@/data/detailedCompatDescriptions";

type DetailedCompatDescription = {
  heading: string;
  tagline: string;
  description: string;
};

type ConnectionBoxProps = {
  // Basic label + score (optional)
  matchLabel: string;           // e.g. "Favourable Match"
  matchLabelColor?: "green" | "pink" | "gold" | "blue" | "red";

  // Top icons / names
  leftSunLabel: string;         // e.g. "Gemini"
  leftSunEmoji?: string;        // e.g. "♊️"
  leftChineseLabel: string;     // e.g. "Pig"
  leftChineseEmoji?: string;    // e.g. "🐷"

  rightSunLabel: string;        // e.g. "Gemini"
  rightSunEmoji?: string;       // e.g. "♊️"
  rightChineseLabel: string;    // e.g. "Dragon"
  rightChineseEmoji?: string;   // e.g. "🐉"

  // Text blurbs
  mainLine: string;             // short overview sentence under the pill
  chineseLine: string;          // e.g. "Pig × Dragon — Cross-Trine"
  chineseSubline?: string;      // optional softer line
  westernLine: string;          // e.g. "Gemini × Gemini — Same Element: Air × Air"
  westernSubline?: string;      // optional softer line
  
  // Detailed compatibility descriptions (optional - will be fetched if not provided)
  chineseDetailedCompat?: DetailedCompatDescription | null;
  westernDetailedCompat?: DetailedCompatDescription | null;
  
  // Action button callbacks
  onPass?: () => void;
  onLike?: () => void;
  onMessageClick?: () => void;
  onViewProfile?: () => void;
  
  // Optional pattern for button gradient colors
  pattern?: string;
};

export const ConnectionBox: React.FC<ConnectionBoxProps> = ({
  matchLabel,
  matchLabelColor = "green",
  leftSunLabel,
  leftSunEmoji = "♊️",
  leftChineseLabel,
  leftChineseEmoji = "🐷",
  rightSunLabel,
  rightSunEmoji = "♊️",
  rightChineseLabel,
  rightChineseEmoji = "🐉",
  mainLine,
  chineseLine,
  chineseSubline,
  westernLine,
  westernSubline,
  chineseDetailedCompat,
  westernDetailedCompat,
  onPass,
  onLike,
  onMessageClick,
  onViewProfile,
  pattern,
}) => {
  // Fetch detailed compatibility if not provided
  // Convert to lowercase for lookup (data uses lowercase keys)
  const chineseCompatRaw = chineseDetailedCompat ?? getChineseDetailedCompat(
    leftChineseLabel.toLowerCase().trim(),
    rightChineseLabel.toLowerCase().trim()
  );
  const westernCompatRaw = westernDetailedCompat ?? getWesternDetailedCompat(
    leftSunLabel.toLowerCase().trim(),
    rightSunLabel.toLowerCase().trim()
  );

  // Filter out specific combinations that should not be shown in connection boxes
  const shouldExcludeChinese = chineseCompatRaw && (
    chineseCompatRaw.heading.includes("Monkey × Rooster") ||
    chineseCompatRaw.heading.includes("Rooster × Monkey")
  );
  const shouldExcludeWestern = westernCompatRaw && (
    westernCompatRaw.heading.includes("Aquarius × Aries") ||
    westernCompatRaw.heading.includes("Aries × Aquarius")
  );

  const chineseCompat = shouldExcludeChinese ? null : chineseCompatRaw;
  const westernCompat = shouldExcludeWestern ? null : westernCompatRaw;
  const matchColorClasses: Record<
    NonNullable<ConnectionBoxProps["matchLabelColor"]>,
    string
  > = {
    green:
      "text-emerald-600 border-2 border-emerald-500 dark:text-emerald-300 dark:border-emerald-400",
    pink:
      "text-pink-600 border-2 border-pink-500 dark:text-pink-300 dark:border-pink-400",
    gold:
      "text-amber-600 border-2 border-amber-500 dark:text-amber-300 dark:border-amber-400",
    blue:
      "text-sky-600 border-2 border-sky-500 dark:text-sky-300 dark:border-sky-400",
    red:
      "text-rose-600 border-2 border-rose-500 dark:text-rose-300 dark:border-rose-400",
  };

  // Helper to get pattern-based gradient for buttons
  const getPatternGradient = (pattern?: string): string => {
    if (!pattern) return 'from-slate-300 via-slate-400 to-slate-300';
    
    const patternUpper = pattern.toUpperCase();
    
    if (patternUpper.includes('SAN_HE') || patternUpper.includes('TRIPLE HARMONY')) {
      return 'from-amber-400 via-yellow-400 to-amber-500';
    }
    
    if (patternUpper.includes('LIU_HE') || patternUpper.includes('SECRET ALLIES') || patternUpper.includes('SECRET FRIENDS')) {
      return 'from-purple-400 via-fuchsia-400 to-pink-400';
    }
    
    if (patternUpper.includes('SAME_ANIMAL') || patternUpper.includes('SAME ANIMAL') || patternUpper.includes('SAME_SIGN') || patternUpper.includes('SAME SIGN')) {
      return 'from-teal-400 via-cyan-400 to-sky-400';
    }
    
    if (patternUpper.includes('NO_PATTERN') || patternUpper.includes('NO MAJOR') || patternUpper.includes('NEUTRAL')) {
      return 'from-blue-400 via-indigo-400 to-blue-500';
    }
    
    if (patternUpper.includes('LIU_CHONG') || patternUpper.includes('SIX CONFLICTS')) {
      return 'from-orange-400 via-orange-500 to-red-500';
    }
    
    if (patternUpper.includes('LIU_HAI') || patternUpper.includes('SIX HARMS')) {
      return 'from-rose-400 via-pink-500 to-rose-500';
    }
    
    if (patternUpper.includes('XING') || patternUpper.includes('PUNISHMENT')) {
      return 'from-red-500 via-red-600 to-red-700';
    }
    
    if (patternUpper.includes('PO') || patternUpper.includes('BREAK')) {
      return 'from-red-600 via-rose-700 to-red-800';
    }
    
    return 'from-slate-300 via-slate-400 to-slate-300';
  };

  const buttonGradient = getPatternGradient(pattern);

  return (
    <section
      className="
        mt-4 rounded-3xl border px-4 py-5 pb-8 shadow-lg
        bg-white/90 border-slate-200 text-slate-900
        dark:bg-gradient-to-br dark:from-[#1a1040] dark:via-[#0b0724] dark:to-[#150a3a]
        dark:border-slate-800 dark:text-slate-100
      "
    >
      {/* Heading */}
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-violet-200/80">
        <span className="text-sm">✦</span>
        <span>Your Connection</span>
      </div>

      {/* Top icons row */}
      <div className="mt-4 flex items-center justify-center gap-6">
        {/* Left side */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex flex-col items-center">
            <div className="text-3xl">{leftSunEmoji}</div>
            <div className="mt-0.5 text-2xl font-bold text-slate-900 dark:text-slate-50">
              {leftSunLabel}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl leading-none">{leftChineseEmoji}</span>
            <span className="mt-0.5 text-2xl font-bold text-slate-500 dark:text-slate-300">{leftChineseLabel}</span>
          </div>
        </div>

        {/* Heart in the middle */}
        <div className="flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-pink-500"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex flex-col items-center">
            <div className="text-3xl">{rightSunEmoji}</div>
            <div className="mt-0.5 text-2xl font-bold text-slate-900 dark:text-slate-50">
              {rightSunLabel}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl leading-none">{rightChineseEmoji}</span>
            <span className="mt-0.5 text-2xl font-bold text-slate-500 dark:text-slate-300">{rightChineseLabel}</span>
          </div>
        </div>
      </div>

      {/* Divider line */}
      <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

      {/* Sign combination at the very top */}
      <div className="mt-4 text-center">
        <p className="text-lg font-bold text-slate-800 dark:text-slate-50">
          {leftSunLabel} / {leftChineseLabel} ♥ {rightSunLabel} / {rightChineseLabel}
        </p>
      </div>

      {/* Action Buttons Row - Right after sign combinations */}
      <div className="mt-4 flex items-center justify-center gap-3">
        {/* Pass Button */}
        {onPass && (
          <button
            onClick={onPass}
            className={`inline-flex items-center justify-center rounded-full bg-gradient-to-r ${buttonGradient} px-3 py-1.5 text-xs font-semibold tracking-wide text-white shadow-lg hover:opacity-90 active:scale-95 transition-all`}
            aria-label="Pass"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}

        {/* Like Button */}
        {onLike && (
          <button
            onClick={onLike}
            className={`inline-flex items-center justify-center rounded-full bg-gradient-to-r ${buttonGradient} px-3 py-1.5 text-xs font-semibold tracking-wide text-white shadow-lg hover:opacity-90 active:scale-95 transition-all`}
            aria-label="Like"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        )}

        {/* Chat Button */}
        {onMessageClick && (
          <button
            onClick={onMessageClick}
            className={`inline-flex items-center justify-center rounded-full bg-gradient-to-r ${buttonGradient} px-3 py-1.5 text-xs font-semibold tracking-wide text-white shadow-lg hover:opacity-90 active:scale-95 transition-all`}
            aria-label="Chat"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        )}

        {/* Profile Button */}
        {onViewProfile && (
          <button
            onClick={onViewProfile}
            className={`inline-flex items-center justify-center rounded-full bg-gradient-to-r ${buttonGradient} px-3 py-1.5 text-xs font-semibold tracking-wide text-white shadow-lg hover:opacity-90 active:scale-95 transition-all`}
            aria-label="View Profile"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        )}
      </div>

      {/* Match label pill with pattern */}
      <div className="mt-3 flex justify-center">
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${matchColorClasses[matchLabelColor]}`}
        >
          {matchLabel}
        </span>
      </div>

      {/* Chinese pattern name below the pill */}
      {(chineseLine.includes('—') || chineseLine.includes('–')) && (
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-300">
          {chineseLine.split(/[—–]/)[1]?.trim() || ''}
        </p>
      )}
      {chineseSubline && (
        <p className="mt-1 text-center text-xs italic text-slate-500 dark:text-slate-300">
          {chineseSubline}
        </p>
      )}

      {/* Main connection line */}
      <div className="mt-4 min-h-[3rem] flex items-center justify-center">
        <p className="text-center text-sm text-slate-700 dark:text-slate-200">
          {mainLine}
        </p>
      </div>

      {/* Western pattern line */}
      <div className="mt-4 min-h-[2.5rem] flex flex-col items-center justify-start">
        <p className="text-center text-sm font-medium text-slate-800 dark:text-slate-50">
          {westernLine}
        </p>
        {westernSubline && (
          <p className="mt-1 text-center text-xs italic text-slate-500 dark:text-slate-300">
            {westernSubline}
          </p>
        )}
      </div>

      {/* Detailed Compatibility Sections */}
      <div className="mt-6 space-y-4">
        {/* Chinese Overview Section */}
        {chineseCompat && (() => {
          // Parse heading: "Rat × Ox— Secret Friend (Liu He 六合)"
          // Extract sign pair and pattern
          const headingParts = chineseCompat.heading.split(/[—–]/);
          const signPair = headingParts[0]?.trim() || '';
          const patternInfo = headingParts[1]?.trim() || '';
          
          return (
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 p-4">
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-2">
                Chinese Overview
              </h3>
              <div className="space-y-2">
                {/* First line: Sign pair + Tagline */}
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex-1">
                    {signPair}{chineseCompat.tagline ? `— ${chineseCompat.tagline}` : ''}
                  </h4>
                </div>
                {/* Second line: Pattern info */}
                {patternInfo && (
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {patternInfo}
                  </p>
                )}
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {chineseCompat.description}
                </p>
              </div>
            </div>
          );
        })()}

        {/* Western Overview Section */}
        {westernCompat && (() => {
          // Parse heading: "Aries × Taurus — Semi-Compatible (Fire + Earth)"
          // Extract sign pair and element/compatibility info
          const headingParts = westernCompat.heading.split(/[—–]/);
          const signPair = headingParts[0]?.trim() || '';
          const elementInfo = headingParts[1]?.trim() || '';
          
          return (
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 p-4">
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-2">
                Western Overview
              </h3>
              <div className="space-y-2">
                {/* First line: Sign pair + Tagline */}
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex-1">
                    {signPair}{westernCompat.tagline ? ` — ${westernCompat.tagline}` : ''}
                  </h4>
                </div>
                {/* Second line: Element/Compatibility info */}
                {elementInfo && (
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {elementInfo}
                  </p>
                )}
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {westernCompat.description}
                </p>
              </div>
            </div>
          );
        })()}
      </div>

    </section>
  );
};
