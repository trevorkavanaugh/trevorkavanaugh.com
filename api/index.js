const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

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
  
  CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
  CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at);
  CREATE INDEX IF NOT EXISTS idx_events_suspicious ON events(suspicious);
  CREATE INDEX IF NOT EXISTS idx_comments_slug ON comments(article_slug);
`);

// Middleware
app.use(helmet());
app.use(express.json());

// CORS - only allow your domain
const allowedOrigins = ['https://trevorkavanaugh.com', 'https://www.trevorkavanaugh.com', 'http://localhost:8000', 'http://127.0.0.1:8000'];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like curl) but flag them
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  methods: ['GET', 'POST'],
  credentials: true
}));

// Rate limiting - stricter for POST
const trackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 track requests per window
  message: { error: 'Too many requests' }
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api/track', trackLimiter);
app.use(generalLimiter);

// Hash IP for privacy
function hashIP(ip) {
  return crypto.createHash('sha256').update(ip + 'trevorkavanaugh-salt-2026').digest('hex').substring(0, 16);
}

// Check if request looks suspicious
function checkSuspicious(req) {
  const suspicious = [];
  
  const origin = req.get('origin');
  const referer = req.get('referer');
  const userAgent = req.get('user-agent') || '';
  
  // No origin header (direct API call)
  if (!origin) {
    suspicious.push('no_origin');
  }
  
  // Origin not in allowed list
  if (origin && !allowedOrigins.includes(origin)) {
    suspicious.push('bad_origin');
  }
  
  // No referer or referer doesn't match
  if (!referer || !referer.includes('trevorkavanaugh.com')) {
    suspicious.push('bad_referer');
  }
  
  // Bot-like user agents
  const botPatterns = /curl|wget|python|httpie|postman|insomnia|bot|crawler|spider|scraper/i;
  if (botPatterns.test(userAgent)) {
    suspicious.push('bot_ua');
  }
  
  // No user agent
  if (!userAgent || userAgent.length < 10) {
    suspicious.push('no_ua');
  }
  
  return suspicious;
}

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Track event (downloads, clicks, etc.)
app.post('/api/track', (req, res) => {
  try {
    const { event_type, event_label, page_url } = req.body;
    
    if (!event_type) {
      return res.status(400).json({ error: 'event_type required' });
    }
    
    // Validate event_type (only allow known types)
    const validEventTypes = ['linkedin_click', 'email_click', 'pdf_click', 'page_view', 'download'];
    if (!validEventTypes.includes(event_type)) {
      return res.status(400).json({ error: 'invalid event_type' });
    }
    
    // Check for suspicious activity
    const suspiciousReasons = checkSuspicious(req);
    const isSuspicious = suspiciousReasons.length >= 2 ? 1 : 0; // Flag if 2+ red flags
    
    const stmt = db.prepare(`
      INSERT INTO events (event_type, event_label, page_url, referrer, user_agent, ip_hash, suspicious)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      event_type,
      event_label ? event_label.substring(0, 200) : null, // Limit length
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

// Get stats (protected - add auth later if needed)
app.get('/api/stats', (req, res) => {
  try {
    const stats = {};
    
    // Total counts by event type (excluding suspicious)
    const counts = db.prepare(`
      SELECT event_type, COUNT(*) as count 
      FROM events 
      WHERE suspicious = 0
      GROUP BY event_type
    `).all();
    
    stats.totals = counts.reduce((acc, row) => {
      acc[row.event_type] = row.count;
      return acc;
    }, {});
    
    // Last 7 days by event type (excluding suspicious)
    const recent = db.prepare(`
      SELECT event_type, DATE(created_at) as date, COUNT(*) as count
      FROM events
      WHERE created_at >= datetime('now', '-7 days') AND suspicious = 0
      GROUP BY event_type, DATE(created_at)
      ORDER BY date DESC
    `).all();
    
    stats.last7days = recent;
    
    // Total unique visitors (by IP hash, excluding suspicious)
    const uniqueVisitors = db.prepare(`
      SELECT COUNT(DISTINCT ip_hash) as count FROM events WHERE suspicious = 0
    `).get();
    
    stats.uniqueVisitors = uniqueVisitors.count;
    
    // Suspicious event count (for monitoring)
    const suspiciousCount = db.prepare(`
      SELECT COUNT(*) as count FROM events WHERE suspicious = 1
    `).get();
    
    stats.suspiciousBlocked = suspiciousCount.count;
    
    res.json(stats);
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

// ============================================
// COMMENTS (for future use)
// ============================================

// Get approved comments for an article
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

// Submit a comment (requires moderation)
app.post('/api/comments', (req, res) => {
  try {
    // Check origin strictly for comments
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
    
    if (author_name.length > 100) {
      return res.status(400).json({ error: 'Name too long (max 100 chars)' });
    }
    
    const stmt = db.prepare(`
      INSERT INTO comments (article_slug, author_name, content)
      VALUES (?, ?, ?)
    `);
    
    stmt.run(
      article_slug.substring(0, 100),
      author_name.substring(0, 100),
      content.substring(0, 2000)
    );
    
    res.json({ success: true, message: 'Comment submitted for moderation' });
  } catch (err) {
    console.error('Post comment error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

// Get pending comments (for admin - add auth later)
app.get('/api/comments/pending/all', (req, res) => {
  try {
    const comments = db.prepare(`
      SELECT * FROM comments WHERE approved = 0 ORDER BY created_at DESC
    `).all();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Internal error' });
  }
});

// Approve/reject comment (for admin - add auth later)
app.post('/api/comments/:id/moderate', (req, res) => {
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
