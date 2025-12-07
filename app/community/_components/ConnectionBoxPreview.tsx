"use client";

import { useMemo } from "react";
import { chinesePatternLine } from "@/lib/compatibility/chinesePatternLine";
import { calculateConnection } from "@/lib/compatibility/connectionBox";

type ProfileSlim = {
  id: string;
  displayName: string;
  westSign: string;
  chineseSign: string;
  eastWestCode: string;
};

type Props = {
  viewer: ProfileSlim;
  other: ProfileSlim;
  onClose: () => void;
};

export function ConnectionBoxPreview({ viewer, other, onClose }: Props) {
  const result = useMemo(() => {
    return calculateConnection(
      {
        westSign: viewer.westSign,
        chineseSign: viewer.chineseSign,
      },
      {
        westSign: other.westSign,
        chineseSign: other.chineseSign,
      }
    );
  }, [viewer.westSign, viewer.chineseSign, other.westSign, other.chineseSign]);

  const chineseLine =
    chinesePatternLine[result.chinesePattern] ?? result.chinesePatternLine;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-950/90 p-4 sm:p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Connection preview
            </p>
            <h2 className="text-sm font-semibold text-slate-50">
              {viewer.eastWestCode} × {other.eastWestCode}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[11px] text-slate-400 hover:text-slate-200"
          >
            Close
          </button>
        </div>

        {/* Score & label */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-medium text-slate-400">
              Match score
            </span>
            <span className="text-lg font-semibold text-emerald-400">
              {result.score}
            </span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
          <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-[11px] font-medium text-slate-100">
            {result.label}
          </span>
        </div>

        {/* Chinese pattern line */}
        <div className="mb-3 rounded-2xl bg-slate-900/80 p-3">
          <p className="text-[11px] font-semibold text-slate-200">
            Chinese pattern
          </p>
          <p className="mt-1 text-[11px] text-slate-300">
            {chineseLine}
          </p>
        </div>

        {/* Western one-liner */}
        <div className="mb-3 rounded-2xl bg-slate-900/60 p-3">
          <p className="text-[11px] font-semibold text-slate-200">
            Western dynamic
          </p>
          <p className="mt-1 text-[11px] text-slate-300">
            {result.westernLine}
          </p>
        </div>

        {/* Short relationship insight */}
        <div className="rounded-2xl bg-slate-900/40 p-3">
          <p className="text-[11px] font-semibold text-slate-200">
            Relationship insight
          </p>
          <p className="mt-1 text-[11px] text-slate-300">
            {result.connectionSummary}
          </p>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800/70"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

