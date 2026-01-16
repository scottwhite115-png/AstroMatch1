// src/lib/match/themes.ts
export function composeTheme(reasons: string[]): string {
  const has = (k: string) => reasons.includes(k);

  if (has("Same Chinese trine") && (has("Same element") || has("Complementary elements")))
    return "Aligned in pace and purpose — you turn ideas into shared momentum.";

  if (has("Same element") && has("Trine aspect"))
    return "Same nature, easy flow — your gifts amplify each other without effort.";

  if (has("Complementary elements") && has("Sextile aspect"))
    return "Different strengths that click — supportive, exciting, and forward-moving.";

  if (has("Opposition polarity") && (has("Friendly trines") || has("Animal allies")))
    return "Magnetic mirror energy — contrast that matures into devotion.";

  if (has("Animal clash"))
    return "Strong pull, stronger lessons — keep curiosity high and judgments low.";

  if (has("High-tempo synergy"))
    return "Quick minds, quick hearts — life speeds up when you're together.";

  return "Different paths, shared horizon — curiosity and kindness make this work.";
}

