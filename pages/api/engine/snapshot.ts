import type { NextApiRequest, NextApiResponse } from 'next';
import { api } from '@/lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { date, time, lat, lon } = req.body;
  try {
    // Call Python backend via HTTP
    const response = await api.post('/engine/calculate', { date, time, lat, lon });
    res.status(200).json({ snapshot: response.data });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
  }
}
