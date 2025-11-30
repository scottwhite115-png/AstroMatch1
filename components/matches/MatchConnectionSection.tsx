"use client";

import React from "react";
import { ConnectionBox } from "@/components/ConnectionBox";

// Define MatchTier type locally since it's not exported from ConnectionBox
type MatchTier =
  | "Soulmate"
  | "Twin Flame"
  | "Excellent"
  | "Favourable"
  | "Neutral"
  | "Opposites Attract"
  | "Difficult";

// TODO: replace this stub with your real match data / engine output
const mockTier: MatchTier = "Opposites Attract";
const mockScore = 68;

const mockChineseLine =
  "Monkey × Goat — Cross trine, no classical San He / Liu He pattern: mixed tempo, chemistry depends on timing.";
const mockWesternLine =
  "Aquarius × Leo — Air fans Fire, lively and stimulating (opposites), high-voltage chemistry.";
const mockWuXingLine =
  "Metal Monkey × Water Goat — Elemental harmony: Supportive (Metal generates Water).";
const mockBlurb =
  "High-voltage chemistry with very different instincts. Great when you're both playful and self-aware; tricky if pride or moodiness take over.";

export function MatchConnectionSection() {
  return (
    <section className="w-full flex justify-center px-4 py-4">
      <ConnectionBox
        tier={mockTier}
        score={mockScore}
        westA="Aquarius"
        eastA="Monkey"
        westB="Leo"
        eastB="Goat"
        chineseLine={mockChineseLine}
        westernLine={mockWesternLine}
        wuXingLine={mockWuXingLine}
        connectionBlurb={mockBlurb}
      />
    </section>
  );
}
















