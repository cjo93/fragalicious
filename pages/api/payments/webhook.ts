import { stripe, CREDIT_MAP } from '@/lib/stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabaseClient';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const signature = req.headers['stripe-signature'] as string;
  // Accumulate raw body to verify signature
  const rawBody = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });

  if (!stripe) {
    return res.status(503).json({ error: 'Stripe not configured' });
  }
  try {
    const event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const userId = session.metadata?.userId as string;
      const credits = Number(session.metadata?.targetCredits ?? 0);
      if (userId && credits > 0) {
        try {
          await supabaseAdmin.rpc('increment_credits', { user_uuid: userId, amount: credits });
        } catch (e) {
          console.error('[WEBHOOK] Could not apply credits for user', userId, e);
        }
      }
    } else if (event.type === 'invoice.paid') {
      const invoice = event.data.object as any;
      // Resolve priceId from the subscription's items if possible
      let credits = 0;
      const customerEmail = invoice.customer_email;
      const subscriptionId = invoice.subscription;
      let priceId: string | undefined;
      try {
        if (subscriptionId) {
          const sub = await (stripe.subscriptions.retrieve as any)(subscriptionId, { expand: ['items.data.price'] });
          priceId = sub.items.data[0]?.price?.id;
        } else {
          priceId = invoice.lines?.data?.[0]?.price?.id;
        }
        credits = priceId ? CREDIT_MAP[priceId] ?? 0 : 0;
      } catch (e) {
        // Ignore if we can't resolve price
      }
      if (credits > 0 && customerEmail) {
        const { data: profile, error } = await supabaseAdmin.from('profiles').select('id').eq('email', customerEmail).single();
        if (profile && profile.id) {
          try {
            await supabaseAdmin.rpc('increment_credits', { user_uuid: profile.id, amount: credits });
          } catch (e) {
            console.error('[WEBHOOK] Could not apply credits for user by email', customerEmail, e);
          }
        }
      }
    }
    res.status(200).json({ received: true });
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
