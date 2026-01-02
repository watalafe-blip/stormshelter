import type { VercelRequest, VercelResponse } from '@vercel/node';
import { updateBookingPaymentStatus } from '../../_lib/storage';
import { cors } from '../../_lib/utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid booking ID' });
    }
    
    const { status } = req.body;
    if (!["pending", "paid", "failed", "refunded"].includes(status)) {
      return res.status(400).json({ error: "Invalid payment status" });
    }
    
    const booking = await updateBookingPaymentStatus(id, status);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json(booking);
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ error: "Failed to update payment status" });
  }
}
