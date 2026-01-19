#!/bin/bash

# Community Setup Helper Script
# This script helps you set up the community section step by step

echo "🎯 AstroMatch Community Setup Helper"
echo "======================================"
echo ""

# Step 1: Check DATABASE_URL
echo "📋 Step 1: Checking DATABASE_URL Configuration"
echo "----------------------------------------"
if grep -q "\[Get from here" .env.local 2>/dev/null; then
    echo "❌ DATABASE_URL is not configured"
    echo ""
    echo "To get your DATABASE_URL:"
    echo "1. Go to: https://supabase.com/dashboard/project/umorkbxikucjlluzezhq/settings/database"
    echo "2. Scroll down to 'Connection string' section"
    echo "3. Copy the 'URI' connection string (starts with postgresql://)"
    echo "4. Update .env.local with:"
    echo "   DATABASE_URL=\"your-connection-string-here\""
    echo "   DIRECT_URL=\"your-connection-string-here\""
    echo ""
    echo "Press ENTER after you've updated .env.local..."
    read
else
    echo "✅ DATABASE_URL appears to be configured"
fi

# Step 2: Test database connection
echo ""
echo "🔌 Step 2: Testing Database Connection"
echo "----------------------------------------"
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
    if [ -z "$DATABASE_URL" ] || [[ "$DATABASE_URL" == *"\[Get from here"* ]]; then
        echo "❌ DATABASE_URL is still not set properly"
        exit 1
    fi
    
    echo "Testing connection..."
    npx prisma db pull --schema=./prisma/schema.prisma 2>&1 | head -5
    if [ $? -eq 0 ]; then
        echo "✅ Database connection successful"
    else
        echo "⚠️  Connection test failed - check your DATABASE_URL"
    fi
else
    echo "❌ .env.local file not found"
    exit 1
fi

# Step 3: Check if migration has been applied
echo ""
echo "📊 Step 3: Checking Database Tables"
echo "----------------------------------------"
echo "Checking if community tables exist..."

# Try to query for Post table
npx prisma db execute --stdin --schema=./prisma/schema.prisma <<< "SELECT 1 FROM \"Post\" LIMIT 1;" 2>&1 | grep -q "error\|Error" && MIGRATION_NEEDED=true || MIGRATION_NEEDED=false

if [ "$MIGRATION_NEEDED" = true ]; then
    echo "⚠️  Migration may not be applied yet"
    echo ""
    echo "To apply the migration:"
    echo "1. Go to: https://supabase.com/dashboard/project/umorkbxikucjlluzezhq/sql/new"
    echo "2. Copy the contents of: prisma/migrations/add_community_threads_and_sanhe_chat.sql"
    echo "3. Paste into the SQL editor"
    echo "4. Click 'Run'"
    echo ""
    echo "Press ENTER after you've applied the migration..."
    read
else
    echo "✅ Database tables appear to exist"
fi

# Step 4: Generate Prisma Client
echo ""
echo "📦 Step 4: Generating Prisma Client"
echo "----------------------------------------"
npx prisma generate --schema=./prisma/schema.prisma

if [ $? -eq 0 ]; then
    echo "✅ Prisma Client generated successfully"
else
    echo "❌ Failed to generate Prisma Client"
    exit 1
fi

# Step 5: Optional seed
echo ""
echo "🌱 Step 5: Seed Sample Data (Optional)"
echo "----------------------------------------"
echo "Would you like to create sample posts for testing? (y/n)"
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

# Step 6: Summary
echo ""
echo "🎉 Setup Complete!"
echo "================================"
echo ""
echo "Your community section should now be ready! 🚀"
echo ""
echo "📍 Test these routes:"
echo "  - http://localhost:3000/community"
echo "  - http://localhost:3000/community/general-astrology"
echo ""
echo "If you see errors, check:"
echo "  1. DATABASE_URL is correct in .env.local"
echo "  2. Migration has been applied in Supabase"
echo "  3. Prisma client is generated (npx prisma generate)"
echo ""

