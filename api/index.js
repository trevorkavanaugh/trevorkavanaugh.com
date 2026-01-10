const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');
const { Resend } = require('resend');

// Import auth module
const { registerAuthRoutes } = require('./auth');

// Import dashboard module
const dashboardRoutes = require('./dashboard');

// Import background jobs module
const jobs = require('./jobs');

// Import GeoIP module
const geo = require('./geo');

const app = express();
const PORT = 3000;

// Trust proxy (required when behind nginx/load balancer for correct IP detection)
app.set('trust proxy', 1);

// Resend setup
const resend = new Resend('re_Vj1w4yBE_Fauuu2UKxfchKyqWidp19jd4');

// Admin API key for protected endpoints (set in environment or use default)
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'tk_admin_2026_x7k9m2p4q8r1s5t3';

// Database setup
const db = new Database(path.join(__dirname, 'analytics.db'));

// Initialize tables
db.exec(`
  -- ============================================
  -- EXISTING TABLES (Newsletter, Comments, Events)
  -- ============================================

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

  -- Existing indexes
  CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
  CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at);
  CREATE INDEX IF NOT EXISTS idx_events_suspicious ON events(suspicious);
  CREATE INDEX IF NOT EXISTS idx_comments_slug ON comments(article_slug);
  CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);

  -- ============================================
  -- ANALYTICS PLATFORM TABLES
  -- ============================================

  -- Visitors (persistent across sessions)
  CREATE TABLE IF NOT EXISTS visitors (
    id TEXT PRIMARY KEY,
    first_seen TEXT NOT NULL,
    last_seen TEXT NOT NULL,
    visit_count INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  -- Sessions (30-min inactivity timeout)
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    visitor_id TEXT NOT NULL,
    started_at TEXT NOT NULL,
    ended_at TEXT,
    duration_seconds INTEGER,
    entry_page TEXT NOT NULL,
    exit_page TEXT,
    page_count INTEGER DEFAULT 1,
    referrer_url TEXT,
    referrer_domain TEXT,
    referrer_type TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    country TEXT,
    region TEXT,
    city TEXT,
    device_type TEXT,
    browser TEXT,
    browser_version TEXT,
    os TEXT,
    screen_resolution TEXT,
    language TEXT,
    timezone TEXT,
    is_bot INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visitor_id) REFERENCES visitors(id)
  );

  -- Page Views
  CREATE TABLE IF NOT EXISTS page_views (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    visitor_id TEXT NOT NULL,
    url TEXT NOT NULL,
    path TEXT NOT NULL,
    title TEXT,
    referrer_url TEXT,
    time_on_page_seconds INTEGER,
    scroll_depth_percent INTEGER,
    timestamp TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(id),
    FOREIGN KEY (visitor_id) REFERENCES visitors(id)
  );

  -- Daily Aggregates
  CREATE TABLE IF NOT EXISTS daily_stats (
    date TEXT NOT NULL,
    page_path TEXT NOT NULL,
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    sessions INTEGER DEFAULT 0,
    avg_time_on_page_seconds REAL,
    avg_scroll_depth_percent REAL,
    bounce_count INTEGER DEFAULT 0,
    entries INTEGER DEFAULT 0,
    exits INTEGER DEFAULT 0,
    PRIMARY KEY (date, page_path)
  );

  -- Referrer Aggregates
  CREATE TABLE IF NOT EXISTS daily_referrer_stats (
    date TEXT NOT NULL,
    referrer_domain TEXT NOT NULL,
    referrer_type TEXT NOT NULL,
    visits INTEGER DEFAULT 0,
    page_views INTEGER DEFAULT 0,
    PRIMARY KEY (date, referrer_domain)
  );

  -- Event Aggregates
  CREATE TABLE IF NOT EXISTS daily_event_stats (
    date TEXT NOT NULL,
    event_name TEXT NOT NULL,
    count INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    PRIMARY KEY (date, event_name)
  );

  -- MFA Users (Analytics Dashboard Authentication)
  CREATE TABLE IF NOT EXISTS analytics_users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    totp_secret_encrypted TEXT,
    totp_enabled INTEGER DEFAULT 0,
    backup_codes_hashed TEXT,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TEXT,
    last_login TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  -- Auth Sessions
  CREATE TABLE IF NOT EXISTS auth_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    expires_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES analytics_users(id)
  );

  -- Auth Logs
  CREATE TABLE IF NOT EXISTS auth_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    event_type TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP
  );

  -- ============================================
  -- ANALYTICS PLATFORM INDEXES
  -- ============================================

  CREATE INDEX IF NOT EXISTS idx_sessions_visitor_id ON sessions(visitor_id);
  CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON sessions(started_at);
  CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
  CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path);
  CREATE INDEX IF NOT EXISTS idx_page_views_timestamp ON page_views(timestamp);
  CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats(date);
  CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON auth_sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_auth_sessions_expires ON auth_sessions(expires_at);
`);

// Middleware
app.use(helmet());
app.use(express.json());
app.use(cookieParser(process.env.SESSION_SECRET || 'default-session-secret-change-in-production'));

// Serve static files for analytics dashboard
app.use('/analytics', express.static(path.join(__dirname, 'public', 'analytics')));

// CORS - only allow your domain
const allowedOrigins = [
  'https://trevorkavanaugh.com',
  'https://www.trevorkavanaugh.com',
  'http://localhost:8000',
  'http://127.0.0.1:8000',
  'http://localhost:5173',  // For analytics dashboard dev
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  methods: ['GET', 'POST', 'DELETE'],
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

// ============================================
// ROUTES - Analytics Collection (New Platform)
// ============================================

// Rate limiter for analytics collection - 100 requests per 15 minutes per IP
const analyticsCollectLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests' }
});

// Helper: Parse request body (handles both JSON and text/plain from sendBeacon)
function parseCollectBody(req) {
  // If already parsed as JSON by express.json()
  if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
    return req.body;
  }
  // If text/plain (sendBeacon sometimes sends as text), try to parse
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch (e) {
      return null;
    }
  }
  return null;
}

// Helper: Detect bot from user agent
function isBot(userAgent) {
  if (!userAgent) return true;
  const botPatterns = /bot|crawler|spider|scraper|curl|wget|python|httpie|postman|insomnia|headless|phantom|selenium|puppeteer|playwright|lighthouse|pagespeed|gtmetrix/i;
  return botPatterns.test(userAgent);
}

// Helper: Generate UUID for page views
function generatePageViewId() {
  return crypto.randomUUID();
}

// POST /api/analytics/collect
// Receives batched tracking data from client script
// Body: { visitor_id, session_id, events: [...], context: {...} }
app.post('/api/analytics/collect', analyticsCollectLimiter, express.text({ type: 'text/plain' }), (req, res) => {
  try {
    // Parse the request body (handles JSON and text/plain)
    const payload = parseCollectBody(req);

    // Validate payload exists
    if (!payload) {
      console.error('Analytics collect: Invalid payload format');
      return res.status(204).end();
    }

    const { visitor_id, session_id, events, context } = payload;

    // Validate required fields
    if (!visitor_id || !session_id || !Array.isArray(events) || events.length === 0) {
      console.error('Analytics collect: Missing required fields');
      return res.status(204).end();
    }

    // Validate reasonable sizes to prevent abuse
    if (visitor_id.length > 100 || session_id.length > 100 || events.length > 50) {
      console.error('Analytics collect: Payload too large');
      return res.status(204).end();
    }

    // Detect bot
    const userAgent = req.get('user-agent') || '';
    const isBotRequest = isBot(userAgent);

    // Current timestamp for database operations
    const now = new Date().toISOString();

    // ==================================================
    // UPSERT VISITOR
    // If visitor doesn't exist: INSERT with first_seen = now, visit_count = 1
    // If visitor exists: UPDATE last_seen = now
    // ==================================================
    const existingVisitor = db.prepare('SELECT id FROM visitors WHERE id = ?').get(visitor_id);

    if (existingVisitor) {
      // Update last_seen
      db.prepare('UPDATE visitors SET last_seen = ? WHERE id = ?').run(now, visitor_id);
    } else {
      // Create new visitor
      db.prepare(`
        INSERT INTO visitors (id, first_seen, last_seen, visit_count, created_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(
        visitor_id,
        now,
        now,
        context?.visit_count || 1,
        now
      );
    }

    // ==================================================
    // UPSERT SESSION
    // If session doesn't exist: INSERT with entry_page, all context data
    // If session exists: UPDATE exit_page, page_count++, last activity time
    // ==================================================
    const existingSession = db.prepare('SELECT id, page_count FROM sessions WHERE id = ?').get(session_id);

    // Find the first page_view event to get entry page info
    const firstPageView = events.find(e => e.event === 'page_view');
    const lastPageView = [...events].reverse().find(e => e.event === 'page_view' || e.event === 'page_exit');

    if (existingSession) {
      // Update session with latest data
      const newPageCount = existingSession.page_count + events.filter(e => e.event === 'page_view').length;
      db.prepare(`
        UPDATE sessions
        SET exit_page = COALESCE(?, exit_page),
            page_count = ?,
            ended_at = ?
        WHERE id = ?
      `).run(
        lastPageView?.data?.path || null,
        newPageCount,
        now,
        session_id
      );
    } else {
      // Create new session
      const ctx = context || {};

      // Get client IP for geo lookup
      const clientIP = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || req.connection?.remoteAddress;
      const geoData = geo.lookup(clientIP);

      db.prepare(`
        INSERT INTO sessions (
          id, visitor_id, started_at, ended_at, entry_page, exit_page, page_count,
          referrer_url, referrer_domain, referrer_type,
          utm_source, utm_medium, utm_campaign, utm_term, utm_content,
          country, region, city,
          device_type, browser, browser_version, os, screen_resolution, language, timezone,
          is_bot, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        session_id,
        visitor_id,
        now,
        now,
        firstPageView?.data?.path || ctx.entry_page || '/',
        lastPageView?.data?.path || null,
        events.filter(e => e.event === 'page_view').length || 1,
        ctx.referrer_url?.substring(0, 500) || null,
        ctx.referrer_domain?.substring(0, 100) || null,
        ctx.referrer_type?.substring(0, 50) || null,
        ctx.utm_source?.substring(0, 100) || null,
        ctx.utm_medium?.substring(0, 100) || null,
        ctx.utm_campaign?.substring(0, 200) || null,
        ctx.utm_term?.substring(0, 200) || null,
        ctx.utm_content?.substring(0, 200) || null,
        geoData.country || null,
        geoData.region || null,
        geoData.city || null,
        ctx.device_type?.substring(0, 50) || null,
        ctx.browser?.substring(0, 50) || null,
        ctx.browser_version?.substring(0, 20) || null,
        ctx.os?.substring(0, 50) || null,
        ctx.screen_resolution?.substring(0, 20) || null,
        ctx.language?.substring(0, 10) || null,
        ctx.timezone?.substring(0, 50) || null,
        isBotRequest ? 1 : 0,
        now
      );
    }

    // ==================================================
    // PROCESS EVENTS
    // page_view -> INSERT page_views
    // page_exit -> UPDATE page_views (time_on_page, scroll_depth)
    // scroll_milestone -> UPDATE page_views (scroll_depth)
    // * -> INSERT events
    // ==================================================

    // Prepared statements for efficiency
    const insertPageView = db.prepare(`
      INSERT INTO page_views (id, session_id, visitor_id, url, path, title, referrer_url, timestamp, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const updatePageViewMetrics = db.prepare(`
      UPDATE page_views
      SET time_on_page_seconds = COALESCE(?, time_on_page_seconds),
          scroll_depth_percent = MAX(COALESCE(scroll_depth_percent, 0), COALESCE(?, 0))
      WHERE session_id = ? AND path = ?
      ORDER BY timestamp DESC
      LIMIT 1
    `);

    const insertEvent = db.prepare(`
      INSERT INTO events (event_type, event_label, page_url, referrer, user_agent, ip_hash, suspicious, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Track page view IDs by path for updates
    const pageViewByPath = new Map();

    for (const event of events) {
      const eventName = event.event;
      const eventData = event.data || {};
      const eventTimestamp = event.timestamp || now;

      switch (eventName) {
        case 'page_view': {
          // INSERT into page_views
          const pageViewId = generatePageViewId();
          insertPageView.run(
            pageViewId,
            session_id,
            visitor_id,
            eventData.url?.substring(0, 500) || '',
            eventData.path?.substring(0, 200) || '/',
            eventData.title?.substring(0, 200) || null,
            eventData.referrer?.substring(0, 500) || null,
            eventTimestamp,
            now
          );
          pageViewByPath.set(eventData.path, pageViewId);
          break;
        }

        case 'page_exit': {
          // UPDATE page_views with time_on_page and scroll_depth
          const timeOnPage = eventData.time_on_page_seconds || eventData.timeOnPage || null;
          const scrollDepth = eventData.scroll_depth_percent || eventData.scrollDepth || null;

          // Update the most recent page view for this path
          db.prepare(`
            UPDATE page_views
            SET time_on_page_seconds = ?,
                scroll_depth_percent = ?
            WHERE id = (
              SELECT id FROM page_views
              WHERE session_id = ? AND path = ?
              ORDER BY timestamp DESC
              LIMIT 1
            )
          `).run(
            timeOnPage,
            scrollDepth,
            session_id,
            eventData.path?.substring(0, 200) || '/'
          );
          break;
        }

        case 'scroll_depth':
        case 'scroll_milestone': {
          // UPDATE page_views with scroll_depth (take max)
          const scrollDepth = eventData.depth_percent || eventData.depth || eventData.scroll_depth_percent || null;

          if (scrollDepth) {
            db.prepare(`
              UPDATE page_views
              SET scroll_depth_percent = MAX(COALESCE(scroll_depth_percent, 0), ?)
              WHERE id = (
                SELECT id FROM page_views
                WHERE session_id = ? AND path = ?
                ORDER BY timestamp DESC
                LIMIT 1
              )
            `).run(
              scrollDepth,
              session_id,
              eventData.path?.substring(0, 200) || '/'
            );
          }
          break;
        }

        case 'time_on_page': {
          // UPDATE page_views with time_on_page_seconds
          const duration = eventData.duration_seconds || eventData.time_on_page_seconds || null;

          if (duration) {
            db.prepare(`
              UPDATE page_views
              SET time_on_page_seconds = ?
              WHERE id = (
                SELECT id FROM page_views
                WHERE session_id = ? AND path = ?
                ORDER BY timestamp DESC
                LIMIT 1
              )
            `).run(
              duration,
              session_id,
              eventData.path?.substring(0, 200) || '/'
            );
          }
          break;
        }

        case 'heartbeat': {
          // Heartbeat events update session activity but don't need storage
          // The session ended_at is already updated at the top of the request
          break;
        }

        default: {
          // INSERT all events into events table for tracking
          insertEvent.run(
            eventName?.substring(0, 100) || 'unknown',
            JSON.stringify(eventData)?.substring(0, 500) || null,
            eventData.url?.substring(0, 500) || eventData.path?.substring(0, 500) || null,
            req.get('referer')?.substring(0, 500) || null,
            userAgent?.substring(0, 500) || null,
            hashIP(req.ip),
            isBotRequest ? 1 : 0,
            eventTimestamp
          );
          break;
        }
      }
    }

    // Return 204 No Content for minimal response (best for sendBeacon)
    return res.status(204).end();

  } catch (err) {
    // Log error but still return 204 to not break client
    console.error('Analytics collect error:', err);
    return res.status(204).end();
  }
});

// ============================================
// ROUTES - Authentication (MFA Dashboard)
// ============================================
registerAuthRoutes(app, db);

// ============================================
// ROUTES - Dashboard Analytics (Authenticated)
// ============================================
dashboardRoutes.register(app, db);

// ============================================
// Cleanup job - delete expired sessions periodically
// ============================================
setInterval(() => {
  try {
    const result = db.prepare("DELETE FROM auth_sessions WHERE expires_at < datetime('now')").run();
    if (result.changes > 0) {
      console.log(`Cleaned up ${result.changes} expired auth sessions`);
    }
  } catch (err) {
    console.error('Session cleanup error:', err);
  }
}, 60 * 60 * 1000); // Run every hour

// Start server
app.listen(PORT, '127.0.0.1', async () => {
  console.log(`Trevor Kavanaugh API running on port ${PORT}`);
  console.log('Auth endpoints available at /api/auth/*');
  console.log('Dashboard endpoints available at /api/analytics/dashboard/*');

  // Initialize GeoIP database
  const geoReady = await geo.init();
  if (geoReady) {
    console.log('GeoIP lookup enabled');
  } else {
    console.log('GeoIP lookup disabled - run: npm run update-geo');
  }

  // Start background jobs
  jobs.start(db);
});
