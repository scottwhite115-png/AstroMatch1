#!/bin/bash

# AstroMatch Android Setup & Verification Script
# Automates Android platform setup and checks readiness

set -e  # Exit on error

echo "🤖 AstroMatch Android Setup & Verification"
echo "==========================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "capacitor.config.ts" ]; then
    error "Not in AstroMatch project root!"
    exit 1
fi
success "Running from correct directory"

echo ""
echo "📋 Checking Prerequisites..."
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    error "Node.js is not installed"
else
    NODE_VERSION=$(node -v)
    success "Node.js installed: $NODE_VERSION"
fi

# Check npm
if ! command -v npm &> /dev/null; then
    error "npm is not installed"
else
    NPM_VERSION=$(npm -v)
    success "npm installed: $NPM_VERSION"
fi

# Check Java (required for Android)
if ! command -v java &> /dev/null; then
    warning "Java not found. Android Studio includes Java, but you may need to set JAVA_HOME"
else
    JAVA_VERSION=$(java -version 2>&1 | head -n 1)
    success "Java installed: $JAVA_VERSION"
fi

# Check for Android SDK
if [ -z "$ANDROID_HOME" ] && [ -z "$ANDROID_SDK_ROOT" ]; then
    warning "ANDROID_HOME or ANDROID_SDK_ROOT not set. You'll need Android Studio."
else
    if [ -n "$ANDROID_HOME" ]; then
        success "ANDROID_HOME set: $ANDROID_HOME"
    fi
    if [ -n "$ANDROID_SDK_ROOT" ]; then
        success "ANDROID_SDK_ROOT set: $ANDROID_SDK_ROOT"
    fi
fi

echo ""
echo "📦 Checking/Installing Capacitor Android..."
echo ""

# Check if @capacitor/android is installed
if grep -q "@capacitor/android" package.json 2>/dev/null; then
    success "@capacitor/android already in package.json"
else
    info "Installing @capacitor/android..."
    npm install @capacitor/android
    success "@capacitor/android installed"
fi

# Check if android directory exists
if [ ! -d "android" ]; then
    info "Android platform not added yet. Adding now..."
    npx cap add android
    success "Android platform added"
else
    success "Android directory exists"
fi

# Sync Capacitor
info "Syncing Capacitor..."
npx cap sync android
success "Capacitor synced"

echo ""
echo "🔧 Checking Android Configuration..."
echo ""

# Check android/app/build.gradle
if [ -f "android/app/build.gradle" ]; then
    success "build.gradle exists"
    
    # Check application ID
    if grep -q "applicationId.*com.astromatch.app" android/app/build.gradle; then
        success "Application ID correctly set"
    else
        warning "Application ID may need to be updated in android/app/build.gradle"
    fi
    
    # Check version code and name
    if grep -q "versionCode" android/app/build.gradle; then
        VERSION_CODE=$(grep "versionCode" android/app/build.gradle | grep -o "[0-9]*" | head -1)
        success "Version code: $VERSION_CODE"
    fi
    
    if grep -q "versionName" android/app/build.gradle; then
        VERSION_NAME=$(grep "versionName" android/app/build.gradle | grep -o '"[^"]*"' | head -1 | tr -d '"')
        success "Version name: $VERSION_NAME"
    fi
else
    error "android/app/build.gradle not found"
fi

# Check strings.xml
if [ -f "android/app/src/main/res/values/strings.xml" ]; then
    success "strings.xml exists"
    
    if grep -q "AstroMatch" android/app/src/main/res/values/strings.xml; then
        success "App name set to AstroMatch"
    else
        warning "App name may need to be updated in strings.xml"
    fi
else
    error "strings.xml not found"
fi

echo ""
echo "🎨 Checking Android Assets..."
echo ""

# Check for app icons
ICON_DIRS=(
    "android/app/src/main/res/mipmap-mdpi"
    "android/app/src/main/res/mipmap-hdpi"
    "android/app/src/main/res/mipmap-xhdpi"
    "android/app/src/main/res/mipmap-xxhdpi"
    "android/app/src/main/res/mipmap-xxxhdpi"
)

ICON_COUNT=0
for dir in "${ICON_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        ICONS=$(find "$dir" -name "*.png" 2>/dev/null | wc -l | tr -d ' ')
        if [ "$ICONS" -gt 0 ]; then
            ((ICON_COUNT++))
        fi
    fi
done

if [ $ICON_COUNT -ge 4 ]; then
    success "Found icons in $ICON_COUNT density folders"
else
    warning "Only found icons in $ICON_COUNT folders. Generate all sizes at https://www.appicon.co/"
fi

echo ""
echo "🔐 Checking Signing Configuration..."
echo ""

# Check for keystore
if [ -f "android/app/astromatch-release-key.keystore" ]; then
    success "Release keystore exists"
else
    warning "Release keystore not found. You'll need to generate one:"
    echo ""
    echo "    cd android/app"
    echo "    keytool -genkey -v -keystore astromatch-release-key.keystore \\"
    echo "      -alias astromatch -keyalg RSA -keysize 2048 -validity 10000"
    echo ""
fi

# Check for key.properties
if [ -f "android/app/key.properties" ]; then
    success "key.properties exists"
    
    # Verify it has required fields (without showing values)
    if grep -q "storePassword" android/app/key.properties && \
       grep -q "keyPassword" android/app/key.properties && \
       grep -q "keyAlias" android/app/key.properties && \
       grep -q "storeFile" android/app/key.properties; then
        success "key.properties has all required fields"
    else
        warning "key.properties may be incomplete"
    fi
else
    warning "key.properties not found. Create it for release builds:"
    echo ""
    echo "    storePassword=YOUR_KEYSTORE_PASSWORD"
    echo "    keyPassword=YOUR_KEY_PASSWORD"
    echo "    keyAlias=astromatch"
    echo "    storeFile=android/app/astromatch-release-key.keystore"
    echo ""
fi

echo ""
echo "🏗️  Testing Build Readiness..."
echo ""

# Check if gradlew exists and is executable
if [ -f "android/gradlew" ]; then
    success "Gradle wrapper exists"
    
    if [ -x "android/gradlew" ]; then
        success "Gradle wrapper is executable"
    else
        info "Making gradlew executable..."
        chmod +x android/gradlew
        success "Gradle wrapper now executable"
    fi
else
    error "Gradle wrapper not found"
fi

# Try a clean build (debug version for testing)
if [ -d "android/app/build" ]; then
    info "Cleaning previous builds..."
    cd android && ./gradlew clean > /dev/null 2>&1 && cd ..
    success "Cleaned previous builds"
fi

echo ""
echo "🧪 Testing Debug Build..."
echo ""

info "Attempting debug build (this may take a few minutes)..."
if cd android && ./gradlew assembleDebug > /dev/null 2>&1 && cd ..; then
    success "Debug build successful!"
    
    # Check if APK was created
    if [ -f "android/app/build/outputs/apk/debug/app-debug.apk" ]; then
        APK_SIZE=$(ls -lh android/app/build/outputs/apk/debug/app-debug.apk | awk '{print $5}')
        success "Debug APK created: $APK_SIZE"
    fi
else
    error "Debug build failed. Check errors above."
    echo ""
    echo "Common issues:"
    echo "- Android SDK not properly installed"
    echo "- ANDROID_HOME not set"
    echo "- Java version incompatible"
    echo "- Network issues (Gradle needs to download dependencies)"
    echo ""
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
    echo -e "${GREEN}🎉 Perfect! Android platform is ready!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Generate release keystore (if not done)"
    echo "2. Create key.properties file"
    echo "3. Generate app icons for all densities"
    echo "4. Build release AAB: cd android && ./gradlew bundleRelease"
    echo "5. Upload to Google Play Console"
    echo ""
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Android is set up but has warnings.${NC}"
    echo ""
    echo "Review warnings above before building release version."
    echo ""
    echo "To build debug APK for testing:"
    echo "  cd android && ./gradlew assembleDebug"
    echo ""
    echo "To build release AAB for Play Store:"
    echo "  1. Complete signing setup (keystore + key.properties)"
    echo "  2. cd android && ./gradlew bundleRelease"
    echo ""
else
    echo -e "${RED}❌ Please fix the errors above!${NC}"
    echo ""
    echo "Common fixes:"
    echo "- Install Android Studio: https://developer.android.com/studio"
    echo "- Set ANDROID_HOME environment variable"
    echo "- Run: npm install"
    echo "- Run: npx cap sync android"
    echo ""
    exit 1
fi

echo ""
echo "📱 To open in Android Studio:"
echo "   npx cap open android"
echo ""
echo "🔧 To sync changes:"
echo "   npx cap sync android"
echo ""

