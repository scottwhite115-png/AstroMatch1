import { COMMUNITY_TOPICS } from "../topics";
import { notFound } from "next/navigation";
import { PostList } from "../_components/PostList";
import { NewPostButton } from "../_components/NewPostButton";

export default async function TopicPage({ 
  params 
}: { 
  params: Promise<{ topic: string }> 
}) {
  try {
    const { topic: topicId } = await params;
    const topic = COMMUNITY_TOPICS.find((t) => t.id === topicId);
    if (!topic) return notFound();

    return (
      <div className="mt-2 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-50">
              {topic.hashtag}
            </h2>
            <p className="text-xs text-slate-400">{topic.description}</p>
          </div>
          <NewPostButton topic={topic.id} />
        </div>

        <PostList topic={topic.id} />
      </div>
    );
  } catch (error) {
    console.error("[TopicPage] Error:", error);
    return (
      <div className="mt-4 rounded-xl border border-rose-800 bg-rose-950/20 p-4">
        <p className="text-sm text-rose-400">
          Error loading page. Please try refreshing.
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
