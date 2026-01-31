// Load environment variables FIRST using require
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Now import prisma
import prisma from '../lib/prisma';

async function addPhotosToTestProfiles() {
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

    // Use placeholder images - you can replace these with actual image URLs
    const placeholderPhotos = [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
    ];

    for (let i = 0; i < testProfiles.length; i++) {
      const profile = testProfiles[i];
      const photos = [placeholderPhotos[i % placeholderPhotos.length]];

      try {
        // Try to update photos field (might be JSON array or text array)
        await prisma.$executeRaw`
          UPDATE profiles 
          SET photos = ${JSON.stringify(photos)}::jsonb,
              updated_at = NOW()
          WHERE id = ${profile.id}::uuid
        `;
        console.log(`✓ Added photo to ${profile.display_name}`);
      } catch (e: any) {
        // If jsonb doesn't work, try text array
        try {
          await prisma.$executeRaw`
            UPDATE profiles 
            SET photos = ${photos}::text[],
                updated_at = NOW()
            WHERE id = ${profile.id}::uuid
          `;
          console.log(`✓ Added photo to ${profile.display_name} (as text array)`);
        } catch (e2: any) {
          console.log(`⚠ Could not add photos to ${profile.display_name}: ${e2.message}`);
          // Try as simple text field
          try {
            await prisma.$executeRaw`
              UPDATE profiles 
              SET photo_url = ${photos[0]},
                  updated_at = NOW()
              WHERE id = ${profile.id}::uuid
            `;
            console.log(`✓ Added photo_url to ${profile.display_name}`);
          } catch (e3: any) {
            console.log(`⚠ Could not add photo_url: ${e3.message}`);
          }
        }
      }
    }

    console.log(`\n✓ Attempted to add photos to all test profiles`);
    console.log(`\nNote: If photos column doesn't exist, you may need to add it to the database schema.`);
  } catch (error) {
    console.error('Error adding photos:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

addPhotosToTestProfiles();
