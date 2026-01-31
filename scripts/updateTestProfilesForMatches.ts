// Load environment variables FIRST using require
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Now import prisma
import prisma from '../lib/prisma';

// Helper function to get Chinese zodiac from year
function getChineseAnimalFromYear(year: number): string {
  const animals = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
  const index = ((year - 4) % 12 + 12) % 12;
  return animals[index];
}

// Helper function to get Western sign from month and day
function getWesternSign(month: number, day: number): string {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';
  return 'Aries';
}

// Generate random birthdays in specified years
function getRandomBirthday(year: number): { month: number; day: number; dateString: string } {
  const month = Math.floor(Math.random() * 12) + 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const day = Math.floor(Math.random() * daysInMonth) + 1;
  const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return { month, day, dateString };
}

async function updateTestProfiles() {
  try {
    // Get existing profiles that match our test user names
    const testProfiles = await prisma.$queryRaw<Array<{id: string, display_name: string}>>`
      SELECT id, display_name FROM profiles 
      WHERE display_name LIKE 'Test User%' 
      LIMIT 3
    `;

    if (testProfiles.length < 3) {
      console.log('Found', testProfiles.length, 'test profiles. Getting any 3 profiles to update.');
      // Get any 3 profiles to update
      const anyProfiles = await prisma.$queryRaw<Array<{id: string}>>`
        SELECT id FROM profiles LIMIT 3
      `;
      if (anyProfiles.length < 3) {
        console.error('Not enough profiles in database');
        await prisma.$disconnect();
        return;
      }
      // Use these profiles
      for (let i = 0; i < 3; i++) {
        testProfiles.push({ id: anyProfiles[i].id, display_name: '' });
      }
    }

    const years = [1976, 1977, 1986];
    // Default location (Sydney, Australia coordinates - adjust as needed)
    const defaultLat = -33.8688;
    const defaultLon = 151.2093;

    for (let i = 0; i < 3; i++) {
      const year = years[i];
      const { month, day, dateString } = getRandomBirthday(year);
      const westernSign = getWesternSign(month, day);
      const chineseSign = getChineseAnimalFromYear(year);
      
      // Add small random offset to lat/lon so they're not all at exact same location
      const lat = defaultLat + (Math.random() - 0.5) * 0.01;
      const lon = defaultLon + (Math.random() - 0.5) * 0.01;

      await prisma.$executeRaw`
        UPDATE profiles 
        SET display_name = ${`Test User ${year}`},
            western_sign = ${westernSign},
            chinese_sign = ${chineseSign},
            email = ${`test${year}@example.com`},
            lat = ${lat},
            lon = ${lon},
            profile_complete = true,
            account_active = true,
            updated_at = NOW(),
            last_active = NOW()
        WHERE id = ${testProfiles[i].id}::uuid
      `;
      console.log(`✓ Updated profile: Test User ${year} (${westernSign} ${chineseSign}) - Birthday: ${dateString} - Location: ${lat.toFixed(4)}, ${lon.toFixed(4)}`);
    }

    console.log(`\n✓ Successfully updated ${testProfiles.length} test profiles!`);
    console.log(`\nProfiles now have:`);
    console.log(`  - Location data (lat/lon)`);
    console.log(`  - profile_complete = true`);
    console.log(`  - account_active = true`);
    console.log(`  - Zodiac signs based on birthdays in ${years.join(', ')}`);
  } catch (error) {
    console.error('Error updating test profiles:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateTestProfiles();
