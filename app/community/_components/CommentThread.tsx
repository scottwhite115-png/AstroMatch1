"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { LikeButton } from "./LikeButton";
import { ReplyForm } from "./ReplyForm";

type Comment = {
  id: string;
  content: string;
  authorId: string;
  createdAt: string;
  parentId: string | null;
  _count: {
    likes: number;
  };
  replies: Comment[];
};

type CommentThreadProps = {
  postId: string;
};

export function CommentThread({ postId }: CommentThreadProps) {
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
  replyingTo: string | null;
  setReplyingTo: (id: string | null) => void;
  onReplySuccess: () => void;
};

function CommentItem({
  comment,
  postId,
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
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-300">
                {comment.authorId.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-xs text-slate-400">
                {comment.authorId.slice(0, 8)}...
              </span>
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
          <button
            type="button"
            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
            className="text-xs text-slate-400 hover:text-slate-300 transition-colors"
          >
            Reply
          </button>
          <LikeButton commentId={comment.id} initialCount={comment._count.likes} />
        </div>

        {/* Reply Form */}
        {replyingTo === comment.id && (
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
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-slate-300">
                      {reply.authorId.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs text-slate-400">
                      {reply.authorId.slice(0, 8)}...
                    </span>
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
                <LikeButton commentId={reply.id} initialCount={reply._count.likes} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

