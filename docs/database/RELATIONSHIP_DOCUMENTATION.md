# Relationship Documentation

## 1. One-to-One Relationships
- **User <-> Device Binding:** A user is bound to exactly one `device_id` at a time.
- **DCR <-> Order:** A specific DCR (Visit) can result in exactly one consolidated Order.

## 2. One-to-Many Relationships
- **Company -> Divisions:** One Company has many Divisions.
- **Division -> Territories:** One Division has many Territories.
- **User -> Attendance:** One User logs multiple Attendance records over time.
- **MTP -> MTP Details:** One Monthly Tour Plan contains multiple daily entries.
- **Expense -> Receipts:** One Expense submission can have multiple attached receipts.

## 3. Many-to-Many Relationships
- **Users <-> Groups:** A user can belong to multiple chat groups; a group has multiple users. (Joined via `user_groups` table).
- **Roles <-> Permissions:** A role has many permissions; a permission belongs to many roles. (Joined via `role_permissions` table).

## 4. Referential Integrity & Cascade Rules
- **ON DELETE CASCADE:** 
  - `MTP` -> `MTP Details`: Deleting a Monthly Plan drops all its daily entries.
  - `Expense` -> `Expense Receipts`: Deleting an expense drops its image references.
- **ON DELETE RESTRICT:** 
  - `Users` -> `Roles`: Cannot delete a role if users are assigned to it.
  - `Company` -> `Divisions`: Cannot delete a company if it has active divisions.
- **ON UPDATE CASCADE:** Applied to all Foreign Key UUIDs to maintain integrity if a master ID is ever migrated.
