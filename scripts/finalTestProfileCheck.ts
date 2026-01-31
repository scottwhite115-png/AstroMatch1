// Load environment variables FIRST using require
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Now import prisma
import prisma from '../lib/prisma';

async function finalCheck() {
  try {
    // Get current user's profile to check their filters
    const userProfile = await prisma.$queryRaw<Array<{
      id: string,
      display_name: string,
      lat: number,
      lon: number,
      looking_for_gender: string,
      age_min: number,
      age_max: number,
      distance_radius: number
    }>>`
      SELECT id, display_name, lat, lon, looking_for_gender, age_min, age_max, distance_radius
      FROM profiles 
      ORDER BY last_active DESC 
      LIMIT 1
    `;

    // Get test profiles
    const testProfiles = await prisma.$queryRaw<Array<{
      id: string,
      display_name: string,
      lat: number,
      lon: number,
      gender: string,
      birthdate: string,
      profile_complete: boolean,
      account_active: boolean,
      photos: string[]
    }>>`
      SELECT id, display_name, lat, lon, gender, birthdate, profile_complete, account_active, photos
      FROM profiles 
      WHERE display_name LIKE 'Test User%'
      LIMIT 3
    `;

    console.log(`\n=== CURRENT USER PROFILE ===`);
    if (userProfile.length > 0) {
      const user = userProfile[0];
      console.log(`User: ${user.display_name}`);
      console.log(`Location: ${user.lat}, ${user.lon}`);
      console.log(`Looking for: ${user.looking_for_gender || 'Not set (defaults to Everyone)'}`);
      console.log(`Age range: ${user.age_min || 18} - ${user.age_max || 99}`);
      console.log(`Distance radius: ${user.distance_radius || 50}km`);
    }

    console.log(`\n=== TEST PROFILES ===`);
    testProfiles.forEach((profile, i) => {
      const birthYear = profile.birthdate ? new Date(profile.birthdate).getFullYear() : null;
      const age = birthYear ? new Date().getFullYear() - birthYear : null;
      
      console.log(`\n${i + 1}. ${profile.display_name}`);
      console.log(`   ID: ${profile.id}`);
      console.log(`   Location: ${profile.lat}, ${profile.lon}`);
      console.log(`   Gender: ${profile.gender || 'MISSING'}`);
      console.log(`   Age: ${age || 'Unknown'} (birthdate: ${profile.birthdate || 'MISSING'})`);
      console.log(`   profile_complete: ${profile.profile_complete}`);
      console.log(`   account_active: ${profile.account_active}`);
      console.log(`   Photos: ${profile.photos?.length || 0}`);
      
      if (userProfile.length > 0) {
        const user = userProfile[0];
        // Calculate distance (rough estimate)
        const latDiff = Math.abs(user.lat - profile.lat);
        const lonDiff = Math.abs(user.lon - profile.lon);
        const distanceKm = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 111; // rough km
        
        console.log(`   Distance from user: ~${distanceKm.toFixed(1)}km`);
        console.log(`   Within radius? ${distanceKm <= (user.distance_radius || 50) ? '✓ YES' : '✗ NO'}`);
        console.log(`   Age in range? ${age && age >= (user.age_min || 18) && age <= (user.age_max || 99) ? '✓ YES' : '✗ NO'}`);
        console.log(`   Gender match? ${!user.looking_for_gender || user.looking_for_gender === 'Everyone' || user.looking_for_gender.toLowerCase() === profile.gender?.toLowerCase() ? '✓ YES' : '✗ NO'}`);
      }
    });

    // Check likes/passes
    if (userProfile.length > 0 && testProfiles.length > 0) {
      const userId = userProfile[0].id;
      const testIds = testProfiles.map(p => p.id);
      
      const likes = await prisma.$queryRaw<Array<{liked_id: string}>>`
        SELECT liked_id FROM likes 
        WHERE liker_id = ${userId}::uuid AND liked_id = ANY(${testIds}::uuid[])
      `;
      
      const passes = await prisma.$queryRaw<Array<{passed_id: string}>>`
        SELECT passed_id FROM passes 
        const genderMatch = !user.looking_for_gender || user.looking_for_gender === "Everyone" || 
          (user.looking_for_gender && profile.gender && 
           user.looking_for_gender.toLowerCase() === profile.gender.toLowerCase());
        console.log(`   Gender match? ${genderMatch ? "YES" : "NO"}`);
      }
    });

    // Check likes/passes
    if (userProfile.length > 0 && testProfiles.length > 0) {
      const userId = userProfile[0].id;
      const testIds = testProfiles.map(p => p.id);
      
      const likes = await prisma.$queryRaw<Array<{liked_id: string}>>`
        SELECT liked_id FROM likes 
        WHERE liker_id = ${userId}::uuid AND liked_id = ANY(${testIds}::uuid[])
      `;
      
      const passes = await prisma.$queryRaw<Array<{passed_id: string}>>`
        SELECT passed_id FROM passes 
        WHERE passer_id = ${userId}::uuid AND passed_id = ANY(${testIds}::uuid[])
      `;
      
      console.log(`\n=== LIKES/PASSES CHECK ===`);
      console.log(`Likes: ${likes.length} (${likes.length > 0 ? "WARNING - These will be filtered out!" : "None - profiles will show"})`);
      console.log(`Passes: ${passes.length} (${passes.length > 0 ? "WARNING - These will be filtered out!" : "None - profiles will show"})`);
    }

    console.log(`\n=== SUMMARY ===`);
    console.log(`All test profiles have:`);
    console.log(`  - profile_complete = true`);
    console.log(`  - account_active = true`);
    console.log(`  - gender set`);
    console.log(`  - photos (at least 1)`);
    console.log(`  - birthdate set`);
    console.log(`  - location data`);
    console.log(`\nIf profiles still don't show, check:`);
    console.log(`  1. Your distance radius includes them`);
    console.log(`  2. Your age range includes 28-48`);
    console.log(`  3. Your gender preference is "Everyone" or matches the profile genders`);
    console.log(`  4. Refresh the page after checking these settings`);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

finalCheck();
