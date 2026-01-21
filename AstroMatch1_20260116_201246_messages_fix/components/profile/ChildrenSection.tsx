"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

type ChildrenValue = "I have children" | "I don't have children" | "";

interface ChildrenSectionProps {
  value: ChildrenValue;
  onChange: (value: ChildrenValue) => void;
}

export function ChildrenSection({ value, onChange }: ChildrenSectionProps) {
  const { theme } = useTheme();

  return (
    <section className="space-y-2">
      {/* Heading */}
      <div className="mb-4 flex items-center gap-2">
        <h2 className={`font-semibold text-base ${
          theme === "light"
            ? "text-purple-600"
            : "text-purple-400"
        }`}>
          Children
        </h2>
      </div>

      {/* Options – two buttons */}
      <div className="flex gap-2 text-xs">
        <button
          type="button"
          onClick={() => onChange("I have children")}
          className={`flex-1 rounded-xl border px-3 py-2 text-center transition-colors ${
            value === "I have children"
              ? theme === "light"
                ? "border-purple-500 bg-purple-500/20 text-gray-900"
                : "border-purple-400 bg-purple-500/10 text-slate-50"
              : theme === "light"
              ? "border-gray-300 bg-gray-50 text-gray-900 hover:bg-gray-100"
              : "border-slate-700 bg-slate-900/60 text-slate-300"
          }`}
        >
          I have children
        </button>
        <button
          type="button"
          onClick={() => onChange("I don't have children")}
          className={`flex-1 rounded-xl border px-3 py-2 text-center transition-colors ${
            value === "I don't have children"
              ? theme === "light"
                ? "border-purple-500 bg-purple-500/20 text-gray-900"
                : "border-purple-400 bg-purple-500/10 text-slate-50"
              : theme === "light"
              ? "border-gray-300 bg-gray-50 text-gray-900 hover:bg-gray-100"
              : "border-slate-700 bg-slate-900/60 text-slate-300"
          }`}
        >
          I don't have children
        </button>
      </div>
    </section>
  );
}

