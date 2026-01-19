"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { explainMatchAndScore } from "@/lib/matchExplainAndScore"
import { computeMatchWithNewEngine } from "@/lib/matchEngineAdapter"
import { evaluateMatch } from "@/engine/astromatch-engine"
import { type West, type East } from "@/lib/matchEngine"
import { getWesternSignGlyph, getChineseSignGlyph, capitalizeSign } from "@/lib/zodiacHelpers"
import { getBothSunSignsFromBirthdate, getSavedSunSigns, getDisplaySunSign } from "@/lib/sunSignCalculator"
import { useSunSignSystem } from "@/lib/hooks/useSunSign"
import ConnectionBoxSimple from "@/components/ConnectionBoxSimple"
import type { ConnectionBoxData } from "@/components/ConnectionBoxSimple"

const ArrowLeft = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
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

const EditIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const getWesternSignEmoji = (sign: string): string => {
  const emojiMap: { [key: string]: string } = {
    Aries: "♈",
    Taurus: "♉",
    Gemini: "♊",
    Cancer: "♋",
    Leo: "♌",
    Virgo: "♍",
    Libra: "♎",
    Scorpio: "♏",
    Sagittarius: "♐",
    Capricorn: "♑",
    Aquarius: "♒",
    Pisces: "♓",
  }
  return emojiMap[sign] || ""
}

const getChineseSignEmoji = (sign: string): string => {
  const emojiMap: { [key: string]: string } = {
    Rat: "🐭",
    Ox: "🐂",
    Tiger: "🐅",
    Rabbit: "🐰",
    Dragon: "🐉",
    Snake: "🐍",
    Horse: "🐎",
    Goat: "🐐",
    Monkey: "🐒",
    Rooster: "🐓",
    Dog: "🐕",
    Pig: "🐷",
  }
  return emojiMap[sign] || ""
}

// Test profile data - MUST MATCH the test data in matches/page.tsx
// Updated to match view tab design with all required fields
const testProfiles: Record<string, any> = {
  "1": {
    id: 1,
    name: "Emma",
    age: 28,
    birthdate: "1996-11-30", // Sagittarius-Rabbit (SOULMATE match! - Same trine & compatible Fire+Air)
    westernSign: "Sagittarius",
    easternSign: "Rabbit",
    compatibility: 96,
    photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80",
    ],
    aboutMe: "Love exploring new cafes and practicing yoga. Looking for someone who appreciates deep conversations and spontaneous adventures.",
    aboutMeText: "Love exploring new cafes and practicing yoga. Looking for someone who appreciates deep conversations and spontaneous adventures.",
    occupation: "Marketing Manager",
    city: "Sydney, NSW",
    height: "5'6\"",
    children: "Don't have, want someday",
    religion: "Spiritual",
    prompts: [
      { question: "My ideal Sunday", answer: "Brunch with friends, followed by a long walk on the beach and ending with a good movie." },
      { question: "I'm looking for", answer: "Someone who can make me laugh, values honesty, and loves to explore new places." }
    ],
    distance: 2,
  },
  "2": {
    id: 2,
    name: "Sophia",
    age: 27,
    birthdate: "1997-08-02", // Leo-Tiger (TWIN FLAME match! - Same Fire sign & compatible trine)
    westernSign: "Leo",
    easternSign: "Tiger",
    compatibility: 88,
    photos: [
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=800&q=80",
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=80",
      "https://images.unsplash.com/photo-1485875437342-9b39470b3d95?w=800&q=80",
      "https://images.unsplash.com/photo-1521577352947-9bb58764b69a?w=800&q=80",
      "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&q=80",
      "https://images.unsplash.com/photo-1504439904031-93ded9f93e4e?w=800&q=80",
    ],
    aboutMe: "Creative soul with a passion for art and music. Seeking someone who values authenticity and emotional connection.",
    aboutMeText: "Creative soul with a passion for art and music. Seeking someone who values authenticity and emotional connection.",
    occupation: "Graphic Designer",
    city: "Melbourne, VIC",
    height: "5'7\"",
    children: "Don't have, want someday",
    religion: "Agnostic",
    prompts: [
      { question: "My simple pleasures", answer: "Good coffee, live music, and long conversations under the stars." },
      { question: "What makes me unique", answer: "I can paint with my eyes closed and I speak three languages fluently." }
    ],
    distance: 5,
  },
  "3": {
    id: 3,
    name: "Olivia",
    age: 30,
    birthdate: "1994-03-25", // Aries-Tiger (EXCELLENT match - Fire trine & compatible elements)
    westernSign: "Aries",
    easternSign: "Tiger",
    compatibility: 98,
    photos: [
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&q=80",
      "https://images.unsplash.com/photo-1529911194209-c1b1b0c1e2c1?w=800&q=80",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&q=80",
      "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=800&q=80",
    ],
    aboutMe: "Tech enthusiast who loves innovation and meaningful conversations. Looking for an intellectual and adventurous partner.",
    aboutMeText: "Tech enthusiast who loves innovation and meaningful conversations. Looking for an intellectual and adventurous partner.",
    occupation: "Software Engineer",
    city: "Brisbane, QLD",
    height: "5'8\"",
    children: "Don't have, undecided",
    religion: "Atheist",
    prompts: [
      { question: "I geek out on", answer: "New tech innovations, coding challenges, and science fiction novels." },
      { question: "My love language", answer: "Quality time and deep conversations about everything and nothing." }
    ],
    distance: 8,
  },
  "4": {
    id: 4,
    name: "Sophie",
    age: 27,
    birthdate: "1997-09-23", // Libra-Rooster (INCOMPATIBLE match! - Natural Enemy Rabbit vs Rooster)
    westernSign: "Libra",
    easternSign: "Rooster",
    compatibility: 89,
    photos: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80",
    ],
    aboutMe: "Beach lover and sunset chaser. Believe in living life to the fullest and spreading positive vibes.",
    aboutMeText: "Beach lover and sunset chaser. Believe in living life to the fullest and spreading positive vibes.",
    occupation: "Graphic Designer",
    city: "San Diego, CA",
    height: "5'5\"",
    children: "Don't have, want someday",
    religion: "Spiritual",
    prompts: [
      { question: "My morning routine", answer: "Meditation, green smoothie, and a 5km run to start the day right." },
      { question: "Best way to spend a weekend", answer: "Hiking in nature, trying new healthy recipes, and relaxing with a good book." }
    ],
    distance: 12,
  },
}

export default function ProfileViewPage() {
  const router = useRouter()
  const params = useParams()
  const { theme } = useTheme()
  const sunSignSystem = useSunSignSystem()
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [profileCardRef, setProfileCardRef] = useState<HTMLDivElement | null>(null)
  
  // Connection box state - using new engine
  const [connectionBoxData, setConnectionBoxData] = useState<ConnectionBoxData | null>(null)
  const [userZodiacSigns, setUserZodiacSigns] = useState<{western: string, chinese: string}>({
    western: 'Leo',
    chinese: 'Rabbit'
  })
  const [showMatchDetails, setShowMatchDetails] = useState(false)

  // Full-screen zoom state
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false)
  const [zoomScale, setZoomScale] = useState(1)
  const [zoomPosX, setZoomPosX] = useState(0)
  const [zoomPosY, setZoomPosY] = useState(0)
  const lastZoomDistanceRef = useRef(0)
  const lastTouchPosRef = useRef({ x: 0, y: 0 })
  const lastTwoFingerMidpointRef = useRef({ x: 0, y: 0 })

  const profileId = params?.id as string
  const profile = testProfiles[profileId]
  const profileSunSigns = useMemo(() => {
    if (!profile) {
      return { tropical: null as string | null, sidereal: null as string | null }
    }
    const { tropical, sidereal } = getBothSunSignsFromBirthdate(profile.birthdate)
    return {
      tropical: tropical ?? profile.westernSign ?? null,
      sidereal: sidereal ?? profile.westernSign ?? null,
    }
  }, [profile])
  
  // Load user's zodiac signs from localStorage
  useEffect(() => {
    const loadUserSigns = () => {
      const userWesternSign = localStorage.getItem("userSunSign")
      const userChineseSign = localStorage.getItem("userChineseSign")
      console.log("[Profile View] Loading from localStorage:", { userWesternSign, userChineseSign })
      if (userWesternSign && userChineseSign) {
        setUserZodiacSigns({
          western: capitalizeSign(userWesternSign),
          chinese: capitalizeSign(userChineseSign)
        })
      } else {
        console.warn("[Profile View] No user signs in localStorage, using default Leo-Rabbit")
      }
    }

    loadUserSigns()
    const handleSystemChange = () => loadUserSigns()
    window.addEventListener('sunSignSystemChanged', handleSystemChange)
    return () => window.removeEventListener('sunSignSystemChanged', handleSystemChange)
  }, [])
  
  // Build compatibility box using new match engine
  useEffect(() => {
    if (!userZodiacSigns.western || !userZodiacSigns.chinese || !profile) return
    
    try {
      // Get profile's zodiac signs
      const profileTropical = capitalizeSign(profileSunSigns.tropical || profile.westernSign || 'Gemini') as West
      const profileEastern = capitalizeSign(profile.easternSign || 'Rat')
      const profileDisplayWest = sunSignSystem === 'sidereal'
        ? (profileSunSigns.sidereal || profile.westernSign || 'Gemini')
        : (profileSunSigns.tropical || profile.westernSign || 'Gemini')
      const profileDisplayWestCapitalized = capitalizeSign(profileDisplayWest)
      const savedUserSunSigns = getSavedSunSigns()
      const userDisplayWest = sunSignSystem === 'sidereal'
        ? (savedUserSunSigns.sidereal ?? userZodiacSigns.western)
        : (savedUserSunSigns.tropical ?? userZodiacSigns.western)
      const userDisplayWestCapitalized = capitalizeSign(userDisplayWest)
      
      // Calculate compatibility between user and profile
      const newEngineResult = computeMatchWithNewEngine(
        userZodiacSigns.western as any,
        userZodiacSigns.chinese as any,
        profileTropical as any,
        profileEastern as any
      )

      const astroMatch = evaluateMatch(
        userZodiacSigns.western as any,
        userZodiacSigns.chinese as any,
        profileTropical as any,
        profileEastern as any
      )

      const legacyResult = explainMatchAndScore(
        userZodiacSigns.western as any,
        userZodiacSigns.chinese as any,
        profileTropical as any,
        profileEastern as any
      )
      
      const result = {
        score: newEngineResult.score,
        rankKey: newEngineResult.rankKey,
        rankLabel: newEngineResult.rankLabel,
        emoji: newEngineResult.emoji,
        colorRgb: newEngineResult.colorRgb,
        connectionLabel: newEngineResult.connectionLabel,
        east_relation: newEngineResult.east_relation,
        east_summary: newEngineResult.east_summary,
        west_relation: newEngineResult.west_relation,
        west_summary: newEngineResult.west_summary,
        tagline: newEngineResult.tagline,
        east_tagline: newEngineResult.east_tagline,
        tags: newEngineResult.tags || [],
        hasOverride: legacyResult.hasOverride,
        hasLongform: legacyResult.hasLongform,
        tier: newEngineResult.tier,
      }
      
      const badgeTags = astroMatch.badges?.length ? astroMatch.badges : []
      const combinedTags = Array.from(new Set([...(result.tags ?? []), ...badgeTags]))
      const rankLabelDisplay = `${astroMatch.tier} Match`

      const boxData: ConnectionBoxData = {
        score: astroMatch.score,
        rank: rankLabelDisplay,
        rankLabel: rankLabelDisplay,
        rankKey: result.rankKey,  // Pass the rankKey for theme styling
        emoji: result.emoji,
        colorRgb: newEngineResult.colorRgb || astroMatch.color,  // Use classifier color first
        connectionLabel: result.connectionLabel,
        tagline: result.tagline,
        east_tagline: result.east_tagline || result.tagline,
        tags: combinedTags,
        east_relation: result.east_relation,
        east_summary: result.east_summary,
        west_relation: result.west_relation,
        west_summary: result.west_summary,
        tier: result.tier,
        astroMatch,
        a: {
          west: userDisplayWestCapitalized,
          east: userZodiacSigns.chinese,
          westGlyph: getWesternSignGlyph(userDisplayWestCapitalized),
          eastGlyph: getChineseSignGlyph(userZodiacSigns.chinese)
        },
        b: {
          west: profileDisplayWestCapitalized,
          east: profileEastern,
          westGlyph: getWesternSignGlyph(profileDisplayWestCapitalized),
          eastGlyph: getChineseSignGlyph(profileEastern)
        },
        // Add essentials data
        age: profile.age,
        occupation: profile.occupation,
        city: profile.city,
        distance: profile.distance || 2, // Use profile distance or default to 2 km
        height: profile.height,
        children: profile.children,
        religion: profile.religion,
        // Add profile sections
        aboutMeText: profile.aboutMeText || profile.aboutMe,
        selectedDeepPrompts: profile.prompts?.map((p: any) => p.question) || [],
        deepPromptAnswers: profile.prompts?.reduce((acc: any, p: any) => {
          acc[p.question] = p.answer;
          return acc;
        }, {}) || {},
      }
      
      setConnectionBoxData(boxData)
      console.log('[Profile View] ✨ Enhanced Match Engine Active')
      console.log('[Profile View] Connection box:', boxData)
      console.log('[Profile View] User signs:', userZodiacSigns)
      console.log('[Profile View] Profile signs:', { western: profileDisplayWestCapitalized, eastern: profileEastern })
      console.log('[Profile View] Score breakdown:', result.debug)
    } catch (error) {
      console.error("[Profile View] Error building connection box:", error)
    }
  }, [userZodiacSigns, profile, profileSunSigns, sunSignSystem])

  useEffect(() => {
    if (!profile) {
      router.push("/likes")
    }
  }, [profile, router])

  const forceGreyShadow = (element: HTMLDivElement | null) => {
    if (element) {
      element.style.setProperty(
        "box-shadow",
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
        "important",
      )
    }
  }

  if (!profile) {
    return null
  }

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % profile.photos.length)
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + profile.photos.length) % profile.photos.length)
  }

  // Full-screen zoom handlers
  const getDistance = (touches: TouchList) => {
    const touch1 = touches[0]
    const touch2 = touches[1]
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    )
  }

  const getTwoFingerMidpoint = (touches: TouchList) => {
    const touch1 = touches[0]
    const touch2 = touches[1]
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2
    }
  }

  const handleImageTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Open full-screen zoom modal and start tracking
      e.preventDefault()
      e.stopPropagation()
      setIsZoomModalOpen(true)
      lastZoomDistanceRef.current = getDistance(e.touches)
      lastTwoFingerMidpointRef.current = getTwoFingerMidpoint(e.touches)
    } else if (e.touches.length === 1) {
      // Allow normal scrolling for single finger
      lastTouchPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
  }

  const handleImageTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault()
      e.stopPropagation()
      
      // Open modal if not already open
      if (!isZoomModalOpen) {
        setIsZoomModalOpen(true)
        lastZoomDistanceRef.current = getDistance(e.touches)
        lastTwoFingerMidpointRef.current = getTwoFingerMidpoint(e.touches)
        return
      }
      
      // Handle zoom - Reduced sensitivity for smoother control
      const distance = getDistance(e.touches)
      if (lastZoomDistanceRef.current > 0) {
        const scaleFactor = distance / lastZoomDistanceRef.current
        setZoomScale(prevScale => {
          // Reduced zoom sensitivity for smoother control
          const newScale = prevScale * Math.pow(scaleFactor, 0.8)
          return Math.min(Math.max(1, newScale), 15) // Min 1x, Max 15x
        })
      }
      lastZoomDistanceRef.current = distance

      // Handle two-finger pan - ultra smooth
      const currentMidpoint = getTwoFingerMidpoint(e.touches)
      const deltaX = currentMidpoint.x - lastTwoFingerMidpointRef.current.x
      const deltaY = currentMidpoint.y - lastTwoFingerMidpointRef.current.y
      // Smooth, controlled sensitivity
      setZoomPosX(prev => prev + deltaX * 0.7)
      setZoomPosY(prev => prev + deltaY * 0.7)
      lastTwoFingerMidpointRef.current = currentMidpoint
    } else if (e.touches.length === 1 && isZoomModalOpen && zoomScale > 1) {
      // Pan when zoomed in
      e.preventDefault()
      e.stopPropagation()
      const touch = e.touches[0]
      const deltaX = touch.clientX - lastTouchPosRef.current.x
      const deltaY = touch.clientY - lastTouchPosRef.current.y
      // Reduced sensitivity panning
      setZoomPosX(prev => prev + deltaX * 0.8)
      setZoomPosY(prev => prev + deltaY * 0.8)
      lastTouchPosRef.current = { x: touch.clientX, y: touch.clientY }
    }
    // For single finger without zoom modal open, allow normal scrolling (don't prevent default)
  }

  const handleZoomTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault()
      const distance = getDistance(e.touches)
      if (lastZoomDistanceRef.current > 0) {
        const scaleFactor = distance / lastZoomDistanceRef.current
        setZoomScale(prevScale => {
          // Reduced zoom sensitivity for smoother control
          const newScale = prevScale * Math.pow(scaleFactor, 0.8)
          return Math.min(Math.max(1, newScale), 15) // Min 1x, Max 15x
        })
      }
      lastZoomDistanceRef.current = distance

      // Handle two-finger pan - ultra smooth
      const currentMidpoint = getTwoFingerMidpoint(e.touches)
      const deltaX = currentMidpoint.x - lastTwoFingerMidpointRef.current.x
      const deltaY = currentMidpoint.y - lastTwoFingerMidpointRef.current.y
      // Smooth, controlled sensitivity
      setZoomPosX(prev => prev + deltaX * 0.7)
      setZoomPosY(prev => prev + deltaY * 0.7)
      lastTwoFingerMidpointRef.current = currentMidpoint
    } else if (e.touches.length === 1 && zoomScale > 1) {
      // Pan when zoomed in
      const touch = e.touches[0]
      const deltaX = touch.clientX - lastTouchPosRef.current.x
      const deltaY = touch.clientY - lastTouchPosRef.current.y
      // Reduced sensitivity panning
      setZoomPosX(prev => prev + deltaX * 0.8)
      setZoomPosY(prev => prev + deltaY * 0.8)
      lastTouchPosRef.current = { x: touch.clientX, y: touch.clientY }
    }
  }

  const handleZoomTouchEnd = (e: React.TouchEvent) => {
    // Close modal only when all fingers are lifted
    if (isZoomModalOpen && e.touches.length === 0) {
      setIsZoomModalOpen(false)
      setZoomScale(1)
      setZoomPosX(0)
      setZoomPosY(0)
      lastZoomDistanceRef.current = 0
    } else if (e.touches.length === 1) {
      // Transitioning from two fingers to one - update last touch position
      lastTouchPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
  }

  return (
    <div className="bg-zinc-900 min-h-screen">
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white/80" />
          </button>
          <h1 className="font-semibold text-lg text-white/80">{profile.name}'s Profile</h1>
          <div className="w-9 h-9" />
        </div>

        {/* Profile Content */}
        <div className="mb-8 pb-20 px-1 pt-0">
          <div
            ref={setProfileCardRef}
            className="border-white/20 bg-black/40 border rounded-lg overflow-hidden shadow-lg"
            style={{
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3)",
              transition: "none",
              pointerEvents: "auto",
            }}
            onMouseEnter={(e) => forceGreyShadow(e.currentTarget)}
            onMouseOver={(e) => forceGreyShadow(e.currentTarget)}
            onMouseMove={(e) => forceGreyShadow(e.currentTarget)}
          >
            {/* Photo Carousel */}
            <div className="relative w-full aspect-[4/5] rounded-t-lg overflow-hidden">
              <button
                onClick={() => router.push(`/messages/${profileId}`)}
                className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all shadow-lg"
                aria-label="Chat"
              >
                <MessageCircle className="w-6 h-6 text-white" />
              </button>

              <div
                className="w-full h-full relative cursor-pointer"
                onTouchStart={handleImageTouchStart}
                onTouchMove={handleImageTouchMove}
                onTouchEnd={handleZoomTouchEnd}
                onClick={(e) => {
                  if (!isZoomModalOpen) {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const clickX = e.clientX - rect.left
                    const halfWidth = rect.width / 2

                    if (clickX < halfWidth) {
                      prevPhoto()
                    } else {
                      nextPhoto()
                    }
                  }
                }}
              >
                <img
                  src={profile.photos[currentPhotoIndex] || "/placeholder.svg"}
                  alt={`${profile.name} photo ${currentPhotoIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Name and Age Overlay - Shows on every photo */}
                <div className="absolute bottom-0 left-0 right-0 px-5 py-6">
                  <div 
                    className="!text-white/95 font-semibold mb-1 profile-name-large"
                    style={{ 
                      fontSize: '4rem',
                      lineHeight: '1.1',
                      fontWeight: '700'
                    }}
                  >
                    {profile.name}, {profile.age}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Your Connection Section - Connected to carousel */}
        {connectionBoxData && (
          <div className="px-4 -mt-4 mb-6">
            <ConnectionBoxSimple data={connectionBoxData} />
          </div>
        )}

        {/* Relationship Goals Section */}
        {profile.aboutMe && connectionBoxData && (
          <div className="px-4 mb-6">
            <div className="bg-zinc-800/60 backdrop-blur-sm p-6 rounded-xl -mx-5 shadow-lg">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                  <defs>
                    <linearGradient id="relationshipGoalsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{ stopColor: connectionBoxData.colorRgb, stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: connectionBoxData.colorRgb, stopOpacity: 0.8 }} />
                    </linearGradient>
                  </defs>
                  <path stroke="url(#relationshipGoalsGradient)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span style={{ color: connectionBoxData.colorRgb }}>Relationship goals</span>
              </h3>
              <p className="text-white text-lg leading-relaxed font-medium">{profile.aboutMe}</p>
            </div>
          </div>
        )}
      </div>

      {/* Full-Screen Zoom Modal */}
      {isZoomModalOpen && (
        <div 
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
          onTouchStart={(e) => {
            if (e.touches.length === 2) {
              lastZoomDistanceRef.current = getDistance(e.touches)
            } else if (e.touches.length === 1) {
              lastTouchPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
            }
          }}
          onTouchMove={handleZoomTouchMove}
          onTouchEnd={handleZoomTouchEnd}
          style={{ touchAction: 'none' }}
        >
          <img
            src={profile.photos[currentPhotoIndex] || "/placeholder.svg"}
            alt=""
            className="max-w-full max-h-full object-contain"
            style={{
              transform: `scale(${zoomScale}) translate(${zoomPosX}px, ${zoomPosY}px)`,
              transformOrigin: 'center center',
              transition: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none',
              pointerEvents: 'none'
            }}
          />
        </div>
      )}
    </div>
  )
}
