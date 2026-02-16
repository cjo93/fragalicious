import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { createCheckoutSession, CheckoutMode } from '@/lib/stripe';

const PLAN_CODES = ['manual_27', 'os_monthly_9_99'] as const;

type PlanCode = (typeof PLAN_CODES)[number];

type CreateCheckoutBody = {
  plan_code?: string;
};

function resolveSiteUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (!siteUrl) {
    throw new Error('SITE_URL is not configured');
  }
  return siteUrl.replace(/\/$/, '');
}

function getPriceId(planCode: PlanCode): string {
  if (planCode === 'manual_27') {
    return process.env.STRIPE_PRICE_MANUAL_27 || '';
  }
  return process.env.STRIPE_PRICE_OS_MONTHLY_9_99 || '';
}

function getMode(planCode: PlanCode): CheckoutMode {
  return planCode === 'os_monthly_9_99' ? 'subscription' : 'payment';
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

    const body = req.body as CreateCheckoutBody;
    if (!body?.plan_code || !PLAN_CODES.includes(body.plan_code as PlanCode)) {
      return res.status(400).json({ error: 'Invalid plan_code' });
    }

    const planCode = body.plan_code as PlanCode;
    const priceId = getPriceId(planCode);

    if (!priceId) {
      return res.status(500).json({ error: 'Pricing is not configured' });
    }

    const siteUrl = resolveSiteUrl();
    const successUrl = `${siteUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${siteUrl}/pricing?canceled=1`;

    const url = await createCheckoutSession({
      priceId,
      mode: getMode(planCode),
      successUrl,
      cancelUrl,
      clientReferenceId: user.id,
      metadata: {
        plan_code: planCode,
        user_id: user.id,
      },
    });

    return res.status(200).json({ url });
  } catch (error) {
    console.error('[create-checkout] error', error);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
