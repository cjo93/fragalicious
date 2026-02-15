Go/No-Go Criteria for Monetization Go-Live

- End-to-end tests:
  - All MVP price points (monthly, annual, and two one-time options) can be purchased via Stripe Checkout in staging.
  - Webhook events (checkout.session.completed, invoice.paid, subscription.*) delivered and handled idempotently.
  - Access gating works: authenticated user can download digital reports after purchase.

- Security & privacy:
  - Secrets are sourced from environment variables; no secrets in code or logs.
  - Payment endpoints validate input; proper error handling and rate limiting considerations exist.
  - Basic GDPR/CCPA considerations documented (data minimization, export/delete rights).

- Observability:
  - Stripe events have dashboards or logs with metrics for success, failure, and retries.
  - Health endpoint for payments exists and returns healthy state when payments are ready.

- Deployment controls:
  - A monetization feature branch exists (monetization/go-default) with a PR workflow.
  - A go-live runbook exists and has been tested in staging.

- Rollback:
  - Revert path is defined: revert deployment, disable webhooks, revoke access to monetized features if needed.

- Acceptance criteria:
  - All acceptance tests pass in staging; stakeholders sign off.
  - Production runbook is ready for go-live with explicit rollback steps.
