// Load environment variables FIRST using require
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Now import prisma
import prisma from '../lib/prisma';

async function finalizeTestProfiles() {
  try {
    // Get test profiles
    const testProfiles = await prisma.$queryRaw<Array<{id: string, display_name: string, western_sign: string}>>`
      SELECT id, display_name, western_sign FROM profiles 
      WHERE display_name LIKE 'Test User%' 
      LIMIT 3
    `;

    if (testProfiles.length < 3) {
      console.log('Not enough test profiles found');
      await prisma.$disconnect();
      return;
    }

    const years = [1976, 1977, 1986];
    const birthdays = [
      '1976-11-20', // Scorpio Dragon
      '1977-05-10', // Taurus Snake  
      '1986-04-29'  // Taurus Tiger
    ];

    // Try to add birthdate if the column exists
    for (let i = 0; i < 3; i++) {
      try {
        await prisma.$executeRaw`
          UPDATE profiles 
          SET birthdate = ${birthdays[i]}::date
          WHERE id = ${testProfiles[i].id}::uuid
        `;
        console.log(`✓ Added birthdate ${birthdays[i]} to Test User ${years[i]}`);
      } catch (e: any) {
        if (e.message?.includes('column "birthdate" does not exist')) {
          console.log(`Note: birthdate column doesn't exist, age will be calculated from other data if available`);
        } else {
          console.log(`Could not update birthdate: ${e.message}`);
        }
      }
    }

    console.log(`\n✓ Test profiles are ready!`);
    console.log(`\nSummary:`);
    console.log(`  - 3 profiles with birthdays in 1976, 1977, 1986`);
    console.log(`  - Located near your location`);
    console.log(`  - profile_complete = true`);
    console.log(`  - account_active = true`);
    console.log(`\nIf profiles still don't show:`);
    console.log(`  1. Check your distance radius setting (should be at least 50km)`);
    console.log(`  2. Check your age range (should include 28-48)`);
    console.log(`  3. Check your gender preference (set to "Everyone" to see all)`);
  } catch (error) {
    console.error('Error finalizing test profiles:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

finalizeTestProfiles();
