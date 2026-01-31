/**
 * Script to insert 3 test profiles into the connections page
 * Profiles will have random birthdays in 1976, 1977, and 1986
 */

// Load environment variables FIRST using require
const path = require('path');
const dotenv = require('dotenv');

// Load .env.local first, then .env
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Verify DATABASE_URL is loaded
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL not found in environment variables');
  console.error('Make sure .env.local exists and contains DATABASE_URL');
  process.exit(1);
}

// Now import prisma (after env vars are loaded)
const prismaModule = require('../lib/prisma');
const prisma = prismaModule.default || prismaModule.prisma;

// Import other modules
const { getChineseZodiacFromDate } = require('../lib/chineseZodiac');
const { getBothSunSignsFromBirthdate } = require('../lib/sunSignCalculator');

interface TestProfile {
  display_name: string
  email: string
  birthdate: string
  gender: string
  lat: number
  lon: number
  photos: string[]
  bio?: string
  city?: string
}

// Generate random date in a given year
function randomDateInYear(year: number): string {
  const start = new Date(year, 0, 1)
  const end = new Date(year, 11, 31)
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime())
  const date = new Date(randomTime)
  
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

// Calculate age from birthdate
function calculateAge(birthdate: string): number {
  const [year, month, day] = birthdate.split('-').map(Number)
  const today = new Date()
  let age = today.getFullYear() - year
  const monthDiff = today.getMonth() + 1 - month
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
    age--
  }
  return age
}

async function insertTestProfiles() {
  try {
    // Get a user's location to place test profiles nearby
    // Use the most recently active profile with a location
    const userWithLocation = await prisma.$queryRaw<Array<{lat: number, lon: number}>>`
      SELECT lat, lon FROM profiles 
      WHERE lat IS NOT NULL AND lon IS NOT NULL 
      ORDER BY last_active DESC 
      LIMIT 1
    `;

    let baseLat = -33.8688; // Default Sydney
    let baseLon = 151.2093;

    if (userWithLocation.length > 0 && userWithLocation[0].lat && userWithLocation[0].lon) {
      baseLat = userWithLocation[0].lat;
      baseLon = userWithLocation[0].lon;
      console.log(`Using location from most active user: ${baseLat}, ${baseLon}`);
    } else {
      console.log(`No user location found, using default Sydney location: ${baseLat}, ${baseLon}`);
    }

    // Get existing test profiles or any 3 profiles to update
    const testProfiles = await prisma.$queryRaw<Array<{id: string, display_name: string}>>`
      SELECT id, display_name FROM profiles 
      WHERE display_name LIKE 'Test User%' OR display_name LIKE 'Test Profile%'
      LIMIT 3
    `;

    let profilesToUpdate = testProfiles;
    if (profilesToUpdate.length < 3) {
      console.log(`Found ${testProfiles.length} test profiles. Getting additional profiles to update.`);
      const anyProfiles = await prisma.$queryRaw<Array<{id: string}>>`
        SELECT id FROM profiles LIMIT 3
      `;
      if (anyProfiles.length < 3) {
        console.error('Not enough profiles in database');
        await prisma.$disconnect();
        return;
      }
      profilesToUpdate = [];
      for (let i = 0; i < 3; i++) {
        profilesToUpdate.push({ id: anyProfiles[i].id, display_name: '' });
      }
    }

    const years = [1976, 1977, 1986];
    const genders = ['Woman', 'Man', 'Woman'];
    const photoUrls = [
      ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'],
      ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'],
      ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop']
    ];

    console.log('\nCreating/updating test profiles...\n');

    for (let i = 0; i < 3; i++) {
      const year = years[i];
      const birthdate = randomDateInYear(year);
      const [yearNum, monthNum, dayNum] = birthdate.split('-').map(Number);
      
      // Calculate zodiac signs
      const chineseZodiac = getChineseZodiacFromDate(new Date(birthdate));
      const sunSigns = getBothSunSignsFromBirthdate(birthdate);
      const age = calculateAge(birthdate);
      
      // Place profiles within 5km of the base location (small random offset)
      const lat = baseLat + (Math.random() - 0.5) * 0.05; // ~5km radius
      const lon = baseLon + (Math.random() - 0.5) * 0.05;

      console.log(`Profile ${i + 1}: Test User ${year}`);
      console.log(`  Birthdate: ${birthdate}`);
      console.log(`  Age: ${age}`);
      console.log(`  Western Sign: ${sunSigns.tropical}`);
      console.log(`  Chinese Sign: ${chineseZodiac.animal}`);
      console.log(`  Gender: ${genders[i]}`);
      console.log(`  Location: ${lat.toFixed(4)}, ${lon.toFixed(4)}`);

      await prisma.$executeRaw`
        UPDATE profiles 
        SET display_name = ${`Test User ${year}`},
            western_sign = ${sunSigns.tropical},
            chinese_sign = ${chineseZodiac.animal},
            email = ${`test${year}@example.com`},
            birthdate = ${birthdate},
            age = ${age},
            gender = ${genders[i]},
            lat = ${lat},
            lon = ${lon},
            photos = ${photoUrls[i]}::text[],
            bio = ${'Test profile created for connections page'},
            city = ${'Sydney'},
            profile_complete = true,
            account_active = true,
            updated_at = NOW(),
            last_active = NOW()
        WHERE id = ${profilesToUpdate[i].id}::uuid
      `;
      
      console.log(`  ✅ Updated successfully\n`);
    }

    console.log(`\n✅ Successfully updated ${profilesToUpdate.length} test profiles!`);
    console.log(`\nProfiles are now:`);
    console.log(`  - Located near: ${baseLat.toFixed(4)}, ${baseLon.toFixed(4)}`);
    console.log(`  - profile_complete = true`);
    console.log(`  - account_active = true`);
    console.log(`  - With photos, birthdates, and zodiac signs`);
    console.log(`  - Likes and passes cleared`);
    console.log(`\nCheck the connections page to see the test profiles!`);
    
  } catch (error) {
    console.error('Error inserting test profiles:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  insertTestProfiles()
    .then(() => {
      console.log('Script completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Script failed:', error)
      process.exit(1)
    })
}

export { insertTestProfiles }
