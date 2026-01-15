// FILE LOCATION: server/routes.ts
// COMPLETE FILE - You can replace entire file with this
// ⚠️ WARNING: This is a BASIC template. You may have additional custom routes!

import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { 
  products, 
  orders, 
  orderItems,
  insertProductSchema,
  insertOrderSchema,
  insertOrderItemSchema
} from "@db/schema";
import { eq } from "drizzle-orm";
import { sendOrderConfirmationEmail, sendAdminNotificationEmail, sendBalanceDueEmail } from './email';

export function registerRoutes(app: Express): Server {
  
  // ==================== PRODUCTS ====================
  
  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const allProducts = await db.select().from(products);
      res.json(allProducts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const product = await db.select().from(products).where(eq(products.id, parseInt(id)));
      
      if (product.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(product[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Create product (admin)
  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const newProduct = await db.insert(products).values(validatedData).returning();
      res.status(201).json(newProduct[0]);
    } catch (error) {
      res.status(400).json({ error: "Invalid product data" });
    }
  });

  // ==================== ORDERS ====================
  
  // Get all orders
  app.get("/api/orders", async (req, res) => {
    try {
      const allOrders = await db.select().from(orders);
      res.json(allOrders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Get single order
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const order = await db.select().from(orders).where(eq(orders.id, parseInt(id)));
      
      if (order.length === 0) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.json(order[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  // Create order
  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const newOrder = await db.insert(orders).values(validatedData).returning();
      res.status(201).json(newOrder[0]);
    } catch (error) {
      res.status(400).json({ error: "Invalid order data" });
    }
  });

  // ==================== ORDER ITEMS ====================
  
  // Get items for an order
  app.get("/api/orders/:orderId/items", async (req, res) => {
    try {
      const { orderId } = req.params;
      const items = await db.select()
        .from(orderItems)
        .where(eq(orderItems.orderId, parseInt(orderId)));
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order items" });
    }
  });

  // Add item to order
  app.post("/api/order-items", async (req, res) => {
    try {
      const validatedData = insertOrderItemSchema.parse(req.body);
      const newItem = await db.insert(orderItems).values(validatedData).returning();
      res.status(201).json(newItem[0]);
    } catch (error) {
      res.status(400).json({ error: "Invalid order item data" });
    }
  });

  // ==================== CHECKOUT (NEW) ====================
  
  // Process checkout and send confirmation emails
  app.post('/api/checkout/complete', async (req, res) => {
    try {
      const {
        orderId,
        customerName,
        customerEmail,
        customerPhone,
        productName,
        state,
        totalPrice,
        depositPaid,
        paymentId,
        isGoogleShopping,
        originalPrice,
        discount
      } = req.body;

      const balanceDue = totalPrice - depositPaid;

      const orderDetails = {
        orderId,
        customerName,
        customerEmail,
        customerPhone,
        productName,
        state,
        totalPrice,
        depositPaid,
        balanceDue,
        paymentId,
        isGoogleShopping,
        originalPrice,
        discount
      };

      // Send confirmation email to customer
      const customerEmailResult = await sendOrderConfirmationEmail(orderDetails);
      
      // Send notification email to admin
      const adminEmailResult = await sendAdminNotificationEmail(orderDetails);

      console.log('📧 Email Results:', {
        customer: customerEmailResult.success ? '✅ Sent' : '❌ Failed',
        admin: adminEmailResult.success ? '✅ Sent' : '❌ Failed'
      });

      res.json({
        success: true,
        orderId,
        emailsSent: {
          customer: customerEmailResult.success,
          admin: adminEmailResult.success
        },
        message: 'Order processed successfully! Check your email for confirmation.'
      });

    } catch (error) {
      console.error('❌ Error processing checkout:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process order',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Send balance due reminder
  app.post('/api/orders/:orderId/send-balance-reminder', async (req, res) => {
    try {
      const { orderId } = req.params;
      const { installationDate } = req.body;

      // Get order from database
      const orderData = await db.select()
        .from(orders)
        .where(eq(orders.id, parseInt(orderId)));
      
      if (orderData.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const order = orderData[0];
      
      const orderDetails = {
        orderId: order.id.toString(),
        customerName: order.customerName || 'Customer',
        customerEmail: order.customerEmail || '',
        customerPhone: order.customerPhone || '',
        productName: order.productName || 'Storm Shelter',
        state: order.shippingState || '',
        totalPrice: order.totalPrice || 0,
        depositPaid: order.depositPaid || 500,
        balanceDue: (order.totalPrice || 0) - (order.depositPaid || 500),
        paymentId: order.paymentId || '',
        isGoogleShopping: order.isGoogleShopping || false
      };

      const result = await sendBalanceDueEmail(orderDetails, installationDate);

      res.json({
        success: result.success,
        message: result.success ? 'Reminder sent!' : 'Failed to send reminder'
      });

    } catch (error) {
      console.error('Error sending reminder:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send reminder'
      });
    }
  });

  // ==================== HEALTH CHECK ====================
  
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
