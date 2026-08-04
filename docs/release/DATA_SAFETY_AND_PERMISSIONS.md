# Data Safety & Permissions Documentation

## 1. Google Play Data Safety Declaration

**Does your app collect or share any of the required user data types?** Yes.
**Is all of the user data collected by your app encrypted in transit?** Yes (HTTPS/WSS).
**Do you provide a way for users to request that their data be deleted?** Yes (via HR/Admin).

### Data Types Collected:
1. **Location (Precise & Approximate):** Collected for functionality and fraud prevention (Geofencing, Attendance). Not shared with 3rd parties.
2. **Photos/Videos:** Collected for functionality (Selfies, Receipts). Not shared.
3. **Personal Info (Name, Email, User ID):** Collected for account management.
4. **Device or Other IDs:** Collected for fraud prevention (Device Binding).

## 2. Permissions Documentation (Android & iOS)

### Location
- **Android:** `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`, `ACCESS_BACKGROUND_LOCATION`
- **iOS:** `NSLocationWhenInUseUsageDescription`, `NSLocationAlwaysAndWhenInUseUsageDescription`
- **Reason:** Required to validate the Medical Representative's physical presence at Doctor/Chemist clinics (Geofencing) and to track the daily route for Managerial review. Background access is required because MRs may minimize the app while traveling between clinics.

### Camera
- **Android:** `CAMERA`
- **iOS:** `NSCameraUsageDescription`
- **Reason:** Required for capturing real-time selfies during Attendance Punch-in and for taking photos of bills/receipts for Expense claims.

### Storage / Photo Library
- **Android:** `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE` (or Android 13+ equivalents `READ_MEDIA_IMAGES`)
- **iOS:** `NSPhotoLibraryUsageDescription`
- **Reason:** Required to upload existing receipt images from the gallery for Expense claims and to cache generated PDF reports locally.

### Notifications
- **Android:** `POST_NOTIFICATIONS`
- **iOS:** Push Notification Entitlement
- **Reason:** Required to alert MRs of MTP/Expense approvals, rejections, and urgent Broadcast messages from Admins.
