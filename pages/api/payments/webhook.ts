import { stripe } from '@/lib/stripe';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function readRawBody(req: NextApiRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return new Promise<Buffer>((resolve, reject) => {
    req.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const signature = req.headers['stripe-signature'] as string | undefined;
  if (!signature) return res.status(400).send('Missing stripe-signature');

  const rawBody = await readRawBody(req);

  try {
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    switch (event.type) {
      case 'checkout.session.completed':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
      case 'invoice.paid':
        // Fulfillment handled in later steps with idempotency and Supabase writes.
        break;
      default:
        // Ignore unsupported event types.
        break;
    }

    return res.status(200).json({ received: true });
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
