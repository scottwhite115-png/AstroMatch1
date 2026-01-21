"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useTheme } from "@/contexts/ThemeContext"
import { getConversations, clearUnreadCount, deleteConversation, type Conversation } from "@/lib/utils/conversations"

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
  const [swipedChatId, setSwipedChatId] = useState<string | null>(null)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false)
  const [instantMessageEnabled, setInstantMessageEnabled] = useState(true)

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

  useEffect(() => {
    console.log("[v0] Messages auth temporarily disabled for design work")
    setCurrentUser({ id: "mock-user-id" })

    let conversations = getConversations()
    
    // If no conversations exist, load demo data for testing
    if (conversations.length === 0) {
      const demoConversations: Conversation[] = [
        {
          id: "demo-user-1",
          userId: "demo-user-1",
          userName: "Emma",
          userPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
          lastMessage: "Hey! How's your week going? 😊",
          timestamp: "2m ago",
          unread: 2,
          online: true,
          messages: [
            { id: 1, text: "Hi there! 👋", sent: false, timestamp: "10:30 AM" },
            { id: 2, text: "Hey! How are you?", sent: true, timestamp: "10:32 AM" },
            { id: 3, text: "I'm great! Just got back from yoga", sent: false, timestamp: "10:35 AM" },
            { id: 4, text: "Hey! How's your week going? 😊", sent: false, timestamp: "Just now" }
          ]
        },
        {
          id: "demo-user-2",
          userId: "demo-user-2",
          userName: "Olivia",
          userPhoto: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80",
          lastMessage: "That sounds amazing! I'd love to",
          timestamp: "1h ago",
          unread: 0,
          online: false,
          messages: [
            { id: 1, text: "Would you want to grab coffee sometime?", sent: true, timestamp: "Yesterday" },
            { id: 2, text: "That sounds amazing! I'd love to", sent: false, timestamp: "1h ago" }
          ]
        },
        {
          id: "demo-user-3",
          userId: "demo-user-3",
          userName: "Sophia",
          userPhoto: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
          lastMessage: "See you then! 🎉",
          timestamp: "Yesterday",
          unread: 0,
          online: true,
          messages: [
            { id: 1, text: "Hey! Your profile is really interesting", sent: false, timestamp: "2 days ago" },
            { id: 2, text: "Thanks! I loved your photos too", sent: true, timestamp: "2 days ago" },
            { id: 3, text: "Want to meet up this weekend?", sent: true, timestamp: "Yesterday" },
            { id: 4, text: "See you then! 🎉", sent: false, timestamp: "Yesterday" }
          ]
        }
      ]
      
      // Save demo conversations to localStorage
      localStorage.setItem("conversations", JSON.stringify(demoConversations))
      conversations = demoConversations
    }
    
    setChats(conversations)
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
    if (diff > 0 && diff < 150) {
      setSwipeOffset(diff)
    }
  }

  const handleMouseMove = (e: React.MouseEvent, chatId: string) => {
    if (!isDragging || swipedChatId !== chatId) return
    const diff = touchStart - e.clientX
    if (diff > 0 && diff < 150) {
      setSwipeOffset(diff)
    }
  }

  const handleTouchEnd = () => {
    if (swipeOffset > 75) {
      setSwipeOffset(100)
    } else {
      setSwipeOffset(0)
      setSwipedChatId(null)
    }
    setIsDragging(false)
  }

  const handleMouseUp = () => {
    if (swipeOffset > 75) {
      setSwipeOffset(100)
    } else {
      setSwipeOffset(0)
      setSwipedChatId(null)
    }
    setIsDragging(false)
  }

  const handleRemoveChat = (userId: string) => {
    deleteConversation(userId)
    setChats(chats.filter((chat) => chat.userId !== userId))
    setSwipeOffset(0)
    setSwipedChatId(null)
  }

  const handleOpenChat = (userId: string) => {
    clearUnreadCount(userId)
    setChats(chats.map((chat) => (chat.userId === userId ? { ...chat, unread: 0 } : chat)))
    router.push(`/messages/${userId}`)
  }

  const handleInstantMessageToggle = (enabled: boolean) => {
    setInstantMessageEnabled(enabled)
    localStorage.setItem("instantMessageEnabled", JSON.stringify(enabled))
  }

  return (
    <div className={`${theme === "light" ? "bg-white" : "bg-[#0a0a0a]"} min-h-screen w-full fixed inset-0`}>
      <div className="flex flex-col min-h-screen relative z-10">
        <div className="px-3 pt-2 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              <FourPointedStar className="w-4 h-4 text-orange-500" />
              <span className="font-bold text-base bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Messages
              </span>
            </div>
            
            {/* Right side: Settings and Theme toggle */}
            <div className="flex items-center gap-2">
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
                  <div className={`absolute right-0 top-10 w-80 backdrop-blur-sm rounded-lg shadow-xl p-4 z-50 ${theme === "light" ? "bg-white border border-gray-200" : "bg-zinc-800/95 border border-white/20"}`}>
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

        <div className="flex-1 overflow-y-auto px-2 sm:px-4 pb-16">
          {chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20">
              <MessageCircle className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-lg text-gray-500">No conversations yet</p>
              <p className="text-sm text-gray-400">Start chatting with your matches!</p>
            </div>
          ) : (
            chats.map((chat, index) => (
              <div key={chat.userId} className="relative mb-2 overflow-hidden rounded-xl">
                {swipedChatId === chat.userId && swipeOffset > 0 && (
                  <div className="absolute inset-0 bg-red-500/80 flex items-center justify-end px-6 rounded-xl">
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
                  className={`message-profile-card flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-4 w-full rounded-xl relative z-10 ${theme === "light" ? "bg-white border border-black/20 hover:bg-gray-50 shadow-lg" : "bg-zinc-800 hover:bg-zinc-800/90"} hover:shadow-md`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={chat.userPhoto || "/placeholder.svg"}
                      alt={chat.userName}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border-2 border-white/20"
                    />
                    {chat.unread > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white/95 text-xs font-bold">{chat.unread}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-base sm:text-lg font-bold truncate ${theme === "light" ? "text-gray-900" : "text-white/80"}`}>{chat.userName}</h3>
                    </div>
                    <p
                      className={`text-sm sm:text-base truncate ${chat.unread > 0 ? (theme === "light" ? "font-semibold text-gray-800" : "font-semibold text-white/70") : (theme === "light" ? "text-gray-600" : "text-white/50")}`}
                    >
                      {chat.lastMessage || "Start a conversation"}
                    </p>
                  </div>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
