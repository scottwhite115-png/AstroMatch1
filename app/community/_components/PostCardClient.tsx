"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { CommunityPostMenu } from "@/components/community/CommunityPostMenu"

// Custom time formatter: m for minutes, h for hours, d for days
function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "now"
  if (diffMins < 60) return `${diffMins}m`
  if (diffHours < 24) return `${diffHours}h`
  return `${diffDays}d`
}

type PostCardClientProps = {
  post: {
    id: string
    title: string
    content: string
    topic: string
    type?: string // "STORY" | "QUESTION"
    createdAt: string
    likeCount: number
    upvoteCount?: number
    downvoteCount?: number
    commentCount: number
    author: {
      id: string
      displayName: string
      eastWestCode: string
      westSign?: string
      chineseSign: string
    }
  }
  currentUserProfile: {
    id: string
    displayName: string
    eastWestCode: string
  } | null
  canModerate?: boolean
}

export function PostCardClient({ post, currentUserProfile, canModerate = false }: PostCardClientProps) {
  const { theme } = useTheme()
  const router = useRouter()
  const [upvoteCount, setUpvoteCount] = useState(post.upvoteCount || 0)
  const [downvoteCount, setDownvoteCount] = useState(post.downvoteCount || 0)
  const [userVote, setUserVote] = useState<number>(0) // 1 = upvote, -1 = downvote, 0 = no vote
  const [isVoting, setIsVoting] = useState(false)

  // Fetch user's vote on mount
  useEffect(() => {
    if (currentUserProfile) {
      fetch(`/api/community/posts/${post.id}/vote`)
        .then(res => res.json())
        .then(data => setUserVote(data.userVote || 0))
        .catch(() => {})
    }
  }, [post.id, currentUserProfile])

  const handleVote = async (vote: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!currentUserProfile || isVoting) {
      console.log("Cannot vote:", { currentUserProfile: !!currentUserProfile, isVoting })
      return
    }

    const newVote = userVote === vote ? 0 : vote // Toggle if same vote
    setIsVoting(true)

    try {
      const res = await fetch(`/api/community/posts/${post.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vote: newVote }),
      })

      if (res.ok) {
        const data = await res.json()
        setUpvoteCount(data.upvoteCount)
        setDownvoteCount(data.downvoteCount)
        setUserVote(data.userVote)
      } else {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }))
        console.error("Vote API error:", res.status, errorData)
        alert(`Failed to vote: ${errorData.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Vote error:", error)
      alert(`Failed to vote: ${error instanceof Error ? error.message : "Network error"}`)
    } finally {
      setIsVoting(false)
    }
  }

  const score = upvoteCount - downvoteCount

  // Create snippet (first 150 chars)
  const snippet = post.content.length > 150 
    ? post.content.substring(0, 150) + "..." 
    : post.content

  // Format time
  const timeAgo = formatTimeAgo(new Date(post.createdAt))

  return (
    <Link 
      href={`/community/${post.topic}/${post.id}`}
      className={`block border-x-0 border-t border-b transition-all hover:shadow-md ${
        theme === "light"
          ? "bg-white border-gray-200 hover:border-gray-300"
          : "bg-slate-900/60 border-slate-700 hover:border-slate-600"
      }`}
    >
      <div className="px-4 pt-4">
      {/* Author */}
      <div className={`flex items-center justify-between gap-2 mb-2 text-sm ${
        theme === "light" ? "text-gray-700" : "text-slate-300"
      }`}>
        <div className="flex items-center gap-2">
          <span className="font-medium text-base">{post.author.displayName}</span>
          <span className={`text-base font-semibold ${
            theme === "light" ? "text-gray-500" : "text-slate-500"
          }`}>
            {timeAgo}
          </span>
        </div>
        <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
          <CommunityPostMenu
            postId={post.id}
            authorId={post.author.id}
            authorName={post.author.displayName}
            canModerate={canModerate}
            isCurrentUser={!!currentUserProfile && String(currentUserProfile.id).toLowerCase().trim() === String(post.author.id).toLowerCase().trim()}
            theme={theme}
            onAction={() => router.refresh()}
            onDelete={() => router.refresh()}
            onEdit={() => {
              // Navigate to edit page
              router.push(`/community/${post.topic}/${post.id}/edit`);
            }}
          />
        </div>
      </div>

      {/* Title */}
      <h3 className={`text-2xl sm:text-3xl font-semibold mb-0.5 ${
        theme === "light" ? "text-slate-700" : "text-slate-50"
      }`}>
        {post.title}
      </h3>

      {/* Snippet */}
      <p className={`text-lg mb-3 ${
        theme === "light" ? "text-gray-600" : "text-slate-400"
      }`}>
        {snippet}
      </p>

      {/* Footer: Meta with Voting */}
      <div className="flex items-center gap-3 mb-0">
        {/* Voting */}
        <div className="inline-flex items-center -space-x-1">
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleVote(1, e)
            }}
            disabled={!currentUserProfile || isVoting}
            className={`flex items-center px-1 py-1.5 rounded-full transition-colors ${
              userVote === 1
                ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                : theme === "light"
                  ? "text-gray-500 hover:bg-gray-100 hover:text-orange-500"
                  : "text-slate-400 hover:bg-slate-800 hover:text-orange-400"
            } ${!currentUserProfile ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            title="Upvote"
          >
            <svg className="w-5 h-5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={0.5}>
              <path d="M12 2L2 22h20L12 2z" />
            </svg>
          </button>
          
          <span className={`text-sm font-semibold px-0.5 min-w-[20px] text-center ${
            score > 0
              ? "text-orange-500"
              : score < 0
                ? "text-blue-500"
                : theme === "light"
                  ? "text-gray-600"
                  : "text-slate-400"
          }`}>
            {score}
          </span>
          
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleVote(-1, e)
            }}
            disabled={!currentUserProfile || isVoting}
            className={`flex items-center px-1 py-1.5 rounded-full transition-colors ${
              userVote === -1
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                : theme === "light"
                  ? "text-gray-500 hover:bg-gray-100 hover:text-blue-500"
                  : "text-slate-400 hover:bg-slate-800 hover:text-blue-400"
            } ${!currentUserProfile ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            title="Downvote"
          >
            <svg className="w-5 h-5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={0.5}>
              <path d="M12 22L2 2h20L12 22z" />
            </svg>
          </button>
        </div>

        {/* Comment counter */}
        <div className={`flex items-center gap-2 text-sm ${
          theme === "light" ? "text-gray-500" : "text-slate-500"
        }`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="font-semibold">{post.commentCount}</span>
        </div>
      </div>
      </div>
    </Link>
  )
}
