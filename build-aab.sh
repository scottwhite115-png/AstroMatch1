#!/bin/bash

# Build Android App Bundle (AAB) for AstroMatch
# This script prepares everything and builds the AAB

set -e

echo "🚀 Building AstroMatch AAB..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Must run from project root directory"
    exit 1
fi

# Step 1: Build Next.js
echo "📦 Step 1: Building Next.js production bundle..."
npm run build
echo "✅ Next.js build complete"
echo ""

# Step 2: Sync Capacitor
echo "🔄 Step 2: Syncing Capacitor with Android..."
npx cap sync android
echo "✅ Capacitor sync complete"
echo ""

# Step 3: Build AAB
echo "📱 Step 3: Building Android App Bundle..."
cd android

# Check if Java is available
if ! command -v java &> /dev/null; then
    echo "⚠️  Java not found in PATH"
    echo "📝 Please build the AAB in Android Studio:"
    echo "   1. Open Android Studio"
    echo "   2. Open: $(pwd)"
    echo "   3. Build > Generate Signed Bundle / APK"
    echo "   4. Select 'Android App Bundle'"
    echo "   5. Select 'release' build variant"
    echo "   6. The AAB will be at: android/app/release/app-release.aab"
    echo ""
    echo "✅ Everything is prepared! Just build in Android Studio."
    exit 0
fi

# Try to build with Gradle
echo "🔨 Building AAB with Gradle..."
./gradlew bundleRelease

if [ -f "app/build/outputs/bundle/release/app-release.aab" ]; then
    echo ""
    echo "✅ AAB built successfully!"
    echo "📍 Location: android/app/build/outputs/bundle/release/app-release.aab"
    echo ""
    echo "📤 Ready to upload to Google Play Console!"
else
    echo ""
    echo "⚠️  AAB not found. Please build in Android Studio:"
    echo "   1. Open Android Studio"
    echo "   2. Open: $(pwd)"
    echo "   3. Build > Generate Signed Bundle / APK"
    echo "   4. Select 'Android App Bundle' and 'release'"
fi

