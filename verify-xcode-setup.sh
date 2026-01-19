#!/bin/bash

echo "🔍 Verifying Xcode Setup for AstroMatch"
echo "========================================"
echo ""

# Check if Xcode is installed
if command -v xcodebuild &> /dev/null; then
    echo "✅ Xcode is installed"
    xcodebuild -version
    echo ""
else
    echo "❌ Xcode is not installed"
    echo "Please install from Mac App Store"
    exit 1
fi

# Check if iOS folder exists
if [ -d "ios/App/App.xcodeproj" ]; then
    echo "✅ iOS project exists"
    echo ""
else
    echo "❌ iOS project not found"
    echo "Need to run: npx cap sync ios"
    exit 1
fi

# Check if icons are installed
if [ -f "ios/App/App/Assets.xcassets/AppIcon.appiconset/Contents.json" ]; then
    echo "✅ App icons configured"
    echo ""
else
    echo "⚠️  App icons might need attention"
    echo ""
fi

echo "📋 Next Steps:"
echo "1. Wait for Apple Developer approval email"
echo "2. Once approved, open App Store Connect"
echo "3. Create new app listing"
echo "4. Upload screenshots"
echo "5. Run ./build-ios.sh to build app"
echo ""
echo "✨ You're ready to launch! 🚀"

