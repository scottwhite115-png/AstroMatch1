// app/community/topics.ts

export type CommunityTopicId =
  | "general-astrology"
  | "sun-signs"
  | "chinese-astrology"
  | "vedic-astrology"
  | "compatibility-and-synastry"
  | "astromatch-feedback";

export type CommunityTopic = {
  id: CommunityTopicId;
  label: string;
  hashtag: string;      // for UI, e.g. #general-astrology
  description: string;
  icon: string;         // emoji icon for UI
};

export const COMMUNITY_TOPICS: CommunityTopic[] = [
  {
    id: "general-astrology",
    label: "General Astrology",
    hashtag: "#general-astrology",
    description: "Open chats about charts, transits, houses, and anything astro-curious.",
    icon: "🌟",
  },
  {
    id: "sun-signs",
    label: "Sun Signs",
    hashtag: "#sun-signs",
    description: "Discuss Sun sign traits, memes, myths, and how they show up in real life.",
    icon: "☀️",
  },
  {
    id: "chinese-astrology",
    label: "Chinese Astrology",
    hashtag: "#chinese-astrology",
    description: "Animal signs, trines, elements, luck cycles, and old-school wisdom.",
    icon: "🐉",
  },
  {
    id: "vedic-astrology",
    label: "Vedic Astrology",
    hashtag: "#vedic-astrology",
    description: "Nakshatras, dashas, divisional charts, and Jyotish insights.",
    icon: "🕉️",
  },
  {
    id: "compatibility-and-synastry",
    label: "Compatibility & Synastry",
    hashtag: "#compatibility-and-synastry",
    description: "Share charts, compare matches, and talk relationship chemistry.",
    icon: "💫",
  },
  {
    id: "astromatch-feedback",
    label: "AstroMatch Feedback",
    hashtag: "#astromatch-feedback",
    description: "Ideas, bugs, feature requests, and reviews of the AstroMatch experience.",
    icon: "💬",
  },
];

// Helper to get topic by ID
export function getTopicById(id: string): CommunityTopic | undefined {
  return COMMUNITY_TOPICS.find((topic) => topic.id === id);
}

// Helper to check if topic ID is valid
export function isValidTopicId(id: string): id is CommunityTopicId {
  return COMMUNITY_TOPICS.some((topic) => topic.id === id);
}

