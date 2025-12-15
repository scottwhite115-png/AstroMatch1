"use client";

import { useState, useRef } from "react";
import { PostList, type PostListRef } from "../../_components/PostList";
import { NewPostButton } from "../../_components/NewPostButton";

type CommunityTopicClientProps = {
  topic: string;
  metadata: { label: string; description: string; icon: string };
};

export function CommunityTopicClient({ topic, metadata }: CommunityTopicClientProps) {
  const postListRef = useRef<PostListRef>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePostCreated = () => {
    // Trigger refresh by updating key
    setRefreshKey((prev) => prev + 1);
    // Also call refresh method if ref is available
    postListRef.current?.refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-6">
        <header className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-slate-50 flex items-center gap-2">
              <span>{metadata.icon}</span>
              <span>{metadata.label}</span>
            </h1>
          </div>
          <NewPostButton
            topic={topic}
            topicLabel={metadata.label}
            onPostCreated={handlePostCreated}
          />
        </header>

        {/* Client-side list */}
        <PostList ref={postListRef} topic={topic} refreshKey={refreshKey} />
      </div>
    </div>
  );
}

