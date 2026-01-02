import type { VercelRequest, VercelResponse } from '@vercel/node';
import { calculateDistance, GRANDVIEW_MO_COORDS, SHIPPING_RATE_PER_MILE, cors } from './_lib/utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { lat, lng } = req.body;
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return res.status(400).json({ error: "Valid coordinates are required" });
    }
    const miles = calculateDistance(GRANDVIEW_MO_COORDS.lat, GRANDVIEW_MO_COORDS.lng, lat, lng);
    const shippingFee = Math.round(miles * SHIPPING_RATE_PER_MILE * 100) / 100;
    res.json({ miles: Math.round(miles * 100) / 100, shippingFee });
  } catch (error) {
    console.error("Error calculating shipping:", error);
    res.status(500).json({ error: "Failed to calculate shipping" });
  }
}
