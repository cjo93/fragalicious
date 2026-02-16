import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { triggerModalPDFJob } from '../../../lib/pdf';
import { api } from '../../../lib/api';
import { defaultEntitlements, isFeatureEntitled } from '@/lib/entitlements';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const supabase = createPagesServerClient({ req, res });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { date, time, lat, lon } = req.body;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('has_manual, subscription_status, plan_code, current_period_end')
      .eq('id', user.id)
      .single();

    if (error && !data) {
      return res.status(500).json({ error: 'Failed to load entitlements' });
    }

    const entitlements = data
      ? {
          has_manual: data.has_manual ?? false,
          subscription_status: data.subscription_status ?? null,
          plan_code: data.plan_code ?? null,
          current_period_end: data.current_period_end ?? null,
        }
      : defaultEntitlements();

    if (!isFeatureEntitled(entitlements, 'FULL_REPORT')) {
      return res.status(403).json({
        error: 'entitlement_required',
        feature: 'FULL_REPORT',
      });
    }

    const response = await api.post('/engine/calculate', { date, time, lat, lon });
    const jobId = await triggerModalPDFJob({ userId: user.id, result: response.data });
    res.status(200).json({ jobId });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
  }
}
