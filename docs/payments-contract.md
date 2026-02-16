# Payments Contract

| path | method | input | output | auth | Stripe objects | Supabase writes | env vars |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/api/payments/create-checkout` | `POST` | `{ "plan_code": "manual_27" | "os_monthly_9_99" }` | `{ "url": string }` | Required (Supabase session) | `checkout.session` | None | `STRIPE_SECRET_KEY`, `STRIPE_PRICE_MANUAL_27`, `STRIPE_PRICE_OS_MONTHLY_9_99`, `NEXT_PUBLIC_SITE_URL` or `SITE_URL` |
| `/api/payments/webhook` | `POST` | Stripe webhook payload (raw body) | `{ received: true }` | None (Stripe signature) | `event`, `checkout.session`, `subscription`, `invoice` | `stripe_events`, `profiles`, `purchases` | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |
| `/api/entitlements/me` | `GET` | None | `{ has_manual, subscription_status, plan_code, current_period_end }` | Required (Supabase session) | None | `profiles` (read-only) | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (server), `SUPABASE_ANON_KEY` (session validation) |
| `lib/stripe.ts` | Internal | N/A | N/A | Server-only | `checkout.session` | None | `STRIPE_SECRET_KEY` |

Entitlement enforcement:
- `pages/api/engine/full-report.ts` (server-side gating for paid action)
