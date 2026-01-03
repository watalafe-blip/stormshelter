import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

const CONTACT_EMAIL = 'info@homedefendpro.com';

export async function sendPasswordResetRequest(username: string): Promise<boolean> {
  if (!resend) {
    console.log('Email service not configured (RESEND_API_KEY missing). Password reset requested for:', username);
    return false;
  }
  
  try {
    const { error } = await resend.emails.send({
      from: 'Home Defend Pro <noreply@homedefendpro.com>',
      to: [CONTACT_EMAIL],
      subject: 'Admin Password Reset Request',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #E69138;">Password Reset Request</h2>
          <p>A password reset was requested for the admin account:</p>
          <p><strong>Username:</strong> ${username}</p>
          <p style="margin-top: 20px;">If this was you, please reset your password through the database or contact your system administrator.</p>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #ddd;" />
          <p style="color: #666; font-size: 12px;">This message was sent from the Home Defend Pro admin system.</p>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('Failed to send password reset email:', error);
      return false;
    }

    console.log('Password reset email sent for:', username);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
}

interface ContactFormData {
  firstName: string;
  lastName?: string;
  email: string;
  message: string;
}

export async function sendContactFormEmail(data: ContactFormData): Promise<boolean> {
  if (!resend) {
    console.log('Email service not configured (RESEND_API_KEY missing). Contact form submission from:', data.email);
    return false;
  }
  
  try {
    const fullName = data.lastName ? `${data.firstName} ${data.lastName}` : data.firstName;
    
    const { error } = await resend.emails.send({
      from: 'Home Defend Pro <noreply@homedefendpro.com>',
      to: [CONTACT_EMAIL],
      replyTo: data.email,
      subject: `Contact Form: ${fullName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #E69138;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          <p><strong>Message:</strong></p>
          <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${data.message}</div>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #ddd;" />
          <p style="color: #666; font-size: 12px;">This message was sent from the Home Defend Pro contact form.</p>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('Failed to send contact form email:', error);
      return false;
    }

    console.log('Contact form email sent from:', data.email);
    return true;
  } catch (error) {
    console.error('Error sending contact form email:', error);
    return false;
  }
}

interface BookingEmailData {
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

export async function sendBookingConfirmation(data: BookingEmailData): Promise<boolean> {
  if (!resend) {
    console.log('Email service not configured (RESEND_API_KEY missing). Skipping booking confirmation email for:', data.customerEmail);
    return false;
  }
  
  try {
    const totalPrice = parseFloat(data.productPrice) + parseFloat(data.shippingFee);
    const remainingBalance = totalPrice - parseFloat(data.depositPaid);

    const { error } = await resend.emails.send({
      from: 'Home Defend Pro <noreply@homedefendpro.com>',
      to: [data.customerEmail],
      subject: `Booking Confirmed - Storm Shelter Delivery`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #3E2723; margin: 0; padding: 0; background-color: #f5f5f4;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #E69138 0%, #D4842F 100%); padding: 32px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">
                  Booking Confirmed
                </h1>
                <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">
                  Your storm shelter is reserved
                </p>
              </div>
              
              <!-- Content -->
              <div style="padding: 32px;">
                <p style="font-size: 18px; margin: 0 0 24px 0;">
                  Hi ${data.customerName},
                </p>
                
                <p style="margin: 0 0 24px 0; color: #57534e;">
                  Thank you for your $${data.depositPaid} deposit. Your storm shelter delivery slot has been reserved.
                </p>
                
                <!-- Booking Reference -->
                <div style="background: #fafaf9; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                  <p style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #78716c;">
                    Booking Reference
                  </p>
                  <p style="margin: 0; font-family: monospace; font-size: 14px; color: #3E2723;">
                    ${data.bookingId}
                  </p>
                </div>
                
                <!-- Order Summary -->
                <div style="border: 1px solid #e7e5e4; border-radius: 8px; overflow: hidden; margin-bottom: 24px;">
                  <div style="padding: 16px; border-bottom: 1px solid #e7e5e4;">
                    <h3 style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #78716c;">
                      Order Summary
                    </h3>
                  </div>
                  <div style="padding: 16px;">
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; color: #57534e;">Concrete Storm Shelter (Stock #706900)</td>
                        <td style="padding: 8px 0; text-align: right;">$${parseFloat(data.productPrice).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #57534e;">Shipping (${parseFloat(data.milesFromHq).toFixed(0)} miles)</td>
                        <td style="padding: 8px 0; text-align: right;">$${parseFloat(data.shippingFee).toLocaleString()}</td>
                      </tr>
                      <tr style="border-top: 1px solid #e7e5e4;">
                        <td style="padding: 12px 0 8px 0; font-weight: 600;">Total</td>
                        <td style="padding: 12px 0 8px 0; text-align: right; font-weight: 600;">$${totalPrice.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #16a34a;">Deposit Paid</td>
                        <td style="padding: 8px 0; text-align: right; color: #16a34a;">-$${parseFloat(data.depositPaid).toLocaleString()}</td>
                      </tr>
                      <tr style="border-top: 1px solid #e7e5e4;">
                        <td style="padding: 12px 0 0 0; font-weight: 700; font-size: 18px;">Balance Due</td>
                        <td style="padding: 12px 0 0 0; text-align: right; font-weight: 700; font-size: 18px; color: #E69138;">$${remainingBalance.toLocaleString()}</td>
                      </tr>
                    </table>
                  </div>
                </div>
                
                <!-- Delivery Address -->
                <div style="border: 1px solid #e7e5e4; border-radius: 8px; overflow: hidden; margin-bottom: 24px;">
                  <div style="padding: 16px; border-bottom: 1px solid #e7e5e4;">
                    <h3 style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #78716c;">
                      Delivery Address
                    </h3>
                  </div>
                  <div style="padding: 16px;">
                    <p style="margin: 0; color: #3E2723;">
                      ${data.deliveryAddress}<br>
                      ${data.deliveryCity}, ${data.deliveryState} ${data.deliveryZip}
                    </p>
                  </div>
                </div>
                
                <!-- Next Steps -->
                <div style="background: #fefce8; border: 1px solid #fef08a; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                  <h3 style="margin: 0 0 12px 0; color: #854d0e; font-size: 16px;">
                    What's Next?
                  </h3>
                  <ol style="margin: 0; padding-left: 20px; color: #854d0e;">
                    <li style="margin-bottom: 8px;">We'll contact you to confirm your delivery window</li>
                    <li style="margin-bottom: 8px;">You'll receive an invoice for the remaining balance ($${remainingBalance.toLocaleString()}) before delivery</li>
                    <li style="margin-bottom: 8px;">Your shelter will arrive within 1 week of your scheduled date</li>
                  </ol>
                </div>
                
                <p style="margin: 0 0 16px 0; color: #57534e;">
                  If you have any questions, please don't hesitate to contact us.
                </p>
                
                <p style="margin: 0; color: #57534e;">
                  Thank you for choosing Home Defend Pro!
                </p>
              </div>
              
              <!-- Footer -->
              <div style="background: #fafaf9; padding: 24px 32px; border-top: 1px solid #e7e5e4;">
                <p style="margin: 0 0 8px 0; font-weight: 600; color: #3E2723;">
                  Home Defend Pro
                </p>
                <p style="margin: 0; font-size: 14px; color: #78716c;">
                  Family-Owned Storm Shelter Company<br>
                  Grandview, MO<br>
                  (833) 906-1077 | info@homedefendpro.com
                </p>
              </div>
            </div>
            
            <p style="text-align: center; font-size: 12px; color: #a8a29e; margin-top: 24px;">
              This email was sent regarding your storm shelter booking.
            </p>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('Failed to send booking confirmation email:', error);
      return false;
    }

    console.log('Booking confirmation email sent to:', data.customerEmail);
    return true;
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    return false;
  }
}
