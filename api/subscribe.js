import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Supabase with Service Role Key for server-side operations
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

// Safe error logging function
function logError(context, error, details = {}) {
  console.error(`[${context}] Error:`, {
    message: error.message,
    code: error.code,
    details: error.details || details,
    timestamp: new Date().toISOString()
  });
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    // Validate email
    if (!email || typeof email !== 'string') {
      logError('Validation', new Error('Email is required'), { email });
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!validateEmail(email)) {
      logError('Validation', new Error('Invalid email address'), { email });
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Check environment variables
    if (!process.env.RESEND_API_KEY) {
      logError('Config', new Error('RESEND_API_KEY is not configured'));
      return res.status(500).json({ error: 'Server configuration error' });
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      logError('Config', new Error('Supabase service role credentials are not configured'));
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Rate limiting
    const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
    if (!checkRateLimit(ip)) {
      logError('RateLimit', new Error('Too many requests'), { ip });
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }

    // Sanitize email
    const sanitizedEmail = sanitizeEmail(email);

    // Add subscriber to Supabase (UNIQUE constraint will handle duplicates)
    const { error: insertError } = await supabase
      .from('subscribers')
      .insert({
        email: sanitizedEmail
      });

    if (insertError) {
      // Handle duplicate email (UNIQUE constraint violation)
      if (insertError.code === '23505') {
        logError('Duplicate', new Error('Email already subscribed'), { email: sanitizedEmail });
        return res.status(409).json({ error: 'Email already subscribed' });
      }
      
      // Handle other errors
      logError('SupabaseInsert', insertError, { email: sanitizedEmail, code: insertError.code, message: insertError.message });
      return res.status(500).json({ 
        error: 'Database insert failed',
        details: insertError.message,
        code: insertError.code
      });
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
      logError('ResendEmail', emailError, { email: sanitizedEmail });
      // Don't fail the subscription if email fails, just log it
      // The subscriber is already added to Supabase
    }

    return res.status(200).json({ 
      success: true,
      message: 'Successfully subscribed'
    });

  } catch (error) {
    logError('General', error, { body: req.body });
    return res.status(500).json({ error: 'Unable to process subscription' });
  }
}
