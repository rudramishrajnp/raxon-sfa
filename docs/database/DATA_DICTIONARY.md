# Data Dictionary & Table Documentation

## Table: `users`
**Purpose:** Stores user profiles and authentication details.
| Column | Type | Nullable | Default | Description | Validation Rules |
|--------|------|----------|---------|-------------|------------------|
| id | UUID | No | uuid() | Primary Key | - |
| role_id | UUID | No | - | Foreign Key to Roles | - |
| first_name | VARCHAR | No | - | User's First Name | Max 50 chars |
| last_name | VARCHAR | No | - | User's Last Name | Max 50 chars |
| email | VARCHAR | No | - | User's Email | Valid Email Format |
| password_hash | VARCHAR | No | - | Bcrypt hashed password | - |
| device_id | VARCHAR | Yes | null | Bound Device ID | - |
| is_active | BOOLEAN | No | true | Soft delete flag | - |
| created_at | TIMESTAMP | No | now() | Creation timestamp | - |

## Table: `attendance`
**Purpose:** Logs daily punch-in and punch-out events.
| Column | Type | Nullable | Default | Description | Validation Rules |
|--------|------|----------|---------|-------------|------------------|
| id | UUID | No | uuid() | Primary Key | - |
| user_id | UUID | No | - | Foreign Key to Users | - |
| punch_in_time | TIMESTAMP | No | - | Time of check-in | - |
| punch_in_lat | DECIMAL | No | - | GPS Latitude | -90 to 90 |
| punch_in_lng | DECIMAL | No | - | GPS Longitude | -180 to 180 |
| punch_in_selfie | VARCHAR | Yes | null | URL to selfie image | Valid URL |
| punch_out_time | TIMESTAMP | Yes | null | Time of check-out | >= punch_in_time |
| status | VARCHAR | No | 'Pending'| Approval Status | Pending/Approved/Rejected |

## Table: `dcr` (Daily Call Report)
**Purpose:** Logs visits to doctors and chemists.
| Column | Type | Nullable | Default | Description | Validation Rules |
|--------|------|----------|---------|-------------|------------------|
| id | UUID | No | uuid() | Primary Key | - |
| user_id | UUID | No | - | Foreign Key to Users | - |
| entity_id | UUID | No | - | Doctor/Chemist ID | - |
| entity_type | VARCHAR | No | - | DOCTOR or CHEMIST | Enum |
| visit_time | TIMESTAMP | No | - | Timestamp of visit | - |
| is_productive| BOOLEAN | No | false | Resulted in an order? | - |
| sync_id | UUID | No | - | Mobile Offline UUID | Unique constraint |

## Table: `sync_queue` (Local Only)
**Purpose:** Manages offline payloads waiting to sync to the server.
| Column | Type | Nullable | Default | Description | Validation Rules |
|--------|------|----------|---------|-------------|------------------|
| id | INTEGER | No | Auto | Primary Key | - |
| sync_id | VARCHAR | No | - | Unique Job ID | - |
| entity_type | VARCHAR | No | - | e.g. DCR, EXPENSE | - |
| payload | TEXT | No | - | JSON serialized data | Valid JSON string |
| status | VARCHAR | No | 'pending'| pending, failed, sync | - |
| retry_count | INTEGER | No | 0 | Number of attempts | <= 3 |
