import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface BookingConfirmationData {
  customerName: string;
  customerEmail: string;
  bookingId: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryZip: string;
  milesFromHq: string;
  shippingFee: string;
  productPrice: string;
  depositPaid: string;
  remainingBalance: string;
  deliveryDate: string;
}

export async function sendBookingConfirmation(data: BookingConfirmationData) {
  const formattedDate = new Date(data.deliveryDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
</head>
<body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #3E2723; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #faf9f7;">
  <div style="background: linear-gradient(135deg, #E69138 0%, #D4842F 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Home Defend Pro</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">Underground Storm Shelters</p>
  </div>
  
  <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
    <h2 style="color: #3E2723; margin-top: 0;">Booking Confirmed!</h2>
    <p>Dear ${data.customerName},</p>
    <p>Thank you for your deposit. Your storm shelter delivery slot has been secured.</p>
    
    <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #3E2723;">Booking Details</h3>
      <p><strong>Booking ID:</strong> ${data.bookingId}</p>
      <p><strong>Delivery Date:</strong> ${formattedDate}</p>
      <p><strong>Delivery Address:</strong><br>${data.deliveryAddress}<br>${data.deliveryCity}, ${data.deliveryState} ${data.deliveryZip}</p>
      <p><strong>Distance:</strong> ${Math.round(parseFloat(data.milesFromHq))} miles from our facility</p>
    </div>
    
    <div style="background: #fff8e1; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #E69138;">
      <h3 style="margin-top: 0; color: #3E2723;">Order Summary</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td>Storm Shelter (Stock #706900)</td><td style="text-align: right;">$${parseFloat(data.productPrice).toLocaleString()}</td></tr>
        <tr><td>Shipping (${Math.round(parseFloat(data.milesFromHq))} mi × $5.20)</td><td style="text-align: right;">$${parseFloat(data.shippingFee).toLocaleString()}</td></tr>
        <tr style="border-top: 2px solid #E69138;"><td style="padding-top: 10px;"><strong>Deposit Paid</strong></td><td style="text-align: right; padding-top: 10px;"><strong style="color: #2e7d32;">-$${parseFloat(data.depositPaid).toLocaleString()}</strong></td></tr>
        <tr><td><strong>Remaining Balance</strong></td><td style="text-align: right;"><strong>$${parseFloat(data.remainingBalance).toLocaleString()}</strong></td></tr>
      </table>
    </div>
    
    <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #2e7d32;">Next Steps</h3>
      <ol style="margin-bottom: 0; padding-left: 20px;">
        <li>We'll contact you 1-2 weeks before delivery to confirm details</li>
        <li>Remaining balance will be invoiced before delivery</li>
        <li>Have unloading equipment ready (forklift or crane for ~12,000 lbs)</li>
      </ol>
    </div>
    
    <p style="color: #666; font-size: 14px; margin-top: 30px;">Questions? Reply to this email or call us at (816) 555-0123.</p>
    <p style="color: #666; font-size: 14px;">— The Home Defend Pro Team</p>
  </div>
</body>
</html>
  `;

  await resend.emails.send({
    from: 'Home Defend Pro <bookings@homedefendpro.com>',
    to: data.customerEmail,
    subject: `Booking Confirmed - Delivery ${formattedDate}`,
    html: htmlContent,
  });
}

interface ContactFormData {
  firstName: string;
  lastName?: string;
  email: string;
  message: string;
}

export async function sendContactFormEmail(data: ContactFormData) {
  const fullName = data.lastName ? `${data.firstName} ${data.lastName}` : data.firstName;
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Contact Form Submission</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #3E2723; padding: 20px; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 20px;">New Contact Form Submission</h1>
  </div>
  
  <div style="background: #f5f5f5; padding: 20px; border-radius: 0 0 8px 8px;">
    <p><strong>From:</strong> ${fullName}</p>
    <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
    
    <div style="background: white; padding: 15px; border-radius: 6px; margin-top: 15px;">
      <p style="margin: 0;"><strong>Message:</strong></p>
      <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${data.message}</p>
    </div>
  </div>
</body>
</html>
  `;

  await resend.emails.send({
    from: 'Home Defend Pro <noreply@homedefendpro.com>',
    to: 'info@homedefendpro.com',
    replyTo: data.email,
    subject: `Contact Form: ${fullName}`,
    html: htmlContent,
  });
}
