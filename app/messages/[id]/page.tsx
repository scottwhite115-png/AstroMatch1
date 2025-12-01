"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/ThemeContext"
import { getConversation, createConversation, updateConversation, type Conversation } from "@/lib/utils/conversations"
import { buildConnectionBoxFromAstro, deriveElement, deriveTrine } from "@/lib/compat/engine"
import type { UserAstro, ConnectionBox } from "@/lib/compat/types"
import { getWesternSignEmoji, getChineseSignEmoji } from '@/lib/utils/emojis'
import { LabelPill } from "@/ui/LabelPill"

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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [compatBox, setCompatBox] = useState<ConnectionBox | null>(null)
  const [userAstro, setUserAstro] = useState<UserAstro | null>(null)
  
  // User's zodiac signs for matching
  const [userZodiacSigns, setUserZodiacSigns] = useState<{western: string, chinese: string}>({
    western: 'leo',
    chinese: 'rabbit'
  })

  const userId = params.id as string

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
        
        console.log("[Messages] User zodiac signs loaded:", { western: userWesternSign, chinese: userChineseSign })
        console.log("[Messages] User astro:", astro)
      } catch (error) {
        console.error("[Messages] Error creating UserAstro:", error)
      }
    } else {
      // Default fallback if no signs in localStorage
      console.warn("[Messages] No user signs in localStorage, using default Leo-Rabbit")
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
  
  // Build compatibility box when user signs are available
  useEffect(() => {
    if (userAstro) {
      // Using hardcoded Gemini-Dragon for demo conversation
      // In production, get these from the conversation object
      const profileAstro: UserAstro = {
        west_sign: 'gemini',
        east_sign: 'dragon',
        element: deriveElement('gemini'),
        trine: deriveTrine('dragon')
      }
      
      const box = buildConnectionBoxFromAstro(userAstro, profileAstro)
      setCompatBox(box)
      console.log('[Messages] Compat box:', box)
    }
  }, [userAstro])

  useEffect(() => {
    let conv = getConversation(userId)

    // If conversation doesn't exist, create it with placeholder data
    if (!conv) {
      // Try to get user info from matches or create placeholder
      conv = createConversation(userId, `User ${userId}`, "/placeholder.svg?height=400&width=400")
    }

    setConversation(conv)
    setMessages(conv.messages)
  }, [userId])

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

  const handleSend = () => {
    if (message.trim() && conversation) {
      updateConversation(userId, message.trim(), true)

      const newMessage = {
        id: messages.length + 1,
        text: message,
        sent: true,
        timestamp: "Just now",
      }
      setMessages([...messages, newMessage])
      setMessage("")

      // Reload conversation to get updated data
      const updatedConv = getConversation(userId)
      if (updatedConv) {
        setConversation(updatedConv)
      }
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

  const handleConfirmUnmatch = () => {
    console.log("[v0] Unmatch confirmed")
    setConfirmDialog(null)
    alert(`You have unmatched with User ${userId}. This conversation has been removed.`)
    router.push("/messages")
  }

  const handleConfirmReport = () => {
    console.log("[v0] Report confirmed")
    setConfirmDialog(null)
    alert(
      `Thank you for your report. User ${userId}'s profile and your chat history have been sent to Astromatch admin for review. We take all reports seriously and will investigate this matter.`,
    )
  }

  const handleConfirmBlock = () => {
    console.log("[v0] Block confirmed")
    setConfirmDialog(null)
    alert(
      `You have blocked User ${userId}.\n\n` +
        `• This chat has been removed from your messages\n` +
        `• Their profile has been removed from your matches and likes\n` +
        `• They can no longer contact you or see your profile\n` +
        `• You can unblock them anytime from Settings > Safety & Privacy > Blocked Users`,
    )
    router.push("/messages")
  }

  const handleCancelConfirmation = () => {
    setConfirmDialog(null)
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white">Loading conversation...</p>
      </div>
    )
  }

  return (
    <div className={`${theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"} min-h-screen w-full fixed inset-0 flex flex-col`}>
      {/* Header */}
      <div className={`flex items-center justify-center px-4 pt-2 relative z-10 ${theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"}`} style={{ minHeight: '60px' }}>
        <button
          onClick={() => router.push("/messages")}
          className={`${theme === "light" ? "text-gray-700 hover:bg-gray-100" : "text-white/80 hover:bg-slate-800/50"} absolute left-4 p-2 rounded-lg transition-colors`}
        >
          <ChevronLeft className="w-7 h-7" />
        </button>

        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={conversation.userPhoto || "/placeholder.svg"}
              alt={conversation.userName}
              className={`w-12 h-12 rounded-xl object-cover border-2 ${theme === "light" ? "border-gray-200" : "border-white/20"}`}
            />
          </div>
          <div>
            <h2 className={`font-bold text-xl ${theme === "light" ? "text-gray-900" : "text-white/80"}`}>{conversation.userName}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 absolute right-4">
          {/* Theme Toggle Button */}
          <Button
            ref={buttonRef}
            variant="ghost"
            size="icon"
            onClick={() => setShowMenu(!showMenu)}
            className={`${theme === "light" ? "text-gray-700 hover:bg-gray-100" : "text-white/80 hover:bg-slate-800/50"}`}
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
      <div className={`flex px-5 ${theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"} relative z-10`}>
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 pb-1.5 pt-0.5 text-center font-semibold transition-all duration-300 relative ${
            activeTab === "chat" ? (theme === "light" ? "text-gray-900" : "text-white") : (theme === "light" ? "text-gray-600 hover:text-gray-900" : "text-white/70 hover:text-white")
          }`}
        >
          <span className={`relative z-10 text-base ${activeTab === "chat" ? (theme === "light" ? "text-gray-900" : "text-white") : (theme === "light" ? "text-gray-600" : "text-white/70")}`}>Chat</span>
          {activeTab === "chat" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
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
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
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
                          ? '#a855f7' 
                          : theme === "light" 
                            ? 'rgba(233, 213, 255, 0.8)'
                            : 'rgba(63, 63, 70, 0.6)'
                      }}
                    >
                      {msg.image ? (
                        <img src={msg.image} alt="Shared image" className="max-w-full h-auto rounded-2xl" />
                      ) : msg.gif ? (
                        <img src={msg.gif} alt="GIF" className="max-w-full h-auto rounded-2xl" />
                      ) : (
                        <p className={`text-sm sm:text-base ${msg.sent ? '!text-white' : theme === "light" ? '!text-purple-900' : '!text-white/90'}`}>{msg.text}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className={`py-3 pb-32 relative z-10 ${theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"}`}>
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
        /* Profile View */
        <div className="flex-1 overflow-y-auto relative z-10 pb-24">
          {/* Profile Photo - Full Width */}
          <div className="relative w-full aspect-[3/4]">
            <img
              src={conversation.userPhoto || "/placeholder.svg"}
              alt={conversation.userName}
              className="w-full h-full object-cover"
            />
            
            {/* Profile Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 px-5 py-6 bg-gradient-to-t from-black/70 via-black/50 to-transparent">
              <div className="!text-white/95 font-semibold text-3xl mb-1">
                {conversation.userName}
              </div>
              <div className="!text-white/95 text-lg font-semibold">
                ♊ Gemini • 🐉 Dragon
              </div>
            </div>
          </div>

          {/* Compatibility Section */}
          <div className={`px-4 py-4 ${theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"}`}>
            {compatBox ? (
              <>
                {/* Compatibility Insights Box - No Percentages */}
                <div className="bg-slate-800/40 backdrop-blur-md border border-indigo-500/20 px-4 py-4 rounded-xl shadow-lg shadow-indigo-950/30 relative">
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

                    {/* Heart Separator */}
                    <div className="text-purple-400 text-2xl px-2">♥</div>

                    {/* Profile's Signs */}
                    <div className="text-center">
                      <div className="text-2xl">{getWesternSignEmoji('Gemini')}</div>
                      <div className="text-xs text-white/70 mt-1">Gemini</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl">{getChineseSignEmoji('Dragon')}</div>
                      <div className="text-xs text-white/70 mt-1">Dragon</div>
                    </div>
                  </div>

              {/* Insights & Recommendations */}
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
                  <span className="font-semibold text-lg text-purple-300">
                    {compatBox.label}
                  </span>
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
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-white/60 italic">Analyzing your connection...</p>
              </div>
            )}
          </div>

          {/* About Section */}
          <div className="px-4 pb-4">
            <div className="bg-slate-800/40 backdrop-blur-md border border-indigo-500/20 p-4 rounded-xl shadow-lg shadow-indigo-950/30">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span className="bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">About</span>
              </h3>
              <p className="text-white/90 text-base leading-relaxed">
                Adventure seeker with a passion for meaningful conversations. I believe in living authentically and finding magic in everyday moments.
              </p>
            </div>
          </div>

          {/* Relationship Goals Section */}
          <div className="px-4 pb-4">
            <div className="bg-slate-800/40 backdrop-blur-md border border-indigo-500/20 p-4 rounded-xl shadow-lg shadow-indigo-950/30">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span className="bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">Relationship goals</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Life companion", "Best friend", "Adventure partner"].map((goal) => (
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

          {/* Interests Section */}
          <div className="px-4 pb-4">
            <div className="bg-slate-800/40 backdrop-blur-md border border-indigo-500/20 p-4 rounded-xl shadow-lg shadow-indigo-950/30">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span className="bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">Interests</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Photography", "Yoga", "Cooking", "Travel", "Art", "Music"].map((interest) => (
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

          {/* Essentials Section */}
          <div className="px-4 pb-4">
            <div className="bg-slate-800/40 backdrop-blur-md border border-indigo-500/20 p-4 rounded-xl shadow-lg shadow-indigo-950/30">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span className="bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">Essentials</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Marketing Manager", "165 cm", "Want children", "Christian", "New York, NY"].map((essential) => (
                  <span
                    key={essential}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-500 text-white shadow-lg"
                  >
                    {essential}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menu */}
      {showMenu && (
        <div
          ref={menuRef}
          className="fixed right-4 top-16 w-56 rounded-lg shadow-xl overflow-hidden bg-white border border-gray-200"
          style={{ zIndex: 99999 }}
        >
          <button
            onClick={handleEnableNotifications}
            className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors text-gray-900 hover:bg-gray-100"
          >
            <Bell className="w-5 h-5" />
            <span className="text-sm font-medium">Enable notifications</span>
          </button>

          <button
            onClick={handleUnmatch}
            className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors text-gray-900 hover:bg-gray-100"
          >
            <UserX className="w-5 h-5" />
            <span className="text-sm font-medium">Unmatch</span>
          </button>

          <button
            onClick={handleReport}
            className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors text-red-600 hover:bg-red-50"
          >
            <Flag className="w-5 h-5" />
            <span className="text-sm font-medium">Report</span>
          </button>

          <button
            onClick={handleBlock}
            className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors text-red-600 hover:bg-red-50"
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
            className="w-full max-w-sm rounded-2xl p-6 shadow-2xl bg-white border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-3 text-gray-900">
              {confirmDialog === "unmatch"
                ? "Unmatch with " + conversation.userName + "?"
                : confirmDialog === "report"
                  ? "Report " + conversation.userName + "?"
                  : "Block " + conversation.userName + "?"}
            </h3>
            <p className="text-sm mb-6 text-gray-600">
              {confirmDialog === "unmatch"
                ? "You won't be able to message each other anymore and this conversation will be deleted."
                : confirmDialog === "report"
                  ? "We'll review this profile and take appropriate action if it violates our community guidelines."
                  : "They won't be able to contact you, see your profile, or find you in search results."}
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleCancelConfirmation}
                className="flex-1 py-3 rounded-full font-semibold bg-gray-200 hover:bg-gray-300 text-gray-900"
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
            className="w-full max-w-2xl bg-zinc-900 rounded-t-3xl p-6 pb-8 max-h-[70vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold !text-white/95">Send a GIF</h3>
              <button
                onClick={() => setShowGifPicker(false)}
                className="p-2 hover:bg-slate-800/50 rounded-full transition-colors"
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
