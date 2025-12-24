"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/ThemeContext"
import { getConversation, createConversation, updateConversation, type Conversation } from "@/lib/utils/conversations"
import { buildConnectionBox } from "@/lib/compat/engine"
import type { UserProfile, SimpleConnectionBox } from "@/lib/compat/types"
import { getWesternSignGlyph, getChineseSignGlyph, capitalizeSign } from "@/lib/zodiacHelpers"
import { getBothSunSignsFromBirthdate, getSavedSunSigns } from "@/lib/sunSignCalculator"
import { useSunSignSystem } from "@/lib/hooks/useSunSign"
import { getWuXingYearElement, type WuXing } from "@/lib/matchEngine"
import { getSunMatchBlurb, type WesternSign } from "@/lib/connectionSunVibes"
import type { ConnectionBoxData } from "@/components/ConnectionBoxSimple"
import MatchProfileCard from "@/components/MatchProfileCard"
import { 
  applySameSignCap,
  type ChineseBasePattern
} from "@/lib/matchLabelEngine"
import { fetchUserProfile, fetchUserMatches, findMatchBetweenUsers } from "@/lib/supabase/profileQueries"
import { createClient } from "@/lib/supabase/client"
import { sendMessage, getMessages, subscribeToMessages } from "@/lib/supabase/messageActions"
import { unmatchUser, reportUser, blockUser } from "@/lib/supabase/userActions"

const ArrowLeft = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
)

const ChevronLeft = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M15 18l-6-6 6-6" />
  </svg>
)

const Send = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
)

const MoreVertical = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
)

const Bell = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const UserX = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM18 8l5 5M23 8l-5 5" />
  </svg>
)

const Flag = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" />
  </svg>
)

const ShieldOff = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

const Image = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
)

const Gif = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor" stroke="none">GIF</text>
  </svg>
)

const Search = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

const X = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

export default function ChatPage() {
  const router = useRouter()
  const params = useParams()
  const { theme, setTheme } = useTheme()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  const [showMenu, setShowMenu] = useState(false)
  const [activeTab, setActiveTab] = useState<"chat" | "profile">("chat")
  const [confirmDialog, setConfirmDialog] = useState<"unmatch" | "report" | "block" | null>(null)
  const [showGifPicker, setShowGifPicker] = useState(false)
  const [gifSearch, setGifSearch] = useState("")
  const [gifs, setGifs] = useState<any[]>([])
  const [gifLoading, setGifLoading] = useState(false)
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [connectionBoxData, setConnectionBoxData] = useState<ConnectionBoxData | null>(null)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [showProfile, setShowProfile] = useState(false)
  const [showElements, setShowElements] = useState(false)
  const sunSignSystem = useSunSignSystem()
  const supabase = createClient()
  
  // User's zodiac signs for matching
  const [userZodiacSigns, setUserZodiacSigns] = useState<{western: string, chinese: string}>({
    western: 'leo',
    chinese: 'rabbit'
  })

  // Profile data for both users
  const [otherUserProfile, setOtherUserProfile] = useState<any>(null)
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null)
  const [matchId, setMatchId] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const userId = (params?.id as string) || ""

  // Load user's zodiac signs from localStorage
  useEffect(() => {
    const userWesternSign = localStorage.getItem("userSunSign")
    const userChineseSign = localStorage.getItem("userChineseSign")
    
    console.log("[Messages] Loading from localStorage:", { userWesternSign, userChineseSign })

    if (userWesternSign && userChineseSign) {
      setUserZodiacSigns({
        western: userWesternSign,
        chinese: userChineseSign
      })
    } else {
      // Default fallback if no signs in localStorage
      console.warn("[Messages] No user signs in localStorage, using default Leo-Rabbit")
      setUserZodiacSigns({
        western: 'leo',
        chinese: 'rabbit'
      })
    }
  }, [])
  
  // Helper function to convert SimpleConnectionBox to ConnectionBoxData (same as profile view page)
  const convertSimpleToConnectionBoxData = (
    simpleBox: SimpleConnectionBox,
    userWest: string,
    userEast: string,
    profileWest: string,
    profileEast: string,
    profile: any,
    userYearElement?: any,
    profileYearElement?: any
  ): ConnectionBoxData => {
    const {
      extractChineseBase,
      extractChineseOverlays,
      extractWesternRelation,
      extractPrimaryLabel,
    } = require('@/lib/connectionUiHelpers');
    
    const chineseBase = extractChineseBase(simpleBox.chinesePattern || simpleBox.pattern);
    let chineseOverlays = extractChineseOverlays(
      simpleBox.chinesePattern || simpleBox.pattern,
      undefined,
      simpleBox.chineseLine
    );
    
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
    
    const labelToRankKey: Record<string, any> = {
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
    
    const labelToEmoji: Record<string, string> = {
      "SOULMATE": "💫", "SOULMATE MATCH": "💫", "Soulmate Match": "💫",
      "TWIN FLAME": "🔥", "TWIN FLAME MATCH": "🔥", "Twin Flame Match": "🔥",
      "HARMONIOUS": "✨", "HARMONIOUS MATCH": "✨", "Excellent Match": "✨",
      "Favourable Match": "✨", "Good Friends": "✨", "Good Friends Match": "✨",
      "OPPOSITES_ATTRACT": "⚡", "OPPOSITES ATTRACT": "⚡", "Opposites Attract": "⚡", "Magnetic Opposites": "⚡",
      "NEUTRAL": "✨", "NEUTRAL MATCH": "✨", "Neutral Match": "✨",
      "DIFFICULT": "💔", "DIFFICULT MATCH": "💔", "Difficult Match": "💔",
    };
    
    const labelToColor: Record<string, string> = {
      "SOULMATE": "rgb(212, 175, 55)", "SOULMATE MATCH": "rgb(212, 175, 55)", "Soulmate Match": "rgb(212, 175, 55)",
      "TWIN FLAME": "rgb(255, 140, 0)", "TWIN FLAME MATCH": "rgb(255, 140, 0)", "Twin Flame Match": "rgb(255, 140, 0)",
      "HARMONIOUS": "rgb(219, 39, 119)", "HARMONIOUS MATCH": "rgb(219, 39, 119)", "Excellent Match": "rgb(219, 39, 119)",
      "Favourable Match": "rgb(219, 39, 119)", "Good Friends": "rgb(34, 139, 34)", "Good Friends Match": "rgb(34, 139, 34)",
      "OPPOSITES_ATTRACT": "rgb(239, 68, 68)", "OPPOSITES ATTRACT": "rgb(239, 68, 68)", "Opposites Attract": "rgb(239, 68, 68)", "Magnetic Opposites": "rgb(239, 68, 68)",
      "NEUTRAL": "rgb(34, 139, 34)", "NEUTRAL MATCH": "rgb(34, 139, 34)", "Neutral Match": "rgb(34, 139, 34)",
      "DIFFICULT": "rgb(239, 68, 68)", "DIFFICULT MATCH": "rgb(239, 68, 68)", "Difficult Match": "rgb(239, 68, 68)",
    };
    
    const tier = labelToTier(simpleBox.matchLabel);
    const westernSignLine = getSunMatchBlurb(userWest as WesternSign, profileWest as WesternSign);
    
    // Apply same-sign cap at 68% (same as profile view tab)
    // Check if it's a same-sign match (same Chinese animal)
    const isSameSign = userEast.toLowerCase() === profileEast.toLowerCase();
    const chineseBaseForCap = isSameSign ? 'SAME_SIGN' : (chineseBase as ChineseBasePattern);
    let cappedScore = applySameSignCap(simpleBox.score, chineseBaseForCap);
    
    // If it's a same-sign match and score is below 68%, ensure it's at least 68% (matching profile view tab behavior)
    if (isSameSign && cappedScore < 68) {
      cappedScore = 68;
    }
    
    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('[Messages] Score capping:', {
        originalScore: simpleBox.score,
        chineseBase,
        isSameSign,
        chineseBaseForCap,
        cappedScore,
        userEast,
        profileEast
      });
    }
    
    return {
      score: cappedScore,
      rank: simpleBox.matchLabel,
      rankLabel: simpleBox.matchLabel,
      rankKey: rankKey as any,
      emoji: labelToEmoji[simpleBox.matchLabel] || "🌟",
      colorRgb: labelToColor[simpleBox.matchLabel] || "rgb(34, 139, 34)",
      connectionLabel: simpleBox.headingLine,
      tagline: simpleBox.matchLabel,
      east_tagline: simpleBox.chineseLine,
      tags: [],
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
  
  // Build compatibility box using latest match engine
  useEffect(() => {
    if (!userZodiacSigns.western || !userZodiacSigns.chinese || !conversation) return
    
    try {
      const userProfile: UserProfile = {
        sunSign: userZodiacSigns.western.toLowerCase() as any,
        animal: userZodiacSigns.chinese.toLowerCase() as any,
      };
      
      // Get user's Wu Xing year element
      let userYearElement: any = 'wood'; // Default fallback
      try {
        const userBirthInfo = localStorage.getItem("userBirthInfo");
        if (userBirthInfo) {
          const birthInfo = JSON.parse(userBirthInfo);
          if (birthInfo.birthdate) {
            const userBirthDate = new Date(birthInfo.birthdate);
            const userYear = userBirthDate.getFullYear();
            userYearElement = getWuXingYearElement(userYear);
          }
        } else if (currentUserProfile?.birthdate) {
          // Fallback to current user profile birthdate
          const userBirthDate = new Date(currentUserProfile.birthdate);
          const userYear = userBirthDate.getFullYear();
          userYearElement = getWuXingYearElement(userYear);
        }
      } catch (error) {
        console.error('[Messages] Error calculating user Wu Xing year element:', error);
      }
      
      // Get profile's zodiac signs - prioritize otherUserProfile from database
      const profileWesternSign = otherUserProfile?.western_sign || (conversation as any).westernSign || 'Gemini'
      const profileEasternSign = otherUserProfile?.chinese_sign || (conversation as any).easternSign || 'Dragon'
      const profileBirthdate = otherUserProfile?.birthdate || (conversation as any).birthdate || '1996-05-21'
      const profileSunSigns = getBothSunSignsFromBirthdate(profileBirthdate)
      const profileTropical = capitalizeSign(profileSunSigns.tropical || profileWesternSign) as any
      const profileEastern = capitalizeSign(profileEasternSign)
      const profileDisplayWest = sunSignSystem === 'sidereal'
        ? (profileSunSigns.sidereal || profileWesternSign)
        : (profileSunSigns.tropical || profileWesternSign)
      const profileDisplayWestCapitalized = capitalizeSign(profileDisplayWest)
      const savedUserSunSigns = getSavedSunSigns()
      const userDisplayWest = sunSignSystem === 'sidereal'
        ? (savedUserSunSigns.sidereal ?? userZodiacSigns.western)
        : (savedUserSunSigns.tropical ?? userZodiacSigns.western)
      const userDisplayWestCapitalized = capitalizeSign(userDisplayWest)
      
      // Calculate profile's Wu Xing year element
      let profileYearElement: any = 'wood'; // Default fallback
      try {
        if (profileBirthdate) {
          const profileBirthDate = new Date(profileBirthdate);
          const profileYear = profileBirthDate.getFullYear();
          profileYearElement = getWuXingYearElement(profileYear);
        } else if (otherUserProfile?.birthdate) {
          // Fallback to other user profile birthdate
          const profileBirthDate = new Date(otherUserProfile.birthdate);
          const profileYear = profileBirthDate.getFullYear();
          profileYearElement = getWuXingYearElement(profileYear);
        }
      } catch (error) {
        console.error('[Messages] Error calculating profile Wu Xing year element:', error);
      }
      
      const profileForNewEngine: UserProfile = {
        sunSign: (profileSunSigns.tropical || profileWesternSign).toLowerCase() as any,
        animal: profileEasternSign.toLowerCase() as any,
      };
      
      const simpleBox = buildConnectionBox(
        userProfile,
        profileForNewEngine,
        userYearElement,
        profileYearElement
      );
      
      if (!simpleBox) {
        console.error('[Messages] buildConnectionBox returned undefined');
        return;
      }
      
      // Create profile object with all necessary fields
      const profile = {
        aboutMe: (conversation as any).aboutMe,
        aboutMeText: (conversation as any).aboutMe,
        age: (conversation as any).age || 28,
        occupation: (conversation as any).occupation,
        city: (conversation as any).city,
        height: (conversation as any).height,
        children: (conversation as any).children,
        religion: (conversation as any).religion,
        prompts: (conversation as any).prompts,
        relationshipGoals: (conversation as any).relationshipGoals,
        selectedRelationshipGoals: (conversation as any).relationshipGoals,
        interests: (conversation as any).interests,
        selectedOrganizedInterests: (conversation as any).interests,
        westernSign: otherUserProfile?.western_sign ? capitalizeSign(otherUserProfile.western_sign) : profileDisplayWestCapitalized,
        easternSign: otherUserProfile?.chinese_sign ? capitalizeSign(otherUserProfile.chinese_sign) : profileEastern,
        birthdate: profileBirthdate,
      };
      
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
      console.log('[Messages] ✨ Latest Match Engine Active')
      console.log('[Messages] Connection box:', boxData)
    } catch (error) {
      console.error('[Messages] Error building connection box:', error);
      // Set a minimal connection box data to prevent errors
      setConnectionBoxData(null)
    }
  }, [userZodiacSigns, conversation, sunSignSystem, currentUserProfile, otherUserProfile])

  // Load profile data, match, and messages from database
  useEffect(() => {
    let subscription: any = null
    let isMounted = true
    let timeoutId: NodeJS.Timeout | null = null
    
    const loadChatData = async () => {
      setIsLoading(true)
      setLoadError(null)
      
      // Timeout fallback - if loading takes more than 10 seconds, show error
      timeoutId = setTimeout(() => {
        if (isMounted) {
          console.error('[Chat] ⏱️ Loading timeout - taking too long')
          setLoadError('Loading is taking longer than expected. Please try again.')
          setIsLoading(false)
        }
      }, 10000)
      
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          console.error('[Chat] No authenticated user')
          setLoadError('Not authenticated. Please log in.')
          setIsLoading(false)
          return
        }
        
        setCurrentUserId(user.id)
        const currentProfile = await fetchUserProfile(user.id)
        setCurrentUserProfile(currentProfile)

        // Get other user's profile
        const otherProfile = await fetchUserProfile(userId)
        if (!otherProfile) {
          console.error('[Chat] Other user profile not found')
          setLoadError('User profile not found.')
          setIsLoading(false)
          return
        }
        
        setOtherUserProfile(otherProfile)
        
        // Find the match between current user and other user
        // Try direct lookup first (more reliable)
        let match = await findMatchBetweenUsers(user.id, userId)
        console.log('[Chat] Direct match lookup result:', match)
        
        let matches: any[] = []
        
        // If direct lookup fails, try fetching all matches and finding it
        if (!match) {
          matches = await fetchUserMatches(user.id)
          console.log('[Chat] All matches:', matches)
          console.log('[Chat] Looking for match with userId:', userId, 'type:', typeof userId)
          console.log('[Chat] Current user id:', user.id, 'type:', typeof user.id)
          
          // Normalize IDs to strings for comparison
          const normalizedUserId = String(userId).trim()
          const normalizedCurrentUserId = String(user.id).trim()
          
          match = matches.find((m: any) => {
            // Normalize match IDs
            const user1Id = String(m.user1_id || '').trim()
            const user2Id = String(m.user2_id || '').trim()
            
            // Check if the other user's ID matches userId
            const otherUserId = user1Id === normalizedCurrentUserId ? user2Id : user1Id
            const otherUserProfile = user1Id === normalizedCurrentUserId ? m.user2 : m.user1
            const otherUserProfileId = otherUserProfile?.id ? String(otherUserProfile.id).trim() : null
            
            console.log('[Chat] Checking match:', { 
              matchId: m.id, 
              user1_id: user1Id, 
              user2_id: user2Id,
              otherUserId,
              otherUserProfileId,
              userId: normalizedUserId,
              currentUserId: normalizedCurrentUserId,
              matchesUserId: otherUserId === normalizedUserId,
              matchesProfileId: otherUserProfileId === normalizedUserId
            })
            
            // Match if userId matches either the user ID or profile ID
            return otherUserId === normalizedUserId || otherUserProfileId === normalizedUserId
          })
        }
        
        if (match) {
          console.log('[Chat] ✅ Match found:', match.id)
          setMatchId(match.id)
          
          // Mark this match as viewed in localStorage (to hide "New Match" badge)
          const viewedMatches = JSON.parse(localStorage.getItem('viewedMatches') || '[]')
          if (!viewedMatches.includes(match.id)) {
            viewedMatches.push(match.id)
            localStorage.setItem('viewedMatches', JSON.stringify(viewedMatches))
          }
          
          // Load messages from database
          const dbMessages = await getMessages(match.id, 100)
          console.log('[Chat] Loaded messages from database:', dbMessages.length)
          
          // Convert database messages to chat format
          const formattedMessages = dbMessages.map((msg: any) => ({
            id: msg.id,
            text: msg.content,
            sent: msg.sender_id === user.id,
            timestamp: msg.created_at,
            image: msg.message_type === 'image' ? msg.content : undefined,
            gif: msg.message_type === 'gif' ? msg.content : undefined,
          }))
          
          setMessages(formattedMessages)
          
          // Set up real-time subscription for new messages
          subscription = subscribeToMessages(match.id, (newMessage) => {
            console.log('[Chat] 📨 New message received:', newMessage)
            setMessages(prev => {
              // Check if message already exists
              if (prev.some(m => m.id === newMessage.id)) {
                return prev
              }
              
              return [...prev, {
                id: newMessage.id,
                text: newMessage.content,
                sent: newMessage.sender_id === user.id,
                timestamp: newMessage.created_at,
                image: newMessage.message_type === 'image' ? newMessage.content : undefined,
                gif: newMessage.message_type === 'gif' ? newMessage.content : undefined,
              }]
            })
          })
        } else {
          console.error('[Chat] ❌ No match found between users')
          console.error('[Chat] Debug info:', {
            currentUserId: user.id,
            otherUserId: userId,
            totalMatches: matches.length,
            matchUserIds: matches.map((m: any) => ({
              user1_id: m.user1_id,
              user2_id: m.user2_id,
              matchId: m.id
            }))
          })
          // Don't redirect here - let the user see the error when they try to send
          // But still set conversation so the page can render
        }
        
        // Update conversation with actual name (for UI) - always set this so page can render
        let conv = getConversation(userId)
        if (!conv) {
          conv = createConversation(
            userId, 
            otherProfile.display_name || `User ${userId}`, 
            otherProfile.photos?.[0] || "/placeholder.svg?height=400&width=400"
          )
        } else {
          conv.userName = otherProfile.display_name || conv.userName
          conv.userPhoto = otherProfile.photos?.[0] || conv.userPhoto
        }
        // Add matchedAt from match data if available
        if (match && match.matched_at) {
          conv.matchedAt = match.matched_at
        }
        setConversation(conv)
        clearTimeout(timeoutId)
        if (isMounted) {
          setIsLoading(false)
        }
        
      } catch (error) {
        console.error('[Chat] Error loading chat data:', error)
        clearTimeout(timeoutId)
        if (isMounted) {
          setLoadError('Failed to load chat. Please try again.')
          setIsLoading(false)
        }
      }
    }

    loadChatData()
    
    // Cleanup function for useEffect
    return () => {
      isMounted = false
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      if (subscription && subscription.unsubscribe) {
        console.log('[Chat] 🧹 Unsubscribing from messages')
        subscription.unsubscribe()
      }
    }
  }, [userId, supabase, sunSignSystem])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("touchstart", handleClickOutside as any)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside as any)
    }
  }, [showMenu])

  const handleSend = async () => {
    console.log('[Chat] handleSend called', { 
      message: message.trim(), 
      matchId, 
      currentUserId, 
      userId 
    })
    
    if (!message.trim()) {
      console.warn('[Chat] Message is empty')
      return
    }
    
    if (!matchId) {
      console.error('[Chat] ❌ No matchId - cannot send message')
      alert('Match not found. Please go back and try again.')
      return
    }
    
    if (!currentUserId) {
      console.error('[Chat] ❌ No currentUserId - cannot send message')
      alert('Not logged in. Please refresh the page.')
      return
    }
    
    if (!userId) {
      console.error('[Chat] ❌ No userId - cannot send message')
      return
    }

    try {
      console.log('[Chat] Sending message to database...')
      // Send message to database - determine source from match context
      // For now, default to 'connections' since chat is typically from connections page
      const result = await sendMessage(matchId, currentUserId, userId, message.trim(), 'text', 'connections')
      
      console.log('[Chat] Send result:', result)
      
      if (result.success && result.message) {
        // Add message to local state (optimistic update)
        const newMessage = {
          id: result.message.id,
          text: result.message.content,
          sent: true,
          timestamp: result.message.created_at,
        }
        setMessages(prev => [...prev, newMessage])
        setMessage("")
        console.log('[Chat] ✅ Message sent successfully')
      } else {
        console.error('[Chat] ❌ Failed to send message:', result.error)
        alert(`Failed to send message: ${result.error || 'Unknown error'}`)
      }
    } catch (error: any) {
      console.error('[Chat] Error sending message:', error)
      alert(`Failed to send message: ${error?.message || 'Unknown error'}`)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && conversation) {
      // Convert image to base64
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        
        // Create a message with the image
        const newMessage = {
          id: messages.length + 1,
          text: "",
          image: base64String,
          sent: true,
          timestamp: "Just now",
        }
        
        setMessages([...messages, newMessage])
        
        // Save the image message to localStorage
        const conversations = JSON.parse(localStorage.getItem("conversations") || "[]")
        const convIndex = conversations.findIndex((c: any) => c.userId === userId)
        if (convIndex !== -1) {
          conversations[convIndex].messages.push(newMessage)
          conversations[convIndex].lastMessage = "📷 Photo"
          conversations[convIndex].timestamp = "Just now"
          localStorage.setItem("conversations", JSON.stringify(conversations))
        }
        
        // Reload conversation to get updated data
        const updatedConv = getConversation(userId)
        if (updatedConv) {
          setConversation(updatedConv)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const searchGifs = async (query: string) => {
    setGifLoading(true)
    try {
      // Using Tenor API (Google's GIF service)
      const apiKey = "AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ" // Demo key
      const endpoint = query 
        ? `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(query)}&key=${apiKey}&limit=20&contentfilter=high`
        : `https://tenor.googleapis.com/v2/featured?key=${apiKey}&limit=20&contentfilter=high`
      
      const response = await fetch(endpoint)
      const data = await response.json()
      // Transform Tenor format to match our component
      const transformedGifs = (data.results || []).map((gif: any) => ({
        id: gif.id,
        title: gif.content_description || '',
        images: {
          fixed_height: {
            url: gif.media_formats?.tinygif?.url || gif.media_formats?.gif?.url || ''
          }
        }
      }))
      setGifs(transformedGifs)
    } catch (error) {
      console.error("Error fetching GIFs:", error)
      setGifs([])
    } finally {
      setGifLoading(false)
    }
  }

  const sendGif = (gifUrl: string) => {
    if (conversation) {
      const newMessage = {
        id: messages.length + 1,
        text: "",
        gif: gifUrl,
        sent: true,
        timestamp: "Just now",
      }
      
      setMessages([...messages, newMessage])
      setShowGifPicker(false)
      setGifSearch("")
      
      // Save GIF message to localStorage
      const conversations = JSON.parse(localStorage.getItem("conversations") || "[]")
      const convIndex = conversations.findIndex((c: any) => c.userId === userId)
      if (convIndex !== -1) {
        conversations[convIndex].messages.push(newMessage)
        conversations[convIndex].lastMessage = "GIF"
        conversations[convIndex].timestamp = "Just now"
        localStorage.setItem("conversations", JSON.stringify(conversations))
      }
      
      // Reload conversation
      const updatedConv = getConversation(userId)
      if (updatedConv) {
        setConversation(updatedConv)
      }
    }
  }

  useEffect(() => {
    if (showGifPicker && gifs.length === 0) {
      searchGifs("")
    }
  }, [showGifPicker])

  const handleEnableNotifications = () => {
    setShowMenu(false)
    alert(
      "To enable notifications, please go to your phone's Settings > Notifications > [App Name] and turn on notifications.",
    )
  }

  const handleUnmatch = () => {
    setShowMenu(false)
    setConfirmDialog("unmatch")
  }

  const handleReport = () => {
    setShowMenu(false)
    setConfirmDialog("report")
  }

  const handleBlock = () => {
    setShowMenu(false)
    setConfirmDialog("block")
  }

  const handleConfirmUnmatch = async () => {
    console.log("[Chat] Unmatch confirmed")
    setConfirmDialog(null)
    
    if (!currentUserId || !userId || !matchId) {
      alert("Error: Missing user information. Please try again.")
      return
    }
    
    try {
      const result = await unmatchUser(currentUserId, userId, matchId)
      
      if (result.success) {
        alert(`You have unmatched with ${conversation?.userName || "this user"}. This conversation has been removed.`)
        router.push("/messages")
      } else {
        alert(`Failed to unmatch: ${result.error || "Unknown error"}`)
      }
    } catch (error: any) {
      console.error("[Chat] Error unmatching:", error)
      alert(`Failed to unmatch: ${error?.message || "Unknown error"}`)
    }
  }

  const handleConfirmReport = async () => {
    console.log("[Chat] Report confirmed")
    setConfirmDialog(null)
    
    if (!currentUserId || !userId) {
      alert("Error: Missing user information. Please try again.")
      return
    }
    
    try {
      const result = await reportUser(currentUserId, userId, "Reported from chat")
      
      if (result.success) {
        alert(
          `Thank you for your report. ${conversation?.userName || "This user"}'s profile and your chat history have been sent to AstroMatch admin for review. We take all reports seriously and will investigate this matter.`,
        )
      } else {
        alert(`Failed to report: ${result.error || "Unknown error"}`)
      }
    } catch (error: any) {
      console.error("[Chat] Error reporting:", error)
      alert(`Failed to report: ${error?.message || "Unknown error"}`)
    }
  }

  const handleConfirmBlock = async () => {
    console.log("[Chat] Block confirmed")
    setConfirmDialog(null)
    
    if (!currentUserId || !userId) {
      alert("Error: Missing user information. Please try again.")
      return
    }
    
    try {
      const result = await blockUser(currentUserId, userId, matchId || undefined)
      
      if (result.success) {
        alert(
          `You have blocked ${conversation?.userName || "this user"}.\n\n` +
            `• This chat has been removed from your messages\n` +
            `• Their profile has been removed from your matches and likes\n` +
            `• They can no longer contact you or see your profile\n` +
            `• You can unblock them anytime from Settings > Safety & Privacy > Blocked Users`,
        )
        router.push("/messages")
      } else {
        alert(`Failed to block: ${result.error || "Unknown error"}`)
      }
    } catch (error: any) {
      console.error("[Chat] Error blocking:", error)
      alert(`Failed to block: ${error?.message || "Unknown error"}`)
    }
  }

  const handleCancelConfirmation = () => {
    setConfirmDialog(null)
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${theme === "light" ? "bg-white" : "bg-slate-900"}`}>
        <div className="text-center">
          <p className={`text-lg ${theme === "light" ? "text-gray-900" : "text-white"}`}>Loading conversation...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (loadError) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${theme === "light" ? "bg-white" : "bg-slate-900"}`}>
        <div className="text-center px-4">
          <p className={`text-lg mb-4 ${theme === "light" ? "text-red-600" : "text-red-400"}`}>{loadError}</p>
          <button
            onClick={() => router.push("/messages")}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Back to Messages
          </button>
        </div>
      </div>
    )
  }

  // Show error if no conversation and not loading
  if (!conversation && !isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${theme === "light" ? "bg-white" : "bg-slate-900"}`}>
        <div className="text-center px-4">
          <p className={`text-lg mb-4 ${theme === "light" ? "text-gray-900" : "text-white"}`}>Conversation not found</p>
          <button
            onClick={() => router.push("/messages")}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Back to Messages
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`${theme === "light" ? "bg-white" : "bg-slate-900"} min-h-screen w-full fixed inset-0 flex flex-col`}>
      {/* Header */}
      <div 
        className={`flex items-center justify-center px-4 pt-2 relative z-10 ${theme === "light" ? "bg-white" : "bg-slate-900"}`} 
        style={{ 
          minHeight: '60px',
          paddingTop: 'max(env(safe-area-inset-top), 44px)'
        }}
      >
        <button
          onClick={() => router.push("/messages")}
          className={`${theme === "light" ? "text-gray-700 hover:bg-gray-100" : "text-white/80 hover:bg-slate-900/50"} absolute left-4 p-2 rounded-lg transition-colors`}
        >
          <ChevronLeft className="w-7 h-7" />
        </button>

        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={otherUserProfile?.photos?.[0] || conversation?.userPhoto || "/placeholder.svg"}
              alt={otherUserProfile?.display_name || conversation?.userName || "User"}
              className={`w-12 h-12 rounded-xl object-cover border-2 ${theme === "light" ? "border-gray-200" : "border-white/20"}`}
            />
          </div>
          <div>
            <h2 className={`font-bold text-xl ${theme === "light" ? "text-gray-900" : "text-white/80"}`}>
              {otherUserProfile?.display_name || conversation?.userName || `User ${userId}`}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 absolute right-4">
          {/* Theme Toggle Button */}
          <Button
            ref={buttonRef}
            variant="ghost"
            size="icon"
            onClick={() => setShowMenu(!showMenu)}
            className={`${theme === "light" ? "text-gray-700 hover:bg-gray-100" : "text-white/80 hover:bg-slate-900/50"}`}
          >
            <MoreVertical className="w-5 h-5" />
          </Button>
          
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

      {/* Tabs */}
      <div className={`flex px-5 ${theme === "light" ? "bg-white" : "bg-slate-900"} relative z-10`}>
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 pb-1.5 pt-0.5 text-center font-semibold transition-all duration-300 relative ${
            activeTab === "chat" ? (theme === "light" ? "text-gray-900" : "text-white") : (theme === "light" ? "text-gray-600 hover:text-gray-900" : "text-white/70 hover:text-white")
          }`}
        >
          <span className={`relative z-10 text-base ${activeTab === "chat" ? (theme === "light" ? "text-gray-900" : "text-white") : (theme === "light" ? "text-gray-600" : "text-white/70")}`}>Chat</span>
          {activeTab === "chat" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex-1 pb-1.5 pt-0.5 text-center font-semibold transition-all duration-300 relative ${
            activeTab === "profile" ? (theme === "light" ? "text-gray-900" : "text-white") : (theme === "light" ? "text-gray-600 hover:text-gray-900" : "text-white/70 hover:text-white")
          }`}
        >
          <span className={`relative z-10 text-base ${activeTab === "profile" ? (theme === "light" ? "text-gray-900" : "text-white") : (theme === "light" ? "text-gray-600" : "text-white/70")}`}>
            Profile
          </span>
          {activeTab === "profile" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600" />
          )}
        </button>
      </div>

      {/* Border Line */}
      <div className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/20"} relative z-10`} />

      {/* Content - Chat or Profile */}
      {activeTab === "chat" ? (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 relative z-10">
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}>
                  <div className={`flex flex-col ${msg.sent ? "items-end" : "items-start"} max-w-[75%]`}>
                    <div
                      className={`rounded-2xl ${msg.image || msg.gif ? "p-0 overflow-hidden" : "px-4 py-2"}`}
                      style={{
                        background: msg.sent 
                          ? 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)' 
                          : theme === "light" 
                            ? '#e0e7ff'
                            : 'rgba(99, 102, 241, 0.3)'
                      }}
                    >
                      {msg.image ? (
                        <img src={msg.image} alt="Shared image" className="max-w-full h-auto rounded-2xl" />
                      ) : msg.gif ? (
                        <img src={msg.gif} alt="GIF" className="max-w-full h-auto rounded-2xl" />
                      ) : (
                        <p className={`text-base sm:text-lg ${msg.sent ? '!text-white' : theme === "light" ? '!text-gray-900' : '!text-white/90'}`}>{msg.text}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className={`py-3 pb-32 relative z-10 ${theme === "light" ? "bg-white" : "bg-slate-900"}`}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            {/* Photo and GIF buttons above */}
            <div className="px-4 pb-2 flex gap-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className={`rounded-full w-12 h-12 p-0 ${theme === "light" ? "bg-gray-200 hover:bg-gray-300 text-gray-700" : "bg-slate-900/50 border border-indigo-400/20 hover:bg-slate-800/80 text-white/80"}`}
              >
                <Image className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => setShowGifPicker(!showGifPicker)}
                className={`rounded-full w-12 h-12 p-0 ${theme === "light" ? "bg-gray-200 hover:bg-gray-300 text-gray-700" : "bg-slate-900/50 border border-indigo-400/20 hover:bg-slate-800/80 text-white/80"}`}
              >
                <Gif className="w-5 h-5" />
              </Button>
            </div>

            {/* Full width message box */}
            <div className="relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                style={{ fontSize: '20px' }}
                className={`w-full px-4 py-3 pr-14 outline-none ${theme === "light" ? "bg-gray-100 text-gray-900 placeholder:text-gray-500 border-t border-gray-200" : "bg-slate-900/50 border border-indigo-400/20 text-white/95 placeholder:text-white/50 border-t"}`}
              />
              <Button
                onClick={handleSend}
                disabled={!message.trim()}
                className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full w-10 h-10 p-0 ${
                  message.trim()
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                <Send className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        /* Profile View - Same design as discover section */
        <div className="flex-1 overflow-y-auto relative z-10 pb-32">
          {conversation && (
            <MatchProfileCard
              profile={{
                id: parseInt(userId) || 0,
                name: otherUserProfile?.display_name || conversation?.userName || `User ${userId}`,
                age: otherUserProfile?.age || (conversation as any).age || 28,
                photos: Array.isArray(otherUserProfile?.photos) 
                  ? otherUserProfile.photos 
                  : (otherUserProfile?.photos?.[0] 
                      ? [otherUserProfile.photos[0]] 
                      : (conversation?.userPhoto ? [conversation.userPhoto] : ["/placeholder.svg"])),
                aboutMe: otherUserProfile?.bio || (conversation as any).aboutMe,
                occupation: otherUserProfile?.occupation || (conversation as any).occupation,
                city: otherUserProfile?.city || (conversation as any).city,
                height: otherUserProfile?.height || (conversation as any).height,
                children: otherUserProfile?.children_preference || (conversation as any).children,
                religion: otherUserProfile?.religion || (conversation as any).religion,
                prompts: (conversation as any).prompts,
                westernSign: otherUserProfile?.western_sign || (conversation as any)?.westernSign || 'Gemini',
                easternSign: otherUserProfile?.chinese_sign || (conversation as any)?.easternSign || 'Dragon',
                relationshipGoals: otherUserProfile?.relationship_goals || (conversation as any).relationshipGoals || (conversation as any).selectedRelationshipGoals || [],
                selectedRelationshipGoals: otherUserProfile?.relationship_goals || (conversation as any).relationshipGoals || (conversation as any).selectedRelationshipGoals || [],
                interests: otherUserProfile?.interests || (conversation as any).interests || (conversation as any).selectedOrganizedInterests || {},
                selectedOrganizedInterests: otherUserProfile?.interests || (conversation as any).interests || (conversation as any).selectedOrganizedInterests || {},
              }}
              connectionBoxData={connectionBoxData || undefined}
              theme={theme}
              onPhotoChange={(index) => setCurrentPhotoIndex(index)}
              onMessageClick={() => {
                console.log('[Chat] Chat button clicked - switching to chat tab');
                setActiveTab("chat");
                // Scroll to top of chat messages
                setTimeout(() => {
                  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              onPass={() => {}}
              onLike={() => {}}
              showProfileToggle={showProfile}
              onShowProfileToggle={() => {
                console.log('[Chat] Profile toggle clicked, current state:', showProfile)
                setShowProfile(prev => {
                  const newState = !prev
                  console.log('[Chat] Setting showProfile to:', newState)
                  if (newState) {
                    setShowElements(false)
                  }
                  return newState
                })
              }}
              showElementsToggle={showElements}
              onShowElementsToggle={() => {
                console.log('[Chat] Elements toggle clicked, current state:', showElements)
                setShowElements(prev => {
                  const newState = !prev
                  console.log('[Chat] Setting showElements to:', newState)
                  if (newState) {
                    setShowProfile(false)
                  }
                  return newState
                })
              }}
              isNewMatch={false}
              matchedAt={undefined}
            />
          )}
        </div>
      )}

      {/* Menu */}
      {showMenu && (
        <div
          ref={menuRef}
          className={`fixed right-4 top-16 w-56 rounded-lg shadow-xl overflow-hidden ${
            theme === "light" 
              ? "bg-white border border-gray-200" 
              : "bg-slate-800 border border-slate-700"
          }`}
          style={{ zIndex: 99999 }}
        >
          <button
            onClick={handleEnableNotifications}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
              theme === "light"
                ? "text-gray-900 hover:bg-gray-100"
                : "text-white/90 hover:bg-slate-700"
            }`}
          >
            <Bell className="w-5 h-5" />
            <span className="text-sm font-medium">Enable notifications</span>
          </button>

          <button
            onClick={handleUnmatch}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
              theme === "light"
                ? "text-gray-900 hover:bg-gray-100"
                : "text-white/90 hover:bg-slate-700"
            }`}
          >
            <UserX className="w-5 h-5" />
            <span className="text-sm font-medium">Unmatch</span>
          </button>

          <button
            onClick={handleReport}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
              theme === "light"
                ? "text-red-600 hover:bg-red-50"
                : "text-red-400 hover:bg-red-900/20"
            }`}
          >
            <Flag className="w-5 h-5" />
            <span className="text-sm font-medium">Report</span>
          </button>

          <button
            onClick={handleBlock}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
              theme === "light"
                ? "text-red-600 hover:bg-red-50"
                : "text-red-400 hover:bg-red-900/20"
            }`}
          >
            <ShieldOff className="w-5 h-5" />
            <span className="text-sm font-medium">Block</span>
          </button>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmDialog && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4"
          style={{ zIndex: 100000 }}
          onClick={handleCancelConfirmation}
        >
          <div
            className={`w-full max-w-sm rounded-2xl p-6 shadow-2xl ${
              theme === "light"
                ? "bg-white border border-gray-200"
                : "bg-slate-800 border border-slate-700"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={`text-xl font-bold mb-3 ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`}>
              {confirmDialog === "unmatch"
                ? "Unmatch with " + (conversation?.userName || "this user") + "?"
                : confirmDialog === "report"
                  ? "Report " + (conversation?.userName || "this user") + "?"
                  : "Block " + (conversation?.userName || "this user") + "?"}
            </h3>
            <p className={`text-sm mb-6 ${
              theme === "light" ? "text-gray-600" : "text-white/70"
            }`}>
              {confirmDialog === "unmatch"
                ? "You won't be able to message each other anymore and this conversation will be deleted."
                : confirmDialog === "report"
                  ? "We'll review this profile and take appropriate action if it violates our community guidelines."
                  : "They won't be able to contact you, see your profile, or find you in search results."}
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleCancelConfirmation}
                className={`flex-1 py-3 rounded-full font-semibold ${
                  theme === "light"
                    ? "bg-gray-200 hover:bg-gray-300 text-gray-900"
                    : "bg-slate-700 hover:bg-slate-600 text-white"
                }`}
              >
                Cancel
              </Button>
              <Button
                onClick={
                  confirmDialog === "unmatch"
                    ? handleConfirmUnmatch
                    : confirmDialog === "report"
                      ? handleConfirmReport
                      : handleConfirmBlock
                }
                className={`flex-1 py-3 rounded-full font-semibold text-white ${
                  confirmDialog === "unmatch"
                    ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                }`}
              >
                {confirmDialog === "unmatch" ? "Unmatch" : confirmDialog === "report" ? "Report" : "Block"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* GIF Picker */}
      {showGifPicker && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end justify-center z-[100000]"
          onClick={() => setShowGifPicker(false)}
        >
          <div
            className="w-full max-w-2xl bg-slate-900 rounded-t-3xl p-6 pb-8 max-h-[70vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold !text-white/95">Send a GIF</h3>
              <button
                onClick={() => setShowGifPicker(false)}
                className="p-2 hover:bg-slate-900/50 rounded-full transition-colors"
              >
                <X className="w-5 h-5 !text-white/80" />
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 !text-white/50" />
              <input
                type="text"
                value={gifSearch}
                onChange={(e) => {
                  setGifSearch(e.target.value)
                  searchGifs(e.target.value)
                }}
                placeholder="Search GIFs..."
                className="w-full pl-10 pr-4 py-3 rounded-xl outline-none bg-slate-900/50 border border-indigo-400/20 !text-white/95 placeholder:!text-white/50"
              />
            </div>

            {/* GIFs Grid */}
            <div className="flex-1 overflow-y-auto">
              {gifLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : gifs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="!text-white/60 mb-2">No GIFs found</p>
                  <p className="text-sm !text-white/40">Try a different search term</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {gifs.map((gif: any) => (
                    <button
                      key={gif.id}
                      onClick={() => sendGif(gif.images.fixed_height.url)}
                      className="relative aspect-square rounded-xl overflow-hidden hover:opacity-80 transition-opacity bg-slate-900/50"
                    >
                      <img
                        src={gif.images.fixed_height.url}
                        alt={gif.title}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
