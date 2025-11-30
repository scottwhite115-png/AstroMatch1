// lib/matchLabels.ts

export type MatchLabel =
  | "Soulmate Match"
  | "Twin Flame Match"
  | "Excellent Match"
  | "Favourable Match"
  | "Neutral Match"
  | "Magnetic Opposites"
  | "Difficult Match";

// Clean, human taglines for under "Label · 92%"
export const MATCH_LABEL_TAGLINES: Record<MatchLabel, string> = {
  "Soulmate Match":
    "Very high natural compatibility with strong long-term potential.",
  "Twin Flame Match":
    "Intense mutual spark with strong attraction and big growth potential.",
  "Excellent Match":
    "High compatibility with shared priorities and a strong base to build on together.",
  "Favourable Match":
    "Good overall fit that works well with steady effort from both sides.",
  "Neutral Match":
    "Balanced match where personality, timing, and choice make the biggest difference.",
  "Magnetic Opposites":
    "Strong pull through contrast that keeps the connection lively and dynamic.",
  "Difficult Match":
    "Lower natural alignment that benefits from extra patience, clarity, and self-awareness.",
};

// Color coding for label + % score
// Tailwind classes – adjust shades to taste.
export const MATCH_LABEL_COLOR_CLASSES: Record<MatchLabel, string> = {
  "Soulmate Match": "text-yellow-300",     // Gold
  "Twin Flame Match": "text-orange-400",   // AstroMatch orange
  "Excellent Match": "text-pink-500",      // Hot pink
  "Favourable Match": "text-sky-400",      // Blue
  "Neutral Match": "text-emerald-400",     // Green
  "Magnetic Opposites": "text-red-500",    // Red
  "Difficult Match": "text-slate-300",     // Grey
};

