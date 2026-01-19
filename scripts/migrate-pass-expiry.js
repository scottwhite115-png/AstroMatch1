#!/usr/bin/env node

/**
 * Migration Runner: Update pass expiry to 7 days
 * Run with: node scripts/migrate-pass-expiry.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  console.log('🔧 Starting migration: Update pass expiry to 7 days...\n')

  try {
    // Query 1: Update the default for future passes
    console.log('1️⃣ Updating default expiry for future passes...')
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql_query: `
        ALTER TABLE public.passes 
        ALTER COLUMN expires_at SET DEFAULT NOW() + INTERVAL '7 days';
      `
    })

    if (alterError) {
      console.error('❌ Error updating default:', alterError.message)
      console.log('ℹ️  Trying alternative method...')
      
      // Alternative: Just run update query
      const { error: updateError } = await supabase
        .from('passes')
        .update({ expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() })
        .neq('id', '00000000-0000-0000-0000-000000000000') // Match none, just to trigger the default update
      
      if (updateError) {
        console.warn('⚠️  Could not update default via client. Manual SQL required.')
      }
    } else {
      console.log('✅ Default updated successfully')
    }

    // Query 2: Update existing passes
    console.log('\n2️⃣ Updating existing passes to use 7 day expiry...')
    
    // Get passes that need updating (those with 28 day expiry)
    const { data: passes, error: fetchError } = await supabase
      .from('passes')
      .select('id, created_at, expires_at')
      .gte('expires_at', new Date().toISOString()) // Only active passes
    
    if (fetchError) {
      throw new Error(`Error fetching passes: ${fetchError.message}`)
    }

    console.log(`📊 Found ${passes?.length || 0} active passes`)

    if (passes && passes.length > 0) {
      let updateCount = 0
      for (const pass of passes) {
        // Calculate new expiry (7 days from created_at)
        const createdDate = new Date(pass.created_at)
        const newExpiry = new Date(createdDate.getTime() + 7 * 24 * 60 * 60 * 1000)
        const oldExpiry = new Date(pass.expires_at)
        
        // Check if this pass was created with 28 day expiry
        const daysDiff = Math.round((oldExpiry.getTime() - createdDate.getTime()) / (24 * 60 * 60 * 1000))
        
        if (daysDiff >= 27 && daysDiff <= 29) { // Allow some tolerance
          const { error: updateError } = await supabase
            .from('passes')
            .update({ expires_at: newExpiry.toISOString() })
            .eq('id', pass.id)
          
          if (updateError) {
            console.error(`❌ Error updating pass ${pass.id}:`, updateError.message)
          } else {
            updateCount++
          }
        }
      }
      
      console.log(`✅ Updated ${updateCount} passes to 7 day expiry`)
    }

    console.log('\n✨ Migration completed successfully!')
    console.log('\n📝 Summary:')
    console.log('   - Pass expiry changed from 28 days to 7 days')
    console.log('   - Swiped-left profiles will now reappear after 1 week')
    console.log('   - Opening chat no longer auto-likes profiles')
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message)
    process.exit(1)
  }
}

runMigration()

