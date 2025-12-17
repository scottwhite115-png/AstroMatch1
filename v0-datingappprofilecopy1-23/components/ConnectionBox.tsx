// /components/ConnectionBox.tsx
"use client";

import { getMatchCard } from "@/lib/getMatchCard";

export default function ConnectionBox() {
  // Example: Aquarius Monkey × Gemini Rat
  const data = getMatchCard("Aquarius","Monkey","Gemini","Rat");

  return (
    <div className="rounded-2xl p-5 border bg-[#0a0a0a] text-white border-[#2e2e2e] shadow-[0_0_20px_rgba(168,85,247,0.2)]">
      <div className="text-xl font-semibold text-purple-400">
        {data.emoji} {data.rankLabel}
      </div>
      <div className="text-3xl font-bold" style={{ color: data.colorRgb }}>
        {data.score}%
      </div>

      <div className="text-lg mt-1">
        {/* Replace with your glyph map if you prefer */}
        ♒ {data.aWest} 🐒 {data.aEast} {" × "} ♊ {data.bWest} 🐀 {data.bEast}
      </div>

      <div className="text-lg font-semibold mt-3" style={{ color: data.colorRgb }}>
        {data.connectionLabel}
      </div>

      {/* Insight tone */}
      <p className="text-sm text-gray-300 mt-2">{data.insight}</p>

      {/* Astrology breakdown */}
      <div className="mt-3 text-sm text-gray-300">
        <div className="font-medium">{data.east_relation}</div>
        <div>{data.east_summary}</div>
      </div>
      <div className="mt-2 text-sm text-gray-300">
        <div className="font-medium">{data.west_relation}</div>
        <div>{data.west_summary}</div>
      </div>
    </div>
  );
}

