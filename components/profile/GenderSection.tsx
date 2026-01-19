"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

type GenderValue = "man" | "woman" | "other" | "";

interface GenderSectionProps {
  value: GenderValue;
  onChange: (value: GenderValue) => void;
}

export function GenderSection({ value, onChange }: GenderSectionProps) {
  const { theme } = useTheme();

  return (
    <section className="space-y-4">
      {/* Heading */}
      <div className="mb-4 flex items-center gap-2">
        <h2 className={`font-semibold text-base ${
          theme === "light"
            ? "text-purple-600"
            : "text-purple-400"
        }`}>
          Gender
        </h2>
      </div>

      {/* Options – two buttons only */}
      <div className="flex gap-2 text-xs">
        <button
          type="button"
          onClick={() => onChange("man")}
          className={`flex-1 rounded-xl border px-3 py-2 text-center transition-colors ${
            value === "man"
              ? theme === "light"
                ? "border-purple-500 bg-purple-500/20 text-gray-900"
                : "border-purple-400 bg-purple-500/10 text-slate-50"
              : theme === "light"
              ? "border-gray-300 bg-gray-50 text-gray-900 hover:bg-gray-100"
              : "border-slate-700 bg-slate-900/60 text-slate-300"
          }`}
        >
          Man
        </button>
        <button
          type="button"
          onClick={() => onChange("woman")}
          className={`flex-1 rounded-xl border px-3 py-2 text-center transition-colors ${
            value === "woman"
              ? theme === "light"
                ? "border-purple-500 bg-purple-500/20 text-gray-900"
                : "border-purple-400 bg-purple-500/10 text-slate-50"
              : theme === "light"
              ? "border-gray-300 bg-gray-50 text-gray-900 hover:bg-gray-100"
              : "border-slate-700 bg-slate-900/60 text-slate-300"
          }`}
        >
          Woman
        </button>
      </div>
    </section>
  );
}

