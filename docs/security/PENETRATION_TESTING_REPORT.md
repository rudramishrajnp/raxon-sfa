# Penetration Testing Report

## 1. Scope & Methodology
- **Scope:** API Endpoints, Mobile Application (Android/iOS), Web Admin Panel.
- **Methodology:** Black-box and Grey-box testing based on OWASP Mobile Top 10 and OWASP API Security Top 10.

## 2. Test Cases & Execution

### 2.1 Injection Attacks
- **SQL / NoSQL Injection:** Simulated injection strings on Login and Search inputs.
- **Result:** **PASS**. ORM (TypeORM/Drizzle) uses parameterized queries natively. No injection points found.

### 2.2 Cross-Site Scripting (XSS)
- **XSS:** Attempted stored XSS via MTP notes and Chat messages.
- **Result:** **PASS**. Flutter natively escapes HTML tags in `Text()` widgets. Admin panel sanitizes input via DOMPurify.

### 2.3 Broken Access Control (IDOR)
- **IDOR:** MR user attempted to fetch DCR records of another MR by manipulating the `user_id` in the API payload.
- **Result:** **PASS**. Backend validates that the `user_id` in the JWT matches the requested resource.

### 2.4 File Upload Abuse
- **Simulation:** Uploading malicious `.php` or `.exe` files instead of `.jpg` for Expense Receipts.
- **Result:** **PASS**. Backend strictly validates MIME types, uses sharp to re-encode images, and stores in isolated S3 buckets.

### 2.5 Session Hijacking
- **Simulation:** Replaying a captured JWT from another IP address.
- **Result:** **PARTIAL PASS**. JWT is valid across IPs. 
- **Recommendation:** Bind JWT to device fingerprint and implement shorter expiry.

### 2.6 Cross-Site Request Forgery (CSRF)
- **Result:** **PASS**. App relies on Authorization headers (Bearer Tokens), not cookies, mitigating standard CSRF vectors.

## 3. Summary
The Raxon backend and mobile applications show strong resilience against standard automated and manual penetration attacks. Minor adjustments to session handling are recommended.
