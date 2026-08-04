# Build & Assets Configuration Guide

## 1. Android Release Configuration
- **Version Code:** 1
- **Version Name:** 1.0.0
- **Release Build Configuration:** Managed via `android/app/build.gradle` using `signingConfigs`.
- **App Signing Configuration:**
  - Create a Keystore file using `keytool`.
  - Store the `key.properties` file locally (do not commit to Git).
  - Keystore must be secured and backed up; losing it means losing the ability to update the app on the Play Store.
- **Output Artifacts:**
  - `app-release.apk` for Enterprise distribution and direct testing.
  - `app-release.aab` for Google Play Store upload.

## 2. iOS Release Configuration
- **Bundle Identifier:** `com.raxon.salesops`
- **Version / Build:** 1.0.0 (1)
- **App Signing:** Managed via Xcode with an Apple Developer Enterprise Program or standard Developer account.
- **Provisioning Profile:** Ensure a Distribution Provisioning Profile is created and linked to the App ID.
- **TestFlight Configuration:** Upload the IPA via Transporter or Xcode to App Store Connect for internal TestFlight distribution.

## 3. App Icons Specifications
- **Android Launcher Icon:** `ic_launcher.png` (mipmap folders: mdpi 48x48, hdpi 72x72, xhdpi 96x96, xxhdpi 144x144, xxxhdpi 192x192).
- **Adaptive Icon:** Foreground and background vector layers (`ic_launcher_foreground.xml`, `ic_launcher_background.xml`).
- **iOS App Icon:** `AppIcon.appiconset` (Sizes ranging from 20x20 to 1024x1024, no transparency, no rounded corners pre-applied).
- **Notification Icon:** Transparent background, white silhouette (24x24 dp).
- **Web Icon:** `favicon.ico` and `apple-touch-icon.png` (512x512).

## 4. Splash Screen Specifications
- Utilize `flutter_native_splash` for seamless generation.
- **Splash Assets:** Center logo (400x400 max) on a solid background color.
- **Dark Mode Splash:** Separate logo asset (usually light text) and dark background hex code.
- **Tablet Splash:** High-resolution assets required to prevent pixelation on iPads and Android tablets.
