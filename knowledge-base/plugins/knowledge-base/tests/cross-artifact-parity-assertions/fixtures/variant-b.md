---
serviceName: orders-failover
endpoint: https://failover.internal.example/orders
timeout: 3000
retries: 2
permissions:
  - orders:read
  - orders:write
---

# Order service deployment guide

Use this runbook when deploying the order service. Keep environment-specific
endpoints separated while preserving identical operational timeouts, retries,
and permissions across variants.
