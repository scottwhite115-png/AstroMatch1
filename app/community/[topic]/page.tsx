import { redirect } from "next/navigation";
import { CommunityTopicClient } from "./_components/CommunityTopicClient";

type PageProps = {
  params: Promise<{ topic: string }>;
};

// Topic metadata mapping
const TOPIC_METADATA: Record<string, { label: string; description: string; icon: string }> = {
  relationship: {
    label: "Relationship",
    description: "Synastry, East × West patterns and how connections feel in real life.",
    icon: "❌",
  },
  sun_signs: {
    label: "Tropical Sun Signs",
    description: "Posts about Western Sun signs, elements and aspects.",
    icon: "☀️",
  },
  chinese_zodiac: {
    label: "Chinese Zodiac",
    description: "Animals, trines, San He / Liu He, elements and years.",
    icon: "🐉",
  },
  vedic: {
    label: "Vedic Astrology",
    description: "Moon signs, dashas and Jyotiṣa techniques.",
    icon: "🕉️",
  },
  qa: {
    label: "Questions & Answers",
    description: "Ask and answer specific astrology questions.",
    icon: "❓",
  },
};

export default async function CommunityTopicPage({ params }: PageProps) {
  const { topic } = await params;
  
  // Validate topic exists
  if (!TOPIC_METADATA[topic]) {
    redirect("/community/relationship");
  }

  const metadata = TOPIC_METADATA[topic];

  return <CommunityTopicClient topic={topic} metadata={metadata} />;
}
