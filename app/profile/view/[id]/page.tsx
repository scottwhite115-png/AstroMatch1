"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { explainMatchAndScore } from "@/lib/matchExplainAndScore"
import { computeMatchWithNewEngine } from "@/lib/matchEngineAdapter"
import { evaluateMatch } from "@/engine/astromatch-engine"
import { type West, type East, getWuXingYearElement, type WuXing } from "@/lib/matchEngine"
import { buildConnectionBox } from "@/lib/compat/engine"
import type { UserProfile, SimpleConnectionBox } from "@/lib/compat/types"
import { getSunMatchBlurb, type WesternSign } from "@/lib/connectionSunVibes"
import type { RankKey } from "@/data/rankTheme"
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

// Helper to get pattern-based gradient colors (same as discover section)
function getPatternGradientColors(pattern?: string): { start: string; end: string } {
  if (!pattern) return { start: '#60a5fa', end: '#3b82f6' }; // blue-400 to blue-500 (same as NO_PATTERN)
  
  const patternUpper = pattern.toUpperCase();
  
  // San He - Triple Harmony (Gold)
  if (patternUpper.includes('SAN_HE') || patternUpper.includes('TRIPLE HARMONY')) {
    return { start: '#fbbf24', end: '#f59e0b' }; // amber-400 to amber-500
  }
  
  // Liu He - Secret Friends (Purple)
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
    relationshipGoals: ["Soul mate", "Best friend", "Intimate connection"],
    selectedRelationshipGoals: ["Soul mate", "Best friend", "Intimate connection"],
    interests: {
      "Arts & Culture": ["Museums", "Photography", "Concerts"],
      "Fitness & Wellness": ["Yoga", "Hiking", "Meditation"],
      "Food & Drink": ["Cooking", "Wine Tasting"]
    },
    selectedOrganizedInterests: {
      "Arts & Culture": ["Museums", "Photography", "Concerts"],
      "Fitness & Wellness": ["Yoga", "Hiking", "Meditation"],
      "Food & Drink": ["Cooking", "Wine Tasting"]
    },
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
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const zoomModalRef = useRef<HTMLDivElement>(null)

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
  
  // Helper function to convert SimpleConnectionBox to ConnectionBoxData (same as matches page)
  const convertSimpleToConnectionBoxData = (
    simpleBox: SimpleConnectionBox,
    userWest: string,
    userEast: string,
    profileWest: string,
    profileEast: string,
    profile: any,
    userYearElement?: any, // WuXing type
    profileYearElement?: any // WuXing type
  ): ConnectionBoxData => {
    // Import connection UI helpers
    const {
      extractChineseBase,
      extractChineseOverlays,
      extractWesternRelation,
      extractPrimaryLabel,
    } = require('@/lib/connectionUiHelpers');
    
    // Extract connection UI data
    const chineseBase = extractChineseBase(simpleBox.chinesePattern || simpleBox.pattern);
    let chineseOverlays = extractChineseOverlays(
      simpleBox.chinesePattern || simpleBox.pattern,
      undefined, // allPatterns not available in SimpleConnectionBox yet
      simpleBox.chineseLine // Use chineseLine as fallback
    );
    
    // If the primary pattern is LIU_CHONG, XING, LIU_HAI, or PO, add it to overlays for display
    const primaryPattern = String(simpleBox.chinesePattern || simpleBox.pattern || '').toUpperCase();
    if (primaryPattern.includes('LIU_CHONG') && !chineseOverlays.includes('LIU_CHONG')) {
      chineseOverlays.push('LIU_CHONG');
    } else if (primaryPattern.includes('XING') && !chineseOverlays.includes('XING')) {
      chineseOverlays.push('XING');
    } else if (primaryPattern.includes('LIU_HAI') && !chineseOverlays.includes('LIU_HAI')) {
      chineseOverlays.push('LIU_HAI');
    } else if (primaryPattern.includes('PO') && !chineseOverlays.includes('PO')) {
      chineseOverlays.push('PO');
    }
    const westernRelation = extractWesternRelation(simpleBox.westElementRelation);
    const primaryLabel = extractPrimaryLabel(simpleBox.matchLabel);
    
    // Map match label to rank key
    const labelToRankKey: Record<string, RankKey> = {
      "Soulmate Match": "perfect",
      "Twin Flame Match": "excellent",
      "Excellent Match": "excellent",
      "Favourable Match": "good",
      "Good Friends": "good",
      "Good Friends Match": "good",
      "Opposites Attract": "fair",
      "Magnetic Opposites": "fair",
      "Neutral Match": "fair",
      "Difficult Match": "challenging",
    };
    
    const rankKey = labelToRankKey[simpleBox.matchLabel] || "neutral";
    
    // Map label to tier
    const labelToTier = (label: string): string => {
      if (label === "SOULMATE" || label === "SOULMATE MATCH" || label === "Soulmate Match") return "Soulmate";
      if (label === "TWIN FLAME" || label === "TWIN FLAME MATCH" || label === "Twin Flame Match") return "Twin Flame";
      if (label === "HARMONIOUS" || label === "HARMONIOUS MATCH" || label === "Excellent Match") return "Excellent";
      if (label === "Favourable Match") return "Favourable";
      if (label === "Good Friends" || label === "Good Friends Match") return "Favourable";
      if (label === "OPPOSITES_ATTRACT" || label === "OPPOSITES ATTRACT" || label === "Opposites Attract" || label === "Magnetic Opposites") return "Magnetic Opposites";
      if (label === "NEUTRAL" || label === "NEUTRAL MATCH" || label === "Neutral Match") return "Neutral";
      if (label === "DIFFICULT" || label === "DIFFICULT MATCH" || label === "Difficult Match") return "Difficult";
      return "Neutral";
    };
    
    // Extract emoji and color from label
    const labelToEmoji: Record<string, string> = {
      "SOULMATE": "💫",
      "SOULMATE MATCH": "💫",
      "Soulmate Match": "💫",
      "TWIN FLAME": "🔥",
      "TWIN FLAME MATCH": "🔥",
      "Twin Flame Match": "🔥",
      "HARMONIOUS": "✨",
      "HARMONIOUS MATCH": "✨",
      "Excellent Match": "✨",
      "Favourable Match": "✨",
      "Good Friends": "✨",
      "Good Friends Match": "✨",
      "OPPOSITES_ATTRACT": "⚡",
      "OPPOSITES ATTRACT": "⚡",
      "Opposites Attract": "⚡",
      "Magnetic Opposites": "⚡",
      "NEUTRAL": "✨",
      "NEUTRAL MATCH": "✨",
      "Neutral Match": "✨",
      "DIFFICULT": "💔",
      "DIFFICULT MATCH": "💔",
      "Difficult Match": "💔",
    };
    
    const labelToColor: Record<string, string> = {
      "SOULMATE": "rgb(212, 175, 55)",
      "SOULMATE MATCH": "rgb(212, 175, 55)",
      "Soulmate Match": "rgb(212, 175, 55)",
      "TWIN FLAME": "rgb(255, 140, 0)",
      "TWIN FLAME MATCH": "rgb(255, 140, 0)",
      "Twin Flame Match": "rgb(255, 140, 0)",
      "HARMONIOUS": "rgb(219, 39, 119)",
      "HARMONIOUS MATCH": "rgb(219, 39, 119)",
      "Excellent Match": "rgb(219, 39, 119)",
      "Favourable Match": "rgb(219, 39, 119)",
      "Good Friends": "rgb(34, 139, 34)",
      "Good Friends Match": "rgb(34, 139, 34)",
      "OPPOSITES_ATTRACT": "rgb(239, 68, 68)",
      "OPPOSITES ATTRACT": "rgb(239, 68, 68)",
      "Opposites Attract": "rgb(239, 68, 68)",
      "Magnetic Opposites": "rgb(239, 68, 68)",
      "NEUTRAL": "rgb(34, 139, 34)",
      "NEUTRAL MATCH": "rgb(34, 139, 34)",
      "Neutral Match": "rgb(34, 139, 34)",
      "DIFFICULT": "rgb(239, 68, 68)",
      "DIFFICULT MATCH": "rgb(239, 68, 68)",
      "Difficult Match": "rgb(239, 68, 68)",
    };
    
    const tier = labelToTier(simpleBox.matchLabel);
    
    // Generate Western sun sign relationship blurb
    const westernSignLine = getSunMatchBlurb(
      userWest as WesternSign,
      profileWest as WesternSign
    );
    
    return {
      score: simpleBox.score,
      rank: simpleBox.matchLabel,
      rankLabel: simpleBox.matchLabel,
      rankKey: rankKey as any,
      emoji: labelToEmoji[simpleBox.matchLabel] || "🌟",
      colorRgb: labelToColor[simpleBox.matchLabel] || "rgb(34, 139, 34)",
      connectionLabel: simpleBox.headingLine,
      tagline: simpleBox.matchLabel,
      east_tagline: simpleBox.chineseLine,
      tags: [],
      // Map overview from SimpleConnectionBox to both insight and longformBody
      insight: simpleBox.overview || '',
      longformBody: simpleBox.overview || '',
      east_relation: simpleBox.chineseLine,
      east_summary: simpleBox.chineseLine,
      east_description: simpleBox.chineseDescription || '',
      west_relation: simpleBox.westernLine,
      west_summary: simpleBox.westernLine,
      west_description: simpleBox.westernDescription || '',
      west_tagline: simpleBox.westernTagline || undefined,
      westernSignLine: westernSignLine,
      wuXingLine: simpleBox.wuXingLine,
      a: {
        west: userWest,
        east: userEast,
        westGlyph: getWesternSignGlyph(userWest),
        eastGlyph: getChineseSignGlyph(userEast),
        chineseElement: userYearElement
      },
      b: {
        west: profileWest,
        east: profileEast,
        westGlyph: getWesternSignGlyph(profileWest),
        eastGlyph: getChineseSignGlyph(profileEast),
        chineseElement: profileYearElement
      },
      tier: tier as any,
      aboutMeText: profile.aboutMe || profile.aboutMeText,
      age: profile.age,
      occupation: profile.occupation,
      city: profile.city,
      distance: profile.distance,
      height: profile.height,
      children: profile.children,
      religion: profile.religion,
      selectedDeepPrompts: profile.prompts?.map((p: any) => p.question),
      deepPromptAnswers: profile.prompts?.reduce((acc: any, p: any) => {
        acc[p.question] = p.answer;
        return acc;
      }, {}),
      selectedRelationshipGoals: profile.relationshipGoals || profile.selectedRelationshipGoals,
      selectedOrganizedInterests: profile.interests || profile.selectedOrganizedInterests,
      chinesePattern: simpleBox.chinesePattern,
      westAspect: simpleBox.westAspect,
      westElementRelation: simpleBox.westElementRelation,
      isChineseOpposite: simpleBox.isChineseOpposite,
      isLivelyPair: simpleBox.isLivelyPair,
      wuXingA: userYearElement as WuXing,
      wuXingB: profileYearElement as WuXing,
      pillLabel: simpleBox.pillLabel,
      pattern: simpleBox.pattern,
      patternFullLabel: simpleBox.patternFullLabel,
      baseTagline: simpleBox.baseTagline,
      patternEmoji: simpleBox.patternEmoji,
      chemistryStars: simpleBox.chemistryStars,
      stabilityStars: simpleBox.stabilityStars,
      connectionUI: {
        primaryLabel,
        chineseBase,
        chineseOverlays,
        westernRelation,
      },
    };
  };

  // Build compatibility box using latest match engine (same as matches page)
  useEffect(() => {
    if (!userZodiacSigns.western || !userZodiacSigns.chinese || !profile) return
    
    try {
      // Get user profile for new engine
      const userProfile: UserProfile = {
        sunSign: userZodiacSigns.western.toLowerCase() as any,
        animal: userZodiacSigns.chinese.toLowerCase() as any,
      };
      
      // Get user's Wu Xing year element from birthdate
      let userYearElement: any;
      try {
        const userBirthInfo = localStorage.getItem("userBirthInfo");
        if (userBirthInfo) {
          const birthInfo = JSON.parse(userBirthInfo);
          if (birthInfo.birthdate) {
            const userBirthDate = new Date(birthInfo.birthdate);
            const userYear = userBirthDate.getFullYear();
            userYearElement = getWuXingYearElement(userYear);
          }
        } else {
          // Fallback: Use a default year for the Chinese animal
          const animalToDefaultYear: Record<string, number> = {
            'rat': 1996, 'ox': 1997, 'tiger': 1998, 'rabbit': 1999,
            'dragon': 2000, 'snake': 2001, 'horse': 2002, 'goat': 2003,
            'monkey': 2004, 'rooster': 2005, 'dog': 2006, 'pig': 2007,
          };
          const userAnimal = userZodiacSigns.chinese.toLowerCase();
          const defaultYear = animalToDefaultYear[userAnimal] || 1987;
          userYearElement = getWuXingYearElement(defaultYear);
        }
      } catch (error) {
        console.error('[Profile View] Error calculating user Wu Xing year element:', error);
      }
      
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
      
      // Calculate profile's Wu Xing year element from birthdate
      let profileYearElement: any;
      try {
        if (profile.birthdate) {
          const profileBirthDate = new Date(profile.birthdate);
          const profileYear = profileBirthDate.getFullYear();
          profileYearElement = getWuXingYearElement(profileYear);
        }
      } catch (error) {
        console.error('[Profile View] Error calculating profile Wu Xing year element:', error);
      }
      
      // Use buildConnectionBox (latest version) which includes overview paragraph
      const profileForNewEngine: UserProfile = {
        sunSign: (profileSunSigns.tropical || profile.westernSign || 'Gemini').toLowerCase() as any,
        animal: profile.easternSign.toLowerCase() as any,
      };
      
      const simpleBox = buildConnectionBox(
        userProfile,
        profileForNewEngine,
        userYearElement,
        profileYearElement
      );
      
      if (!simpleBox) {
        console.error('[Profile View] buildConnectionBox returned undefined');
        return;
      }
      
      // Convert to ConnectionBoxData format
      const boxData = convertSimpleToConnectionBoxData(
        simpleBox,
        userDisplayWestCapitalized,
        userZodiacSigns.chinese,
        profileDisplayWestCapitalized,
        profileEastern,
        profile,
        userYearElement,
        profileYearElement
      );
      
      setConnectionBoxData(boxData)
      console.log('[Profile View] ✨ Latest Match Engine Active')
      console.log('[Profile View] Connection box:', boxData)
      console.log('[Profile View] Profile data:', {
        relationshipGoals: profile.relationshipGoals || profile.selectedRelationshipGoals,
        interests: profile.interests || profile.selectedOrganizedInterests,
        aboutMeText: profile.aboutMe || profile.aboutMeText,
        city: profile.city,
        occupation: profile.occupation,
        age: profile.age,
        height: profile.height
      })
      console.log('[Profile View] Box data profile fields:', {
        selectedRelationshipGoals: boxData.selectedRelationshipGoals,
        selectedOrganizedInterests: boxData.selectedOrganizedInterests,
        aboutMeText: boxData.aboutMeText,
        city: boxData.city,
        occupation: boxData.occupation,
        age: boxData.age,
        height: boxData.height
      })
      console.log('[Profile View] Score:', simpleBox.score, 'Label:', simpleBox.matchLabel)
      if (simpleBox.overview) {
        console.log('[Profile View] Overview:', simpleBox.overview.substring(0, 100) + '...')
      }
    } catch (error) {
      console.error("[Profile View] Error building connection box:", error)
    }
  }, [userZodiacSigns, profile, profileSunSigns, sunSignSystem])

  useEffect(() => {
    if (!profile) {
      router.push("/matches")
    }
  }, [profile, router])

  // Attach non-passive event listeners for zoom modal
  useEffect(() => {
    const modalElement = zoomModalRef.current
    if (!modalElement) return

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault()
        lastZoomDistanceRef.current = getDistance(e.touches)
        lastTwoFingerMidpointRef.current = getTwoFingerMidpoint(e.touches)
      } else if (e.touches.length === 1) {
        e.preventDefault()
        lastTouchPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 || (e.touches.length === 1 && zoomScale > 1)) {
        e.preventDefault()
      }
      handleZoomTouchMove(e)
    }

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault()
      handleZoomTouchEnd(e)
    }

    modalElement.addEventListener('touchstart', handleTouchStart, { passive: false })
    modalElement.addEventListener('touchmove', handleTouchMove, { passive: false })
    modalElement.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      modalElement.removeEventListener('touchstart', handleTouchStart)
      modalElement.removeEventListener('touchmove', handleTouchMove)
      modalElement.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isZoomModalOpen, zoomScale])

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
      // Note: preventDefault removed - using touch-action CSS instead
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
      // Note: preventDefault removed - using touch-action CSS instead
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
      // Note: preventDefault removed - using touch-action CSS instead
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

  const handleZoomTouchMove = (e: TouchEvent | React.TouchEvent) => {
    const touches = e.touches
    if (touches.length === 2) {
      const distance = getDistance(touches)
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
      const currentMidpoint = getTwoFingerMidpoint(touches)
      const deltaX = currentMidpoint.x - lastTwoFingerMidpointRef.current.x
      const deltaY = currentMidpoint.y - lastTwoFingerMidpointRef.current.y
      // Smooth, controlled sensitivity
      setZoomPosX(prev => prev + deltaX * 0.7)
      setZoomPosY(prev => prev + deltaY * 0.7)
      lastTwoFingerMidpointRef.current = currentMidpoint
    } else if (touches.length === 1 && zoomScale > 1) {
      // Pan when zoomed in
      const touch = touches[0]
      const deltaX = touch.clientX - lastTouchPosRef.current.x
      const deltaY = touch.clientY - lastTouchPosRef.current.y
      // Reduced sensitivity panning
      setZoomPosX(prev => prev + deltaX * 0.8)
      setZoomPosY(prev => prev + deltaY * 0.8)
      lastTouchPosRef.current = { x: touch.clientX, y: touch.clientY }
    }
  }

  const handleZoomTouchEnd = (e: TouchEvent | React.TouchEvent) => {
    const touches = e.touches
    // Close modal only when all fingers are lifted
    if (isZoomModalOpen && touches.length === 0) {
      setIsZoomModalOpen(false)
      setZoomScale(1)
      setZoomPosX(0)
      setZoomPosY(0)
      lastZoomDistanceRef.current = 0
    } else if (touches.length === 1) {
      // Transitioning from two fingers to one - update last touch position
      lastTouchPosRef.current = { x: touches[0].clientX, y: touches[0].clientY }
    }
  }

  const handlePass = () => {
    // Navigate back to likes page or previous page
    router.back()
  }

  const handleLike = () => {
    // Handle like action
    console.log('Liked profile:', profileId)
    // TODO: Add like API call
  }

  const handleMessage = () => {
    router.push(`/messages/${profileId}`)
  }

  const handleViewProfile = () => {
    router.push(`/profile/settings`)
  }

  // Get pattern colors for border (same as discover section)
  const patternColors = connectionBoxData?.pattern 
    ? getPatternGradientColors(connectionBoxData.pattern)
    : { start: '#60a5fa', end: '#3b82f6' };
  
  console.log('🎨 PROFILE VIEW - Pattern Colors:', patternColors);
  console.log('🎨 PROFILE VIEW - Connection Pattern:', connectionBoxData?.pattern);
  

  return (
    <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 min-h-screen pb-8">
      <div className="relative z-10 max-w-md mx-auto">
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

        {/* Profile Content - Wrapped in border like discover section */}
        <div className="w-full flex justify-center px-2 pt-0 mb-4">
          <div
            className="w-full rounded-3xl flex flex-col relative"
            style={{ 
              border: `3px solid ${patternColors.start}`,
              background: `linear-gradient(to right, ${patternColors.start}, ${patternColors.end})`,
              padding: '3px',
              zIndex: 10,
            }}
          >
            <div
              ref={setProfileCardRef}
              className={`w-full !h-auto !min-h-0 rounded-3xl flex flex-col overflow-hidden ${
                theme === "light" ? "bg-gray-50" : "bg-slate-900"
              }`}
              style={{ zIndex: 1 }}
            >
            {/* Photo Carousel */}
            <div className="relative" style={{ marginLeft: '-3px', marginRight: '-3px', marginTop: '-3px', zIndex: 0, marginBottom: '0' }}>
              <div className="w-full aspect-[4/5] rounded-t-3xl overflow-hidden">
              <button
                onClick={() => router.push(`/messages/${profileId}`)}
                className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all shadow-lg"
                aria-label="Chat"
              >
                <MessageCircle className="w-6 h-6 text-white" />
              </button>

              <div
                ref={imageContainerRef}
                className="w-full h-full relative cursor-pointer"
                style={{ touchAction: 'pan-y pinch-zoom' }}
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

            {/* Your Connection Section - Connected to carousel */}
            {connectionBoxData && (
              <ConnectionBoxSimple data={connectionBoxData} />
            )}
            </div>
          </div>
        </div>

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

        {/* Action Buttons */}
        <div className="px-4 pb-8 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handlePass}
              className={`py-3 rounded-xl transition-all flex items-center justify-center gap-2 font-semibold text-sm ${
                theme === "light" 
                  ? "bg-gray-200 hover:bg-gray-300 text-gray-800" 
                  : "bg-slate-900/50 hover:bg-slate-800/60 border border-indigo-400/20 text-white/90"
              }`}
            >
              <X className="w-5 h-5" />
              Pass
            </button>
            <button
              onClick={handleLike}
              className={`py-3 rounded-xl transition-all flex items-center justify-center gap-2 font-semibold text-sm ${
                theme === "light" 
                  ? "bg-green-100 hover:bg-green-200 text-green-800" 
                  : "bg-green-900/30 hover:bg-green-800/40 border border-green-400/20 text-green-100"
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              Like
            </button>
            <button
              onClick={handleMessage}
              className={`py-3 rounded-xl transition-all flex items-center justify-center gap-2 font-semibold text-sm ${
                theme === "light" 
                  ? "bg-blue-100 hover:bg-blue-200 text-blue-800" 
                  : "bg-blue-900/30 hover:bg-blue-800/40 border border-blue-400/20 text-blue-100"
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              Message
            </button>
            <button
              onClick={handleViewProfile}
              className={`py-3 rounded-xl transition-all flex items-center justify-center gap-2 font-semibold text-sm ${
                theme === "light" 
                  ? "bg-purple-100 hover:bg-purple-200 text-purple-800" 
                  : "bg-purple-900/30 hover:bg-purple-800/40 border border-purple-400/20 text-purple-100"
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Profile
            </button>
          </div>
        </div>
      </div>

      {/* Full-Screen Zoom Modal */}
      {isZoomModalOpen && (
        <div 
          ref={zoomModalRef}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
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
