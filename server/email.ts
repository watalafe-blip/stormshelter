// FILE LOCATION: server/email.ts
// Email service using Resend for sending order confirmations and invoices

import { Resend } from 'resend';

// Initialize Resend with your API key
// Get your API key from: https://resend.com/api-keys
const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderDetails {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productName: string;
  state: string;
  totalPrice: number;
  depositPaid: number;
  balanceDue: number;
  paymentId: string;
  isGoogleShopping: boolean;
  originalPrice?: number;
  discount?: number;
}

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmationEmail(order: OrderDetails) {
  const { 
    orderId, 
    customerName, 
    customerEmail, 
    productName,
    state,
    totalPrice, 
    depositPaid, 
    balanceDue,
    paymentId,
    isGoogleShopping,
    originalPrice,
    discount
  } = order;

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #16a34a; color: white; padding: 20px; text-align: center; }
    .content { background: #f9fafb; padding: 30px; margin-top: 20px; }
    .success-badge { background: #dcfce7; color: #166534; padding: 10px 20px; border-radius: 8px; display: inline-block; font-weight: bold; }
    .price-box { background: white; border: 2px solid #16a34a; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .price-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .price-row.total { font-weight: bold; font-size: 1.2em; border-bottom: none; }
    .next-steps { background: #dbeafe; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; }
    .button { background: #16a34a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; }
    .footer { text-align: center; color: #6b7280; font-size: 0.9em; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Order Confirmed!</h1>
      <p>Thank you for choosing Home Defend Pro</p>
    </div>
    
    <div class="content">
      <p>Dear ${customerName},</p>
      
      <div class="success-badge">
        ✅ Your $${depositPaid.toLocaleString()} deposit has been received!
      </div>
      
      <h2>Order Summary</h2>
      <p><strong>Order #:</strong> ${orderId}</p>
      <p><strong>Product:</strong> ${productName}</p>
      <p><strong>Delivery Location:</strong> ${state}</p>
      ${isGoogleShopping ? `<p><strong>Special Offer:</strong> Google Shopping Discount Applied!</p>` : ''}
      
      <div class="price-box">
        ${isGoogleShopping && originalPrice ? `
        <div class="price-row">
          <span>Original Price:</span>
          <span style="text-decoration: line-through; color: #9ca3af;">$${originalPrice.toLocaleString()}</span>
        </div>
        <div class="price-row">
          <span>Google Shopping Discount:</span>
          <span style="color: #16a34a;">-$${discount?.toLocaleString()}</span>
        </div>
        ` : ''}
        <div class="price-row total">
          <span>Total Price:</span>
          <span style="color: #16a34a;">$${totalPrice.toLocaleString()}</span>
        </div>
        <div class="price-row" style="background: #f0fdf4; margin-top: 10px; padding: 15px;">
          <span><strong>✅ Paid Today (Deposit):</strong></span>
          <span><strong>$${depositPaid.toLocaleString()}</strong></span>
        </div>
        <div class="price-row" style="background: #fef3c7; padding: 15px;">
          <span><strong>⏳ Balance Due Before Installation:</strong></span>
          <span><strong>$${balanceDue.toLocaleString()}</strong></span>
        </div>
      </div>
      
      <div class="next-steps">
        <h3 style="margin-top: 0;">📋 Next Steps:</h3>
        <ol style="margin: 10px 0;">
          <li><strong>We'll contact you within 24 hours</strong> to confirm your order details</li>
          <li><strong>Schedule your installation date</strong> - typically 2-4 weeks out</li>
          <li><strong>Pay balance of $${balanceDue.toLocaleString()}</strong> before installation begins</li>
          <li><strong>Professional installation</strong> - takes 2-3 days</li>
          <li><strong>Final inspection</strong> - we ensure everything is perfect!</li>
        </ol>
      </div>
      
      <h3>What's Included:</h3>
      <ul>
        <li>✅ ${productName}</li>
        <li>✅ Free delivery to ${state}</li>
        <li>✅ Professional installation guide</li>
        <li>✅ Lifetime warranty on concrete structure</li>
        <li>✅ 5-year warranty on doors and hardware</li>
        <li>✅ FEMA P-361 & ICC 500 certified</li>
      </ul>
      
      <p><strong>Payment Receipt:</strong></p>
      <p>Payment ID: ${paymentId}</p>
      <p>Amount Paid: $${depositPaid.toLocaleString()}</p>
      <p>Payment Method: Credit Card</p>
      
      <a href="https://stormshelter.vercel.app/confirmation?order=${orderId}" class="button">
        View Order Details
      </a>
      
      <p>If you have any questions, contact us:</p>
      <p>📞 <strong>Phone:</strong> 1-800-555-0123</p>
      <p>📧 <strong>Email:</strong> orders@homedefendpro.com</p>
    </div>
    
    <div class="footer">
      <p>Home Defend Pro - Underground Storm Shelters</p>
      <p>Protecting families since 2009</p>
      <p><a href="https://stormshelter.vercel.app">stormshelter.vercel.app</a></p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Home Defend Pro <orders@homedefendpro.com>',
      to: [customerEmail],
      subject: `Order Confirmed #${orderId} - $${depositPaid} Deposit Received`,
      html: emailHtml,
    });

    if (error) {
      console.error('Error sending customer email:', error);
      return { success: false, error };
    }

    console.log('✅ Customer email sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

/**
 * Send notification email to admin
 */
export async function sendAdminNotificationEmail(order: OrderDetails) {
  const { 
    orderId, 
    customerName, 
    customerEmail,
    customerPhone,
    productName,
    state,
    totalPrice, 
    depositPaid, 
    balanceDue,
    isGoogleShopping
  } = order;

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
    .content { background: #f9fafb; padding: 30px; margin-top: 20px; }
    .info-box { background: white; border: 2px solid #2563eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .info-row { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
    .urgent { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔔 New Order Received!</h1>
      <p>Order #${orderId}</p>
    </div>
    
    <div class="content">
      <div class="urgent">
        <strong>⚡ ACTION REQUIRED:</strong> Contact customer within 24 hours to schedule installation
      </div>
      
      <div class="info-box">
        <h2>Customer Information:</h2>
        <div class="info-row"><strong>Name:</strong> ${customerName}</div>
        <div class="info-row"><strong>Email:</strong> ${customerEmail}</div>
        <div class="info-row"><strong>Phone:</strong> ${customerPhone}</div>
        <div class="info-row"><strong>Location:</strong> ${state}</div>
        ${isGoogleShopping ? '<div class="info-row" style="color: #16a34a;"><strong>Source:</strong> Google Shopping (Special Offer)</div>' : ''}
      </div>
      
      <div class="info-box">
        <h2>Order Details:</h2>
        <div class="info-row"><strong>Product:</strong> ${productName}</div>
        <div class="info-row"><strong>Total Price:</strong> $${totalPrice.toLocaleString()}</div>
        <div class="info-row" style="background: #f0fdf4;"><strong>✅ Deposit Received:</strong> $${depositPaid.toLocaleString()}</div>
        <div class="info-row" style="background: #fef3c7;"><strong>⏳ Balance Due:</strong> $${balanceDue.toLocaleString()}</div>
      </div>
      
      <h3>Next Actions:</h3>
      <ol>
        <li>Call customer at ${customerPhone}</li>
        <li>Confirm delivery address and site accessibility</li>
        <li>Schedule installation date (2-4 weeks out)</li>
        <li>Collect balance payment before installation</li>
        <li>Coordinate with installation team</li>
      </ol>
      
      <p><a href="https://stormshelter.vercel.app/admin?order=${orderId}" style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">View in Admin Dashboard</a></p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Orders <orders@homedefendpro.com>',
      to: ['admin@homedefendpro.com'], // Your admin email
      subject: `🔔 New Order #${orderId} - $${depositPaid} Deposit Received`,
      html: emailHtml,
    });

    if (error) {
      console.error('Error sending admin email:', error);
      return { success: false, error };
    }

    console.log('✅ Admin email sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending admin email:', error);
    return { success: false, error };
  }
}

/**
 * Send balance due reminder email
 */
export async function sendBalanceDueEmail(order: OrderDetails, installationDate: string) {
  const { 
    orderId, 
    customerName, 
    customerEmail,
    balanceDue
  } = order;

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #f59e0b; color: white; padding: 20px; text-align: center; }
    .content { background: #f9fafb; padding: 30px; margin-top: 20px; }
    .payment-box { background: #fef3c7; border: 3px solid #f59e0b; border-radius: 8px; padding: 25px; margin: 20px 0; text-align: center; }
    .button { background: #16a34a; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; font-size: 1.1em; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⏰ Balance Payment Due</h1>
      <p>Order #${orderId}</p>
    </div>
    
    <div class="content">
      <p>Dear ${customerName},</p>
      
      <p>Great news! Your storm shelter installation is scheduled for:</p>
      <p style="font-size: 1.3em; text-align: center; background: #dbeafe; padding: 15px; border-radius: 8px;">
        <strong>📅 ${installationDate}</strong>
      </p>
      
      <div class="payment-box">
        <h2 style="margin-top: 0;">Balance Due Before Installation:</h2>
        <p style="font-size: 2.5em; font-weight: bold; color: #f59e0b; margin: 10px 0;">
          $${balanceDue.toLocaleString()}
        </p>
        <p>Payment must be received before installation begins</p>
      </div>
      
      <p>To complete your payment:</p>
      <ol>
        <li>Click the button below to pay online</li>
        <li>Or call us at 1-800-555-0123 to pay by phone</li>
        <li>Or mail a check to our office</li>
      </ol>
      
      <div style="text-align: center;">
        <a href="https://stormshelter.vercel.app/pay-balance?order=${orderId}" class="button">
          Pay Balance Now
        </a>
      </div>
      
      <p><strong>Questions?</strong> Contact us anytime:</p>
      <p>📞 1-800-555-0123 | 📧 orders@homedefendpro.com</p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Home Defend Pro <orders@homedefendpro.com>',
      to: [customerEmail],
      subject: `Balance Payment Due - Order #${orderId} ($${balanceDue.toLocaleString()})`,
      html: emailHtml,
    });

    if (error) {
      console.error('Error sending balance due email:', error);
      return { success: false, error };
    }

    console.log('✅ Balance due email sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
