"use client";

import React, { useState, useMemo } from "react";
import { ChineseAnimal } from "@/lib/matchEngine";
import {
  detectBasePattern,
  detectOverlayPatterns,
  ChineseBasePattern,
  ChineseOverlayPattern,
  SanHeTrineName,
} from "@/lib/matchEngineEnhanced";

// All 12 Chinese animals
const ALL_ANIMALS: ChineseAnimal[] = [
  "Rat",
  "Ox",
  "Tiger",
  "Rabbit",
  "Dragon",
  "Snake",
  "Horse",
  "Goat",
  "Monkey",
  "Rooster",
  "Dog",
  "Pig",
];

// Animal emojis
const ANIMAL_EMOJIS: Record<ChineseAnimal, string> = {
  Rat: "🐀",
  Ox: "🐂",
  Tiger: "🐅",
  Rabbit: "🐇",
  Dragon: "🐉",
  Snake: "🐍",
  Horse: "🐴",
  Goat: "🐐",
  Monkey: "🐵",
  Rooster: "🐓",
  Dog: "🐕",
  Pig: "🐖",
};

// Pattern colors and labels
const BASE_PATTERN_INFO: Record<ChineseBasePattern, { label: string; emoji: string; color: string; bgColor: string }> = {
  SAN_HE: { label: "San He", emoji: "🌟", color: "text-yellow-600", bgColor: "bg-yellow-50 border-yellow-200" },
  LIU_HE: { label: "Liu He", emoji: "💫", color: "text-purple-600", bgColor: "bg-purple-50 border-purple-200" },
  SAME_SIGN: { label: "Same Sign", emoji: "🪞", color: "text-teal-600", bgColor: "bg-teal-50 border-teal-200" },
  NO_PATTERN: { label: "Neutral", emoji: "◽", color: "text-gray-600", bgColor: "bg-gray-50 border-gray-200" },
};

const OVERLAY_PATTERN_INFO: Record<ChineseOverlayPattern, { label: string; emoji: string; color: string }> = {
  LIU_CHONG: { label: "Liu Chong", emoji: "⚠️", color: "text-orange-600" },
  LIU_HAI: { label: "Liu Hai", emoji: "💔", color: "text-rose-600" },
  XING: { label: "Xing", emoji: "🔥", color: "text-red-600" },
  PO: { label: "Po", emoji: "💥", color: "text-red-700" },
};

// San He trine names
const SAN_HE_GROUPS: Record<SanHeTrineName, ChineseAnimal[]> = {
  Visionaries: ["Rat", "Dragon", "Monkey"],
  Strategists: ["Ox", "Snake", "Rooster"],
  Adventurers: ["Tiger", "Horse", "Dog"],
  Artists: ["Rabbit", "Goat", "Pig"],
};

function getSanHeTrine(a: ChineseAnimal, b: ChineseAnimal): SanHeTrineName | null {
  for (const [name, group] of Object.entries(SAN_HE_GROUPS)) {
    if (group.includes(a) && group.includes(b)) {
      return name as SanHeTrineName;
    }
  }
  return null;
}

interface PatternResult {
  animalA: ChineseAnimal;
  animalB: ChineseAnimal;
  basePattern: ChineseBasePattern;
  sanHeTrineName?: SanHeTrineName;
  overlays: ChineseOverlayPattern[];
}

export default function ChinesePatternsPage() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [selectedAnimal, setSelectedAnimal] = useState<ChineseAnimal | null>(null);
  const [filterPattern, setFilterPattern] = useState<ChineseBasePattern | "ALL">("ALL");

  // Calculate all combinations (memoized to prevent recalculation on every render)
  const allCombinations = useMemo(() => {
    const combinations: PatternResult[] = [];
    for (const animalA of ALL_ANIMALS) {
      for (const animalB of ALL_ANIMALS) {
        try {
          const { basePattern, sanHeTrineName } = detectBasePattern(animalA, animalB);
          const overlays = detectOverlayPatterns(animalA, animalB);
          
          combinations.push({
            animalA,
            animalB,
            basePattern,
            sanHeTrineName,
            overlays,
          });
        } catch (error) {
          console.error(`Error calculating pattern for ${animalA} × ${animalB}:`, error);
        }
      }
    }
    return combinations;
  }, []);

  // Filter combinations (memoized)
  const filteredCombinations = useMemo(() => {
    if (selectedAnimal) {
      return allCombinations.filter(
        (combo) =>
          (combo.animalA === selectedAnimal || combo.animalB === selectedAnimal) &&
          (filterPattern === "ALL" || combo.basePattern === filterPattern)
      );
    }
    return allCombinations.filter(
      (combo) => filterPattern === "ALL" || combo.basePattern === filterPattern
    );
  }, [allCombinations, selectedAnimal, filterPattern]);

  // Count statistics (memoized)
  const stats = useMemo(() => ({
    sanHe: allCombinations.filter((c) => c.basePattern === "SAN_HE").length,
    liuHe: allCombinations.filter((c) => c.basePattern === "LIU_HE").length,
    sameSign: allCombinations.filter((c) => c.basePattern === "SAME_SIGN").length,
    noPattern: allCombinations.filter((c) => c.basePattern === "NO_PATTERN").length,
    liuChong: allCombinations.filter((c) => c.overlays.includes("LIU_CHONG")).length,
    liuHai: allCombinations.filter((c) => c.overlays.includes("LIU_HAI")).length,
    xing: allCombinations.filter((c) => c.overlays.includes("XING")).length,
    po: allCombinations.filter((c) => c.overlays.includes("PO")).length,
  }), [allCombinations]);

  // Safety check
  if (!allCombinations || allCombinations.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading patterns...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "light" ? "bg-gray-50 text-gray-900" : "bg-slate-950 text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              Chinese Zodiac Pattern Reference
            </h1>
            <p
              className={`text-xs sm:text-sm ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              All 144 combinations (12 animals × 12 animals) with base patterns and overlays
            </p>
          </div>
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              theme === "light"
                ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                : "bg-slate-800 hover:bg-slate-700 text-white"
            }`}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
          <div
            className={`p-3 sm:p-4 rounded-xl border ${
              theme === "light"
                ? "bg-yellow-50 border-yellow-200"
                : "bg-yellow-950/20 border-yellow-800/30"
            }`}
          >
            <div className="text-xl sm:text-2xl mb-1">🌟</div>
            <div className="text-xl sm:text-2xl font-bold">{stats.sanHe}</div>
            <div className="text-xs sm:text-sm opacity-80">San He (Triple Harmony)</div>
          </div>
          <div
            className={`p-3 sm:p-4 rounded-xl border ${
              theme === "light"
                ? "bg-purple-50 border-purple-200"
                : "bg-purple-950/20 border-purple-800/30"
            }`}
          >
            <div className="text-xl sm:text-2xl mb-1">💫</div>
            <div className="text-xl sm:text-2xl font-bold">{stats.liuHe}</div>
            <div className="text-xs sm:text-sm opacity-80">Liu He (Six Harmoniess)</div>
          </div>
          <div
            className={`p-3 sm:p-4 rounded-xl border ${
              theme === "light"
                ? "bg-teal-50 border-teal-200"
                : "bg-teal-950/20 border-teal-800/30"
            }`}
          >
            <div className="text-xl sm:text-2xl mb-1">🪞</div>
            <div className="text-xl sm:text-2xl font-bold">{stats.sameSign}</div>
            <div className="text-xs sm:text-sm opacity-80">Same Sign</div>
          </div>
          <div
            className={`p-3 sm:p-4 rounded-xl border ${
              theme === "light"
                ? "bg-gray-50 border-gray-200"
                : "bg-gray-950/20 border-gray-800/30"
            }`}
          >
            <div className="text-xl sm:text-2xl mb-1">◽</div>
            <div className="text-xl sm:text-2xl font-bold">{stats.noPattern}</div>
            <div className="text-xs sm:text-sm opacity-80">Neutral</div>
          </div>
        </div>

        {/* Overlay Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
          <div
            className={`p-3 sm:p-4 rounded-xl border ${
              theme === "light"
                ? "bg-orange-50 border-orange-200"
                : "bg-orange-950/20 border-orange-800/30"
            }`}
          >
            <div className="text-xl sm:text-2xl mb-1">⚠️</div>
            <div className="text-xl sm:text-2xl font-bold">{stats.liuChong}</div>
            <div className="text-xs sm:text-sm opacity-80">Liu Chong (Conflicts)</div>
          </div>
          <div
            className={`p-3 sm:p-4 rounded-xl border ${
              theme === "light"
                ? "bg-rose-50 border-rose-200"
                : "bg-rose-950/20 border-rose-800/30"
            }`}
          >
            <div className="text-xl sm:text-2xl mb-1">💔</div>
            <div className="text-xl sm:text-2xl font-bold">{stats.liuHai}</div>
            <div className="text-xs sm:text-sm opacity-80">Liu Hai (Harms)</div>
          </div>
          <div
            className={`p-3 sm:p-4 rounded-xl border ${
              theme === "light"
                ? "bg-red-50 border-red-200"
                : "bg-red-950/20 border-red-800/30"
            }`}
          >
            <div className="text-xl sm:text-2xl mb-1">🔥</div>
            <div className="text-xl sm:text-2xl font-bold">{stats.xing}</div>
            <div className="text-xs sm:text-sm opacity-80">Xing (Punishment)</div>
          </div>
          <div
            className={`p-3 sm:p-4 rounded-xl border ${
              theme === "light"
                ? "bg-red-50 border-red-200"
                : "bg-red-950/20 border-red-800/30"
            }`}
          >
            <div className="text-xl sm:text-2xl mb-1">💥</div>
            <div className="text-xl sm:text-2xl font-bold">{stats.po}</div>
            <div className="text-xs sm:text-sm opacity-80">Po (Break)</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          {/* Animal Filter */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "light" ? "text-gray-700" : "text-gray-300"
              }`}
            >
              Filter by Animal:
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedAnimal(null)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  selectedAnimal === null
                    ? "bg-blue-500 text-white"
                    : theme === "light"
                    ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    : "bg-slate-800 hover:bg-slate-700 text-white"
                }`}
              >
                All Animals
              </button>
              {ALL_ANIMALS.map((animal) => (
                <button
                  key={animal}
                  onClick={() => setSelectedAnimal(animal)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    selectedAnimal === animal
                      ? "bg-blue-500 text-white"
                      : theme === "light"
                      ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                      : "bg-slate-800 hover:bg-slate-700 text-white"
                  }`}
                >
                  {ANIMAL_EMOJIS[animal]} {animal}
                </button>
              ))}
            </div>
          </div>

          {/* Pattern Filter */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "light" ? "text-gray-700" : "text-gray-300"
              }`}
            >
              Filter by Base Pattern:
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterPattern("ALL")}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  filterPattern === "ALL"
                    ? "bg-blue-500 text-white"
                    : theme === "light"
                    ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    : "bg-slate-800 hover:bg-slate-700 text-white"
                }`}
              >
                All Patterns
              </button>
              {Object.entries(BASE_PATTERN_INFO).map(([pattern, info]) => (
                <button
                  key={pattern}
                  onClick={() => setFilterPattern(pattern as ChineseBasePattern)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    filterPattern === pattern
                      ? "bg-blue-500 text-white"
                      : theme === "light"
                      ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                      : "bg-slate-800 hover:bg-slate-700 text-white"
                  }`}
                >
                  {info.emoji} {info.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div
          className={`mb-4 text-sm ${
            theme === "light" ? "text-gray-600" : "text-gray-400"
          }`}
        >
          Showing {filteredCombinations.length} of {allCombinations.length} combinations
        </div>

        {/* Combinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCombinations.map((combo, idx) => {
            const baseInfo = BASE_PATTERN_INFO[combo.basePattern];
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${
                  theme === "light"
                    ? baseInfo.bgColor
                    : `bg-slate-900/50 border-slate-700`
                }`}
              >
                {/* Animals */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{ANIMAL_EMOJIS[combo.animalA]}</span>
                    <span className="font-semibold">{combo.animalA}</span>
                  </div>
                  <span className="text-pink-500">♥</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{combo.animalB}</span>
                    <span className="text-2xl">{ANIMAL_EMOJIS[combo.animalB]}</span>
                  </div>
                </div>

                {/* Base Pattern */}
                <div className="mb-2">
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      theme === "light"
                        ? `${baseInfo.color} bg-white border`
                        : `${baseInfo.color.replace("600", "400")} bg-slate-800 border border-slate-600`
                    }`}
                  >
                    <span>{baseInfo.emoji}</span>
                    <span>{baseInfo.label}</span>
                    {combo.sanHeTrineName && (
                      <span className="opacity-80">· {combo.sanHeTrineName}</span>
                    )}
                  </div>
                </div>

                {/* Overlays */}
                {combo.overlays.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {combo.overlays.map((overlay) => {
                      const overlayInfo = OVERLAY_PATTERN_INFO[overlay];
                      return (
                        <div
                          key={overlay}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            theme === "light"
                              ? `${overlayInfo.color} bg-white border`
                              : `${overlayInfo.color.replace("600", "400")} bg-slate-800 border border-slate-600`
                          }`}
                        >
                          <span>{overlayInfo.emoji}</span>
                          <span>{overlayInfo.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}










