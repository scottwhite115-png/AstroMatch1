import React from "react";

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
  onPass,
  onLike,
  onMessageClick,
  onViewProfile,
  pattern,
}) => {
  const matchColorClasses: Record<
    NonNullable<ConnectionBoxProps["matchLabelColor"]>,
    string
  > = {
    green:
      "bg-emerald-500/15 text-emerald-600 border-emerald-400/50 dark:text-emerald-200 dark:border-emerald-400/60",
    pink:
      "bg-pink-500/15 text-pink-600 border-pink-400/50 dark:text-pink-200 dark:border-pink-400/60",
    gold:
      "bg-amber-500/15 text-amber-600 border-amber-400/50 dark:text-amber-200 dark:border-amber-400/60",
    blue:
      "bg-sky-500/15 text-sky-600 border-sky-400/50 dark:text-sky-200 dark:border-sky-400/60",
    red:
      "bg-rose-500/15 text-rose-600 border-rose-400/50 dark:text-rose-200 dark:border-rose-400/60",
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
        mt-4 rounded-3xl border px-4 py-5 shadow-lg
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
        <div className="flex flex-col items-center text-xs">
          <div className="text-3xl">{leftSunEmoji}</div>
          <div className="mt-1 font-medium text-slate-900 dark:text-slate-50">
            {leftSunLabel}
          </div>
          <div className="mt-1 flex flex-col items-center text-[11px] text-slate-500 dark:text-slate-300">
            <span className="text-base leading-none">{leftChineseEmoji}</span>
            <span className="mt-0.5">{leftChineseLabel}</span>
          </div>
        </div>

        {/* Heart in the middle */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 via-rose-400 to-purple-400 shadow-md shadow-pink-500/40">
          <span className="text-lg leading-none text-white">♥</span>
        </div>

        {/* Right side */}
        <div className="flex flex-col items-center text-xs">
          <div className="text-3xl">{rightSunEmoji}</div>
          <div className="mt-1 font-medium text-slate-900 dark:text-slate-50">
            {rightSunLabel}
          </div>
          <div className="mt-1 flex flex-col items-center text-[11px] text-slate-500 dark:text-slate-300">
            <span className="text-base leading-none">{rightChineseEmoji}</span>
            <span className="mt-0.5">{rightChineseLabel}</span>
          </div>
        </div>
      </div>

      {/* Divider line */}
      <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

      {/* Match label pill */}
      <div className="mt-4 flex justify-center">
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${matchColorClasses[matchLabelColor]}`}
        >
          {matchLabel}
        </span>
      </div>

      {/* Main connection line */}
      <p className="mt-2 text-center text-sm text-slate-700 dark:text-slate-200">
        {mainLine}
      </p>

      {/* Chinese pattern line */}
      <p className="mt-4 text-center text-sm font-medium text-slate-800 dark:text-slate-50">
        {chineseLine}
      </p>
      {chineseSubline && (
        <p className="mt-1 text-center text-xs italic text-slate-500 dark:text-slate-300">
          {chineseSubline}
        </p>
      )}

      {/* Western pattern line */}
      <p className="mt-4 text-center text-sm font-medium text-slate-800 dark:text-slate-50">
        {westernLine}
      </p>
      {westernSubline && (
        <p className="mt-1 text-center text-xs italic text-slate-500 dark:text-slate-300">
          {westernSubline}
        </p>
      )}

      {/* Action Buttons Row */}
      <div className="mt-6 flex items-center justify-center gap-3">
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
    </section>
  );
};

