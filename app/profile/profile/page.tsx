"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTheme } from "@/contexts/ThemeContext"
import {
  getWesternZodiacSign,
  getChineseZodiacSign,
  getWesternSignEmoji,
  getChineseSignEmoji,
} from "@/lib/utils/zodiac-calculator"
import { getChineseZodiacFromDate, CHINESE_ELEMENT_CHAR, type ChineseElement } from "@/lib/chineseZodiac"
import {
  getBothSunSigns,
  saveSunSigns,
  getSavedSunSigns,
  type SunSign,
} from "@/lib/sunSignCalculator"
import { useSunSignSystem } from "@/lib/hooks/useSunSign"
import { explainMatchAndScore } from "@/lib/matchExplainAndScore"
import type { West, East } from "@/lib/matchEngine"
import { getWesternSignGlyph, getChineseSignGlyph, capitalizeSign } from "@/lib/zodiacHelpers"
import { createClient } from "@/lib/supabase/client"
import { fetchUserProfile } from "@/lib/supabase/profileQueries"
import { uploadProfilePhoto, deleteProfilePhoto } from "@/lib/supabase/photoUpload"
import { checkProfileCompletion, getCompletionMessage } from "@/lib/profileCompletion"
import { autoInsight } from "@/lib/insight"
import { INSIGHT_OVERRIDES, type OverrideKey } from "@/data/insight_overrides"
import { getCompleteLongformBlurb, getTierKeyFromScore, createPairId } from "@/data/longformBlurbsComplete"
import ConnectionBoxSimple from "@/components/ConnectionBoxSimple"
import type { ConnectionBoxData } from "@/components/ConnectionBoxSimple"
import { ConnectionBoxNew } from "@/components/ConnectionBoxNew"
import { deriveConnectionOverview } from "@/lib/patternOneLiner"
import { getChinesePatternCode } from "@/lib/matchEngineHelpers"
import { 
  getPatternPillLabel, 
  getPatternHeaderText, 
  getPatternTagline,
  getPatternIcon,
  type ChinesePattern as PatternType
} from "@/lib/astrology/patternLabels"
import { 
  getMatchLabel,
  deriveArchetype,
  hasDamageOverlay,
  applySameSignCap,
  getConnectionTagline,
  type ChineseBasePattern,
  type ChineseOverlayPattern
} from "@/lib/matchLabelEngine"
import {
  type WesternEase,
  getConnectionBlurb
} from "@/lib/connectionUi"
import {
  detectBasePattern,
  detectOverlayPatterns,
  normalizeChineseAnimal,
  type ChineseBasePattern as EnhancedBasePattern
} from "@/lib/matchEngineEnhanced"
import ProfilePhotoCarouselWithRanking from "@/components/ProfilePhotoCarouselWithRanking"
import PhotoCarouselWithGestures from "@/components/PhotoCarouselWithGestures"
import { computeMatchWithNewEngine } from "@/lib/matchEngineAdapter"
import { evaluateMatch } from "@/engine/astromatch-engine"
import { BirthInformationSection } from "@/components/profile/BirthInformationSection"
import { SectionHeader } from "@/components/profile/SectionHeader"
import { GenderSection } from "@/components/profile/GenderSection"
import { OrientationSection } from "@/components/profile/OrientationSection"
import { ChildrenSection } from "@/components/profile/ChildrenSection"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

const ChevronLeft = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="m15 18-6-6 6-6" />
  </svg>
)

const ChevronRight = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="m9 18 6-6-6-6" />
  </svg>
)

const X = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="m18 6-12 12" />
    <path d="m6 6 12 12" />
  </svg>
)

const ChevronDown = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="m6 9 6 6 6-6" />
  </svg>
)

const CameraIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
)

const HeartIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
)

const UserIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const InfoIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
)

const Settings = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
  </svg>
)

const Check = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={className}>
    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Helper function to map match labels to new MatchTier format for ConnectionBoxNew
function mapToNewTier(rankLabel?: string, rank?: string): "Soulmate Match" | "Twin Flame Match" | "Harmonious Match" | "Neutral Match" | "Opposites Attract" | "Difficult Match" {
  const label = (rankLabel || rank || "").toLowerCase();
  
  if (label.includes("soulmate")) return "Soulmate Match";
  if (label.includes("twin flame")) return "Twin Flame Match";
  if (label.includes("excellent") || label.includes("harmonious")) return "Harmonious Match";
  if (label.includes("opposites attract") || label.includes("magnetic opposites")) return "Opposites Attract";
  if (label.includes("difficult") || label.includes("challenging")) return "Difficult Match";
  
  return "Neutral Match";
}

// Helper function to capitalize first letter
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Get pattern gradient colors for border (same as discover section)
function getPatternGradientColors(pattern?: string): { start: string; end: string } {
  if (!pattern) return { start: '#60a5fa', end: '#3b82f6' }; // blue-400 to blue-500 (same as NO_PATTERN)
  
  const patternUpper = pattern.toUpperCase();
  
  // San He - Triple Harmony (Gold)
  if (patternUpper.includes('SAN_HE') || patternUpper.includes('TRIPLE HARMONY')) {
    return { start: '#fbbf24', end: '#f59e0b' }; // amber-400 to amber-500
  }
  
  // Liu He - Six Harmoniess (Purple)
  if (patternUpper.includes('LIU_HE') || patternUpper.includes('SECRET ALLIES')) {
    return { start: '#c084fc', end: '#e879f9' }; // purple-400 to fuchsia-400
  }
  
  // Same Animal (Teal)
  if (patternUpper.includes('SAME_ANIMAL') || patternUpper.includes('SAME ANIMAL') || patternUpper.includes('SAME_SIGN')) {
    return { start: '#2dd4bf', end: '#14b8a6' }; // teal-400 to teal-500
  }
  
  // No Pattern (Blue)
  if (patternUpper.includes('NO_PATTERN') || patternUpper.includes('NO MAJOR')) {
    return { start: '#60a5fa', end: '#3b82f6' }; // blue-400 to blue-500
  }
  
  // Liu Chong - Six Conflicts (Orange)
  if (patternUpper.includes('LIU_CHONG') || patternUpper.includes('SIX CONFLICTS')) {
    return { start: '#fb923c', end: '#f97316' }; // orange-400 to orange-500
  }
  
  // Liu Hai - Six Harms (Rose)
  if (patternUpper.includes('LIU_HAI') || patternUpper.includes('SIX HARMS')) {
    return { start: '#fb7185', end: '#f43f5e' }; // rose-400 to rose-500
  }
  
  // Xing - Punishment (Red)
  if (patternUpper.includes('XING') || patternUpper.includes('PUNISHMENT')) {
    return { start: '#f87171', end: '#ef4444' }; // red-400 to red-500
  }
  
  // Po - Break (Crimson)
  if (patternUpper.includes('PO') || patternUpper.includes('BREAK')) {
    return { start: '#f43f5e', end: '#e11d48' }; // rose-500 to rose-600
  }
  
  // Default neutral (use blue, same as NO_PATTERN)
  return { start: '#60a5fa', end: '#3b82f6' }; // blue-400 to blue-500
}

interface ProfilePageProps {
  pageIndex?: number
  totalPages?: number
  onNavigatePrev?: () => void
  onNavigateNext?: () => void
}

export default function AstrologyProfilePage({
  pageIndex = 0,
  totalPages = 1,
  onNavigatePrev,
  onNavigateNext,
}: ProfilePageProps = {}) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const [activeTab, setActiveTab] = useState<"edit" | "view">("edit")
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [isStaff, setIsStaff] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccessfully, setSavedSuccessfully] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(true)
  const [showStickyNameHeader, setShowStickyNameHeader] = useState(false)
  const [showMatchDropdown, setShowMatchDropdown] = useState(false)
  const [showConnectionProfile, setShowConnectionProfile] = useState(false)
  const [showConnectionElements, setShowConnectionElements] = useState(false) // Toggle connection overview
  const [showInterestsDropdown, setShowInterestsDropdown] = useState(false)
  const [showInterestCategoryDropdowns, setShowInterestCategoryDropdowns] = useState<{[key: string]: boolean}>({})
  const [showLifestyleDropdown, setShowLifestyleDropdown] = useState(false)
  const [showRelationshipGoalsDropdown, setShowRelationshipGoalsDropdown] = useState(false)
  const [showPromptsDropdown, setShowPromptsDropdown] = useState(false)
  const [showRomanticPromptsDropdown, setShowRomanticPromptsDropdown] = useState(false)
  const [showDeepPromptsDropdown, setShowDeepPromptsDropdown] = useState(false)
  const [showDeepPromptsDisplay, setShowDeepPromptsDisplay] = useState(true)
  const [selectedPromptCategory, setSelectedPromptCategory] = useState("Dating")
  const [showMatchDetails, setShowMatchDetails] = useState(false)
  const [showPhotoOverlayMatchDetails, setShowPhotoOverlayMatchDetails] = useState(false)
  
  // Second prompt box - independent state
  const [showDeepPromptsDropdown2, setShowDeepPromptsDropdown2] = useState(false)
  const [selectedPromptCategory2, setSelectedPromptCategory2] = useState("Dating")
  const [selectedDeepPrompts2, setSelectedDeepPrompts2] = useState<string[]>([])
  const [deepPromptAnswers2, setDeepPromptAnswers2] = useState<{[key: string]: string}>({})
  const [showHeightDropdown, setShowHeightDropdown] = useState(false)
  
  // Connection box state - using new engine
  const [connectionBoxData, setConnectionBoxData] = useState<ConnectionBoxData | null>(null)

  // Note: Removed auto-close dropdown when changing photos to allow photo scrolling with dropdown open
  
  // Full-screen zoom state
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false)
  const [zoomScale, setZoomScale] = useState(1)
  const [zoomPosX, setZoomPosX] = useState(0)
  const [zoomPosY, setZoomPosY] = useState(0)
  const lastZoomDistanceRef = useRef(0)
  const lastTouchPosRef = useRef({ x: 0, y: 0 })
  const lastTwoFingerMidpointRef = useRef({ x: 0, y: 0 })
  const aboutMeTextareaRef = useRef<HTMLTextAreaElement>(null)
  const interestsDropdownRef = useRef<HTMLDivElement>(null)
  const relationshipGoalsDropdownRef = useRef<HTMLDivElement>(null)

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
      // Two fingers - prepare for zoom but don't open modal yet
      // Note: Don't call preventDefault here - rely on CSS touch-action instead
      e.stopPropagation()
      lastZoomDistanceRef.current = getDistance(e.touches)
      lastTwoFingerMidpointRef.current = getTwoFingerMidpoint(e.touches)
    } else if (e.touches.length === 1) {
      // Single finger - allow normal scrolling
      lastTouchPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
  }

  const handleImageTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Note: Don't call preventDefault here - rely on CSS touch-action instead
      e.stopPropagation()
      
      // Initialize distance tracking on first two-finger touch
      if (lastZoomDistanceRef.current === 0) {
        lastZoomDistanceRef.current = getDistance(e.touches)
        lastTwoFingerMidpointRef.current = getTwoFingerMidpoint(e.touches)
        return
      }
      
      // Handle zoom - Ultra smooth with modal trigger
      const distance = getDistance(e.touches)
      if (lastZoomDistanceRef.current > 0) {
        const scaleFactor = distance / lastZoomDistanceRef.current
        setZoomScale(prevScale => {
          const newScale = prevScale * Math.pow(scaleFactor, 0.9) // Stronger zoom
          // Open modal when user actually starts zooming (1.05x threshold for smoother transition)
          if (newScale > 1.05 && !isZoomModalOpen) {
            setIsZoomModalOpen(true)
          }
          return Math.min(Math.max(1, newScale), 4)
        })
      }
      lastZoomDistanceRef.current = distance

      // Handle two-finger pan - Excellent responsiveness
      const currentMidpoint = getTwoFingerMidpoint(e.touches)
      const deltaX = currentMidpoint.x - lastTwoFingerMidpointRef.current.x
      const deltaY = currentMidpoint.y - lastTwoFingerMidpointRef.current.y
      setZoomPosX(prev => prev + deltaX * 1.1) // Excellent responsive pan
      setZoomPosY(prev => prev + deltaY * 1.1)
      lastTwoFingerMidpointRef.current = currentMidpoint
    } else if (e.touches.length === 1 && zoomScale > 1) {
      // Pan when zoomed in - Full photo exploration
      // Note: Don't call preventDefault here - rely on CSS touch-action instead
      e.stopPropagation()
      const touch = e.touches[0]
      const deltaX = touch.clientX - lastTouchPosRef.current.x
      const deltaY = touch.clientY - lastTouchPosRef.current.y
      
      // Allow panning to explore the entire zoomed photo
      setZoomPosX(prev => {
        const newX = prev + deltaX * 1.3 // More responsive for better exploration
        // Allow wider panning range based on zoom level
        const maxPan = (zoomScale - 1) * 200 // Increase pan range with zoom
        return Math.max(-maxPan, Math.min(maxPan, newX))
      })
      
      setZoomPosY(prev => {
        const newY = prev + deltaY * 1.3 // More responsive for better exploration
        // Allow wider panning range based on zoom level
        const maxPan = (zoomScale - 1) * 200 // Increase pan range with zoom
        return Math.max(-maxPan, Math.min(maxPan, newY))
      })
      
      lastTouchPosRef.current = { x: touch.clientX, y: touch.clientY }
    }
  }

  const handleZoomTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Note: Don't call preventDefault here - rely on CSS touch-action instead
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
      // Pan when zoomed in - Tinder/Hinge style responsive panning
      const touch = e.touches[0]
      const deltaX = touch.clientX - lastTouchPosRef.current.x
      const deltaY = touch.clientY - lastTouchPosRef.current.y
      // Ultra smooth panning
      setZoomPosX(prev => prev + deltaX * 0.8)
      setZoomPosY(prev => prev + deltaY * 0.8)
      lastTouchPosRef.current = { x: touch.clientX, y: touch.clientY }
    }
  }

  const handleZoomTouchEnd = (e: React.TouchEvent) => {
    // Reset zoom when all fingers are lifted - Smooth return
    if (e.touches.length === 0) {
      // Smooth reset with proper timing
      setZoomScale(1)
      setZoomPosX(0)
      setZoomPosY(0)
      lastZoomDistanceRef.current = 0
      // Close modal with smooth transition
      setTimeout(() => {
        setIsZoomModalOpen(false)
      }, 300) // Match the CSS transition duration for smoothness
    } else if (e.touches.length === 1) {
      // Transitioning from two fingers to one - keep zoom, prepare for pan
      lastTouchPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
  }

  // Listen for custom event to switch to edit tab
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const handleSwitchToEdit = () => {
      setActiveTab("edit")
    }
    window.addEventListener("switchToEditTab", handleSwitchToEdit)
    return () => window.removeEventListener("switchToEditTab", handleSwitchToEdit)
  }, [])

  // Check if user is staff (ADMIN or OWNER) to show Backoffice tab
  useEffect(() => {
    async function checkStaffStatus() {
      try {
        const res = await fetch('/api/admin/check-access')
        const data = await res.json()
        setIsStaff(data.hasAccess && (data.role === 'ADMIN' || data.role === 'OWNER'))
      } catch (error) {
        setIsStaff(false)
      }
    }
    checkStaffStatus()
  }, [])

  // Scroll handler for sticky name header in view tab
  useEffect(() => {
    if (typeof window === 'undefined' || activeTab !== 'view') return
    
    const handleScroll = () => {
      const nameHeader = document.getElementById('profile-view-name-header')
      if (nameHeader) {
        const rect = nameHeader.getBoundingClientRect()
        // Show sticky header when name touches the top of screen
        const shouldShow = rect.top <= 0
        setShowStickyNameHeader(shouldShow)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [activeTab])


  // Close dropdown when clicking outside
  useEffect(() => {
    if (typeof document === 'undefined') return
    
    const handleClickOutside = (event: MouseEvent) => {
      if (showMatchDropdown && !(event.target as Element).closest('.match-dropdown-container')) {
        setShowMatchDropdown(false)
      }
      if (showInterestsDropdown && !(event.target as Element).closest('.interests-dropdown-container')) {
        setShowInterestsDropdown(false)
      }
      if (showRelationshipGoalsDropdown && !(event.target as Element).closest('.relationship-goals-dropdown-container')) {
        setShowRelationshipGoalsDropdown(false)
      }
      if (showPromptsDropdown && !(event.target as Element).closest('.prompts-dropdown-container')) {
        setShowPromptsDropdown(false)
      }
      if (showRomanticPromptsDropdown && !(event.target as Element).closest('.romantic-prompts-dropdown-container')) {
        setShowRomanticPromptsDropdown(false)
      }
      if (showDeepPromptsDropdown && !(event.target as Element).closest('.deep-prompts-dropdown-container')) {
        setShowDeepPromptsDropdown(false)
      }
      if (showDeepPromptsDropdown2 && !(event.target as Element).closest('.deep-prompts-dropdown-container-2')) {
        setShowDeepPromptsDropdown2(false)
      }
      if (showHeightDropdown && !(event.target as Element).closest('.height-dropdown-container')) {
        setShowHeightDropdown(false)
      }
      
      // Close interest category dropdowns when clicking outside
      const hasOpenInterestCategory = Object.values(showInterestCategoryDropdowns).some(isOpen => isOpen)
      if (hasOpenInterestCategory && !(event.target as Element).closest('.interest-category-dropdown-container') && !(event.target as Element).closest('.interest-category-item')) {
        setShowInterestCategoryDropdowns({})
      }
    }

    const hasOpenInterestCategory = Object.values(showInterestCategoryDropdowns).some(isOpen => isOpen)
    if (showMatchDropdown || showInterestsDropdown || showRelationshipGoalsDropdown || showPromptsDropdown || showRomanticPromptsDropdown || showDeepPromptsDropdown || showDeepPromptsDropdown2 || showHeightDropdown || hasOpenInterestCategory) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMatchDropdown, showInterestsDropdown, showRelationshipGoalsDropdown, showPromptsDropdown, showRomanticPromptsDropdown, showDeepPromptsDropdown, showDeepPromptsDropdown2, showHeightDropdown, showInterestCategoryDropdowns])

  const [name, setName] = useState("")

  const [distanceRadius, setDistanceRadius] = useState(50)
  const [ageRange, setAgeRange] = useState<[number, number]>([25, 40])
  
  // Instant messaging settings
  const [allowInstantMessagesConnections, setAllowInstantMessagesConnections] = useState(true)
  const [allowInstantMessagesDiscover, setAllowInstantMessagesDiscover] = useState(true)
  
  // Load instant messaging settings from profile
  useEffect(() => {
    const loadProfileSettings = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) return
        
        const profile = await fetchUserProfile(user.id)
        if (profile) {
          setAllowInstantMessagesConnections(profile.allow_instant_messages_connections ?? true)
          setAllowInstantMessagesDiscover(profile.allow_instant_messages_discover ?? true)
        }
      } catch (error) {
        console.error('[Profile] Error loading instant messaging settings:', error)
      }
    }
    
    loadProfileSettings()
  }, [])

  // Load birth info from localStorage on mount
  const [birthInfo, setBirthInfo] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userBirthInfo')
      if (saved) {
        return JSON.parse(saved)
      }
    }
    return {
      birthdate: "1995-06-15",
      birthTime: "14:30",
      birthPlace: "Los Angeles, CA",
      showBirthTime: true,
    }
  })

  const sunSignSystemPreference = useSunSignSystem()
  const [userSunSigns, setUserSunSigns] = useState<{ tropical: SunSign | null; sidereal: SunSign | null }>(() => {
    if (typeof window === 'undefined') {
      return { tropical: null, sidereal: null }
    }
    return getSavedSunSigns()
  })

  const [calculatedSigns, setCalculatedSigns] = useState({
    westernSign: "Gemini",
    chineseSign: "Pig",
  })

  // State for zodiac signs display
  const [zodiacSigns, setZodiacSigns] = useState<{
    western: string | null
    chinese: string | null
    chineseElement: ChineseElement | null
    westernElement: string | null
  }>({
    western: null,
    chinese: null,
    chineseElement: null,
    westernElement: null
  })

  useEffect(() => {
    const display = sunSignSystemPreference === "sidereal" ? userSunSigns.sidereal : userSunSigns.tropical
    if (display) {
      setZodiacSigns((prev) => ({ ...prev, western: display }))
    }
    
    // Load Chinese element and Western element from localStorage if available
    if (typeof window !== 'undefined') {
      const savedChineseElement = localStorage.getItem("userChineseElement");
      const savedWesternElement = localStorage.getItem("userWesternElement");
      if (savedChineseElement) {
        setZodiacSigns((prev) => ({ ...prev, chineseElement: savedChineseElement as ChineseElement }))
      }
      if (savedWesternElement) {
        setZodiacSigns((prev) => ({ ...prev, westernElement: savedWesternElement }))
      }
    }
  }, [sunSignSystemPreference, userSunSigns])

  // Interests state
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [selectedInterestCategory, setSelectedInterestCategory] = useState("Wellness")
  
  // Load selectedInterests from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const savedInterests = localStorage.getItem("selectedInterests")
    if (savedInterests) {
      try {
        setSelectedInterests(JSON.parse(savedInterests))
      } catch (error) {
        console.error("Error parsing saved interests:", error)
      }
    }
  }, [])
  
  // Save selectedInterests to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    localStorage.setItem("selectedInterests", JSON.stringify(selectedInterests))
  }, [selectedInterests])
  
  const interestCategories = {
    "Wellness": ["Yoga", "Meditation", "Pilates", "Beach Walks", "Healthy Eating", "Gym", "Wellness Retreats", "Vegan", "Vegetarian", "Breath Work", "Spa Days", "Journaling", "Staying Active", "Morning Routines", "Cold Plunge"],
    "Staying In": ["TV Series", "Gardening", "Cooking", "Reading", "Sleep Ins", "Podcasts", "Movie Nights", "Baking", "Video Games", "Streaming", "Arts & Crafts", "Wine Tasting", "Listening to Music"],
    "Going Out": ["Pubs & Bars", "Wine Bars", "Beach Clubs", "Live Music", "Concerts", "Festivals", "Comedy Shows", "Night Markets", "Restaurants", "Brunch Spots", "Fine Dining", "Dancing", "Clubbing", "Karaoke", "Trivia Nights"],
    "Sport & Fitness": ["Surfing", "Running", "Yoga", "Swimming", "Cycling", "Boxing", "CrossFit", "Tennis", "Basketball", "Football", "Soccer", "Golf", "Rock Climbing", "Skating", "Snowboarding", "Skiing"],
    "Adventure & Travels": ["Beach Days", "Camping", "Road Trips", "Bushwalking", "Kayaking", "Paddle Boarding", "Fishing", "Photography", "Backpacking", "Weekend Getaways", "Tropical Destinations", "City Breaks", "Mountain Escapes", "Island Hopping", "Scuba Diving", "Snorkeling", "Safari Adventures", "Food Tourism", "Cultural Exploration", "Solo Travel", "Hiking"]
  }

  const [showCalendar, setShowCalendar] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(5) // June (0-indexed)
  const [calendarYear, setCalendarYear] = useState(1995)
  const [showYearPicker, setShowYearPicker] = useState(false)
  const calendarRef = useRef<HTMLDivElement>(null)

  const [selectedMonth, setSelectedMonth] = useState(6)
  const [selectedDay, setSelectedDay] = useState(15)
  const [selectedYear, setSelectedYear] = useState(1995)

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const years = Array.from({ length: 80 }, (_, i) => 2024 - i)

  useEffect(() => {
    if (birthInfo.birthdate) {
      const [year, month, day] = birthInfo.birthdate.split("-").map(Number)
      setSelectedYear(year)
      setSelectedMonth(month)
      setSelectedDay(day)
      setCalendarMonth(month - 1)
      setCalendarYear(year)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false)
      }
    }

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showCalendar])

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const handleDateSelect = (day: number) => {
    const formattedDate = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    setBirthInfo((prev) => ({ ...prev, birthdate: formattedDate }))
    setSelectedDay(day)
    setSelectedMonth(calendarMonth + 1)
    setSelectedYear(calendarYear)
    setShowCalendar(false)
    setShowYearPicker(false)
  }

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11)
      setCalendarYear(calendarYear - 1)
    } else {
      setCalendarMonth(calendarMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0)
      setCalendarYear(calendarYear + 1)
    } else {
      setCalendarMonth(calendarMonth + 1)
    }
  }

  const handleYearSelect = (year: number) => {
    setCalendarYear(year)
    setShowYearPicker(false)
  }

  const yearPickerYears = Array.from({ length: 71 }, (_, i) => 2010 - i)

  const formatDisplayDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-")
    return `${Number.parseInt(day)} ${months[Number.parseInt(month) - 1]} ${year}`
  }

  const handleScroll = (
    ref: React.RefObject<HTMLDivElement>,
    setter: (value: number) => void,
    values: number[] | string[],
  ) => {
    if (!ref.current) return
    const scrollTop = ref.current.scrollTop
    const itemHeight = 48
    const index = Math.round(scrollTop / itemHeight)
    const value = typeof values[index] === "string" ? index + 1 : (values[index] as number)
    setter(value)
  }

  const [genderOrientation, setGenderOrientation] = useState({
    gender: "Man",
    interestedIn: "Women",
    showMeTo: "Women",
  })

  const [bio, setBio] = useState(
    "Adventure seeker with a passion for hiking and stargazing. Gemini sun, Scorpio moon. Looking for someone to explore the cosmos with.",
  )

  const [visibilitySettings, setVisibilitySettings] = useState({
    showOccupation: true,
    showHeight: true,
    showChildren: true,
    showLocation: true, // Added location visibility setting
  })

  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [selectedOrganizedInterests, setSelectedOrganizedInterests] = useState<{[category: string]: string[]}>({})
  const [selectedLifestyleOptions, setSelectedLifestyleOptions] = useState<string[]>([])
  const [selectedFoods, setSelectedFoods] = useState<string[]>([])
  const [selectedRelationshipGoals, setSelectedRelationshipGoals] = useState<string[]>([])
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([])
  const [promptAnswers, setPromptAnswers] = useState<{[key: string]: string}>({})
  const [selectedRomanticPrompts, setSelectedRomanticPrompts] = useState<string[]>([])
  const [romanticPromptAnswers, setRomanticPromptAnswers] = useState<{[key: string]: string}>({})
  const [selectedDeepPrompts, setSelectedDeepPrompts] = useState<string[]>([])
  const [deepPromptAnswers, setDeepPromptAnswers] = useState<{[key: string]: string}>({})

  const [aboutMeText, setAboutMeText] = useState("I'm passionate about living life to the fullest and making meaningful connections. I love exploring new places, trying new foods, and having deep conversations about life, dreams, and everything in between. Looking for someone who values authenticity, kindness, and personal growth.")
  const [aboutMeText2, setAboutMeText2] = useState("")
  const [hobbiesDescription, setHobbiesDescription] = useState("")
  const [dreamsText, setDreamsText] = useState("")
  const [photo6Text, setPhoto6Text] = useState("")
  const [selectedHeight, setSelectedHeight] = useState("")
  const [selectedOccupation, setSelectedOccupation] = useState("")
  const [selectedChildrenOption, setSelectedChildrenOption] = useState("")
  const [selectedReligion, setSelectedReligion] = useState("")
  const [showReligion, setShowReligion] = useState(true)
  const [selectedCity, setSelectedCity] = useState("")
  const [cityInput, setCityInput] = useState("")
  const [showCitySuggestions, setShowCitySuggestions] = useState(false)
  const [filteredCities, setFilteredCities] = useState<string[]>([])
  const cityInputRef = useRef<HTMLDivElement>(null)

  // Build self-compatibility box when user signs change using new match engine
  useEffect(() => {
    console.log('[Profile View Tab] Building profile box...')
    console.log('[Profile View Tab] calculatedSigns:', calculatedSigns)
    
    if (calculatedSigns.westernSign && calculatedSigns.chineseSign) {
      try {
        const western = capitalizeSign(calculatedSigns.westernSign) as West
        const eastern = capitalizeSign(calculatedSigns.chineseSign) as East
        
        console.log('[Profile View Tab] Western:', western, 'Eastern:', eastern)
        
        // Calculate self-compatibility using enhanced match engine with overlays and taglines
        const newEngineResult = computeMatchWithNewEngine(
          western,
          eastern,
          western,
          eastern
        )

        const astroMatch = evaluateMatch(
          western,
          eastern,
          western,
          eastern
        )

        // Retain legacy result for override/longform metadata and debugging fallback
        const legacyResult = explainMatchAndScore(
          western,
          eastern,
          western,
          eastern
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
          tags: newEngineResult.tags || [],
          hasOverride: legacyResult.hasOverride,
          hasLongform: legacyResult.hasLongform,
          debugNotes: newEngineResult.notes || [],
          tier: newEngineResult.tier,
        }
        
        console.log('[Profile View Tab] Match result:', result)
        
        // Create normalized pair ID
        const pairId = createPairId(western, eastern, western, eastern)
        
        // Get tier key from score
        const tierKey = getTierKeyFromScore(result.score)
        
        // Try to get longform content for this tier
        const longformContent = getCompleteLongformBlurb(pairId, tierKey)
        
        console.log('[Profile View Tab] Longform lookup:', {
          pairId,
          tierKey,
          score: result.score,
          found: !!longformContent
        })
        
        // Determine which insight to use (priority: longform > override > auto-generated)
        let insight: string | undefined
        let useOverride = false
        
        if (longformContent) {
          // Use longform body as insight
          insight = longformContent.body
          console.log('[Profile View Tab] Using longform body as insight')
        } else {
          // Fall back to override or auto-generated
          const pairKeyStr = `${western.toLowerCase()}_${eastern.toLowerCase()}__${western.toLowerCase()}_${eastern.toLowerCase()}` as OverrideKey
          const override = INSIGHT_OVERRIDES[pairKeyStr]
          
          // Use override if it matches the rank, otherwise use auto-generated insight
          useOverride = override && override.rank === result.rankKey
          insight = useOverride ? override.insight : autoInsight(result)
          
          if (useOverride) {
            console.log('[Profile View Tab] Using override insight')
          } else {
            console.log('[Profile View Tab] Using auto-generated insight')
          }
        }
        
        // Use longform labels if available, otherwise use result labels
        const eastLabel = longformContent?.east_label || result.east_relation
        const eastText = longformContent?.east_text || result.east_summary
        const westLabel = longformContent?.west_label || result.west_relation
        const westText = longformContent?.west_text || result.west_summary
        const headline = longformContent?.headline || result.connectionLabel
        const eastTagline = result.east_tagline || result.tagline
        const overallTagline = longformContent?.tagline || result.tagline
        
        const badgeTags = astroMatch.badges?.length ? astroMatch.badges : []
        const combinedTags = Array.from(new Set([...(result.tags ?? []), ...badgeTags]))
        const rankLabelDisplay = `${astroMatch.tier} Match`

        // Use match label engine to get proper match label and description
        // Normalize Chinese animals for pattern detection
        const animalA = normalizeChineseAnimal(eastern)
        const animalB = normalizeChineseAnimal(eastern) // Same sign for self-compatibility
        
        // Detect patterns
        const { basePattern, sanHeTrineName } = detectBasePattern(animalA, animalB)
        const overlays = detectOverlayPatterns(animalA, animalB)
        
        // Get Western elements
        const getElementFromSign = (sign: string): "Fire" | "Earth" | "Air" | "Water" => {
          const signLower = sign.toLowerCase()
          if (["aries", "leo", "sagittarius"].includes(signLower)) return "Fire"
          if (["taurus", "virgo", "capricorn"].includes(signLower)) return "Earth"
          if (["gemini", "libra", "aquarius"].includes(signLower)) return "Air"
          if (["cancer", "scorpio", "pisces"].includes(signLower)) return "Water"
          return "Fire"
        }
        
        const elementA = getElementFromSign(western)
        const elementB = getElementFromSign(western) // Same sign
        
        // Get element relation
        const getElementRelation = (a: string, b: string): WesternElementRelation => {
          if (a === b) return 'SAME'
          if ((a === "Fire" && b === "Air") || (a === "Air" && b === "Fire")) return 'COMPATIBLE'
          if ((a === "Earth" && b === "Water") || (a === "Water" && b === "Earth")) return 'COMPATIBLE'
          if ((a === "Fire" && b === "Water") || (a === "Water" && b === "Fire")) return 'CLASH'
          if ((a === "Earth" && b === "Air") || (a === "Air" && b === "Earth")) return 'CLASH'
          return 'NEUTRAL'
        }
        
        // Cap score at 68% for same sign pairs (self-compatibility)
        const cappedScore = applySameSignCap(result.score, basePattern as ChineseBasePattern)
        
        // Get archetype and ease for match label
        const archetype = deriveArchetype(basePattern as ChineseBasePattern, overlays as ChineseOverlayPattern[])
        const westernRelation = getElementRelation(elementA, elementB)
        const ease: WesternEase = westernRelation === 'SAME' || westernRelation === 'COMPATIBLE' ? 'EASY' :
                                  westernRelation === 'SEMI_COMPATIBLE' || westernRelation === 'NEUTRAL' ? 'MEDIUM' : 'HARD'
        
        // Get match label using the new match label engine API
        const pillLabel = getMatchLabel(archetype, basePattern as ChineseBasePattern, overlays as ChineseOverlayPattern[], cappedScore)
        
        // Get connection blurb (description)
        const baseTagline = getConnectionBlurb(archetype, ease, basePattern as ChineseBasePattern, overlays as ChineseOverlayPattern[])
        
        // Keep pattern info for display
        const chinesePattern: PatternType = basePattern === "SAME_SIGN" ? "SAME_SIGN" : 
                                          basePattern === "SAN_HE" ? "SAN_HE" :
                                          basePattern === "LIU_HE" ? "LIU_HE" : "NO_PATTERN"
        const patternFullLabel = getPatternHeaderText(chinesePattern)
        const patternEmoji = getPatternIcon(chinesePattern)

        const boxData: ConnectionBoxData = {
          score: cappedScore, // Cap at 68% for same sign pairs (self-compatibility)
          rank: rankLabelDisplay,
          rankLabel: rankLabelDisplay,
          rankKey: result.rankKey,
          emoji: result.emoji,
          colorRgb: newEngineResult.colorRgb || astroMatch.color,  // Use classifier color first
          connectionLabel: headline,
          tagline: overallTagline,
          east_tagline: eastTagline,
          tags: combinedTags,
          insight: insight,
          longformBody: longformContent?.body, // Add longform body
          hasOverride: result.hasOverride,
          hasLongform: !!longformContent,
          east_relation: eastLabel,
          east_summary: eastText,
          west_relation: westLabel,
          west_summary: westText,
          tier: result.tier,
          astroMatch,
          a: {
            west: western,
            east: eastern,
            westGlyph: getWesternSignGlyph(western),
            eastGlyph: getChineseSignGlyph(eastern)
          },
          b: {
            west: western,
            east: eastern,
            westGlyph: getWesternSignGlyph(western),
            eastGlyph: getChineseSignGlyph(eastern)
          },
          // Profile sections
          aboutMeText: aboutMeText || undefined,
          selectedDeepPrompts: selectedDeepPrompts && selectedDeepPrompts.length > 0 ? selectedDeepPrompts : undefined,
          deepPromptAnswers: deepPromptAnswers && Object.keys(deepPromptAnswers).length > 0 ? deepPromptAnswers : undefined,
          selectedRelationshipGoals: selectedRelationshipGoals && selectedRelationshipGoals.length > 0 ? selectedRelationshipGoals : undefined,
          selectedOrganizedInterests: selectedOrganizedInterests && Object.keys(selectedOrganizedInterests).length > 0 ? selectedOrganizedInterests : undefined,
          // Essentials
          age: birthInfo?.birthdate ? (() => {
            const [year, month, day] = birthInfo.birthdate.split("-").map(Number);
            const today = new Date();
            let calculatedAge = today.getFullYear() - year;
            const monthDiff = today.getMonth() + 1 - month;
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
              calculatedAge--;
            }
            return calculatedAge > 0 ? calculatedAge : undefined;
          })() : undefined,
          occupation: selectedOccupation || undefined,
          city: selectedCity || cityInput || undefined,
          distance: 2, // Default distance in km - can be updated with real GPS calculation
          height: selectedHeight || undefined,
          children: selectedChildrenOption || undefined,
          religion: selectedReligion || undefined,
          // Pattern fields for same sign detection
          chinesePattern: chinesePattern,
          pattern: chinesePattern,
          patternFullLabel: patternFullLabel,
          pillLabel: pillLabel,
          baseTagline: baseTagline,
          patternEmoji: patternEmoji,
        }
        
        setConnectionBoxData(boxData)
        console.log('[Profile View Tab] ✨ Complete Longform System Active')
        console.log('[Profile View Tab] Tier:', tierKey)
        console.log('[Profile View Tab] Longform content:', longformContent ? 'YES' : 'NO')
        console.log('[Profile View Tab] Self-compat box:', boxData)
        if (result.debugNotes && result.debugNotes.length > 0) {
          console.log('[Profile View Tab] Score breakdown notes:', result.debugNotes)
        }
      } catch (error) {
        console.error("[Profile View] Error building self-compat box:", error)
      }
    }
  }, [calculatedSigns, aboutMeText, selectedDeepPrompts, deepPromptAnswers, selectedRelationshipGoals, selectedOccupation, selectedCity, cityInput, selectedHeight, selectedChildrenOption, selectedReligion, birthInfo])

  // Major cities list for autocomplete
  const majorCities = [
    // Australian Cities - New South Wales
    "Sydney, NSW",
    "Newcastle, NSW",
    "Wollongong, NSW",
    "Central Coast, NSW",
    "Maitland, NSW",
    "Wagga Wagga, NSW",
    "Albury, NSW",
    "Port Macquarie, NSW",
    "Tamworth, NSW",
    "Orange, NSW",
    "Dubbo, NSW",
    "Bathurst, NSW",
    "Lismore, NSW",
    "Nowra, NSW",
    "Coffs Harbour, NSW",
    "Queanbeyan, NSW",
    "Broken Hill, NSW",
    "Armidale, NSW",
    "Goulburn, NSW",
    "Griffith, NSW",

    // Australian Cities - Victoria
    "Melbourne, VIC",
    "Geelong, VIC",
    "Ballarat, VIC",
    "Bendigo, VIC",
    "Shepparton, VIC",
    "Mildura, VIC",
    "Warrnambool, VIC",
    "Wodonga, VIC",
    "Traralgon, VIC",
    "Wangaratta, VIC",
    "Horsham, VIC",
    "Sale, VIC",
    "Echuca, VIC",
    "Moe, VIC",
    "Morwell, VIC",
    "Colac, VIC",
    "Swan Hill, VIC",
    "Hamilton, VIC",

    // Australian Cities - Queensland
    "Brisbane, QLD",
    "Gold Coast, QLD",
    "Sunshine Coast, QLD",
    "Townsville, QLD",
    "Cairns, QLD",
    "Toowoomba, QLD",
    "Mackay, QLD",
    "Rockhampton, QLD",
    "Bundaberg, QLD",
    "Hervey Bay, QLD",
    "Gladstone, QLD",
    "Maryborough, QLD",
    "Mount Isa, QLD",
    "Gympie, QLD",
    "Emerald, QLD",
    "Warwick, QLD",
    "Kingaroy, QLD",
    "Dalby, QLD",
    "Ipswich, QLD",
    "Logan, QLD",
    "Redland Bay, QLD",

    // Australian Cities - South Australia
    "Adelaide, SA",
    "Mount Gambier, SA",
    "Whyalla, SA",
    "Murray Bridge, SA",
    "Port Lincoln, SA",
    "Port Augusta, SA",
    "Port Pirie, SA",
    "Victor Harbor, SA",
    "Gawler, SA",
    "Mount Barker, SA",

    // Australian Cities - Western Australia
    "Perth, WA",
    "Mandurah, WA",
    "Bunbury, WA",
    "Kalgoorlie, WA",
    "Geraldton, WA",
    "Albany, WA",
    "Broome, WA",
    "Busselton, WA",
    "Rockingham, WA",
    "Karratha, WA",
    "Port Hedland, WA",
    "Esperance, WA",
    "Carnarvon, WA",

    // Australian Cities - Tasmania
    "Hobart, TAS",
    "Launceston, TAS",
    "Devonport, TAS",
    "Burnie, TAS",
    "Ulverstone, TAS",
    "Kingston, TAS",

    // Australian Cities - Northern Territory
    "Darwin, NT",
    "Alice Springs, NT",
    "Palmerston, NT",
    "Katherine, NT",

    // Australian Cities - Australian Capital Territory
    "Canberra, ACT",

    // International Cities
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Houston, TX",
    "Phoenix, AZ",
    "Philadelphia, PA",
    "San Antonio, TX",
    "San Diego, CA",
    "Dallas, TX",
    "San Jose, CA",
    "Austin, TX",
    "Jacksonville, FL",
    "Fort Worth, TX",
    "Columbus, OH",
    "Charlotte, NC",
    "San Francisco, CA",
    "Indianapolis, IN",
    "Seattle, WA",
    "Denver, CO",
    "Washington, DC",
    "Boston, MA",
    "Nashville, TN",
    "Detroit, MI",
    "Portland, OR",
    "Las Vegas, NV",
    "Miami, FL",
    "Atlanta, GA",
    "Minneapolis, MN",
    "Orlando, FL",
    "Tampa, FL",
    "London, UK",
    "Paris, France",
    "Berlin, Germany",
    "Madrid, Spain",
    "Rome, Italy",
    "Amsterdam, Netherlands",
    "Barcelona, Spain",
    "Vienna, Austria",
    "Dublin, Ireland",
    "Brussels, Belgium",
    "Toronto, Canada",
    "Vancouver, Canada",
    "Montreal, Canada",
    "Calgary, Canada",
    "Ottawa, Canada",
    "Auckland, New Zealand",
    "Tokyo, Japan",
    "Osaka, Japan",
    "Seoul, South Korea",
    "Singapore",
    "Hong Kong",
    "Bangkok, Thailand",
    "Dubai, UAE",
    "Mumbai, India",
    "Delhi, India",
    "Bangalore, India",
    "Mexico City, Mexico",
    "São Paulo, Brazil",
    "Rio de Janeiro, Brazil",
    "Buenos Aires, Argentina",
    "Lima, Peru",
  ].sort()

  // Initialize photos as empty - will load from Supabase
  const [photos, setPhotos] = useState([
    { id: 1, src: "", hasImage: false },
    { id: 2, src: "", hasImage: false },
    { id: 3, src: "", hasImage: false },
    { id: 4, src: "", hasImage: false },
    { id: 5, src: "", hasImage: false },
    { id: 6, src: "", hasImage: false },
  ])

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Force placeholder color to be dull - runs after every render
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    
    const applyPlaceholderStyle = () => {
      const styleId = 'about-me-placeholder-style'
      let styleElement = document.getElementById(styleId) as HTMLStyleElement
      
      if (!styleElement) {
        styleElement = document.createElement('style')
        styleElement.id = styleId
        document.head.appendChild(styleElement)
      }
      
      styleElement.textContent = `
        textarea.about-me-textarea::placeholder,
        .light textarea.about-me-textarea::placeholder,
        .dark textarea.about-me-textarea::placeholder {
          color: #5a5a5a !important;
          opacity: 1 !important;
          -webkit-text-fill-color: #5a5a5a !important;
        }
        textarea.about-me-textarea::-webkit-input-placeholder,
        .light textarea.about-me-textarea::-webkit-input-placeholder,
        .dark textarea.about-me-textarea::-webkit-input-placeholder {
          color: #5a5a5a !important;
          opacity: 1 !important;
          -webkit-text-fill-color: #5a5a5a !important;
        }
        textarea.about-me-textarea::-moz-placeholder,
        .light textarea.about-me-textarea::-moz-placeholder,
        .dark textarea.about-me-textarea::-moz-placeholder {
          color: #5a5a5a !important;
          opacity: 1 !important;
        }
        textarea.about-me-textarea:-ms-input-placeholder,
        .light textarea.about-me-textarea:-ms-input-placeholder,
        .dark textarea.about-me-textarea:-ms-input-placeholder {
          color: #5a5a5a !important;
          opacity: 1 !important;
        }
        /* Force birthdate display font size */
        .birthdate-display {
          font-size: 20px !important;
          font-weight: 400 !important;
          line-height: 1.5 !important;
        }
        /* Desktop: Ensure date input matches other inputs exactly */
        @media (min-width: 641px) {
          div:has(input[type="date"].occupation-input) {
            width: 100% !important;
            max-width: 100% !important;
          }
          input[type="date"].occupation-input {
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
            box-sizing: border-box !important;
          }
        }
        /* Mobile ONLY: constrained width to match zodiac box */
        @media (max-width: 640px) {
          input[type="date"].occupation-input {
            width: calc(100% - 20px) !important;
            max-width: calc(100% - 20px) !important;
            margin: 0 auto !important;
            display: block !important;
            height: 48px !important;
            line-height: 48px !important;
            padding: 12px 16px !important;
          }
          select.gender-select,
          select.orientation-select {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            display: block !important;
            height: 48px !important;
            line-height: 48px !important;
            padding: 12px 16px !important;
            font-size: 1.25rem !important;
          }
        }
        /* Hide native date text on all devices - NO SIZE CHANGES */
        input[type="date"].occupation-input {
          color: transparent !important;
          -webkit-text-fill-color: transparent !important;
        }
        input[type="date"].occupation-input::-webkit-datetime-edit {
          display: none !important;
        }
        input[type="date"].occupation-input::-webkit-calendar-picker-indicator {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100% !important;
          height: 100% !important;
          opacity: 0;
          cursor: pointer;
          z-index: 2;
          margin: 0 !important;
          padding: 0 !important;
        }
      `
    }
    
    applyPlaceholderStyle()
    // Re-apply after a short delay to override any late-loading styles
    const timeout = setTimeout(applyPlaceholderStyle, 100)
    return () => clearTimeout(timeout)
  })

  // Load profile data from Supabase when component mounts
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const supabase = createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        console.log('[Profile] Loading profile data...')
        console.log('[Profile] User:', user ? `${user.id.substring(0, 8)}...` : 'none')
        console.log('[Profile] User error:', userError)
        
        if (!user) {
          console.log('[Profile] No user logged in')
          return
        }

        // Fetch user profile
        console.log('[Profile] Fetching profile for user:', user.id)
        const profile = await fetchUserProfile(user.id)
        
        console.log('[Profile] Profile result:', profile ? 'Found' : 'NULL')
        if (profile) {
          console.log('[Profile] Profile has photos:', profile.photos?.length || 0)
        }
        
        if (!profile) {
          console.log('[Profile] No profile found - this user may not have completed onboarding')
          return
        }
        
        // Load photos
        if (profile.photos && Array.isArray(profile.photos)) {
          // Map Supabase photos to component format
          const loadedPhotos = [
            { id: 1, src: profile.photos[0] || "", hasImage: !!profile.photos[0] },
            { id: 2, src: profile.photos[1] || "", hasImage: !!profile.photos[1] },
            { id: 3, src: profile.photos[2] || "", hasImage: !!profile.photos[2] },
            { id: 4, src: profile.photos[3] || "", hasImage: !!profile.photos[3] },
            { id: 5, src: profile.photos[4] || "", hasImage: !!profile.photos[4] },
            { id: 6, src: profile.photos[5] || "", hasImage: !!profile.photos[5] },
          ]
          
          setPhotos(loadedPhotos)
          
          // Save first photo to localStorage for nav bar
          if (loadedPhotos[0]?.hasImage && loadedPhotos[0].src) {
            localStorage.setItem("profilePhoto1", loadedPhotos[0].src)
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('profilePhotoUpdated'))
            }
          }
        }
        
        // Load name
        if (profile.display_name) {
          setName(profile.display_name)
          if (typeof window !== 'undefined') {
            localStorage.setItem("userFullName", profile.display_name)
          }
        }
        
        // Load about me / bio
        if (profile.bio) {
          setAboutMeText(profile.bio)
        }
        
        // Load occupation
        if (profile.occupation) {
          setSelectedOccupation(profile.occupation)
        }
        
        // Load city/location
        if (profile.city) {
          setSelectedCity(profile.city)
          setCityInput(profile.city)
        } else if (profile.location_name) {
          setSelectedCity(profile.location_name)
          setCityInput(profile.location_name)
        }
        
        // Load height
        if (profile.height) {
          setSelectedHeight(profile.height)
        }
        
        // Load children preference
        if (profile.children_preference) {
          setSelectedChildrenOption(profile.children_preference)
        }
        
        // Load religion
        if (profile.religion) {
          setSelectedReligion(profile.religion)
        }
        
        // Load relationship goals
        if (profile.relationship_goals && Array.isArray(profile.relationship_goals)) {
          setSelectedRelationshipGoals(profile.relationship_goals)
        }
        
        // Load interests
        if (profile.interests && Array.isArray(profile.interests)) {
          // Organize interests by category
          const organized: {[category: string]: string[]} = {}
          Object.entries(interestCategories).forEach(([category, categoryInterests]) => {
            const matched = categoryInterests.filter(interest => profile.interests.includes(interest))
            if (matched.length > 0) {
              organized[category] = matched
            }
          })
          setSelectedOrganizedInterests(organized)
          setSelectedInterests(profile.interests)
        }
        
        // Load birthdate
        if (profile.birthdate) {
          setBirthInfo(prev => ({
            ...prev,
            birthdate: profile.birthdate
          }))
          const [year, month, day] = profile.birthdate.split("-").map(Number)
          if (year && month && day) {
            setSelectedYear(year)
            setSelectedMonth(month)
            setSelectedDay(day)
            setCalendarMonth(month - 1)
            setCalendarYear(year)
          }
        }
        
        // Load gender and orientation
        if (profile.gender) {
          setGenderOrientation(prev => ({
            ...prev,
            gender: profile.gender
          }))
        }
        if (profile.orientation) {
          setGenderOrientation(prev => ({
            ...prev,
            orientation: profile.orientation,
            interestedIn: profile.orientation,
            showMeTo: profile.orientation
          }))
        }
        
        // Load age range preferences
        if (profile.age_min && profile.age_max) {
          setAgeRange([profile.age_min, profile.age_max])
        }
        
        // Load distance radius
        if (profile.distance_radius !== undefined && profile.distance_radius !== null) {
          setDistanceRadius(profile.distance_radius)
        }
        
        // Load visibility settings
        if (profile.show_occupation !== undefined) {
          setVisibilitySettings(prev => ({
            ...prev,
            showOccupation: profile.show_occupation
          }))
        }
        if (profile.show_height !== undefined) {
          setVisibilitySettings(prev => ({
            ...prev,
            showHeight: profile.show_height
          }))
        }
        if (profile.show_children !== undefined) {
          setVisibilitySettings(prev => ({
            ...prev,
            showChildren: profile.show_children
          }))
        }
        if (profile.show_location !== undefined) {
          setVisibilitySettings(prev => ({
            ...prev,
            showLocation: profile.show_location
          }))
        }
        
      } catch (error) {
        console.error('[Profile] Error loading profile data:', error)
      }
    }
    
    loadProfileData()
  }, [])

  const handlePhotoUpload = async (photoId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Photo size must be less than 5MB")
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file")
      return
    }

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert("Please log in to upload photos")
        return
      }

      // Upload photo to Supabase Storage
      const photoIndex = photoId - 1 // Convert 1-6 to 0-5
      const uploadResult = await uploadProfilePhoto(file, user.id, photoIndex)
      
      if (!uploadResult.success || !uploadResult.url) {
        alert(uploadResult.error || "Failed to upload photo")
        return
      }

      // Get current profile to update photos array
      const profile = await fetchUserProfile(user.id)
      const currentPhotos = profile?.photos || []
      const updatedPhotos = [...currentPhotos]
      updatedPhotos[photoIndex] = uploadResult.url

      // Update profile in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ photos: updatedPhotos })
        .eq('id', user.id)

      if (updateError) {
        console.error('[Photo Upload] Error updating profile:', updateError)
        alert("Photo uploaded but failed to save to profile")
        return
      }

      // Update local state
      const updatedPhotoState = photos.map((photo) =>
        photo.id === photoId ? { ...photo, src: uploadResult.url!, hasImage: true } : photo,
      )
      setPhotos(updatedPhotoState)
      localStorage.setItem("userPhotos", JSON.stringify(updatedPhotoState))
      
      // If this is the first photo (id: 1), save it separately for the nav bar
      if (photoId === 1) {
        localStorage.setItem("profilePhoto1", uploadResult.url)
        // Dispatch event to update navigation bar
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('profilePhotoUpdated'))
        }
      }
    } catch (error) {
      console.error('[Photo Upload] Error:', error)
      alert("Failed to upload photo. Please try again.")
    }
  }

  const handlePhotoDelete = async (photoId: number) => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert("Please log in to delete photos")
        return
      }

      const photoIndex = photoId - 1 // Convert 1-6 to 0-5
      const photoToDelete = photos[photoIndex]
      
      // Delete from Supabase Storage if it's a URL (not base64)
      if (photoToDelete?.src && photoToDelete.src.startsWith('http')) {
        await deleteProfilePhoto(photoToDelete.src)
      }

      // Get current profile to update photos array
      const profile = await fetchUserProfile(user.id)
      const currentPhotos = profile?.photos || []
      const updatedPhotos = [...currentPhotos]
      updatedPhotos[photoIndex] = null // Set to null instead of removing to maintain array length

      // Update profile in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ photos: updatedPhotos })
        .eq('id', user.id)

      if (updateError) {
        console.error('[Photo Delete] Error updating profile:', updateError)
        alert("Failed to delete photo from profile")
        return
      }

      // Update local state
      const updatedPhotoState = photos.map((photo) => (photo.id === photoId ? { ...photo, src: "", hasImage: false } : photo))
      setPhotos(updatedPhotoState)
      if (typeof window !== 'undefined') {
        localStorage.setItem("userPhotos", JSON.stringify(updatedPhotoState))
        
        // If deleting the first photo, also remove it from nav bar
        if (photoId === 1) {
          localStorage.removeItem("profilePhoto1")
          window.dispatchEvent(new Event('profilePhotoUpdated'))
        }
      }
    } catch (error) {
      console.error('[Photo Delete] Error:', error)
      alert("Failed to delete photo. Please try again.")
    }
  }

  const triggerFileInput = (index: number) => {
    fileInputRefs.current[index]?.click()
  }

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  const userProfile = {
    name: "Alex",
    age: 28,
    westernSign: calculatedSigns.westernSign,
    easternSign: calculatedSigns.chineseSign,
    occupation: "Software Engineer",
    height: "180 cm",
    children: "Don't have children",
  }

  const relationshipGoalsOptions = [
    "Soul mate",
    "Best friend",
    "Intimate connection",
    "Confidant",
    "Partner in crime",
    "Traveling together",
    "Adventures",
    "Weekend getaways",
    "Road trips",
    "Beach walks",
    "Romantic dinners",
    "Cozy nights in",
    "Date nights",
    "Sunset watching",
    "Movie marathons",
    "Cooking together",
    "Settling down",
    "Lazy Sundays",
    "Short-term relationship",
    "Long-term relationship",
    "Marriage",
    "Pet parenting",
    "Building a future",
    "Shared dreams"
  ]

  const promptsOptions = [
    "I get way too competitive about",
    "Most spontaneous thing I've done",
    "My unpopular opinion is",
    "I'm secretly really into",
    "Something surprising about me",
    "My weird flex",
    "I'll always defend",
    "Hot take on",
    "Thing that makes me laugh",
    "Nerdiest thing about me",
    "I still can't believe I",
    "My comfort food is",
    "If I could relive one day",
    "Something that changed my perspective",
    "I'm working on being better at",
    "Random fact about me",
    "My go-to karaoke song",
    "Thing I'm passionate about",
    "My biggest pet peeve",
    "Weirdest place I've been"
  ]

  const romanticPromptsOptions = [
    "Let's argue about the best coffee order",
    "My hidden talent is",
    "I'm weirdly good at",
    "Sunday morning ritual",
    "My last spontaneous adventure",
    "Best meal I've ever had",
    "I could talk for hours about",
    "My guilty pleasure is",
    "Most random skill I have",
    "If I could master anything",
    "My go-to karaoke jam",
    "Weekend plan that never fails",
    "Playlist that defines my vibe",
    "I'm lowkey obsessed with",
    "Best advice I've ever received",
    "My unpopular food opinion",
    "Dream adventure I'm planning",
    "Thing I'll drop everything for",
    "My party trick is",
    "I dare you to ask me about"
  ]

  const deepPromptsOptions = {
    "Dating": [
      "My ideal hangout spot",
      "Best way to impress me",
      "Adventure I'm keen for",
      "My perfect weekend looks like",
      "First date that'd win me over",
      "I'm attracted to people who",
      "Green flag I look for",
      "Deal breaker for me",
      "Spontaneous or planned"
    ],
    "About Me": [
      "My signature dish is",
      "Two truths and a lie",
      "I'm weirdly good at",
      "Sunday morning ritual",
      "My guilty pleasure is",
      "I'm lowkey obsessed with",
      "I show I care by",
      "Thing I'll drop everything for",
      "My party trick is",
      "Unpopular opinion I have",
      "My comfort zone is"
    ],
    "My Type": [
      "I vibe with someone who",
      "Energy I'm drawn to",
      "Personality trait I love",
      "Sense of humor I appreciate",
      "I respect people who",
      "Quality that matters most",
      "I click with people who",
      "Values that align with mine",
      "My ideal adventure partner",
      "I appreciate someone who"
    ],
    "Fun": [
      "My most chaotic trait is",
      "I would rate my cooking skills a",
      "My weirdest habit is",
      "I can't help but laugh when",
      "I'm awkwardly into",
      "My most random skill is",
      "The time I embarrassed myself was",
      "I'm weirdly competitive about",
      "My most controversial take is",
      "The best way to butter me up is",
      "I have a conspiracy theory about"
    ]
  }


  const hobbiesOptions = [
    "Art",
    "Films",
    "Sports",
    "Fishing",
    "Gym",
    "Surfing",
    "AFL",
    "NRL",
    "Rugby",
    "Cricket",
    "Tennis",
    "Swimming",
    "Hiking",
    "Cycling",
    "Boxing",
    "Yoga",
    "Running",
    "Golf",
    "Painting",
    "Drawing",
    "Photography",
    "Music",
    "Guitar",
    "Fashion",
    "Design",
    "Writing",
    "Shopping",
    "Nightlife",
    "Live music",
    "Festivals",
    "Concerts",
    "Comedy",
    "Karaoke",
    "Dancing",
    "Beach",
    "BBQ",
    "Coffee",
    "Beach life",
    "Bushwalking",
    "Camping",
    "4WD",
    "Outback",
    "Wine",
    "Coffee culture",
    "Cooking",
    "Fine dining",
    "Asian cuisine",
    "Gaming",
    "Streaming",
    "Podcasts",
    "Netflix",
    "Tech",
    "Travel",
    "Adventure",
    "Gardening",
    "Investing",
    "Career",
    "Art galleries",
    "Sailing",
    "Meditation",
    "Wellness",
    "Photography",
    "Business",
    "Entrepreneurship",
    "Sustainability",
    "Politics",
    "Property",
    "Family",
    "Pets",
    "Dancing",
    "Interior design",
    "DIY",
    "Pilates",
    "Barre",
    "Ballet",
    "Skincare",
    "Beauty",
    "Makeup",
    "Spa days",
    "Brunch",
    "Reading",
    "Book clubs",
    "Journaling",
    "Crafts",
    "Knitting",
    "Sewing",
    "Thrifting",
    "Vintage shopping",
    "Baking",
    "Pottery",
    "Jewelry making",
    "Candle making",
    "Floristry",
    "Home decor",
    "Antiques",
    "Theater",
    "Musicals",
    "Ballet dancing",
    "Salsa",
    "Zumba",
    "Horseback riding",
    "Ice skating",
    "Roller skating",
    "Astrology",
    "Tarot",
    "Crystals",
    "Self-care",
    "Aromatherapy",
    "Herbalism",
    "Plant care",
    "Farmer's markets",
    "Volunteer work",
    "Charity",
    "Teaching",
    "Mentoring",
    "Romance novels",
    "Reality TV",
    "True crime"
  ]

  const foodOptions = [
    // Most Popular Cuisines
    "Italian",
    "Mexican",
    "Thai",
    "Japanese",
    "Vietnamese",
    "Indian",
    "Greek",
    "Lebanese",
    "Korean",
    "Chinese",
    
    // Tech & Modern
    "Gaming",
    "Streaming",
    "Podcasts",
    "TikTok",
    "Instagram",
    "YouTube",
    "Netflix",
    "Spotify",
    "Crypto",
    "Tech",
    "Startups",
    "Entrepreneurship",
    "Travel",
    "Adventure",
    "Exploration",
    
    // Mature Lifestyle (30-40s)
    "Wine tasting",
    "Fine dining",
    "Cooking",
    "Gardening",
    "Home improvement",
    "Investing",
    "Real estate",
    "Career",
    "Networking",
    "Mentoring",
    "Volunteering",
    "Charity work",
    "Book clubs",
    "Art galleries",
    "Museums",
    "Theatre",
    "Classical music",
    "Jazz",
    "Antiques",
    "Collecting",
    "Wine collecting",
    "Whiskey",
    "Craft cocktails",
    "Coffee roasting",
    "Brewing",
    "Sailing",
    "Golf",
    "Tennis",
    "Squash",
    "Pilates",
    "Meditation",
    "Wellness",
    "Health",
    "Nutrition",
    "Fitness",
    "Running",
    "Marathons",
    "Triathlons",
    "Cycling",
    "Hiking",
    "Bushwalking",
    "Camping",
    "4WD",
    "Outback",
    "Travel",
    "International travel",
    "Luxury travel",
    "Adventure travel",
    "Cultural experiences",
    "Language learning",
    "Photography",
    "Videography",
    "Blogging",
    "Writing",
    "Journalism",
    "Public speaking",
    "Leadership",
    "Management",
    "Consulting",
    "Freelancing",
    "Remote work",
    "Digital nomad",
    "Sustainability",
    "Environment",
    "Climate action",
    "Social justice",
    "Politics",
    "Current events",
    "News",
    "Economics",
    "Finance",
    "Investment",
    "Property",
    "Business",
    "Entrepreneurship",
    "Innovation",
    "Technology",
    "AI",
    "Blockchain",
    "Cryptocurrency",
    "Trading",
    "Stocks",
    "Real estate",
    "Property investment",
    "Home ownership",
    "Family",
    "Parenting",
    "Kids",
    "Pets",
    "Dogs",
    "Cats",
    "Horses",
    "Equestrian",
    "Horse riding",
    "Polo",
    "Racing",
    "Betting",
    "Gambling",
    "Casinos",
    "Poker",
    "Bridge",
    "Chess",
    "Board games",
    "Trivia",
    "Quiz nights",
    "Pub trivia",
    "Comedy",
    "Stand-up",
    "Improv",
    "Drama",
    "Acting",
    "Dancing",
    "Ballroom",
    "Latin",
    "Salsa",
    "Bachata",
    "Swing",
    "Jazz",
    "Blues",
    "Rock",
    "Indie",
    "Electronic",
    "House",
    "Techno",
    "Trance",
    "Drum and bass",
    "Hip hop",
    "Rap",
    "R&B",
    "Soul",
    "Funk",
    "Disco",
    "80s",
    "90s",
    "Retro",
    "Vintage",
    "Fashion",
    "Style",
    "Design",
    "Interior design",
    "Architecture",
    "Art",
    "Contemporary art",
    "Modern art",
    "Street art",
    "Graffiti",
    "Sculpture",
    "Ceramics",
    "Pottery",
    "Woodworking",
    "Carpentry",
    "DIY",
    "Home renovation",
    "Gardening",
    "Landscaping",
    "Permaculture",
    "Sustainability",
    "Organic",
    "Farm to table",
    "Local produce",
    "Farmers markets",
    "Community gardens",
    "Urban farming",
    "Beekeeping",
    "Chickens",
    "Homesteading",
    "Self-sufficiency",
    "Minimalism",
    "Decluttering",
    "Organization",
    "Productivity",
    "Time management",
    "Goal setting",
    "Personal development",
    "Self-improvement",
    "Mindfulness",
    "Meditation",
    "Yoga",
    "Pilates",
    "Tai chi",
    "Qi gong",
    "Martial arts",
    "Self-defense",
    "Boxing",
    "MMA",
    "Jiu-jitsu",
    "Karate",
    "Taekwondo",
    "Kung fu",
    "Capoeira",
    "Parkour",
    "Free running",
    "Rock climbing",
    "Bouldering",
    "Mountaineering",
    "Alpine",
    "Skiing",
    "Snowboarding",
    "Ice skating",
    "Hockey",
    "Ice hockey",
    "Field hockey",
    "Lacrosse",
    "Water polo",
    "Polo",
    "Equestrian",
    "Horse riding",
    "Dressage",
    "Show jumping",
    "Eventing",
    "Racing",
    "Thoroughbred",
    "Harness racing",
    "Greyhound racing",
    "Dog racing",
    "Cockfighting",
    "Bullfighting",
    "Rodeo",
    "Roping",
    "Riding",
    "Horseback riding",
    "Trail riding",
    "Endurance riding",
    "Dressage",
    "Show jumping",
    "Eventing",
    "Polo",
    "Horse racing",
    "Thoroughbred racing",
    "Harness racing",
    "Greyhound racing",
    "Dog racing",
    "Cockfighting",
    "Bullfighting",
    "Rodeo",
    "Roping",
    "Riding",
    "Horseback riding",
    "Trail riding",
    "Endurance riding",
    "Dressage",
    "Show jumping",
    "Eventing",
    "Polo",
    "Horse racing",
    "Thoroughbred racing",
    "Harness racing",
    "Greyhound racing",
    "Dog racing",
    "Cockfighting",
    "Bullfighting",
    "Rodeo",
    "Roping",
    "Riding",
    "Horseback riding",
    "Trail riding",
    "Endurance riding"
  ]

  const heightOptions = Array.from({ length: 71 }, (_, i) => `${150 + i} cm`)

  const childrenOptions = ["Have children", "Don't have children"]

  const religionOptions = [
    "Agnostic",
    "Atheist",
    "Buddhist",
    "Catholic",
    "Christian",
    "Hindu",
    "Jewish",
    "Muslim",
    "Sikh",
    "Spiritual",
    "Other",
    "Prefer not to say"
  ]

  const handleHobbyToggle = (hobby: string) => {
    let updatedOptions: string[]
    if (selectedOptions.includes(hobby)) {
      updatedOptions = selectedOptions.filter((opt) => opt !== hobby)
    } else {
      if (selectedOptions.length >= 6) return
      updatedOptions = [...selectedOptions, hobby]
    }
    setSelectedOptions(updatedOptions)
    if (typeof window !== 'undefined') {
      localStorage.setItem("hobbiesAndInterests", JSON.stringify(updatedOptions))
    }
  }

  const handleRelationshipGoalToggle = (goal: string) => {
    let updatedGoals: string[]
    if (selectedRelationshipGoals.includes(goal)) {
      updatedGoals = selectedRelationshipGoals.filter((opt) => opt !== goal)
    } else {
      if (selectedRelationshipGoals.length >= 6) return
      updatedGoals = [...selectedRelationshipGoals, goal]
    }
    // Filter out "Life Companion" before saving
    updatedGoals = updatedGoals.filter(g => g !== "Life Companion" && g !== "Life companion")
    setSelectedRelationshipGoals(updatedGoals)
    if (typeof window !== 'undefined') {
      localStorage.setItem("relationshipGoals", JSON.stringify(updatedGoals))
    }
  }

  const handlePromptToggle = (prompt: string) => {
    let updatedPrompts: string[]
    if (selectedPrompts.includes(prompt)) {
      updatedPrompts = selectedPrompts.filter((opt) => opt !== prompt)
      // Remove the answer when removing the prompt
      const updatedAnswers = { ...promptAnswers }
      delete updatedAnswers[prompt]
      setPromptAnswers(updatedAnswers)
      if (typeof window !== 'undefined') {
        localStorage.setItem("promptAnswers", JSON.stringify(updatedAnswers))
      }
    } else {
      // Only allow one prompt - replace the current one
      updatedPrompts = [prompt]
      // Close the dropdown after selection
      setShowPromptsDropdown(false)
    }
    setSelectedPrompts(updatedPrompts)
    if (typeof window !== 'undefined') {
      localStorage.setItem("prompts", JSON.stringify(updatedPrompts))
    }
  }

  const handlePromptAnswerChange = (prompt: string, answer: string) => {
    const updatedAnswers = { ...promptAnswers, [prompt]: answer }
    setPromptAnswers(updatedAnswers)
    if (typeof window !== 'undefined') {
      localStorage.setItem("promptAnswers", JSON.stringify(updatedAnswers))
    }
  }

  const handleRomanticPromptToggle = (prompt: string) => {
    let updatedPrompts: string[]
    if (selectedRomanticPrompts.includes(prompt)) {
      updatedPrompts = selectedRomanticPrompts.filter((opt) => opt !== prompt)
      // Remove the answer when removing the prompt
      const updatedAnswers = { ...romanticPromptAnswers }
      delete updatedAnswers[prompt]
      setRomanticPromptAnswers(updatedAnswers)
      if (typeof window !== 'undefined') {
        localStorage.setItem("romanticPromptAnswers", JSON.stringify(updatedAnswers))
      }
    } else {
      // Only allow one prompt - replace the current one
      updatedPrompts = [prompt]
      // Close the dropdown after selection
      setShowRomanticPromptsDropdown(false)
    }
    setSelectedRomanticPrompts(updatedPrompts)
    if (typeof window !== 'undefined') {
      localStorage.setItem("romanticPrompts", JSON.stringify(updatedPrompts))
    }
  }

  const handleRomanticPromptAnswerChange = (prompt: string, answer: string) => {
    const updatedAnswers = { ...romanticPromptAnswers, [prompt]: answer }
    setRomanticPromptAnswers(updatedAnswers)
    if (typeof window !== 'undefined') {
      localStorage.setItem("romanticPromptAnswers", JSON.stringify(updatedAnswers))
    }
  }

  const handleDeepPromptToggle = (prompt: string) => {
    let updatedPrompts: string[]
    if (selectedDeepPrompts.includes(prompt)) {
      updatedPrompts = selectedDeepPrompts.filter((opt) => opt !== prompt)
      // Remove the answer when removing the prompt
      const updatedAnswers = { ...deepPromptAnswers }
      delete updatedAnswers[prompt]
      setDeepPromptAnswers(updatedAnswers)
      if (typeof window !== 'undefined') {
        localStorage.setItem("deepPromptAnswers", JSON.stringify(updatedAnswers))
      }
    } else {
      // Only allow one prompt - replace the current one
      updatedPrompts = [prompt]
      // Close the dropdown after selection
      setShowDeepPromptsDropdown(false)
    }
    setSelectedDeepPrompts(updatedPrompts)
    if (typeof window !== 'undefined') {
      localStorage.setItem("deepPrompts", JSON.stringify(updatedPrompts))
    }
  }

  const handleDeepPromptAnswerChange = (prompt: string, answer: string) => {
    const updatedAnswers = { ...deepPromptAnswers, [prompt]: answer }
    setDeepPromptAnswers(updatedAnswers)
    if (typeof window !== 'undefined') {
      localStorage.setItem("deepPromptAnswers", JSON.stringify(updatedAnswers))
    }
  }

  // Handler functions for second prompt box
  const handleDeepPromptToggle2 = (prompt: string) => {
    let updatedPrompts: string[]
    if (selectedDeepPrompts2.includes(prompt)) {
      updatedPrompts = selectedDeepPrompts2.filter((opt) => opt !== prompt)
      // Remove the answer when removing the prompt
      const updatedAnswers = { ...deepPromptAnswers2 }
      delete updatedAnswers[prompt]
      setDeepPromptAnswers2(updatedAnswers)
      if (typeof window !== 'undefined') {
        localStorage.setItem("deepPromptAnswers2", JSON.stringify(updatedAnswers))
      }
    } else {
      // Only allow one prompt - replace the current one
      updatedPrompts = [prompt]
      // Close the dropdown after selection
      setShowDeepPromptsDropdown2(false)
    }
    setSelectedDeepPrompts2(updatedPrompts)
    if (typeof window !== 'undefined') {
      localStorage.setItem("selectedDeepPrompts2", JSON.stringify(updatedPrompts))
    }
  }

  const handleDeepPromptAnswerChange2 = (prompt: string, answer: string) => {
    const updatedAnswers = { ...deepPromptAnswers2, [prompt]: answer }
    setDeepPromptAnswers2(updatedAnswers)
    if (typeof window !== 'undefined') {
      localStorage.setItem("deepPromptAnswers2", JSON.stringify(updatedAnswers))
    }
  }

  const handleFoodToggle = (food: string) => {
    let updatedOptions: string[]
    if (selectedFoods.includes(food)) {
      updatedOptions = selectedFoods.filter((opt) => opt !== food)
    } else {
      if (selectedFoods.length >= 8) return
      updatedOptions = [...selectedFoods, food]
    }
    setSelectedFoods(updatedOptions)
    if (typeof window !== 'undefined') {
      localStorage.setItem("favouriteFoods", JSON.stringify(updatedOptions))
    }
  }



  const handleHobbiesDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setHobbiesDescription(newText)
    if (newText.trim() && typeof window !== 'undefined') {
      localStorage.setItem("hobbiesDescription", newText.trim())
    }
  }

  const handleAboutMeTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setAboutMeText(newText)
    if (newText.trim() && typeof window !== 'undefined') {
      localStorage.setItem("aboutMeText", newText.trim())
    }
  }

  const handleAboutMeText2Change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setAboutMeText2(newText)
    if (newText.trim() && typeof window !== 'undefined') {
      localStorage.setItem("aboutMeText2", newText.trim())
    }
  }

  const handleDreamsTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setDreamsText(newText)
    if (newText.trim() && typeof window !== 'undefined') {
      localStorage.setItem("dreamsText", newText.trim())
    }
  }

  const handlePhoto6TextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setPhoto6Text(newText)
    if (newText.trim() && typeof window !== 'undefined') {
      localStorage.setItem("photo6Text", newText.trim())
    }
  }

  const handleOccupationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOccupation = e.target.value
    setSelectedOccupation(newOccupation)
    if (typeof window !== 'undefined') {
      localStorage.setItem("userOccupation", newOccupation)
    }
  }

  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCityInput(value)

    if (value.trim().length > 0) {
      const filtered = majorCities.filter((city) => city.toLowerCase().includes(value.toLowerCase())).slice(0, 5) // Show max 5 suggestions
      setFilteredCities(filtered)
      setShowCitySuggestions(true)
    } else {
      setFilteredCities([])
      setShowCitySuggestions(false)
    }
  }

  const handleCitySelect = (city: string) => {
    setSelectedCity(city)
    setCityInput(city)
    setShowCitySuggestions(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem("userCity", city)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityInputRef.current && !cityInputRef.current.contains(event.target as Node)) {
        setShowCitySuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleHeightSelect = (height: string) => {
    setSelectedHeight(height)
    if (typeof window !== 'undefined') {
      localStorage.setItem("userHeight", height)
    }
  }

  const handleChildrenOptionSelect = (option: string) => {
    setSelectedChildrenOption(option)
    if (typeof window !== 'undefined') {
      localStorage.setItem("childrenPreference", option)
    }
  }

  const handleReligionSelect = (religion: string) => {
    setSelectedReligion(religion)
    if (typeof window !== 'undefined') {
      localStorage.setItem("userReligion", religion)
    }
  }

  const handleDistanceChange = (value: number) => {
    setDistanceRadius(value)
    if (typeof window !== 'undefined') {
      localStorage.setItem("distanceRadius", value.toString())
    }
  }

  const handleAgeRangeChange = (newRange: [number, number]) => {
    setAgeRange(newRange)
    if (typeof window !== 'undefined') {
      localStorage.setItem("ageRange", JSON.stringify(newRange))
    }
    
    // Save to backend
    saveAgePreferences(newRange[0], newRange[1])
  }

  const saveAgePreferences = async (ageMin: number, ageMax: number) => {
    try {
      // Get current user ID (you may need to adjust this based on your auth setup)
      const userId = localStorage.getItem('userId') || 'mock-user-id' // Fallback for design mode
      
      await fetch("/api/preferences/age", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          user_id: userId, 
          age_min: ageMin, 
          age_max: ageMax 
        })
      })
    } catch (error) {
      console.error('Failed to save age preferences:', error)
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const savedName = localStorage.getItem("userFullName")
    if (savedName) {
      setName(savedName)
    }

    const savedAboutMe = localStorage.getItem("aboutMeText")
    if (savedAboutMe) setAboutMeText(savedAboutMe)

    const savedAboutMe2 = localStorage.getItem("aboutMeText2")
    if (savedAboutMe2) setAboutMeText2(savedAboutMe2)

    const savedHobbiesDescription = localStorage.getItem("hobbiesDescription")
    if (savedHobbiesDescription) setHobbiesDescription(savedHobbiesDescription)

    const savedDreamsText = localStorage.getItem("dreamsText")
    if (savedDreamsText) setDreamsText(savedDreamsText)

    const savedPhoto6Text = localStorage.getItem("photo6Text")
    if (savedPhoto6Text) setPhoto6Text(savedPhoto6Text)

    const savedSelectedOptions = localStorage.getItem("hobbiesAndInterests")
    if (savedSelectedOptions) {
      try {
        const parsedOptions = JSON.parse(savedSelectedOptions)
        if (Array.isArray(parsedOptions)) setSelectedOptions(parsedOptions)
      } catch (error) {
        console.log("[v0] Error parsing saved hobbies and interests:", error)
      }
    }

    const savedOrganizedInterests = localStorage.getItem("selectedOrganizedInterests")
    if (savedOrganizedInterests) {
      try {
        const parsedOrganizedInterests = JSON.parse(savedOrganizedInterests)
        if (typeof parsedOrganizedInterests === 'object' && parsedOrganizedInterests !== null) {
          setSelectedOrganizedInterests(parsedOrganizedInterests)
        }
      } catch (error) {
        console.log("[v0] Error parsing saved organized interests:", error)
      }
    }

    const savedLifestyleOptions = localStorage.getItem("selectedLifestyleOptions")
    if (savedLifestyleOptions) {
      try {
        const parsedLifestyleOptions = JSON.parse(savedLifestyleOptions)
        if (Array.isArray(parsedLifestyleOptions)) {
          setSelectedLifestyleOptions(parsedLifestyleOptions)
        }
      } catch (error) {
        console.log("[v0] Error parsing saved lifestyle options:", error)
      }
    }

    const savedFoodOptions = localStorage.getItem("favouriteFoods")
    if (savedFoodOptions) {
      try {
        const parsedOptions = JSON.parse(savedFoodOptions)
        if (Array.isArray(parsedOptions)) setSelectedFoods(parsedOptions)
      } catch (error) {
        console.log("[v0] Error parsing saved favourite foods:", error)
      }
    }

    const savedRelationshipGoals = localStorage.getItem("relationshipGoals")
    if (savedRelationshipGoals) {
      try {
        const parsedGoals = JSON.parse(savedRelationshipGoals)
        if (Array.isArray(parsedGoals)) {
          // Filter out "Life Companion" and any goals not in the current options list
          const validGoals = parsedGoals.filter((goal: string) => 
            goal !== "Life Companion" && 
            goal !== "Life companion" && 
            relationshipGoalsOptions.includes(goal)
          )
          setSelectedRelationshipGoals(validGoals)
        }
      } catch (error) {
        console.log("[v0] Error parsing saved relationship goals:", error)
      }
    }

    const savedHeight = localStorage.getItem("userHeight")
    if (savedHeight) setSelectedHeight(savedHeight)

    const savedOccupation = localStorage.getItem("userOccupation")
    if (savedOccupation) setSelectedOccupation(savedOccupation)

    const savedCity = localStorage.getItem("userCity")
    if (savedCity) {
      setSelectedCity(savedCity)
      setCityInput(savedCity)
    }

    const savedChildren = localStorage.getItem("childrenPreference")
    if (savedChildren) setSelectedChildrenOption(savedChildren)

    const savedReligion = localStorage.getItem("userReligion")
    if (savedReligion) setSelectedReligion(savedReligion)

    const savedRadius = localStorage.getItem("distanceRadius")
    if (savedRadius) {
      setDistanceRadius(Number(savedRadius))
    }

    const savedAgeRange = localStorage.getItem("ageRange")
    if (savedAgeRange) {
      try {
        setAgeRange(JSON.parse(savedAgeRange))
      } catch (error) {
        console.log("[v0] Error parsing saved age range:", error)
      }
    }

    const savedGenderOrientation = localStorage.getItem("genderOrientation")
    if (savedGenderOrientation) {
      try {
        const parsedGenderOrientation = JSON.parse(savedGenderOrientation)
        setGenderOrientation(parsedGenderOrientation)
      } catch (error) {
        console.log("[v0] Error parsing saved gender orientation:", error)
      }
    }

    const savedShowOccupation = localStorage.getItem("showOccupation")
    if (savedShowOccupation !== null) {
      try {
        setVisibilitySettings((prev) => ({
          ...prev,
          showOccupation: JSON.parse(savedShowOccupation),
        }))
      } catch (error) {
        console.log("[v0] Error parsing showOccupation:", error)
      }
    }

    const savedShowHeight = localStorage.getItem("showHeight")
    if (savedShowHeight !== null) {
      try {
        setVisibilitySettings((prev) => ({
          ...prev,
          showHeight: JSON.parse(savedShowHeight),
        }))
      } catch (error) {
        console.log("[v0] Error parsing showHeight:", error)
      }
    }

    const savedShowChildren = localStorage.getItem("showChildren")
    if (savedShowChildren !== null) {
      try {
        setVisibilitySettings((prev) => ({
          ...prev,
          showChildren: JSON.parse(savedShowChildren),
        }))
      } catch (error) {
        console.log("[v0] Error parsing showChildren:", error)
      }
    }

    const savedShowLocation = localStorage.getItem("showLocation")
    if (savedShowLocation !== null) {
      try {
        setVisibilitySettings((prev) => ({
          ...prev,
          showLocation: JSON.parse(savedShowLocation),
        }))
      } catch (error) {
        console.log("[v0] Error parsing showLocation:", error)
      }
    }

    const savedShowReligion = localStorage.getItem("showReligion")
    if (savedShowReligion !== null) {
      try {
        setShowReligion(JSON.parse(savedShowReligion))
      } catch (error) {
        console.log("[v0] Error parsing showReligion:", error)
      }
    }

    const savedPrompts = localStorage.getItem("prompts")
    if (savedPrompts) {
      try {
        const parsedPrompts = JSON.parse(savedPrompts)
        if (Array.isArray(parsedPrompts)) setSelectedPrompts(parsedPrompts)
      } catch (error) {
        console.log("[v0] Error parsing saved prompts:", error)
      }
    }

    const savedPromptAnswers = localStorage.getItem("promptAnswers")
    if (savedPromptAnswers) {
      try {
        const parsedAnswers = JSON.parse(savedPromptAnswers)
        if (typeof parsedAnswers === 'object' && parsedAnswers !== null) {
          setPromptAnswers(parsedAnswers)
        }
      } catch (error) {
        console.log("[v0] Error parsing saved prompt answers:", error)
      }
    }

    const savedRomanticPrompts = localStorage.getItem("romanticPrompts")
    if (savedRomanticPrompts) {
      try {
        const parsedPrompts = JSON.parse(savedRomanticPrompts)
        if (Array.isArray(parsedPrompts)) setSelectedRomanticPrompts(parsedPrompts)
      } catch (error) {
        console.log("[v0] Error parsing saved romantic prompts:", error)
      }
    }

    const savedRomanticPromptAnswers = localStorage.getItem("romanticPromptAnswers")
    if (savedRomanticPromptAnswers) {
      try {
        const parsedAnswers = JSON.parse(savedRomanticPromptAnswers)
        if (typeof parsedAnswers === 'object' && parsedAnswers !== null) {
          setRomanticPromptAnswers(parsedAnswers)
        }
      } catch (error) {
        console.log("[v0] Error parsing saved romantic prompt answers:", error)
      }
    }

    const savedDeepPrompts = localStorage.getItem("deepPrompts")
    if (savedDeepPrompts) {
      try {
        const parsedPrompts = JSON.parse(savedDeepPrompts)
        if (Array.isArray(parsedPrompts)) setSelectedDeepPrompts(parsedPrompts)
      } catch (error) {
        console.log("[v0] Error parsing saved deep prompts:", error)
      }
    }

    const savedDeepPromptAnswers = localStorage.getItem("deepPromptAnswers")
    if (savedDeepPromptAnswers) {
      try {
        const parsedAnswers = JSON.parse(savedDeepPromptAnswers)
        if (typeof parsedAnswers === 'object' && parsedAnswers !== null) {
          setDeepPromptAnswers(parsedAnswers)
        }
      } catch (error) {
        console.log("[v0] Error parsing saved deep prompt answers:", error)
      }
    }

    const savedDeepPromptsDisplay = localStorage.getItem("showDeepPromptsDisplay")
    if (savedDeepPromptsDisplay) {
      try {
        setShowDeepPromptsDisplay(JSON.parse(savedDeepPromptsDisplay))
      } catch (error) {
        console.log("[v0] Error parsing saved deep prompts display:", error)
      }
    }

    // Load second prompt box data
    const savedDeepPrompts2 = localStorage.getItem("selectedDeepPrompts2")
    if (savedDeepPrompts2) {
      try {
        const parsedPrompts = JSON.parse(savedDeepPrompts2)
        if (Array.isArray(parsedPrompts)) setSelectedDeepPrompts2(parsedPrompts)
      } catch (error) {
        console.log("[v0] Error parsing saved deep prompts 2:", error)
      }
    }

    const savedDeepPromptAnswers2 = localStorage.getItem("deepPromptAnswers2")
    if (savedDeepPromptAnswers2) {
      try {
        const parsedAnswers = JSON.parse(savedDeepPromptAnswers2)
        if (typeof parsedAnswers === 'object' && parsedAnswers !== null) {
          setDeepPromptAnswers2(parsedAnswers)
        }
      } catch (error) {
        console.log("[v0] Error parsing saved deep prompt answers 2:", error)
      }
    }
  }, [birthInfo, sunSignSystemPreference])

  const toggleOccupationVisibility = () => {
    const newValue = !visibilitySettings.showOccupation
    setVisibilitySettings((prev) => ({
      ...prev,
      showOccupation: newValue,
    }))
    if (typeof window !== 'undefined') {
      localStorage.setItem("showOccupation", JSON.stringify(newValue))
    }
  }

  const toggleHeightVisibility = () => {
    const newValue = !visibilitySettings.showHeight
    setVisibilitySettings((prev) => ({
      ...prev,
      showHeight: newValue,
    }))
    if (typeof window !== 'undefined') {
      localStorage.setItem("showHeight", JSON.stringify(newValue))
    }
  }

  const handleOrganizedInterestToggle = (category: string, interest: string) => {
    const currentCategoryInterests = selectedOrganizedInterests[category] || []
    let updatedInterests: string[]
    
    if (currentCategoryInterests.includes(interest)) {
      updatedInterests = currentCategoryInterests.filter((item) => item !== interest)
    } else {
      // Limit to 6 selections per category
      if (currentCategoryInterests.length >= 6) return
      updatedInterests = [...currentCategoryInterests, interest]
    }
    
    const updatedSelectedOrganizedInterests = {
      ...selectedOrganizedInterests,
      [category]: updatedInterests
    }
    
    setSelectedOrganizedInterests(updatedSelectedOrganizedInterests)
    
    // Also update the flat selectedInterests array to keep it in sync
    const flattenedInterests = Object.values(updatedSelectedOrganizedInterests).flat()
    setSelectedInterests(flattenedInterests)
    
    if (typeof window !== 'undefined') {
      localStorage.setItem("selectedOrganizedInterests", JSON.stringify(updatedSelectedOrganizedInterests))
      localStorage.setItem("selectedInterests", JSON.stringify(flattenedInterests))
    }
  }

  // Lifestyle options
  const lifestyleOptions = [
    "Beach life", "City living", "Outdoor enthusiast", "Foodie culture", "Coffee lover", 
    "Fitness focused", "Work-life balance", "Sustainability conscious", "Tech-savvy", 
    "Social media active", "Travel lover", "Pet parent", "Wine connoisseur", 
    "Weekend warrior", "Early riser", "Night owl", 
    "Minimalist", "Maximalist", "Plant parent", "Van life", 
    "Solo living", "Family oriented", "Career focused", "Entrepreneurial",
    "Brunch regular", "Rooftop vibes", "Beach walks", "City exploring", "Local spots", "Hidden gems",
    "Weekend adventures", "Spontaneous plans", "Chill vibes", "Good energy", "Positive mindset", "Growth focused"
  ]

  const handleLifestyleToggle = (lifestyle: string) => {
    let updatedOptions: string[]
    if (selectedLifestyleOptions.includes(lifestyle)) {
      updatedOptions = selectedLifestyleOptions.filter((opt) => opt !== lifestyle)
    } else {
      // Limit to 6 selections
      if (selectedLifestyleOptions.length >= 6) return
      updatedOptions = [...selectedLifestyleOptions, lifestyle]
    }
    setSelectedLifestyleOptions(updatedOptions)
    if (typeof window !== 'undefined') {
      localStorage.setItem("selectedLifestyleOptions", JSON.stringify(updatedOptions))
    }
  }

  const toggleInterestCategoryDropdown = (category: string) => {
    setShowInterestCategoryDropdowns(prev => {
      const isCurrentlyOpen = prev[category]
      
      // If closing the current category, just close it
      if (isCurrentlyOpen) {
        return {
          ...prev,
          [category]: false
        }
      }
      
      // If opening a category, close all others and open only this one
      const allClosed = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false
        return acc
      }, {} as {[key: string]: boolean})
      
      return {
        ...allClosed,
        [category]: true
      }
    })
  }

  const toggleChildrenVisibility = () => {
    const newValue = !visibilitySettings.showChildren
    setVisibilitySettings((prev) => ({
      ...prev,
      showChildren: newValue,
    }))
    if (typeof window !== 'undefined') {
      localStorage.setItem("showChildren", JSON.stringify(newValue))
    }
  }

  const toggleLocationVisibility = () => {
    const newValue = !visibilitySettings.showLocation
    setVisibilitySettings((prev) => ({
      ...prev,
      showLocation: newValue,
    }))
    if (typeof window !== 'undefined') {
      localStorage.setItem("showLocation", JSON.stringify(newValue))
    }
  }

  const toggleReligionVisibility = () => {
    const newValue = !showReligion
    setShowReligion(newValue)
    if (typeof window !== 'undefined') {
      localStorage.setItem("showReligion", JSON.stringify(newValue))
    }
  }

  // CHANGE: Updated to pass month and day to getChineseZodiacSign for accurate calculation
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    try {
      // Check if birthdate is properly formatted
      if (!birthInfo.birthdate || !birthInfo.birthdate.includes("-")) {
        console.warn("[v0] Invalid birthdate format:", birthInfo.birthdate)
        return
      }
      
      const dateParts = birthInfo.birthdate.split("-")
      if (dateParts.length !== 3) {
        console.warn("[v0] Invalid birthdate format:", birthInfo.birthdate)
        return
      }
      
      const [year, month, day] = dateParts.map(Number)
      
      // Validate the parsed numbers
      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        console.warn("[v0] Invalid birthdate numbers:", { year, month, day })
        return
      }
      
      const western = getWesternZodiacSign(month, day)
      const chinese = getChineseZodiacSign(year, month, day)
      
      // Calculate Chinese element from birthdate
      const birthDate = new Date(year, month - 1, day)
      const chineseZodiac = getChineseZodiacFromDate(birthDate)

      console.log("[v0] Calculating zodiac signs from birth date:", birthInfo.birthdate)
      console.log("[v0] Calculated Western sign:", western.name)
      console.log("[v0] Calculated Western element:", western.element)
      console.log("[v0] Calculated Chinese sign:", chinese.name)
      console.log("[v0] Calculated Chinese element:", chineseZodiac.element)

      const { tropical, sidereal } = getBothSunSigns(month, day)
      saveSunSigns(tropical, sidereal)
      setUserSunSigns({ tropical, sidereal })

      const displayWesternSign = sunSignSystemPreference === "sidereal" ? sidereal ?? western.name : tropical ?? western.name

      setCalculatedSigns({
        westernSign: western.name,
        chineseSign: chinese.name,
      })

      setZodiacSigns({
        western: displayWesternSign,
        chinese: chinese.name,
        chineseElement: chineseZodiac.element,
        westernElement: western.element
      })

      localStorage.setItem("userChineseSign", chinese.name.toLowerCase())
      localStorage.setItem("userChineseElement", chineseZodiac.element)
      localStorage.setItem("userWesternElement", western.element)
      localStorage.setItem("userBirthInfo", JSON.stringify(birthInfo))

      console.log("[v0] Saved to localStorage - userChineseSign:", chinese.name.toLowerCase())
      console.log("[v0] Saved to localStorage - userBirthInfo:", birthInfo)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('sunSignSystemChanged'))
      }
    } catch (error) {
      console.error("[v0] Error calculating zodiac signs:", error)
    }
  }, [birthInfo, sunSignSystemPreference])

  // Auto-expand About Me textarea when text exists
  useEffect(() => {
    if (aboutMeTextareaRef.current && aboutMeText) {
      const textarea = aboutMeTextareaRef.current
      textarea.style.height = 'auto'
      textarea.style.height = Math.max(60, textarea.scrollHeight) + 'px'
    }
  }, [aboutMeText, activeTab])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)
    if (newName.trim() && typeof window !== 'undefined') {
      localStorage.setItem("userFullName", newName.trim())
    }
  }

  const handleSaveChanges = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert("Please log in to save changes")
        return
      }

      // Calculate age from birthdate
      let calculatedAge: number | undefined
      if (birthInfo.birthdate) {
        const [year, month, day] = birthInfo.birthdate.split("-").map(Number)
        const today = new Date()
        calculatedAge = today.getFullYear() - year
        const monthDiff = today.getMonth() + 1 - month
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
          calculatedAge--
        }
      }

      // Upload any base64 photos to Supabase Storage and get URLs
      const photoUrls: (string | null)[] = []
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i]
        if (photo.hasImage && photo.src) {
          if (photo.src.startsWith('http')) {
            // Already a URL, use it
            photoUrls[i] = photo.src
          } else if (photo.src.startsWith('data:image')) {
            // Base64 image, upload it
            try {
              // Convert base64 to File
              const response = await fetch(photo.src)
              const blob = await response.blob()
              const file = new File([blob], `photo_${i}.jpg`, { type: blob.type })
              
              const uploadResult = await uploadProfilePhoto(file, user.id, i)
              if (uploadResult.success && uploadResult.url) {
                photoUrls[i] = uploadResult.url
                // Update local state with URL
                const updatedPhotos = [...photos]
                updatedPhotos[i] = { ...updatedPhotos[i], src: uploadResult.url }
                setPhotos(updatedPhotos)
              } else {
                console.error('[Save Changes] Failed to upload photo:', uploadResult.error)
                photoUrls[i] = null
              }
            } catch (error) {
              console.error('[Save Changes] Error uploading base64 photo:', error)
              photoUrls[i] = null
            }
          } else {
            photoUrls[i] = null
          }
        } else {
          photoUrls[i] = null
        }
      }
      
      // Filter out nulls to get final array
      const finalPhotoUrls = photoUrls.filter((url): url is string => url !== null)

      // Prepare update object
      const updateData: any = {
        display_name: name.trim() || null,
        bio: aboutMeText.trim() || null,
        occupation: selectedOccupation.trim() || null,
        city: selectedCity || cityInput || null,
        height: selectedHeight || null,
        children_preference: selectedChildrenOption || null,
        religion: selectedReligion || null,
        relationship_goals: selectedRelationshipGoals.length > 0 ? selectedRelationshipGoals : null,
        interests: (() => {
          // Flatten selectedOrganizedInterests into a single array
          const flattenedInterests = Object.values(selectedOrganizedInterests).flat()
          return flattenedInterests.length > 0 ? flattenedInterests : null
        })(),
        birthdate: birthInfo.birthdate || null,
        age: calculatedAge || null,
        gender: genderOrientation.gender || null,
        orientation: genderOrientation.orientation || null,
        age_min: ageRange[0] || null,
        age_max: ageRange[1] || null,
        distance_radius: distanceRadius || null,
        show_occupation: visibilitySettings.showOccupation,
        show_height: visibilitySettings.showHeight,
        show_children: visibilitySettings.showChildren,
        show_location: visibilitySettings.showLocation,
        photos: finalPhotoUrls.length > 0 ? finalPhotoUrls : null,
        updated_at: new Date().toISOString()
      }

      // Update profile in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)

      if (updateError) {
        console.error('[Save Changes] Error updating profile:', updateError)
        console.error('[Save Changes] Error details:', JSON.stringify(updateError, null, 2))
        console.error('[Save Changes] Update data:', updateData)
        alert(`Failed to save changes: ${updateError.message || JSON.stringify(updateError)}`)
        return
      }

      // Reload profile data to ensure view tab updates
      try {
        const profile = await fetchUserProfile(user.id)
        if (profile) {
          // Reload children preference
          if (profile.children_preference) {
            setSelectedChildrenOption(profile.children_preference)
          }
        }
      } catch (error) {
        console.error('[Save Changes] Error reloading profile:', error)
      }

      // Set saved state
      setSavedSuccessfully(true)

      // Reset after 1.5 seconds
      setTimeout(() => {
        setSavedSuccessfully(false)
      }, 1500)
    } catch (error) {
      console.error('[Save Changes] Error:', error)
      alert("Failed to save changes. Please try again.")
    }
  }

  return (
    <div
      className={`${theme === "light" ? "light bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"} profile-page min-h-screen relative overflow-x-hidden touch-pan-y`}
      style={{ overscrollBehavior: 'contain' }}
    >

      <header className={`sticky top-0 z-50 ${
        theme === "light"
          ? "bg-white/80 backdrop-blur-sm"
          : "bg-slate-900/80 backdrop-blur-sm"
      }`} style={{ paddingTop: 'max(env(safe-area-inset-top), 44px)' }}>
        <div className="mx-auto max-w-full px-2 pt-0.5 pb-1.5 sm:px-3 lg:px-4">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex-1 -ml-8">
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-transparent">
                <div className="flex gap-0.5 min-w-max ml-8">
                  <div className="flex items-center gap-0.5">
                    <FourPointedStar className="w-5 h-5 text-orange-500" />
                    <span className="font-bold text-lg bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                      AstroMatch
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Theme Toggle Button */}
            <div className="flex items-center gap-2 ml-2">
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="p-2 transition-colors"
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

      <div className="relative z-10">
        {/* Horizontal Tabs Navigation */}
        <div className="px-3 pt-0 pb-2 -mt-3">
          <div className="flex justify-start gap-8">
              <button
                onClick={() => router.push("/profile/profile")}
                className={`relative px-5 py-1.5 text-xl font-medium transition-all duration-200 whitespace-nowrap ${
                  theme === "light"
                    ? "text-purple-600"
                    : "text-purple-400"
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => router.push("/profile/account")}
                className={`relative px-5 py-1.5 text-xl font-medium transition-all duration-200 whitespace-nowrap ${
                  theme === "light"
                    ? "text-gray-600 hover:text-gray-900"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Account
              </button>
              {isStaff && (
                <button
                  onClick={() => router.push("/admin")}
                  className={`relative px-5 py-1.5 text-xl font-medium transition-all duration-200 whitespace-nowrap ${
                    theme === "light"
                      ? "text-gray-600 hover:text-gray-900"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  Backoffice
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-transparent group-hover:bg-gray-300 dark:group-hover:bg-gray-600 rounded-full transition-colors" />
                </button>
              )}
          </div>
        </div>

        <div className="flex px-5 mb-3 pt-0 -mt-1">
          <button
            onClick={() => setActiveTab("edit")}
            className={`flex-1 pb-3 pt-2 text-center font-semibold transition-all duration-300 relative profile-tab-button ${
              activeTab === "edit" ? (theme === "light" ? "!text-purple-600" : "!text-purple-400") : (theme === "light" ? "!text-black/70 hover:!text-black" : "!text-white/70 hover:!text-white")
            }`}
          >
            <span className={`relative z-10 text-lg ${activeTab === "edit" ? (theme === "light" ? "!text-purple-600" : "!text-purple-400") : (theme === "light" ? "!text-black/70" : "!text-white/70")}`}>Edit</span>
          </button>
          <button
            onClick={() => setActiveTab("view")}
            className={`flex-1 pb-3 pt-2 text-center font-semibold transition-all duration-300 relative profile-tab-button ${
              activeTab === "view" ? (theme === "light" ? "!text-purple-600" : "!text-purple-400") : (theme === "light" ? "!text-black/70 hover:!text-black" : "!text-white/70 hover:!text-white")
            }`}
          >
            <span className={`relative z-10 text-lg ${activeTab === "view" ? (theme === "light" ? "!text-purple-600" : "!text-purple-400") : (theme === "light" ? "!text-black/70" : "!text-white/70")}`}>View</span>
          </button>
        </div>

        {activeTab === "edit" && (
          <div className="px-5 mb-8 -mt-2">
            <div className="photo-grid">
              {photos.map((photo, index) => (
                <div key={photo.id} className="photo-slot">
                  <input
                    ref={(el) => {
                      fileInputRefs.current[index] = el
                    }}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(photo.id, e)}
                    className="hidden"
                  />

                  {photo.hasImage ? (
                    <div className="relative w-full h-full cursor-pointer" onClick={() => triggerFileInput(index)}>
                      <img src={photo.src || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation() // Prevent triggering file input when deleting
                          handlePhotoDelete(photo.id)
                        }}
                        className="delete-button"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="photo-placeholder w-full h-full cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center"
                      onClick={() => triggerFileInput(index)}
                    >
                      <CameraIcon className="w-12 h-12 opacity-50" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "view" && (
          <>
            <div className="w-full pb-32 -mt-2">
              <div className="w-full" style={{ marginBottom: '2rem', padding: '0', margin: '0 auto', maxWidth: '100%' }}>
                {/* Get pattern colors for border */}
                {(() => {
                  const patternColors = connectionBoxData?.pattern 
                    ? getPatternGradientColors(connectionBoxData.pattern)
                    : { start: '#60a5fa', end: '#3b82f6' };
                  
                  // Get display signs for the profile
                  const displayWesternSign = zodiacSigns.western || calculatedSigns.westernSign;
                  const displayEasternSign = zodiacSigns.chinese || calculatedSigns.chineseSign;
                  
                  return (
                    <>
                      {/* Border removed from profile card */}
                      {/* Photo Carousel - border removed */}
                      {photos.some(p => p.hasImage) && (
                        <div className="w-full rounded-3xl overflow-hidden" style={{ margin: '0', padding: '0', borderRadius: '1.5rem', backgroundColor: theme === "light" ? "#f9fafb" : "#0f172a" }}>
                            <ProfilePhotoCarouselWithRanking
                              images={photos.filter(p => p.hasImage).map(p => p.src || "/placeholder.svg")}
                              profileName={name || ""}
                              profileAge={(() => {
                                if (birthInfo?.birthdate) {
                                  const [year, month, day] = birthInfo.birthdate.split("-").map(Number);
                                  const today = new Date();
                                  let age = today.getFullYear() - year;
                                  const monthDiff = today.getMonth() + 1 - month;
                                  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
                                    age--;
                                  }
                                  return age > 0 ? age : 27;
                                }
                                return 27;
                              })()}
                              connectionBoxData={connectionBoxData || undefined}
                              theme={theme}
                              showDropdown={false}
                              badgePosition="overlay-bottom"
                              aboutMeText={aboutMeText}
                              selectedOccupation={selectedOccupation}
                              selectedCity={selectedCity}
                              cityInput={cityInput}
                              selectedHeight={selectedHeight}
                              selectedChildrenOption={selectedChildrenOption}
                              selectedReligion={selectedReligion}
                              birthInfo={birthInfo}
                              westernSign={displayWesternSign}
                              easternSign={displayEasternSign}
                              onPhotoChange={setCurrentPhotoIndex}
                              showProfileToggle={showConnectionProfile}
                              onShowProfileToggle={() => {
                                if (showConnectionProfile) {
                                  setShowConnectionProfile(false);
                                } else {
                                  setShowConnectionProfile(true);
                                  setShowConnectionElements(false);
                                }
                              }}
                              showElementsToggle={showConnectionElements}
                              onShowElementsToggle={() => {
                                if (showConnectionElements) {
                                  setShowConnectionElements(false);
                                } else {
                                  setShowConnectionElements(true);
                                  setShowConnectionProfile(false);
                                }
                              }}
                              patternColors={patternColors}
                            />
                          </div>
                      )}

                      {/* Match Box - Always visible, matches discover section  */}
                      {connectionBoxData && photos.some(p => p.hasImage) && (() => {
                            const newTier = mapToNewTier(connectionBoxData.rankLabel, connectionBoxData.rank);
                            const westA = connectionBoxData.a?.west ? capitalize(connectionBoxData.a.west) : "Unknown";
                            const eastA = connectionBoxData.a?.east ? capitalize(connectionBoxData.a.east) : "Unknown";
                            const westB = connectionBoxData.b?.west ? capitalize(connectionBoxData.b.west) : "Unknown";
                            const eastB = connectionBoxData.b?.east ? capitalize(connectionBoxData.b.east) : "Unknown";
                            const chineseLine = connectionBoxData.east_relation || `${eastA} × ${eastB}`;
                            const westernLine = connectionBoxData.west_relation || `${westA} × ${westB}`;
                            const wuXingLine = connectionBoxData.wuXingLine;
                            const connectionBlurb = connectionBoxData.insight && connectionBoxData.insight.trim().length > 0
                              ? connectionBoxData.insight
                              : connectionBoxData.pattern && connectionBoxData.score
                              ? deriveConnectionOverview(
                                  connectionBoxData.pattern as import('@/lib/matchEngine').ChinesePattern,
                                  connectionBoxData.score
                                )
                              : undefined;
                            const calculatedAge = connectionBoxData.age ?? (() => {
                              if (birthInfo?.birthdate) {
                                const [year, month, day] = birthInfo.birthdate.split("-").map(Number);
                                const today = new Date();
                                let age = today.getFullYear() - year;
                                const monthDiff = today.getMonth() + 1 - month;
                                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
                                  age--;
                                }
                                return age > 0 ? age : 27;
                              }
                              return 27;
                            })();

                            return (
                              <>
                                <div className="relative w-full" style={{ marginTop: '0', marginBottom: '-34px', zIndex: 10 }}>
                                  <ConnectionBoxNew
                                    tier={newTier}
                                    score={connectionBoxData.score}
                                    westA={westA}
                                    eastA={eastA}
                                    westB={westB}
                                    eastB={eastB}
                                    chineseLine={chineseLine}
                                    sunMatchBlurb={connectionBoxData.westernSignLine || ""}
                                    westernLine={westernLine}
                                    wuXingLine={wuXingLine}
                                    chineseElementA={connectionBoxData.a?.chineseElement}
                                    chineseElementB={connectionBoxData.b?.chineseElement}
                                    connectionBlurb={connectionBlurb || undefined}
                                    theme={theme}
                                    aboutMe={connectionBoxData.aboutMeText ?? aboutMeText}
                                    interests={connectionBoxData.selectedOrganizedInterests ?? selectedOrganizedInterests}
                                    relationshipGoals={connectionBoxData.selectedRelationshipGoals ?? selectedRelationshipGoals}
                                    age={calculatedAge}
                                    city={connectionBoxData.city ?? selectedCity ?? cityInput}
                                    occupation={connectionBoxData.occupation ?? selectedOccupation}
                                    height={connectionBoxData.height ?? selectedHeight}
                                    children={connectionBoxData.children ?? selectedChildrenOption}
                                    religion={connectionBoxData.religion ?? selectedReligion}
                                    chinesePattern={connectionBoxData.chinesePattern}
                                    westAspect={connectionBoxData.westAspect}
                                    westElementRelation={connectionBoxData.westElementRelation}
                                    isChineseOpposite={connectionBoxData.isChineseOpposite}
                                    isLivelyPair={connectionBoxData.isLivelyPair}
                                    showProfile={false}
                                    showElements={true}
                                    patternFullLabel={connectionBoxData.patternFullLabel}
                                    pillLabel={connectionBoxData.pillLabel}
                                    baseTagline={connectionBoxData.baseTagline}
                                    patternEmoji={connectionBoxData.patternEmoji}
                                    pattern={connectionBoxData.pattern}
                                    chemistryStars={connectionBoxData.chemistryStars}
                                    stabilityStars={connectionBoxData.stabilityStars}
                                    patternColors={patternColors}
                                    onPass={undefined}
                                    onLike={undefined}
                                    onMessage={undefined}
                                    onViewProfile={() => setShowConnectionProfile(!showConnectionProfile)}
                                  />
                                </div>

                                {/* Profile Dropdown - Overlays profile box when open */}
                                {showConnectionProfile && (
                                  <div 
                                    className="w-full"
                                    style={{ 
                                      position: 'absolute',
                                      top: '100%',
                                      left: 0,
                                      right: 0,
                                      zIndex: 100,
                                      marginTop: '-36px',
                                    }}
                                  >
                                      <div
                                        style={{
                                          borderRadius: '1.5rem',
                                          backgroundColor: theme === "light" ? "#ffffff" : "#1e293b",
                                          overflow: 'hidden',
                                        }}
                                      >
                                    <ConnectionBoxNew
                                      tier={newTier}
                                      score={connectionBoxData.score}
                                      westA={westA}
                                      eastA={eastA}
                                      westB={westB}
                                      eastB={eastB}
                                      chineseLine={chineseLine}
                                      sunMatchBlurb={connectionBoxData.westernSignLine || ""}
                                      westernLine={westernLine}
                                      wuXingLine={wuXingLine}
                                      chineseElementA={connectionBoxData.a?.chineseElement}
                                      chineseElementB={connectionBoxData.b?.chineseElement}
                                      connectionBlurb={connectionBlurb || undefined}
                                      theme={theme}
                                      aboutMe={connectionBoxData.aboutMeText ?? aboutMeText}
                                      interests={connectionBoxData.selectedOrganizedInterests ?? selectedOrganizedInterests}
                                      relationshipGoals={connectionBoxData.selectedRelationshipGoals ?? selectedRelationshipGoals}
                                      age={calculatedAge}
                                      city={connectionBoxData.city ?? selectedCity ?? cityInput}
                                      occupation={connectionBoxData.occupation ?? selectedOccupation}
                                      height={connectionBoxData.height ?? selectedHeight}
                                      children={connectionBoxData.children ?? selectedChildrenOption}
                                      religion={connectionBoxData.religion ?? selectedReligion}
                                      chinesePattern={connectionBoxData.chinesePattern}
                                      westAspect={connectionBoxData.westAspect}
                                      westElementRelation={connectionBoxData.westElementRelation}
                                      isChineseOpposite={connectionBoxData.isChineseOpposite}
                                      isLivelyPair={connectionBoxData.isLivelyPair}
                                      showProfile={true}
                                      showElements={false}
                                      patternFullLabel={connectionBoxData.patternFullLabel}
                                      pillLabel={connectionBoxData.pillLabel}
                                      baseTagline={connectionBoxData.baseTagline}
                                      patternEmoji={connectionBoxData.patternEmoji}
                                      pattern={connectionBoxData.pattern}
                                      chemistryStars={connectionBoxData.chemistryStars}
                                      stabilityStars={connectionBoxData.stabilityStars}
                                      patternColors={patternColors}
                                      onPass={undefined}
                                      onLike={undefined}
                                      onMessage={undefined}
                                      onViewProfile={() => setShowConnectionProfile(false)}
                                    />
                                      </div>
                                  </div>
                                )}
                              </>
                            );
                          })()}

                      {/* Connection Box - Always visible, matches discover section - Outside border (fallback) */}
                      {!photos.some(p => p.hasImage) && connectionBoxData && (() => {
                        const newTier = mapToNewTier(connectionBoxData.rankLabel, connectionBoxData.rank);
                        const westA = connectionBoxData.a?.west ? capitalize(connectionBoxData.a.west) : "Unknown";
                        const eastA = connectionBoxData.a?.east ? capitalize(connectionBoxData.a.east) : "Unknown";
                        const westB = connectionBoxData.b?.west ? capitalize(connectionBoxData.b.west) : "Unknown";
                        const eastB = connectionBoxData.b?.east ? capitalize(connectionBoxData.b.east) : "Unknown";
                        const chineseLine = connectionBoxData.east_relation || `${eastA} × ${eastB}`;
                        const westernLine = connectionBoxData.west_relation || `${westA} × ${westB}`;
                        const wuXingLine = connectionBoxData.wuXingLine;
                        const connectionBlurb = connectionBoxData.insight && connectionBoxData.insight.trim().length > 0
                          ? connectionBoxData.insight
                          : connectionBoxData.pattern && connectionBoxData.score
                          ? deriveConnectionOverview(
                              connectionBoxData.pattern as import('@/lib/matchEngine').ChinesePattern,
                              connectionBoxData.score
                            )
                          : undefined;
                        const calculatedAge = connectionBoxData.age ?? (() => {
                          if (birthInfo?.birthdate) {
                            const [year, month, day] = birthInfo.birthdate.split("-").map(Number);
                            const today = new Date();
                            let age = today.getFullYear() - year;
                            const monthDiff = today.getMonth() + 1 - month;
                            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
                              age--;
                            }
                            return age > 0 ? age : 27;
                          }
                          return 27;
                        })();

                        return (
                          <div 
                            className={`relative flex justify-center ${
                              theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"
                            }`}
                            style={{
                              position: 'relative',
                              marginTop: '-3px',
                              paddingTop: '0',
                            }}
                          >
                            <div className="relative w-full max-w-full" style={{ zIndex: 10, marginBottom: '0', paddingBottom: '0' }}>
                              <ConnectionBoxNew
                                tier={newTier}
                                score={connectionBoxData.score}
                                westA={westA}
                                eastA={eastA}
                                westB={westB}
                                eastB={eastB}
                                chineseLine={chineseLine}
                                sunMatchBlurb={connectionBoxData.westernSignLine || ""}
                                westernLine={westernLine}
                                wuXingLine={wuXingLine}
                                chineseElementA={connectionBoxData.a?.chineseElement}
                                chineseElementB={connectionBoxData.b?.chineseElement}
                                connectionBlurb={connectionBlurb || undefined}
                                theme={theme}
                                aboutMe={connectionBoxData.aboutMeText ?? aboutMeText}
                                interests={connectionBoxData.selectedOrganizedInterests ?? selectedOrganizedInterests}
                                relationshipGoals={connectionBoxData.selectedRelationshipGoals ?? selectedRelationshipGoals}
                                age={calculatedAge}
                                city={connectionBoxData.city ?? selectedCity ?? cityInput}
                                occupation={connectionBoxData.occupation ?? selectedOccupation}
                                height={connectionBoxData.height ?? selectedHeight}
                                children={connectionBoxData.children ?? selectedChildrenOption}
                                religion={connectionBoxData.religion ?? selectedReligion}
                                chinesePattern={connectionBoxData.chinesePattern}
                                westAspect={connectionBoxData.westAspect}
                                westElementRelation={connectionBoxData.westElementRelation}
                                isChineseOpposite={connectionBoxData.isChineseOpposite}
                                isLivelyPair={connectionBoxData.isLivelyPair}
                                showProfile={showConnectionProfile}
                                showElements={true}
                                patternFullLabel={connectionBoxData.patternFullLabel}
                                pillLabel={connectionBoxData.pillLabel}
                                baseTagline={connectionBoxData.baseTagline}
                                patternEmoji={connectionBoxData.patternEmoji}
                                pattern={connectionBoxData.pattern}
                                chemistryStars={connectionBoxData.chemistryStars}
                                stabilityStars={connectionBoxData.stabilityStars}
                                patternColors={patternColors}
                                onPass={undefined}
                                onLike={undefined}
                                onMessage={undefined}
                                onViewProfile={() => setShowConnectionProfile(!showConnectionProfile)}
                              />
                          </div>
                        </div>
                        );
                          })()}
                    </>
                  );
                })()}
              </div>
            </div>
          </>
        )}

        {activeTab === "edit" && (
          <div className="px-7 pb-32" style={{ position: 'relative' }}>

            <div className="mb-8">
              <SectionHeader
                label="First name"
              />
              <div className="space-y-2">
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Enter your first name"
                  className={`w-full px-4 py-3 rounded-lg focus:outline-none transition-all text-lg first-name-input ${theme === "starlight" ? "border border-white/20 bg-white/5 text-white placeholder-white/50" : theme === "light" ? "border border-gray-300 bg-white text-black placeholder-black/40" : "bg-slate-900/50 border border-indigo-400/20 !text-white/95 placeholder-white/40 focus:border-indigo-400/40"}`}
                  style={{ 
                    fontSize: '1.25rem !important',
                    fontFamily: 'inherit !important'
                  }}
                />
              </div>
            </div>

            {/* Location Section */}
            <div className="mb-8">
              <SectionHeader
                label="Area / City"
              />
              <div className="space-y-4">
                <div className="relative" ref={cityInputRef}>
                  <input
                    type="text"
                    value={cityInput}
                    onChange={handleCityInputChange}
                    onFocus={() => {
                      if (cityInput.trim().length > 0 && filteredCities.length > 0) {
                        setShowCitySuggestions(true)
                      }
                    }}
                    placeholder="Start typing your city..."
                    className={`w-full px-4 py-3 rounded-xl focus:outline-none transition-all location-input !text-xl ${theme === "starlight" ? "border border-white/20 bg-white/5 text-white placeholder-white/40" : theme === "light" ? "border border-gray-300 bg-white text-black placeholder-black/40" : "bg-slate-900/50 border border-indigo-400/20 !text-white/95 placeholder-white/40 focus:border-indigo-400/40"}`}
                    style={{ fontSize: '1.25rem !important' }}
                  />

                  {showCitySuggestions && filteredCities.length > 0 && (
                    <div
                      className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto ${theme === "light" ? "bg-white border border-gray-200" : "bg-gray-800/95 backdrop-blur-sm border border-white/20"}`}
                    >
                      {filteredCities.map((city, index) => (
                        <button
                          key={index}
                          onClick={() => handleCitySelect(city)}
                          className={`w-full px-4 py-3 text-left transition-colors ${
                            theme === "starlight" || theme === "light" ? "text-gray-900 hover:bg-gray-100" : "text-white hover:bg-white/10"
                          } ${index === 0 ? "rounded-t-xl" : ""} ${index === filteredCities.length - 1 ? "rounded-b-xl" : ""}`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Occupation / Industry Section */}
            <div className="mb-8">
              <SectionHeader
                label="Occupation / Industry"
              />
              <div className="space-y-4">
                <input
                  type="text"
                  value={selectedOccupation}
                  onChange={handleOccupationChange}
                  placeholder="Enter your profession"
                  maxLength={30}
                  className={`w-full px-4 py-3 rounded-xl focus:outline-none transition-all occupation-input ${theme === "starlight" ? "border border-white/20 bg-white/5 text-white placeholder-white/40" : theme === "light" ? "border border-gray-300 bg-white text-black placeholder-black/40" : "bg-slate-900/50 border border-indigo-400/20 !text-white/95 placeholder-white/40 focus:border-indigo-400/40"}`}
                  style={{ fontSize: '1.25rem !important' }}
                />
              </div>
            </div>

            {/* Birth Information Section */}
            <BirthInformationSection
              birthDateISO={birthInfo.birthdate}
              onBirthDateChange={(value) => {
                setBirthInfo((prev) => ({ ...prev, birthdate: value }))
                const [year, month, day] = value.split("-").map(Number)
                setSelectedYear(year)
                setSelectedMonth(month)
                setSelectedDay(day)
              }}
            />

            {/* About Me Section */}
            <div className="mb-8">
              <SectionHeader
                label="About me"
              />
              <div className="space-y-2">
                <div className="relative">
                  <textarea
                    ref={aboutMeTextareaRef}
                    value={aboutMeText}
                    onChange={handleAboutMeTextChange}
                    placeholder="Tell us about yourself..."
                    maxLength={300}
                    className={`w-full px-4 py-3 pb-6 text-lg rounded-lg focus:outline-none transition-all resize-none about-me-textarea ${theme === "starlight" ? "border border-white/20 bg-white/5 text-white placeholder-white/50" : theme === "light" ? "border border-gray-300 bg-white text-black placeholder-black/40" : "bg-slate-900/50 border border-indigo-400/20 !text-white/95 placeholder-white/40 focus:border-indigo-400/40"}`}
                    rows={2}
                    style={{ 
                      minHeight: '60px',
                      height: 'auto',
                      overflow: 'hidden'
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = target.scrollHeight + 'px';
                    }}
                  />
                  <div className={`absolute bottom-2 right-3 text-xs ${theme === "light" ? "text-black/40" : "text-white/40"}`}>
                    {300 - (aboutMeText || '').length}
                  </div>
                </div>
              </div>
            </div>

            {/* Relationship Goals Section */}
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className={`font-semibold text-base ${
                  theme === "light"
                    ? "text-purple-600"
                    : "text-purple-400"
                }`}>
                  Relationship Goals
                </h2>
                {selectedRelationshipGoals.length > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    theme === "light" ? "bg-purple-100 text-purple-700" : "bg-purple-500/20 text-purple-300"
                  }`}>
                    {selectedRelationshipGoals.length}/6
                  </span>
                )}
              </div>
              <div className="space-y-4">
                {/* Selected Goals Pills */}
                {selectedRelationshipGoals.filter(goal => goal !== "Life Companion" && goal !== "Life companion").length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedRelationshipGoals
                      .filter(goal => goal !== "Life Companion" && goal !== "Life companion")
                      .map((goal) => (
                        <span
                          key={goal}
                          className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-500 text-white"
                        >
                          {goal}
                        </span>
                      ))}
                  </div>
                )}

                {/* Scrollable Goals List */}
                <div className="relative relationship-goals-dropdown-container">
                  <div
                    className={`max-h-48 overflow-y-auto rounded-lg border ${
                      theme === "light"
                        ? "bg-white border-gray-200"
                        : "bg-slate-900/50 border-indigo-400/20"
                    }`}
                    style={{ scrollbarWidth: 'thin' }}
                  >
                    <div className="p-2 space-y-1">
                      {relationshipGoalsOptions.map((goal) => {
                        const isSelected = selectedRelationshipGoals.includes(goal)
                        const isDisabled = !isSelected && selectedRelationshipGoals.length >= 6
                        return (
                          <button
                            key={goal}
                            type="button"
                            onClick={() => handleRelationshipGoalToggle(goal)}
                            disabled={isDisabled}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                              isSelected
                                ? theme === "light"
                                  ? "bg-purple-100 text-purple-900"
                                  : "bg-purple-500/20 text-purple-300"
                                : isDisabled
                                ? theme === "light"
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "text-slate-500 cursor-not-allowed"
                                : theme === "light"
                                ? "text-gray-700 hover:bg-gray-100"
                                : "text-slate-300 hover:bg-slate-800/50"
                            }`}
                          >
                            {goal}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  {selectedRelationshipGoals.length >= 6 && (
                    <p className={`text-xs mt-2 ${theme === "light" ? "text-gray-500" : "text-slate-400"}`}>
                      Maximum of 6 goals selected
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Interests Section */}
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className={`font-semibold text-base ${
                  theme === "light"
                    ? "text-purple-600"
                    : "text-purple-400"
                }`}>
                  Interests
                </h2>
                {(() => {
                  const totalSelected = Object.values(selectedOrganizedInterests).reduce((sum, interests) => sum + (interests?.length || 0), 0);
                  return totalSelected > 0 ? (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      theme === "light" ? "bg-purple-100 text-purple-700" : "bg-purple-500/20 text-purple-300"
                    }`}>
                      {totalSelected}/6
                    </span>
                  ) : null;
                })()}
              </div>
              <div className="space-y-4">
                {/* Selected Interests Pills */}
                {Object.keys(selectedOrganizedInterests).some(category => selectedOrganizedInterests[category]?.length > 0) && (
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedOrganizedInterests).map(([category, interests]) =>
                      interests.map((interest) => (
                        <span
                          key={`${category}-${interest}`}
                          className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-500 text-white"
                        >
                          {interest}
                        </span>
                      ))
                    )}
                  </div>
                )}

                {/* Interest Categories */}
                <div className="space-y-3">
                  {Object.entries(interestCategories).map(([category, interests]) => {
                    const categoryInterests = selectedOrganizedInterests[category] || []
                    const isOpen = showInterestCategoryDropdowns[category] || false
                    const isMaxReached = categoryInterests.length >= 6

                    return (
                      <div key={category} className="relative interest-category-item">
                        <button
                          type="button"
                          onClick={() => toggleInterestCategoryDropdown(category)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                            theme === "light"
                              ? "bg-gray-100 hover:bg-gray-200 text-gray-900"
                              : "bg-slate-800/50 hover:bg-slate-800/70 text-slate-200"
                          }`}
                        >
                          <span className="font-medium">{category}</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                          />
                        </button>

                        {isOpen && (
                          <div
                            className={`interest-category-dropdown-container mt-2 rounded-lg border ${
                              theme === "light"
                                ? "bg-white border-gray-200"
                                : "bg-slate-900/50 border-indigo-400/20"
                            }`}
                            style={{ maxHeight: '200px', overflowY: 'auto', scrollbarWidth: 'thin' }}
                          >
                            <div className="p-2 space-y-1">
                              {interests.map((interest) => {
                                const isSelected = categoryInterests.includes(interest)
                                const isDisabled = !isSelected && isMaxReached
                                return (
                                  <button
                                    key={interest}
                                    type="button"
                                    onClick={() => handleOrganizedInterestToggle(category, interest)}
                                    disabled={isDisabled}
                                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                      isSelected
                                        ? theme === "light"
                                          ? "bg-purple-100 text-purple-900"
                                          : "bg-purple-500/20 text-purple-300"
                                        : isDisabled
                                        ? theme === "light"
                                          ? "text-gray-400 cursor-not-allowed"
                                          : "text-slate-500 cursor-not-allowed"
                                        : theme === "light"
                                        ? "text-gray-700 hover:bg-gray-100"
                                        : "text-slate-300 hover:bg-slate-800/50"
                                    }`}
                                  >
                                    {interest}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <SectionHeader
                label="Height"
              />
              <div className="relative height-dropdown-container">
                <button
                  type="button"
                  onClick={() => setShowHeightDropdown(!showHeightDropdown)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    theme === "light"
                      ? "bg-gray-100 hover:bg-gray-200 text-gray-900"
                      : "bg-slate-800/50 hover:bg-slate-800/70 text-slate-200"
                  }`}
                >
                  <span className={selectedHeight ? "font-medium" : theme === "light" ? "text-gray-500" : "text-slate-400"}>
                    {selectedHeight || "Select height"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${showHeightDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {showHeightDropdown && (
                  <div
                    className={`mt-2 rounded-lg border max-h-64 overflow-y-auto ${
                      theme === "light"
                        ? "bg-white border-gray-200"
                        : "bg-slate-900/50 border-indigo-400/20"
                    }`}
                  >
                    <div className="p-2 space-y-1">
                      {heightOptions.map((height) => {
                        const isSelected = selectedHeight === height
                        return (
                          <button
                            key={height}
                            type="button"
                            onClick={() => {
                              handleHeightSelect(height)
                              setShowHeightDropdown(false)
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                              isSelected
                                ? theme === "light"
                                  ? "bg-purple-100 text-purple-900"
                                  : "bg-purple-500/20 text-purple-300"
                                : theme === "light"
                                ? "text-gray-700 hover:bg-gray-100"
                                : "text-slate-300 hover:bg-slate-800/50"
                            }`}
                          >
                            {height}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-8">
              <ChildrenSection
                value={selectedChildrenOption as "I have children" | "I don't have children" | ""}
                onChange={(value) => {
                  setSelectedChildrenOption(value)
                  if (typeof window !== 'undefined') {
                    localStorage.setItem("childrenPreference", value)
                  }
                }}
              />
            </div>

            <div className="mb-8">
              <GenderSection
                value={genderOrientation.gender.toLowerCase() as "man" | "woman" | "other" | ""}
                onChange={(value) => {
                  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
                  const newGenderOrientation = { ...genderOrientation, gender: capitalizedValue }
                  setGenderOrientation(newGenderOrientation)
                  if (typeof window !== 'undefined') {
                    localStorage.setItem("genderOrientation", JSON.stringify(newGenderOrientation))
                  }
                }}
              />
            </div>

            <div className="mb-8">
              <OrientationSection
                value={genderOrientation.orientation as "Men" | "Women" | ""}
                onChange={(value) => {
                  const newGenderOrientation = { ...genderOrientation, orientation: value }
                  setGenderOrientation(newGenderOrientation)
                  if (typeof window !== 'undefined') {
                    localStorage.setItem("genderOrientation", JSON.stringify(newGenderOrientation))
                  }
                }}
              />
            </div>

            <div className="mb-8">
              <SectionHeader
                label="Age"
              />
              <div className="space-y-4">
                {/* Age Range Display */}
                <div className="flex justify-between items-center">
                  <span className={theme === "light" ? "text-black text-sm" : "text-white/70 text-sm"}>
                    {ageRange[0]} - {ageRange[1]}
                  </span>
                </div>
                
                {/* Dual Range Slider - Single Bar */}
                <div className="relative h-8 px-3 overflow-hidden">
                  {/* Background Track */}
                  <div className="absolute top-3 left-3 right-3 h-[3px] bg-gray-400/30 rounded-full"></div>
                  
                  {/* Active Range Track */}
                  <div 
                    className="absolute top-3 h-[3px] bg-gray-400 rounded-full left-3"
                    style={{
                      left: `calc(0.75rem + ${((ageRange[0] - 18) / (80 - 18))} * (100% - 1.5rem))`,
                      width: `calc(${((ageRange[1] - ageRange[0]) / (80 - 18))} * (100% - 1.5rem))`
                    }}
                  />
                  
                  {/* Min Range Slider */}
                  <input
                    type="range"
                    min="18"
                    max="80"
                    value={ageRange[0]}
                    onChange={(e) => {
                      const newMin = Math.min(Number(e.target.value), ageRange[1] - 1)
                      handleAgeRangeChange([newMin, ageRange[1]])
                    }}
                    className="absolute top-0 left-3 right-3 w-[calc(100%-1.5rem)] h-8 bg-transparent appearance-none cursor-pointer pointer-events-none z-30
                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                            [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:mt-1
                            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gray-400
                            [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto
                            [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6
                            [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0
                            [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-gray-400
                            [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto"
                  />
                  
                  {/* Max Range Slider */}
                  <input
                    type="range"
                    min="18"
                    max="80"
                    value={ageRange[1]}
                    onChange={(e) => {
                      const newMax = Math.max(Number(e.target.value), ageRange[0] + 1)
                      handleAgeRangeChange([ageRange[0], newMax])
                    }}
                    className="absolute top-0 left-3 right-3 w-[calc(100%-1.5rem)] h-8 bg-transparent appearance-none cursor-pointer pointer-events-none z-20
                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                            [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:mt-1
                            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gray-400
                            [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto
                            [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6
                            [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0
                            [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-gray-400
                            [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto"
                  />
                </div>
                
                {/* Age Labels */}
                <div className="flex justify-between text-xs text-white/50">
                  <span>18</span>
                  <span>80</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <SectionHeader
                label="Distance"
              />
              <div className="space-y-3">
                <div className="relative pt-6">
                  {/* Track background */}
                  <div
                    className={`rounded-full ${theme === "starlight" ? "bg-white/20" : "bg-gray-400/60"}`}
                    style={{ height: "3px" }}
                  />
                  
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={distanceRadius}
                    onChange={(e) => handleDistanceChange(Number(e.target.value))}
                    className="absolute top-3 left-0 w-full h-6 bg-transparent appearance-none cursor-pointer
                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                            [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2
                            [&::-webkit-slider-thumb]:border-gray-500/40 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer
                            [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform
                            [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6
                            [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2
                            [&::-moz-range-thumb]:border-gray-500/40 [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer
                            [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:transition-transform"
                  />
                  
                  {/* Value display above thumb */}
                  <div
                    className={`absolute -top-2 text-sm font-semibold ${theme === "starlight" ? "text-white" : "text-white/70"}`}
                    style={{
                      left: `${(distanceRadius / 200) * 100}%`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    {distanceRadius}km
                  </div>
                </div>
                <div className="flex justify-between text-xs">
                  <span className={theme === "starlight" ? "text-white/50" : theme === "light" ? "text-gray-500" : "text-white/50"}>0km</span>
                  <span className={theme === "starlight" ? "text-white/50" : theme === "light" ? "text-gray-500" : "text-white/50"}>200km</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleSaveChanges}
              className="w-full py-4 bg-gradient-to-r from-purple-400 to-purple-500 text-white font-bold rounded-xl hover:from-purple-500 hover:to-purple-600 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              {savedSuccessfully ? "Saved" : "Save Changes"}
            </button>
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
              lastTwoFingerMidpointRef.current = getTwoFingerMidpoint(e.touches)
            } else if (e.touches.length === 1) {
              lastTouchPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
            }
          }}
          onTouchMove={handleZoomTouchMove}
          onTouchEnd={handleZoomTouchEnd}
          style={{ 
            touchAction: 'none',
            transition: 'opacity 0.3s ease-out',
            opacity: 1
          }}
        >
          <img
            src={photos[currentPhotoIndex].src || "/placeholder.svg"}
            alt=""
            className="max-w-full max-h-full object-contain"
            style={{
              transform: `translate(${zoomPosX}px, ${zoomPosY}px) scale(${zoomScale})`,
              transformOrigin: 'center center',
              transition: zoomScale === 1 ? 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)' : 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none',
              pointerEvents: 'none',
              willChange: 'transform'
            }}
          />
        </div>
      )}
    </div>
  )
}
