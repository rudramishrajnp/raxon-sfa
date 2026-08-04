# Development & Architecture Guide

## 1. Architecture Guide
Raxon strictly follows **Feature-First Clean Architecture**.
- Every feature (e.g., `attendance`, `dcr`) has its own `presentation`, `domain`, and `data` layers.
- Avoid cross-feature dependencies in the `data` layer. If `dcr` needs `auth` data, pass it via providers in the `presentation` layer or core services.

## 2. Module Dependency Guide
- **Core Module:** Independent. Contains constants, network config, storage config, theme.
- **Shared Widgets:** Independent. Contains UI components used across multiple features.
- **Features:** Depend on `core` and `shared_widgets`. Features should not directly import screens from other features (use GoRouter for navigation).

## 3. Coding Standards
- **Immutability:** Use `freezed` for all data models and state classes.
- **Null Safety:** Strict null safety. Avoid `!` operator unless absolutely certain; prefer `?` and default values.
- **State Management:** Avoid `StatefulWidget` for business logic. Use `ConsumerWidget` and `NotifierProvider`.
- **Linting:** Follow standard `flutter analyze` rules.

## 4. Development Guidelines
- **Offline-First:** All new operational features MUST write to Drift first, then queue for sync.
- **UI Responsiveness:** Use `AppSizes` and `AppTypography` constants instead of hardcoded numbers.
- **Error Handling:** Catch exceptions in repositories, map them to custom `Failure` classes, and return clean states to the UI.
- **Testing:** Every new Provider must have unit tests. Every complex screen must have widget tests.
