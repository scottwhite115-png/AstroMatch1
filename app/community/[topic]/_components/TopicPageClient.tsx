"use client";

import { useState } from "react";
import { NewPostButton } from "../../_components/NewPostButton";
import { PostList } from "../../_components/PostList";

type TopicPageClientProps = {
  topic: string;
  topicLabel: string;
  description: string;
  icon: string;
};

export function TopicPageClient({
  topic,
  topicLabel,
  description,
  icon,
}: TopicPageClientProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePostCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div>
      {/* Header with topic info and New Post button */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{icon}</span>
            <h2 className="text-xl font-bold text-slate-50">{topicLabel}</h2>
          </div>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
        <NewPostButton
          topic={topic}
          topicLabel={topicLabel}
          onPostCreated={handlePostCreated}
        />
      </div>

      {/* Post List */}
      <PostList topic={topic} refreshKey={refreshKey} />
    </div>
  );
}

