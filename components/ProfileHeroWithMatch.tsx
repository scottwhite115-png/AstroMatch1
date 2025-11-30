"use client";

import { useMemo } from "react";
import { getMatchCard } from "@/lib/getMatchCard";

const WEST_GLYPH: Record<string, string> = {
  Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋",
  Leo: "♌", Virgo: "♍", Libra: "♎", Scorpio: "♏",
  Sagittarius: "♐", Capricorn: "♑", Aquarius: "♒", Pisces: "♓",
};
const EAST_GLYPH: Record<string, string> = {
  Rat: "🐀", Ox: "🐂", Tiger: "🐅", Rabbit: "🐇", Dragon: "🐉", Snake: "🐍",
  Horse: "🐎", Goat: "🐐", Monkey: "🐒", Rooster: "🐓", Dog: "🐕", Pig: "🐖",
};

type West =
  | "Aries" | "Taurus" | "Gemini" | "Cancer" | "Leo" | "Virgo"
  | "Libra" | "Scorpio" | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces";

type East =
  | "Rat" | "Ox" | "Tiger" | "Rabbit" | "Dragon" | "Snake"
  | "Horse" | "Goat" | "Monkey" | "Rooster" | "Dog" | "Pig";

export interface UserAstro {
  name: string;
  age: number;
  west: West;
  east: East;
}

export default function ProfileHeroWithMatch({
  images,
  profileUser,
  viewerUser,
}: {
  images: string[];
  profileUser: UserAstro;
  viewerUser: UserAstro;
}) {
  const match = useMemo(
    () => getMatchCard(viewerUser.west, viewerUser.east, profileUser.west, profileUser.east),
    [viewerUser, profileUser]
  );

  const rankStyle = { color: match.colorRgb };
  const pillClass =
    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border border-[color:var(--rank-border)]";
  const pillStyle = { ["--rank-border" as any]: match.colorRgb };

  return (
    <section className="w-full">
      {/* ---------- Photo Carousel + Overlay ---------- */}
      <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl bg-black">
        <div className="h-full w-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth">
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${profileUser.name} photo ${i + 1}`}
              className="h-full w-full object-cover flex-shrink-0 snap-center"
              draggable={false}
            />
          ))}
        </div>

        {/* Bottom-left overlay */}
        <div className="absolute left-0 bottom-0 w-full pointer-events-none">
          <div
            className="m-3 md:m-4 inline-flex flex-col gap-1 rounded-2xl p-3 md:p-4
                       backdrop-blur-sm pointer-events-auto
                       bg-white/80 text-gray-900
                       dark:bg-black/70 dark:text-white
                       border border-black/10 dark:border-white/10"
          >
            {/* Name + Age */}
            <div className="text-base md:text-lg font-semibold leading-tight">
              {profileUser.name}, {profileUser.age}
            </div>

            {/* Profile user's assigned signs */}
            <div className="text-sm md:text-[15px] opacity-90">
              {WEST_GLYPH[profileUser.west]} {profileUser.west} &nbsp;
              {EAST_GLYPH[profileUser.east]} {profileUser.east}
            </div>

            {/* Match rank between viewer & profile */}
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-xs uppercase tracking-wide opacity-80">Match</span>
              <span className="text-sm font-semibold" style={rankStyle}>
                {match.emoji} {match.rankLabel} • {match.score}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Connection Box (Dropdown) ---------- */}
      <div
        className="mt-4 rounded-2xl border
                   bg-white text-gray-900 border-gray-200
                   dark:bg-black dark:text-white dark:border-[#2e2e2e]"
      >
        <details className="group">
          <summary className="list-none cursor-pointer p-4 md:p-5 flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-sm uppercase tracking-wide opacity-70">Connection</span>
              <span className="text-lg md:text-xl font-semibold" style={rankStyle}>
                {match.connectionLabel}
              </span>
            </div>
            <span className={pillClass} style={pillStyle as any}>
              <span style={rankStyle}>{match.emoji}</span>
              <span className="leading-none" style={rankStyle}>
                {match.rankLabel}
              </span>
            </span>
          </summary>

          <div
            className="px-4 pb-4 md:px-5 md:pb-5 space-y-3 border-t
                       border-gray-200 dark:border-[#2e2e2e]"
          >
            <p className="text-sm md:text-[15px] opacity-90">{match.insight}</p>

            <div className="grid gap-3 md:gap-2">
              <div>
                <div className="text-sm md:text-[15px] font-medium">
                  {match.east_relation}
                </div>
                {match.east_description && (
                  <div className="text-sm opacity-90 mt-1 whitespace-pre-line">
                    {match.east_description}
                  </div>
                )}
                {!match.east_description && match.east_summary && (
                  <div className="text-sm opacity-90">{match.east_summary}</div>
                )}
              </div>
              <div>
                <div className="text-sm md:text-[15px] font-medium">
                  {match.west_relation}
                </div>
                <div className="text-sm opacity-90">{match.west_summary}</div>
              </div>
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}

