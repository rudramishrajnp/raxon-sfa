# Database Migration & Index Strategy Guide

## 1. Database Version History
- **v1.0.0 (Initial Release):** Schema creation for Users, Auth, Territory, MTP, DCR, Expense, and Sync Queue.

## 2. Migration Rules
- **Tooling:** All remote database migrations are managed via standard ORM migration scripts (e.g., TypeORM/Drizzle migrations).
- **Immutability:** Once a migration script is deployed to UAT or PROD, it MUST NOT be altered. New changes require a new migration script.
- **Local Database (Drift):** Local schema migrations are handled inside Drift's `migration` block using `schemaVersion`. Increment `schemaVersion` for any table change, and write the migration logic to add columns or recreate tables.

## 3. Index Strategy
- **Primary Indexes:** B-Tree indexes are automatically created on all `id` (UUID) primary keys.
- **Foreign Key Indexes:** B-Tree indexes MUST be created on all foreign key columns (e.g., `user_id`, `territory_id`) to optimize `JOIN` operations.
- **Composite Indexes:**
  - `attendance(user_id, punch_in_time)`: Optimizes daily attendance queries.
  - `dcr(user_id, visit_time)`: Optimizes chronological DCR fetching.
- **Search Indexes:** 
  - `users(email)`: Unique index for fast login lookups.
  - Gin / GiST indexes can be added later if full-text search on Doctor/Chemist names is required.

## 4. Upgrade Path & Rollback Strategy
- **Upgrade:** Run `npm run typeorm migration:run` during the CI/CD pipeline before deploying the new backend version.
- **Rollback:** Every migration script must have a `down()` method. In case of critical failure, run `npm run typeorm migration:revert` to rollback the last applied migration.
- **Mobile Rollback:** SQLite does not easily rollback. If a schema migration fails locally, the fallback is to drop the local database and force a fresh master data sync from the server.
