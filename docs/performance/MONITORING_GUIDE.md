# Enterprise Monitoring & Observability Guide

## 1. Firebase Crashlytics & Performance (Mobile)
- **Crashlytics:** Enabled for non-fatal exceptions (e.g., API Parsing errors) and fatal crashes. Ensure DSYMs and ProGuard mapping files are uploaded during CI/CD.
- **Performance Monitoring:** Use custom traces for critical flows: `trace_sync_engine`, `trace_login_flow`, `trace_mtp_render`.

## 2. Server Health (Backend)
- Implement `/v1/health` endpoint for Load Balancer health checks.
- **Prometheus & Grafana:** Expose Node.js metrics (Event Loop Lag, Active Handles, Memory Heap) via `prom-client` and visualize on Grafana.

## 3. API Health & Tracing
- **Datadog / New Relic:** Integrate APM to monitor HTTP request latency, error rates, and throughput.
- **Trace IDs:** Generate a `X-Request-ID` at the API Gateway and pass it through all logs to trace the lifecycle of a single request across services.

## 4. Database Health
- Enable **Query Insights** (Cloud SQL) or **pg_stat_statements** to continuously identify the top 5 slowest queries.
- Set up alerts for:
  - CPU > 80% for 5 minutes.
  - Active Connections > 90% of pool limit.
  - Disk Space < 20% remaining.

## 5. Log Aggregation
- Stream all Node.js stdout/stderr logs to Cloud Logging (Stackdriver) or ELK Stack (Elasticsearch, Logstash, Kibana) in JSON format for structured querying.
