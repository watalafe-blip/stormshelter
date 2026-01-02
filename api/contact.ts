import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendContactFormEmail } from './_lib/email';
import { cors } from './_lib/utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}
