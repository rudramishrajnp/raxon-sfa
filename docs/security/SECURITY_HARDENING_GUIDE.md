# Enterprise Security Hardening Guide

## 1. Code Obfuscation (ProGuard / R8)
- Ensure all Android release builds utilize R8 obfuscation to prevent reverse engineering.
- Command: `flutter build apk --release --obfuscate --split-debug-info=./debug_info`
- Custom `proguard-rules.pro` has been added to retain essential Firebase and Flutter wrappers while shrinking application logic.

## 2. Secure Build Configuration
- Remove all `print()` statements in release using `flutter analyze` or custom linters.
- Use `kReleaseMode` flags to disable debug inspection tools (e.g., Alice, Chucker).
- Strip unnecessary permissions from `AndroidManifest.xml` and `Info.plist`.

## 3. Secret Management & API Key Protection
- **Rule:** NEVER hardcode API Keys, Passwords, or Secrets in Dart code.
- Ensure `flutter_dotenv` is used ONLY for non-sensitive public keys (e.g., Maps API).
- Private Keys (Firebase Admin, JWT Secret) MUST reside solely on the Backend Server as Environment Variables.

## 4. Firebase Security Rules
If direct-to-Firebase patterns are used (e.g., Chat, Notifications), strict rules must apply:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /chat/{chatId} {
      // Only allow members of the chat group to read/write
      allow read, write: if request.auth != null && request.auth.uid in resource.data.members;
    }
  }
}
```

## 5. API Gateway Hardening
- Implement **WAF (Web Application Firewall)** on the Load Balancer to block known malicious payloads and DDOS attempts (e.g., Cloudflare WAF, GCP Cloud Armor).
- Restrict API access to specific geographic regions (Geo-blocking) if operations are country-specific.
