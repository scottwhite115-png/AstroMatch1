export type Tier = "perfect" | "excellent" | "good" | "fair" | "challenging";

export const TIER_LABEL: Record<Tier, string> = {
  perfect: "Perfect",
  excellent: "Excellent",
  good: "Good",
  fair: "Fair",
  challenging: "Challenging",
};

export const TIER_TOOLTIP: Record<Tier, string> = {
  perfect: "Top alignment across East & West.",
  excellent: "Strong synergy; great potential.",
  good: "Workable match with pros and cons.",
  fair: "Mixed signals; could develop with care.",
  challenging: "High friction; effort required.",
};

// optional UI tokens
export const TIER_THEME: Record<Tier, { bg: string; text: string; ring: string }> = {
  perfect: { bg: "bg-yellow-100", text: "text-yellow-900", ring: "ring-yellow-300" },
  excellent: { bg: "bg-emerald-100", text: "text-emerald-900", ring: "ring-emerald-300" },
  good: { bg: "bg-amber-100", text: "text-amber-900", ring: "ring-amber-300" },
  fair: { bg: "bg-sky-100", text: "text-sky-900", ring: "ring-sky-300" },
  challenging: { bg: "bg-rose-100", text: "text-rose-900", ring: "ring-rose-300" },
};

