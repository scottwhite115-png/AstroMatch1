import type { Tier } from "./labels";

type Legacy =
  | "cosmic_soulmates" | "stellar_sparks" | "harmonious_bond" | "intriguing_challenge" | "cosmic_contrast"
  | "best" | "strong" | "compatible" | "challenging" | "mismatch"
  | "ideal" | "high" | "moderate" | "low" | "not_recommended";

export function toNewTier(x: string): Tier {
  const s = x.toLowerCase();
  if (["perfect","excellent","good","fair","challenging"].includes(s)) return s as Tier;

  switch (s as Legacy) {
    case "great":
      return "excellent";
    case "contrast":
      return "challenging";
    case "cosmic_soulmates":
    case "best":
    case "ideal":
      return "perfect";
    case "stellar_sparks":
    case "strong":
    case "high":
      return "excellent";
    case "harmonious_bond":
    case "compatible":
    case "moderate":
      return "good";
    case "intriguing_challenge":
    case "challenging":
    case "low":
      return "fair";
    case "cosmic_contrast":
    case "mismatch":
    case "not_recommended":
    default:
      return "challenging";
  }
}

