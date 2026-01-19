#!/bin/bash

echo "🔧 Fixing Xcode Signing for App Store..."
echo ""

# Open Keychain Access and guide user
echo "Step 1: Creating Certificate Signing Request..."
echo ""
echo "I'll open Keychain Access for you. Then:"
echo "1. Click 'Keychain Access' in the menu bar (top of screen)"
echo "2. Click 'Certificate Assistant'"
echo "3. Click 'Request a Certificate from a Certificate Authority...'"
echo "4. Fill in:"
echo "   - Email: scottwhite115@gmail.com"
echo "   - Name: SCOTT MARK WHITE"
echo "   - Select 'Saved to disk'"
echo "5. Save to Desktop as 'CertificateRequest'"
echo ""
read -p "Press Enter when you've saved the CertificateRequest file to Desktop..."

# Check if file exists
if [ -f ~/Desktop/CertificateRequest.certSigningRequest ]; then
    echo "✅ Found certificate request file!"
    echo ""
    echo "Step 2: Now go to:"
    echo "https://developer.apple.com/account/resources/certificates/add"
    echo ""
    echo "1. Select 'App Store and Ad Hoc'"
    echo "2. Click 'Continue'"
    echo "3. Click 'Choose File' and select: ~/Desktop/CertificateRequest.certSigningRequest"
    echo "4. Click 'Continue'"
    echo "5. Download the certificate"
    echo ""
    read -p "Press Enter when you've downloaded the certificate..."
    
    # Find downloaded certificate
    CERT_FILE=$(find ~/Downloads -name "*.cer" -type f | head -1)
    if [ -n "$CERT_FILE" ]; then
        echo "✅ Found certificate: $CERT_FILE"
        echo "Installing..."
        open "$CERT_FILE"
        echo "✅ Certificate installed!"
    else
        echo "⚠️  Couldn't find certificate. Please double-click the .cer file to install it."
    fi
else
    echo "⚠️  Certificate request file not found on Desktop."
    echo "Please make sure you saved it as 'CertificateRequest.certSigningRequest'"
fi

echo ""
echo "Step 3: Creating App Store Provisioning Profile..."
echo ""
echo "Go to: https://developer.apple.com/account/resources/profiles/add"
echo ""
echo "1. Select 'App Store' (under Distribution)"
echo "2. Click 'Continue'"
echo "3. Select App ID: com.astromatch.ios"
echo "4. Click 'Continue'"
echo "5. Select your certificate (the one you just created)"
echo "6. Click 'Continue'"
echo "7. Name it: AstroMatch App Store"
echo "8. Click 'Generate'"
echo "9. Download the .mobileprovision file"
echo ""
read -p "Press Enter when you've downloaded the provisioning profile..."

# Find and install provisioning profile
PROV_FILE=$(find ~/Downloads -name "*.mobileprovision" -type f | head -1)
if [ -n "$PROV_FILE" ]; then
    echo "✅ Found provisioning profile: $PROV_FILE"
    echo "Installing..."
    open "$PROV_FILE"
    echo "✅ Provisioning profile installed!"
    echo ""
    echo "Step 4: Now in Xcode:"
    echo "1. Select 'App' target"
    echo "2. Go to 'Signing & Capabilities'"
    echo "3. Uncheck 'Automatically manage signing'"
    echo "4. Under 'Provisioning Profile', select 'AstroMatch App Store'"
    echo "5. Try archiving again!"
else
    echo "⚠️  Couldn't find provisioning profile. Please double-click the .mobileprovision file to install it."
fi

echo ""
echo "✅ Done! Now try archiving in Xcode."






