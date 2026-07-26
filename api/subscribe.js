import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Rate limiting using simple in-memory store (for production, use Redis)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // Max 5 requests per minute per IP

function getRateLimitKey(ip) {
  return `subscribe_${ip}`;
}

function checkRateLimit(ip) {
  const key = getRateLimitKey(ip);
  const now = Date.now();
  const requests = rateLimitMap.get(key) || [];
  
  // Filter out old requests
  const recentRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= RATE_LIMIT_MAX) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(key, recentRequests);
  
  // Clean up old entries periodically
  if (rateLimitMap.size > 1000) {
    rateLimitMap.clear();
  }
  
  return true;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitizeEmail(email) {
  return email.toLowerCase().trim();
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Rate limiting
    const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
    if (!checkRateLimit(ip)) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }

    // Sanitize email
    const sanitizedEmail = sanitizeEmail(email);

    // Check if email already exists in Supabase
    const { data: existingSubscriber, error: checkError } = await supabase
      .from('subscribers')
      .select('email')
      .eq('email', sanitizedEmail)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is expected for new subscribers
      console.error('Error checking subscriber:', checkError);
      return res.status(500).json({ error: 'Unable to process subscription' });
    }

    if (existingSubscriber) {
      return res.status(409).json({ error: 'Email already subscribed' });
    }

    // Add subscriber to Supabase
    const { error: insertError } = await supabase
      .from('subscribers')
      .insert({
        email: sanitizedEmail,
        status: 'active'
      });

    if (insertError) {
      console.error('Error inserting subscriber:', insertError);
      return res.status(500).json({ error: 'Unable to process subscription' });
    }

    // Send welcome email via Resend
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@thewaqarmind.com',
        to: sanitizedEmail,
        subject: 'Welcome to TheWaqarMind',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to TheWaqarMind</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                background-color: #000000;
                color: #E1E0CC;
                margin: 0;
                padding: 0;
                line-height: 1.6;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 40px 20px;
              }
              .header {
                text-align: center;
                margin-bottom: 40px;
              }
              .logo {
                font-size: 32px;
                font-weight: 500;
                letter-spacing: -0.05em;
                color: #E1E0CC;
                margin-bottom: 10px;
              }
              .content {
                background-color: #0a0a0a;
                border: 1px solid rgba(225, 224, 204, 0.1);
                border-radius: 16px;
                padding: 40px;
              }
              h1 {
                font-size: 24px;
                font-weight: 500;
                margin-bottom: 20px;
                color: #E1E0CC;
              }
              p {
                color: rgba(225, 224, 204, 0.7);
                margin-bottom: 20px;
              }
              .signature {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid rgba(225, 224, 204, 0.1);
              }
              .footer {
                text-align: center;
                margin-top: 40px;
                font-size: 12px;
                color: rgba(225, 224, 204, 0.4);
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">TheWaqarMind</div>
              </div>
              <div class="content">
                <h1>Welcome to TheWaqarMind</h1>
                <p>You've subscribed to a space built around thoughts, perspectives, stories, and ideas.</p>
                <p>Whenever something worth sharing comes along, you'll hear from me.</p>
                <div class="signature">
                  <p>Stay curious.</p>
                  <p>— Waqar</p>
                </div>
              </div>
              <div class="footer">
                <p>You're receiving this email because you subscribed to TheWaqarMind.</p>
              </div>
            </div>
          </body>
          </html>
        `
      });
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Don't fail the subscription if email fails, just log it
      // The subscriber is already added to Supabase
    }

    return res.status(200).json({ 
      success: true,
      message: 'Successfully subscribed'
    });

  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ error: 'Unable to process subscription' });
  }
}
