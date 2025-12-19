"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";

type NewCommentFormProps = {
  postId: string;
};

export function NewCommentForm({ postId }: NewCommentFormProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!content.trim()) {
      setError("Please enter a comment.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch(`/api/community/posts/${postId}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: content.trim(),
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to create comment");
        }

        setContent("");
        router.refresh();
      } catch (err: any) {
        console.error(err);
        setError(err.message ?? "Something went wrong.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className={`w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500 resize-none ${
            theme === "light"
              ? "border-gray-300 bg-white text-slate-700"
              : "border-slate-700 bg-slate-950/60 text-slate-50"
          }`}
          placeholder="Write a comment..."
        />
      </div>

      {error && (
        <p className="text-xs text-rose-400">{error}</p>
      )}

      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={isPending || !content.trim()}
          className="rounded-full px-4 py-1.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-white shadow-sm transition-colors"
        >
          {isPending ? "Posting..." : "Post Comment"}
        </button>
      </div>
    </form>
  );
}

