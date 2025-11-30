import React from "react";
import { TIER_LABEL, TIER_THEME, TIER_TOOLTIP, type Tier } from "@/engine/labels";

export function LabelPill({ tier, label }: { tier: Tier; label?: string }) {
  const theme = TIER_THEME[tier];
  const text = label ?? TIER_LABEL[tier];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${theme.bg} ${theme.text} ${theme.ring}`}
      title={TIER_TOOLTIP[tier]}
      aria-label={`${text} — ${TIER_TOOLTIP[tier]}`}
    >
      {text}
    </span>
  );
}

