import prisma from "@/lib/prisma";
import { PostCardClient } from "./PostCardClient";
import { getCurrentUserProfile } from "@/lib/currentProfile";

type PostListProps = {
  topic: string;
};

export async function PostList({ topic }: PostListProps) {
  try {
    const [currentUserProfile, posts] = await Promise.all([
      getCurrentUserProfile().catch(() => null),
      prisma.post.findMany({
        where: { topic },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    ]);

    // Fetch authors separately to avoid relation issues
    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        try {
          const author = await prisma.profiles.findUnique({
            where: { id: post.authorId },
            select: {
              id: true,
              display_name: true,
              western_sign: true,
              chinese_sign: true,
              east_west_code: true,
            },
          });
          return { ...post, author };
        } catch (error) {
          console.error(`[PostList] Error fetching author for post ${post.id}:`, error);
          return {
            ...post,
            author: {
              id: post.authorId,
              display_name: null,
              western_sign: null,
              chinese_sign: null,
              east_west_code: null,
            },
          };
        }
      })
    );

    // Map posts with author data
    const formattedPosts = postsWithAuthors.map((post: any) => ({
      ...post,
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
            post={{
              id: post.id,
              title: post.title,
              content: post.content,
              createdAt: post.createdAt.toISOString(),
              topic: post.topic,
              author: post.author,
            }}
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
