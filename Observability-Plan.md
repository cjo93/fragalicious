Observability Plan for Monetization

- Metrics:
  - Payments succeeded, payments failed, and retries (per period and per price)
  - Webhook delivery status (delivered, failed, retried, throttled)
  - Access gating events (grant access, revoke access)
  - Download deliveries (successful deliveries per user)

- Logs:
  - Centralized logs for payments events and webhook events with correlation IDs to user sessions
  - Do not log full card details or sensitive data

- Dashboards:
  - Payments dashboard: total revenue, active subscriptions, refunds, chargebacks (if applicable)
  - Webhooks dashboard: success vs failure rates, latency, retry counts
  - Access/gating dashboard: counts of successful unlocks and failed unlocks

- Alerts:
  - Notify on webhook failures more than N consecutive times
  - Notify on sudden drop in successful purchases
  - Notify on authentication/authorization gate failures

- Health checks:
  - /health/payments endpoint to reflect readiness
