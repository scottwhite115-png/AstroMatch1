"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { COMMUNITY_TOPICS } from "./topics";
import { CommunityTabs } from "./_components/CommunityTabs";

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  
  // Show topic chips only for Stories & Q&A tab (not Live)
  const showTopicChips = !pathname.startsWith('/community/live');

  return (
    <div className={`min-h-screen ${
      theme === "light" ? "bg-white text-gray-900" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-slate-50"
    }`}>
      <div className="mx-auto max-w-4xl px-4 py-4">
        {/* AstroLounge Header */}
        <header className="mb-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1">
              <h1 className="font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent px-5 py-2.5">
                AstroLounge
              </h1>
              <p className={`text-xs ${
                theme === "light" ? "text-gray-600" : "text-slate-400"
              }`}>
                Stories, questions and live chats about your signs.
              </p>
            </div>

            {/* Theme Toggle Button - Top Right */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                theme === "light" 
                  ? "hover:bg-gray-100 text-gray-700" 
                  : "hover:bg-white/10 text-white"
              }`}
              aria-label="Toggle theme"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </button>
          </div>

          {/* Stories & Q&A | Live Tabs */}
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-transparent">
            <CommunityTabs />
          </div>
        </header>

        {/* Topic navigation chips - Only show for Stories & Q&A */}
        {showTopicChips && (
          <nav className="mb-3 flex gap-2 overflow-x-auto pb-1">
            {COMMUNITY_TOPICS.map((topic) => (
              <Link
                key={topic.id}
                href={`/community/${topic.id}`}
                className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  theme === "light"
                    ? "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    : "border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800/80"
                }`}
              >
                {topic.hashtag}
              </Link>
            ))}
          </nav>
        )}

        {children}
      </div>
    </div>
  );
}

