import Stripe from 'stripe';

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

export const stripe = new Stripe(STRIPE_KEY, { apiVersion: '2022-11-15' });

export type CheckoutMode = 'subscription' | 'payment';

type CheckoutSessionParams = {
  priceId: string;
  mode: CheckoutMode;
  successUrl: string;
  cancelUrl: string;
  clientReferenceId: string;
  metadata: Record<string, string>;
};

export async function createCheckoutSession(params: CheckoutSessionParams): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    mode: params.mode,
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    client_reference_id: params.clientReferenceId,
    metadata: params.metadata,
  });

  if (!session.url) {
    throw new Error('Stripe checkout session did not return a URL');
  }

  return session.url;
}
