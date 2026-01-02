import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { getAllBookings, createBooking, getOrCreateSlot, incrementSlotReservation } from '../_lib/storage';
import { sendBookingConfirmation } from '../_lib/email';
import { SHIPPING_RATE_PER_MILE, PRODUCT_PRICE, DEPOSIT_AMOUNT, cors } from '../_lib/utils';

const bookingRequestSchema = z.object({
  selectedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  customerName: z.string().min(1, "Name is required"),
  customerEmail: z.string().email("Invalid email"),
  customerPhone: z.string().min(1, "Phone is required"),
  deliveryAddress: z.string().min(1, "Address is required"),
  deliveryCity: z.string().min(1, "City is required"),
  deliveryState: z.string().min(1, "State is required"),
  deliveryZip: z.string().min(5, "ZIP is required"),
  milesFromHq: z.string().or(z.number()).transform(v => parseFloat(String(v))).refine(v => v >= 1 && v <= 3000, "Invalid distance"),
  paymentOption: z.enum(["deposit", "full"]),
  notes: z.string().nullable().optional()
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const bookings = await getAllBookings();
      return res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return res.status(500).json({ error: "Failed to fetch bookings" });
    }
  }

  if (req.method === 'POST') {
    try {
      const validatedData = bookingRequestSchema.parse(req.body);
      
      const slot = await getOrCreateSlot(validatedData.selectedDate, 3);
      if (slot.reservedCount >= slot.capacity) {
        return res.status(400).json({ error: "No availability on selected date" });
      }
      
      const shippingFee = Math.round(validatedData.milesFromHq * SHIPPING_RATE_PER_MILE * 100) / 100;
      const totalDue = validatedData.paymentOption === 'deposit' 
        ? DEPOSIT_AMOUNT 
        : PRODUCT_PRICE + shippingFee;
      
      const booking = await createBooking({
        slotId: slot.id,
        customerName: validatedData.customerName,
        customerEmail: validatedData.customerEmail,
        customerPhone: validatedData.customerPhone,
        deliveryAddress: validatedData.deliveryAddress,
        deliveryCity: validatedData.deliveryCity,
        deliveryState: validatedData.deliveryState,
        deliveryZip: validatedData.deliveryZip,
        milesFromHq: validatedData.milesFromHq.toString(),
        shippingFee: shippingFee.toString(),
        productPrice: PRODUCT_PRICE.toString(),
        totalDue: totalDue.toString(),
        paymentOption: validatedData.paymentOption,
        notes: validatedData.notes || null
      });
      
      await incrementSlotReservation(slot.id);
      
      sendBookingConfirmation({
        customerName: validatedData.customerName,
        customerEmail: validatedData.customerEmail,
        bookingId: booking.id,
        deliveryAddress: validatedData.deliveryAddress,
        deliveryCity: validatedData.deliveryCity,
        deliveryState: validatedData.deliveryState,
        deliveryZip: validatedData.deliveryZip,
        milesFromHq: validatedData.milesFromHq.toString(),
        shippingFee: shippingFee.toString(),
        productPrice: PRODUCT_PRICE.toString(),
        depositPaid: DEPOSIT_AMOUNT.toString(),
        remainingBalance: (PRODUCT_PRICE + shippingFee - DEPOSIT_AMOUNT).toString(),
        deliveryDate: validatedData.selectedDate
      }).catch(err => console.error('Email send failed:', err));
      
      return res.json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid booking data", details: error.errors });
      }
      console.error("Error creating booking:", error);
      return res.status(500).json({ error: "Failed to create booking" });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
