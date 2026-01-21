export type Tier = "Soulmate" | "Twin Flame" | "Excellent" | "Favourable" | "Neutral" | "Six Conflicts" | "Difficult";

export const TIER_LABEL: Record<Tier, string> = {
  Soulmate: "Soulmate Match",
  "Twin Flame": "Twin Flame Match",
  Excellent: "Excellent Match",
  Favourable: "Favourable Match",
  Neutral: "Neutral Match",
  "Six Conflicts": "Six Conflicts",
  Difficult: "Difficult Match",
};

export const TIER_TOOLTIP: Record<Tier, string> = {
  Soulmate: "Perfect alignment across East & West — rare and profound connection.",
  "Twin Flame": "Intense spiritual connection with strong compatibility.",
  Excellent: "Strong synergy; great potential for growth.",
  Favourable: "Workable match with positive dynamics.",
  Neutral: "Steady connection; depends on timing and effort.",
  "Six Conflicts": "Powerful attraction with contrasting energies.",
  Difficult: "High friction; significant effort required.",
};

// optional UI tokens - using inline style colors for guaranteed application
export const TIER_THEME: Record<Tier, { textColor: string; borderColor: string }> = {
  Soulmate: { textColor: "#ca8a04", borderColor: "#eab308" }, // yellow-600 / yellow-500
  "Twin Flame": { textColor: "#ea580c", borderColor: "#f97316" }, // orange-600 / orange-500
  Excellent: { textColor: "#db2777", borderColor: "#ec4899" }, // pink-600 / pink-500
  Favourable: { textColor: "#16a34a", borderColor: "#22c55e" }, // green-600 / green-500
  Neutral: { textColor: "#0891b2", borderColor: "#06b6d4" }, // cyan-600 / cyan-500
  "Six Conflicts": { textColor: "#e11d48", borderColor: "#f43f5e" }, // rose-600 / rose-500
  Difficult: { textColor: "#dc2626", borderColor: "#ef4444" }, // red-600 / red-500
};

