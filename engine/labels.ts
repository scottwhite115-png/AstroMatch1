export type Tier = "Soulmate" | "Twin Flame" | "Excellent" | "Favourable" | "Neutral" | "Magnetic Opposites" | "Difficult";

export const TIER_LABEL: Record<Tier, string> = {
  Soulmate: "Soulmate Match",
  "Twin Flame": "Twin Flame Match",
  Excellent: "Excellent Match",
  Favourable: "Favourable Match",
  Neutral: "Neutral Match",
  "Magnetic Opposites": "Magnetic Opposites",
  Difficult: "Difficult Match",
};

export const TIER_TOOLTIP: Record<Tier, string> = {
  Soulmate: "Perfect alignment across East & West — rare and profound connection.",
  "Twin Flame": "Intense spiritual connection with strong compatibility.",
  Excellent: "Strong synergy; great potential for growth.",
  Favourable: "Workable match with positive dynamics.",
  Neutral: "Steady connection; depends on timing and effort.",
  "Magnetic Opposites": "Powerful attraction with contrasting energies.",
  Difficult: "High friction; significant effort required.",
};

// optional UI tokens
export const TIER_THEME: Record<Tier, { bg: string; text: string; ring: string }> = {
  Soulmate: { bg: "bg-yellow-100", text: "text-yellow-900", ring: "ring-yellow-300" },
  "Twin Flame": { bg: "bg-orange-100", text: "text-orange-900", ring: "ring-orange-300" },
  Excellent: { bg: "bg-pink-100", text: "text-pink-900", ring: "ring-pink-300" },
  Favourable: { bg: "bg-green-100", text: "text-green-900", ring: "ring-green-300" },
  Neutral: { bg: "bg-cyan-100", text: "text-cyan-900", ring: "ring-cyan-300" },
  "Magnetic Opposites": { bg: "bg-rose-100", text: "text-rose-900", ring: "ring-rose-300" },
  Difficult: { bg: "bg-red-100", text: "text-red-900", ring: "ring-red-300" },
};

