"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

type OrientationValue = "Men" | "Women" | "";

interface OrientationSectionProps {
  value: OrientationValue;
  onChange: (value: OrientationValue) => void;
}

export function OrientationSection({ value, onChange }: OrientationSectionProps) {
  const { theme } = useTheme();
  
  const icon = value === "Men" ? "👨🏽" : value === "Women" ? "👩🏽" : "🧑🏽"; // fallback / not chosen

  return (
    <section className="space-y-2">
      {/* Heading with dynamic icon */}
      <div className="mb-1 flex items-center gap-2">
        <div className="flex items-center justify-center text-xl">
          <span aria-hidden>{icon}</span>
        </div>
        <span className={`text-xs font-semibold uppercase tracking-[0.16em] ${theme === "light" ? "text-gray-800" : "text-slate-200"}`}>
          Orientation
        </span>
      </div>

      <p className={`text-xs mb-1 ${theme === "light" ? "text-gray-500" : "text-slate-400"}`}>
        Interested in
      </p>

      {/* Options – two buttons */}
      <div className="flex gap-2 text-xs">
        <button
          type="button"
          onClick={() => onChange("Men")}
          className={`flex-1 rounded-xl border px-3 py-2 text-center transition-colors ${
            value === "Men"
              ? theme === "light"
                ? "border-purple-500 bg-purple-500/20 text-gray-900"
                : "border-purple-400 bg-purple-500/10 text-slate-50"
              : theme === "light"
              ? "border-gray-300 bg-gray-50 text-gray-900 hover:bg-gray-100"
              : "border-slate-700 bg-slate-900/60 text-slate-300"
          }`}
        >
          Men
        </button>
        <button
          type="button"
          onClick={() => onChange("Women")}
          className={`flex-1 rounded-xl border px-3 py-2 text-center transition-colors ${
            value === "Women"
              ? theme === "light"
                ? "border-purple-500 bg-purple-500/20 text-gray-900"
                : "border-purple-400 bg-purple-500/10 text-slate-50"
              : theme === "light"
              ? "border-gray-300 bg-gray-50 text-gray-900 hover:bg-gray-100"
              : "border-slate-700 bg-slate-900/60 text-slate-300"
          }`}
        >
          Women
        </button>
      </div>
    </section>
  );
}

