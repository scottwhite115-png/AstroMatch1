#!/bin/bash

# AstroMatch iOS Build Script
# This script prepares your app for App Store submission

echo "🚀 AstroMatch iOS Build Script"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Clean and build Next.js
echo "📦 Step 1: Building Next.js production build..."
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Next.js build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Next.js build complete${NC}"
echo ""

# Step 2: Sync Capacitor
echo "🔄 Step 2: Syncing Capacitor to iOS..."
npx cap sync ios

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Capacitor sync failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Capacitor sync complete${NC}"
echo ""

# Step 3: Open Xcode
echo "📱 Step 3: Opening Xcode..."
echo ""
echo -e "${YELLOW}Next steps in Xcode:${NC}"
echo "1. Select 'Any iOS Device (arm64)' as target"
echo "2. Product → Scheme → Edit Scheme → Set to 'Release'"
echo "3. Product → Archive"
echo "4. Wait for build to complete"
echo "5. Window → Organizer → Distribute App"
echo ""

read -p "Press Enter to open Xcode..."

open ios/App/App.xcworkspace

echo -e "${GREEN}✅ Xcode opened!${NC}"
echo ""
echo "Good luck with your build! 🍀"

