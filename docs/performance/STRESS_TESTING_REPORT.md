# Enterprise Stress Testing Report

## 1. Maximum Concurrent Users (Break Point)
- **Threshold:** ~7,800 concurrent requests/second on a single instance.
- **Failure Mode:** Node.js Event Loop Blocked, Nginx 502 Bad Gateway.

## 2. Database Limits
- **Max Connections Reached:** 200 (Default Pool Size).
- **Resolution:** Implemented PgBouncer to multiplex 10,000+ client connections to 100 actual database connections.

## 3. Queue Limits (Offline Sync Burst)
- **Scenario:** 1,000 MRs come online simultaneously at 6:00 PM and sync day's data.
- **Observation:** Spike in Write IOPS on PostgreSQL.
- **Resolution:** API rate limits applied (`429 Too Many Requests`). Mobile client utilizes exponential backoff for retries.

## 4. Notification Burst
- **Scenario:** Super Admin sends Broadcast to 10,000 users.
- **Observation:** FCM handles the burst effortlessly; backend takes 3 seconds to dispatch the payload to FCM.

## 5. File Upload Burst
- **Scenario:** 500 users upload 2MB Expense Receipts simultaneously.
- **Observation:** High network bandwidth consumption. Direct-to-S3/Firebase upload strategy successfully bypassed the backend server, preventing crash.
