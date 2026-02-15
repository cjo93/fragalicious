// Stripe utility (realistic MVP with Stripe SDK)
import Stripe from 'stripe'
const STRIPE_KEY = process.env.STRIPE_LIVE_KEY || process.env.STRIPE_TEST_KEY
if (!STRIPE_KEY) {
  throw new Error('Stripe key not defined in environment variables')
}
export const stripe = new (Stripe as any)(STRIPE_KEY, { apiVersion: '2022-11-15' })

export type CheckoutMode = 'subscription' | 'payment'

// Create a Checkout Session for MVP price points
export async function createCheckoutSession(
  priceId: string,
  mode: CheckoutMode,
  successUrl: string,
  cancelUrl: string,
  clientReferenceId?: string
): Promise<string> {
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
  return session.url
}
