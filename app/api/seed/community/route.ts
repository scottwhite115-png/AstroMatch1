import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { COMMUNITY_TOPICS } from "@/app/community/topics";

// Test profiles with different astrological signs
const TEST_PROFILES = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    display_name: "Luna Starweaver",
    western_sign: "Pisces",
    chinese_sign: "Dragon",
    east_west_code: "Pisces Dragon",
    email: "luna@test.com",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    display_name: "Cosmic Sage",
    western_sign: "Aquarius",
    chinese_sign: "Rabbit",
    east_west_code: "Aquarius Rabbit",
    email: "cosmic@test.com",
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    display_name: "Stellar Navigator",
    western_sign: "Leo",
    chinese_sign: "Tiger",
    east_west_code: "Leo Tiger",
    email: "stellar@test.com",
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    display_name: "Nebula Dreamer",
    western_sign: "Cancer",
    chinese_sign: "Snake",
    east_west_code: "Cancer Snake",
    email: "nebula@test.com",
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    display_name: "Astral Wanderer",
    western_sign: "Sagittarius",
    chinese_sign: "Horse",
    east_west_code: "Sagittarius Horse",
    email: "astral@test.com",
  },
];

// Test posts across all topics
const TEST_POSTS = [
  // General Astrology
  {
    topic: "general-astrology",
    title: "What's the difference between sidereal and tropical astrology?",
    content: `I've been studying astrology for a while, but I'm still confused about the two main systems. Can someone explain the key differences between sidereal (Vedic) and tropical (Western) astrology? 

I know tropical uses the seasons and sidereal uses fixed stars, but how does this affect chart interpretations? Would love to hear from practitioners of both systems!`,
    authorIndex: 0,
  },
  {
    topic: "general-astrology",
    title: "How do you read a birth chart for beginners?",
    content: `New to astrology and feeling overwhelmed by all the symbols and houses. Where should I start? 

I've got my chart but don't know what to focus on first. Sun sign? Moon? Rising? Any tips for a complete beginner?`,
    authorIndex: 1,
  },
  {
    topic: "general-astrology",
    title: "Transits vs Progressions - which is more important?",
    content: `I keep hearing about transits and progressions but I'm not sure which to prioritize when looking at timing. 

Some astrologers say transits are more immediate, others say progressions show deeper life changes. What's your experience?`,
    authorIndex: 2,
  },

  // Sun Signs
  {
    topic: "sun-signs",
    title: "Pisces season is here! What are you feeling?",
    content: `As a Pisces, I always feel more energized during my season. The water energy is flowing and I'm more intuitive than usual.

Anyone else experiencing heightened sensitivity or creativity right now?`,
    authorIndex: 0,
  },
  {
    topic: "sun-signs",
    title: "Do you actually relate to your Sun sign?",
    content: `I'm a Leo but I don't feel very "Leo-like" - I'm actually quite introverted and don't love being the center of attention.

Is it normal to not fully identify with your Sun sign? Maybe my Moon or Rising is more dominant?`,
    authorIndex: 2,
  },
  {
    topic: "sun-signs",
    title: "Best Sun sign combinations for friendship?",
    content: `I've noticed I get along best with Air signs (I'm an Aquarius). There's just something about that intellectual connection.

What Sun sign combinations do you find work best for different types of relationships?`,
    authorIndex: 1,
  },

  // Chinese Astrology
  {
    topic: "chinese-astrology",
    title: "Year of the Dragon 2024 - what to expect?",
    content: `The Year of the Dragon is supposed to be powerful and transformative. As a Dragon myself, I'm curious what others are experiencing.

Are you feeling the Dragon energy? Any major life changes happening?`,
    authorIndex: 0,
  },
  {
    topic: "chinese-astrology",
    title: "How do the five elements work in Chinese astrology?",
    content: `I understand the 12 animal signs, but the five elements (Wood, Fire, Earth, Metal, Water) are confusing me.

How do they interact with the animal signs? Does your element change your personality traits?`,
    authorIndex: 3,
  },
  {
    topic: "chinese-astrology",
    title: "Rabbit sign compatibility - who do Rabbits get along with?",
    content: `As a Rabbit, I'm curious about compatibility. I've heard we get along well with Goats and Pigs, but clash with Roosters.

What's your experience with Rabbit relationships?`,
    authorIndex: 1,
  },

  // Vedic Astrology
  {
    topic: "vedic-astrology",
    title: "Nakshatras - where do I start?",
    content: `I'm diving into Vedic astrology and the nakshatras are fascinating but overwhelming. There are 27 of them!

Which nakshatras should I learn first? Are some more important than others?`,
    authorIndex: 4,
  },
  {
    topic: "vedic-astrology",
    title: "Dasha periods - how do they work?",
    content: `My Vedic chart shows I'm in a Jupiter dasha period. What does this actually mean for my life?

How do you interpret dasha periods? Do they override transits?`,
    authorIndex: 3,
  },

  // Compatibility & Synastry
  {
    topic: "compatibility-and-synastry",
    title: "Synastry chart analysis - what aspects matter most?",
    content: `I'm comparing charts with someone I'm dating. There are so many aspects to look at!

What synastry aspects do you prioritize? Conjunctions? Trines? Composite charts?`,
    authorIndex: 2,
  },
  {
    topic: "compatibility-and-synastry",
    title: "Venus-Mars aspects in synastry",
    content: `I've heard Venus-Mars aspects are crucial for romantic compatibility. My Venus is trine their Mars - is that good?

What do different Venus-Mars aspects mean for attraction and chemistry?`,
    authorIndex: 0,
  },
  {
    topic: "compatibility-and-synastry",
    title: "Composite vs Synastry - which is more accurate?",
    content: `I've been studying both composite and synastry charts for my relationship. They tell different stories!

Which do you find more accurate for predicting relationship dynamics?`,
    authorIndex: 4,
  },

  // AstroMatch Feedback
  {
    topic: "astromatch-feedback",
    title: "Love the East-West compatibility feature!",
    content: `Just wanted to say how much I appreciate the fusion of Western and Chinese astrology here. It's so unique!

The compatibility scores feel really accurate. Great work on this app!`,
    authorIndex: 1,
  },
  {
    topic: "astromatch-feedback",
    title: "Feature request: Vedic astrology integration",
    content: `Would love to see Vedic astrology added to the matching system. Nakshatras and dashas could add another layer of depth.

Anyone else interested in this?`,
    authorIndex: 4,
  },
  {
    topic: "astromatch-feedback",
    title: "Bug report: Connection box not loading",
    content: `I'm having trouble viewing connection boxes on some profiles. The page just spins forever.

Is anyone else experiencing this? Happens on both mobile and desktop.`,
    authorIndex: 3,
  },
];

export async function GET(req: Request) {
  // Allow GET for easy browser access
  return POST(req);
}

export async function POST(req: Request) {
  try {
    // Check if we should clear existing test data first
    const { clear = false } = await req.json().catch(() => ({ clear: false }));

    if (clear) {
      // Delete test posts and their related data
      await prisma.commentLike.deleteMany({
        where: {
          comment: {
            post: {
              authorId: { in: TEST_PROFILES.map((p) => p.id) },
            },
          },
        },
      });
      await prisma.comment.deleteMany({
        where: {
          post: {
            authorId: { in: TEST_PROFILES.map((p) => p.id) },
          },
        },
      });
      await prisma.postLike.deleteMany({
        where: {
          post: {
            authorId: { in: TEST_PROFILES.map((p) => p.id) },
          },
        },
      });
      await prisma.post.deleteMany({
        where: {
          authorId: { in: TEST_PROFILES.map((p) => p.id) },
        },
      });
    }

    // Upsert test profiles
    const profiles = await Promise.all(
      TEST_PROFILES.map((profile) =>
        prisma.profiles.upsert({
          where: { id: profile.id },
          update: {
            display_name: profile.display_name,
            western_sign: profile.western_sign,
            chinese_sign: profile.chinese_sign,
            east_west_code: profile.east_west_code,
            email: profile.email,
          },
          create: {
            id: profile.id,
            display_name: profile.display_name,
            western_sign: profile.western_sign,
            chinese_sign: profile.chinese_sign,
            east_west_code: profile.east_west_code,
            email: profile.email,
            email_verified: false,
            phone_verified: false,
          },
        })
      )
    );

    // Create posts
    const posts = await Promise.all(
      TEST_POSTS.map((postData, index) =>
        prisma.post.create({
          data: {
            title: postData.title,
            content: postData.content,
            topic: postData.topic,
            authorId: profiles[postData.authorIndex].id,
            likeCount: Math.floor(Math.random() * 5), // Random likes 0-4
            commentCount: 0, // Will be updated when we add comments
            createdAt: new Date(Date.now() - index * 3600000), // Stagger posts by 1 hour
          },
        })
      )
    );

    // Add some comments to random posts
    const comments = [];
    for (let i = 0; i < 8; i++) {
      const randomPost = posts[Math.floor(Math.random() * posts.length)];
      const randomAuthor = profiles[Math.floor(Math.random() * profiles.length)];

      // Skip if author is the post author (to avoid self-replies)
      if (randomAuthor.id === randomPost.authorId) continue;

      const comment = await prisma.comment.create({
        data: {
          postId: randomPost.id,
          authorId: randomAuthor.id,
          content: getRandomComment(),
          likeCount: Math.floor(Math.random() * 3), // Random likes 0-2
        },
      });

      comments.push(comment);

      // Update post comment count
      await prisma.post.update({
        where: { id: randomPost.id },
        data: {
          commentCount: {
            increment: 1,
          },
        },
      });
    }

    // Add a few nested replies
    for (let i = 0; i < 3; i++) {
      const randomComment = comments[Math.floor(Math.random() * comments.length)];
      const randomAuthor = profiles[Math.floor(Math.random() * profiles.length)];

      if (randomAuthor.id === randomComment.authorId) continue;

      await prisma.comment.create({
        data: {
          postId: randomComment.postId,
          parentId: randomComment.id,
          authorId: randomAuthor.id,
          content: getRandomReply(),
          likeCount: Math.floor(Math.random() * 2),
        },
      });

      // Update post comment count
      await prisma.post.update({
        where: { id: randomComment.postId },
        data: {
          commentCount: {
            increment: 1,
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Created ${profiles.length} test profiles, ${posts.length} posts, and ${comments.length} comments`,
      stats: {
        profiles: profiles.length,
        posts: posts.length,
        comments: comments.length + 3, // + nested replies
      },
    });
  } catch (error: any) {
    console.error("[Seed Community] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to seed community data",
      },
      { status: 500 }
    );
  }
}

function getRandomComment(): string {
  const comments = [
    "Great question! I've been wondering about this too.",
    "This is such an interesting topic. Thanks for bringing it up!",
    "I have a different perspective on this...",
    "From my experience, this has been true. Great insight!",
    "Can someone explain this in simpler terms?",
    "I'm new to this, but this is really helpful!",
    "This resonates with me so much!",
    "I'd love to hear more about this from others.",
  ];
  return comments[Math.floor(Math.random() * comments.length)];
}

function getRandomReply(): string {
  const replies = [
    "I agree with this!",
    "Exactly what I was thinking.",
    "This makes so much sense.",
    "Thanks for clarifying!",
    "I have a follow-up question...",
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}

