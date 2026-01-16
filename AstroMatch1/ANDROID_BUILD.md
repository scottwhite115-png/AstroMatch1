# Android Build Guide

## Prerequisites

1. **Android Studio** installed
2. **Java JDK 17+** installed
3. **Android SDK** configured

## Building AAB (Android App Bundle)

### Step 1: Build Web Assets
```bash
npm run build
```

### Step 2: Sync to Android
```bash
npm run build:android
# Or manually:
npx cap sync android
```

### Step 3: Build AAB
```bash
npm run build:aab
# Or manually:
cd android
./gradlew bundleRelease
```

### Output Location
The AAB file will be generated at:
```
android/app/build/outputs/bundle/release/app-release.aab
```

## Signing the AAB

Before uploading to Google Play, you need to sign the AAB:

1. **Generate signing key** (if not exists):
```bash
keytool -genkey -v -keystore astromatch-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias astromatch
```

2. **Configure signing in** `android/app/build.gradle`:
```gradle
android {
    signingConfigs {
        release {
            storeFile file('path/to/astromatch-release-key.jks')
            storePassword 'your-store-password'
            keyAlias 'astromatch'
            keyPassword 'your-key-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

## Testing APK

To generate a test APK instead of AAB:
```bash
cd android
./gradlew assembleRelease
```

APK location: `android/app/build/outputs/apk/release/app-release.apk`

## Troubleshooting

- **"SDK location not found"**: Set `ANDROID_HOME` environment variable
- **"Gradle sync failed"**: Open project in Android Studio and sync
- **"Missing package product"**: Run `npx cap sync android` again
