import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, gte, and, sql } from "drizzle-orm";
import { 
  type User, type InsertUser,
  type DeliverySlot, type InsertDeliverySlot,
  type Booking, type InsertBooking,
  users, deliverySlots, bookings
} from "../../shared/schema";

const DATABASE_URL = process.env.DATABASE_URL;

function getDb() {
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }
  const queryClient = neon(DATABASE_URL);
  return drizzle(queryClient);
}

export async function getAvailableSlots(fromDate: string): Promise<DeliverySlot[]> {
  const db = getDb();
  try {
    const result = await db.select().from(deliverySlots).where(
      and(
        gte(deliverySlots.date, fromDate),
        sql`${deliverySlots.reservedCount} < ${deliverySlots.capacity}`,
        eq(deliverySlots.isEnabled, 1)
      )
    );
    return result;
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return [];
  }
}

export async function getSlotByDate(date: string): Promise<DeliverySlot | undefined> {
  const db = getDb();
  const result = await db.select().from(deliverySlots).where(eq(deliverySlots.date, date));
  return result[0];
}

export async function getOrCreateSlot(date: string, capacity: number = 3): Promise<DeliverySlot> {
  const db = getDb();
  let slot = await getSlotByDate(date);
  if (!slot) {
    const result = await db.insert(deliverySlots).values({ date, capacity, isEnabled: 1 }).returning();
    slot = result[0];
  }
  return slot;
}

export async function updateSlotCapacity(date: string, capacity: number): Promise<DeliverySlot | undefined> {
  const db = getDb();
  await getOrCreateSlot(date, capacity);
  const result = await db.update(deliverySlots)
    .set({ capacity })
    .where(eq(deliverySlots.date, date))
    .returning();
  return result[0];
}

export async function incrementSlotReservation(slotId: string): Promise<boolean> {
  const db = getDb();
  const result = await db.update(deliverySlots)
    .set({ reservedCount: sql`${deliverySlots.reservedCount} + 1` })
    .where(eq(deliverySlots.id, slotId))
    .returning();
  return result.length > 0;
}

export async function createBooking(insertBooking: InsertBooking): Promise<Booking> {
  const db = getDb();
  const result = await db.insert(bookings).values(insertBooking as any).returning();
  return result[0];
}

export async function getBooking(id: string): Promise<Booking | undefined> {
  const db = getDb();
  const result = await db.select().from(bookings).where(eq(bookings.id, id));
  return result[0];
}

export async function getAllBookings(): Promise<Booking[]> {
  const db = getDb();
  return await db.select().from(bookings).orderBy(sql`${bookings.createdAt} DESC`);
}

export async function updateBookingPaymentStatus(id: string, status: "pending" | "paid" | "failed" | "refunded"): Promise<Booking | undefined> {
  const db = getDb();
  const updates: any = { paymentStatus: status };
  if (status === "paid") {
    updates.bookingStatus = "confirmed";
  }
  const result = await db.update(bookings).set(updates).where(eq(bookings.id, id)).returning();
  return result[0];
}

export async function updateBookingStatus(id: string, status: "pending" | "confirmed" | "completed" | "cancelled"): Promise<Booking | undefined> {
  const db = getDb();
  const result = await db.update(bookings).set({ bookingStatus: status }).where(eq(bookings.id, id)).returning();
  return result[0];
}

export async function updateBookingPaymentMethod(id: string, paymentMethod: string, whopCheckoutId?: string): Promise<Booking | undefined> {
  const db = getDb();
  const updates: any = { paymentMethod };
  if (whopCheckoutId) {
    updates.whopCheckoutId = whopCheckoutId;
  }
  const result = await db.update(bookings).set(updates).where(eq(bookings.id, id)).returning();
  return result[0];
}
