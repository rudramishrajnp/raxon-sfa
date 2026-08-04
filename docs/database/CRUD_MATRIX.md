# CRUD Matrix

| Module | Super Admin | Admin | Manager (RM/AM) | MR (Field Force) |
|--------|-------------|-------|-----------------|------------------|
| Users | CRUD | CRUD | R | R |
| Roles/RBAC | CRUD | R | - | - |
| Company | CRUD | R | - | - |
| Territory | CRUD | CRUD | R | R |
| Doctors/Chemists| CRUD | CRUD | CRUD | CR |
| Products | CRUD | CRUD | R | R |
| Pricing | CRUD | CRUD | R | R |
| Attendance | R | R | R, U (Approve)| CR |
| MTP | R | R | R, U (Approve)| CR |
| DCR | R | R | R | CR |
| Expenses | R | R | R, U (Approve)| CR |
| Orders | R | R | R | CR |
| Global Settings| CRUD | R | - | - |
| Audit Logs | R | R | - | - |

*(C = Create, R = Read, U = Update, D = Delete)*
