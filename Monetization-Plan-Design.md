Monetization Plan Design (MVP)

- Pricing (USD):
  - Monthly: $9.99 USD recurring
  - Annual: $99.99 USD recurring
  - One-time: $27 for The Manual (10 credits)
  - One-time: $5 for Basic Report
  - One-time: $7 for Two-User Report

- Products/Price IDs (placeholders in repo; replace with Stripe price IDs):
  - PRICE_ID_MONTHLY_9_99
  - PRICE_ID_ANNUAL_99_99
  - PRICE_ID_MANUAL_27
  - PRICE_ID_ONE_TIME_5
  - PRICE_ID_ONE_TIME_7

- Flows:
  - Checkout (subscription) for monthly and annual plans
  - Checkout (one-time) for one-time products
  - Webhook processing to grant access (credits) or direct download permissions

- Access gating:
  - After purchase, user gains access to corresponding digital report.
  - Access stored on user profile in Supabase; minimal identifiers recorded.

- Credits mapping (SSOT alignment):
  - The Manual (27) -> +10 credits
  - Basic Report (5) -> +1 credit
  - Two-User Report (7) -> +2 credits
  - Monthly/Annual purchases may grant ongoing access or credits per cycle as defined in future releases.

- Security/compliance:
  - Secrets in env vars; receipts generated via Stripe; tax handling in Stripe when configured.
