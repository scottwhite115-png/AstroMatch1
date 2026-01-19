// /data/rankTheme.ts
export type RankKey = "perfect" | "excellent" | "good" | "fair" | "challenging";

export interface RankTheme {
  key: RankKey;
  colorRgb: string;
  emoji: string;
  // Tailwind-friendly tokens for consistent UI (use as className pieces)
  text: string;   // text color
  border: string; // border color
  glowLight: string; // light mode shadow/glow
  glowDark: string;  // dark mode shadow/glow
}

export const RANK_THEME: Record<RankKey, RankTheme> = {
  perfect: {
    key: "perfect",
    colorRgb: "rgb(212, 175, 55)",
    emoji: "✨",
    text: "text-yellow-600 dark:text-yellow-400",
    border: "border-yellow-500/60 dark:border-yellow-400/50",
    glowLight: "shadow-[0_0_20px_rgba(212,175,55,0.32)]",
    glowDark:  "dark:shadow-[0_0_24px_rgba(212,175,55,0.42)]",
  },
  excellent: {
    key: "excellent",
    colorRgb: "rgb(34, 197, 94)",
    emoji: "💖",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-300/70 dark:border-emerald-500/40",
    glowLight: "shadow-[0_0_18px_rgba(34,197,94,0.22)]",
    glowDark:  "dark:shadow-[0_0_22px_rgba(34,197,94,0.35)]",
  },
  good: {
    key: "good",
    colorRgb: "rgb(251, 191, 36)",
    emoji: "🌙",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-300/70 dark:border-amber-500/40",
    glowLight: "shadow-[0_0_16px_rgba(251,191,36,0.18)]",
    glowDark:  "dark:shadow-[0_0_20px_rgba(251,191,36,0.32)]",
  },
  fair: {
    key: "fair",
    colorRgb: "rgb(56, 189, 248)",
    emoji: "🧭",
    text: "text-sky-600 dark:text-sky-400",
    border: "border-sky-300/70 dark:border-sky-500/40",
    glowLight: "shadow-[0_0_16px_rgba(56,189,248,0.2)]",
    glowDark:  "dark:shadow-[0_0_20px_rgba(56,189,248,0.3)]",
  },
  challenging: {
    key: "challenging",
    colorRgb: "rgb(239, 68, 68)",
    emoji: "⚡",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-300/70 dark:border-rose-500/40",
    glowLight: "shadow-[0_0_18px_rgba(239,68,68,0.18)]",
    glowDark:  "dark:shadow-[0_0_22px_rgba(239,68,68,0.32)]",
  },
};

// Handy getter
export function getRankTheme(rankKey: RankKey) {
  return RANK_THEME[rankKey];
}

