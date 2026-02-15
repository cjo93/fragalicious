import { stripe } from '@/lib/stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { addCredits } from '@/lib/api';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const signature = req.headers['stripe-signature'] as string;
  // Manually accumulate raw body to verify Stripe signature without relying on external libs
  const rawBody = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
  try {
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    if (event.type === 'checkout.session.completed') {
      // Retrieve the session with line items to obtain priceId
      const session = event.data.object as any;
      // @ts-ignore - runtime Stripe types may vary across versions
      const sessionWithItems = await (stripe.checkout.sessions.retrieve as any)(session.id, {
        expand: ['line_items', 'line_items.price'],
      });
      const priceId = sessionWithItems.line_items?.data?.[0]?.price?.id;
      const userId = sessionWithItems.client_reference_id as string;
      const credits = creditsForPrice(priceId);
      if (userId && credits > 0) {
        await addCredits(userId, credits);
      }
    }
    res.status(200).json({ received: true });
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}

function creditsForPrice(priceId?: string): number {
  if (!priceId) return 0;
  const map: Record<string, number> = {
    // Map these to your actual Stripe price IDs via environment variables in production
    [process.env.PRICE_ID_MANUAL_27 || '']: 10,
    [process.env.PRICE_ID_MONTHLY_9_99 || '']: 1,
    [process.env.PRICE_ID_ANNUAL_99_99 || '']: 12,
    [process.env.PRICE_ID_ONE_TIME_5 || '']: 1,
    [process.env.PRICE_ID_ONE_TIME_7 || '']: 2,
  };
  return map[priceId] ?? 0;
}
