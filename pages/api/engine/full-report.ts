import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserCredits, decrementCredits } from '../../../lib/api';
import { triggerModalPDFJob } from '../../../lib/pdf';
import { api } from '../../../lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { userId, date, time, lat, lon } = req.body;
  try {
    const credits = await getUserCredits(userId);
    if (credits < 10) return res.status(402).json({ error: 'Insufficient credits' });
    await decrementCredits(userId, 10);
    // Call Python backend via HTTP
    const response = await api.post('/engine/calculate', { date, time, lat, lon });
    const jobId = await triggerModalPDFJob({ userId, result: response.data });
    res.status(200).json({ jobId });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
  }
}
