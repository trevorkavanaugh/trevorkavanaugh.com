# Trevor Kavanaugh API Reference

**Base URL:** `https://api.trevorkavanaugh.com`
**Server:** Digital Ocean Droplet at `64.23.250.139`
**Port:** 3000 (proxied through nginx)
**Stack:** Express.js + better-sqlite3 + helmet

---

## Table of Contents

1. [Authentication](#authentication)
2. [Public Endpoints](#public-endpoints)
3. [Admin Endpoints](#admin-endpoints)
4. [Analytics Collection](#analytics-collection)
5. [Analytics Dashboard](#analytics-dashboard)
6. [Database Schema](#database-schema)
7. [Key Files](#key-files)
8. [Common Issues](#common-issues)

---

## Authentication

### Types of Auth

| Type | Header/Cookie | Used For |
|------|---------------|----------|
| Admin Key | `X-Admin-Key: trevor_admin_key_2024` | Newsletter, subscribers management |
| Session Cookie | `session` cookie (httpOnly) | Analytics dashboard |
| No Auth | - | Public endpoints |

### Dashboard Auth Flow

1. `POST /api/auth/login` → Returns session cookie
2. If TOTP enabled: `POST /api/auth/verify-totp`
3. All dashboard endpoints require valid session cookie via `credentials: 'include'`

---

## Public Endpoints

### Health Check
```
GET /api/health
Response: { status: 'ok', timestamp: '...' }
```

### Subscribe to Newsletter
```
POST /api/subscribe
Body: { email: 'user@example.com' }
Response: { success: true, message: '...' }
```

### Confirm Subscription
```
GET /api/confirm/:token
Redirects to website with success/error message
```

### Unsubscribe
```
GET /api/unsubscribe/:token
Redirects to website with confirmation
```

### Get Article Comments
```
GET /api/comments/:slug
Response: [{ id, author_name, content, created_at }]
```

### Submit Comment
```
POST /api/comments
Body: { article_slug, author_name, content }
Response: { success: true, message: 'Comment submitted for moderation' }
```

---

## Admin Endpoints

**All require:** `X-Admin-Key: trevor_admin_key_2024`

### Send Newsletter
```
POST /api/newsletter/send
Body: {
  subject: 'Newsletter Subject',
  html_content: '<html>...</html>',
  article_slug: 'article-slug',        // optional
  article_title: 'Article Title',      // optional
  article_url: 'https://...',          // optional
  test_mode: true                      // true = send to trevor@ only
}
Response: { success: true, sent_count: N, recipients: [...] }
```

### List Subscribers
```
GET /api/subscribers
Response: [{ id, email, confirmed, unsubscribed, created_at }]
```

### Get Pending Comments
```
GET /api/comments/pending/all
Response: [{ id, article_slug, author_name, content, created_at }]
```

### Moderate Comment
```
POST /api/comments/:id/moderate
Body: { approve: true|false }
Response: { success: true }
```

---

## Analytics Collection

### Collect Analytics Data
```
POST /api/analytics/collect
Content-Type: application/json (or text/plain via sendBeacon)
Body: {
  visitor_id: 'uuid',
  session_id: 'uuid',
  events: [
    {
      type: 'page_view',
      data: {
        url: 'https://...',
        path: '/articles/...',
        title: 'Page Title',
        referrer_url: '...'
      },
      timestamp: '2026-01-15T...'
    }
  ],
  context: {
    device_type: 'desktop',
    browser: 'Chrome',
    browser_version: '120',
    os: 'Windows',
    screen_resolution: '1920x1080',
    language: 'en-US',
    timezone: 'America/Chicago',
    referrer_url: '...',
    referrer_domain: '...',
    referrer_type: 'search',
    utm_source: '...',
    utm_medium: '...',
    utm_campaign: '...'
  }
}
Response: 204 No Content (success) or 400/500 on error
```

**Event Types:**
- `page_view` - Page was viewed
- `page_leave` - User left page (includes time_on_page_seconds, scroll_depth_percent)
- `click` - Link/button click
- `scroll` - Scroll milestone reached
- `download` - File download
- Custom events

---

## Analytics Dashboard

**All require:** Valid session cookie (`credentials: 'include'`)

### Auth Endpoints

```
POST /api/auth/login
Body: { username, password }
Response: { success: true, requires_totp: bool }

POST /api/auth/verify-totp
Body: { code: '123456' }
Response: { success: true }

POST /api/auth/logout
Response: { success: true }

GET /api/auth/me
Response: { user: { id, username, totp_enabled } }
```

### Dashboard Data Endpoints

**Common Query Parameters:**
- `start_date` - YYYY-MM-DD format (default: 7 days ago)
- `end_date` - YYYY-MM-DD format (default: today)

#### Overview (Main Dashboard)
```
GET /api/analytics/dashboard/overview?start_date=2026-01-01&end_date=2026-01-15
Response: {
  success: true,
  data: {
    visitors: { value: 259, change: 12.5 },
    sessions: { value: 300, change: -5.2 },
    page_views: { value: 850, change: 8.1 },
    avg_duration: { value: 45, change: 3.2 },      // seconds
    bounce_rate: { value: 42.5, change: -2.1 },   // percentage
    top_pages: [{ path, views, unique }],
    top_referrers: [{ domain, type, visits }],
    chart_data: {
      labels: ['Jan 8', 'Jan 9', ...],
      data: [12, 15, 8, ...]                       // daily visitors
    }
  }
}
```

#### Real-time (Last 5 Minutes)
```
GET /api/analytics/dashboard/realtime
Response: {
  success: true,
  data: {
    active_visitors: 3,
    pages_viewing: [{ path, visitors }]
  }
}
```

#### Top Pages
```
GET /api/analytics/dashboard/pages?start_date=...&end_date=...&limit=10
Response: {
  success: true,
  data: {
    pages: [{ path, views, unique_visitors, avg_time, avg_scroll, bounce_rate }]
  }
}
```

#### Top Referrers
```
GET /api/analytics/dashboard/referrers?start_date=...&end_date=...
Response: {
  success: true,
  data: {
    referrers: [{ domain, type, visits, page_views }]
  }
}
```
**Referrer Types:** `direct`, `search`, `social`, `email`, `referral`, `unknown`

#### Events
```
GET /api/analytics/dashboard/events?start_date=...&end_date=...&type=click
Response: {
  success: true,
  data: {
    events: [{ name, count, unique_visitors }]
  }
}
```

#### Downloads
```
GET /api/analytics/dashboard/downloads?start_date=...&end_date=...
Response: {
  success: true,
  data: {
    downloads: [{ file_name, count, unique_visitors }]
  }
}
```

#### Geographic Data
```
GET /api/analytics/dashboard/geo?start_date=...&end_date=...
Response: {
  success: true,
  data: {
    countries: [{ country, country_code, visitors, sessions, percentage }],
    cities: [{ city, region, country, visitors, sessions }],
    total_visitors: 275
  }
}
```
**Note:** `country_code` is ISO 2-letter code (US, GB, etc.) converted from country name via `getCountryCode()` helper.

#### Time Series
```
GET /api/analytics/dashboard/timeseries?start_date=...&end_date=...&metric=visitors&granularity=day
Response: {
  success: true,
  data: {
    labels: ['2026-01-01', ...],
    values: [10, 15, ...]
  }
}
```
**Metrics:** `visitors`, `sessions`, `page_views`, `avg_duration`, `bounce_rate`
**Granularity:** `hour`, `day`, `week`, `month`

#### Visitor Details
```
GET /api/analytics/dashboard/visitors?start_date=...&end_date=...
Response: {
  success: true,
  data: {
    visitors: [{ visitor_id, first_seen, last_seen, visit_count, sessions: [...] }]
  }
}
```

#### Funnel Analysis
```
GET /api/analytics/dashboard/funnel?start_date=...&end_date=...&steps=/,/articles/topic,/contact
Response: {
  success: true,
  data: {
    steps: [
      { path: '/', visitors: 100 },
      { path: '/articles/topic', visitors: 45, drop_off: 55 },
      { path: '/contact', visitors: 10, drop_off: 35 }
    ]
  }
}
```

#### Export Data
```
GET /api/analytics/dashboard/export?start_date=...&end_date=...&type=csv
Response: CSV file download
```

---

## Database Schema

### Core Analytics Tables

**visitors** - Unique visitors (by cookie ID)
```sql
id TEXT PRIMARY KEY,          -- UUID from client
first_seen TEXT NOT NULL,
last_seen TEXT NOT NULL,
visit_count INTEGER,
created_at TEXT
```

**sessions** - Browser sessions (30min inactivity timeout)
```sql
id TEXT PRIMARY KEY,
visitor_id TEXT NOT NULL,     -- FK to visitors
started_at TEXT NOT NULL,
ended_at TEXT,
duration_seconds INTEGER,
entry_page TEXT NOT NULL,
exit_page TEXT,
page_count INTEGER,
referrer_url TEXT,
referrer_domain TEXT,
referrer_type TEXT,           -- direct, search, social, email, referral
utm_source TEXT,
utm_medium TEXT,
utm_campaign TEXT,
utm_term TEXT,
utm_content TEXT,
country TEXT,                 -- Full name from GeoIP
region TEXT,
city TEXT,
device_type TEXT,             -- desktop, mobile, tablet
browser TEXT,
browser_version TEXT,
os TEXT,
screen_resolution TEXT,
language TEXT,
timezone TEXT,
is_bot INTEGER,               -- 0 or 1
created_at TEXT
```

**page_views** - Individual page views
```sql
id TEXT PRIMARY KEY,
session_id TEXT NOT NULL,     -- FK to sessions
visitor_id TEXT NOT NULL,     -- FK to visitors
url TEXT NOT NULL,
path TEXT NOT NULL,           -- e.g., /articles/my-post
title TEXT,
referrer_url TEXT,
time_on_page_seconds INTEGER, -- Filled on page_leave event
scroll_depth_percent INTEGER, -- 0-100
timestamp TEXT NOT NULL,
created_at TEXT
```

### Aggregation Tables (Computed Daily at 2 AM)

**daily_stats** - Per-page daily metrics
```sql
date TEXT NOT NULL,
page_path TEXT NOT NULL,
page_views INTEGER,
unique_visitors INTEGER,
sessions INTEGER,
avg_time_on_page_seconds REAL,
avg_scroll_depth_percent REAL,
bounce_count INTEGER,
entries INTEGER,
exits INTEGER,
PRIMARY KEY (date, page_path)
```

**daily_referrer_stats** - Referrer metrics by day
```sql
date TEXT NOT NULL,
referrer_domain TEXT NOT NULL,
referrer_type TEXT NOT NULL,
visits INTEGER,
page_views INTEGER,
PRIMARY KEY (date, referrer_domain)
```

**daily_event_stats** - Custom event metrics by day
```sql
date TEXT NOT NULL,
event_name TEXT NOT NULL,
count INTEGER,
unique_visitors INTEGER,
PRIMARY KEY (date, event_name)
```

### Authentication Tables

**analytics_users** - Dashboard users
```sql
id TEXT PRIMARY KEY,
username TEXT NOT NULL UNIQUE,
password_hash TEXT NOT NULL,   -- bcrypt
totp_secret_encrypted TEXT,    -- AES encrypted
totp_enabled INTEGER,
backup_codes_hashed TEXT,      -- JSON array of bcrypt hashes
failed_login_attempts INTEGER,
locked_until TEXT,
last_login TEXT,
created_at TEXT
```

**auth_sessions** - Login sessions
```sql
id TEXT PRIMARY KEY,
user_id TEXT NOT NULL,
ip_address TEXT,
user_agent TEXT,
created_at TEXT,
expires_at TEXT NOT NULL
```

### Other Tables

**subscribers** - Newsletter subscribers
**newsletters** - Sent newsletter log
**comments** - Article comments (with moderation)
**events** - Legacy event tracking (deprecated, use page_views)

---

## Key Files

| File | Purpose |
|------|---------|
| `index.js` | Main Express server, public endpoints, analytics collection |
| `dashboard.js` | All `/api/analytics/dashboard/*` endpoints |
| `auth.js` | Authentication endpoints and middleware |
| `geo.js` | GeoIP lookup using MaxMind database |
| `public/analytics/` | Dashboard frontend (served statically) |
| `analytics.db` | SQLite database |

### Important Functions

**index.js:**
- `requireAdmin` - Middleware checking X-Admin-Key header
- `isBot(userAgent)` - Detects bots from user agent
- `parseCollectBody(req)` - Handles JSON and text/plain from sendBeacon

**dashboard.js:**
- `parseDateRange(start, end)` - Validates dates, defaults to last 7 days
- `getPreviousPeriod(start, end)` - Gets comparison period
- `calculateChange(current, previous)` - Percentage change calculation
- `getCountryCode(countryName)` - Converts country name to ISO code

**auth.js:**
- `requireAuth(db)` - Middleware requiring valid session cookie
- `hashPassword/verifyPassword` - bcrypt wrappers
- `encryptTOTP/decryptTOTP` - AES encryption for TOTP secrets

---

## Common Issues

### 1. Parameter Name Mismatch
**Frontend uses:** `start_date`, `end_date`
**Always use these names** in query parameters.

### 2. Content Security Policy (CSP)
The helmet CSP must allow:
- `connect-src`: CDNs for world atlas map data
- `img-src`: flagcdn.com for country flags
- `style-src`: cdn.jsdelivr.net for flatpickr

### 3. GeoIP Database
- Located at `data/GeoLite2-City.mmdb`
- Update monthly: `npm run update-geo`
- If missing, geo lookups return null

### 4. Country Code Mapping
The `getCountryCode()` function in dashboard.js maps country names to ISO codes. If a country shows `null` for country_code, add it to the mapping.

### 5. Session Cookie Issues
- Cookie is `httpOnly` and `secure` in production
- Must use `credentials: 'include'` in fetch calls
- Expires in 24 hours

### 6. Rate Limiting
- Analytics collect: 100 requests / 15 minutes per IP
- Auth endpoints: 5 attempts / 15 minutes per IP

---

## Deployment

```bash
# SSH to server
ssh naughtymoddy@64.23.250.139

# API location
cd /home/naughtymoddy/trevorkavanaugh-api

# Restart after changes
pm2 restart trevorkavanaugh-api

# View logs
pm2 logs trevorkavanaugh-api --lines 50

# Database location
./analytics.db
```

---

*Last updated: January 15, 2026*
