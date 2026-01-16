// Quick script to create test posts for UI testing
// Run: npx tsx create-test-posts.ts

// Load environment variables FIRST - must be before any other imports
require("dotenv").config({ path: ".env.local" })
require("dotenv").config() // fallback to .env

import { prisma } from "@/lib/prisma"
import { PostType } from "@prisma/client"

const TEST_POSTS = [
  {
    topic: "general-astrology",
    type: PostType.STORY,
    title: "Welcome to AstroLounge! 🌟",
    content: "This is a test post to verify the community section UI is working correctly. You should be able to see this post, like it, and comment on it!",
  },
  {
    topic: "general-astrology",
    type: PostType.QUESTION,
    title: "How do I read my birth chart?",
    content: "I'm new to astrology and just got my birth chart. Where should I start? What should I focus on first?",
  },
  {
    topic: "sun-signs",
    type: PostType.STORY,
    title: "Leo season is here! ☀️",
    content: "As a Leo, I feel so energized during Leo season. Anyone else feeling the same way?",
  },
  {
    topic: "chinese-astrology",
    type: PostType.QUESTION,
    title: "What does my Chinese zodiac sign mean?",
    content: "I was born in 1990, so I'm a Horse. Can anyone explain what that means for my personality and relationships?",
  },
]

async function createTestPosts() {
  console.log("🔍 Finding a user in the database...")
  
  // Get the first user from the database
  const firstUser = await prisma.profiles.findFirst({
    select: { id: true, display_name: true },
  })

  if (!firstUser) {
    console.error("❌ No users found in database!")
    console.log("💡 You need to have at least one user profile to create posts.")
    console.log("   Create a user account first, then run this script again.")
    process.exit(1)
  }

  console.log(`✅ Found user: ${firstUser.display_name || firstUser.id}`)
  console.log(`📝 Creating ${TEST_POSTS.length} test posts...`)

  let created = 0
  let errors = 0

  for (const postData of TEST_POSTS) {
    try {
      // Check if this exact post already exists
      const existing = await prisma.post.findFirst({
        where: {
          title: postData.title,
          authorId: firstUser.id,
        },
      })

      if (existing) {
        console.log(`⏭️  Post "${postData.title}" already exists, skipping...`)
        continue
      }

      await prisma.post.create({
        data: {
          ...postData,
          authorId: firstUser.id,
        },
      })
      created++
      console.log(`✅ Created: "${postData.title}"`)
    } catch (error: any) {
      errors++
      console.error(`❌ Error creating "${postData.title}":`, error.message)
    }
  }

  console.log("\n🎉 Done!")
  console.log(`✅ Created: ${created} posts`)
  if (errors > 0) {
    console.log(`❌ Errors: ${errors}`)
  }
  console.log("\n📍 Now visit http://localhost:3001/community to see your posts!")
}

createTestPosts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("💥 Fatal error:", error)
    process.exit(1)
  })

