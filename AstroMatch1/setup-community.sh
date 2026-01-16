#!/bin/bash

# AstroLounge Community Update Script
# Run this after applying the database migration

echo "🎯 AstroLounge Community Setup"
echo "================================"
echo ""

# Step 1: Check if migration needs to be applied
echo "📋 Step 1: Database Migration"
echo "----------------------------------------"
echo "⚠️  You need to apply the migration manually via Supabase Dashboard:"
echo ""
echo "1. Go to: https://supabase.com/dashboard"
echo "2. Select your project"
echo "3. Click 'SQL Editor' in the left sidebar"
echo "4. Click 'New Query'"
echo "5. Copy and paste the contents of:"
echo "   prisma/migrations/add_community_threads_and_sanhe_chat.sql"
echo "6. Click 'Run'"
echo ""
echo "Press ENTER after you've applied the migration..."
read

# Step 2: Generate Prisma Client
echo ""
echo "📦 Step 2: Generating Prisma Client"
echo "----------------------------------------"
npx prisma generate

if [ $? -eq 0 ]; then
    echo "✅ Prisma Client generated successfully"
else
    echo "❌ Failed to generate Prisma Client"
    exit 1
fi

# Step 3: Optional - Seed sample data
echo ""
echo "🌱 Step 3: Seed Sample Posts (Optional)"
echo "----------------------------------------"
echo "Would you like to create 8 sample posts for testing? (y/n)"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "Seeding sample posts..."
    npx tsx prisma/seed-community.ts
    
    if [ $? -eq 0 ]; then
        echo "✅ Sample posts created successfully"
    else
        echo "⚠️  Seeding failed - you can run this manually later:"
        echo "   npx tsx prisma/seed-community.ts"
    fi
else
    echo "⏭️  Skipping seed data"
fi

# Step 4: Summary
echo ""
echo "🎉 Setup Complete!"
echo "================================"
echo ""
echo "Your AstroLounge community is ready! 🚀"
echo ""
echo "📍 Visit these routes to test:"
echo "  - /community              → Stories & Q&A"
echo "  - /community/live         → San He Live Chat"
echo "  - /community/[topic]      → Topic-specific posts"
echo ""
echo "🔧 Features Available:"
echo "  ✅ Forum with Stories & Questions"
echo "  ✅ Nested comments & likes"
echo "  ✅ 4 San He houses (Visionaries, Strategists, Adventurers, Artists)"
echo "  ✅ 3 region scopes (Near me, Country, Global)"
echo "  ✅ Live chat with polling"
echo "  ✅ Table switching"
echo ""
echo "📚 Documentation:"
echo "  - ASTROLOUNGE_ALL_PROMPTS_COMPLETE.md  → Full implementation summary"
echo "  - ASTROLOUNGE_QUICK_START.md           → Quick reference"
echo "  - COMMUNITY_API_DOCS.md                → API documentation"
echo ""
echo "Happy testing! 🎊"


