# Stripe Production Checklist

## Webhook Endpoint
- Production endpoint URL: `https://defrag.app/api/payments/webhook`
- Staging endpoint URL: `https://staging.defrag.app/api/payments/webhook` (if applicable)

## Events to Subscribe
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`

## Signature Validation
- Ensure `STRIPE_WEBHOOK_SECRET` is configured in the target environment.
- Webhook handler uses raw body and verifies `stripe-signature` header.

## Stripe CLI / Local Validation
1. Login: `stripe login`
2. Forward events to local dev server:
   - `stripe listen --forward-to localhost:3000/api/payments/webhook`
3. Trigger a test checkout session for each plan using the API.
4. Confirm webhook delivery returns `200` and updates `stripe_events`.

## Secret Rotation
- Rotate `STRIPE_WEBHOOK_SECRET` by creating a new webhook endpoint in Stripe.
- Update Vercel environment and redeploy.
- Deactivate the old webhook endpoint after validating the new one.

## Rollback
- Disable pricing links or pause products in Stripe to stop new checkouts.
- Revert the Vercel deployment if needed.
- Monitor webhook error rates and `stripe_events` table status.

## End-to-End Test (Test Mode)
1. Set test env vars:
   - `STRIPE_SECRET_KEY=sk_test_...`
   - `STRIPE_WEBHOOK_SECRET=whsec_...`
   - `STRIPE_PRICE_MANUAL_27=price_...`
   - `STRIPE_PRICE_OS_MONTHLY_9_99=price_...`
2. Call `POST /api/payments/create-checkout` with `manual_27` and complete payment.
3. Verify:
   - `stripe_events` row inserted and marked `processed`.
   - `profiles.has_manual=true`.
   - `purchases` row inserted.
4. Call `POST /api/payments/create-checkout` with `os_monthly_9_99` and complete payment.
5. Verify:
   - `profiles.plan_code=os_monthly_9_99`.
   - `profiles.subscription_status=active`.
   - `profiles.current_period_end` set.

## End-to-End Test (Live Mode)
1. Set live env vars:
   - `STRIPE_SECRET_KEY=sk_live_...`
   - `STRIPE_WEBHOOK_SECRET=whsec_...`
   - `STRIPE_PRICE_MANUAL_27=price_...`
   - `STRIPE_PRICE_OS_MONTHLY_9_99=price_...`
2. Run one controlled purchase per plan.
3. Confirm webhook delivery, `stripe_events` status, and `profiles` updates.
