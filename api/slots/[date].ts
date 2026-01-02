import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSlotByDate, getOrCreateSlot } from '../_lib/storage';
import { cors } from '../_lib/utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { date } = req.query;
    if (typeof date !== 'string') {
      return res.status(400).json({ error: 'Invalid date parameter' });
    }
    
    const slot = await getSlotByDate(date);
    if (!slot) {
      const newSlot = await getOrCreateSlot(date, 3);
      return res.json(newSlot);
    }
    res.json(slot);
  } catch (error) {
    console.error("Error fetching slot:", error);
    res.status(500).json({ error: "Failed to fetch slot" });
  }
}
