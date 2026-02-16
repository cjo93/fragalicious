# Environment Variables

## Secrets (server-only)
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`

## Public (client-safe)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (only if used client-side)
- `NEXT_PUBLIC_SITE_URL` (optional; fallback to `SITE_URL`)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Server (non-public)
- `SITE_URL` (fallback if `NEXT_PUBLIC_SITE_URL` not set)
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY` (server session validation if needed)

## Stripe Price Mapping (allowlist)
- `STRIPE_PRICE_MANUAL_27`
- `STRIPE_PRICE_OS_MONTHLY_9_99`

## Notes
- Set all secrets in Vercel project settings for both Preview and Production.
- Never commit secrets to the repository.
- Ensure Preview and Production use distinct Stripe keys and webhook secrets.
