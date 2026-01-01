import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, date, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const deliverySlots = pgTable("delivery_slots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: date("date").notNull().unique(),
  capacity: integer("capacity").notNull().default(3),
  reservedCount: integer("reserved_count").notNull().default(0),
  isEnabled: integer("is_enabled").notNull().default(1),
});

export const insertDeliverySlotSchema = createInsertSchema(deliverySlots).omit({
  id: true,
  reservedCount: true,
});

export type InsertDeliverySlot = z.infer<typeof insertDeliverySlotSchema>;
export type DeliverySlot = typeof deliverySlots.$inferSelect;

export const paymentOptionEnum = ["deposit", "full"] as const;
export const paymentStatusEnum = ["pending", "paid", "failed", "refunded"] as const;
export const bookingStatusEnum = ["pending", "confirmed", "completed", "cancelled"] as const;

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slotId: varchar("slot_id").notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  deliveryCity: text("delivery_city").notNull(),
  deliveryState: text("delivery_state").notNull(),
  deliveryZip: text("delivery_zip").notNull(),
  milesFromHq: decimal("miles_from_hq", { precision: 10, scale: 2 }).notNull(),
  shippingFee: decimal("shipping_fee", { precision: 10, scale: 2 }).notNull(),
  productPrice: decimal("product_price", { precision: 10, scale: 2 }).notNull().default("4999"),
  totalDue: decimal("total_due", { precision: 10, scale: 2 }).notNull(),
  paymentOption: text("payment_option").notNull().$type<"deposit" | "full">(),
  paymentStatus: text("payment_status").notNull().$type<"pending" | "paid" | "failed" | "refunded">().default("pending"),
  bookingStatus: text("booking_status").notNull().$type<"pending" | "confirmed" | "completed" | "cancelled">().default("pending"),
  whopCheckoutId: text("whop_checkout_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  paymentStatus: true,
  bookingStatus: true,
  whopCheckoutId: true,
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;
