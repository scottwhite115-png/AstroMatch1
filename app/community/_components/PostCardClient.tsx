"use client";

import { useState, useMemo } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { ConnectionBoxPreview } from "./ConnectionBoxPreview";
import Link from "next/link";

type ProfileSlim = {
  id: string;
  displayName: string;
  westSign: string;
  chineseSign: string;
  eastWestCode: string;
};

type PostSlim = {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO string
  topic: string;
  likeCount?: number;
  commentCount?: number;
  author: ProfileSlim;
};

type Props = {
  post: PostSlim;
  currentUserProfile: ProfileSlim | null;
};

export function PostCardClient({ post, currentUserProfile }: Props) {
  const { theme } = useTheme();
  const [showConnection, setShowConnection] = useState(false);

  const createdLabel = useMemo(() => {
    const d = new Date(post.createdAt);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, [post.createdAt]);

  const viewer = currentUserProfile;

  return (
    <>
      <Link href={`/community/${post.topic}/${post.id}`} className="block">
        <article className={`rounded-2xl border p-4 shadow-sm transition-colors ${
          theme === "light"
            ? "border-gray-200 bg-white hover:border-gray-300"
            : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
        }`}>
          <header className="mb-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {/* Astro sign pill as a button */}
              <button
                type="button"
                disabled={!viewer}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (viewer) setShowConnection(true);
                }}
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-medium
                           hover:border-emerald-500 hover:text-emerald-300 transition-colors disabled:opacity-60 ${
                  theme === "light"
                    ? "border-gray-300 bg-gray-50 text-gray-700"
                    : "border-slate-700 bg-slate-950/60 text-slate-200"
                }`}
                title={
                  viewer
                    ? `View connection: ${viewer.eastWestCode} × ${post.author.eastWestCode}`
                    : "Log in to view your connection"
                }
              >
                <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                  theme === "light" ? "bg-gray-200 text-gray-700" : "bg-slate-800 text-slate-300"
                }`}>
                  {/* You can swap these for real icons / glyphs */}
                  {post.author.westSign?.[0] || "?"}
                </span>
                <span className="truncate max-w-[120px]">
                  {post.author.eastWestCode || `${post.author.westSign} ${post.author.chineseSign}`}
                </span>
              </button>

              <div className="flex flex-col">
                <span className={`text-xs font-semibold ${
                  theme === "light" ? "text-gray-900" : "text-slate-100"
                }`}>
                  {post.author.displayName}
                </span>
                <span className={`text-[11px] ${
                  theme === "light" ? "text-gray-500" : "text-slate-500"
                }`}>
                  {createdLabel}
                </span>
              </div>
            </div>
          </header>

          <h3 className={`text-sm font-semibold ${
            theme === "light" ? "text-gray-900" : "text-slate-50"
          }`}>
            {post.title}
          </h3>
          <p className={`mt-1 text-xs line-clamp-3 whitespace-pre-wrap ${
            theme === "light" ? "text-gray-700" : "text-slate-300"
          }`}>
            {post.content}
          </p>

          <footer className={`mt-3 flex items-center justify-between text-[11px] ${
            theme === "light" ? "text-gray-500" : "text-slate-500"
          }`}>
            <span>#{post.topic}</span>
            <div className="flex items-center gap-3">
              {post.commentCount !== undefined && post.commentCount > 0 && (
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {post.commentCount}
                </span>
              )}
              {post.likeCount !== undefined && post.likeCount > 0 && (
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {post.likeCount}
                </span>
              )}
            </div>
          </footer>
        </article>
      </Link>

      {viewer && showConnection && (
        <ConnectionBoxPreview
          viewer={viewer}
          other={post.author}
          onClose={() => setShowConnection(false)}
        />
      )}
    </>
  );
}

