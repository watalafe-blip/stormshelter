import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAllBookings, updateBookingPaymentMethod, updateBookingPaymentStatus } from '../_lib/storage';
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
    const { action, data } = req.body;
    
    console.log("Whop webhook received:", action, JSON.stringify(data, null, 2));
    
    if (action === "payment.succeeded") {
      const cardBrand = data?.card_brand || data?.payment_method?.card?.brand;
      const cardLast4 = data?.card_last_4 || data?.payment_method?.card?.last4;
      const checkoutId = data?.checkout_id || data?.id;
      const userEmail = data?.user?.email;
      
      if (cardBrand && cardLast4) {
        const formattedBrand = cardBrand.charAt(0).toUpperCase() + cardBrand.slice(1).toLowerCase();
        const paymentMethod = `${formattedBrand} ••••${cardLast4}`;
        
        const allBookings = await getAllBookings();
        const booking = allBookings.find(b => 
          b.customerEmail.toLowerCase() === userEmail?.toLowerCase() && 
          b.paymentStatus === "pending"
        );
        
        if (booking) {
          await updateBookingPaymentMethod(booking.id, paymentMethod, checkoutId);
          await updateBookingPaymentStatus(booking.id, "paid");
          console.log(`Updated booking ${booking.id} with payment method: ${paymentMethod}`);
        } else {
          console.log("No matching pending booking found for email:", userEmail);
        }
      }
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error("Whop webhook error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}
