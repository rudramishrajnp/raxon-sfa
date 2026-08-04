# Raxon API Error Reference

## HTTP Status Codes
The Raxon API uses conventional HTTP response codes to indicate the success or failure of an API request.

- **200 OK:** Request succeeded.
- **201 Created:** Resource created successfully.
- **400 Bad Request:** Validation failed or malformed request payload.
- **401 Unauthorized:** Invalid, expired, or missing JWT token.
- **403 Forbidden:** User lacks RBAC permissions for this action.
- **404 Not Found:** The requested resource (e.g., Doctor, Chemist) does not exist.
- **409 Conflict:** Data conflict (e.g., MTP already submitted for this month).
- **429 Too Many Requests:** Rate limit exceeded.
- **500 Internal Server Error:** Server-side failure.

## Standard Error Response Format
```json
{
  "error": {
    "code": "AUTH_001",
    "message": "Invalid password or user ID.",
    "details": {}
  }
}
```

## Business Error Codes
- `AUTH_001`: Invalid Credentials.
- `AUTH_002`: Device Binding Failed. Device ID does not match the registered device.
- `SYNC_001`: Offline Sync Conflict. Server version is newer.
- `GEO_001`: Geofence Validation Failed. User is outside the allowed radius.
- `MTP_001`: MTP Submission Deadline Passed (After 25th of the month).

## Retry Rules (Mobile Client)
- **401 Unauthorized:** The Dio Interceptor will automatically call `/auth/refresh` using the stored refresh token. If successful, the original request is retried.
- **5xx Server Errors / Network Timeout:** The request will be placed in the SQLite Offline Queue by the `SyncEngine` and retried exponentially when network connectivity is restored.
- **400/403/404:** No automatic retry. The UI will display the error message to the user.
