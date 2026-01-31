"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

type GenderValue = "man" | "woman" | "non-binary" | "prefer not to say" | "";

interface GenderSectionProps {
  value: GenderValue;
  onChange: (value: GenderValue) => void;
}

export function GenderSection({ value, onChange }: GenderSectionProps) {
  const { theme } = useTheme();

  const options: { value: GenderValue; label: string }[] = [
    { value: "man", label: "Man" },
    { value: "woman", label: "Woman" },
    { value: "non-binary", label: "Non-binary" },
    { value: "prefer not to say", label: "Prefer not to say" }
  ];

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

      {/* Options – four buttons in a grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-xl border px-3 py-2 text-center transition-colors ${
              value === option.value
                ? theme === "light"
                  ? "border-purple-500 bg-purple-500/20 text-gray-900"
                  : "border-purple-400 bg-purple-500/10 text-slate-50"
                : theme === "light"
                ? "border-gray-300 bg-gray-50 text-gray-900 hover:bg-gray-100"
                : "border-slate-700 bg-slate-900/60 text-slate-300"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
}

