/**
 * Install ONE test profile for the Connections page (Apple Review / design verification).
 * The test profile will MATCH your gender/orientation preferences so it appears.
 *
 * Run: npx ts-node scripts/insertOneTestProfile.ts
 * Or:  npm run seed:one-test-profile
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const prismaModule = require('../lib/prisma');
const prisma = prismaModule.default || prismaModule.prisma;
const { getChineseZodiacFromDate } = require('../lib/chineseZodiac');
const { getBothSunSignsFromBirthdate } = require('../lib/sunSignCalculator');

function calculateAge(birthdate: string): number {
  const [year, month, day] = birthdate.split('-').map(Number);
  const today = new Date();
  let age = today.getFullYear() - year;
  const monthDiff = today.getMonth() + 1 - month;
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) age--;
  return age;
}

/**
 * Given viewer's gender + orientation, return the test profile's gender + orientation
 * so they match (mutual visibility on Connections page).
 */
function getMatchingTestProfile(viewerGender: string, viewerOrientation: string): { gender: string; orientation: string } {
  const g = (viewerGender || '').toLowerCase().trim();
  const o = (viewerOrientation || '').toLowerCase().trim();

  // Viewer interested in Men → test profile = Man interested in viewer's gender
  if (o === 'men') {
    const orientation = g === 'woman' || g === 'female' ? 'Women' : 'Men';
    return { gender: 'Man', orientation };
  }
  // Viewer interested in Women → test profile = Woman interested in viewer's gender
  if (o === 'women') {
    const orientation = g === 'man' || g === 'male' ? 'Men' : 'Women';
    return { gender: 'Woman', orientation };
  }

  // Everyone / Prefer not to say / empty → pick based on viewer's gender so they match
  if (g === 'man' || g === 'male') return { gender: 'Woman', orientation: 'Men' };
  if (g === 'woman' || g === 'female') return { gender: 'Man', orientation: 'Women' };

  // Unknown viewer gender → Woman interested in Men (common default)
  return { gender: 'Woman', orientation: 'Men' };
}

async function insertOneTestProfile() {
  try {
    // 1) Get the current user (exclude test profiles, prefer one with location)
    let currentUser = await prisma.$queryRaw<
      Array<{ id: string; gender: string; orientation: string; looking_for_gender: string; lat: number; lon: number; display_name: string }>
    >`
      SELECT id, gender, orientation, looking_for_gender, lat, lon, display_name
      FROM profiles
      WHERE profile_complete = true
        AND (display_name NOT LIKE 'Test User%' AND display_name != 'Apple Review Test')
      ORDER BY (lat IS NOT NULL AND lon IS NOT NULL) DESC, last_active DESC NULLS LAST
      LIMIT 1
    `;

    if (currentUser.length === 0) {
      // Fallback: any non-test profile
      currentUser = await prisma.$queryRaw<
        Array<{ id: string; gender: string; orientation: string; looking_for_gender: string; lat: number; lon: number; display_name: string }>
      >`
        SELECT id, gender, orientation, looking_for_gender, lat, lon, display_name
        FROM profiles
        WHERE display_name NOT LIKE 'Test User%' AND display_name != 'Apple Review Test'
        ORDER BY created_at DESC
        LIMIT 1
      `;
    }

    if (currentUser.length === 0) {
      console.error('\n❌ No profiles in database. Sign up first at /signup, then run this script again.');
      await prisma.$disconnect();
      process.exit(1);
    }

    const user = currentUser[0];
    const orientation = (user.orientation || user.looking_for_gender || 'Everyone').trim();
    const { gender: testGender, orientation: testOrientation } = getMatchingTestProfile(user.gender || '', orientation);
    const baseLat = user.lat ?? -33.8688;
    const baseLon = user.lon ?? 151.2093;

    if (!user.lat || !user.lon) {
      console.log('\n⚠️  Your profile has no location. The test profile will be placed in Sydney.');
      console.log('   Set your location in Profile → Settings for the Connections page to work.\n');
    }

    console.log(`\n📋 Your profile: ${user.display_name} (gender: ${user.gender || '—'}, interested in: ${orientation})`);
    console.log(`🎯 Creating test profile: ${testGender} interested in ${testOrientation}\n`);

    // 2) Find a profile to update (not the current user)
    const candidates = await prisma.$queryRaw<Array<{ id: string; display_name: string }>>`
      SELECT id, display_name FROM profiles
      WHERE id != ${user.id}::uuid
      ORDER BY last_active DESC NULLS LAST
      LIMIT 1
    `;

    let targetId: string;
    if (candidates.length > 0) {
      targetId = candidates[0].id;
      console.log(`Using existing profile to update: ${candidates[0].display_name || targetId}\n`);
    } else {
      // Only 1 profile in DB - try to create a new user via Supabase
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!supabaseUrl || !serviceKey) {
        console.error('\n❌ Only one profile exists. To create a test profile, you need either:');
        console.error('   - A second account (create one at /signup), OR');
        console.error('   - SUPABASE_SERVICE_ROLE_KEY in .env.local to create a test user automatically.');
        await prisma.$disconnect();
        process.exit(1);
      }

      const { createClient } = require('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, serviceKey);
      const testEmail = `apple-review-test-${Date.now()}@astromatch.test`;
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: testEmail,
        password: 'TestPass123!',
        email_confirm: true,
      });

      if (authError || !authData?.user?.id) {
        console.error('\n❌ Could not create test user:', authError?.message || 'Unknown error');
        console.error('   Create a second account at /signup and run this script again.');
        await prisma.$disconnect();
        process.exit(1);
      }

      targetId = authData.user.id;
      console.log(`Created new test user: ${testEmail}\n`);
    }

    // 3) Build test profile data
    const birthdate = '1990-06-15';
    const age = calculateAge(birthdate);
    const chineseZodiac = getChineseZodiacFromDate(new Date(birthdate));
    const sunSigns = getBothSunSignsFromBirthdate(birthdate);
    const lat = baseLat + (Math.random() - 0.5) * 0.02;
    const lon = baseLon + (Math.random() - 0.5) * 0.02;
    const photoUrl =
      testGender.toLowerCase() === 'woman'
        ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop';

    const photos = [photoUrl];

    // 4) Update the profile (allow instant messages so you can chat from Connections)
    await prisma.$executeRaw`
      UPDATE profiles
      SET display_name = ${'Apple Review Test'},
          western_sign = ${sunSigns.tropical},
          chinese_sign = ${chineseZodiac.animal},
          birthdate = ${birthdate},
          age = ${age},
          gender = ${testGender},
          orientation = ${testOrientation},
          looking_for_gender = ${testOrientation},
          lat = ${lat},
          lon = ${lon},
          photos = ${photos}::text[],
          bio = ${'Test profile for Connections page design verification.'},
          city = ${'Sydney'},
          profile_complete = true,
          account_active = true,
          allow_instant_messages_connections = true,
          allow_instant_messages_discover = true,
          updated_at = NOW(),
          last_active = NOW()
      WHERE id = ${targetId}::uuid
    `;

    // 5) Clear likes and passes so it shows up
    await prisma.$executeRaw`DELETE FROM likes  WHERE liked_id = ${targetId}::uuid OR liker_id = ${targetId}::uuid`;
    await prisma.$executeRaw`DELETE FROM passes WHERE passed_id = ${targetId}::uuid OR passer_id = ${targetId}::uuid`;

    console.log('✅ One test profile installed:\n');
    console.log('   Name:     Apple Review Test');
    console.log('   Gender:   ' + testGender);
    console.log('   Interested in: ' + testOrientation);
    console.log('   Age:      ' + age);
    console.log('   Signs:    ' + sunSigns.tropical + ' / ' + chineseZodiac.animal);
    console.log('   Location: near you');
    console.log('\n📱 Open the Connections page to verify the design layout.\n');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

insertOneTestProfile()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
