import prisma from "@/lib/prisma";
import { PostCardClient } from "./PostCardClient";
import { getCurrentUserProfile } from "@/lib/currentProfile";

type PostListProps = {
  topic: string;
};

export async function PostList({ topic }: PostListProps) {
  // Check if DATABASE_URL is configured
  if (!process.env.DATABASE_URL) {
    console.error('[PostList] DATABASE_URL not configured');
    return (
      <div className="mt-4 rounded-xl border border-amber-800 bg-amber-950/20 p-4">
        <p className="text-sm text-amber-400">
          Database is not configured. Posts cannot be loaded.
        </p>
        <p className="mt-2 text-xs text-amber-300">
          Please configure DATABASE_URL in your environment variables.
        </p>
      </div>
    );
  }

  try {
    // Add timeout wrapper to prevent infinite hanging
    const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
      return Promise.race([
        promise,
        new Promise<T>((_, reject) => 
          setTimeout(() => reject(new Error('Database query timeout')), timeoutMs)
        ),
      ]);
    };

    let posts: any[] = [];
    let currentUserProfile: any = null;

    try {
      const result = await withTimeout(
        Promise.all([
          getCurrentUserProfile().catch(() => null),
          prisma.post.findMany({
            where: { topic },
            orderBy: { createdAt: "desc" },
            take: 50,
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
          }),
        ]),
        5000
      );
      currentUserProfile = result[0];
      posts = result[1];
    } catch (err) {
      console.error('[PostList] Database query failed or timed out:', err);
      // Return empty state instead of crashing
      return (
        <div className="mt-4 rounded-xl border border-amber-800 bg-amber-950/20 p-4">
          <p className="text-sm text-amber-400">
            Unable to load posts. The database connection may be unavailable.
          </p>
          <p className="mt-2 text-xs text-amber-300">
            Please check your connection and try again.
          </p>
        </div>
      );
    }

    // Format posts with author data
    const formattedPosts = posts.map((post: any) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt.toISOString(),
      topic: post.topic,
      likeCount: post.likeCount || 0,
      commentCount: post.commentCount || 0,
      author: {
        id: post.author?.id || post.authorId,
        displayName: post.author?.display_name ?? "Anonymous",
        westSign: post.author?.western_sign ?? "",
        chineseSign: post.author?.chinese_sign ?? "",
        eastWestCode: post.author?.east_west_code ?? 
          (post.author?.western_sign && post.author?.chinese_sign 
            ? `${post.author.western_sign} ${post.author.chinese_sign}`.trim()
            : ""),
      },
    }));

    if (formattedPosts.length === 0) {
      return (
        <p className="mt-4 text-sm text-slate-400">
          No posts yet. Be the first to start the conversation.
        </p>
      );
    }

    return (
      <div className="mt-4 space-y-3">
        {formattedPosts.map((post) => (
          <PostCardClient
            key={post.id}
            post={post}
            currentUserProfile={
              currentUserProfile
                ? {
                    id: currentUserProfile.id,
                    displayName: currentUserProfile.displayName ?? "You",
                    westSign: currentUserProfile.westSign ?? "",
                    chineseSign: currentUserProfile.chineseSign ?? "",
                    eastWestCode: currentUserProfile.eastWestCode ?? `${currentUserProfile.westSign ?? ""} ${currentUserProfile.chineseSign ?? ""}`.trim() || "",
                  }
                : null
            }
          />
        ))}
      </div>
    );
  } catch (error) {
    console.error("[PostList] Error:", error);
    return (
      <div className="mt-4 rounded-xl border border-rose-800 bg-rose-950/20 p-4">
        <p className="text-sm text-rose-400">
          Error loading posts. Please try refreshing the page.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <p className="mt-2 text-xs text-rose-300">
            {error instanceof Error ? error.message : String(error)}
          </p>
        )}
      </div>
    );
  }
}
