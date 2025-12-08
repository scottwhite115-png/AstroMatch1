"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";

type NewPostButtonProps = {
  topic: string; // topic slug for this section
  topicLabel?: string; // display label for the topic
  onPostCreated?: () => void; // optional: to trigger refresh
};

export function NewPostButton({ topic, topicLabel, onPostCreated }: NewPostButtonProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setError(null);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !content.trim()) {
      setError("Please add a title and some content.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/community/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            content,
            topic,
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to create post");
        }

        resetForm();
        setOpen(false);
        // Refresh the page to show the new post (server component will re-fetch)
        router.refresh();
        onPostCreated?.();
      } catch (err: any) {
        console.error(err);
        setError(err.message ?? "Something went wrong.");
      }
    });
  }

  return (
    <>
      {/* The green pill button you already have */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1 rounded-full px-2 sm:px-3 py-1.5 text-xs font-medium transition-all border-2 whitespace-nowrap flex-shrink-0 ${
          theme === "light"
            ? "bg-transparent border-emerald-500 text-emerald-600 hover:bg-emerald-50"
            : "bg-transparent border-emerald-500 text-emerald-400 hover:bg-emerald-950/30"
        }`}
      >
        <span>＋</span>
        <span>New post</span>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => {
              setOpen(false);
              resetForm();
            }}
          />
          
          {/* Modal */}
          <div className={`fixed inset-0 z-50 flex items-center justify-center p-4`}>
            <div 
              className={`w-full max-w-lg rounded-2xl p-4 sm:p-6 shadow-xl border ${
                theme === "light"
                  ? "bg-white border-gray-200 text-gray-900"
                  : "bg-slate-900 border-slate-700 text-slate-50"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className={`text-xs uppercase tracking-wide ${
                    theme === "light" ? "text-gray-500" : "text-slate-400"
                  }`}>
                    Posting in
                  </p>
                  <p className={`text-sm font-semibold ${
                    theme === "light" ? "text-gray-900" : "text-slate-100"
                  }`}>
                    {topicLabel || `#${topic}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    resetForm();
                  }}
                  className={`text-xs ${
                    theme === "light" ? "text-gray-400 hover:text-gray-600" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className={`text-xs font-medium ${
                    theme === "light" ? "text-gray-700" : "text-slate-300"
                  }`}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={120}
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500 ${
                      theme === "light"
                        ? "border-gray-300 bg-white text-gray-900"
                        : "border-slate-700 bg-slate-950/60 text-slate-50"
                    }`}
                    placeholder="Give your post a clear, interesting title..."
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-xs font-medium ${
                    theme === "light" ? "text-gray-700" : "text-slate-300"
                  }`}>
                    Post
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={5}
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500 resize-none ${
                      theme === "light"
                        ? "border-gray-300 bg-white text-gray-900"
                        : "border-slate-700 bg-slate-950/60 text-slate-50"
                    }`}
                    placeholder="Share your question, experience, or insight with the community..."
                  />
                </div>

                {error && (
                  <p className="text-xs text-rose-400">
                    {error}
                  </p>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      resetForm();
                    }}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                      theme === "light"
                        ? "text-gray-600 hover:bg-gray-100"
                        : "text-slate-300 hover:bg-slate-800/60"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-full px-4 py-1.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white shadow-sm transition-colors"
                  >
                    {isPending ? "Posting..." : "Post"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}

