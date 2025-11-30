"use client";

import React, { useMemo } from "react";
import { buildAstroProfileFromISO } from "@/lib/astro/birthProfile";
import type { AstroProfile } from "@/lib/astro/birthProfile";

type BirthInformationSectionProps = {
  birthDateISO: string | null;                 // "1980-02-16"
  onBirthDateChange: (value: string) => void;  // called when user edits date
  birthTimeKnown?: boolean;                    // optional, for future
};

export function BirthInformationSection({
  birthDateISO,
  onBirthDateChange,
  birthTimeKnown,
}: BirthInformationSectionProps) {
  const astro = useMemo(() => {
    if (!birthDateISO) return null;
    return buildAstroProfileFromISO(birthDateISO);
  }, [birthDateISO]);

  return (
    <section className="space-y-3">
      {/* Section heading */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-purple-400">
          Birth Information
        </h2>
        <p className="text-[11px] text-slate-400">
          The match engine relies on honest information.
        </p>
      </div>

      {/* Date input row */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-slate-300">
          Date of birth
        </label>
        <input
          type="date"
          value={birthDateISO ?? ""}
          onChange={(e) => onBirthDateChange(e.target.value)}
          className="w-full rounded-xl border border-slate-600/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 shadow-sm outline-none ring-0 transition focus:border-purple-400 focus:ring-1 focus:ring-purple-400/60 dark:bg-slate-900/80"
        />
      </div>

      {/* Astro identity card */}
      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/90 px-3 py-3 shadow-md shadow-slate-950/40">
        {astro ? (
          <AstroIdentityContent astro={astro} birthTimeKnown={birthTimeKnown} />
        ) : (
          <p className="text-[11px] text-slate-500">
            Select your date of birth to see your Sun sign, Chinese animal,
            element, and Yin/Yang.
          </p>
        )}
      </div>
    </section>
  );
}

// --------- inner visual layout (inside the existing box) ----------

type AstroIdentityContentProps = {
  astro: AstroProfile;
  birthTimeKnown?: boolean;
};

function AstroIdentityContent({ astro, birthTimeKnown }: AstroIdentityContentProps) {
  const {
    sunSign,
    sunGlyph,
    sunElement,
    chineseAnimal,
    chineseAnimalEmoji,
    chineseElement,
    chineseYinYang,
  } = astro;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* top info row: label + birth-time badge */}
      <div className="flex w-full items-center justify-between gap-2">
        <div className="text-xs font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300">
          {sunSign} {chineseAnimal}
        </div>
        {birthTimeKnown !== undefined && (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-300">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {birthTimeKnown ? "Birth time saved" : "Birth time optional"}
          </span>
        )}
      </div>

      {/* icon row */}
      <div className="mt-1 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 text-2xl text-white">
          <span aria-hidden>{sunGlyph}</span>
        </div>

        <span className="text-lg text-slate-400">+</span>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100/90 text-2xl text-slate-900 dark:bg-slate-800/90 dark:text-slate-50">
          <span aria-hidden>{chineseAnimalEmoji}</span>
        </div>
      </div>

      {/* detail chips */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-[11px]">
        {/* Western chip */}
        <div className="inline-flex items-center gap-1 rounded-full bg-slate-100/85 px-2.5 py-1 text-slate-800 dark:bg-slate-800/90 dark:text-slate-100">
          <span className="text-sm">{sunGlyph}</span>
          <span className="font-medium">{sunSign}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            · {sunElement} sign
          </span>
        </div>

        {/* Chinese chip */}
        <div className="inline-flex items-center gap-1 rounded-full bg-slate-100/85 px-2.5 py-1 text-slate-800 dark:bg-slate-800/90 dark:text-slate-100">
          <span className="text-sm">{chineseAnimalEmoji}</span>
          <span className="font-medium">{chineseAnimal}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            · {chineseElement} · {chineseYinYang}
          </span>
        </div>
      </div>
    </div>
  );
}
















