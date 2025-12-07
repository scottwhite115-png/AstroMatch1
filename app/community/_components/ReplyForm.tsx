"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";

type ReplyFormProps = {
  postId: string;
  parentId: string;
  onSuccess: () => void;
  onCancel: () => void;
};

export function ReplyForm({ postId, parentId, onSuccess, onCancel }: ReplyFormProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!content.trim()) {
      setError("Please enter a reply.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch(`/api/community/posts/${postId}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: content.trim(),
            parentId,
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to create reply");
        }

        setContent("");
        router.refresh();
        onSuccess();
      } catch (err: any) {
        console.error(err);
        setError(err.message ?? "Something went wrong.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={2}
        className={`w-full rounded-lg border px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500 resize-none ${
          theme === "light"
            ? "border-gray-300 bg-white text-gray-900"
            : "border-slate-700 bg-slate-950/60 text-slate-50"
        }`}
        placeholder="Write a reply..."
      />

      {error && (
        <p className="text-xs text-rose-400">{error}</p>
      )}

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-slate-400 hover:text-slate-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending || !content.trim()}
          className="rounded-full px-3 py-1 text-xs font-medium bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-white transition-colors"
        >
          {isPending ? "Posting..." : "Reply"}
        </button>
      </div>
    </form>
  );
}

