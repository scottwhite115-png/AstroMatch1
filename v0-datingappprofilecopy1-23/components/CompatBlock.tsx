// /components/CompatBlock.tsx
'use client';

import { useCompatibility } from '@/lib/hooks/useCompatibility';

type Props = {
  score: number;         // from base matrix
  pairId: string;        // e.g., "aquarius_monkey|aquarius_monkey"
  tier: 'soulmate'|'twin'|'excellent'|'good'|'learning'|'challenging'|'incompatible';
  left: string;          // "Aquarius / Monkey"
  right: string;         // "Aquarius / Monkey"
  tierLabel?: string;    // Optional custom label (e.g., "Soulmate Connection")
  colorRgb?: string;     // Optional color override
};

export function CompatBlock({ score, pairId, tier, left, right, tierLabel, colorRgb }: Props) {
  const showLongform = (tier === 'soulmate' || tier === 'twin' || tier === 'excellent');
  const { data, status } = useCompatibility(pairId, showLongform);

  // Get tier color from CSS variables
  const getTierColor = () => {
    if (colorRgb) return colorRgb;
    switch (tier) {
      case 'soulmate': return 'rgb(251, 191, 36)';
      case 'twin': return 'rgb(249, 115, 22)';
      case 'excellent': return 'rgb(236, 72, 153)';
      case 'good': return 'rgb(168, 85, 247)';
      case 'learning': return 'rgb(59, 130, 246)';
      case 'challenging': return 'rgb(239, 68, 68)';
      default: return 'rgb(107, 114, 128)';
    }
  };

  const getTierEmoji = () => {
    switch (tier) {
      case 'soulmate': return '⭐';
      case 'twin': return '🔥';
      case 'excellent': return '💖';
      case 'good': return '🌙';
      case 'learning': return '🧭';
      case 'challenging': return '⚡';
      default: return '💔';
    }
  };

  const getTierLabel = () => {
    if (tierLabel) return tierLabel;
    switch (tier) {
      case 'soulmate': return 'Soulmate Connection';
      case 'twin': return 'Twin Flame Connection';
      case 'excellent': return 'Excellent Connection';
      case 'good': return 'Good Connection';
      case 'learning': return 'Learning Connection';
      case 'challenging': return 'Challenging Connection';
      default: return 'Incompatible Connection';
    }
  };

  const color = getTierColor();
  const emoji = getTierEmoji();
  const label = getTierLabel();

  return (
    <section className="rounded-2xl p-5 border bg-gradient-to-b from-white to-[#f9f9ff] text-gray-900 dark:from-[#1b1130] dark:to-[#100820] dark:text-white border-purple-200 dark:border-purple-900/30 shadow-lg dark:shadow-[0_0_20px_rgba(168,85,247,0.15)]">
      {/* Tier Label with Score */}
      <h3 
        className={`text-2xl font-bold text-center mb-3 compat-heading ${tier}`}
        style={{ color }}
      >
        {emoji} {label} — {score}%
      </h3>

      {/* Sign Pairing */}
      <div className="text-lg mb-3 text-center font-medium text-gray-700 dark:text-gray-300">
        {left} × {right}
      </div>

      {/* Connection Label (Magnetic Synergy, etc.) */}
      {data?.headline ? (
        <div 
          className="text-xl font-semibold text-center py-2 px-3 rounded-lg mb-4"
          style={{ 
            color,
            backgroundColor: `${color}15` 
          }}
        >
          {data.headline}
        </div>
      ) : null}

      {/* Longform Content */}
      {data ? (
        <div className="space-y-4">
          {/* Body Text */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-300 dark:border-amber-700/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">✨</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                Premium Insight
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">
              {data.body}
            </p>
          </div>

          {/* Eastern Notes */}
          <div className="p-3 rounded-lg bg-black/5 dark:bg-white/5">
            <h5 className="font-semibold text-sm text-purple-600 dark:text-purple-400 mb-1">
              {data.east_west_notes.east.label}
            </h5>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {data.east_west_notes.east.text}
            </p>
          </div>

          {/* Western Notes */}
          <div className="p-3 rounded-lg bg-black/5 dark:bg-white/5">
            <h5 className="font-semibold text-sm text-pink-600 dark:text-pink-400 mb-1">
              {data.east_west_notes.west.label}
            </h5>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {data.east_west_notes.west.text}
            </p>
          </div>

          {/* Premium Badge */}
          <div className="pt-3 border-t border-black/10 dark:border-white/10">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>Premium Compatibility Content</span>
            </div>
          </div>
        </div>
      ) : showLongform && status === 'loading' ? (
        <div className="py-4 text-center">
          <div className="inline-block animate-pulse text-gray-500 dark:text-gray-400">
            Loading premium content...
          </div>
        </div>
      ) : showLongform && status === 'error' ? (
        <div className="py-2 text-center text-sm text-gray-500 dark:text-gray-400">
          Standard compatibility view
        </div>
      ) : null}
    </section>
  );
}

