# Deployment Guide

## Prerequisites
- Flutter SDK 3.19.x or higher
- Android Studio / Xcode
- Keystore file for Android App Signing
- Provisioning Profile for iOS

## Environment Setup
Raxon uses environment variables to configure environments.
Ensure you have `.env.development` and `.env.production` files in the project root.

## 1. Android Release Build
1. Create `key.properties` in `android/key.properties`:
   ```properties
   storePassword=<password>
   keyPassword=<password>
   keyAlias=upload
   storeFile=<path_to_keystore_file>
   ```
2. Build APK:
   `flutter build apk --release --obfuscate --split-debug-info=./debug_info`
3. Build App Bundle (AAB for Play Store):
   `flutter build appbundle --release --obfuscate --split-debug-info=./debug_info`

## 2. iOS Release Build
1. Install dependencies:
   `cd ios && pod install && cd ..`
2. Build IPA:
   `flutter build ipa --release --obfuscate --split-debug-info=./debug_info`
3. Upload to TestFlight via Transporter or Xcode.

## 3. Web Deployment
1. Build web application:
   `flutter build web --release`
2. Deploy the `build/web` directory to Firebase Hosting, AWS S3, or Vercel.

## Firebase Configuration
Ensure `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) are placed in their respective directories before building. Crashlytics and Performance Monitoring will initialize automatically based on the `EnvConfig`.
