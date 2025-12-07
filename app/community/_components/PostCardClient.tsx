"use client";

import { useState, useMemo } from "react";
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
  author: ProfileSlim;
};

type Props = {
  post: PostSlim;
  currentUserProfile: ProfileSlim | null;
};

export function PostCardClient({ post, currentUserProfile }: Props) {
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
        <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm hover:border-slate-700 transition-colors">
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
                className="inline-flex items-center gap-1 rounded-full border border-slate-700
                           bg-slate-950/60 px-2 py-1 text-[11px] font-medium text-slate-200
                           hover:border-emerald-500 hover:text-emerald-300 transition-colors disabled:opacity-60"
                title={
                  viewer
                    ? `View connection: ${viewer.eastWestCode} × ${post.author.eastWestCode}`
                    : "Log in to view your connection"
                }
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[10px]">
                  {/* You can swap these for real icons / glyphs */}
                  {post.author.westSign?.[0] || "?"}
                </span>
                <span className="truncate max-w-[120px]">
                  {post.author.eastWestCode || `${post.author.westSign} ${post.author.chineseSign}`}
                </span>
              </button>

              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-100">
                  {post.author.displayName}
                </span>
                <span className="text-[11px] text-slate-500">
                  {createdLabel}
                </span>
              </div>
            </div>
          </header>

          <h3 className="text-sm font-semibold text-slate-50">
            {post.title}
          </h3>
          <p className="mt-1 text-xs text-slate-300 line-clamp-3 whitespace-pre-wrap">
            {post.content}
          </p>

          <footer className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
            <span>#{post.topic}</span>
            {/* You may already have a "View discussion" link here */}
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

