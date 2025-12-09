"use client"

import Link from "next/link"
import { useTheme } from "@/contexts/ThemeContext"
import { formatDistanceToNow } from "date-fns"

type PostCardClientProps = {
  post: {
    id: string
    title: string
    content: string
    topic: string
    type?: string // "STORY" | "QUESTION"
    createdAt: string
    likeCount: number
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
}

export function PostCardClient({ post, currentUserProfile }: PostCardClientProps) {
  const { theme } = useTheme()

  // Create snippet (first 150 chars)
  const snippet = post.content.length > 150 
    ? post.content.substring(0, 150) + "..." 
    : post.content

  // Format time
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })

  return (
    <Link 
      href={`/community/${post.topic}/${post.id}`}
      className={`block rounded-xl border p-4 transition-all hover:shadow-md ${
        theme === "light"
          ? "bg-white border-gray-200 hover:border-gray-300"
          : "bg-slate-900/60 border-slate-700 hover:border-slate-600"
      }`}
    >
      {/* Header: Type badge + Topic hashtag */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {/* Type badge */}
          {post.type && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              post.type === "QUESTION"
                ? theme === "light"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-blue-950/50 text-blue-300"
                : theme === "light"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-purple-950/50 text-purple-300"
            }`}>
              {post.type === "QUESTION" ? "Question" : "Story"}
            </span>
          )}
          
          {/* Topic hashtag */}
          <span className={`text-[10px] font-medium ${
            theme === "light" ? "text-gray-500" : "text-slate-500"
          }`}>
            #{post.topic.replace(/-/g, " ")}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className={`text-sm font-semibold mb-1.5 ${
        theme === "light" ? "text-gray-900" : "text-slate-50"
      }`}>
        {post.title}
      </h3>

      {/* Snippet */}
      <p className={`text-xs mb-3 ${
        theme === "light" ? "text-gray-600" : "text-slate-400"
      }`}>
        {snippet}
      </p>

      {/* Footer: Author + Meta */}
      <div className="flex items-center justify-between gap-3">
        {/* Author pill */}
        <div className={`flex items-center gap-2 text-xs ${
          theme === "light" ? "text-gray-700" : "text-slate-300"
        }`}>
          <span className="font-medium">{post.author.displayName}</span>
          {post.author.eastWestCode && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
              theme === "light"
                ? "bg-gray-100 text-gray-600"
                : "bg-slate-800 text-slate-300"
            }`}>
              {post.author.eastWestCode}
            </span>
          )}
        </div>

        {/* Meta: replies · likes · time */}
        <div className={`flex items-center gap-2 text-[10px] ${
          theme === "light" ? "text-gray-500" : "text-slate-500"
        }`}>
          <span>{post.commentCount} {post.commentCount === 1 ? "reply" : "replies"}</span>
          <span>·</span>
          <span>{post.likeCount} {post.likeCount === 1 ? "like" : "likes"}</span>
          <span>·</span>
          <span>{timeAgo}</span>
        </div>
      </div>
    </Link>
  )
}
