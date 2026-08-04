# Enterprise Optimization Guide

## 1. Memory Optimization (Mobile)
- **Image Cache:** Use `cached_network_image` with `memCacheWidth` and `memCacheHeight` to prevent loading full-resolution images into RAM.
- **Widget Lifecycle:** Utilize `const` constructors aggressively. Prefer `StatelessWidget` with `Consumer` over `ConsumerWidget` where possible.
- **Provider Lifecycle:** Use `.autoDispose` on Riverpod providers (e.g., `StateProvider.autoDispose`) for screens that are popped to prevent memory leaks.
- **Object Allocation:** Avoid mapping large JSON payloads on the main UI thread. Use `compute()` for parsing heavy API responses.

## 2. CPU Optimization
- **Background Workers:** Move heavy computations (e.g., aggregating 10,000 local DCR rows) to an Isolate using `compute()`.
- **Sync Engine:** Throttle the Sync Engine to process 50 records per batch to avoid UI stuttering.
- **GPS Processing:** Set `distanceFilter: 50` (meters) instead of time-based tracking to reduce unnecessary CPU wake-ups on the location listener.

## 3. Battery Optimization
- **GPS Battery Usage:** Use `Accuracy.balanced` (Block level, ~100m) for background tracking instead of `Accuracy.high` (GPS chip, ~10m) unless explicitly punching in/out.
- **WorkManager:** Batch background syncs to occur every 15 minutes (`PeriodicTask`) rather than keeping a persistent connection open.

## 4. Database Optimization (Cloud SQL)
- **Indexes:** Ensure B-Tree indexes exist on `user_id`, `created_at`, and `status` columns for reporting tables.
- **Pagination:** Implement Keyset Pagination (Cursor-based) for infinite scrolling (Audit Logs, Feed) instead of Offset Pagination to avoid slow deep-scans.
- **Batch Processing:** Use SQL `INSERT ... ON CONFLICT` for bulk upserts during Master Data sync instead of row-by-row operations.

## 5. Image Optimization
- **Compression:** Mobile app MUST compress images (Selfies, Receipts) using `flutter_image_compress` (target ~500KB, 80% quality) before uploading.
- **Thumbnails:** API should generate and serve thumbnails for lists, only downloading full-res images when requested.
