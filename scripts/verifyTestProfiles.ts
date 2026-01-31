// Load environment variables FIRST using require
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Now import prisma
import prisma from '../lib/prisma';

async function verifyTestProfiles() {
  try {
    // Get test profiles with all their data
    const testProfiles = await prisma.$queryRaw<Array<{
      id: string,
      display_name: string,
      western_sign: string,
      chinese_sign: string,
      lat: number,
      lon: number,
      profile_complete: boolean,
      account_active: boolean,
      email: string
    }>>`
      SELECT id, display_name, western_sign, chinese_sign, lat, lon, 
             profile_complete, account_active, email
      FROM profiles 
      WHERE display_name LIKE 'Test User%' 
      LIMIT 3
    `;

    console.log(`\nFound ${testProfiles.length} test profiles:\n`);
    
    testProfiles.forEach((profile, i) => {
      console.log(`Profile ${i + 1}: ${profile.display_name}`);
      console.log(`  ID: ${profile.id}`);
      console.log(`  Signs: ${profile.western_sign} ${profile.chinese_sign}`);
      console.log(`  Location: ${profile.lat}, ${profile.lon}`);
      console.log(`  profile_complete: ${profile.profile_complete}`);
      console.log(`  account_active: ${profile.account_active}`);
      console.log(`  Email: ${profile.email}`);
      console.log('');
    });

    // Check if they're in likes/passes
    if (testProfiles.length > 0) {
      const testIds = testProfiles.map(p => p.id);
      const likes = await prisma.$queryRaw<Array<{liked_id: string}>>`
        SELECT liked_id FROM likes 
        WHERE liked_id = ANY(${testIds}::uuid[])
        LIMIT 10
      `;
      const passes = await prisma.$queryRaw<Array<{passed_id: string}>>`
        SELECT passed_id FROM passes 
        WHERE passed_id = ANY(${testIds}::uuid[])
        LIMIT 10
      `;
      
      console.log(`Likes found: ${likes.length}`);
      console.log(`Passes found: ${passes.length}`);
      
      if (likes.length > 0 || passes.length > 0) {
        console.log(`\n⚠️  Some test profiles are still liked/passed. Run clearTestProfileLikes.ts again.`);
      } else {
        console.log(`\n✓ No likes/passes found for test profiles - they should be visible!`);
      }
    }

    console.log(`\nNote: Profiles need to match your filters:`);
    console.log(`  - Distance: Within your radius setting`);
    console.log(`  - Age: Within your age range (28-48 for these profiles)`);
    console.log(`  - Gender: Match your preference or set to "Everyone"`);
  } catch (error) {
    console.error('Error verifying test profiles:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

verifyTestProfiles();
