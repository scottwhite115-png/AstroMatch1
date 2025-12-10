"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { ChatRegionScope, SanHeHouse } from "@prisma/client"
import { getHouseBySlug } from "../houses"
import { formatDistanceToNow } from "date-fns"

type Message = {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    displayName: string
    eastWestCode: string
    chineseSign: string
    photoUrl: string | null
  }
}

type Room = {
  id: string
  house: SanHeHouse
  regionScope: ChatRegionScope
  countryCode: string | null
  maxUsers: number
  currentUsers: number
}

type Props = {
  params: Promise<{ house: string }>
}

export default function SanHeHousePage({ params }: Props) {
  const { theme } = useTheme()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [houseSlug, setHouseSlug] = useState<string>("")
  const [room, setRoom] = useState<Room | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Get house from params
  useEffect(() => {
    params.then(({ house }) => setHouseSlug(house))
  }, [params])

  const house = getHouseBySlug(houseSlug)
  const regionScope = (searchParams.get("scope") as ChatRegionScope) || ChatRegionScope.GLOBAL

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Join room on mount
  useEffect(() => {
    if (!house) return

    async function joinRoom() {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch("/api/community/live/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            house: house.id,
            regionScope,
          }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Failed to join room")
        }

        const roomData = await res.json()
        setRoom(roomData)

        // Fetch initial messages
        await fetchMessages()
      } catch (err: any) {
        console.error("[SanHeHousePage] Join error:", err)
        setError(err.message || "Failed to join lounge")
      } finally {
        setLoading(false)
      }
    }

    joinRoom()
  }, [house, regionScope])

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/community/live/room?house=${house?.id}&regionScope=${regionScope}`
      )

      if (!res.ok) return

      const data = await res.json()
      setMessages(data.messages || [])
    } catch (err) {
      console.error("[SanHeHousePage] Fetch messages error:", err)
    }
  }, [house, regionScope])

  // Start polling
  useEffect(() => {
    if (!room) return

    // Poll every 3 seconds
    pollIntervalRef.current = setInterval(() => {
      fetchMessages()
    }, 3000)

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [room, fetchMessages])

  // Send message
  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || !room || sending) return

    setSending(true)
    try {
      const res = await fetch("/api/community/live/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: room.id,
          content: newMessage.trim(),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to send message")
      }

      const message = await res.json()
      setMessages((prev) => [...prev, message])
      setNewMessage("")
      scrollToBottom()
    } catch (err: any) {
      console.error("[SanHeHousePage] Send error:", err)
      setError(err.message || "Failed to send message")
    } finally {
      setSending(false)
    }
  }

  // Switch table
  async function handleSwitchTable() {
    if (!house) return

    try {
      setLoading(true)
      const res = await fetch("/api/community/live/switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          house: house.id,
          regionScope,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to switch table")
      }

      const roomData = await res.json()
      setRoom(roomData)
      setMessages([])
      await fetchMessages()
    } catch (err: any) {
      console.error("[SanHeHousePage] Switch error:", err)
      setError(err.message || "Failed to switch table")
    } finally {
      setLoading(false)
    }
  }

  if (!house) {
    return (
      <div className="mt-8 text-center">
        <p className={theme === "light" ? "text-gray-500" : "text-slate-400"}>
          House not found
        </p>
      </div>
    )
  }

  if (loading && !room) {
    return (
      <div className="mt-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        <p className={`mt-2 text-sm ${theme === "light" ? "text-gray-600" : "text-slate-400"}`}>
          Joining {house.name} lounge...
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-300px)] max-h-[600px]">
      {/* Header */}
      <div className={`rounded-t-xl border-x border-t p-4 ${
        theme === "light"
          ? "bg-white border-gray-200"
          : "bg-slate-900/60 border-slate-700"
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-base font-bold flex items-center gap-2 ${
              theme === "light" ? "text-gray-900" : "text-slate-50"
            }`}>
              <span className="text-2xl">{house.emojis}</span>
              {house.name} Lounge
            </h2>
            <p className={`text-xs mt-1 ${
              theme === "light" ? "text-gray-600" : "text-slate-400"
            }`}>
              Chatting with up to {room?.maxUsers} {house.name.toLowerCase()} •{" "}
              {room?.currentUsers || 0} online
            </p>
          </div>
          <button
            onClick={handleSwitchTable}
            disabled={loading}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
              theme === "light"
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            } disabled:opacity-50`}
          >
            Meet new people
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto border-x p-4 space-y-3 ${
        theme === "light"
          ? "bg-gray-50 border-gray-200"
          : "bg-slate-950/40 border-slate-700"
      }`}>
        {messages.length === 0 && (
          <p className={`text-center text-xs ${
            theme === "light" ? "text-gray-500" : "text-slate-500"
          }`}>
            No messages yet. Be the first to say hello!
          </p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-lg p-3 ${
              theme === "light"
                ? "bg-white border border-gray-200"
                : "bg-slate-900/60 border border-slate-700"
            }`}
          >
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-semibold ${
                    theme === "light" ? "text-gray-900" : "text-slate-50"
                  }`}>
                    {msg.author.displayName}
                  </span>
                  {msg.author.eastWestCode && (
                    <button
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${
                        theme === "light"
                          ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                      title="View compatibility"
                    >
                      {msg.author.eastWestCode}
                    </button>
                  )}
                  <span className={`text-[10px] ${
                    theme === "light" ? "text-gray-500" : "text-slate-500"
                  }`}>
                    {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className={`text-xs ${
                  theme === "light" ? "text-gray-700" : "text-slate-300"
                }`}>
                  {msg.content}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <form
        onSubmit={handleSendMessage}
        className={`rounded-b-xl border-x border-b p-4 ${
          theme === "light"
            ? "bg-white border-gray-200"
            : "bg-slate-900/60 border-slate-700"
        }`}
      >
        {error && (
          <p className="text-xs text-rose-400 mb-2">{error}</p>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            maxLength={500}
            className={`flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/70 ${
              theme === "light"
                ? "border-gray-300 bg-white text-gray-900"
                : "border-slate-700 bg-slate-950/60 text-slate-50"
            }`}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
          >
            {sending ? "..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  )
}


