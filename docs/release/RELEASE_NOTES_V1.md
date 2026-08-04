# Release Notes - Version 1.0.0

## Features
- **Authentication:** Secure JWT Login with Device Binding and Auto-login capabilities.
- **Attendance Module:** Real-time Punch-In/Punch-Out with Selfie capture and GPS logging.
- **MTP (Monthly Tour Plan):** Calendar-based planning, draft mode, and submission workflows.
- **DCR (Daily Call Report):** Doctor/Chemist check-in, geofence validation, sampling, and order booking.
- **Expense Management:** Submit TA/DA/Misc expenses with receipt attachments.
- **Manager Panel:** Review and Approve/Reject MTPs and Expenses. Live team tracking map.
- **Offline Sync Engine:** Work seamlessly without internet. Drift SQLite caches data and syncs automatically in the background when connectivity is restored.
- **Notifications:** Real-time push notifications for approvals and broadcasts.

## Bug Fixes
- Initial Release - N/A

## Known Limitations
- Background GPS tracking may experience slight delays (up to 5 minutes) depending on the mobile device's battery optimization OS rules (e.g., MIUI, ColorOS).
- Sync Queue processes a maximum of 50 records per batch to prevent server overload. Large offline sessions may take multiple sync cycles to complete.
