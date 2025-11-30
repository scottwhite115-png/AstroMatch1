// /lib/applyBookOverrides.ts
// Applies book-based astrology overrides to compatibility scores
import type { West, East } from "@/lib/eastWestHelpers";
import { bookOverrides } from "@/lib/bookOverrides";

export function applyBookOverrides(
  a: { west: West; east: East },
  b: { west: West; east: East },
  layer: { chemistry: number; longTerm: number; communication: number }
) {
  const apply = (key: `${West}-${East}`, self: {west:West;east:East}, other: {west:West;east:East}) => {
    const rules = bookOverrides[key] || [];
    for (const rule of rules) {
      if (rule.targetAnimal !== other.east) continue;
      if (rule.westFilter && rule.westFilter !== "any" && !rule.westFilter.includes(other.west)) continue;
      if (rule.delta.chem) layer.chemistry += rule.delta.chem;
      if (rule.delta.long) layer.longTerm  += rule.delta.long;
      if (rule.delta.comm) layer.communication += rule.delta.comm;
    }
  };

  apply(`${a.west}-${a.east}`, a, b);
  apply(`${b.west}-${b.east}`, b, a);
  return layer;
}

