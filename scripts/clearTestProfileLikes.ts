// Load environment variables FIRST using require
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Now import prisma
import prisma from '../lib/prisma';

async function clearTestProfileLikes() {
  try {
    // Get test profile IDs
    const testProfiles = await prisma.$queryRaw<Array<{id: string, display_name: string}>>`
      SELECT id, display_name FROM profiles 
      WHERE display_name LIKE 'Test User%' 
      LIMIT 3
    `;

    if (testProfiles.length === 0) {
      console.log('No test profiles found');
      await prisma.$disconnect();
      return;
    }

    const testProfileIds = testProfiles.map(p => p.id);
    console.log(`Found ${testProfileIds.length} test profiles:`);
    testProfiles.forEach(p => console.log(`  - ${p.display_name} (${p.id})`));

    // Clear likes for test profiles
    const likesDeleted = await prisma.$executeRaw`
      DELETE FROM likes 
      WHERE liked_id = ANY(${testProfileIds}::uuid[])
    `;
    console.log(`\n✓ Cleared likes for test profiles`);

    // Clear passes for test profiles
    const passesDeleted = await prisma.$executeRaw`
      DELETE FROM passes 
      WHERE passed_id = ANY(${testProfileIds}::uuid[])
    `;
    console.log(`✓ Cleared passes for test profiles`);

    // Also clear likes FROM test profiles (in case they liked someone)
    const likesFromDeleted = await prisma.$executeRaw`
      DELETE FROM likes 
      WHERE liker_id = ANY(${testProfileIds}::uuid[])
    `;
    console.log(`✓ Cleared likes from test profiles`);

    // Also clear passes FROM test profiles
    const passesFromDeleted = await prisma.$executeRaw`
      DELETE FROM passes 
      WHERE passer_id = ANY(${testProfileIds}::uuid[])
    `;
    console.log(`✓ Cleared passes from test profiles`);

    console.log(`\n✓ Test profiles are now cleared of all likes/passes!`);
    console.log(`They should appear as new matches on the matches page.`);
  } catch (error: any) {
    if (error.message?.includes('does not exist')) {
      console.log('Note: likes/passes tables may not exist or have different names');
      console.log('Error:', error.message);
    } else {
      console.error('Error clearing likes/passes:', error);
      throw error;
    }
  } finally {
    await prisma.$disconnect();
  }
}

clearTestProfileLikes();
