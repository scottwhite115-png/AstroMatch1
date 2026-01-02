#!/bin/bash

echo "🎨 AstroMatch Icon Installer"
echo "=============================="
echo ""
echo "Instructions:"
echo "1. Download icon pack from appicon.co or icon.kitchen"
echo "2. Extract the ZIP file"
echo "3. Find the 'AppIcon.appiconset' folder"
echo "4. Drag that folder to your Desktop"
echo "5. Run this script"
echo ""
read -p "Have you done the above? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please complete the steps above first!"
    exit 1
fi

# Check if folder exists on Desktop
if [ -d ~/Desktop/AppIcon.appiconset ]; then
    echo "✅ Found AppIcon.appiconset on Desktop"
    echo ""
    echo "📁 Backing up old icons..."
    mv /Users/scottwhite/Desktop/AstroMatch1/ios/App/App/Assets.xcassets/AppIcon.appiconset /Users/scottwhite/Desktop/AstroMatch1/ios/App/App/Assets.xcassets/AppIcon.appiconset.backup
    
    echo "📦 Installing new icons..."
    cp -r ~/Desktop/AppIcon.appiconset /Users/scottwhite/Desktop/AstroMatch1/ios/App/App/Assets.xcassets/
    
    echo ""
    echo "✅ Icons installed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Open Xcode: open /Users/scottwhite/Desktop/AstroMatch1/ios/App/App.xcworkspace"
    echo "2. Check the AppIcon in Assets.xcassets"
    echo "3. All icon sizes should be filled in"
    echo ""
else
    echo "❌ Could not find AppIcon.appiconset on Desktop"
    echo ""
    echo "Please:"
    echo "1. Download icons from appicon.co"
    echo "2. Extract the ZIP"
    echo "3. Drag 'AppIcon.appiconset' folder to Desktop"
    echo "4. Run this script again"
fi

