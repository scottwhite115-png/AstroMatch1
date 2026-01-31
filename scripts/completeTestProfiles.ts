// Load environment variables FIRST using require
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Now import prisma
import prisma from '../lib/prisma';

async function completeTestProfiles() {
  try {
    // Get test profiles
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

    const genders = ['Woman', 'Man', 'Woman']; // Mix of genders
    const placeholderPhotos = [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
    ];

    for (let i = 0; i < testProfiles.length; i++) {
      const profile = testProfiles[i];
      const photos = [placeholderPhotos[i % placeholderPhotos.length]];

      // Update all required fields
      try {
        await prisma.$executeRaw`
          UPDATE profiles 
          SET photos = ${photos}::text[],
              gender = ${genders[i]},
              profile_complete = true,
              account_active = true,
              updated_at = NOW(),
              last_active = NOW()
          WHERE id = ${profile.id}::uuid
        `;
        console.log(`✓ Updated ${profile.display_name} with gender: ${genders[i]}, photos, and completion flags`);
      } catch (e: any) {
        console.log(`⚠ Error updating ${profile.display_name}: ${e.message}`);
        // Try without photos if that's the issue
        try {
          await prisma.$executeRaw`
            UPDATE profiles 
            SET gender = ${genders[i]},
                profile_complete = true,
                account_active = true,
                updated_at = NOW(),
                last_active = NOW()
            WHERE id = ${profile.id}::uuid
          `;
          console.log(`✓ Updated ${profile.display_name} (without photos)`);
        } catch (e2: any) {
          console.log(`⚠ Could not update ${profile.display_name}: ${e2.message}`);
        }
      }
    }

    // Verify the profiles
    const verified = await prisma.$queryRaw<Array<{
      display_name: string,
      profile_complete: boolean,
      account_active: boolean,
      photos: string[],
      gender: string,
      western_sign: string,
      chinese_sign: string
    }>>`
      SELECT display_name, profile_complete, account_active, photos, gender, western_sign, chinese_sign
      FROM profiles 
      WHERE display_name LIKE 'Test User%'
      LIMIT 3
    `;

    console.log(`\n✓ Verification:`);
    verified.forEach(p => {
      console.log(`\n${p.display_name}:`);
      console.log(`  profile_complete: ${p.profile_complete}`);
      console.log(`  account_active: ${p.account_active}`);
      console.log(`  gender: ${p.gender || 'MISSING'}`);
      console.log(`  photos: ${p.photos?.length || 0} photo(s)`);
      console.log(`  signs: ${p.western_sign} ${p.chinese_sign}`);
    });

    console.log(`\n✓ Test profiles should now be visible!`);
  } catch (error) {
    console.error('Error completing test profiles:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

completeTestProfiles();
