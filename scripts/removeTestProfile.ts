/**
 * Remove the Apple Review Test profile before store submission.
 *
 * Run: npx ts-node scripts/removeTestProfile.ts
 * Or:  npm run remove:test-profile
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const prismaModule = require('../lib/prisma');
const prisma = prismaModule.default || prismaModule.prisma;

async function removeTestProfile() {
  try {
    const result = await prisma.$executeRaw`
      DELETE FROM profiles
      WHERE display_name = 'Apple Review Test'
    `;

    const count = typeof result === 'number' ? result : (result as any)?.count ?? 0;
    console.log(`\n✅ Removed ${count} test profile(s) with display_name = 'Apple Review Test'.\n`);
  } catch (error) {
    console.error('Error removing test profile:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

removeTestProfile()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
