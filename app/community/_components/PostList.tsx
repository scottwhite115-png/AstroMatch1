import { PostCardClient } from "./PostCardClient";
import { getCurrentUserProfile } from "@/lib/currentProfile";
import { getCurrentProfileWithRole } from "@/lib/auth-helpers";
import { getAllBlockedRelationships } from "@/lib/utils/block-helpers";

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

  // Check if Prisma client is available
  let prismaClient;
  try {
    prismaClient = await import('@/lib/prisma').then(m => m.default || m.prisma);
  } catch (error) {
    console.error('[PostList] Prisma client not available:', error);
    return (
      <div className="mt-4 rounded-xl border border-amber-800 bg-amber-950/20 p-4">
        <p className="text-sm text-amber-400">
          Database client not initialized. Please run: npx prisma generate
        </p>
        <p className="mt-2 text-xs text-amber-300">
          Error: {error instanceof Error ? error.message : String(error)}
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
    let canModerate = false;

    try {
      // Get current user and their role (for moderation)
      const viewer = await getCurrentProfileWithRole();
      canModerate = viewer && (viewer.role === "ADMIN" || viewer.role === "OWNER");

      // Get all blocked relationships (both directions)
      let blockedUserIds: string[] = [];
      if (viewer) {
        const { all } = await getAllBlockedRelationships(viewer.id);
        blockedUserIds = all;
      }

      // Build where clause
      const whereClause: any = { topic };
      
      // Filter hidden posts for non-staff
      if (!canModerate) {
        whereClause.isHidden = false;
      }

      // Exclude blocked users (both who viewer blocked and who blocked viewer)
      if (blockedUserIds.length > 0) {
        whereClause.authorId = {
          notIn: blockedUserIds
        };
      }

      if (!prismaClient) {
        throw new Error('Prisma client not available. Please run: npx prisma generate');
      }

      const result = await withTimeout(
        Promise.all([
          getCurrentUserProfile().catch(() => null),
          prismaClient.post.findMany({
            where: whereClause,
            // Sort by score (upvotes - downvotes) descending, then by createdAt
            orderBy: [
              { upvoteCount: "desc" },
              { createdAt: "desc" },
            ],
            take: 50,
            include: {
              author: {
                select: {
                  id: true,
                  display_name: true,
                  western_sign: true,
                  chinese_sign: true,
                },
              },
            },
          }),
        ]),
        5000
      );
      currentUserProfile = result[0];
      posts = result[1];
    } catch (err: any) {
      console.error('[PostList] Database query failed or timed out:', err);
      // Return error state with more details in development
      const errorMessage = err?.message || 'Unknown error';
      const errorCode = err?.code || 'UNKNOWN';
      return (
        <div className="mt-4 rounded-xl border border-amber-800 bg-amber-950/20 p-4">
          <p className="text-sm text-amber-400">
            Unable to load posts. The database connection may be unavailable.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <>
          <p className="mt-2 text-xs text-amber-300">
                Error: {errorCode} - {errorMessage}
              </p>
              <p className="mt-1 text-xs text-amber-300">
                Check your DATABASE_URL in .env.local
          </p>
            </>
          )}
        </div>
      );
    }

    // Format posts with author data
    const formattedPosts = posts.map((post: any) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      topic: post.topic,
      type: post.type, // Add type field
      createdAt: post.createdAt.toISOString(),
      likeCount: post.likeCount || 0,
      upvoteCount: post.upvoteCount || 0,
      downvoteCount: post.downvoteCount || 0,
      commentCount: post.commentCount || 0,
      author: {
        id: post.author?.id || post.authorId,
        displayName: post.author?.display_name ?? "Anonymous",
        westSign: post.author?.western_sign ?? "",
        chineseSign: post.author?.chinese_sign ?? "",
        eastWestCode: (post.author?.western_sign && post.author?.chinese_sign
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
      <div className="space-y-0">
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
                    eastWestCode: currentUserProfile.eastWestCode ?? ((`${currentUserProfile.westSign ?? ""} ${currentUserProfile.chineseSign ?? ""}`).trim() || ""),
                  }
                : null
            }
            canModerate={canModerate}
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
