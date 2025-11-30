"use client"

import { useRef } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import dynamic from "next/dynamic"

const ProfilePage = dynamic(() => import("@/app/profile/profile/page"), { ssr: false })
const AccountPage = dynamic(() => import("@/app/profile/account/page"), { ssr: false })
const SafetyPrivacyPage = dynamic(() => import("@/app/profile/safety-privacy/page"), { ssr: false })

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

export function Settings() {
  const { theme } = useTheme()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollToPage = (pageIndex: number) => {
    if (scrollContainerRef.current) {
      const pageWidth = scrollContainerRef.current.clientWidth
      scrollContainerRef.current.scrollTo({
        left: pageWidth * pageIndex,
        behavior: "smooth",
      })
    }
  }

  // UPDATED: Settings pages order - Account moved to 2nd position
  const settingsPages = [
    {
      label: "Profile & Identity",
      component: ProfilePage,
      gradient: "from-purple-500 via-violet-500 to-indigo-500",
      starColor: "text-purple-400",
      borderColor: "border-purple-500/50",
    },
    {
      label: "Account",
      component: AccountPage,
      gradient: "from-amber-500 via-yellow-500 to-orange-500",
      starColor: "text-amber-400",
      borderColor: "border-amber-500/50",
    },
    {
      label: "Safety & Privacy",
      component: SafetyPrivacyPage,
      gradient: "from-red-500 via-orange-500 to-amber-600",
      starColor: "text-red-400",
      borderColor: "border-red-500/50",
    },
  ]

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white profile-page min-h-screen relative pb-20">
      <div className="relative z-10">
        <div className="px-3 pt-2 pb-4">
          <div className="flex items-center gap-0.5">
            <FourPointedStar className="w-4 h-4 text-orange-500" />
            <span className="font-bold text-base bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 bg-clip-text text-transparent">
              AstroMatch
            </span>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory custom-scrollbar"
          style={{
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {settingsPages.map((page, index) => {
            const PageComponent = page.component
            return (
              <div
                key={index}
                className="min-w-full snap-start"
                style={{
                  width: "100vw",
                }}
              >
                <PageComponent
                  pageIndex={index}
                  totalPages={settingsPages.length}
                  onNavigatePrev={() => scrollToPage(index - 1)}
                  onNavigateNext={() => scrollToPage(index + 1)}
                />
              </div>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 12px;
          display: block;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          margin: 0 20px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, rgba(251, 146, 60, 0.7), rgba(239, 68, 68, 0.7));
          border-radius: 10px;
          border: 2px solid rgba(255, 255, 255, 0.5);
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(90deg, rgba(251, 146, 60, 0.9), rgba(239, 68, 68, 0.9));
        }
        
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(251, 146, 60, 0.7) rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  )
}
