"use client";

import { useState } from "react";
import ProfilePhotoCarouselWithRanking from "@/components/ProfilePhotoCarouselWithRanking";
import { getMatchCard } from "@/lib/getMatchCard";
import type { West, East } from "@/lib/matchEngine";

const Sun = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const Moon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export default function CarouselDemo() {
  const [selectedMatch, setSelectedMatch] = useState<"soulmate" | "twin_flame" | "excellent" | "good">("soulmate");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [badgePosition, setBadgePosition] = useState<"top-right" | "overlay-bottom">("overlay-bottom");

  // Example photos
  const demoPhotos = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop",
  ];

  // Different match combinations to demo different ranks
  // Verified combinations that produce the exact ranks we want
  const matchExamples = {
    soulmate: { 
      aWest: "Aquarius" as West, aEast: "Monkey" as East, 
      bWest: "Gemini" as West, bEast: "Rat" as East 
    }, // Same trine (Visionaries) + Same element (Air) = 95-100
    twin_flame: { 
      aWest: "Aries" as West, aEast: "Tiger" as East, 
      bWest: "Leo" as West, bEast: "Horse" as East 
    }, // Same trine (Adventurers) + Compatible elements (Fire+Fire) = 85-94
    excellent: { 
      aWest: "Cancer" as West, aEast: "Rabbit" as East, 
      bWest: "Scorpio" as West, bEast: "Goat" as East 
    }, // Same element (Water) + Cross-trine = 70-84
    good: { 
      aWest: "Taurus" as West, aEast: "Ox" as East, 
      bWest: "Capricorn" as West, bEast: "Rooster" as East 
    }, // Same element (Earth) + Cross-trine = 55-69
  };

  const currentMatch = matchExamples[selectedMatch];
  const matchData = getMatchCard(currentMatch.aWest, currentMatch.aEast, currentMatch.bWest, currentMatch.bEast);

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-colors ${
      theme === "light" 
        ? "bg-gradient-to-b from-purple-50 to-white" 
        : "bg-gradient-to-b from-gray-900 to-black"
    }`}>
      <div className="max-w-md mx-auto">
        {/* Header with Theme Toggle */}
        <div className="flex items-center justify-between mb-2">
          <h1 className={`text-3xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
            Photo Carousel with Ranking
          </h1>
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className={`p-3 rounded-full transition-colors ${
              theme === "light"
                ? "bg-gray-100 hover:bg-gray-200 text-gray-900"
                : "bg-gray-800 hover:bg-gray-700 text-white"
            }`}
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>
        </div>
        
        <p className={`text-center mb-6 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
          Interactive demo of the new match engine display
        </p>

        {/* Match Type Selector */}
        <div className={`mb-6 rounded-2xl p-4 shadow-lg ${
          theme === "light" ? "bg-white" : "bg-gray-800"
        }`}>
          <label className={`block text-sm font-medium mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
            Select Match Type to Preview:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(matchExamples).map((matchType) => (
              <button
                key={matchType}
                onClick={() => setSelectedMatch(matchType as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedMatch === matchType
                    ? "bg-purple-500 text-white shadow-lg"
                    : theme === "light"
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {matchType.replace("_", " ").charAt(0).toUpperCase() + matchType.slice(1).replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Badge Position Selector */}
        <div className={`mb-6 rounded-2xl p-4 shadow-lg ${
          theme === "light" ? "bg-white" : "bg-gray-800"
        }`}>
          <label className={`block text-sm font-medium mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
            Badge Position:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setBadgePosition("overlay-bottom")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                badgePosition === "overlay-bottom"
                  ? "bg-purple-500 text-white shadow-lg"
                  : theme === "light"
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Under Name
            </button>
            <button
              onClick={() => setBadgePosition("top-right")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                badgePosition === "top-right"
                  ? "bg-purple-500 text-white shadow-lg"
                  : theme === "light"
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Top Right
            </button>
          </div>
        </div>

        {/* Carousel Component */}
        <ProfilePhotoCarouselWithRanking
          images={demoPhotos}
          profileName="Emma"
          profileAge={28}
          connectionBoxData={matchData}
          theme={theme}
          showDropdown={true}
          badgePosition={badgePosition}
          onPhotoChange={(index) => console.log("Photo changed to", index)}
        />

        {/* Info Panel */}
        <div className={`mt-6 rounded-2xl p-5 shadow-lg ${
          theme === "light" ? "bg-white" : "bg-gray-800"
        }`}>
          <h3 className={`text-lg font-semibold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
            Current Match Details
          </h3>
          <div className={`space-y-2 text-sm ${theme === "light" ? "text-gray-900" : "text-gray-300"}`}>
            <div className="flex justify-between">
              <span className={theme === "light" ? "text-gray-600" : "text-gray-400"}>Rank:</span>
              <span className="font-semibold">{matchData.rankLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className={theme === "light" ? "text-gray-600" : "text-gray-400"}>Score:</span>
              <span className="font-semibold" style={{ color: matchData.colorRgb }}>
                {matchData.score}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className={theme === "light" ? "text-gray-600" : "text-gray-400"}>Connection:</span>
              <span className="font-semibold">{matchData.connectionLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className={theme === "light" ? "text-gray-600" : "text-gray-400"}>Signs:</span>
              <span className="font-semibold">
                {currentMatch.aWest} {currentMatch.aEast} × {currentMatch.bWest} {currentMatch.bEast}
              </span>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className={`mt-6 rounded-2xl p-5 border ${
          theme === "light"
            ? "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200"
            : "bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-700/30"
        }`}>
          <h3 className={`text-lg font-semibold mb-3 ${
            theme === "light" ? "text-purple-900" : "text-purple-200"
          }`}>
            ✨ Features Included
          </h3>
          <ul className={`space-y-2 text-sm ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
            <li className="flex items-start gap-2">
              <span className="text-purple-500">•</span>
              <span>Ranking badge displayed on photo (top-right OR under name)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500">•</span>
              <span>Toggle between badge positions live</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500">•</span>
              <span>Click left/right to navigate photos</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500">•</span>
              <span>Photo position indicators at top</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500">•</span>
              <span>Expandable connection details dropdown</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500">•</span>
              <span>New match engine insights integration</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500">•</span>
              <span>Responsive design (mobile & desktop)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500">•</span>
              <span>Light & dark theme support</span>
            </li>
          </ul>
        </div>

        {/* Documentation Links */}
        <div className={`mt-6 text-center text-sm ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
          <p className="mb-2">📚 Check the documentation for customization options:</p>
          <div className="space-y-1">
            <div>
              <code className={`px-2 py-1 rounded text-xs ${
                theme === "light" ? "bg-gray-100" : "bg-gray-800"
              }`}>
                /docs/PHOTO_CAROUSEL_RANKING_STYLING.md
              </code>
            </div>
            <div>
              <code className={`px-2 py-1 rounded text-xs ${
                theme === "light" ? "bg-gray-100" : "bg-gray-800"
              }`}>
                /docs/PROFILE_VIEW_CAROUSEL_INTEGRATION.md
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

