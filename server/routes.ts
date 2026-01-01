import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema } from "@shared/schema";
import { z } from "zod";

const GRANDVIEW_MO_COORDS = { lat: 38.8814, lng: -94.5314 };
const SHIPPING_RATE_PER_MILE = 6;

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
      const validatedData = insertBookingSchema.parse(req.body);
      
      const slot = await storage.getSlotByDate(req.body.selectedDate);
      if (!slot) {
        return res.status(400).json({ error: "Selected date is not available" });
      }
      if (slot.reservedCount >= slot.capacity) {
        return res.status(400).json({ error: "No availability on selected date" });
      }
      
      const booking = await storage.createBooking({
        ...validatedData,
        slotId: slot.id
      });
      
      await storage.incrementSlotReservation(slot.id);
      
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

  return httpServer;
}
