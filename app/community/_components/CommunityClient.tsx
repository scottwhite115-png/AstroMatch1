"use client";

import { useMemo, useState, useCallback } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { NewPostButton } from "./NewPostButton";
import { PostList } from "./PostList";

// Four-pointed star icon for Astromatch logo
const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
);

type TopicId =
  | "sun_signs"
  | "chinese_zodiac"
  | "vedic"
  | "relationship"
  | "qa";

type Topic = {
  id: TopicId;
  label: string;
  description: string;
  icon: string;
};

const TOPICS: Topic[] = [
  {
    id: "relationship",
    label: "Relationship",
    description:
      "Synastry, East × West patterns and how connections feel in real life.",
    icon: "❌",
  },
  {
    id: "sun_signs",
    label: "Tropical Sun Signs",
    description: "Posts about Western Sun signs, elements and aspects.",
    icon: "☀️",
  },
  {
    id: "chinese_zodiac",
    label: "Chinese Zodiac",
    description: "Animals, trines, San He / Liu He, elements and years.",
    icon: "🐉",
  },
  {
    id: "vedic",
    label: "Vedic Astrology",
    description: "Moon signs, dashas and Jyotiṣa techniques.",
    icon: "🕉️",
  },
  {
    id: "qa",
    label: "Questions & Answers",
    description: "Ask and answer specific astrology questions.",
    icon: "❓",
  },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={`flex items-center justify-center w-9 h-9 rounded-full transition-all ${
        theme === "light"
          ? "bg-transparent hover:bg-slate-100 text-slate-700"
          : "bg-transparent hover:bg-slate-800/50 text-yellow-300"
      }`}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )}
    </button>
  );
}

export function CommunityClient({ initialTopic = "relationship" }: { initialTopic?: TopicId }) {
  const { theme } = useTheme();
  const [activeTopicId, setActiveTopicId] = useState<TopicId>(initialTopic);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const activeTopic =
    TOPICS.find((topic) => topic.id === activeTopicId) ?? TOPICS[0];

  const handlePostCreated = useCallback(() => {
    // This will trigger a refresh via router.refresh() in NewPostButton
  }, []);

  return (
    <div className={`flex h-full min-h-screen flex-col ${
      theme === "light"
        ? "bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50"
        : "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
    }`}>
      {/* Astromatch Logo - Top Left Corner */}
      <div className="absolute top-2 left-4 z-50 flex items-center gap-0.5">
        <FourPointedStar className="w-4 h-4 text-orange-500" />
        <span className="font-bold text-base bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
          AstroMatch
        </span>
      </div>

      {/* Top bar */}
      <header className={`sticky top-0 z-50 flex items-center justify-between border-b px-4 py-3 ${
        theme === "light"
          ? "bg-white/80 backdrop-blur-sm border-gray-200"
          : "bg-slate-900/80 backdrop-blur-sm border-slate-800"
      }`}>
        <div className="flex items-center gap-2">
          {/* Menu icon to toggle drawer */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
              theme === "light"
                ? "border-gray-200 hover:bg-gray-100"
                : "border-slate-700 hover:bg-slate-800"
            }`}
            aria-label={isDrawerOpen ? "Close topics" : "Open topics"}
          >
            {/* List icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={theme === "light" ? "text-gray-700" : "text-slate-300"}
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>

          <div className="flex items-center gap-0.5">
            <FourPointedStar className="w-4 h-4 text-orange-500" />
            <span className="font-bold text-base bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Community
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NewPostButton 
            topic={activeTopicId} 
            topicLabel={activeTopic.label}
            onPostCreated={handlePostCreated}
          />
          <ThemeToggle />
        </div>
      </header>

      {/* Left slide-in drawer */}
      {isDrawerOpen && (
        <>
          {/* Backdrop overlay - click to close drawer */}
          <div 
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Close drawer"
          />
          
          {/* Drawer panel */}
          <aside 
            className={`fixed left-0 bottom-0 z-50 w-72 max-w-[80vw] shadow-xl border-r flex flex-col ${
              theme === "light"
                ? "bg-white border-gray-200"
                : "bg-slate-900 border-slate-800"
            }`}
            style={{ top: 'var(--header-height, 60px)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
              {TOPICS.map((topic) => {
                const isActive = topic.id === activeTopicId;
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => {
                      setActiveTopicId(topic.id);
                      setIsDrawerOpen(false);
                    }}
                    className={[
                      "flex w-full items-start gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
                      isActive
                        ? theme === "light"
                          ? "bg-blue-100 text-blue-900"
                          : "bg-blue-900/40 text-blue-300"
                        : theme === "light"
                        ? "text-gray-600 hover:bg-gray-100"
                        : "text-slate-400 hover:bg-slate-800",
                    ].join(" ")}
                  >
                    <span className="mt-[1px] text-base">{topic.icon}</span>
                    <span className="flex flex-col">
                      <span className="font-medium">{topic.label}</span>
                      <span className={`text-xs ${
                        theme === "light" ? "text-gray-500" : "text-slate-500"
                      }`}>
                        {topic.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </nav>
          </aside>
        </>
      )}

      {/* Main content */}
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-4 pb-24">
        {/* Topic heading */}
        <section className="mb-3 space-y-1">
          <h1 className={`text-lg font-semibold flex items-center gap-2 ${
            theme === "light" ? "text-gray-900" : "text-white"
          }`}>
            <span>{activeTopic.icon}</span>
            <span>{activeTopic.label}</span>
          </h1>
          <p className={`text-sm ${
            theme === "light" ? "text-gray-600" : "text-slate-400"
          }`}>
            {activeTopic.description}
          </p>
        </section>

        {/* Posts feed - Server component will be rendered here */}
        <section className="space-y-3">
          <PostList topic={activeTopicId} />
        </section>
      </main>
    </div>
  );
}

