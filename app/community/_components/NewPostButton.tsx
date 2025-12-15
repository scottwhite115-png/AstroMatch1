"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { COMMUNITY_TOPICS } from "../topics";

type NewPostButtonProps = {
  topic: string; // topic slug for this section
  topicLabel?: string; // display label for the topic
  onPostCreated?: () => void; // optional: to trigger refresh
};

export function NewPostButton({ topic: defaultTopic, topicLabel, onPostCreated }: NewPostButtonProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"STORY" | "QUESTION">("STORY");
  const [topic, setTopic] = useState(defaultTopic);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setType("STORY");
    setTopic(defaultTopic);
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
            type,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to create post");
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
      {/* The green pill button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all border-2 ${
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
          {/* Full Screen Page */}
          <div 
            className={`fixed inset-0 z-50 overflow-y-scroll ${
              theme === "light" 
                ? "bg-white" 
                : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"
            }`} 
            style={{ 
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain'
            }}
          >
            <div className="min-h-screen pb-96">
              <div className="mx-auto max-w-2xl px-4 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 -mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      resetForm();
                    }}
                    className={`text-4xl font-medium ml-4 ${
                      theme === "light" ? "text-gray-600 hover:text-gray-900" : "text-slate-300 hover:text-slate-50"
                    }`}
                  >
                    ✕
                  </button>
                  <button
                    type="submit"
                    form="create-post-form"
                    disabled={isPending}
                    className={`rounded-full px-6 py-2.5 text-sm font-medium transition-colors disabled:opacity-60 border ${
                      theme === "light"
                        ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-gray-300"
                        : "text-slate-300 hover:text-slate-50 hover:bg-slate-800/60 border-slate-600"
                    }`}
                  >
                    {isPending ? "Posting..." : "Post"}
                  </button>
                </div>

                {/* Form */}
                <form id="create-post-form" onSubmit={handleSubmit} className="space-y-5">
                {/* Topic selector */}
                <div>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className={`w-full rounded-xl border px-4 py-4 text-xl outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500 ${
                      theme === "light"
                        ? "border-gray-300 bg-white text-gray-900"
                        : "border-slate-700 bg-slate-950/60 text-slate-50"
                    }`}
                    style={{ fontSize: '1.25rem', lineHeight: '1.75rem' }}
                  >
                    {COMMUNITY_TOPICS.map((t) => (
                      <option key={t.id} value={t.id} style={{ fontSize: '1.25rem', padding: '8px' }}>
                        {t.icon} {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={200}
                    className={`w-full rounded-xl border px-4 py-4 text-2xl outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500 ${
                      theme === "light"
                        ? "border-gray-300 bg-white text-gray-900"
                        : "border-slate-700 bg-slate-950/60 text-slate-50"
                    }`}
                    style={{ fontSize: '1.5rem', lineHeight: '2rem', fontWeight: 'bold' }}
                    placeholder="Title"
                  />
                </div>

                {/* Content */}
                <div>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                    className={`w-full rounded-xl px-4 py-3 text-2xl outline-none resize-none ${
                      theme === "light"
                        ? "bg-white text-gray-900"
                        : "bg-slate-950/60 text-slate-50"
                    }`}
                    style={{ touchAction: 'manipulation', fontSize: '1.5rem', lineHeight: '2rem' }}
                    placeholder="Share your question, experience, or insight with the community..."
                  />
                </div>

                {error && (
                  <p className="text-xs text-rose-400">
                    {error}
                  </p>
                )}
              </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

