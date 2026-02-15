Rollback Runbook for Monetization Go-Live

- Pre-Launch: Ensure a fallback point in Vercel main branch or a hotfix branch is guaranteed.
- Steps to rollback:
  1. Revert the monetization feature branch (monetization/go-default) to previous commit on main if needed.
  2. Pause or disable Stripe webhooks temporarily from Stripe dashboard.
  3. If access gating is broken, revoke paid access and revert any access flags in the database.
  4. If you changed data structures (e.g., credits), revert to previous DB schema and data values.
  5. Re-deploy previous known-good build.
- Verification after rollback:
  - Ensure no new purchases are processed
  - Confirm users retain or lose access according to policy
  - Validate that the system returns to a healthy state
