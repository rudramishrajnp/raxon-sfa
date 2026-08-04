# Raxon Enterprise Database Documentation

## 1. Database Overview
The Raxon Sales & Operations App utilizes a dual-database architecture:
- **Remote Database (Cloud):** PostgreSQL managed via Cloud SQL. Acts as the single source of truth for all enterprise data, supporting heavy analytics, historical reporting, and master data management.
- **Local Database (Mobile):** SQLite managed via Drift. Acts as the offline cache and queue for mobile clients, enabling offline execution of field force operations (MTP, DCR, Expense, Attendance).

## 2. Database Version
- **Current Remote Version:** 1.0.0
- **Current Local Version:** 1.0.0

## 3. Architecture Overview
- **Server:** Node.js / Express backend with TypeORM or Drizzle interacting with PostgreSQL.
- **Mobile Client:** Flutter interacting with SQLite (Drift).
- **Synchronization:** The Sync Engine ensures bidirectional data consistency between SQLite and PostgreSQL using conflict resolution algorithms.

## 4. Storage Strategy
- **Master Data (Doctors, Products, Chemist):** Cached locally on the device upon login and synced periodically.
- **Transactional Data (DCR, Expenses):** Created locally, pushed to the server via the offline queue.
- **Heavy Media (Selfies, Receipts):** Stored in Cloud Storage (S3 / Firebase Storage). Only URL references are saved in the database.

## 5. Offline Strategy
- All MR-centric data entries (Attendance, DCR, Expenses) are designed to be "Offline-First".
- Data is written to SQLite locally and queued in a `sync_queue` table.
- When network connectivity is restored, the `SyncEngine` processes the queue sequentially.
