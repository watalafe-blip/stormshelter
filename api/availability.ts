import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAvailableSlots } from './_lib/storage';
import { cors } from './_lib/utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const fromDate = new Date().toISOString().split('T')[0];
    const slots = await getAvailableSlots(fromDate);
    res.json(slots);
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({ error: "Failed to fetch availability" });
  }
}
