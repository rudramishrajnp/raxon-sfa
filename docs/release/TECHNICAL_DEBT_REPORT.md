# Technical Debt & Refactoring Report

## 1. Known Limitations
- **Offline Sync Queue Volume:** If a Medical Representative remains offline for several days, the Sync Queue can grow large. The current batch size limit of 50 may require multiple sync passes, delaying the availability of data on the admin dashboard.
- **Background Location Termination:** Aggressive battery optimization on certain Chinese Android OEMs (Xiaomi, Oppo, Vivo) may forcefully kill the background location service, leading to gaps in route tracking.

## 2. Future Refactoring (Priority 2)
- **State Management Consolidation:** While Riverpod is used extensively, some older UI components still use local `setState` for complex form handling. These should be refactored to use `NotifierProvider` for better testability.
- **Database Migrations on Mobile:** Drift schema migrations are currently linear. If multiple intermediate schema versions are skipped by a user, the migration logic could become complex. A more robust migration map is needed.

## 3. Dependency Debt
- Ensure Flutter SDK is updated to the latest stable release quarterly.
- Monitor `dio` and `drift` package updates for breaking changes.
