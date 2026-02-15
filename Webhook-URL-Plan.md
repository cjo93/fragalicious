Webhook URL Plan

- Production:
  - Public webhook endpoint: /api/payments/webhook on the production domain (https://defrag.app).
  - Public URL: https://defrag.app/api/payments/webhook
  - Webhook secret: provided by Stripe in the Stripe dashboard; used to verify signatures.

- Staging:
  - Staging webhook endpoint: https://staging.defrag.app/api/payments/webhook or a defined test URL.
  - Webhook secret: separate staging secret.

- Test workflow:
  - Use Stripe test mode to create test sessions and simulate events.
  - Validate endpoint receives and processes events with idempotency and proper error handling.

- Safety and gating:
  - Webhook processing should not leak sensitive data; ensure logs do not include full session data.
  - Add rate-limiting and basic security headers for webhook endpoint.
