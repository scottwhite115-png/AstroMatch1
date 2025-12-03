// components/astrolab/VedicSection.tsx

'use client';

import { useState } from 'react';
import { VEDIC_CARDS, VedicCard } from '@/src/lib/astrolab/vedicContent';
import ReactMarkdown from 'react-markdown';

interface VedicSectionProps {
  theme: 'light' | 'dark';
}

// Match engine color scheme - permanent colors for each card
const cardColors = {
  'vedic-101': {
    light: { bg: 'bg-purple-50', bgInactive: 'bg-white', border: 'border-purple-400', text: 'text-purple-900', textInactive: 'text-gray-700' },
    dark: { bg: 'bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20', bgInactive: 'bg-slate-900/60', border: 'border-purple-400', text: 'text-purple-100', textInactive: 'text-slate-200' },
  },
  'vedic-big-three': {
    light: { bg: 'bg-amber-50', bgInactive: 'bg-white', border: 'border-amber-400', text: 'text-amber-900', textInactive: 'text-gray-700' },
    dark: { bg: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20', bgInactive: 'bg-slate-900/60', border: 'border-amber-400', text: 'text-amber-100', textInactive: 'text-slate-200' },
  },
  'vedic-love-compatibility': {
    light: { bg: 'bg-pink-50', bgInactive: 'bg-white', border: 'border-pink-400', text: 'text-pink-900', textInactive: 'text-gray-700' },
    dark: { bg: 'bg-gradient-to-r from-pink-500/20 to-rose-500/20', bgInactive: 'bg-slate-900/60', border: 'border-pink-400', text: 'text-pink-100', textInactive: 'text-slate-200' },
  },
  'vedic-timing-mahadashas': {
    light: { bg: 'bg-cyan-50', bgInactive: 'bg-white', border: 'border-cyan-400', text: 'text-cyan-900', textInactive: 'text-gray-700' },
    dark: { bg: 'bg-gradient-to-r from-cyan-500/20 to-sky-500/20', bgInactive: 'bg-slate-900/60', border: 'border-cyan-400', text: 'text-cyan-100', textInactive: 'text-slate-200' },
  },
};

export function VedicSection({ theme }: VedicSectionProps) {
  const [activeId, setActiveId] = useState<VedicCard['id']>('vedic-101');

  const activeCard =
    VEDIC_CARDS.find((card) => card.id === activeId) ?? VEDIC_CARDS[0];

  const activeColor = cardColors[activeId][theme];

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      {/* Left: card list */}
      <aside className="md:w-64 md:flex-shrink-0">
        <h2 className={`mb-3 text-sm font-semibold uppercase tracking-wide ${theme === "light" ? "text-gray-600" : "text-slate-400"}`}>
          Topics
        </h2>
        <div className="flex flex-col gap-2">
          {VEDIC_CARDS.map((card) => {
            const isActive = card.id === activeId;
            const colors = cardColors[card.id][theme];

            return (
              <button
                key={card.id}
                onClick={() => setActiveId(card.id)}
                className={`rounded-xl px-4 py-3 text-left text-sm transition border-2 ${colors.border} ${
                  isActive
                    ? `${colors.bg} ${colors.text}`
                    : `${colors.bgInactive} ${colors.textInactive} hover:${colors.bg}`
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{card.title}</span>
                  {card.comingSoon && (
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      theme === "light" ? "bg-gray-200 text-gray-600" : "bg-slate-800 text-slate-300"
                    }`}>
                      Soon
                    </span>
                  )}
                </div>
                <p className={`mt-1 text-xs ${
                  isActive
                    ? theme === "light" ? "text-gray-600" : "text-slate-300"
                    : theme === "light" ? "text-gray-500" : "text-slate-400"
                }`}>
                  {card.subtitle}
                </p>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Right: active content */}
      <section className={`flex-1 rounded-2xl p-6 border-2 ${activeColor.border} ${
        theme === "light"
          ? "bg-white"
          : "bg-slate-900/60"
      }`}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className={`text-xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
              {activeCard.title}
            </h3>
            <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-slate-400"}`}>
              {activeCard.subtitle}
            </p>
          </div>
          {activeCard.comingSoon && (
            <span className={`rounded-full px-3 py-1 text-xs font-medium border-2 ${activeColor.border} ${
              theme === "light"
                ? `${activeColor.bg} ${activeColor.text}`
                : `bg-transparent ${activeColor.text}`
            }`}>
              Preview Feature
            </span>
          )}
        </div>

        <div className={`mb-4 h-px w-full bg-gradient-to-r ${
          theme === "light"
            ? "from-transparent via-gray-300 to-transparent"
            : "from-transparent via-slate-600 to-transparent"
        }`} />

        <article className={`prose max-w-none ${
          theme === "light"
            ? "prose-gray prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-li:text-gray-700 prose-li:marker:text-gray-500"
            : "prose-invert prose-headings:text-slate-50 prose-p:text-slate-300 prose-strong:text-slate-50 prose-li:text-slate-300 prose-li:marker:text-slate-500"
        }`}>
          <ReactMarkdown>{activeCard.body}</ReactMarkdown>
        </article>
      </section>
    </div>
  );
}
