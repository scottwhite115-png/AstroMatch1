"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useTheme } from "@/contexts/ThemeContext"
import { getConversations, clearUnreadCount, deleteConversation, type Conversation } from "@/lib/utils/conversations"
import { getWesternSignGlyph, getChineseSignGlyph, capitalizeSign } from "@/lib/zodiacHelpers"
import { fetchUserMatches, fetchUserProfile } from "@/lib/supabase/profileQueries"
import { getMessages, subscribeToMessages } from "@/lib/supabase/messageActions"

const MessageCircle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
)

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

export default function MessagesPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()
  const { theme, setTheme } = useTheme()

  const [chats, setChats] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [swipedChatId, setSwipedChatId] = useState<string | null>(null)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false)
  const [instantMessageEnabled, setInstantMessageEnabled] = useState(true)
  const [activeTab, setActiveTab] = useState<'connections'>('connections')

  // Load instant message setting from localStorage
  useEffect(() => {
    const savedInstantMessage = localStorage.getItem("instantMessageEnabled")
    if (savedInstantMessage !== null) {
      setInstantMessageEnabled(JSON.parse(savedInstantMessage))
    }
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

  // REMOVED: Demo data loader - only use real matches from Supabase

  // REAL DATABASE: Load user and their matches
  useEffect(() => {
    const loadMatchesFromDatabase = async () => {
      setLoading(true)
      console.log('[Messages] 🔄 Loading real matches from database...')

      // Clear any old demo conversations from localStorage
      const oldConversations = localStorage.getItem("conversations")
      if (oldConversations) {
        try {
          const parsed = JSON.parse(oldConversations)
          // Check if these are demo conversations (have demo-user IDs)
          const hasDemoData = parsed.some((conv: any) => 
            conv.userId?.includes("demo-user") || conv.id?.includes("demo-user")
          )
          if (hasDemoData) {
            console.log('[Messages] 🗑️  Clearing old demo conversations from localStorage')
            localStorage.removeItem("conversations")
          }
        } catch (e) {
          // Invalid JSON, clear it
          localStorage.removeItem("conversations")
        }
      }

      try {
        // 1. Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          console.log('[Messages] ⚠️  No authenticated user')
          setChats([])
          setLoading(false)
          return
        }

        setCurrentUser(user)
        console.log('[Messages] ✅ User authenticated:', user.id)

        // 2. Fetch user's profile to get their zodiac signs
        const userProfile = await fetchUserProfile(user.id)
        if (!userProfile) {
          console.error('[Messages] ❌ User profile not found')
          setLoading(false)
          return
        }

        // 3. Fetch all active matches
        const matches = await fetchUserMatches(user.id)
        console.log(`[Messages] 📋 Found ${matches.length} matches`)

        if (matches.length === 0) {
          console.log('[Messages] ℹ️  No matches yet')
          setChats([])
          setLoading(false)
          return
        }

        // 4. First, show matches immediately with basic info (no messages yet)
        // Check which matches have been viewed (stored in localStorage)
        const viewedMatches = JSON.parse(localStorage.getItem('viewedMatches') || '[]')
        
        const chatList: Conversation[] = matches.map((match: any) => {
          const otherProfile = match.profile
          // Handle photos - could be array or string
          const photos = otherProfile.photos || []
          const photoUrl = Array.isArray(photos) && photos.length > 0 
            ? photos[0] 
            : (typeof photos === 'string' ? photos : null)
          
          console.log('[Messages] Profile photo data:', {
            userId: otherProfile.id,
            displayName: otherProfile.display_name,
            photosRaw: otherProfile.photos,
            photosType: typeof otherProfile.photos,
            photosIsArray: Array.isArray(otherProfile.photos),
            photoUrl
          })
          
          // Calculate if this is a new match (within 24 hours and not viewed)
          const matchedAt = match.matched_at
          const isNewMatch = matchedAt && !viewedMatches.includes(match.id) && (() => {
            const matchDate = new Date(matchedAt)
            const now = new Date()
            const hoursSinceMatch = (now.getTime() - matchDate.getTime()) / (1000 * 60 * 60)
            return hoursSinceMatch < 24 // Show "New Match" if match was created within last 24 hours
          })()
          
          return {
            id: match.id,
            userId: otherProfile.id,
            userName: otherProfile.display_name || 'Unknown',
            userPhoto: photoUrl || '/placeholder.svg',
            lastMessage: 'Loading...', // Placeholder, will update
            timestamp: matchedAt || new Date().toISOString(),
            unread: 0,
            online: false,
            messages: [],
            westernSign: otherProfile.western_sign || 'Leo',
            easternSign: otherProfile.chinese_sign || 'Rabbit',
            matchedAt: matchedAt,
            isNewMatch: isNewMatch || false,
          }
        })

        // Set chats immediately so they appear right away
        setChats(chatList)
        setLoading(false) // Stop loading state so list appears

        // 5. Then load last messages in parallel and update the list
        const updatedChatList = await Promise.all(
          matches.map(async (match: any) => {
            const otherProfile = match.profile
            
            // Get last message for this match
            const messages = await getMessages(match.id, 1)
            const lastMessage = messages[0]
            
            // Handle photos - could be array or string
            const photos = otherProfile.photos || []
            const photoUrl = Array.isArray(photos) && photos.length > 0 
              ? photos[0] 
              : (typeof photos === 'string' ? photos : null)

            // Calculate if this is a new match (within 24 hours and not viewed)
            const matchedAt = match.matched_at
            const isNewMatch = matchedAt && !viewedMatches.includes(match.id) && (() => {
              const matchDate = new Date(matchedAt)
              const now = new Date()
              const hoursSinceMatch = (now.getTime() - matchDate.getTime()) / (1000 * 60 * 60)
              return hoursSinceMatch < 24 // Show "New Match" if match was created within last 24 hours
            })()
            
            return {
              id: match.id,
              userId: otherProfile.id,
              userName: otherProfile.display_name || 'Unknown',
              userPhoto: photoUrl || '/placeholder.svg',
              lastMessage: lastMessage?.content || 'Start a conversation',
              timestamp: lastMessage?.created_at || matchedAt || new Date().toISOString(),
              unread: 0,
              online: false,
              messages: [],
              westernSign: otherProfile.western_sign || 'Leo',
              easternSign: otherProfile.chinese_sign || 'Rabbit',
              matchedAt: matchedAt,
              isNewMatch: isNewMatch || false,
            }
          })
        )

        // Sort by most recent message
        updatedChatList.sort((a, b) => {
          const dateA = new Date(a.timestamp).getTime()
          const dateB = new Date(b.timestamp).getTime()
          return dateB - dateA
        })

        // Update with messages loaded
        setChats(updatedChatList)
        console.log('[Messages] ✅ Chats loaded successfully!')

        // Set up real-time subscriptions for all matches
        const subscriptions: any[] = []
        matches.forEach((match: any) => {
          const subscription = subscribeToMessages(match.id, (newMessage) => {
            console.log('[Messages] 📨 New message received:', newMessage)
            // Update the chat list with the new message
            setChats(prevChats => {
              const updatedChats = prevChats.map(chat => {
                if (chat.id === match.id) {
                  return {
                    ...chat,
                    lastMessage: newMessage.content,
                    timestamp: newMessage.created_at
                  }
                }
                return chat
              })
              // Sort by most recent message
              return updatedChats.sort((a, b) => {
                const dateA = new Date(a.timestamp).getTime()
                const dateB = new Date(b.timestamp).getTime()
                return dateB - dateA
              })
            })
          })
          subscriptions.push(subscription)
        })

        // Cleanup subscriptions on unmount
        return () => {
          subscriptions.forEach(sub => {
            if (sub && sub.unsubscribe) {
              sub.unsubscribe()
            }
          })
        }

      } catch (error) {
        console.error('[Messages] ❌ Error loading matches:', error)
        setChats([])
      } finally {
        setLoading(false)
      }
    }

    loadMatchesFromDatabase()
  }, [])

  const handleTouchStart = (e: React.TouchEvent, chatId: string) => {
    setTouchStart(e.touches[0].clientX)
    setSwipedChatId(chatId)
    setIsDragging(true)
  }

  const handleMouseDown = (e: React.MouseEvent, chatId: string) => {
    setTouchStart(e.clientX)
    setSwipedChatId(chatId)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent, chatId: string) => {
    if (!isDragging || swipedChatId !== chatId) return
    const currentTouch = e.touches[0].clientX
    const diff = touchStart - currentTouch
    // Allow both swipe left (positive) and swipe right (negative) to close
    if (diff > 0 && diff < 150) {
      setSwipeOffset(diff)
    } else if (diff < 0 && swipeOffset > 0) {
      // Swiping right to close
      const newOffset = Math.max(0, swipeOffset + diff)
      setSwipeOffset(newOffset)
    }
  }

  const handleMouseMove = (e: React.MouseEvent, chatId: string) => {
    if (!isDragging || swipedChatId !== chatId) return
    const diff = touchStart - e.clientX
    // Allow both swipe left (positive) and swipe right (negative) to close
    if (diff > 0 && diff < 150) {
      setSwipeOffset(diff)
    } else if (diff < 0 && swipeOffset > 0) {
      // Swiping right to close
      const newOffset = Math.max(0, swipeOffset + diff)
      setSwipeOffset(newOffset)
    }
  }

  const handleTouchEnd = () => {
    if (swipeOffset > 60) {
      setSwipeOffset(100)
    } else {
      setSwipeOffset(0)
      setSwipedChatId(null)
    }
    setIsDragging(false)
  }

  const handleMouseUp = () => {
    if (swipeOffset > 60) {
      setSwipeOffset(100)
    } else {
      setSwipeOffset(0)
      setSwipedChatId(null)
    }
    setIsDragging(false)
  }

  const handleRemoveChat = (userId: string) => {
    deleteConversation(userId)
    const updatedChats = chats.filter((chat) => chat.userId !== userId)
    setChats(updatedChats)
    
    // Save updated chats to localStorage
    localStorage.setItem("conversations", JSON.stringify(updatedChats))
    
    setSwipeOffset(0)
    setSwipedChatId(null)
  }

  const handleOpenChat = async (userId: string) => {
    clearUnreadCount(userId)
    
    // Mark match as seen if it's a new match
    const chat = chats.find(c => c.userId === userId)
    if (chat?.isNewMatch && chat.id) {
      // Mark this match as viewed in localStorage
      const viewedMatches = JSON.parse(localStorage.getItem('viewedMatches') || '[]')
      if (!viewedMatches.includes(chat.id)) {
        viewedMatches.push(chat.id)
        localStorage.setItem('viewedMatches', JSON.stringify(viewedMatches))
      }
      
      // Update local state immediately to hide the badge
      const updatedChats = chats.map((c) => 
        c.userId === userId 
          ? { ...c, unread: 0, isNewMatch: false } 
          : c
      )
      setChats(updatedChats)
      
      // Save updated chats to localStorage
      localStorage.setItem("conversations", JSON.stringify(updatedChats))
    } else {
      const updatedChats = chats.map((c) => (c.userId === userId ? { ...c, unread: 0 } : c))
      setChats(updatedChats)
      localStorage.setItem("conversations", JSON.stringify(updatedChats))
    }
    
    router.push(`/messages/${userId}`)
  }

  const handleInstantMessageToggle = (enabled: boolean) => {
    setInstantMessageEnabled(enabled)
    localStorage.setItem("instantMessageEnabled", JSON.stringify(enabled))
  }

  return (
    <div className={`${theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"} min-h-screen w-full fixed inset-0`}>
      <div className="flex flex-col min-h-screen relative z-10">
        <header className={`sticky top-0 z-50 ${
          theme === "light"
            ? "bg-white/80 backdrop-blur-sm"
            : "bg-slate-900/80 backdrop-blur-sm"
        }`} style={{ paddingTop: 'max(env(safe-area-inset-top), 44px)' }}>
        <div className="px-4 pt-0.5 pb-1.5">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex-1 -ml-8">
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-transparent">
                <div className="flex gap-0.5 min-w-max">
              <button
                onClick={() => setActiveTab('connections')}
                className={`relative px-5 py-2.5 font-bold whitespace-nowrap transition-all duration-300 ease-in-out flex items-center gap-0.5 ${
                  activeTab === 'connections'
                    ? ""
                    : theme === "light"
                      ? "text-gray-600 hover:text-gray-900"
                      : "text-gray-400 hover:text-gray-200"
                }`}
              >
              <FourPointedStar className="w-4 h-4 text-orange-500" />
                <span className={activeTab === 'connections' 
                  ? "bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent"
                  : ""
                }>
                Messages
              </span>
              </button>
                </div>
              </div>
            </div>
            
            {/* Right side: Settings and Theme toggle */}
            <div className="flex items-center gap-2 ml-2">
              {/* Settings Dropdown */}
              <div className="relative settings-dropdown-container">
                <button
                  onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Message settings"
                >
                  <Settings className={`w-5 h-5 ${theme === "light" ? "text-gray-600" : "text-white/70"}`} />
                </button>
                
                {showSettingsDropdown && (
                  <div className={`absolute right-0 top-10 w-80 backdrop-blur-sm rounded-lg shadow-xl p-4 z-50 ${theme === "light" ? "bg-white border border-gray-200" : "bg-slate-800/40 border border-indigo-500/20 shadow-lg shadow-indigo-950/30"}`}>
                    <h3 className={`text-lg font-bold mb-4 ${theme === "light" ? "text-black" : "text-white"}`}>Message Settings</h3>
                    
                    {/* Instant Messages Toggle */}
                    <div className="mb-4">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex-1">
                          <span className={`text-sm font-medium block mb-1 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                            Allow Instant Messages
                          </span>
                          <p className={`text-xs ${theme === "light" ? "text-gray-500" : "text-white/60"}`}>
                            Others can message you directly without matching first
                          </p>
                        </div>
                        <div className="ml-3">
                          <button
                            onClick={() => handleInstantMessageToggle(!instantMessageEnabled)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              instantMessageEnabled
                                ? "bg-gradient-to-r from-orange-600 via-orange-500 to-red-500"
                                : theme === "light"
                                ? "bg-gray-300"
                                : "bg-zinc-600"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                instantMessageEnabled ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </label>
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
        </header>

        <div 
          className="flex-1 overflow-y-auto px-2 sm:px-4 pb-16"
          style={{ paddingTop: '1rem' }}
        >
          {chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20">
              <MessageCircle className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-lg text-gray-500">No conversations yet</p>
              <p className="text-sm text-gray-400">Start chatting with your matches!</p>
            </div>
          ) : (
            chats.map((chat, index) => (
              <div key={chat.userId} className="relative mb-2 rounded-xl">
                {swipedChatId === chat.userId && swipeOffset > 0 && (
                  <div className="absolute inset-0 bg-red-500/80 flex items-center justify-end px-6 rounded-xl z-10">
                    <button
                      onClick={() => handleRemoveChat(chat.userId)}
                      className="!text-white/95 font-bold text-sm sm:text-base"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <button
                  onClick={() => {
                    if (swipeOffset === 0) {
                      handleOpenChat(chat.userId)
                    }
                  }}
                  onTouchStart={(e) => handleTouchStart(e, chat.userId)}
                  onTouchMove={(e) => handleTouchMove(e, chat.userId)}
                  onTouchEnd={handleTouchEnd}
                  onMouseDown={(e) => handleMouseDown(e, chat.userId)}
                  onMouseMove={(e) => handleMouseMove(e, chat.userId)}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  style={{
                    transform: swipedChatId === chat.userId ? `translateX(-${swipeOffset}px)` : "translateX(0)",
                    transition: isDragging && swipedChatId === chat.userId ? "none" : "transform 0.3s ease",
                  }}
                  className={`message-profile-card astro-highlight-card flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-4 w-full rounded-xl relative z-20 ${theme === "light" ? "bg-white border border-black/20 shadow-lg" : "bg-slate-800/40 border border-indigo-500/20"} cursor-pointer transition-all`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={chat.userPhoto || "/placeholder.svg"}
                      alt={chat.userName}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border-2 border-white/20"
                    />
                    {chat.unread > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white/95 text-xs font-bold">{chat.unread}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-lg sm:text-xl font-bold flex items-center gap-1.5 min-w-0 ${theme === "light" ? "text-gray-900" : "text-white/80"}`}>
                        <span className="truncate">{chat.userName}</span>
                      </h3>
                    </div>
                    <p
                      className={`text-sm sm:text-base truncate ${chat.unread > 0 ? (theme === "light" ? "font-semibold text-gray-800" : "font-semibold text-white/70") : (theme === "light" ? "text-gray-600" : "text-white/50")}`}
                    >
                      {chat.lastMessage || "Start a conversation"}
                    </p>
                  </div>
                  
                  {/* New Match Badge - Right side, moves with swipe */}
                  {chat.isNewMatch && (
                    <div className="absolute z-30 flex items-center" style={{ top: '50%', right: '0.75rem', transform: 'translateY(-50%)' }}>
                      <span className="inline-block px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white rounded-full shadow-lg whitespace-nowrap">
                        New Match
                      </span>
                    </div>
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
