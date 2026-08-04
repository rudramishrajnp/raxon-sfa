# Source Code Index

## Folder Structure (High Level)
```
/
├── android/            # Android Native Config (build.gradle, AndroidManifest.xml)
├── ios/                # iOS Native Config (Podfile, Info.plist, Runner.xcworkspace)
├── web/                # Web build entry points
├── assets/             # Images, SVGs, Fonts
├── docs/               # Architecture, Security, API, QA, and Release Documentation
├── lib/
│   ├── core/           # Constants, Utils, Network, Theme, DB Setup
│   ├── features/       # Feature-driven modules (auth, mtp, dcr, attendance, etc.)
│   ├── shared/         # Reusable UI widgets and common providers
│   └── main.dart       # Entry Point
├── server/             # Node.js Express Backend API
├── pubspec.yaml        # Flutter Dependencies
└── package.json        # Backend Dependencies
```

## Features List
- **Auth:** `lib/features/auth/` (LoginScreen, AuthRepository, AuthProvider)
- **Attendance:** `lib/features/attendance/` (PunchInScreen, GpsTracker, AttendanceModel)
- **MTP:** `lib/features/mtp/` (MtpListScreen, MtpForm, MtpRepository)
- **DCR:** `lib/features/dcr/` (DcrScreen, GeofenceValidator, DoctorCheckIn)
- **Expense:** `lib/features/expense/` (ExpenseForm, ReceiptUpload, ExpenseProvider)
- **Manager:** `lib/features/manager/` (ManagerDashboard, ApprovalQueue, TeamTracker)
- **Admin:** `lib/features/admin/` (AdminPanel, UserManagement, MasterDataSync)

## Core Components
- **Sync Engine:** `lib/core/sync/sync_engine.dart`
- **Local DB:** `lib/core/db/app_database.dart` (Drift SQLite)
- **Network Client:** `lib/core/network/api_client.dart` (Dio Client + Interceptors)
- **Storage:** `lib/core/storage/secure_storage.dart`

## Backend API Index
- `/server/routes/auth.ts`
- `/server/routes/dcr.ts`
- `/server/routes/mtp.ts`
- `/server/routes/attendance.ts`
- `/server/routes/master_data.ts`
