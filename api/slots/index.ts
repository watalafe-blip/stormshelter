import type { VercelRequest, VercelResponse } from '@vercel/node';
import { updateSlotCapacity } from '../_lib/storage';
import { cors } from '../_lib/utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { date, capacity } = req.body;
    if (!date || typeof capacity !== 'number') {
      return res.status(400).json({ error: "Date and capacity are required" });
    }
    const slot = await updateSlotCapacity(date, capacity);
    res.json(slot);
  } catch (error) {
    console.error("Error updating slot:", error);
    res.status(500).json({ error: "Failed to update slot" });
  }
}
