"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { NewPostButton } from "../../_components/NewPostButton";
import type { CommunityTopic } from "../../topics";

type TopicHeadingProps = {
  topic: CommunityTopic;
};

export function TopicHeading({ topic }: TopicHeadingProps) {
  const { theme } = useTheme();

  return (
    <div className="flex items-center justify-between gap-2 sm:gap-3 min-w-0">
      <div className="min-w-0 flex-1">
        <h2 className={`text-sm font-semibold ${
          theme === "light" ? "text-gray-900" : "text-slate-50"
        }`}>
          {topic.hashtag}
        </h2>
        <p className={`text-xs ${
          theme === "light" ? "text-gray-600" : "text-slate-400"
        }`}>
          {topic.description}
        </p>
      </div>
      <div className="flex-shrink-0">
        <NewPostButton topic={topic.id} />
      </div>
    </div>
  );
}

