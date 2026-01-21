"use client"

import { useTheme } from "@/contexts/ThemeContext"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { buildConnectionBox, getRank, deriveElement, deriveTrine } from "@/lib/compat/engine"
import type { UserAstro, ConnectionBox } from "@/lib/compat/types"
import { getWesternSignEmoji, getChineseSignEmoji } from '@/lib/utils/emojis'
import { LabelPill } from "@/ui/LabelPill"
import { tierFromScore } from "@/engine/thresholds"
import type { Tier } from "@/engine/labels"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

const Settings = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)

const MessageCircle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
)

const X = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="m18 6-12 12" />
    <path d="m6 6 12 12" />
  </svg>
)

const primaryTierFilters: Tier[] = ["perfect", "excellent", "good"]

const TIER_FILTER_META: Array<{ key: Tier; description: string }> = [
  { key: "perfect", description: "90–100% compatibility" },
  { key: "excellent", description: "75–89% compatibility" },
  { key: "good", description: "60–74% compatibility" },
]

const EMPTY_TIER_FILTERS: Record<Tier, boolean> = {
  perfect: false,
  excellent: false,
  good: false,
  fair: false,
  challenging: false,
}

interface LikeProfile {
  id: number
  name: string
  age: number
  photo: string
  photos?: string[]
  westernSign: string
  chineseSign: string
  compatibility: number
  about?: string
  interests?: string[]
  relationshipGoals?: string[]
  occupation?: string
  height?: string
  children?: string
  religion?: string
  city?: string
}

export default function LikesPage() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [likesProfiles, setLikesProfiles] = useState<LikeProfile[]>([])
  const [selectedProfile, setSelectedProfile] = useState<LikeProfile | null>(null)
  const [compatBoxes, setCompatBoxes] = useState<{[key: number]: ConnectionBox}>({})
  const [userAstro, setUserAstro] = useState<UserAstro | null>(null)
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false)
  const [matchTierFilters, setMatchTierFilters] = useState<Record<Tier, boolean>>({
    ...EMPTY_TIER_FILTERS
  })
  
  // Filtered profiles based on match tier filters
  const [filteredProfiles, setFilteredProfiles] = useState<LikeProfile[]>([])
  
  // User's zodiac signs for matching
  const [userZodiacSigns, setUserZodiacSigns] = useState<{western: string, chinese: string}>({
    western: 'leo',
    chinese: 'rabbit'
  })

  // Load user's zodiac signs from localStorage
  useEffect(() => {
    const userWesternSign = localStorage.getItem("userSunSign")
    const userChineseSign = localStorage.getItem("userChineseSign")

    console.log("[Likes] Loading from localStorage:", { userWesternSign, userChineseSign })

    if (userWesternSign && userChineseSign) {
      setUserZodiacSigns({
        western: userWesternSign,
        chinese: userChineseSign
      })
      
      // Build UserAstro for new engine
      try {
        // Get user gender from localStorage
        const userGender = localStorage.getItem("userGender") || "unspecified"
        const astro: UserAstro = {
          west_sign: userWesternSign.toLowerCase() as any,
          east_sign: userChineseSign.toLowerCase() as any,
          element: deriveElement(userWesternSign),
          trine: deriveTrine(userChineseSign),
          gender: userGender as any
        }
        setUserAstro(astro)
        
        console.log("[Likes] User zodiac signs loaded:", { western: userWesternSign, chinese: userChineseSign })
        console.log("[Likes] User astro:", astro)
      } catch (error) {
        console.error("[Likes] Error creating UserAstro:", error)
      }
    } else {
      // Default fallback if no signs in localStorage
      console.warn("[Likes] No user signs in localStorage, using default Leo-Rabbit")
      setUserZodiacSigns({
        western: 'leo',
        chinese: 'rabbit'
      })
      
      const astro: UserAstro = {
        west_sign: 'leo',
        east_sign: 'rabbit',
        element: deriveElement('leo'),
        trine: deriveTrine('rabbit'),
        gender: 'unspecified'
      }
      setUserAstro(astro)
    }
  }, [])

  // Listen for closeProfile event from navigation
  useEffect(() => {
    const handleCloseProfile = () => {
      setSelectedProfile(null)
    }

    window.addEventListener("closeProfile", handleCloseProfile)
    return () => window.removeEventListener("closeProfile", handleCloseProfile)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSettingsDropdown && !(event.target as Element).closest('.settings-dropdown-container')) {
        setShowSettingsDropdown(false)
      }
    }

    if (showSettingsDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSettingsDropdown])

  // Apply match tier filters
  useEffect(() => {
    const hasActiveFilters = primaryTierFilters.some((tier) => matchTierFilters[tier])

    if (!hasActiveFilters) {
      setFilteredProfiles(likesProfiles)
      return
    }

    const filtered = likesProfiles.filter((profile) => {
      const compatTier =
        compatBoxes[profile.id]?.tier ?? tierFromScore(profile.compatibility)

      return matchTierFilters[compatTier]
    })

    setFilteredProfiles(filtered)
  }, [likesProfiles, matchTierFilters, compatBoxes])

  // Load likes from localStorage on mount
  useEffect(() => {
    // Demo data for testing - force load with new format
    const demoLikesBase: LikeProfile[] = [
      {
        id: 3,
        name: "Olivia",
        age: 26,
        photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
        photos: [
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
          "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80"
        ],
        westernSign: "Scorpio",
        chineseSign: "Horse",
        compatibility: 87, // Will be recalculated
        about: "Adventure seeker with a passion for art and meaningful conversations. I believe in living authentically and finding magic in everyday moments.",
        interests: ["Art", "Photography", "Yoga", "Cooking", "Travel"],
        relationshipGoals: ["Life companion", "Best friend", "Soul mate"],
        occupation: "Graphic Designer",
        height: "168 cm",
        children: "Don't have children",
        religion: "Spiritual",
        city: "Los Angeles, CA"
      },
      {
        id: 4,
        name: "Isabella",
        age: 24,
        photo: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80",
        photos: [
          "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80",
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80"
        ],
        westernSign: "Gemini",
        chineseSign: "Dragon",
        compatibility: 92, // Will be recalculated
        about: "Music lover and fitness enthusiast. Looking for someone who values growth, communication, and building something beautiful together.",
        interests: ["Music", "Fitness", "Reading", "Hiking", "Dancing"],
        relationshipGoals: ["Life companion", "Intimate connection", "Adventure partner"],
        occupation: "Marketing Manager",
        height: "165 cm",
        children: "Want children",
        religion: "Christian",
        city: "New York, NY"
      }
    ]
    
    // Calculate compatibility using NEW engine
    const demoLikes = demoLikesBase.map(profile => {
      let compatibility = 50 // Default fallback
      
      if (userAstro) {
        const profileAstro: UserAstro = {
          west_sign: profile.westernSign.toLowerCase() as any,
          east_sign: profile.chineseSign.toLowerCase() as any,
          element: deriveElement(profile.westernSign),
          trine: deriveTrine(profile.chineseSign)
        }
        
        const rank = getRank(userAstro, profileAstro)
        compatibility = rank * 20 // Convert rank (1-5) to score for sorting
        
        console.log(`[Likes] ${profile.name} compatibility: Rank ${rank}`)
      }
      
      return {
        ...profile,
        compatibility
      }
    })
    
    // Always load demo data with astrology signs
    setLikesProfiles(demoLikes)
    if (typeof window !== 'undefined') {
      localStorage.setItem("userLikes", JSON.stringify(demoLikes))
    }
  }, [userAstro])

  // Build compatibility boxes whenever userAstro or likesProfiles change
  useEffect(() => {
    if (!userAstro) {
      console.warn('[Likes] userAstro not ready yet')
      return
    }
    
    if (likesProfiles.length === 0) {
      console.warn('[Likes] No profiles loaded yet')
      return
    }
    
    const boxes: {[key: number]: ConnectionBox} = {}
    
    console.log('[Likes] Building compat boxes for', likesProfiles.length, 'profiles')
    
    for (const profile of likesProfiles) {
      try {
        const profileAstro: UserAstro = {
          west_sign: profile.westernSign.toLowerCase() as any,
          east_sign: profile.chineseSign.toLowerCase() as any,
          element: deriveElement(profile.westernSign),
          trine: deriveTrine(profile.chineseSign)
        }
        
        boxes[profile.id] = buildConnectionBox(userAstro, profileAstro)
        console.log(`[Likes] ${profile.name} box:`, boxes[profile.id])
      } catch (error) {
        console.error(`[Likes] Error building box for ${profile.name}:`, error)
      }
    }
    
    console.log('[Likes] Final boxes:', boxes)
    setCompatBoxes(boxes)
  }, [userAstro, likesProfiles])

  const handlePass = (profileId: number) => {
    // Remove from likes
    const updatedLikes = likesProfiles.filter(profile => profile.id !== profileId)
    setLikesProfiles(updatedLikes)
    
    if (typeof window !== 'undefined') {
      localStorage.setItem("userLikes", JSON.stringify(updatedLikes))
      
      // Store passed profile with timestamp (28 days hide)
      const passedProfiles = localStorage.getItem("passedProfiles")
      let passed = []
      if (passedProfiles) {
        try {
          passed = JSON.parse(passedProfiles)
        } catch (error) {
          console.error("Error parsing passedProfiles:", error)
        }
      }
      
      // Add profile ID with expiry timestamp (28 days from now)
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + 28)
      passed.push({
        profileId: profileId,
        expiresAt: expiryDate.getTime()
      })
      
      localStorage.setItem("passedProfiles", JSON.stringify(passed))
    }
  }

  const handleOpenChat = (profile: LikeProfile) => {
    // Remove from likes
    const updatedLikes = likesProfiles.filter(p => p.id !== profile.id)
    setLikesProfiles(updatedLikes)
    
    if (typeof window !== 'undefined') {
      localStorage.setItem("userLikes", JSON.stringify(updatedLikes))

      // Add to messages/chats
      const existingChats = localStorage.getItem("userChats")
      let chats = []
      if (existingChats) {
        try {
          chats = JSON.parse(existingChats)
        } catch (e) {
          console.error("Error loading chats:", e)
        }
      }

      // Add new chat
      const newChat = {
        id: profile.id,
        name: profile.name,
        age: profile.age,
        photo: profile.photo,
        lastMessage: "Say hi! 👋",
        timestamp: new Date().toISOString(),
        unread: false
      }

      chats.unshift(newChat)
      localStorage.setItem("userChats", JSON.stringify(chats))

      // Navigate to messages
      router.push("/messages")
    }
  }
  
  const handleViewProfile = (profile: LikeProfile, event: React.MouseEvent) => {
    // Prevent navigation if clicking on buttons
    if ((event.target as HTMLElement).closest('button')) {
      return
    }
    // Show profile inline
    setSelectedProfile(profile)
  }
  
  const handleCloseProfile = () => {
    setSelectedProfile(null)
  }

  return (
    <div className={`${theme === "light" ? "bg-white" : "bg-[#0a0a0a]"} min-h-screen relative overflow-x-hidden touch-pan-y pb-24`} style={{ overscrollBehavior: 'contain' }}>
      <div className="relative z-10">
        {/* Header */}
        <div className="px-3 pt-2 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              <FourPointedStar className="w-4 h-4 text-orange-500" />
              <span className="font-bold text-base bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Likes
              </span>
            </div>
            
            {/* Right side: Settings and Theme toggle */}
            <div className="flex items-center gap-2">
              {/* Settings Dropdown */}
              <div className="relative settings-dropdown-container">
                <button
                  onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Like settings"
                >
                  <Settings className={`w-5 h-5 ${theme === "light" ? "text-gray-600" : "text-white/70"}`} />
                </button>
                
                {showSettingsDropdown && (
                  <div className={`absolute right-0 top-10 w-80 backdrop-blur-sm rounded-lg shadow-xl p-4 z-50 ${theme === "light" ? "bg-white border border-gray-200" : "bg-zinc-800/95 border border-white/20"}`}>
                    <h3 className={`text-lg font-bold mb-4 ${theme === "light" ? "text-black" : "text-white"}`}>Like Settings</h3>
                    
                    <p className={`text-sm mb-3 ${theme === "light" ? "text-gray-600" : "text-white/70"}`}>Only see likes from:</p>
                    
                    {TIER_FILTER_META.map(({ key, description }) => (
                      <div className="mb-3" key={key}>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={matchTierFilters[key]}
                            onChange={(e) => setMatchTierFilters(prev => ({ ...prev, [key]: e.target.checked }))}
                            className={`w-4 h-4 text-purple-600 rounded focus:ring-purple-500 focus:ring-2 ${
                              theme === "light" 
                                ? "bg-white border-gray-300" 
                                : "bg-zinc-700 border-white/20"
                            }`}
                          />
                          <span className="flex items-center gap-2">
                            <LabelPill tier={key} />
                          </span>
                        </label>
                        <p className={`text-xs mt-1 ml-7 ${theme === "light" ? "text-gray-500" : "text-white/60"}`}>
                          {description}
                        </p>
                      </div>
                    ))}
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setMatchTierFilters({ ...EMPTY_TIER_FILTERS })
                          setShowSettingsDropdown(false)
                        }}
                        className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                          theme === "light"
                            ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                            : "bg-zinc-600/50 hover:bg-zinc-600/70 text-white"
                        }`}
                      >
                        Clear
                      </button>
                      <button
                        onClick={() => setShowSettingsDropdown(false)}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 hover:from-orange-500 hover:via-orange-400 hover:to-red-400 text-white text-sm rounded-lg transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Theme Toggle Button */}
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
          </div>
        </div>

        {/* Page Title */}
        <div className="px-5 pt-1 pb-1">
        </div>

        {/* Inline Profile View - Full View Tab Style */}
        {selectedProfile && (
          <div className={`fixed inset-0 ${theme === "light" ? "bg-white" : "bg-[#0a0a0a]"} z-50 overflow-y-auto`}>
            <div className="min-h-screen pb-24">
              {/* Close Button */}
              <button
                onClick={handleCloseProfile}
                className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-zinc-800/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-zinc-700 transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Profile Content - Full Width */}
              <div className="pt-12">
                {/* Profile Photo - Matching Emma's Layout */}
                <div className="relative w-full" style={{ height: 'calc(100vw * 1.375)', maxHeight: '80vh' }}>
                  <img
                    src={selectedProfile.photos?.[0] || selectedProfile.photo}
                    alt={selectedProfile.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Profile Info Overlay - Matching Emma's Style */}
                  <div className="absolute bottom-0 left-0 right-0 px-3 sm:px-5 py-3 sm:py-4">
                    <div className="!text-white/95 font-semibold text-2xl sm:text-3xl mb-1">
                      {selectedProfile.name}, {selectedProfile.age}
                    </div>
                    
                    {/* Photo-specific Info - Matching Emma's Layout */}
                    <div className="!text-white/95 text-base sm:text-lg font-semibold flex items-center gap-1">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      {selectedProfile.distance ? `${selectedProfile.distance} km away` : 'Distance not available'}
                    </div>
                  </div>
                </div>

                {/* Compatibility Section - Matching Emma's Detailed Layout */}
                <div className={`px-4 py-4 ${theme === "light" ? "bg-white" : "bg-[#0a0a0a]"}`}>
                  {(() => {
                    // Get the compatibility box from NEW engine
                    const compatBox = compatBoxes[selectedProfile.id]
                    
                    return (
                      <>
                        {/* Compatibility Insights Box - No Percentages */}
                        <div className="bg-zinc-800/60 backdrop-blur-sm px-4 py-4 rounded-xl shadow-lg relative">
                          <div className="flex items-center gap-2 mb-3">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                            <h2 className="text-lg font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                              Your Connection
                            </h2>
                          </div>

                          {/* Zodiac Signs Display */}
                          <div className="flex items-center justify-center gap-3 mb-4 pb-3 border-b border-white/10">
                            {/* User's Signs */}
                            <div className="text-center">
                              <div className="text-2xl">{getWesternSignEmoji(userZodiacSigns.western.charAt(0).toUpperCase() + userZodiacSigns.western.slice(1))}</div>
                              <div className="text-xs text-white/70 mt-1">{userZodiacSigns.western.charAt(0).toUpperCase() + userZodiacSigns.western.slice(1)}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl">{getChineseSignEmoji(userZodiacSigns.chinese.charAt(0).toUpperCase() + userZodiacSigns.chinese.slice(1))}</div>
                              <div className="text-xs text-white/70 mt-1">{userZodiacSigns.chinese.charAt(0).toUpperCase() + userZodiacSigns.chinese.slice(1)}</div>
                            </div>

                            {/* X Separator */}
                            <div className="text-purple-400 text-2xl px-2">
                              <X className="w-5 h-5" stroke="#c084fc" />
                            </div>

                            {/* Partner's Signs */}
                            <div className="text-center">
                              <div className="text-2xl">{getWesternSignEmoji(selectedProfile.westernSign)}</div>
                              <div className="text-xs text-white/70 mt-1">{selectedProfile.westernSign}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl">{getChineseSignEmoji(selectedProfile.chineseSign)}</div>
                              <div className="text-xs text-white/70 mt-1">{selectedProfile.chineseSign}</div>
                            </div>
                          </div>

                          {/* Insights & Recommendations */}
        {compatBox ? (
          <div className="space-y-4">
            {/* Fusion Intro */}
                        <div className="text-center mb-4">
                          <div className="flex justify-center mb-1">
                            {compatBox.tier ? (
                              <LabelPill
                                tier={compatBox.tier}
                                label={compatBox.rankLabel || compatBox.rank}
                              />
                            ) : (
                              <h4 className="font-semibold text-lg text-purple-300">
                                {compatBox.label}
                              </h4>
                            )}
                          </div>
                          <p className="text-sm text-white/80 italic">
                            {compatBox.fusion}
                          </p>
                        </div>
            
            {/* Chinese Zodiac */}
            <div className="text-center mb-3">
              <p className="font-medium text-white/90 mb-1">
                <strong>{compatBox.summary.chinese_heading}</strong>
              </p>
              <p className="text-sm text-white/70 italic">
                {compatBox.summary.chinese_line}
              </p>
            </div>
            
            {/* Western Zodiac */}
            <div className="text-center">
              <p className="text-sm text-white/90">
                <strong>{compatBox.summary.western_heading}</strong> ({compatBox.summary.western_line})
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-sm text-white/60 italic">Analyzing your connection...</p>
          </div>
        )}
                        </div>
                      </>
                    )
                  })()}
                </div>

                {/* About Section */}
                {selectedProfile.about && (
                  <div className="px-4 pb-4">
                    <div className="bg-zinc-800/60 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-zinc-700/30">
                      <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span className="bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">About</span>
                      </h3>
                      <p className="text-white/90 text-base leading-relaxed">{selectedProfile.about}</p>
                    </div>
                  </div>
                )}

                {/* Relationship Goals Section */}
                {selectedProfile.relationshipGoals && selectedProfile.relationshipGoals.length > 0 && (
                  <div className="px-4 pb-4">
                    <div className="bg-zinc-800/60 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-zinc-700/30">
                      <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span className="bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">Relationship goals</span>
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProfile.relationshipGoals.map((goal) => (
                          <span
                            key={goal}
                            className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-500 text-white shadow-lg"
                          >
                            {goal}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Interests Section */}
                {selectedProfile.interests && selectedProfile.interests.length > 0 && (
                  <div className="px-4 pb-4">
                    <div className="bg-zinc-800/60 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-zinc-700/30">
                      <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span className="bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">Interests</span>
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProfile.interests.map((interest) => (
                          <span
                            key={interest}
                            className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-500 text-white shadow-lg"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Essentials Section */}
                <div className="px-4 pb-4">
                  <div className="bg-zinc-800/60 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-zinc-700/30">
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span className="bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">Essentials</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProfile.city && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-500 text-white shadow-lg">
                          {selectedProfile.city}
                        </span>
                      )}
                      {selectedProfile.occupation && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-500 text-white shadow-lg">
                          {selectedProfile.occupation}
                        </span>
                      )}
                      {selectedProfile.height && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-500 text-white shadow-lg">
                          {selectedProfile.height}
                        </span>
                      )}
                      {selectedProfile.children && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-500 text-white shadow-lg">
                          {selectedProfile.children}
                        </span>
                      )}
                      {selectedProfile.religion && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-500 text-white shadow-lg">
                          {selectedProfile.religion}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Likes List */}
        <div className="pb-8">
          {filteredProfiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-5">
              <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10 text-purple-500">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                {likesProfiles.length === 0 ? "No likes yet" : "No matches with selected filters"}
              </h2>
              <p className="text-white/50 text-base max-w-sm">
                {likesProfiles.length === 0 
                  ? "When someone likes your profile, they'll appear here" 
                  : "Try adjusting your filter settings to see more matches"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProfiles.map((profile) => (
                <div
                  key={profile.id}
                  onClick={(e) => handleViewProfile(profile, e)}
                  className={`message-profile-card ${theme === "light" ? "bg-white border border-black/20 shadow-lg" : "bg-zinc-800/60 border border-white/10"} backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg cursor-pointer ${theme === "light" ? "hover:shadow-xl hover:bg-gray-50" : "hover:bg-zinc-800/80"} transition-all`}
                >
                  <div className="flex gap-3 p-3">
                    {/* Profile Photo */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={profile.photo}
                        alt={profile.name}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-bold mb-0.5 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                        {profile.name}, {profile.age}
                      </h3>
                      <div className="space-y-0.5">
                        <div className={`flex items-center gap-1.5 text-sm ${theme === "light" ? "text-gray-700" : "text-white"}`}>
                          <span className={`truncate ${theme === "light" ? "text-gray-900" : "text-white"}`}>{profile.westernSign}</span>
                          <span className={theme === "light" ? "text-gray-500" : "text-white/70"}>•</span>
                          <span className={`truncate ${theme === "light" ? "text-gray-900" : "text-white"}`}>{profile.chineseSign}</span>
                        </div>
                        {/* Match Engine Ranking Label */}
                        {(() => {
                          const connectionBox = compatBoxes[profile.id];
                          const compatTier = connectionBox?.tier ?? tierFromScore(profile.compatibility);
                          if (!compatTier) return null;
                          const label = connectionBox?.rankLabel || connectionBox?.rank;

                          return (
                            <div className="text-sm font-semibold flex items-center gap-2">
                              <LabelPill
                                tier={compatTier}
                                label={label}
                              />
                              <span className={theme === "light" ? "text-gray-600" : "text-white/60"}>
                                {Math.round(profile.compatibility)}%
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 px-3 pb-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePass(profile.id)
                      }}
                      className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-2 font-semibold text-sm ${
                        theme === "light" 
                          ? "bg-gray-200 hover:bg-gray-300 text-gray-800" 
                          : "bg-zinc-700/60 hover:bg-zinc-700 text-white/90"
                      }`}
                    >
                      <X className="w-4 h-4" />
                      Pass
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenChat(profile)
                      }}
                      className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-2 font-semibold text-sm ${
                        theme === "light" 
                          ? "bg-gray-200 hover:bg-gray-300 text-gray-800" 
                          : "bg-zinc-700/60 hover:bg-zinc-700 text-white/90"
                      }`}
                    >
                      <MessageCircle className="w-4 h-4" />
                      Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
