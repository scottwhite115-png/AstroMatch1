"use client"

import { useState, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import type { CommunityTopic } from "../../topics"
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

type Author = {
  id: string
  displayName: string
  eastWestCode: string
  westSign: string
  chineseSign: string
  photoUrl: string | null
}

type Reply = {
  id: string
  content: string
  createdAt: string
  likeCount: number
  upvoteCount?: number
  downvoteCount?: number
  parentId: string | null
  author: Author
}

type Comment = {
  id: string
  content: string
  createdAt: string
  likeCount: number
  upvoteCount?: number
  downvoteCount?: number
  author: Author
  replies: Reply[]
}

type Post = {
  id: string
  title: string
  content: string
  topic: string
  type: string
  isHidden: boolean
  createdAt: string
  likeCount: number
  upvoteCount?: number
  downvoteCount?: number
  commentCount: number
  author: Author
  comments: Comment[]
}

type Props = {
  post: Post
  topicData: CommunityTopic
  currentUserId: string | null
  canModerate: boolean
}

export function ThreadPageClient({ post, topicData, currentUserId, canModerate }: Props) {
  const { theme } = useTheme()
  const router = useRouter()
  const [replyContent, setReplyContent] = useState("")
  const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [upvoteCount, setUpvoteCount] = useState(post.upvoteCount || 0)
  const [downvoteCount, setDownvoteCount] = useState(post.downvoteCount || 0)
  const [userVote, setUserVote] = useState<number>(0) // 1 = upvote, -1 = downvote, 0 = no vote
  const [isVoting, setIsVoting] = useState(false)
  
  // Track comment votes
  const [commentVotes, setCommentVotes] = useState<Record<string, { upvotes: number, downvotes: number, userVote: number }>>({})

  // Fetch user's vote on mount
  useEffect(() => {
    if (currentUserId) {
      fetch(`/api/community/posts/${post.id}/vote`)
        .then(res => res.json())
        .then(data => setUserVote(data.userVote || 0))
        .catch(() => {})
    }
  }, [post.id, currentUserId])

  const handleVote = async (vote: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!currentUserId || isVoting) {
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

  async function handleSubmitReply(e: React.FormEvent) {
    e.preventDefault()
    if (!replyContent.trim()) return

    setError(null)
    startTransition(async () => {
      try {
        const res = await fetch(`/api/community/posts/${post.id}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: replyContent.trim(),
            parentId: replyToCommentId,
          }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Failed to post reply")
        }

        setReplyContent("")
        setReplyToCommentId(null)
        router.refresh()
      } catch (err: any) {
        setError(err.message || "Failed to post reply")
      }
    })
  }

  async function handleCommentVote(commentId: string, vote: number) {
    if (!currentUserId || isVoting) return
    
    setIsVoting(true)
    try {
      const currentVote = commentVotes[commentId]?.userVote || 0
      const newVote = currentVote === vote ? 0 : vote
      
      const res = await fetch(`/api/community/comments/${commentId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vote: newVote }),
      })
      
      if (res.ok) {
        const data = await res.json()
        setCommentVotes(prev => ({
          ...prev,
          [commentId]: {
            upvotes: data.upvoteCount,
            downvotes: data.downvoteCount,
            userVote: data.userVote
          }
        }))
      }
    } catch (error) {
      console.error("Error voting on comment:", error)
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <div className="space-y-4 pb-24">
      {/* Post Card */}
      <article className={`rounded-xl border px-5 pt-5 pb-0 ${
        theme === "light"
          ? "bg-white border-gray-200"
          : "bg-slate-900/60 border-slate-700"
      }`}>
        {/* Hidden Badge (for admins) */}
        {post.isHidden && canModerate && (
          <div className="mb-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase ${
              theme === "light"
                ? "bg-orange-100 text-orange-700"
                : "bg-orange-900/30 text-orange-400"
            }`}>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
              Hidden Post (visible to staff only)
            </span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-2 text-sm">
          {/* Author */}
          <div className={`flex items-center justify-between gap-2 ${
            theme === "light" ? "text-gray-700" : "text-slate-300"
          }`}>
            <span className="font-medium text-base">{post.author.displayName}</span>
            <span className={`text-base font-semibold ${
              theme === "light" ? "text-gray-500" : "text-slate-500"
            }`}>
              {formatTimeAgo(new Date(post.createdAt))}
            </span>
          </div>

          {/* 3-Dot Menu */}
          <CommunityPostMenu
            postId={post.id}
            authorId={post.author.id}
            authorName={post.author.displayName}
            canModerate={canModerate}
            isCurrentUser={!!currentUserId && String(currentUserId).toLowerCase().trim() === String(post.author.id).toLowerCase().trim()}
            theme={theme}
            onAction={() => router.refresh()}
            onDelete={() => router.push(`/community/${post.topic}`)}
            onEdit={() => router.push(`/community/${post.topic}/${post.id}/edit`)}
          />
        </div>

        {/* Title */}
        <h1 className={`text-2xl sm:text-3xl font-bold mb-0.5 ${
          theme === "light" ? "text-slate-700" : "text-slate-50"
        }`}>
          {post.title}
        </h1>

        {/* Content */}
        <div className={`text-lg whitespace-pre-wrap mb-3 ${
          theme === "light" ? "text-slate-600" : "text-slate-200"
        }`}>
          {post.content}
        </div>

        {/* Footer: Meta with Voting */}
        <div className="flex items-center gap-3 mb-0">
          {/* Voting */}
          <div className="inline-flex items-center -space-x-1">
            <button
              onClick={(e) => handleVote(1, e)}
              disabled={!currentUserId || isVoting}
              className={`flex items-center px-1 focus:outline-none ${
                userVote === 1
                  ? "text-orange-500"
                  : theme === "light"
                    ? "text-gray-400 hover:text-orange-500"
                    : "text-slate-500 hover:text-orange-400"
              } ${!currentUserId ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
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
              onClick={(e) => handleVote(-1, e)}
              disabled={!currentUserId || isVoting}
              className={`flex items-center px-1 focus:outline-none ${
                userVote === -1
                  ? "text-blue-500"
                  : theme === "light"
                    ? "text-gray-400 hover:text-blue-500"
                    : "text-slate-500 hover:text-blue-400"
              } ${!currentUserId ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
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
      </article>

      {/* Reply Composer */}
      <div className={`rounded-xl border p-4 ${
        theme === "light"
          ? "bg-white border-gray-200"
          : "bg-slate-900/60 border-slate-700"
      }`}>
        <form onSubmit={handleSubmitReply} className="space-y-3">
          {replyToCommentId && (
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs ${
                theme === "light" ? "text-gray-600" : "text-slate-400"
              }`}>
                Replying to comment
              </span>
              <button
                type="button"
                onClick={() => setReplyToCommentId(null)}
                className={`text-xs ${
                  theme === "light" ? "text-slate-500 hover:text-slate-700" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Cancel
              </button>
            </div>
          )}
          <div className="flex items-end gap-2">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={3}
              placeholder="Share your thoughts..."
              maxLength={2000}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/70 resize-none ${
                theme === "light"
                  ? "border-gray-300 bg-white text-gray-900"
                  : "border-slate-700 bg-slate-950/60 text-slate-50"
              }`}
            />
            <button
              type="submit"
              disabled={!replyContent.trim() || isPending}
              className="px-4 py-2 rounded-full text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white transition-colors whitespace-nowrap"
            >
              {isPending ? "Posting..." : "Post"}
            </button>
          </div>
          {error && (
            <p className="text-xs text-rose-400">{error}</p>
          )}
        </form>
      </div>

      {/* Comments Section */}
      <div className="space-y-3">


        {post.comments.map((comment) => (
          <div key={comment.id}>
            {/* Top-level comment */}
            <div className={`rounded-xl border p-4 ${
              theme === "light"
                ? "bg-white border-gray-200"
                : "bg-slate-900/60 border-slate-700"
            }`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-base font-medium ${
                    theme === "light" ? "text-gray-700" : "text-slate-300"
                  }`}>
                    {comment.author.displayName}
                  </span>
                  <span className={`text-base font-semibold ${
                    theme === "light" ? "text-gray-500" : "text-slate-500"
                  }`}>
                    {formatTimeAgo(new Date(comment.createdAt))}
                  </span>
                </div>
              </div>

              <p className={`text-lg mb-3 ${
                theme === "light" ? "text-slate-600" : "text-slate-200"
              }`}>
                {comment.content}
              </p>

              {/* Voting and Reply */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 -space-x-1">
                  <button
                    disabled={!currentUserId || isVoting}
                    onClick={() => handleCommentVote(comment.id, 1)}
                    className={`p-0.5 ${
                      commentVotes[comment.id]?.userVote === 1
                        ? "text-orange-500"
                        : theme === "light" ? "text-gray-400 hover:text-orange-500" : "text-slate-500 hover:text-orange-400"
                    } ${!currentUserId ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={0.5}>
                      <path d="M12 2L2 22h20L12 2z" />
                    </svg>
                  </button>
                  <span className={`text-sm font-semibold min-w-[20px] text-center ${
                    theme === "light" ? "text-gray-700" : "text-slate-300"
                  }`}>
                    {(commentVotes[comment.id]?.upvotes || 0) - (commentVotes[comment.id]?.downvotes || 0)}
                  </span>
                  <button
                    disabled={!currentUserId || isVoting}
                    onClick={() => handleCommentVote(comment.id, -1)}
                    className={`p-0.5 ${
                      commentVotes[comment.id]?.userVote === -1
                        ? "text-blue-500"
                        : theme === "light" ? "text-gray-400 hover:text-blue-500" : "text-slate-500 hover:text-blue-400"
                    } ${!currentUserId ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={0.5}>
                      <path d="M12 22L2 2h20L12 22z" />
                    </svg>
                  </button>
                </div>

                {/* Reply button */}
                <button
                  onClick={() => setReplyToCommentId(comment.id)}
                  disabled={!currentUserId}
                  className={`text-sm font-semibold ${
                    theme === "light" ? "text-gray-500 hover:text-gray-700" : "text-slate-400 hover:text-slate-200"
                  } ${!currentUserId ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  Reply
                </button>
              </div>
            </div>

            {/* Nested replies */}
            {comment.replies.length > 0 && (
              <div className="ml-6 mt-2 space-y-2">
                {comment.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`rounded-lg border p-3 ${
                      theme === "light"
                        ? "bg-gray-50 border-gray-200"
                        : "bg-slate-950/40 border-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                      <span className={`text-base font-medium ${
                        theme === "light" ? "text-gray-700" : "text-slate-300"
                      }`}>
                        {reply.author.displayName}
                      </span>
                      <span className={`text-base font-semibold ${
                        theme === "light" ? "text-gray-500" : "text-slate-500"
                      }`}>
                        {formatTimeAgo(new Date(reply.createdAt))}
                      </span>
                      </div>
                    </div>

                    <p className={`text-lg ${
                      theme === "light" ? "text-gray-700" : "text-slate-300"
                    }`}>
                      {reply.content}
                    </p>

                    {/* Voting and Reply */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1 -space-x-1">
                        <button
                          disabled={!currentUserId || isVoting}
                          onClick={() => handleCommentVote(reply.id, 1)}
                          className={`p-0.5 ${
                            commentVotes[reply.id]?.userVote === 1
                              ? "text-orange-500"
                              : theme === "light" ? "text-gray-400 hover:text-orange-500" : "text-slate-500 hover:text-orange-400"
                          } ${!currentUserId ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          <svg className="w-4 h-4" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={0.5}>
                            <path d="M12 2L2 22h20L12 2z" />
                          </svg>
                        </button>
                        <span className={`text-sm font-semibold min-w-[20px] text-center ${
                          theme === "light" ? "text-gray-700" : "text-slate-300"
                        }`}>
                          {(commentVotes[reply.id]?.upvotes || 0) - (commentVotes[reply.id]?.downvotes || 0)}
                        </span>
                        <button
                          disabled={!currentUserId || isVoting}
                          onClick={() => handleCommentVote(reply.id, -1)}
                          className={`p-0.5 ${
                            commentVotes[reply.id]?.userVote === -1
                              ? "text-blue-500"
                              : theme === "light" ? "text-gray-400 hover:text-blue-500" : "text-slate-500 hover:text-blue-400"
                          } ${!currentUserId ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          <svg className="w-4 h-4" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={0.5}>
                            <path d="M12 22L2 2h20L12 22z" />
                          </svg>
                        </button>
                      </div>

                      {/* Reply button */}
                      <button
                        onClick={() => setReplyToCommentId(comment.id)}
                        disabled={!currentUserId}
                        className={`text-sm font-semibold ${
                          theme === "light" ? "text-gray-500 hover:text-gray-700" : "text-slate-400 hover:text-slate-200"
                        } ${!currentUserId ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}


