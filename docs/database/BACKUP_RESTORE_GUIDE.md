# Backup & Restore Guide

## 1. Backup Strategy (Remote PostgreSQL)
- **Automated Daily Backups:** Cloud SQL is configured to take automated snapshots every night at 2:00 AM system time.
- **Point-in-Time Recovery (PITR):** Write-Ahead Logs (WAL) are enabled, allowing the database to be restored to any specific minute within the last 7 days.
- **Manual Backups:** Can be triggered via the GCP Console or Super Admin dashboard before running major migrations.

## 2. Restore Strategy
- **Standard Restore:** In case of data corruption, a snapshot can be restored to a new Cloud SQL instance to verify data integrity before failing over.
- **Disaster Recovery (DR):** The production database is configured for High Availability (HA) across multiple zones. If the primary zone fails, Cloud SQL automatically fails over to the standby instance with zero data loss.

## 3. Retention Policy
- Daily snapshots are retained for 30 days.
- Weekly archives are retained for 6 months.
- Audit logs (stored in a separate table/bucket) are retained indefinitely for compliance purposes.
