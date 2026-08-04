# Enterprise Load Testing Report

## 1. Testing Parameters
- **Tool Used:** JMeter, k6
- **Test Duration:** 60 minutes per stage
- **Target:** API Endpoints (Login, Sync, Submit DCR, Location Ping)

## 2. Load Simulation Results

| Users | CPU Usage | Memory Usage | Avg Response Time | Failure Rate | Status |
|-------|-----------|--------------|-------------------|--------------|--------|
| 100   | 15%       | 450 MB       | 120ms             | 0.00%        | ✅ Pass |
| 500   | 30%       | 850 MB       | 145ms             | 0.00%        | ✅ Pass |
| 1,000 | 55%       | 1.2 GB       | 190ms             | 0.01%        | ✅ Pass |
| 5,000 | 85%       | 2.8 GB       | 450ms             | 0.15%        | ⚠️ Warn|
|10,000 | 98%       | 4.5 GB       | 1200ms            | 2.40%        | ❌ Fail|

## 3. Findings
- The application scales beautifully up to 1,000 concurrent active users on a single standard node.
- At 5,000 users, response times degrade slightly due to database connection pool saturation.
- At 10,000 users, CPU bottlenecks on the Node.js event loop cause timeout failures (2.4% failure rate).

## 4. Remediation for 10k+ Users
- Horizontal scaling required (min 4 instances behind Load Balancer).
- Increase PgBouncer connection limits.
- Implement Redis caching for Master Data to reduce DB hits.
