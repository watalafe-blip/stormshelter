import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { sendBookingConfirmation, sendContactFormEmail, sendPasswordResetRequest } from "./email";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "home-defend-admin-secret-key-change-in-production";
const COOKIE_NAME = "admin_token";

const GRANDVIEW_MO_COORDS = { lat: 38.8814, lng: -94.5314 };
const SHIPPING_RATE_PER_MILE = 5.2;
const PRODUCT_PRICE = 4250;
const DEPOSIT_AMOUNT = 500;

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

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

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/availability", async (req, res) => {
    try {
      const fromDate = new Date().toISOString().split('T')[0];
      const slots = await storage.getAvailableSlots(fromDate);
      res.json(slots);
    } catch (error) {
      console.error("Error fetching availability:", error);
      res.status(500).json({ error: "Failed to fetch availability" });
    }
  });

  app.get("/api/slots/:date", async (req, res) => {
    try {
      const { date } = req.params;
      const slot = await storage.getSlotByDate(date);
      if (!slot) {
        const newSlot = await storage.getOrCreateSlot(date, 3);
        res.json(newSlot);
      } else {
        res.json(slot);
      }
    } catch (error) {
      console.error("Error fetching slot:", error);
      res.status(500).json({ error: "Failed to fetch slot" });
    }
  });

  app.post("/api/slots", async (req, res) => {
    try {
      const { date, capacity } = req.body;
      if (!date || typeof capacity !== 'number') {
        return res.status(400).json({ error: "Date and capacity are required" });
      }
      const slot = await storage.updateSlotCapacity(date, capacity);
      res.json(slot);
    } catch (error) {
      console.error("Error updating slot:", error);
      res.status(500).json({ error: "Failed to update slot" });
    }
  });

  app.post("/api/calculate-shipping", async (req, res) => {
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
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = bookingRequestSchema.parse(req.body);
      
      const slot = await storage.getOrCreateSlot(validatedData.selectedDate, 3);
      if (slot.reservedCount >= slot.capacity) {
        return res.status(400).json({ error: "No availability on selected date" });
      }
      
      const shippingFee = Math.round(validatedData.milesFromHq * SHIPPING_RATE_PER_MILE * 100) / 100;
      const totalDue = validatedData.paymentOption === 'deposit' 
        ? DEPOSIT_AMOUNT 
        : PRODUCT_PRICE + shippingFee;
      
      const booking = await storage.createBooking({
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
      
      await storage.incrementSlotReservation(slot.id);
      
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
      
      res.json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid booking data", details: error.errors });
      }
      console.error("Error creating booking:", error);
      res.status(500).json({ error: "Failed to create booking" });
    }
  });

  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      console.error("Error fetching booking:", error);
      res.status(500).json({ error: "Failed to fetch booking" });
    }
  });

  app.patch("/api/bookings/:id/payment-status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!["pending", "paid", "failed", "refunded"].includes(status)) {
        return res.status(400).json({ error: "Invalid payment status" });
      }
      const booking = await storage.updateBookingPaymentStatus(req.params.id, status);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      console.error("Error updating payment status:", error);
      res.status(500).json({ error: "Failed to update payment status" });
    }
  });

  app.patch("/api/bookings/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({ error: "Invalid booking status" });
      }
      const booking = await storage.updateBookingStatus(req.params.id, status);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ error: "Failed to update booking status" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const { firstName, lastName, email, message } = req.body;
      
      if (!firstName || !email || !message) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      await sendContactFormEmail({ firstName, lastName, email, message });
      
      res.json({ success: true, message: "Contact form submitted" });
    } catch (error) {
      console.error("Error processing contact form:", error);
      res.status(500).json({ error: "Failed to process contact form" });
    }
  });

  // Admin Authentication Routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: "24h" });
      
      res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
      
      res.json({ success: true, user: { id: user.id, username: user.username } });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    res.clearCookie(COOKIE_NAME);
    res.json({ success: true });
  });

  app.get("/api/admin/me", async (req, res) => {
    try {
      const token = req.cookies?.[COOKIE_NAME];
      if (!token) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; username: string };
      const user = await storage.getUser(decoded.userId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      res.json({ user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
  });

  // Forgot password endpoint
  app.post("/api/admin/forgot-password", async (req, res) => {
    try {
      const { username } = req.body;
      if (!username) {
        return res.status(400).json({ error: "Username is required" });
      }
      
      const emailSent = await sendPasswordResetRequest(username);
      if (!emailSent) {
        return res.status(500).json({ error: "Failed to send reset email. Please contact support." });
      }
      res.json({ success: true, message: "Password reset request sent" });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ error: "Failed to send reset request" });
    }
  });

  // Seed admin user endpoint (one-time use)
  app.post("/api/admin/seed", async (req, res) => {
    try {
      const { username, password, secretKey } = req.body;
      
      // Simple security check
      if (secretKey !== "home-defend-setup-2026") {
        return res.status(403).json({ error: "Invalid secret key" });
      }
      
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({ username, password: hashedPassword });
      
      res.json({ success: true, message: "Admin user created", userId: user.id });
    } catch (error) {
      console.error("Seed error:", error);
      res.status(500).json({ error: "Failed to create admin user" });
    }
  });

  // Whop webhook endpoint for payment events
  app.post("/api/webhooks/whop", async (req, res) => {
    try {
      const { action, data } = req.body;
      
      console.log("Whop webhook received:", action, JSON.stringify(data, null, 2));
      
      if (action === "payment.succeeded") {
        // Extract card info from Whop payload
        const cardBrand = data?.card_brand || data?.payment_method?.card?.brand;
        const cardLast4 = data?.card_last_4 || data?.payment_method?.card?.last4;
        const checkoutId = data?.checkout_id || data?.id;
        const membershipId = data?.membership;
        const userEmail = data?.user?.email;
        
        if (cardBrand && cardLast4) {
          // Format payment method string like "Visa ••••6568"
          const formattedBrand = cardBrand.charAt(0).toUpperCase() + cardBrand.slice(1).toLowerCase();
          const paymentMethod = `${formattedBrand} ••••${cardLast4}`;
          
          // Find booking by email (since we may not have checkout ID stored yet)
          const allBookings = await storage.getAllBookings();
          const booking = allBookings.find(b => 
            b.customerEmail.toLowerCase() === userEmail?.toLowerCase() && 
            b.paymentStatus === "pending"
          );
          
          if (booking) {
            await storage.updateBookingPaymentMethod(booking.id, paymentMethod, checkoutId);
            await storage.updateBookingPaymentStatus(booking.id, "paid");
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
  });

  return httpServer;
}
