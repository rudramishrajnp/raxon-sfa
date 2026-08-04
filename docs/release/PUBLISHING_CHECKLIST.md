# App Publishing Checklists

## 1. Google Play Console Checklist
- [ ] Create App in Google Play Console.
- [ ] Complete "Data Safety" form (refer to `DATA_SAFETY_AND_PERMISSIONS.md`).
- [ ] Complete "Content Rating" questionnaire.
- [ ] Upload Store Listing Assets (Title, Description, Icon, Feature Graphic, Screenshots).
- [ ] Upload `.aab` file to internal testing track.
- [ ] Provide test account credentials for Google Reviewers.
- [ ] Promote release to Closed Testing or Production.

## 2. App Store Connect Checklist
- [ ] Create App ID and Provisioning Profiles in Apple Developer Portal.
- [ ] Create App in App Store Connect.
- [ ] Complete App Privacy form.
- [ ] Upload Store Listing Assets (Name, Subtitle, Keywords, Description, Screenshots).
- [ ] Upload `.ipa` build via Transporter.
- [ ] Set up TestFlight internal testing.
- [ ] Provide test account credentials and a demo video of the background tracking for Apple Reviewers.
- [ ] Submit for Review.

## 3. Enterprise Distribution Checklist (MDM)
If bypassing public stores using Mobile Device Management (MDM):
- [ ] Generate standard APK (`app-release.apk`).
- [ ] Generate Enterprise Signed IPA using Apple Enterprise Developer Certificate.
- [ ] Upload artifacts to MDM server (e.g., Microsoft Intune, VMware Workspace ONE).
- [ ] Assign app to MR/Manager employee groups.
- [ ] Configure MDM App Config to push `.env.production` URLs automatically (if supported).
