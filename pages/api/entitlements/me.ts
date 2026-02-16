import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { defaultEntitlements } from '@/lib/entitlements';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
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

    const { data, error } = await supabase
      .from('profiles')
      .select('has_manual, subscription_status, plan_code, current_period_end')
      .eq('id', user.id)
      .single();

    if (error || !data) {
      return res.status(200).json(defaultEntitlements());
    }

    return res.status(200).json({
      has_manual: data.has_manual ?? false,
      subscription_status: data.subscription_status ?? null,
      plan_code: data.plan_code ?? null,
      current_period_end: data.current_period_end ?? null,
    });
  } catch (error) {
    console.error('[entitlements/me] error', error);
    return res.status(500).json({ error: 'Failed to load entitlements' });
  }
}
