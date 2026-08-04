# Final Release Package & Operations Plan

## 1. Release Guide
1. **API Deployment:** Deploy backend Node.js API to Production (Cloud Run).
2. **Database Migration:** Run `npm run migration:run` on Production Cloud SQL.
3. **App Build:** Build Android AAB and iOS IPA with `EnvConfig.prod`.
4. **Publishing:** Upload to respective app stores or MDM.

## 2. Deployment Checklist
- [ ] Verify Production `.env` URLs point to `api.raxon.com`.
- [ ] Verify SSL certificates for the API Gateway are active.
- [ ] Ensure Firebase Production project is linked and `google-services.json` / `GoogleService-Info.plist` are correct.
- [ ] Conduct final Smoke Test in Production environment using a test admin account.

## 3. Rollback Plan
- **Mobile App:** Cannot be easily rolled back once users update. If a critical bug is found, a hotfix patch (1.0.1) must be built and expedited through store reviews.
- **Backend API:** Cloud Run allows instant traffic splitting. If v1.0.0 API fails, instantly revert 100% of traffic to the previous revision via the GCP console.
- **Database:** If a migration corrupts data, restore the automated snapshot taken prior to deployment (RTO: < 15 mins).

## 4. Support Plan
- **Level 1 (Helpdesk):** Handles MR password resets, device unbinding requests, and general app usage queries.
- **Level 2 (Admin Operations):** Manages missing master data, route reassignments, and manual approval overrides.
- **Level 3 (Engineering):** Investigates API failures, Sync Queue conflicts, and app crashes reported via Crashlytics.

## 5. Maintenance Plan
- **Weekly:** Review Firebase Crashlytics reports and APM (Application Performance Monitoring) latency stats.
- **Monthly:** Database vacuum/analyze maintenance and index rebuilds.
- **Quarterly:** Flutter SDK and dependency updates to patch security vulnerabilities.
