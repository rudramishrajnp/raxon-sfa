# Key Test Cases

## TC001: JWT Authentication
- **Pre-condition:** Valid credentials exist.
- **Steps:** Enter User ID and Password -> Click Login.
- **Expected Result:** Successful login, JWT token stored securely, user navigated to role-specific dashboard.

## TC002: Offline Attendance Punch-In
- **Pre-condition:** App is offline (Airplane mode).
- **Steps:** Navigate to Punch In -> Capture Photo -> Submit.
- **Expected Result:** Attendance saved locally, added to Sync Queue.

## TC003: Auto-Sync on Network Restore
- **Pre-condition:** Device has pending offline records, internet connection restored.
- **Steps:** Turn off Airplane mode. Wait for Sync Engine tick.
- **Expected Result:** Pending records uploaded successfully, local status updated to 'Synced'.

## TC004: Manager MTP Approval
- **Pre-condition:** MR has submitted MTP. Manager is logged in.
- **Steps:** Go to Manager Dashboard -> MTP Approvals -> Select MTP -> Click Approve.
- **Expected Result:** MTP status changes to Approved, MR receives notification.

## TC005: Super Admin Feature Toggle
- **Pre-condition:** Logged in as Super Admin.
- **Steps:** Go to Master Control -> Feature Toggles -> Disable 'Primary Sales' -> Save.
- **Expected Result:** 'Primary Sales' module disappears from all MR/Manager apps on next sync.
