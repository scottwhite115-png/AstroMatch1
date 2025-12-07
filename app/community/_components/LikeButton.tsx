"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

type LikeButtonProps = {
  commentId: string;
  initialCount: number;
};

export function LikeButton({ commentId, initialCount }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [isPending, setIsPending] = useState(false);

  async function handleLike() {
    if (isPending) return;

    setIsPending(true);
    try {
      const res = await fetch(`/api/community/comments/${commentId}/like`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to toggle like");
      }

      const data = await res.json();
      setLiked(data.liked);
      setCount(data.count);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPending(false);
    }
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
      <span>{count}</span>
    </button>
  );
}

