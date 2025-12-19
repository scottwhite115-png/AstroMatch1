// Load environment variables FIRST before any other imports
import { config } from "dotenv"
import { resolve } from "path"
import { existsSync } from "fs"

const envPath = resolve(process.cwd(), ".env.local")
if (existsSync(envPath)) {
  config({ path: envPath })
} else {
  config() // Try default .env
}

// Now import other modules that use env vars
import { prisma } from "@/lib/prisma"
import { PostType } from "@prisma/client"

const SAMPLE_POSTS = [
  {
    topic: "general-astrology",
    type: PostType.STORY,
    title: "My Aquarius-Monkey energy is finally making sense!",
    content: "I've always felt like a walking contradiction—progressive but traditional, rebellious but loyal. Then I learned about my Aquarius Sun (innovation, independence) and Monkey year (clever, adaptable). The combination explains everything! Anyone else feel like their East-West combo unlocked their personality?",
    // Note: Replace with actual user ID from your database
    authorId: "00000000-0000-0000-0000-000000000000",
  },
  {
    topic: "compatibility-and-synastry",
    type: PostType.QUESTION,
    title: "Cancer-Horse dating Leo-Rabbit—is this Liu Chong doomed?",
    content: "I'm a Cancer Horse (Water × Fire, emotional but freedom-loving) and just started seeing a Leo Rabbit (Fire × Wood, warm and gentle). Our Western signs seem great, but I heard Horse-Rabbit is Liu Chong (clashing)? Has anyone made this work? Do the Western vibes outweigh Chinese conflicts?",
    authorId: "00000000-0000-0000-0000-000000000000",
  },
  {
    topic: "chinese-astrology",
    type: PostType.STORY,
    title: "San He trine friendships are REAL",
    content: "I'm a Rat and my two best friends are a Dragon and a Monkey. We didn't plan it—we just clicked instantly. The San He trine (Rat-Dragon-Monkey) is supposed to be harmonious and supportive, and it's 100% true. We think alike, finish each other's sentences, and never have drama. If you haven't explored your San He connections, DO IT.",
    authorId: "00000000-0000-0000-0000-000000000000",
  },
  {
    topic: "sun-signs",
    type: PostType.QUESTION,
    title: "Tropical vs Sidereal—which one is 'real'?",
    content: "I'm Tropical Gemini but Sidereal Taurus. They feel like completely different people! Gemini is chatty and restless, Taurus is chill and grounded. AstroMatch lets me switch systems, but which one should I trust? Do you identify more with your Tropical or Sidereal sign?",
    authorId: "00000000-0000-0000-0000-000000000000",
  },
  {
    topic: "vedic-astrology",
    type: PostType.STORY,
    title: "My Nakshatra explained my whole career path",
    content: "I'm Uttara Phalguni nakshatra (ruled by Sun, associated with partnerships and generosity). I always thought I'd be a solo entrepreneur, but I thrive in collaborations. Once I learned my nakshatra, I leaned into partnerships and my business took off. Vedic astrology hits different when you dig into the nakshatras!",
    authorId: "00000000-0000-0000-0000-000000000000",
  },
  {
    topic: "astromatch-feedback",
    type: PostType.QUESTION,
    title: "Feature request: Wu Xing elements in profiles?",
    content: "Love the app! Could we add Wu Xing (Metal, Wood, Water, Fire, Earth) to profiles? It's based on birth year and adds another layer to Chinese astrology. Would be cool to see \"Aquarius Monkey · Metal\" or filter by element. Thoughts?",
    authorId: "00000000-0000-0000-0000-000000000000",
  },
  {
    topic: "compatibility-and-synastry",
    type: PostType.STORY,
    title: "Married my 'Difficult Match' and it's perfect",
    content: "AstroMatch gave us a 38% match (Magnetic Opposites). Our signs clash on paper—Aries Ram (both impulsive) meeting Libra Rabbit (needs harmony). But opposites attract! We balance each other. Don't let the scores scare you. Chemistry is real, and growth comes from differences.",
    authorId: "00000000-0000-0000-0000-000000000000",
  },
  {
    topic: "chinese-astrology",
    type: PostType.QUESTION,
    title: "Ox-Tiger-Goat 'triangle of conflict'—real or myth?",
    content: "I keep seeing references to Ox-Tiger-Goat forming a difficult triangle. I'm a Goat and my sibling is an Ox, and we DO butt heads constantly. Is this a real astrological thing or confirmation bias? Anyone in this triangle who gets along fine?",
    authorId: "00000000-0000-0000-0000-000000000000",
  },
]

async function seedCommunity() {
  console.log("[Seed] Starting community seed...")
  
  // Get the first user from the database to use as author
  const firstUser = await prisma.profiles.findFirst({
    select: { id: true },
  })

  if (!firstUser) {
    console.error("[Seed] No users found in database. Please create a user first.")
    return
  }

  console.log(`[Seed] Using user ID: ${firstUser.id}`)

  let created = 0
  for (const post of SAMPLE_POSTS) {
    try {
      await prisma.post.create({
        data: {
          ...post,
          authorId: firstUser.id, // Use actual user ID
        },
      })
      created++
    } catch (error) {
      console.error(`[Seed] Error creating post "${post.title}":`, error)
    }
  }
  
  console.log(`[Seed] Created ${created}/${SAMPLE_POSTS.length} posts`)
}

seedCommunity()
  .then(() => {
    console.log("[Seed] Complete!")
    process.exit(0)
  })
  .catch((e) => {
    console.error("[Seed] Error:", e)
    process.exit(1)
  })


