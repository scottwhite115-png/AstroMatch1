"use client";

import { useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  const router = useRouter();
  
  // Scroll to top immediately on mount and when pathname changes (before paint)
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  
  // Also ensure scroll to top after page is fully loaded (fallback)
  useEffect(() => {
    const handleLoad = () => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    
    // If page is already loaded, scroll immediately
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);
  
  // Show topic chips for all community pages
  const showTopicChips = true;
  
  // Determine current topic from pathname
  const currentTopic = pathname.startsWith('/community/') 
    ? pathname.split('/')[2] || 'general-astrology'
    : 'general-astrology';

  return (
    <div className={`min-h-screen ${
      theme === "light" ? "bg-gray-50 text-slate-700" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-slate-50"
    }`}>
      <div className="w-full">
        {/* AstroLounge Header */}
        <header className="mb-4">
          <div className="px-4 pt-0.5 pb-1.5">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex-1 -ml-8">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-transparent">
                  <div className="flex gap-0.5 min-w-max">
                    <button
                      className={`relative px-5 py-2.5 font-bold whitespace-nowrap transition-all duration-300 ease-in-out flex items-center gap-0.5`}
                    >
              <FourPointedStar className="w-4 h-4 text-orange-500" />
                      <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Community
              </span>
                    </button>
                  </div>
                </div>
            </div>

            {/* New Post Button and Theme Toggle - Top Right */}
              <div className="flex items-center gap-2 mr-0">
            {showTopicChips && (
              <div className="mr-2">
                <NewPostButton topic={currentTopic} />
              </div>
            )}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className={`p-2 rounded-lg transition-colors`}
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
            </div>
          </div>
        </header>

        {/* Topic navigation chips - Only show for Stories & Q&A */}
        {showTopicChips && (
          <nav className="mb-3 flex gap-2 overflow-x-auto pb-1 px-4 sm:px-6" style={{ WebkitOverflowScrolling: 'touch' }}>
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
                      ? "bg-gradient-to-r from-orange-700 via-orange-600 to-red-600 text-white"
                      : theme === "light"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-slate-900/60 text-slate-200"
                  }`}
                  style={{ 
                    minWidth: 'fit-content',
                    flexShrink: 0,
                    border: isActive 
                      ? `${borderWidth} solid rgb(194, 65, 12)` 
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

        <div>
          {children}
        </div>
      </div>
    </div>
  );
}
