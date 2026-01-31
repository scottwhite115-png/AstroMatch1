// Load environment variables FIRST using require
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Now import prisma
import prisma from '../lib/prisma';

async function fixTestProfileComplete() {
  try {
    // Update test profiles to set profile_complete = true
    const result = await prisma.$executeRaw`
      UPDATE profiles 
      SET profile_complete = true,
          account_active = true,
          updated_at = NOW(),
          last_active = NOW()
      WHERE display_name LIKE 'Test User%'
    `;

    console.log(`✓ Updated test profiles to set profile_complete = true`);
    console.log(`✓ Also ensured account_active = true`);
    console.log(`\nTest profiles should now be visible on the matches page!`);
  } catch (error) {
    console.error('Error updating test profiles:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixTestProfileComplete();
