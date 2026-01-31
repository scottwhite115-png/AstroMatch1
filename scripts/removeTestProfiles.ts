/**
 * Script to remove test profiles from the database
 * Run with: npx tsx scripts/removeTestProfiles.ts
 */

// Load environment variables BEFORE any imports
import * as dotenv from 'dotenv'
import * as path from 'path'
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })
dotenv.config({ path: path.resolve(__dirname, '../.env') })

// Prisma Client with adapter for Prisma 7
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// Create connection pool
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL must be set in .env.local')
}

const pool = new Pool({ 
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// Test profile names from the removed TEST_PROFILES array
const TEST_NAMES = [
  'Luna',
  'Stella',
  'Sophia',
  'Ivy',
  'Zara',
  'Freya',
  'Emma',
  'Delilah',
  'Charlotte',
  'Chloe',
  'Isabella',
  'Scarlett',
  'Violet',
  'Mia',
  'Hazel',
  'Olivia',
  'Ava',
  'Willow',
  'Harper',
  'Aurora',
  'Amelia',
  'Penelope',
  'Grace',
  'Eloise',
  'Nora',
  'Ruby',
  'Sage',
  'Phoebe',
  'Iris',
  'Vera',
  'Diana'
]

// Test birthdate years (1972-1989)
const TEST_BIRTHDATE_YEARS = ['1972', '1973', '1974', '1975', '1976', '1977', '1978', '1979', '1980', '1981', '1982', '1983', '1984', '1986', '1988', '1989']

async function removeTestProfiles() {
  try {
    console.log('🔍 Searching for test profiles...')

    // Find profiles matching test names or test birthdate years
    const testProfiles = await prisma.$queryRaw<Array<{ id: string; display_name: string | null; birthdate: Date | null }>>`
      SELECT id, display_name, birthdate
      FROM profiles
      WHERE 
        display_name = ANY(${TEST_NAMES})
        OR (
          birthdate IS NOT NULL 
          AND EXTRACT(YEAR FROM birthdate)::text = ANY(${TEST_BIRTHDATE_YEARS})
        )
    `

    console.log(`📋 Found ${testProfiles.length} potential test profiles`)

    if (testProfiles.length === 0) {
      console.log('✅ No test profiles found to remove')
      return
    }

    // Display found profiles
    console.log('\n📝 Test profiles found:')
    testProfiles.forEach((profile, index) => {
      console.log(`${index + 1}. ${profile.display_name || 'No name'} (ID: ${profile.id}, Birthdate: ${profile.birthdate ? profile.birthdate.toISOString().split('T')[0] : 'N/A'})`)
    })

    // Delete test profiles
    const profileIds = testProfiles.map(p => p.id)
    
    console.log('\n🗑️  Deleting test profiles...')
    
    // Delete related data first (likes, passes, messages, etc.)
    await prisma.$executeRaw`
      DELETE FROM likes WHERE liker_id = ANY(${profileIds}) OR liked_id = ANY(${profileIds})
    `
    await prisma.$executeRaw`
      DELETE FROM passes WHERE passer_id = ANY(${profileIds}) OR passed_id = ANY(${profileIds})
    `
    
    // Delete profiles
    const deleted = await prisma.$executeRaw`
      DELETE FROM profiles WHERE id = ANY(${profileIds})
    `

    console.log(`✅ Successfully removed ${testProfiles.length} test profiles and related data`)
    console.log('✨ Database cleaned for production!')

  } catch (error) {
    console.error('❌ Error removing test profiles:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
removeTestProfiles()
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
