"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";

type LikeButtonProps = {
  commentId: string;
  initialCount: number;
  disabled?: boolean;
};

export function LikeButton({ commentId, initialCount, disabled = false }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [isPending, setIsPending] = useState(false);

  async function handleLike() {
    if (isPending || disabled) return;

    setIsPending(true);
    try {
      const res = await fetch(`/api/community/comments/${commentId}/like`, {
        method: "POST",
      });

      if (res.status === 401) {
        // Unauthorized - redirect to login
        window.location.href = "/login";
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to toggle like");
      }

      const data = await res.json();
      setLiked(data.liked);
      setCount(data.likeCount);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPending(false);
    }
  }

  if (disabled) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
      >
        <Heart size={14} />
        <span>{count > 0 ? count : ""}</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={isPending}
      className={`inline-flex items-center gap-1 text-xs transition-colors ${
        liked
          ? "text-rose-400 hover:text-rose-300"
          : "text-slate-400 hover:text-slate-300"
      } disabled:opacity-50`}
    >
      <Heart
        size={14}
        className={liked ? "fill-current" : ""}
      />
      <span>{count > 0 ? count : ""}</span>
    </button>
  );
}

