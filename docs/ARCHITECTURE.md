# Raxon Architecture Documentation

## Core Architecture
The Raxon Sales & Operations App uses **Clean Architecture** with a **Feature-First folder structure**.

### Layers
1. **Presentation Layer (`presentation/`)**: Contains UI components, Screens, and Riverpod State Providers.
2. **Domain Layer (`domain/`)**: Contains core business logic, Entities, and Repository Interfaces (currently merged with data for simplicity).
3. **Data Layer (`data/`)**: Contains Data Models, Repository Implementations, and Services for API/Local Database interaction.

### State Management
- **Riverpod**: Used for dependency injection, reactive state management, and async data caching (`FutureProvider`, `NotifierProvider`).

### Database (Drift)
- A local SQLite database is managed using **Drift**.
- Used for caching offline actions: Attendance, MTP, DCR, Expense, and Background Location.
- Synchronized with the server via the `SyncEngine`.

### Network (Dio)
- **Dio** handles REST API communication.
- Custom interceptors handle Logging, Authentication (JWT), Error mapping, and Timeout logic.

## Security
- JWT-based API authorization.
- Token refresh interceptor (implemented in concept).
- Obfuscated release builds (ProGuard/R8).
