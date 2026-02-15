import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { NextApiRequest, NextApiResponse } from 'next';
import { addCredits } from '@/lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const signature = req.headers['stripe-signature'] as string;
  const body = req.body;
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    if (event.type === 'checkout.session.completed') {
      await addCredits(event.data.object.metadata.userId);
    }
    res.status(200).json({ received: true });
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}

