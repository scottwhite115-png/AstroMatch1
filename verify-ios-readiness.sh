#!/bin/bash

# AstroMatch iOS Pre-Launch Verification Script
# Run this before building for App Store to catch common issues

set -e  # Exit on error

echo "🚀 AstroMatch iOS Pre-Launch Verification"
echo "=========================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
ERRORS=0
WARNINGS=0
PASSED=0

# Helper functions
error() {
    echo -e "${RED}❌ ERROR: $1${NC}"
    ((ERRORS++))
}

warning() {
    echo -e "${YELLOW}⚠️  WARNING: $1${NC}"
    ((WARNINGS++))
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((PASSED++))
}

echo "📋 Checking Prerequisites..."
echo ""

# Check if we're in the right directory
if [ ! -f "capacitor.config.ts" ]; then
    error "Not in AstroMatch project root! Please run from /Users/scottwhite/Desktop/AstroMatch1"
    exit 1
fi
success "Running from correct directory"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    error "Node.js is not installed"
else
    NODE_VERSION=$(node -v)
    success "Node.js installed: $NODE_VERSION"
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    error "npm is not installed"
else
    NPM_VERSION=$(npm -v)
    success "npm installed: $NPM_VERSION"
fi

# Check if Xcode is installed
if ! command -v xcodebuild &> /dev/null; then
    error "Xcode is not installed or not in PATH"
else
    XCODE_VERSION=$(xcodebuild -version | head -n 1)
    success "Xcode installed: $XCODE_VERSION"
fi

echo ""
echo "📱 Checking iOS Project..."
echo ""

# Check if iOS directory exists
if [ ! -d "ios" ]; then
    error "iOS directory not found! Run: npx cap add ios"
else
    success "iOS directory exists"
fi

# Check if Xcode workspace exists
if [ ! -d "ios/App/App.xcworkspace" ]; then
    error "Xcode workspace not found! Run: npx cap sync ios"
else
    success "Xcode workspace exists"
fi

# Check capacitor.config.ts
if [ -f "capacitor.config.ts" ]; then
    success "Capacitor config exists"
    
    # Check for correct app ID
    if grep -q "appId: 'com.astromatch.app'" capacitor.config.ts; then
        success "App ID correctly set to 'com.astromatch.app'"
    else
        warning "App ID may not be correct in capacitor.config.ts"
    fi
    
    # Check for server URL
    if grep -q "url:" capacitor.config.ts; then
        SERVER_URL=$(grep "url:" capacitor.config.ts | cut -d "'" -f 2)
        success "Server URL configured: $SERVER_URL"
    else
        warning "Server URL not configured"
    fi
else
    error "capacitor.config.ts not found"
fi

echo ""
echo "🎨 Checking App Assets..."
echo ""

# Check for app icons
ICON_DIR="ios/App/App/Assets.xcassets/AppIcon.appiconset"
if [ -d "$ICON_DIR" ]; then
    success "App icon directory exists"
    
    # Count icon files
    ICON_COUNT=$(find "$ICON_DIR" -name "*.png" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$ICON_COUNT" -lt 5 ]; then
        error "Only $ICON_COUNT app icon(s) found. You need multiple sizes! Visit https://www.appicon.co/"
    else
        success "Found $ICON_COUNT app icon files"
    fi
    
    # Check for Contents.json
    if [ -f "$ICON_DIR/Contents.json" ]; then
        success "Contents.json exists"
    else
        warning "Contents.json missing in AppIcon.appiconset"
    fi
else
    error "App icon directory not found"
fi

# Check for splash screen
SPLASH_DIR="ios/App/App/Assets.xcassets/Splash.imageset"
if [ -d "$SPLASH_DIR" ]; then
    success "Splash screen directory exists"
else
    warning "Splash screen directory not found (optional)"
fi

echo ""
echo "📦 Checking Dependencies..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    error "node_modules not found. Run: npm install"
else
    success "node_modules directory exists"
fi

# Check for key Capacitor packages
if [ -f "package.json" ]; then
    success "package.json exists"
    
    if grep -q "@capacitor/ios" package.json; then
        success "@capacitor/ios package listed"
    else
        error "@capacitor/ios not in package.json. Run: npm install @capacitor/ios"
    fi
    
    if grep -q "@capacitor/core" package.json; then
        success "@capacitor/core package listed"
    else
        error "@capacitor/core not in package.json"
    fi
else
    error "package.json not found"
fi

echo ""
echo "🔐 Checking Environment..."
echo ""

# Check for .env file
if [ -f ".env.local" ] || [ -f ".env" ]; then
    success "Environment file exists"
    
    # Check for required env variables (without showing values)
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local 2>/dev/null || grep -q "NEXT_PUBLIC_SUPABASE_URL" .env 2>/dev/null; then
        success "NEXT_PUBLIC_SUPABASE_URL configured"
    else
        warning "NEXT_PUBLIC_SUPABASE_URL not found in environment file"
    fi
    
    if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local 2>/dev/null || grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env 2>/dev/null; then
        success "NEXT_PUBLIC_SUPABASE_ANON_KEY configured"
    else
        warning "NEXT_PUBLIC_SUPABASE_ANON_KEY not found in environment file"
    fi
else
    warning "No .env or .env.local file found"
fi

echo ""
echo "📄 Checking Documentation & Legal..."
echo ""

# Check for privacy policy info
if [ -f "APP_STORE_LISTING_INFO.md" ]; then
    success "App Store listing info document exists"
else
    warning "APP_STORE_LISTING_INFO.md not found (helpful reference)"
fi

# Check for launch checklist
if [ -f "APP_STORE_LAUNCH_CHECKLIST.md" ] || [ -f "LAUNCH_QUICK_CHECKLIST.md" ]; then
    success "Launch checklist document exists"
else
    warning "Launch checklist not found"
fi

echo ""
echo "🏗️  Testing Build Readiness..."
echo ""

# Try a clean
if [ -d "ios/App/build" ]; then
    echo "Cleaning previous iOS builds..."
    rm -rf ios/App/build
    success "Cleaned previous builds"
fi

# Check if we can sync Capacitor
echo "Testing Capacitor sync..."
if npx cap sync ios > /dev/null 2>&1; then
    success "Capacitor sync successful"
else
    error "Capacitor sync failed. Fix errors before building."
fi

echo ""
echo "=========================================="
echo "📊 Verification Summary"
echo "=========================================="
echo ""
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
echo -e "${YELLOW}⚠️  Warnings: $WARNINGS${NC}"
echo -e "${RED}❌ Errors: $ERRORS${NC}"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}🎉 Perfect! You're ready to build for the App Store!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Open Xcode: open ios/App/App.xcworkspace"
    echo "2. Select 'Any iOS Device (arm64)'"
    echo "3. Product → Archive"
    echo "4. Upload to App Store Connect"
    echo ""
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  You have warnings but can proceed with building.${NC}"
    echo ""
    echo "Review warnings above. When ready:"
    echo "1. Open Xcode: open ios/App/App.xcworkspace"
    echo "2. Select 'Any iOS Device (arm64)'"
    echo "3. Product → Archive"
    echo ""
    exit 0
else
    echo -e "${RED}❌ Please fix the errors above before building!${NC}"
    echo ""
    echo "Common fixes:"
    echo "- Run: npm install"
    echo "- Run: npx cap sync ios"
    echo "- Generate app icons: https://www.appicon.co/"
    echo "- Install Xcode from Mac App Store"
    echo ""
    exit 1
fi

