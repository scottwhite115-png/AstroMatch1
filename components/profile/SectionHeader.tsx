"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface SectionHeaderProps {
  label: string;
  icon?: React.ReactNode; // you can pass an emoji or an SVG
}

export function SectionHeader({ label, icon }: SectionHeaderProps) {
  const { theme } = useTheme();
  
  return (
    <div className="mb-4 flex items-center gap-2">
      {/* Icon - no background, just the emoji/icon */}
      {icon && (
        <div className="flex items-center justify-center text-xl">
          {icon}
        </div>
      )}

      {/* Label - matching Account page style */}
      <h2 className="font-semibold text-base text-purple-600 dark:text-purple-400">
        {label}
      </h2>
    </div>
  );
}

