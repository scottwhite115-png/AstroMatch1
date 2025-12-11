// components/ConnectionBoxTop.tsx
'use client';

import {
  ChineseBasePattern,
  ChineseOverlayPattern,
  WesternElementRelation,
  deriveArchetype,
  deriveWesternEase,
  getChineseBaseChip,
  getChineseOverlayChip,
  getWesternChip,
  getConnectionBlurb,
} from '@/lib/connectionUi';

type ConnectionBoxProps = {
  primaryLabel: string;                 // e.g. "Intense Match", "Strong Harmony Match"
  score: number;                        // 0–100
  chineseBase: ChineseBasePattern;      // SAN_HE / LIU_HE / SAME_SIGN / NO_PATTERN
  chineseOverlays: ChineseOverlayPattern[];
  westernRelation: WesternElementRelation;
};

export function ConnectionBoxTop(props: ConnectionBoxProps) {
  const {
    primaryLabel,
    score,
    chineseBase,
    chineseOverlays,
    westernRelation,
  } = props;

  const archetype = deriveArchetype(chineseBase, chineseOverlays);
  const ease = deriveWesternEase(westernRelation);

  const baseChip = getChineseBaseChip(chineseBase);
  const overlayChip = getChineseOverlayChip(chineseOverlays);
  const westernChip = getWesternChip(westernRelation);

  const blurb = getConnectionBlurb(archetype, ease);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 shadow-lg space-y-3">
      {/* Match label + score */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-100">
          {primaryLabel}
        </span>
        <span className="text-sm font-semibold text-slate-100">
          {Math.round(score)}%
        </span>
      </div>

      {/* Pattern chips */}
      <div className="flex flex-wrap gap-2 text-[11px] text-slate-200">
        <Chip icon={baseChip.icon} label={baseChip.label} />
        {overlayChip && <Chip icon={overlayChip.icon} label={overlayChip.label} />}
        <Chip icon={westernChip.icon} label={westernChip.label} />
      </div>

      {/* Human-readable blurb */}
      <p className="text-xs leading-relaxed text-slate-200">
        {blurb}
      </p>
    </div>
  );
}

type ChipProps = {
  icon: string;
  label: string;
};

function Chip({ icon, label }: ChipProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/70 px-2.5 py-1">
      <span>{icon}</span>
      <span className="whitespace-nowrap">{label}</span>
    </span>
  );
}
