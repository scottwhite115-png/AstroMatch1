"use client";

import React, { useMemo } from "react";
import { buildAstroProfileFromISO } from "@/lib/astro/birthProfile";
import type { AstroProfile } from "@/lib/astro/birthProfile";
import { useTheme } from "@/contexts/ThemeContext";
import { SectionHeader } from "@/components/profile/SectionHeader";

type BirthInformationSectionProps = {
  birthDateISO: string | null;                 // "1980-02-16"
  onBirthDateChange: (value: string) => void;  // called when user edits date
};

// Helper function to format date for display
function formatDisplayDate(isoDate: string): string {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

export function BirthInformationSection({
  birthDateISO,
  onBirthDateChange,
}: BirthInformationSectionProps) {
  const { theme } = useTheme();
  
  const astro = useMemo(() => {
    if (!birthDateISO) return null;
    return buildAstroProfileFromISO(birthDateISO);
  }, [birthDateISO]);

  return (
    <div className="mb-8">
      <SectionHeader
        label="Birth Information"
      />

      <div className="space-y-4">
        {/* Date input */}
        <div className="relative">
          <input
            type="date"
            value={birthDateISO ?? ""}
            onChange={(e) => onBirthDateChange(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            min="1940-01-01"
            className={`w-full px-4 py-3 rounded-xl focus:outline-none transition-all occupation-input ${theme === "starlight" ? "border border-white/20 bg-white/5 text-white placeholder-white/40" : theme === "light" ? "border border-gray-300 bg-white text-black placeholder-black/40" : "bg-slate-900/50 border border-indigo-400/20 !text-white/95 placeholder-white/40 focus:border-indigo-400/40"}`}
            style={{ fontSize: '1.25rem !important', color: 'transparent', WebkitTextFillColor: 'transparent' }}
            lang="en-US"
          />
          <div 
            className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none birthdate-display ${theme === "light" ? "text-black" : "text-white"}`}
            style={{ fontSize: '20px', zIndex: 1, fontWeight: 400, lineHeight: '1.5' }}
          >
            {birthDateISO ? formatDisplayDate(birthDateISO) : ''}
          </div>
        </div>

        {/* Astro identity card */}
        {astro ? (
          <div className={`rounded-2xl border p-3 ${theme === "light" ? "bg-gray-50 border-gray-200" : "border-slate-700/80 bg-slate-900/90"} shadow-md ${theme === "light" ? "shadow-gray-200/40" : "shadow-slate-950/40"}`}>
            <AstroIdentityContent astro={astro} theme={theme} />
          </div>
        ) : (
          <p className={`text-xs ${theme === "light" ? "text-gray-500" : "text-slate-500"}`}>
            Select your date of birth to see your Sun sign, Chinese animal,
            element, and Yin/Yang.
          </p>
        )}
      </div>
    </div>
  );
}

// --------- inner visual layout (inside the existing box) ----------

type AstroIdentityContentProps = {
  astro: AstroProfile;
  theme?: string;
};

function AstroIdentityContent({ astro, theme }: AstroIdentityContentProps) {
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
      {/* top info row: label */}
      <div className="flex w-full items-center justify-center gap-2">
        <div className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
          {sunSign} {chineseAnimal}
        </div>
      </div>

      {/* icon row */}
      <div className="mt-1 flex items-center gap-4">
        <div className="flex items-center justify-center text-4xl">
          <span aria-hidden>{sunGlyph}</span>
        </div>

        <span className={`text-lg ${theme === "light" ? "text-gray-400" : "text-slate-400"}`}>+</span>

        <div className="flex items-center justify-center text-4xl">
          <span aria-hidden>{chineseAnimalEmoji}</span>
        </div>
      </div>

      {/* detail chips */}
      <div className="mt-2 flex items-center justify-center gap-2 text-sm">
        {/* Western chip – text only */}
        <div className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 whitespace-nowrap ${theme === "light" ? "bg-gray-100 text-gray-800" : "bg-slate-800/90 text-slate-100"}`}>
          <span className="font-medium">{sunSign}</span>
          <span className={`text-xs ${theme === "light" ? "text-gray-500" : "text-slate-400"}`}>
            · {sunElement} sign
          </span>
        </div>

        {/* Chinese chip – text only */}
        <div className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 whitespace-nowrap ${theme === "light" ? "bg-gray-100 text-gray-800" : "bg-slate-800/90 text-slate-100"}`}>
          <span className="font-medium">{chineseAnimal}</span>
          <span className={`text-xs ${theme === "light" ? "text-gray-500" : "text-slate-400"}`}>
            · {chineseElement} · {chineseYinYang}
          </span>
        </div>
      </div>
    </div>
  );
}

