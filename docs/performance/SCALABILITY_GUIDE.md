# Enterprise Scalability Guide

## 1. Horizontal Scaling
- The Node.js Backend is fully stateless (JWT for Auth). 
- **Recommendation:** Deploy across multiple instances (e.g., Google Cloud Run, AWS ECS).
- **Auto-Scaling:** Configure auto-scaling rules based on CPU utilization (target 70% threshold to spin up new instances).

## 2. Vertical Scaling
- **Database:** PostgreSQL should scale vertically. Start with 2 vCPU / 8GB RAM, and scale to 8 vCPU / 32GB RAM as the dataset grows over 500GB.
- Ensure `work_mem` and `shared_buffers` in PostgreSQL are tuned to match the instance RAM.

## 3. Load Balancer & CDN
- **Load Balancer:** Place Nginx or Cloud Load Balancing in front of the instances to distribute traffic via Round Robin or Least Connections.
- **CDN:** Serve all static assets (Web Admin panel build, uploaded images, PDFs) via Cloudflare or Cloud CDN to reduce server egress bandwidth by 80%.

## 4. Redis Cache Implementation
- Introduce Redis to cache:
  - Master Data (Territories, Pricing, Products).
  - RBAC Policies.
  - Active Sessions.
- Cache invalidation triggers must be added to Admin CRUD APIs.

## 5. Message Queue (Future Proofing)
- When scaling beyond 10,000 users, decouple heavy tasks (Email Reports, Push Notification Bursts, Data Export) using a Message Broker (RabbitMQ, Kafka, or Google Cloud Pub/Sub).
