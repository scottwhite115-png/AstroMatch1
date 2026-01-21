// Create test posts using the existing setup
// Run: node create-test-posts-now.js

require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const { prisma } = require('./lib/prisma.ts');

async function createTestPosts() {
  try {
    console.log('🔍 Finding existing users...');

    const users = await prisma.profiles.findMany({
      take: 3,
      select: { id: true, display_name: true }
    });

    if (users.length === 0) {
      console.log('❌ No users found in database.');
      console.log('💡 You need at least one user account to create posts.');
      console.log('   Try logging into the app first to create a user profile.');
      return;
    }

    console.log(`✅ Found ${users.length} users`);

    const testPosts = [
      {
        title: 'Welcome to AstroLounge! 🌟',
        content: 'This is the first test post in our community! The database connection is working perfectly. You can now create posts, comments, and engage with the community.',
        topic: 'general-astrology',
        type: 'STORY',
        authorId: users[0].id
      },
      {
        title: 'How do I read my birth chart?',
        content: 'I\'m new to astrology and just got my birth chart. Where should I start? What should I focus on first? Any tips for beginners?',
        topic: 'general-astrology',
        type: 'QUESTION',
        authorId: users[0].id
      },
      {
        title: 'Leo season energy is amazing! ☀️',
        content: 'As a Leo, I feel so energized during Leo season. Anyone else feeling the same creative boost? What\'s your sun sign experience?',
        topic: 'sun-signs',
        type: 'STORY',
        authorId: users[0].id
      },
      {
        title: 'Chinese Zodiac compatibility?',
        content: 'I\'m a Dragon and dating a Snake. Is this a good match according to Chinese astrology? What do the trines mean?',
        topic: 'chinese-astrology',
        type: 'QUESTION',
        authorId: users[0].id
      },
      {
        title: 'Mercury retrograde survival tips',
        content: 'Another Mercury retrograde is coming! Here are my survival tips: backup your data, avoid big purchases, and be patient with miscommunications.',
        topic: 'astromatch-feedback',
        type: 'STORY',
        authorId: users[0].id
      }
    ];

    let created = 0;
    for (const post of testPosts) {
      try {
        // Check if post already exists
        const existing = await prisma.post.findFirst({
          where: { title: post.title }
        });

        if (!existing) {
          await prisma.post.create({ data: post });
          created++;
          console.log(`✅ Created: "${post.title}"`);
        } else {
          console.log(`⏭️  Already exists: "${post.title}"`);
        }
      } catch (error) {
        console.error(`❌ Error creating post "${post.title}":`, error.message);
      }
    }

    console.log(`\n🎉 Successfully created ${created} test posts!`);
    console.log('📍 Visit: http://localhost:3000/community to see them');
    console.log('🧪 Test features: create posts, add comments, like content');

  } catch (error) {
    console.error('💥 Fatal error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createTestPosts();
