// Stripe utility (realistic MVP with Stripe SDK)
import Stripe from 'stripe'
const STRIPE_KEY = process.env.STRIPE_LIVE_KEY || process.env.STRIPE_TEST_KEY
if (!STRIPE_KEY) {
  throw new Error('Stripe key not defined in environment variables')
}
export const stripe = new (Stripe as any)(STRIPE_KEY, { apiVersion: '2022-11-15' })

export type CheckoutMode = 'subscription' | 'payment'

// Credit mapping: price IDs -> compute credits
export const CREDIT_MAP: Record<string, number> = {
  [process.env.STRIPE_PRICE_ID_MANUAL_27 || '']: 10,
  [process.env.STRIPE_PRICE_ID_OS_MONTHLY || '']: 10,
  [process.env.STRIPE_PRICE_ID_OS_ANNUAL || '']: 120,
  // Optional additional price IDs can be wired later
}

// Create a Checkout Session for MVP price points
export async function createCheckoutSession(
  priceId: string,
  mode: CheckoutMode,
  successUrl: string,
  cancelUrl: string,
  clientReferenceId?: string
): Promise<{ sessionId: string; sessionUrl: string }> {
  const session = await stripe.checkout.sessions.create({
    mode,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: clientReferenceId,
  })
  return { sessionId: session.id, sessionUrl: session.url }
}
