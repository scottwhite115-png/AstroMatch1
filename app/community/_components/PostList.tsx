"use client";

import { useEffect, useState, useImperativeHandle, forwardRef } from "react";

type Post = {
  id: string;
  title: string;
  content: string;
  topic: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
};

type PostListProps = {
  topic: string;
  refreshKey?: number;
};

export type PostListRef = {
  refresh: () => void;
};

export const PostList = forwardRef<PostListRef, PostListProps>(
  ({ topic, refreshKey }, ref) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/community/posts?topic=${encodeURIComponent(topic)}`);
        
        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }
        
        const data = await res.json();
        setPosts(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message ?? "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    useImperativeHandle(ref, () => ({
      refresh: fetchPosts,
    }));

    useEffect(() => {
      fetchPosts();
    }, [topic, refreshKey]);

    if (loading) {
      return (
        <p className="mt-4 text-sm text-slate-400">
          Loading posts...
        </p>
      );
    }

    if (error) {
      return (
        <p className="mt-4 text-sm text-rose-400">
          {error}
        </p>
      );
    }

    if (posts.length === 0) {
      return (
        <p className="mt-4 text-sm text-slate-400">
          No posts yet. Be the first to start the conversation.
        </p>
      );
    }

    return (
      <div className="mt-4 space-y-3">
        {posts.map((post) => (
          <article
            key={post.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm hover:border-slate-700 transition-colors"
          >
            <h3 className="text-sm font-semibold text-slate-50">
              {post.title}
            </h3>
            <p className="mt-1 text-xs text-slate-300 whitespace-pre-wrap">
              {post.content}
            </p>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>
                by {post.authorId.slice(0, 8)}...
              </span>
              <span>
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
          </article>
        ))}
      </div>
    );
  }
);

PostList.displayName = "PostList";
