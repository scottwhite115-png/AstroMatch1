import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { CommentThread } from "../../_components/CommentThread";
import { NewCommentForm } from "../../_components/NewCommentForm";
import { getCurrentUserProfile } from "@/lib/currentProfile";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { isValidTopicId, getTopicById } from "../../topics";

type PageProps = {
  params: Promise<{ topic: string; postId: string }>;
};

export default async function PostPage({ params }: PageProps) {
  const { topic, postId } = await params;

  // Validate topic
  if (!isValidTopicId(topic)) {
    return notFound();
  }

  const topicInfo = getTopicById(topic);

  // Fetch post with author info
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: {
        select: {
          id: true,
          display_name: true,
          western_sign: true,
          chinese_sign: true,
          east_west_code: true,
        },
      },
    },
  });

  if (!post || post.topic !== topic) {
    redirect(`/community/${topic}`);
  }

  // Get current user profile for auth checks
  const currentUser = await getCurrentUserProfile().catch(() => null);

  return (
    <div>
      {/* Back link */}
      <Link
        href={`/community/${topic}`}
        className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-300 mb-4"
      >
        ← Back to {topicInfo?.label || topic.replace(/-/g, " ")}
      </Link>

      {/* Post */}
      <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm mb-6">
        {/* Topic tag */}
        <div className="mb-3">
          <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
            {topicInfo?.icon} {topicInfo?.hashtag || `#${topic}`}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold text-slate-50 mb-3">{post.title}</h1>

        {/* Author info with East-West pill */}
        <div className="mb-4 flex items-center gap-2">
          <div className="flex items-center gap-2">
            {/* East-West Pill */}
            {post.author.east_west_code && (
              <div className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950/60 px-2 py-1 text-[11px] font-medium text-slate-200">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[10px]">
                  {post.author.western_sign?.[0] || "?"}
                </span>
                <span className="truncate max-w-[120px]">
                  {post.author.east_west_code}
                </span>
              </div>
            )}
            
            {/* Display name */}
            <span className="text-sm font-semibold text-slate-300">
              {post.author.display_name || "Anonymous"}
            </span>
            
            {/* Time posted */}
            <span className="text-xs text-slate-500">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-sm max-w-none">
          <p className="text-slate-300 whitespace-pre-wrap">{post.content}</p>
        </div>

        {/* Stats */}
        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
          {post.commentCount > 0 && (
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {post.commentCount} {post.commentCount === 1 ? 'reply' : 'replies'}
            </span>
          )}
          {post.likeCount > 0 && (
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {post.likeCount} {post.likeCount === 1 ? 'like' : 'likes'}
            </span>
          )}
        </div>
      </article>

      {/* Reply section */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-slate-50 mb-4">
          Discussion
        </h2>

        {currentUser ? (
          <div className="mb-6">
            <NewCommentForm postId={postId} />
          </div>
        ) : (
          <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <p className="text-sm text-slate-400 text-center">
              <Link href="/login" className="text-emerald-400 hover:text-emerald-300 underline">
                Log in
              </Link>
              {" "}to join the discussion
            </p>
          </div>
        )}

        {/* Comments */}
        <CommentThread postId={postId} currentUser={currentUser} />
      </div>
    </div>
  );
}

