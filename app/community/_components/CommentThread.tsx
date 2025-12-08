"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { LikeButton } from "./LikeButton";
import { ReplyForm } from "./ReplyForm";
import Link from "next/link";

type Author = {
  id: string;
  displayName: string;
  westSign: string;
  chineseSign: string;
  eastWestCode: string;
};

type Comment = {
  id: string;
  content: string;
  authorId: string;
  createdAt: string;
  parentId: string | null;
  likeCount: number;
  author: Author;
  replies: Comment[];
};

type CommentThreadProps = {
  postId: string;
  currentUser: any; // Profile or null
};

export function CommentThread({ postId, currentUser }: CommentThreadProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/community/posts/${postId}/comments`);

      if (!res.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data = await res.json();
      setComments(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleReplySuccess = () => {
    setReplyingTo(null);
    fetchComments();
  };

  if (loading) {
    return (
      <p className="text-sm text-slate-400">Loading comments...</p>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-rose-400">{error}</p>
    );
  }

  if (comments.length === 0) {
    return (
      <p className="text-sm text-slate-400">
        No comments yet. Be the first to reply!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          currentUser={currentUser}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          onReplySuccess={handleReplySuccess}
        />
      ))}
    </div>
  );
}

type CommentItemProps = {
  comment: Comment;
  postId: string;
  currentUser: any;
  replyingTo: string | null;
  setReplyingTo: (id: string | null) => void;
  onReplySuccess: () => void;
};

function CommentItem({
  comment,
  postId,
  currentUser,
  replyingTo,
  setReplyingTo,
  onReplySuccess,
}: CommentItemProps) {
  return (
    <div>
      {/* Main Comment */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {/* East-West Pill */}
              {comment.author.eastWestCode && (
                <div className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950/60 px-2 py-0.5 text-[10px] font-medium text-slate-200">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-800 text-[9px]">
                    {comment.author.westSign?.[0] || "?"}
                  </span>
                  <span className="truncate max-w-[100px]">
                    {comment.author.eastWestCode}
                  </span>
                </div>
              )}

              {/* Author name */}
              <span className="text-xs font-semibold text-slate-300">
                {comment.author.displayName}
              </span>

              {/* Time */}
              <span className="text-xs text-slate-500">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm text-slate-300 whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-3 flex items-center gap-4">
          {currentUser ? (
            <button
              type="button"
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className="text-xs text-slate-400 hover:text-slate-300 transition-colors"
            >
              Reply
            </button>
          ) : (
            <Link href="/login" className="text-xs text-slate-400 hover:text-emerald-400 transition-colors">
              Log in to reply
            </Link>
          )}
          <LikeButton
            commentId={comment.id}
            initialCount={comment.likeCount}
            disabled={!currentUser}
          />
        </div>

        {/* Reply Form */}
        {currentUser && replyingTo === comment.id && (
          <div className="mt-3 pt-3 border-t border-slate-800">
            <ReplyForm
              postId={postId}
              parentId={comment.id}
              onSuccess={onReplySuccess}
              onCancel={() => setReplyingTo(null)}
            />
          </div>
        )}
      </div>

      {/* Replies (1 level) */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 ml-6 space-y-3 pl-4 border-l-2 border-slate-800">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="rounded-xl border border-slate-800 bg-slate-900/30 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {/* East-West Pill for reply */}
                    {reply.author.eastWestCode && (
                      <div className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950/60 px-2 py-0.5 text-[10px] font-medium text-slate-200">
                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-800 text-[9px]">
                          {reply.author.westSign?.[0] || "?"}
                        </span>
                        <span className="truncate max-w-[100px]">
                          {reply.author.eastWestCode}
                        </span>
                      </div>
                    )}

                    {/* Author name */}
                    <span className="text-xs font-semibold text-slate-300">
                      {reply.author.displayName}
                    </span>

                    {/* Time */}
                    <span className="text-xs text-slate-500">
                      {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 whitespace-pre-wrap">
                    {reply.content}
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <LikeButton
                  commentId={reply.id}
                  initialCount={reply.likeCount}
                  disabled={!currentUser}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

