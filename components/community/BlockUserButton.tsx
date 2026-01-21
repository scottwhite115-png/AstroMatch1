"use client"

import { useState } from "react"

const Ban = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
)

interface BlockUserButtonProps {
  userId: string
  userName?: string
  isBlocked?: boolean
  onBlockChange?: (blocked: boolean) => void
  theme?: "light" | "dark"
  size?: "sm" | "md" | "lg"
}

export function BlockUserButton({
  userId,
  userName = "this user",
  isBlocked: initialIsBlocked = false,
  onBlockChange,
  theme = "light",
  size = "md",
}: BlockUserButtonProps) {
  const [isBlocked, setIsBlocked] = useState(initialIsBlocked)
  const [loading, setLoading] = useState(false)

  async function handleToggleBlock() {
    const action = isBlocked ? "UNBLOCK" : "BLOCK"
    const confirmMessage = isBlocked
      ? `Unblock ${userName}?\n\nYou will see their posts and messages again.`
      : `Block ${userName}?\n\nYou won't see their posts, comments, or messages. They won't be notified.`

    if (!confirm(confirmMessage)) return

    setLoading(true)
    try {
      const res = await fetch("/api/community/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: userId, action }),
      })

      const data = await res.json()

      if (res.ok) {
        const newBlockedState = !isBlocked
        setIsBlocked(newBlockedState)
        onBlockChange?.(newBlockedState)
      } else {
        alert(data.error || `Failed to ${action.toLowerCase()} user`)
      }
    } catch (error) {
      console.error("Block error:", error)
      alert(`Failed to ${action.toLowerCase()} user`)
    } finally {
      setLoading(false)
    }
  }

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  }

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }

  return (
    <button
      onClick={handleToggleBlock}
      disabled={loading}
      className={`flex items-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        sizeClasses[size]
      } ${
        isBlocked
          ? theme === "light"
            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
            : "bg-slate-700 text-gray-300 hover:bg-slate-600"
          : theme === "light"
          ? "bg-red-50 text-red-700 hover:bg-red-100"
          : "bg-red-900/20 text-red-400 hover:bg-red-900/30"
      }`}
    >
      <Ban className={iconSizes[size]} />
      <span>{loading ? "..." : isBlocked ? "Unblock" : "Block"}</span>
    </button>
  )
}

