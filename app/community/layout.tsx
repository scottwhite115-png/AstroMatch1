"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { COMMUNITY_TOPICS } from "./topics";
import { CommunityTabs } from "./_components/CommunityTabs";
import { NewPostButton } from "./_components/NewPostButton";

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  
  // Show topic chips only for Stories & Q&A tab (not Live)
  const showTopicChips = !pathname.startsWith('/community/live');
  
  // Determine current topic from pathname
  const currentTopic = pathname.startsWith('/community/') 
    ? pathname.split('/')[2] || 'general-astrology'
    : 'general-astrology';

  return (
    <div className={`min-h-screen ${
      theme === "light" ? "bg-white text-gray-900" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-slate-50"
    }`}>
      <div className="mx-auto max-w-4xl">
        {/* AstroLounge Header */}
        <header className="mb-4">
          <div className="px-3 pt-2 pb-1 flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              <FourPointedStar className="w-4 h-4 text-orange-500" />
              <span className="font-bold text-base bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                AstroLounge
              </span>
            </div>

            {/* Theme Toggle Button - Top Right */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className={`p-2 rounded-lg transition-colors ${theme === "light" ? "hover:bg-gray-100" : "hover:bg-white/10"}`}
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
          
          <p className={`text-sm px-5 ${
            theme === "light" ? "text-gray-600" : "text-slate-400"
          }`}>
            Stories, questions and live chats about your signs.
          </p>

          {/* Stories & Q&A | Live Tabs with New Post Button */}
          <div className="flex items-center justify-between gap-4">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-transparent">
              <CommunityTabs />
            </div>
            {showTopicChips && (
              <div className="mr-3">
                <NewPostButton topic={currentTopic} />
              </div>
            )}
          </div>
        </header>

        {/* Topic navigation chips - Only show for Stories & Q&A */}
        {showTopicChips && (
          <nav className="mb-3 flex gap-2 overflow-x-auto pb-1 px-3" style={{ WebkitOverflowScrolling: 'touch' }}>
            {COMMUNITY_TOPICS.map((topic) => {
              const isActive = pathname === `/community/${topic.id}`;
              const borderWidth = '1px';
              const shadowSize = isActive ? '0 10px 15px -3px rgba(249, 115, 22, 0.3), 0 4px 6px -4px rgba(249, 115, 22, 0.3)' : '0 10px 15px -3px transparent, 0 4px 6px -4px transparent';
              
              return (
                <Link
                  key={topic.id}
                  href={`/community/${topic.id}`}
                  className={`whitespace-nowrap rounded-full px-3 py-1 text-base font-medium transition-colors duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 text-white"
                      : theme === "light"
                        ? "bg-white text-gray-700"
                        : "bg-slate-900/60 text-slate-200"
                  }`}
                  style={{ 
                    minWidth: 'fit-content',
                    flexShrink: 0,
                    border: isActive 
                      ? `${borderWidth} solid rgb(249, 115, 22)` 
                      : theme === "light" 
                        ? `${borderWidth} solid rgb(209, 213, 219)` 
                        : `${borderWidth} solid rgb(51, 65, 85)`,
                    boxShadow: shadowSize,
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                    userSelect: 'none'
                  }}
                >
                  {topic.label}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="px-4">
          {children}
        </div>
      </div>
    </div>
  );
}
