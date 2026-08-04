# Regression Testing Checklist

## 1. Authentication Core
- [ ] Login with valid credentials.
- [ ] Login with invalid credentials (verify error message).
- [ ] Verify Auto-login on app restart.
- [ ] Verify Session expiry and auto-logout.

## 2. MR Core Workflows
- [ ] Punch-In with valid GPS.
- [ ] Submit MTP.
- [ ] Check-In at Doctor Location.
- [ ] Submit Daily Expense with receipt upload.

## 3. Offline Core Workflows
- [ ] Perform DCR offline.
- [ ] Restore network and verify background sync completes.
- [ ] Verify Conflict Resolution on edits.

## 4. Manager Workflows
- [ ] Approve/Reject MTP.
- [ ] Approve/Reject Expense.
- [ ] Verify live tracking map loads without crashing.

## 5. Admin & Super Admin Workflows
- [ ] Create/Edit new Report config.
- [ ] Export Audit Log.
- [ ] Toggle Feature (ON -> OFF) and verify app response.
