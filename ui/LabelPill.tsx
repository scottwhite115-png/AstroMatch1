import React from "react";
import { TIER_LABEL, TIER_THEME, TIER_TOOLTIP, type Tier } from "@/engine/labels";

export function LabelPill({ tier, label }: { tier: Tier; label?: string }) {
  const theme = TIER_THEME[tier];
  const text = label ?? TIER_LABEL[tier];

  return (
    <span
      className="inline-flex items-center rounded-full border-2 px-2.5 py-1 text-xs font-medium"
      style={{
        color: 'inherit',
        borderColor: theme.borderColor,
        backgroundColor: 'transparent',
      }}
      title={TIER_TOOLTIP[tier]}
      aria-label={`${text} — ${TIER_TOOLTIP[tier]}`}
    >
      {text}
    </span>
  );
}

