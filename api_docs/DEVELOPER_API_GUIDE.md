# Raxon Developer API Guide

## 1. Introduction
This guide provides conventions and integration instructions for the Raxon Sales & Operations backend API. The API is RESTful, uses JSON for serialization, and is secured via JWT (JSON Web Tokens).

## 2. API Naming Standards
- All endpoints are prefixed with the API version: `/v1/`
- Resources are pluralized nouns: `/v1/users`, `/v1/doctors`.
- Actions on resources use verbs in the URL path only when standard CRUD maps poorly: `/v1/attendance/punch-in`.
- `snake_case` is used for JSON keys to maintain consistency across the stack (mapped to `camelCase` in Dart via json_serializable).

## 3. Authentication Flow
1. **Login:** Client sends `userId`, `password`, and `deviceId` to `/auth/login`.
2. **Token Storage:** If successful, API returns `accessToken` (15m expiry) and `refreshToken` (7d expiry). Client securely stores these (Flutter Secure Storage).
3. **Protected Requests:** Client includes `Authorization: Bearer <accessToken>` in headers.
4. **Token Refresh:** When `accessToken` expires (401), the Dio Interceptor transparently calls `/auth/refresh` using the `refreshToken`, stores the new tokens, and retries the failed request.

## 4. Repository & Offline Sync Flow
The Flutter app uses a **Repository Pattern** combined with a **Sync Engine**:
1. **Action Triggered:** e.g., MR Submits DCR.
2. **Network Check:** If offline, the action is serialized and stored in Drift SQLite (`OfflineSyncQueue`).
3. **Background Sync:** The `SyncEngine` listens to connectivity changes. When online, it processes the queue sequentially.
4. **Idempotency:** All POST/PUT requests include a client-generated UUID (`sync_id`) in headers to prevent duplicate records if a request times out but succeeds on the server.

## 5. Versioning Strategy
- Major versions (v1, v2) are included in the URL.
- Minor, non-breaking additions (new fields in responses) do not require a version bump.
- Mobile clients must be built to ignore unknown JSON keys.
