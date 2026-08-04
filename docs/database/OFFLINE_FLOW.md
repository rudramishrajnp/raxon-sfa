# Offline Database Flow

## 1. Local Storage (Drift SQLite)
The Flutter app uses Drift to maintain a local mirror of the user's relevant data.
- Upon login, a full Sync retrieves Master Data.
- Daily transactional data is read strictly from the local SQLite database to ensure the app is fast and operates seamlessly in airplane mode.

## 2. Sync Queue
When a user performs a write action (e.g., Submits MTP, Punches In) while offline:
1. The action is written to the local table (e.g., `dcr`).
2. A serialized JSON representation of the API request is written to the `sync_queue` table with status `pending`.

## 3. Upload Flow
1. Network connection is restored.
2. `SyncEngine` queries `sync_queue` for `pending` records.
3. Records are sent to the API in order.
4. If successful (200/201), the local queue record is deleted, and the local table's sync status is updated.

## 4. Conflict Resolution
- **Server Wins:** If the server detects a timestamp conflict (e.g., Admin edited a Doctor's address while MR was offline), the Server version overrides the local version during the next Download Sync.
- **Idempotency Keys:** Every queued request uses a unique UUID `sync_id` generated on the mobile device. This prevents double-entries if the network drops before the API response is received.
