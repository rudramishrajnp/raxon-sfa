# Database Security Guide

## 1. Encryption
- **Data at Rest:** The Cloud SQL instance uses Google Cloud's default AES-256 encryption at rest.
- **Data in Transit:** All connections to the database from the application servers enforce SSL/TLS encryption.

## 2. Sensitive Data
- **Passwords:** Never stored in plain text. Hashed using Bcrypt with a salt round of 10.
- **PII (Personally Identifiable Information):** Doctor and Chemist contact details are protected under standard RBAC.

## 3. Secure Storage (Mobile)
- SQLite database on the mobile device is protected by the OS sandbox.
- JWT Access and Refresh Tokens are NOT stored in SQLite. They are stored in the platform's Secure Storage (Keychain for iOS, Keystore for Android).

## 4. Access Rules (RBAC)
- Database users and roles are restricted.
- The backend application connects to the database using a service account with standard CRUD privileges, NOT as a superuser.
- DDL (Schema changes) can only be executed by the CI/CD pipeline using a separate, highly restricted deployment credential.
