const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');
const { Resend } = require('resend');

const app = express();
const PORT = 3000;

// Resend setup
const resend = new Resend('re_Vj1w4yBE_Fauuu2UKxfchKyqWidp19jd4');

// Admin API key for protected endpoints (set in environment or use default)
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'tk_admin_2026_x7k9m2p4q8r1s5t3';

// Database setup
const db = new Database(path.join(__dirname, 'analytics.db'));

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    event_label TEXT,
    page_url TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_hash TEXT,
    suspicious INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_slug TEXT NOT NULL,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    approved INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    confirmed INTEGER DEFAULT 0,
    unsubscribed INTEGER DEFAULT 0,
    confirm_token TEXT,
    unsubscribe_token TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS newsletters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject TEXT NOT NULL,
    article_slug TEXT,
    article_title TEXT,
    article_url TEXT,
    sent_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
  CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at);
  CREATE INDEX IF NOT EXISTS idx_events_suspicious ON events(suspicious);
  CREATE INDEX IF NOT EXISTS idx_comments_slug ON comments(article_slug);
  CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
`);

// Middleware
app.use(helmet());
app.use(express.json());

// CORS - only allow your domain
const allowedOrigins = ['https://trevorkavanaugh.com', 'https://www.trevorkavanaugh.com', 'http://localhost:8000', 'http://127.0.0.1:8000'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  methods: ['GET', 'POST'],
  credentials: true
}));

// Rate limiting
const trackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: 'Too many requests' }
});

const subscribeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 subscribe attempts per hour per IP
  message: { error: 'Too many subscribe attempts' }
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api/track', trackLimiter);
app.use('/api/subscribe', subscribeLimiter);
app.use(generalLimiter);

// Helper functions
function hashIP(ip) {
  return crypto.createHash('sha256').update(ip + 'trevorkavanaugh-salt-2026').digest('hex').substring(0, 16);
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function checkSuspicious(req) {
  const suspicious = [];
  const origin = req.get('origin');
  const referer = req.get('referer');
  const userAgent = req.get('user-agent') || '';

  if (!origin) suspicious.push('no_origin');
  if (origin && !allowedOrigins.includes(origin)) suspicious.push('bad_origin');
  if (!referer || !referer.includes('trevorkavanaugh.com')) suspicious.push('bad_referer');

  const botPatterns = /curl|wget|python|httpie|postman|insomnia|bot|crawler|spider|scraper/i;
  if (botPatterns.test(userAgent)) suspicious.push('bot_ua');
  if (!userAgent || userAgent.length < 10) suspicious.push('no_ua');

  return suspicious;
}

// Admin auth middleware
function requireAdmin(req, res, next) {
  const apiKey = req.get('X-API-Key');
  if (!apiKey || apiKey !== ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// ============================================
// ROUTES - Health
// ============================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// ROUTES - Analytics
// ============================================
app.post('/api/track', (req, res) => {
  try {
    const { event_type, event_label, page_url } = req.body;

    if (!event_type) {
      return res.status(400).json({ error: 'event_type required' });
    }

    const validEventTypes = ['linkedin_click', 'email_click', 'pdf_click', 'page_view', 'download', 'subscribe'];
    if (!validEventTypes.includes(event_type)) {
      return res.status(400).json({ error: 'invalid event_type' });
    }

    const suspiciousReasons = checkSuspicious(req);
    const isSuspicious = suspiciousReasons.length >= 2 ? 1 : 0;

    const stmt = db.prepare(`
      INSERT INTO events (event_type, event_label, page_url, referrer, user_agent, ip_hash, suspicious)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      event_type,
      event_label ? event_label.substring(0, 200) : null,
      page_url ? page_url.substring(0, 500) : null,
      req.get('referer')?.substring(0, 500) || null,
      req.get('user-agent')?.substring(0, 500) || null,
      hashIP(req.ip),
      isSuspicious
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Track error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

app.get('/api/stats', (req, res) => {
  try {
    const stats = {};

    const counts = db.prepare(`
      SELECT event_type, COUNT(*) as count
      FROM events WHERE suspicious = 0
      GROUP BY event_type
    `).all();

    stats.totals = counts.reduce((acc, row) => {
      acc[row.event_type] = row.count;
      return acc;
    }, {});

    const recent = db.prepare(`
      SELECT event_type, DATE(created_at) as date, COUNT(*) as count
      FROM events
      WHERE created_at >= datetime('now', '-7 days') AND suspicious = 0
      GROUP BY event_type, DATE(created_at)
      ORDER BY date DESC
    `).all();

    stats.last7days = recent;

    const uniqueVisitors = db.prepare(`
      SELECT COUNT(DISTINCT ip_hash) as count FROM events WHERE suspicious = 0
    `).get();
    stats.uniqueVisitors = uniqueVisitors.count;

    const suspiciousCount = db.prepare(`
      SELECT COUNT(*) as count FROM events WHERE suspicious = 1
    `).get();
    stats.suspiciousBlocked = suspiciousCount.count;

    // Subscriber count
    const subscriberCount = db.prepare(`
      SELECT COUNT(*) as count FROM subscribers WHERE confirmed = 1 AND unsubscribed = 0
    `).get();
    stats.activeSubscribers = subscriberCount.count;

    res.json(stats);
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

// ============================================
// ROUTES - Newsletter Subscription
// ============================================
app.post('/api/subscribe', (req, res) => {
  try {
    const origin = req.get('origin');
    if (!origin || !allowedOrigins.includes(origin)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if already subscribed
    const existing = db.prepare('SELECT * FROM subscribers WHERE email = ?').get(email.toLowerCase());

    if (existing) {
      if (existing.confirmed && !existing.unsubscribed) {
        return res.json({ success: true, message: 'Already subscribed' });
      }
      if (existing.unsubscribed) {
        // Re-subscribe
        const token = generateToken();
        db.prepare('UPDATE subscribers SET unsubscribed = 0, confirm_token = ?, confirmed = 0 WHERE id = ?')
          .run(token, existing.id);
        // Send confirmation email
        sendConfirmationEmail(email, token);
        return res.json({ success: true, message: 'Please check your email to confirm' });
      }
    }

    // New subscriber
    const confirmToken = generateToken();
    const unsubscribeToken = generateToken();

    db.prepare(`
      INSERT INTO subscribers (email, confirm_token, unsubscribe_token)
      VALUES (?, ?, ?)
    `).run(email.toLowerCase(), confirmToken, unsubscribeToken);

    // Send confirmation email
    sendConfirmationEmail(email, confirmToken);

    res.json({ success: true, message: 'Please check your email to confirm your subscription' });
  } catch (err) {
    console.error('Subscribe error:', err);
    if (err.code === 'SQLITE_CONSTRAINT') {
      return res.json({ success: true, message: 'Already subscribed' });
    }
    res.status(500).json({ error: 'Internal error' });
  }
});

// Confirm subscription
app.get('/api/confirm/:token', async (req, res) => {
  try {
    const subscriber = db.prepare('SELECT * FROM subscribers WHERE confirm_token = ?').get(req.params.token);

    if (!subscriber) {
      return res.status(404).send('Invalid or expired confirmation link');
    }

    db.prepare('UPDATE subscribers SET confirmed = 1, confirm_token = NULL WHERE id = ?').run(subscriber.id);

    // Redirect to thank you page or show message
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Subscription Confirmed | Trevor Kavanaugh</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                 display: flex; justify-content: center; align-items: center; height: 100vh;
                 background: #f8f9fa; margin: 0; }
          .card { background: white; padding: 48px; border-radius: 12px; text-align: center;
                  box-shadow: 0 4px 20px rgba(0,0,0,0.1); max-width: 400px; }
          h1 { color: #1a2a3a; margin-bottom: 16px; }
          p { color: #4a5568; line-height: 1.6; }
          a { color: #4A90E2; text-decoration: none; font-weight: 500; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>You're subscribed!</h1>
          <p>Thanks for confirming. You'll receive new articles every Tuesday and Thursday.</p>
          <p><a href="https://trevorkavanaugh.com">← Back to site</a></p>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    console.error('Confirm error:', err);
    res.status(500).send('Something went wrong');
  }
});

// Unsubscribe
app.get('/api/unsubscribe/:token', (req, res) => {
  try {
    const subscriber = db.prepare('SELECT * FROM subscribers WHERE unsubscribe_token = ?').get(req.params.token);

    if (!subscriber) {
      return res.status(404).send('Invalid unsubscribe link');
    }

    db.prepare('UPDATE subscribers SET unsubscribed = 1 WHERE id = ?').run(subscriber.id);

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Unsubscribed | Trevor Kavanaugh</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                 display: flex; justify-content: center; align-items: center; height: 100vh;
                 background: #f8f9fa; margin: 0; }
          .card { background: white; padding: 48px; border-radius: 12px; text-align: center;
                  box-shadow: 0 4px 20px rgba(0,0,0,0.1); max-width: 400px; }
          h1 { color: #1a2a3a; margin-bottom: 16px; }
          p { color: #4a5568; line-height: 1.6; }
          a { color: #4A90E2; text-decoration: none; font-weight: 500; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Unsubscribed</h1>
          <p>You've been removed from the mailing list. Sorry to see you go!</p>
          <p><a href="https://trevorkavanaugh.com">← Back to site</a></p>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    console.error('Unsubscribe error:', err);
    res.status(500).send('Something went wrong');
  }
});

// ============================================
// ROUTES - Newsletter Sending (Admin only)
// ============================================
app.post('/api/newsletter/send', requireAdmin, async (req, res) => {
  try {
    const { subject, article_title, article_slug, article_url, article_content } = req.body;

    if (!subject || !article_title || !article_content) {
      return res.status(400).json({ error: 'subject, article_title, and article_content required' });
    }

    // Get confirmed, active subscribers
    const subscribers = db.prepare(`
      SELECT email, unsubscribe_token FROM subscribers
      WHERE confirmed = 1 AND unsubscribed = 0
    `).all();

    if (subscribers.length === 0) {
      return res.json({ success: true, sent: 0, message: 'No active subscribers' });
    }

    // Log newsletter
    const newsletter = db.prepare(`
      INSERT INTO newsletters (subject, article_slug, article_title, article_url)
      VALUES (?, ?, ?, ?)
    `).run(subject, article_slug || null, article_title, article_url);

    let sentCount = 0;
    const errors = [];

    for (const subscriber of subscribers) {
      try {
        await resend.emails.send({
          from: 'Trevor Kavanaugh <newsletter@trevorkavanaugh.com>',
          to: subscriber.email,
          subject: subject,
          html: generateNewsletterHTML({
            article_title,
            article_content,
            unsubscribe_url: `https://api.trevorkavanaugh.com/api/unsubscribe/${subscriber.unsubscribe_token}`
          })
        });
        sentCount++;
      } catch (err) {
        console.error(`Failed to send to ${subscriber.email}:`, err);
        errors.push(subscriber.email);
      }
    }

    // Update sent count
    db.prepare('UPDATE newsletters SET sent_count = ? WHERE id = ?').run(sentCount, newsletter.lastInsertRowid);

    res.json({
      success: true,
      sent: sentCount,
      total: subscribers.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (err) {
    console.error('Newsletter send error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

// Get subscriber list (Admin only)
app.get('/api/subscribers', requireAdmin, (req, res) => {
  try {
    const subscribers = db.prepare(`
      SELECT id, email, confirmed, unsubscribed, created_at
      FROM subscribers
      ORDER BY created_at DESC
    `).all();
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ error: 'Internal error' });
  }
});

// ============================================
// Email Templates
// ============================================
async function sendConfirmationEmail(email, token) {
  const confirmUrl = `https://api.trevorkavanaugh.com/api/confirm/${token}`;

  try {
    await resend.emails.send({
      from: 'Trevor Kavanaugh <newsletter@trevorkavanaugh.com>',
      to: email,
      subject: 'Confirm your subscription',
      html: `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Confirm your subscription</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: Arial, Helvetica, sans-serif;">
          <!-- Wrapper Table -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f5f7;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <!-- Main Container -->
                <table border="0" cellpadding="0" cellspacing="0" width="500" style="max-width: 500px;">

                  <!-- Logo -->
                  <tr>
                    <td align="center" style="padding-bottom: 30px;">
                      <a href="https://trevorkavanaugh.com" style="text-decoration: none;">
                        <table border="0" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="border: 2px solid #4A90E2; padding: 10px 20px; font-size: 24px; font-weight: bold; color: #4A90E2; font-family: Arial, Helvetica, sans-serif;">
                              TK
                            </td>
                          </tr>
                        </table>
                      </a>
                    </td>
                  </tr>

                  <!-- Content Card -->
                  <tr>
                    <td>
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border-radius: 8px;">
                        <tr>
                          <td style="padding: 40px;">
                            <!-- Title -->
                            <h1 style="margin: 0 0 20px 0; font-size: 24px; line-height: 1.3; color: #1a2a3a; font-family: Arial, Helvetica, sans-serif; text-align: center;">
                              Welcome to the newsletter
                            </h1>

                            <!-- Description -->
                            <p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.6; font-size: 16px; font-family: Arial, Helvetica, sans-serif; text-align: center;">
                              Thanks for subscribing! You'll receive new articles on third-party risk management every Tuesday and Thursday—practical insights on vendor risk, regulatory compliance, and building programs that scale.
                            </p>
                            <p style="margin: 0 0 32px 0; color: #4a5568; line-height: 1.6; font-size: 16px; font-family: Arial, Helvetica, sans-serif; text-align: center;">
                              Click below to confirm your subscription and you're all set.
                            </p>

                            <!-- CTA Button -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                              <tr>
                                <td align="center">
                                  <table border="0" cellpadding="0" cellspacing="0">
                                    <tr>
                                      <td align="center" bgcolor="#4A90E2" style="border-radius: 6px;">
                                        <a href="${confirmUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 16px; color: #ffffff; text-decoration: none; font-weight: bold; font-family: Arial, Helvetica, sans-serif;">
                                          Confirm Subscription
                                        </a>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>

                            <!-- Note -->
                            <p style="margin: 32px 0 0 0; color: #8899aa; line-height: 1.6; font-size: 14px; font-family: Arial, Helvetica, sans-serif; text-align: center;">
                              If you didn't request this, you can ignore this email.
                            </p>

                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td align="center" style="padding-top: 24px;">
                      <p style="margin: 0; color: #8899aa; font-size: 13px; font-family: Arial, Helvetica, sans-serif;">
                        &copy; 2026 Trevor Kavanaugh
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    });
  } catch (err) {
    console.error('Failed to send confirmation email:', err);
  }
}

function generateNewsletterHTML({ article_title, article_content, unsubscribe_url }) {
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${article_title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: Arial, Helvetica, sans-serif;">
      <!-- Wrapper Table -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f5f7;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <!-- Main Container -->
            <table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px;">

              <!-- Logo -->
              <tr>
                <td align="center" style="padding-bottom: 30px;">
                  <a href="https://trevorkavanaugh.com" style="text-decoration: none;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="border: 2px solid #4A90E2; padding: 10px 20px; font-size: 24px; font-weight: bold; color: #4A90E2; font-family: Arial, Helvetica, sans-serif;">
                          TK
                        </td>
                      </tr>
                    </table>
                  </a>
                </td>
              </tr>

              <!-- Content Card -->
              <tr>
                <td>
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border-radius: 8px;">
                    <tr>
                      <td style="padding: 40px;">
                        <!-- Title -->
                        <h1 style="margin: 0 0 24px 0; font-size: 26px; line-height: 1.3; color: #1a2a3a; font-family: Arial, Helvetica, sans-serif;">
                          ${article_title}
                        </h1>

                        <!-- Article Content -->
                        <div style="color: #4a5568; line-height: 1.8; font-size: 16px; font-family: Arial, Helvetica, sans-serif;">
                          ${article_content}
                        </div>

                        <!-- Divider -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 40px;">
                          <tr>
                            <td style="border-top: 1px solid #e2e8f0; padding-top: 32px;">
                            </td>
                          </tr>
                        </table>

                        <!-- CTA -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td align="center">
                              <p style="color: #4a5568; margin: 0 0 16px 0; font-family: Arial, Helvetica, sans-serif;">For more insights & perspectives</p>
                              <table border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td align="center" bgcolor="#4A90E2" style="border-radius: 6px;">
                                    <a href="https://trevorkavanaugh.com/insights.html" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 16px; color: #ffffff; text-decoration: none; font-weight: bold; font-family: Arial, Helvetica, sans-serif;">
                                      Visit trevorkavanaugh.com &rarr;
                                    </a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>

                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td align="center" style="padding-top: 30px;">
                  <p style="margin: 0 0 8px 0; color: #8899aa; font-size: 14px; font-family: Arial, Helvetica, sans-serif;">
                    Trevor Kavanaugh | Third-Party Risk Management
                  </p>
                  <p style="margin: 0 0 16px 0; font-size: 14px; font-family: Arial, Helvetica, sans-serif;">
                    <a href="https://trevorkavanaugh.com" style="color: #4A90E2; text-decoration: none;">Website</a>
                    &nbsp;&middot;&nbsp;
                    <a href="https://www.linkedin.com/in/trevorkavanaugh/" style="color: #4A90E2; text-decoration: none;">LinkedIn</a>
                  </p>
                  <p style="margin: 0; font-size: 14px; font-family: Arial, Helvetica, sans-serif;">
                    <a href="${unsubscribe_url}" style="color: #8899aa; text-decoration: underline;">Unsubscribe</a>
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// ============================================
// ROUTES - Comments
// ============================================
app.get('/api/comments/:slug', (req, res) => {
  try {
    const comments = db.prepare(`
      SELECT id, author_name, content, created_at
      FROM comments
      WHERE article_slug = ? AND approved = 1
      ORDER BY created_at DESC
    `).all(req.params.slug);
    res.json(comments);
  } catch (err) {
    console.error('Get comments error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

app.post('/api/comments', (req, res) => {
  try {
    const origin = req.get('origin');
    if (!origin || !allowedOrigins.includes(origin)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { article_slug, author_name, content } = req.body;

    if (!article_slug || !author_name || !content) {
      return res.status(400).json({ error: 'article_slug, author_name, and content required' });
    }

    if (content.length > 2000) {
      return res.status(400).json({ error: 'Comment too long (max 2000 chars)' });
    }

    db.prepare(`
      INSERT INTO comments (article_slug, author_name, content)
      VALUES (?, ?, ?)
    `).run(article_slug.substring(0, 100), author_name.substring(0, 100), content.substring(0, 2000));

    res.json({ success: true, message: 'Comment submitted for moderation' });
  } catch (err) {
    console.error('Post comment error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

app.get('/api/comments/pending/all', requireAdmin, (req, res) => {
  try {
    const comments = db.prepare('SELECT * FROM comments WHERE approved = 0 ORDER BY created_at DESC').all();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Internal error' });
  }
});

app.post('/api/comments/:id/moderate', requireAdmin, (req, res) => {
  try {
    const { approve } = req.body;
    if (approve) {
      db.prepare('UPDATE comments SET approved = 1 WHERE id = ?').run(req.params.id);
    } else {
      db.prepare('DELETE FROM comments WHERE id = ?').run(req.params.id);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal error' });
  }
});

// Start server
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Trevor Kavanaugh API running on port ${PORT}`);
});
