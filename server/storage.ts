import { 
  type User, type InsertUser,
  type DeliverySlot, type InsertDeliverySlot,
  type Booking, type InsertBooking,
  users, deliverySlots, bookings
} from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, gte, and, sql } from "drizzle-orm";

const DATABASE_URL = process.env.DATABASE_URL;

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAvailableSlots(fromDate: string): Promise<DeliverySlot[]>;
  getSlotByDate(date: string): Promise<DeliverySlot | undefined>;
  getOrCreateSlot(date: string, capacity?: number): Promise<DeliverySlot>;
  updateSlotCapacity(date: string, capacity: number): Promise<DeliverySlot | undefined>;
  incrementSlotReservation(slotId: string): Promise<boolean>;
  
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: string): Promise<Booking | undefined>;
  getBookingByWhopCheckoutId(checkoutId: string): Promise<Booking | undefined>;
  getAllBookings(): Promise<Booking[]>;
  updateBookingPaymentStatus(id: string, status: "pending" | "paid" | "failed" | "refunded"): Promise<Booking | undefined>;
  updateBookingStatus(id: string, status: "pending" | "confirmed" | "completed" | "cancelled"): Promise<Booking | undefined>;
  updateBookingPaymentMethod(id: string, paymentMethod: string, whopCheckoutId?: string): Promise<Booking | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private slots: Map<string, DeliverySlot>;
  private bookingsMap: Map<string, Booking>;

  constructor() {
    this.users = new Map();
    this.slots = new Map();
    this.bookingsMap = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAvailableSlots(fromDate: string): Promise<DeliverySlot[]> {
    return Array.from(this.slots.values()).filter(
      (slot) => slot.date >= fromDate && slot.isEnabled === 1
    );
  }

  async getSlotByDate(date: string): Promise<DeliverySlot | undefined> {
    return this.slots.get(date);
  }

  async getOrCreateSlot(date: string, capacity: number = 3): Promise<DeliverySlot> {
    let slot = this.slots.get(date);
    if (!slot) {
      slot = {
        id: randomUUID(),
        date,
        capacity,
        reservedCount: 0,
        isEnabled: 1
      };
      this.slots.set(date, slot);
    }
    return slot;
  }

  async updateSlotCapacity(date: string, capacity: number): Promise<DeliverySlot | undefined> {
    const slot = await this.getOrCreateSlot(date, capacity);
    slot.capacity = capacity;
    this.slots.set(date, slot);
    return slot;
  }

  async incrementSlotReservation(slotId: string): Promise<boolean> {
    const slot = Array.from(this.slots.values()).find(s => s.id === slotId);
    if (slot && slot.reservedCount < slot.capacity) {
      slot.reservedCount++;
      this.slots.set(slot.date, slot);
      return true;
    }
    return false;
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const booking: Booking = {
      id,
      customerName: insertBooking.customerName,
      customerEmail: insertBooking.customerEmail,
      customerPhone: insertBooking.customerPhone,
      deliveryAddress: insertBooking.deliveryAddress,
      deliveryCity: insertBooking.deliveryCity,
      deliveryState: insertBooking.deliveryState,
      deliveryZip: insertBooking.deliveryZip,
      slotId: insertBooking.slotId,
      milesFromHq: insertBooking.milesFromHq,
      shippingFee: insertBooking.shippingFee,
      productPrice: insertBooking.productPrice || "4250",
      totalDue: insertBooking.totalDue,
      paymentOption: insertBooking.paymentOption as "deposit" | "full",
      paymentStatus: "pending",
      bookingStatus: "pending",
      whopCheckoutId: null,
      paymentMethod: null,
      notes: insertBooking.notes || null,
      createdAt: new Date()
    };
    this.bookingsMap.set(id, booking);
    return booking;
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookingsMap.get(id);
  }

  async getBookingByWhopCheckoutId(checkoutId: string): Promise<Booking | undefined> {
    return Array.from(this.bookingsMap.values()).find(b => b.whopCheckoutId === checkoutId);
  }

  async getAllBookings(): Promise<Booking[]> {
    return Array.from(this.bookingsMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async updateBookingPaymentStatus(id: string, status: "pending" | "paid" | "failed" | "refunded"): Promise<Booking | undefined> {
    const booking = this.bookingsMap.get(id);
    if (booking) {
      booking.paymentStatus = status;
      if (status === "paid") {
        booking.bookingStatus = "confirmed";
      }
      this.bookingsMap.set(id, booking);
    }
    return booking;
  }

  async updateBookingStatus(id: string, status: "pending" | "confirmed" | "completed" | "cancelled"): Promise<Booking | undefined> {
    const booking = this.bookingsMap.get(id);
    if (booking) {
      booking.bookingStatus = status;
      this.bookingsMap.set(id, booking);
    }
    return booking;
  }

  async updateBookingPaymentMethod(id: string, paymentMethod: string, whopCheckoutId?: string): Promise<Booking | undefined> {
    const booking = this.bookingsMap.get(id);
    if (booking) {
      booking.paymentMethod = paymentMethod;
      if (whopCheckoutId) {
        booking.whopCheckoutId = whopCheckoutId;
      }
      this.bookingsMap.set(id, booking);
    }
    return booking;
  }
}

export class DatabaseStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;
  private queryClient: ReturnType<typeof neon>;

  constructor() {
    if (!DATABASE_URL) {
      throw new Error("DATABASE_URL is required for DatabaseStorage");
    }
    this.queryClient = neon(DATABASE_URL);
    this.db = drizzle(this.queryClient);
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getAvailableSlots(fromDate: string): Promise<DeliverySlot[]> {
    try {
      const result = await this.db.select().from(deliverySlots).where(
        and(
          gte(deliverySlots.date, fromDate),
          eq(deliverySlots.isEnabled, 1)
        )
      );
      return result || [];
    } catch (error) {
      console.error("Error in getAvailableSlots:", error);
      return [];
    }
  }

  async getSlotByDate(date: string): Promise<DeliverySlot | undefined> {
    const result = await this.db.select().from(deliverySlots).where(eq(deliverySlots.date, date));
    return result[0];
  }

  async getOrCreateSlot(date: string, capacity: number = 3): Promise<DeliverySlot> {
    let slot = await this.getSlotByDate(date);
    if (!slot) {
      const result = await this.db.insert(deliverySlots).values({ date, capacity, isEnabled: 1 }).returning();
      slot = result[0];
    }
    return slot;
  }

  async updateSlotCapacity(date: string, capacity: number): Promise<DeliverySlot | undefined> {
    await this.getOrCreateSlot(date, capacity);
    const result = await this.db.update(deliverySlots)
      .set({ capacity })
      .where(eq(deliverySlots.date, date))
      .returning();
    return result[0];
  }

  async incrementSlotReservation(slotId: string): Promise<boolean> {
    const result = await this.db.update(deliverySlots)
      .set({ reservedCount: sql`${deliverySlots.reservedCount} + 1` })
      .where(eq(deliverySlots.id, slotId))
      .returning();
    return result.length > 0;
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const result = await this.db.insert(bookings).values(insertBooking as any).returning();
    return result[0];
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const result = await this.db.select().from(bookings).where(eq(bookings.id, id));
    return result[0];
  }

  async getBookingByWhopCheckoutId(checkoutId: string): Promise<Booking | undefined> {
    const result = await this.db.select().from(bookings).where(eq(bookings.whopCheckoutId, checkoutId));
    return result[0];
  }

  async getAllBookings(): Promise<Booking[]> {
    return await this.db.select().from(bookings).orderBy(sql`${bookings.createdAt} DESC`);
  }

  async updateBookingPaymentStatus(id: string, status: "pending" | "paid" | "failed" | "refunded"): Promise<Booking | undefined> {
    const updates: any = { paymentStatus: status };
    if (status === "paid") {
      updates.bookingStatus = "confirmed";
    }
    const result = await this.db.update(bookings).set(updates).where(eq(bookings.id, id)).returning();
    return result[0];
  }

  async updateBookingStatus(id: string, status: "pending" | "confirmed" | "completed" | "cancelled"): Promise<Booking | undefined> {
    const result = await this.db.update(bookings).set({ bookingStatus: status }).where(eq(bookings.id, id)).returning();
    return result[0];
  }

  async updateBookingPaymentMethod(id: string, paymentMethod: string, whopCheckoutId?: string): Promise<Booking | undefined> {
    const updates: any = { paymentMethod };
    if (whopCheckoutId) {
      updates.whopCheckoutId = whopCheckoutId;
    }
    const result = await this.db.update(bookings).set(updates).where(eq(bookings.id, id)).returning();
    return result[0];
  }
}

// Force in-memory storage (no database required)
export const storage = new MemStorage();
