"use client"

import { useState, useRef } from "react"
import PhotoCarouselWithGestures from "@/components/PhotoCarouselWithGestures"
// import { ChevronLeft, ChevronRight } from "lucide-react"

// Helper functions for zodiac signs
const getWesternSignEmoji = (sign: string): string => {
  const signEmojis: { [key: string]: string } = {
    "Aries": "♈",
    "Taurus": "♉", 
    "Gemini": "♊",
    "Cancer": "♋",
    "Leo": "♌",
    "Virgo": "♍",
    "Libra": "♎",
    "Scorpio": "♏",
    "Sagittarius": "♐",
    "Capricorn": "♑",
    "Aquarius": "♒",
    "Pisces": "♓"
  }
  return signEmojis[sign] || "♈"
}

const getChineseSignEmoji = (sign: string): string => {
  const signEmojis: { [key: string]: string } = {
    "Rat": "🐭",
    "Ox": "🐂", 
    "Tiger": "🐅",
    "Rabbit": "🐰",
    "Dragon": "🐉",
    "Snake": "🐍",
    "Horse": "🐎",
    "Goat": "🐐",
    "Monkey": "🐒",
    "Rooster": "🐓",
    "Dog": "🐕",
    "Pig": "🐷"
  }
  return signEmojis[sign] || "🐭"
}

interface UserProfileStackProps {
  profiles: Array<{
    id: string
    name: string
    age: number
    photos: string[]
    westernSign: string
    easternSign: string
    location?: string
    occupation?: string
    height?: string
    children?: string
    religion?: string
    aboutMe?: string
    interests?: string[]
    relationshipGoals?: string[]
    compatibility: number
  }>
  onSwipeLeft?: (profileId: string) => void
  onSwipeRight?: (profileId: string) => void
  onLike?: (profileId: string) => void
  onChat?: (profileId: string) => void
}

export default function UserProfileStack({ 
  profiles, 
  onSwipeLeft, 
  onSwipeRight, 
  onLike, 
  onChat 
}: UserProfileStackProps) {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false)
  const [zoomScale, setZoomScale] = useState(1)
  const [zoomPosX, setZoomPosX] = useState(0)
  const [zoomPosY, setZoomPosY] = useState(0)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  
  const lastZoomDistanceRef = useRef(0)
  const lastTouchPosRef = useRef({ x: 0, y: 0 })
  const lastTwoFingerMidpointRef = useRef({ x: 0, y: 0 })

  const currentProfile = profiles[currentProfileIndex]

  if (!currentProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen px-5">
        <div className="text-center space-y-4">
          <div className="text-white/80 text-xl font-semibold">No more profiles</div>
          <p className="text-white/60 text-base">Check back later for new matches!</p>
        </div>
      </div>
    )
  }

  // Touch handlers for zoom
  const getDistance = (touches: TouchList) => {
    const touch1 = touches[0]
    const touch2 = touches[1]
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    )
  }

  const handleImageTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      lastZoomDistanceRef.current = getDistance(e.touches)
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2
      lastTwoFingerMidpointRef.current = { x: midX, y: midY }
    } else if (e.touches.length === 1) {
      lastTouchPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
  }

  const handleImageTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const currentDistance = getDistance(e.touches)
      const scaleChange = currentDistance / lastZoomDistanceRef.current
      const newScale = Math.max(1, Math.min(zoomScale * scaleChange, 3))
      
      setZoomScale(newScale)
      lastZoomDistanceRef.current = currentDistance
    } else if (e.touches.length === 1 && zoomScale > 1) {
      const touch = e.touches[0]
      const deltaX = touch.clientX - lastTouchPosRef.current.x
      const deltaY = touch.clientY - lastTouchPosRef.current.y
      
      setZoomPosX(prev => prev + deltaX)
      setZoomPosY(prev => prev + deltaY)
      lastTouchPosRef.current = { x: touch.clientX, y: touch.clientY }
    }
  }

  const handleZoomTouchEnd = () => {
    if (zoomScale < 1.1) {
      setZoomScale(1)
      setZoomPosX(0)
      setZoomPosY(0)
    }
  }

  const nextPhoto = () => {
    if (currentPhotoIndex < currentProfile.photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1)
    }
  }

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1)
    }
  }

  const nextProfile = () => {
    if (currentProfileIndex < profiles.length - 1) {
      setCurrentProfileIndex(currentProfileIndex + 1)
      setCurrentPhotoIndex(0)
    }
  }

  const prevProfile = () => {
    if (currentProfileIndex > 0) {
      setCurrentProfileIndex(currentProfileIndex - 1)
      setCurrentPhotoIndex(0)
    }
  }

  const handleSwipeLeft = () => {
    onSwipeLeft?.(currentProfile.id)
    nextProfile()
  }

  const handleSwipeRight = () => {
    onSwipeRight?.(currentProfile.id)
    nextProfile()
  }

  const handleLike = () => {
    onLike?.(currentProfile.id)
  }

  const handleChat = () => {
    onChat?.(currentProfile.id)
  }

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Profile Card */}
      <div 
        className="shadow-lg"
        style={{
          borderRadius: showProfileMenu ? "12px" : "12px 12px 0 0",
          borderBottomLeftRadius: showProfileMenu ? "12px" : "0",
          borderBottomRightRadius: showProfileMenu ? "12px" : "0",
          overflow: zoomScale > 1.1 ? "visible" : "hidden"
        }}
      >
        <PhotoCarouselWithGestures
          images={currentProfile.photos || []}
          currentPhotoIndex={currentPhotoIndex}
          onPhotoChange={(index) => setCurrentPhotoIndex(index)}
          className="relative w-full aspect-[3/4]"
          style={{
            borderRadius: showProfileMenu ? "12px" : "12px 12px 0 0",
            borderBottomLeftRadius: showProfileMenu ? "12px" : "0",
            borderBottomRightRadius: showProfileMenu ? "12px" : "0",
          }}
        >
          {/* Bottom gradient blend - only show when profile menu is closed */}
          {!showProfileMenu && (
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none"></div>
          )}
          
          {/* Name, Age, and Zodiac Signs Overlay */}
          <div className={`absolute bottom-0 left-0 right-0 px-5 py-6 ${!showProfileMenu ? "bg-gradient-to-t from-black/70 via-black/50 to-transparent" : ""}`}>
            <div className="!text-white/95 font-semibold text-3xl mb-1">
              {currentProfile.name}, {currentProfile.age}
            </div>
            <div className="!text-white/95 text-lg font-semibold mb-1">
              {getWesternSignEmoji(currentProfile.westernSign)} {currentProfile.westernSign} •{" "}
              {getChineseSignEmoji(currentProfile.easternSign)} {currentProfile.easternSign}
            </div>
            
            {/* Photo-specific info */}
            {currentPhotoIndex === 0 && currentProfile.location && (
              <div className="!text-white/95 text-lg font-semibold flex items-center gap-1">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                {currentProfile.location}
              </div>
            )}
            
            {currentPhotoIndex === 1 && currentProfile.occupation && (
              <div className="!text-white/95 text-lg font-semibold flex items-center gap-1">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
                </svg>
                {currentProfile.occupation}
              </div>
            )}
            
            {currentPhotoIndex === 2 && currentProfile.height && (
              <div className="!text-white/95 text-lg font-semibold flex items-center gap-1">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L10 14H14L12 22L17 10H13L15 2H12Z"/>
                </svg>
                {currentProfile.height}
              </div>
            )}
            
            {currentPhotoIndex === 3 && currentProfile.religion && (
              <div className="!text-white/95 text-lg font-semibold flex items-center gap-1">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                {currentProfile.religion}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <button
              onClick={handleLike}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)'
              }}
              aria-label="Like"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </button>
            
            <button
              onClick={handleChat}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)'
              }}
              aria-label="Chat"
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </button>
          </div>

          {/* Photo Navigation */}
          {currentProfile.photos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {currentProfile.photos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPhotoIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </PhotoCarouselWithGestures>
      </div>

      {/* Solid black section below photo - only show when profile menu is closed */}
      {!showProfileMenu && (
        <div 
          className="bg-black/70 rounded-b-lg"
          style={{ height: "60px" }}
        ></div>
      )}

      {/* Compatibility Box */}
      <div className="mt-4 mb-4">
        <div className="bg-zinc-800/60 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-zinc-700/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <h2 className="text-lg font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-fuchsia-600 bg-clip-text text-transparent">
                Compatibility
              </h2>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              {currentProfile.compatibility}%
            </div>
          </div>

          <div className="space-y-3">

            <div className="bg-zinc-800/40 p-4 rounded-lg border border-zinc-700/50">
              <h4 className="font-semibold mb-2 text-blue-400">
                {currentProfile.compatibility >= 90
                  ? "Exceptional Match"
                  : currentProfile.compatibility >= 80
                    ? "Strong Compatibility"
                    : currentProfile.compatibility >= 70
                      ? "Mixed Match"
                      : currentProfile.compatibility >= 60
                        ? "Moderate Compatibility"
                        : "Challenging Match"}
              </h4>
              <p className="text-sm leading-relaxed text-white/80">
                {currentProfile.compatibility >= 90
                  ? "Your astrological energies align beautifully, creating potential for deep understanding and harmony."
                  : currentProfile.compatibility >= 80
                    ? "Your zodiac combinations complement each other well, suggesting great potential for connection."
                    : currentProfile.compatibility >= 70
                      ? "Balanced synergy with room for growth — consistent effort keeps momentum moving forward."
                      : currentProfile.compatibility >= 60
                        ? "Your zodiac signs have some challenges but also opportunities for learning from each other."
                        : "Your astrological energies may clash, but with understanding, you can learn from your differences."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About Me Box */}
      {currentProfile.aboutMe && (
        <div className="mb-4">
          <div className="bg-zinc-800/60 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-zinc-700/30">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                <defs>
                  <linearGradient id="aboutMeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#c084fc', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <path stroke="url(#aboutMeGradient)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">About me</span>
            </h3>
            <p className="text-white text-lg leading-relaxed font-medium">{currentProfile.aboutMe}</p>
          </div>
        </div>
      )}

      {/* Relationship Goals Section */}
      {currentProfile.relationshipGoals && currentProfile.relationshipGoals.length > 0 && (
        <div className="mb-4">
          <div className="bg-zinc-800/60 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-zinc-700/30">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                <defs>
                  <linearGradient id="relationshipGoalsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#c084fc', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <path stroke="url(#relationshipGoalsGradient)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Relationship goals</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentProfile.relationshipGoals.map((goal) => (
                <span
                  key={goal}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-500 text-white"
                >
                  {goal}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Interests Section */}
      {currentProfile.interests && currentProfile.interests.length > 0 && (
        <div className="mb-4">
          <div className="bg-zinc-800/60 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-zinc-700/30">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                <defs>
                  <linearGradient id="interestsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#c084fc', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <path stroke="url(#interestsGradient)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Interests</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentProfile.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-500 text-white"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={prevProfile}
          disabled={currentProfileIndex === 0}
          className="px-4 py-2 rounded-lg bg-zinc-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        
        <div className="text-white/70 text-sm">
          {currentProfileIndex + 1} of {profiles.length}
        </div>
        
        <button
          onClick={nextProfile}
          disabled={currentProfileIndex === profiles.length - 1}
          className="px-4 py-2 rounded-lg bg-zinc-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      </div>

      {/* Swipe Actions */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={handleSwipeLeft}
          className="px-6 py-3 rounded-lg bg-red-500 text-white font-semibold"
        >
          Pass
        </button>
        <button
          onClick={handleSwipeRight}
          className="px-6 py-3 rounded-lg bg-green-500 text-white font-semibold"
        >
          Like
        </button>
      </div>
    </div>
  )
}
