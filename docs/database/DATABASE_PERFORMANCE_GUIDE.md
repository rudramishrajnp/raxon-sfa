# Database Performance & Optimization Guide

## 1. Optimization Strategy
- **Denormalization:** Avoid over-normalizing reporting data. Use materialized views for heavy analytic queries (e.g., Monthly Sales dashboards).
- **Connection Pooling:** The backend API must use connection pooling (e.g., PgBouncer or native ORM pooling) to handle concurrent connections from thousands of MRs.

## 2. Query Optimization
- Avoid `SELECT *`. Always specify required columns to reduce memory overhead and network payload size.
- Ensure all `WHERE` clauses hit indexed columns.
- Use `EXPLAIN ANALYZE` on any query taking longer than 100ms.

## 3. Caching Strategy
- **Application Level:** Redis is used to cache master data (Products, Pricing, Territories) that rarely changes. Cache is invalidated on updates.
- **Mobile Level:** Drift SQLite acts as the primary cache for the mobile app. The app reads from SQLite and only hits the API during explicit sync events.

## 4. Pagination
- All list APIs (e.g., `/v1/doctors`, `/v1/dcr`) implement **Cursor-Based Pagination** or **Limit/Offset Pagination**.
- Limit/Offset is acceptable for small admin tables. Cursor-based pagination must be used for infinitely growing tables like Audit Logs or DCR to prevent performance degradation on deep pages.
