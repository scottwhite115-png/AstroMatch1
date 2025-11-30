"use client"

import { useState, useEffect } from "react"
import { ChevronRight, X, ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import ProfilePhotoCarouselWithRanking from "@/components/ProfilePhotoCarouselWithRanking"
import type { ConnectionBoxData } from "@/components/ConnectionBoxSimple"
import { getMatchCard } from "@/lib/getMatchCard"

interface VitalField {
  label: string
  value: string
  visibility: "Always Visible" | "Visible" | "Hidden" | "Always Hidden"
}

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

export function ProfileSettings() {
  const [activeTab, setActiveTab] = useState<"edit" | "view">("edit")
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const router = useRouter()
  
  // Mock connection box data for the view tab
  const [connectionBoxData, setConnectionBoxData] = useState<ConnectionBoxData | null>(null)
  
  // Generate mock match data when view tab is active
  useEffect(() => {
    if (activeTab === "view") {
      // Get user's zodiac signs from localStorage or use mock data
      const userSunSign = localStorage.getItem("userSunSign") || "Leo"
      const userChineseSign = localStorage.getItem("userChineseSign") || "Rabbit"
      
      // Mock partner data - you can replace with actual data
      const partnerSunSign = "Sagittarius"
      const partnerChineseSign = "Rabbit"
      
      const matchData = getMatchCard(
        userSunSign.charAt(0).toUpperCase() + userSunSign.slice(1),
        userChineseSign.charAt(0).toUpperCase() + userChineseSign.slice(1),
        partnerSunSign,
        partnerChineseSign
      )
      
      // Convert MatchCardPayload to ConnectionBoxData format
      setConnectionBoxData({
        ...matchData,
        rank: matchData.rankLabel,
        rankKey: matchData.rankKey as any,
        tier: matchData.tier,
        a: {
          west: matchData.aWest,
          east: matchData.aEast,
          westGlyph: "",
          eastGlyph: ""
        },
        b: {
          west: matchData.bWest,
          east: matchData.bEast,
          westGlyph: "",
          eastGlyph: ""
        }
      })
    }
  }, [activeTab])

  const navigateToItem = (label: string) => {
    const slug = label
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
    router.push(`/profile/${slug}`)
  }

  const getSavedValue = (field: string): string => {
    switch (field.toLowerCase()) {
      default:
        return ""
    }
  }

  const getDefaultValue = (label: string): string => {
    const defaults: { [key: string]: string } = {
      Bio: "",
    }
    return defaults[label] || ""
  }

  const [formData, setFormData] = useState({})

  const [vitals, setVitals] = useState<VitalField[]>([])

  useEffect(() => {
    setVitals((prevVitals) =>
      prevVitals.map((vital) => ({
        ...vital,
        value: getSavedValue(vital.label),
      })),
    )
  }, [activeTab]) // Re-run when tab changes to pick up any new saved values

  const photos = [
    { id: 1, src: "/portrait-photo-woman-professional.jpg", hasImage: true },
    { id: 2, src: "/woman-outdoor-nature-hiking.jpg", hasImage: true },
    { id: 3, src: "/woman-casual-coffee-shop.jpg", hasImage: true },
    { id: 4, src: "/woman-beach-vacation-summer.jpg", hasImage: true },
    { id: 5, src: "/woman-city-urban-style.jpg", hasImage: true },
    { id: 6, src: "/woman-evening-dress-elegant.jpg", hasImage: true },
  ]

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  return (
    <div className="astrology-cosmic-bg profile-page min-h-screen relative">

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-center px-5 py-4 relative">
          <div className="flex items-center justify-center gap-4">
            <FourPointedStar className="w-4 h-4 text-orange-500" />
            <h1 className="astrology-heading-primary">Settings</h1>
            <FourPointedStar className="w-4 h-4 text-orange-500" />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-5 mb-6">
          <button
            onClick={() => setActiveTab("edit")}
            className={`flex-1 pb-3 pt-2 text-center font-semibold transition-all duration-300 relative ${
              activeTab === "edit" ? "text-white" : "text-white/50 hover:text-white/80"
            }`}
          >
            <span className="relative z-10">Edit</span>
            {activeTab === "edit" && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-t-lg"></div>
            )}
            <div
              className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300 ${
                activeTab === "edit" ? "bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400" : "bg-transparent"
              }`}
            ></div>
          </button>
          <button
            onClick={() => setActiveTab("view")}
            className={`flex-1 pb-3 pt-2 text-center font-semibold transition-all duration-300 relative ${
              activeTab === "view" ? "text-white" : "text-white/50 hover:text-white/80"
            }`}
          >
            <span className="relative z-10">View</span>
            {activeTab === "view" && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-t-lg"></div>
            )}
            <div
              className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300 ${
                activeTab === "view" ? "bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400" : "bg-transparent"
              }`}
            ></div>
          </button>
        </div>

        {activeTab === "view" && (
          <div className="mb-8 -mx-5">
            <ProfilePhotoCarouselWithRanking
              images={photos.map(p => p.src)}
              profileName="Sarah"
              profileAge={27}
              connectionBoxData={connectionBoxData || undefined}
              theme="dark"
              showDropdown={true}
              badgePosition="overlay-bottom"
              aboutMeText="Creative soul with a passion for art and music. Seeking someone who values authenticity and emotional connection."
              selectedOccupation="Graphic Designer"
              selectedCity="Melbourne, VIC"
              cityInput=""
              selectedHeight="5'7\""
              selectedChildrenOption="Don't have, want someday"
              selectedReligion="Agnostic"
              selectedDeepPrompts={["My simple pleasures...", "What makes me unique..."]}
              deepPromptAnswers={{
                "My simple pleasures...": "Good coffee, live music, and long conversations under the stars.",
                "What makes me unique...": "I can paint with my eyes closed and I speak three languages fluently."
              }}
              birthInfo={{ birthdate: "1997-06-15" }}
            />
          </div>
        )}

        {/* Content */}
        {activeTab === "edit" && (
          <>
            {/* Photo Grid Section - Only show in Edit tab */}
            <div className="px-5 mb-8">
              <div className="photo-grid">
                {photos.map((photo) => (
                  <div key={photo.id} className="photo-slot">
                    {photo.hasImage ? (
                      <div className="relative w-full h-full">
                        <img
                          src={photo.src || "/placeholder.svg"}
                          alt="Profile photo"
                          className="w-full h-full object-cover"
                        />
                        <button className="delete-button">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="photo-placeholder w-full h-full">
                        <div className="photo-placeholder-icon"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* My Vitals Section - Only show in Edit tab */}
            <div className="px-5">
              <div className="mb-8">
                <div className="space-y-0">
                  {vitals.map((vital, index) => (
                    <button
                      key={index}
                      onClick={() => navigateToItem(vital.label)}
                      className={`w-full flex items-center justify-between py-4 text-left hover:bg-white/10 transition-colors ${index !== vitals.length - 1 ? "border-b border-white/20" : ""}`}
                    >
                      <div>
                        <div className="font-medium text-lg text-white">{vital.label}</div>
                        <div className="text-white/70">{vital.value}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <ChevronRight className="w-5 h-5 text-white/70" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
