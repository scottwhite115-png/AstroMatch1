// app/demo/connection-box-updated/page.tsx
"use client";

import React from "react";
import { ConnectionBoxUpdated } from "@/components/ConnectionBoxUpdated";
import {
  calculateEnhancedMatch,
  normalizeChineseAnimal,
  type ChineseAnimal,
} from "@/lib/matchEngineEnhanced";
import { getWesternSignElement, type WesternSign } from "@/lib/matchEngine";

/**
 * Demo page showing the new ConnectionBoxUpdated component
 * with the enhanced base/overlay pattern system
 */
export default function ConnectionBoxUpdatedDemoPage() {
  const [theme, setTheme] = React.useState<"light" | "dark">("dark");

  // Example 1: Aquarius Monkey × Gemini Snake
  const example1 = calculateEnhancedMatch({
    pattern: "NO_PATTERN",
    chineseAnimalA: normalizeChineseAnimal("Monkey"),
    chineseAnimalB: normalizeChineseAnimal("Snake"),
    westernElementRelation: "SAME_ELEMENT", // Air × Air
    westernAspectRelation: "SOFT", // Trine aspect
    wuXingRelation: "OTHER",
    sameWesternSign: false,
  });

  // Example 2: Twin Flame Match (San He + Compatible Elements)
  const example2 = calculateEnhancedMatch({
    pattern: "SAN_HE",
    chineseAnimalA: normalizeChineseAnimal("Tiger"),
    chineseAnimalB: normalizeChineseAnimal("Horse"),
    westernElementRelation: "COMPATIBLE_ELEMENT",
    westernAspectRelation: "SOFT",
    wuXingRelation: "GENERATING",
    sameWesternSign: false,
  });

  // Example 3: Secret Friends (Liu He)
  const example3 = calculateEnhancedMatch({
    pattern: "LIU_HE",
    chineseAnimalA: normalizeChineseAnimal("Rat"),
    chineseAnimalB: normalizeChineseAnimal("Ox"),
    westernElementRelation: "COMPATIBLE_ELEMENT",
    westernAspectRelation: "NEUTRAL",
    wuXingRelation: "GENERATING",
    sameWesternSign: false,
  });

  // Example 4: Magnetic Opposites (Liu Chong)
  const example4 = calculateEnhancedMatch({
    pattern: "LIU_CHONG",
    chineseAnimalA: normalizeChineseAnimal("Rat"),
    chineseAnimalB: normalizeChineseAnimal("Horse"),
    westernElementRelation: "MISMATCH",
    westernAspectRelation: "OPPOSITION",
    wuXingRelation: "CONTROLLING",
    sameWesternSign: false,
  });

  // Example 5: Challenging Match (Liu Hai overlay)
  const example5 = calculateEnhancedMatch({
    pattern: "LIU_HAI",
    chineseAnimalA: normalizeChineseAnimal("Rat"),
    chineseAnimalB: normalizeChineseAnimal("Goat"),
    westernElementRelation: "MISMATCH",
    westernAspectRelation: "HARD",
    wuXingRelation: "CONTROLLING",
    sameWesternSign: false,
  });

  // Example 6: Neutral Match (No Pattern)
  const example6 = calculateEnhancedMatch({
    pattern: "NO_PATTERN",
    chineseAnimalA: normalizeChineseAnimal("Rabbit"),
    chineseAnimalB: normalizeChineseAnimal("Monkey"),
    westernElementRelation: "SEMI_COMPATIBLE",
    westernAspectRelation: "NEUTRAL",
    wuXingRelation: "OTHER",
    sameWesternSign: false,
  });

  return (
    <div className={`min-h-screen p-6 ${
      theme === "light" 
        ? "bg-gradient-to-br from-slate-50 via-white to-slate-100" 
        : "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
    }`}>
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Page Header with Theme Switcher */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className={`text-4xl font-bold ${
              theme === "light" ? "text-slate-900" : "text-slate-50"
            }`}>
              ConnectionBox Updated
            </h1>
            {/* Theme Switcher */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg ${
                theme === "light"
                  ? "bg-slate-800 text-white hover:bg-slate-700"
                  : "bg-white text-slate-900 hover:bg-slate-100"
              }`}
            >
              {theme === "light" ? (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                  <span>Light Mode</span>
                </>
              )}
            </button>
          </div>
          <p className={`text-lg ${
            theme === "light" ? "text-slate-600" : "text-slate-400"
          }`}>
            New design with base/overlay pattern system from ChatGPT
          </p>
        </div>

        {/* Example 1: Aquarius Monkey × Gemini Snake */}
        <div className="space-y-3">
          <h2 className={`text-2xl font-semibold ${
            theme === "light" ? "text-slate-800" : "text-slate-200"
          }`}>
            Example 1: Aquarius Monkey × Gemini Snake
          </h2>
          <p className={`text-sm ${
            theme === "light" ? "text-slate-600" : "text-slate-400"
          }`}>
            Air trine (Aquarius-Gemini) with neutral Chinese pattern
          </p>
          <ConnectionBoxUpdated
            userAName="Alex"
            userBName="Jamie"
            userASignLabel="Aquarius / Monkey"
            userBSignLabel="Gemini / Snake"
            userAWestIcon="♒️"
            userAChineseIcon="🐵"
            userBWestIcon="♊️"
            userBChineseIcon="🐍"
            score={example1.score}
            basePattern={example1.basePattern}
            overlays={example1.overlays}
            sanHeTrineName={example1.sanHeTrineName}
            isOppositeBranches={example1.isOppositeBranches}
            sameChineseAnimal={example1.sameChineseAnimal}
            sameWesternSign={false}
            elements={example1.westernElements}
            connectionOverviewText="A clever and communicative pairing! Both Air signs love intellectual stimulation, ideas, and social connection. The Monkey's quick wit and adaptability meshes well with the Snake's wisdom and strategic thinking. While there's no strong Chinese pattern, the Western trine creates natural harmony and understanding."
            aboutPartnerText="Jamie (Gemini Snake) is intellectually curious, charming, and perceptive. They combine the Snake's depth and intuition with Gemini's versatility and communication skills. Loves deep conversations, solving puzzles, and exploring new perspectives."
            theme={theme}
          />
        </div>

        {/* Example 2: Twin Flame Match */}
        <div className="space-y-3">
          <h2 className={`text-2xl font-semibold ${
            theme === "light" ? "text-slate-800" : "text-slate-200"
          }`}>
            Example 2: Twin Flame Match
          </h2>
          <p className={`text-sm ${
            theme === "light" ? "text-slate-600" : "text-slate-400"
          }`}>
            San He with compatible elements = intense high-growth energy
          </p>
          <ConnectionBoxUpdated
            userAName="Sam"
            userBName="Jordan"
            userASignLabel="Aries / Tiger"
            userBSignLabel="Sagittarius / Horse"
            userAWestIcon="♈️"
            userAChineseIcon="🐅"
            userBWestIcon="♐️"
            userBChineseIcon="🐴"
            score={example2.score}
            basePattern={example2.basePattern}
            overlays={example2.overlays}
            sanHeTrineName={example2.sanHeTrineName}
            isOppositeBranches={example2.isOppositeBranches}
            sameChineseAnimal={example2.sameChineseAnimal}
            elements={example2.westernElements}
            connectionOverviewText="A powerful twin flame connection with Adventurers trine energy. Fire signs amplify the adventurous spirit, creating a dynamic and passionate partnership full of growth and transformation."
            aboutPartnerText="Jordan is a free spirit who loves travel, philosophy, and pushing boundaries. They inspire everyone around them with their optimism and courage."
            theme={theme}
          />
        </div>

        {/* Example 3: Secret Friends */}
        <div className="space-y-3">
          <h2 className={`text-2xl font-semibold ${
            theme === "light" ? "text-slate-800" : "text-slate-200"
          }`}>
            Example 3: Secret Friends Match
          </h2>
          <p className={`text-sm ${
            theme === "light" ? "text-slate-600" : "text-slate-400"
          }`}>
            Liu He = quiet strength and steady loyalty
          </p>
          <ConnectionBoxUpdated
            userAName="Taylor"
            userBName="Morgan"
            userASignLabel="Capricorn / Rat"
            userBSignLabel="Capricorn / Ox"
            userAWestIcon="♑️"
            userAChineseIcon="🐀"
            userBWestIcon="♑️"
            userBChineseIcon="🐂"
            score={example3.score}
            basePattern={example3.basePattern}
            overlays={example3.overlays}
            isOppositeBranches={example3.isOppositeBranches}
            sameChineseAnimal={example3.sameChineseAnimal}
            sameWesternSign={true}
            elements={example3.westernElements}
            connectionOverviewText="A solid and dependable connection built on Liu He secret friends bond. This partnership offers safety, trust, and mutual support that deepens over time."
            aboutPartnerText="Morgan is practical, hardworking, and deeply loyal. They value stability and are always there when you need them most."
            theme={theme}
          />
        </div>

        {/* Example 4: Magnetic Opposites */}
        <div className="space-y-3">
          <h2 className={`text-2xl font-semibold ${
            theme === "light" ? "text-slate-800" : "text-slate-200"
          }`}>
            Example 4: Magnetic Opposites
          </h2>
          <p className={`text-sm ${
            theme === "light" ? "text-slate-600" : "text-slate-400"
          }`}>
            Liu Chong = strong attraction with tension
          </p>
          <ConnectionBoxUpdated
            userAName="Casey"
            userBName="Riley"
            userASignLabel="Cancer / Rat"
            userBSignLabel="Capricorn / Horse"
            userAWestIcon="♋️"
            userAChineseIcon="🐀"
            userBWestIcon="♑️"
            userBChineseIcon="🐴"
            score={example4.score}
            basePattern={example4.basePattern}
            overlays={example4.overlays}
            isOppositeBranches={example4.isOppositeBranches}
            sameChineseAnimal={example4.sameChineseAnimal}
            elements={example4.westernElements}
            connectionOverviewText="A magnetic opposites pairing with Liu Chong tension. This connection has intense chemistry but requires conscious effort to bridge different approaches and temperaments."
            aboutPartnerText="Riley is independent, ambitious, and loves freedom. They bring excitement and adventure but need space to pursue their own path."
            theme={theme}
          />
        </div>

        {/* Example 5: Challenging Match */}
        <div className="space-y-3">
          <h2 className={`text-2xl font-semibold ${
            theme === "light" ? "text-slate-800" : "text-slate-200"
          }`}>
            Example 5: Challenging Match
          </h2>
          <p className={`text-sm ${
            theme === "light" ? "text-slate-600" : "text-slate-400"
          }`}>
            Liu Hai = sensitive pattern requiring patience
          </p>
          <ConnectionBoxUpdated
            userAName="Avery"
            userBName="Quinn"
            userASignLabel="Virgo / Rat"
            userBSignLabel="Aries / Goat"
            userAWestIcon="♍️"
            userAChineseIcon="🐀"
            userBWestIcon="♈️"
            userBChineseIcon="🐐"
            score={example5.score}
            basePattern={example5.basePattern}
            overlays={example5.overlays}
            isOppositeBranches={example5.isOppositeBranches}
            sameChineseAnimal={example5.sameChineseAnimal}
            elements={example5.westernElements}
            connectionOverviewText="A challenging pattern with Liu Hai overlay. Small misunderstandings can escalate, so this match requires extra patience, clear communication, and mutual effort to maintain harmony."
            aboutPartnerText="Quinn is creative and sensitive, with strong emotional needs. They value artistic expression and need a partner who truly understands their inner world."
            theme={theme}
          />
        </div>

        {/* Example 6: Neutral Match */}
        <div className="space-y-3">
          <h2 className={`text-2xl font-semibold ${
            theme === "light" ? "text-slate-800" : "text-slate-200"
          }`}>
            Example 6: Neutral Match
          </h2>
          <p className={`text-sm ${
            theme === "light" ? "text-slate-600" : "text-slate-400"
          }`}>
            No pattern = flexible, depends on Western charts
          </p>
          <ConnectionBoxUpdated
            userAName="Jordan"
            userBName="Skylar"
            userASignLabel="Libra / Rabbit"
            userBSignLabel="Gemini / Monkey"
            userAWestIcon="♎️"
            userAChineseIcon="🐰"
            userBWestIcon="♊️"
            userBChineseIcon="🐵"
            score={example6.score}
            basePattern={example6.basePattern}
            overlays={example6.overlays}
            isOppositeBranches={example6.isOppositeBranches}
            sameChineseAnimal={example6.sameChineseAnimal}
            elements={example6.westernElements}
            connectionOverviewText="A neutral Chinese pattern that leaves room for Western astrology to shine. The Air element connection brings mental stimulation and easy communication to this flexible pairing."
            aboutPartnerText="Skylar is witty, curious, and intellectually engaging. They love good conversation and can adapt to almost any situation with charm and cleverness."
            theme={theme}
          />
        </div>

        {/* Documentation */}
        <div className={`space-y-4 pt-8 ${
          theme === "light" ? "border-slate-300" : "border-slate-700"
        } border-t`}>
          <h2 className={`text-2xl font-semibold ${
            theme === "light" ? "text-slate-800" : "text-slate-200"
          }`}>
            How to Use
          </h2>
          <div className={`rounded-xl p-6 space-y-4 ${
            theme === "light" ? "bg-slate-100" : "bg-slate-800"
          }`}>
            <div>
              <h3 className={`text-lg font-semibold mb-2 ${
                theme === "light" ? "text-slate-800" : "text-slate-200"
              }`}>
                1. Calculate Enhanced Match
              </h3>
              <pre className={`rounded p-4 text-sm overflow-x-auto ${
                theme === "light" 
                  ? "bg-slate-900 text-slate-100" 
                  : "bg-slate-950 text-slate-100"
              }`}>
{`import { calculateEnhancedMatch, normalizeChineseAnimal } from '@/lib/matchEngineEnhanced';

const result = calculateEnhancedMatch({
  pattern: "SAN_HE",
  chineseAnimalA: normalizeChineseAnimal("Rat"),
  chineseAnimalB: normalizeChineseAnimal("Dragon"),
  westernElementRelation: "SAME_ELEMENT",
  westernAspectRelation: "SOFT",
  wuXingRelation: "SAME",
  sameWesternSign: false,
});`}
              </pre>
            </div>
            
            <div>
              <h3 className={`text-lg font-semibold mb-2 ${
                theme === "light" ? "text-slate-800" : "text-slate-200"
              }`}>
                2. Use ConnectionBoxUpdated Component
              </h3>
              <pre className={`rounded p-4 text-sm overflow-x-auto ${
                theme === "light" 
                  ? "bg-slate-900 text-slate-100" 
                  : "bg-slate-950 text-slate-100"
              }`}>
{`<ConnectionBoxUpdated
  userAName="Alex"
  userBName="Jamie"
  userASignLabel="Aquarius / Rat"
  userBSignLabel="Aquarius / Dragon"
  userAWestIcon="♒️"
  userAChineseIcon="🐀"
  userBWestIcon="♒️"
  userBChineseIcon="🐉"
  score={result.score}
  basePattern={result.basePattern}
  overlays={result.overlays}
  sanHeTrineName={result.sanHeTrineName}
  isOppositeBranches={result.isOppositeBranches}
  sameChineseAnimal={result.sameChineseAnimal}
  elements={result.westernElements}
  connectionOverviewText="..."
  aboutPartnerText="..."
/>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}










