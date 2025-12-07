import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { CommentThread } from "../../_components/CommentThread";
import { NewCommentForm } from "../../_components/NewCommentForm";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

type PageProps = {
  params: Promise<{ topic: string; postId: string }>;
};

export default async function PostPage({ params }: PageProps) {
  const { topic, postId } = await params;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
    },
  });

  if (!post || post.topic !== topic) {
    redirect(`/community/${topic}`);
  }

  return (
    <div>
      {/* Back link */}
      <Link
        href={`/community/${topic}`}
        className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-300 mb-4"
      >
        ← Back to {topic.replace(/-/g, " ")}
      </Link>

      {/* Post */}
      <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm mb-6">
        <h1 className="text-xl font-bold text-slate-50 mb-3">{post.title}</h1>
        <div className="prose prose-invert prose-sm max-w-none">
          <p className="text-slate-300 whitespace-pre-wrap">{post.content}</p>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>
            Posted {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </span>
          <div className="flex items-center gap-3">
            <span>{post._count.comments} {post._count.comments === 1 ? 'reply' : 'replies'}</span>
            {post._count.likes > 0 && (
              <span>{post._count.likes} {post._count.likes === 1 ? 'like' : 'likes'}</span>
            )}
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-slate-50 mb-4">
          Discussion
        </h2>
        <CommentThread postId={postId} />
        <div className="mt-6">
          <NewCommentForm postId={postId} />
        </div>
      </div>
    </div>
  );
}

