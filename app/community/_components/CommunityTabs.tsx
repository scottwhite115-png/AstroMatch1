"use client"

import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"

export function CommunityTabs() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme } = useTheme()

  // Determine active tab based on current route
  const isStoriesActive = pathname === '/community' || 
                         pathname.startsWith('/community/') && 
                         !pathname.startsWith('/community/live')
  const isLiveActive = pathname.startsWith('/community/live')

  return (
    <div className="flex gap-0.5">
      <button
        onClick={() => router.push('/community')}
        className={`relative px-5 py-2.5 font-bold whitespace-nowrap transition-all duration-300 ease-in-out ${
          isStoriesActive
            ? "bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent"
            : theme === "light"
              ? "text-gray-600 hover:text-gray-900"
              : "text-gray-400 hover:text-gray-200"
        }`}
      >
        Stories & Q&A
        <div 
          className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all duration-300 ease-in-out ${
            isStoriesActive
              ? "bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 opacity-100" 
              : "opacity-0"
          }`}
        />
      </button>
      <button
        onClick={() => router.push('/community/live')}
        className={`relative px-5 py-2.5 font-bold whitespace-nowrap transition-all duration-300 ease-in-out ${
          isLiveActive
            ? "bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent"
            : theme === "light"
              ? "text-gray-600 hover:text-gray-900"
              : "text-gray-400 hover:text-gray-200"
        }`}
      >
        Live
        <div 
          className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all duration-300 ease-in-out ${
            isLiveActive
              ? "bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 opacity-100" 
              : "opacity-0"
          }`}
        />
      </button>
    </div>
  )
}


