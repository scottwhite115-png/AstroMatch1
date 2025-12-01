// app/community/page.tsx (or components/CommunityPage.tsx)

"use client";

import { useMemo, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

// ----------------------
// Types & static data
// ----------------------

// Four-pointed star icon for Astromatch logo
const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

type TopicId =
  | "sun_signs"
  | "chinese_zodiac"
  | "vedic"
  | "relationship"
  | "qa";

type Topic = {
  id: TopicId;
  label: string;
  description: string;
  icon: string; // emoji for now
};

const TOPICS: Topic[] = [
  {
    id: "relationship",
    label: "Relationship",
    description:
      "Synastry, East × West patterns and how connections feel in real life.",
    icon: "❌",
  },
  {
    id: "sun_signs",
    label: "Sun Signs",
    description: "Posts about Western Sun signs, elements and aspects.",
    icon: "☀️",
  },
  {
    id: "chinese_zodiac",
    label: "Chinese Zodiac",
    description: "Animals, trines, San He / Liu He, elements and years.",
    icon: "🐉",
  },
  {
    id: "vedic",
    label: "Vedic Astrology",
    description: "Moon signs, dashas and Jyotiṣa techniques.",
    icon: "🕉️",
  },
  {
    id: "qa",
    label: "Questions & Answers",
    description: "Ask and answer specific astrology questions.",
    icon: "❓",
  },
];

type CommunityComment = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
};

type CommunityPost = {
  id: string;
  topicId: TopicId;
  title: string;
  excerpt: string;
  author: string;
  createdAt: string;
  likeCount: number;
  youLiked: boolean;
  commentCount: number;
  comments: CommunityComment[];
};

// Some placeholder posts so the layout has something to render.
// Replace this with data from Supabase later.
const INITIAL_POSTS: CommunityPost[] = [
  {
    id: "1",
    topicId: "relationship",
    title: "Aquarius / Monkey × Scorpio / Snake – why does this feel so intense?",
    excerpt:
      "We have this on–off rhythm that feels magnetic but exhausting. Curious how other fixed-sign mixes experience Six Conflicts and water vs air...",
    author: "Luna",
    createdAt: "2 hours ago",
    likeCount: 18,
    youLiked: false,
    commentCount: 3,
    comments: [
      {
        id: "1-1",
        author: "AstroReader",
        content:
          "Fixed Air × Fixed Water often locks into a pattern. The Chinese pattern just amplifies that stop–start intensity.",
        createdAt: "1 hour ago",
      },
      {
        id: "1-2",
        author: "StarSeeker",
        content:
          "I'm Aqua / Monkey with a Scorpio / Dragon ex – same vibe. Lots of depth, very hard to keep 'light'.",
        createdAt: "45 minutes ago",
      },
    ],
  },
  {
    id: "2",
    topicId: "sun_signs",
    title: "Double Aquarius relationships – too similar or just right?",
    excerpt:
      "Curious how other double Aqua pairs experience the 'mirror effect'. Is it freeing, or does it get stuck in ideas?",
    author: "Sky",
    createdAt: "1 day ago",
    likeCount: 9,
    youLiked: false,
    commentCount: 1,
    comments: [
      {
        id: "2-1",
        author: "Helio",
        content:
          "In my experience it's ultra-mental. Great for ideas, needs conscious effort to stay in the body and feelings.",
        createdAt: "18 hours ago",
      },
    ],
  },
  {
    id: "3",
    topicId: "chinese_zodiac",
    title: "San He vs Liu He – which feels more like 'soulmate'?",
    excerpt:
      "If you've dated within your San He trine and also a Liu He 'Secret Friend', how did the chemistry differ?",
    author: "TigerMoon",
    createdAt: "3 days ago",
    likeCount: 22,
    youLiked: true,
    commentCount: 5,
    comments: [],
  },
];

// ----------------------
// Theme toggle component
// ----------------------

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={`flex items-center justify-center w-9 h-9 rounded-full transition-all ${
        theme === "light"
          ? "bg-transparent hover:bg-slate-100 text-slate-700"
          : "bg-transparent hover:bg-slate-800/50 text-yellow-300"
      }`}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )}
    </button>
  );
}

// ----------------------
// Main component
// ----------------------

export default function CommunityPage() {
  const { theme } = useTheme();
  const [activeTopicId, setActiveTopicId] = useState<TopicId>("relationship");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [openCommentsPostId, setOpenCommentsPostId] = useState<string | null>(
    null
  );

  const activeTopic =
    TOPICS.find((topic) => topic.id === activeTopicId) ?? TOPICS[0];

  const filteredPosts = useMemo(
    () => posts.filter((post) => post.topicId === activeTopicId),
    [posts, activeTopicId]
  );

  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const youLiked = !post.youLiked;
        const likeCount = post.likeCount + (youLiked ? 1 : -1);
        return { ...post, youLiked, likeCount: Math.max(likeCount, 0) };
      })
    );
  };

  const handleToggleComments = (postId: string) => {
    setOpenCommentsPostId((current) =>
      current === postId ? null : postId
    );
  };

  const handleAddComment = (postId: string, content: string) => {
    if (!content.trim()) return;
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const newComment: CommunityComment = {
          id: `${post.id}-${post.comments.length + 1}`,
          author: "You",
          content: content.trim(),
          createdAt: "Just now",
        };
        return {
          ...post,
          comments: [...post.comments, newComment],
          commentCount: post.commentCount + 1,
        };
      })
    );
  };

  const handleNewPost = () => {
    // Later: open your "New Post" modal / page here.
    alert(`New post in topic: ${activeTopic.label}`);
  };

  return (
    <div className={`flex h-full min-h-screen flex-col ${
      theme === "light"
        ? "bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50"
        : "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
    }`}>
      {/* Astromatch Logo - Top Left Corner */}
      <div className="absolute top-2 left-4 z-50 flex items-center gap-0.5">
        <FourPointedStar className="w-4 h-4 text-orange-500" />
        <span className="font-bold text-base bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
          AstroMatch
        </span>
      </div>

      {/* Top bar */}
      <header className={`sticky top-0 z-50 flex items-center justify-between border-b px-4 py-3 ${
        theme === "light"
          ? "bg-white/80 backdrop-blur-sm border-gray-200"
          : "bg-slate-900/80 backdrop-blur-sm border-slate-800"
      }`}>
        <div className="flex items-center gap-2">
          {/* Menu icon to toggle drawer */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
              theme === "light"
                ? "border-gray-200 hover:bg-gray-100"
                : "border-slate-700 hover:bg-slate-800"
            }`}
            aria-label={isDrawerOpen ? "Close topics" : "Open topics"}
          >
            {/* List icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={theme === "light" ? "text-gray-700" : "text-slate-300"}
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>

          <div className="flex items-center gap-0.5">
            <FourPointedStar className="w-4 h-4 text-orange-500" />
            <span className="font-bold text-base bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Community
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleNewPost}
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all border-2 ${
              theme === "light"
                ? "bg-transparent border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                : "bg-transparent border-emerald-500 text-emerald-400 hover:bg-emerald-950/30"
            }`}
          >
            <span>＋</span>
            <span>New post</span>
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* Left slide-in drawer */}
      {isDrawerOpen && (
        <>
          {/* Backdrop overlay - click to close drawer */}
          <div 
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Close drawer"
          />
          
          {/* Drawer panel */}
          <aside 
            className={`fixed left-0 bottom-0 z-50 w-72 max-w-[80vw] shadow-xl border-r flex flex-col ${
              theme === "light"
                ? "bg-white border-gray-200"
                : "bg-slate-900 border-slate-800"
            }`}
            style={{ top: 'var(--header-height, 60px)' }}
            onClick={(e) => e.stopPropagation()}
          >

            <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
              {TOPICS.map((topic) => {
                const isActive = topic.id === activeTopicId;
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => {
                      setActiveTopicId(topic.id);
                      setIsDrawerOpen(false);
                    }}
                    className={[
                      "flex w-full items-start gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
                      isActive
                        ? theme === "light"
                          ? "bg-blue-100 text-blue-900"
                          : "bg-blue-900/40 text-blue-300"
                        : theme === "light"
                        ? "text-gray-600 hover:bg-gray-100"
                        : "text-slate-400 hover:bg-slate-800",
                    ].join(" ")}
                  >
                    <span className="mt-[1px] text-base">{topic.icon}</span>
                    <span className="flex flex-col">
                      <span className="font-medium">{topic.label}</span>
                      <span className={`text-xs ${
                        theme === "light" ? "text-gray-500" : "text-slate-500"
                      }`}>
                        {topic.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </nav>
          </aside>
        </>
      )}

      {/* Main content */}
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-4 pb-24">
        {/* Topic heading */}
        <section className="mb-3 space-y-1">
          <h1 className={`text-lg font-semibold flex items-center gap-2 ${
            theme === "light" ? "text-gray-900" : "text-white"
          }`}>
            <span>{activeTopic.icon}</span>
            <span>{activeTopic.label}</span>
          </h1>
          <p className={`text-sm ${
            theme === "light" ? "text-gray-600" : "text-slate-400"
          }`}>
            {activeTopic.description}
          </p>
        </section>

        {/* Posts feed */}
        <section className="space-y-3">
          {filteredPosts.length === 0 && (
            <p className={`text-sm ${
              theme === "light" ? "text-gray-600" : "text-slate-400"
            }`}>
              No posts in this topic yet. Be the first to share something.
            </p>
          )}

          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onToggleLike={handleToggleLike}
              onToggleComments={handleToggleComments}
              commentsOpen={openCommentsPostId === post.id}
              onAddComment={handleAddComment}
            />
          ))}
        </section>
      </main>
    </div>
  );
}

// ----------------------
// Post card component
// ----------------------

type PostCardProps = {
  post: CommunityPost;
  onToggleLike: (postId: string) => void;
  onToggleComments: (postId: string) => void;
  onAddComment: (postId: string, content: string) => void;
  commentsOpen: boolean;
};

function PostCard({
  post,
  onToggleLike,
  onToggleComments,
  onAddComment,
  commentsOpen,
}: PostCardProps) {
  const { theme } = useTheme();
  const [draftComment, setDraftComment] = useState("");

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    onAddComment(post.id, draftComment);
    setDraftComment("");
  };

  const likeIcon = post.youLiked ? "♥" : "♡";

  return (
    <article className={`rounded-lg border p-4 shadow-sm transition-all ${
      theme === "light"
        ? "bg-white/90 border-gray-200 hover:border-blue-300 hover:shadow-md"
        : "bg-slate-900/60 border-slate-800 hover:border-blue-700 hover:shadow-lg hover:shadow-blue-900/20"
    }`}>
      <header className="mb-2">
        <h2 className={`text-base font-semibold ${
          theme === "light" ? "text-gray-900" : "text-white"
        }`}>{post.title}</h2>
        <div className={`mt-1 flex items-center gap-2 text-xs ${
          theme === "light" ? "text-gray-500" : "text-slate-400"
        }`}>
          <span>by {post.author}</span>
          <span>•</span>
          <span>{post.createdAt}</span>
        </div>
      </header>

      <p className={`mb-3 text-sm ${
        theme === "light" ? "text-gray-600" : "text-slate-300"
      }`}>{post.excerpt}</p>

      {/* Footer: likes + comments */}
      <div className="flex items-center gap-4 text-xs">
        <button
          type="button"
          onClick={() => onToggleLike(post.id)}
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 transition-colors ${
            theme === "light"
              ? "border-gray-200 hover:bg-gray-100"
              : "border-slate-700 hover:bg-slate-800"
          }`}
        >
          <span className={post.youLiked ? "text-red-500" : ""}>{likeIcon}</span>
          <span>{post.likeCount}</span>
        </button>

        <button
          type="button"
          onClick={() => onToggleComments(post.id)}
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 transition-colors ${
            theme === "light"
              ? "border-gray-200 text-gray-600 hover:bg-gray-100"
              : "border-slate-700 text-slate-400 hover:bg-slate-800"
          }`}
        >
          <span>💬</span>
          <span>{post.commentCount}</span>
          <span>{commentsOpen ? "Hide" : "View"} comments</span>
        </button>
      </div>

      {/* Comments section */}
      {commentsOpen && (
        <div className={`mt-3 space-y-3 border-t pt-3 ${
          theme === "light" ? "border-gray-200" : "border-slate-800"
        }`}>
          <div className="space-y-2">
            {post.comments.length === 0 && (
              <p className={`text-xs ${
                theme === "light" ? "text-gray-500" : "text-slate-400"
              }`}>
                No comments yet. Start the conversation.
              </p>
            )}
            {post.comments.map((comment) => (
              <div
                key={comment.id}
                className={`rounded-md px-2 py-1.5 ${
                  theme === "light" ? "bg-gray-100" : "bg-slate-800/60"
                }`}
              >
                <div className={`flex items-center justify-between text-[11px] ${
                  theme === "light" ? "text-gray-500" : "text-slate-400"
                }`}>
                  <span className="font-medium">{comment.author}</span>
                  <span>{comment.createdAt}</span>
                </div>
                <p className={`mt-1 text-xs ${
                  theme === "light" ? "text-gray-700" : "text-slate-300"
                }`}>{comment.content}</p>
              </div>
            ))}
          </div>

          {/* Add comment */}
          <form onSubmit={handleSubmitComment} className="space-y-1">
            <textarea
              value={draftComment}
              onChange={(e) => setDraftComment(e.target.value)}
              rows={2}
              placeholder="Write a comment..."
              className={`w-full resize-none rounded-md border px-2 py-1 text-xs focus:outline-none focus:ring-2 transition-colors ${
                theme === "light"
                  ? "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  : "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:ring-blue-600 focus:border-blue-600"
              }`}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  theme === "light"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-700 hover:bg-blue-800 text-white"
                }`}
              >
                Post comment
              </button>
            </div>
          </form>
        </div>
      )}
    </article>
  );
}
