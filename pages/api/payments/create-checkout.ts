import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { createCheckoutSession } from '@/lib/stripe';
import { getPlanConfig } from '@/lib/payments/planCatalog';

function resolveSiteUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (!siteUrl) {
    throw new Error('SITE_URL is not configured');
  }
  return siteUrl.replace(/\/$/, '');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = createPagesServerClient({ req, res });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const planCode = req.body?.plan_code as string | undefined;
    const planConfig = planCode ? getPlanConfig(planCode) : null;

    if (!planConfig) {
      return res.status(400).json({ error: 'Invalid plan_code' });
    }

    if (!planConfig.priceId) {
      return res.status(500).json({ error: 'Pricing is not configured' });
    }

    const siteUrl = resolveSiteUrl();
    const successUrl = `${siteUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${siteUrl}/pricing?canceled=1`;

    const url = await createCheckoutSession({
      priceId: planConfig.priceId,
      mode: planConfig.mode,
      successUrl,
      cancelUrl,
      clientReferenceId: user.id,
      metadata: {
        plan_code: planConfig.planCode,
        user_id: user.id,
      },
    });

    return res.status(200).json({ url });
  } catch (error) {
    console.error('[create-checkout] error', error);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
