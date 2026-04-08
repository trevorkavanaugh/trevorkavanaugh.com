# Spec: Analytics Site Separation

**From:** Website session (provenance-risk-advisory)
**For:** Thought Leadership session (thought-leadership)
**Date:** 2026-04-07
**Priority:** High - both sites are actively collecting into one mixed pool

---

## Problem

The analytics platform at `api.trevorkavanaugh.com` serves two independent websites:
- **trevorkavanaugh.com** (personal/thought leadership)
- **provenanceriskadvisory.com** (consulting business)

Both sites send data to the same `/api/analytics/collect` endpoint. All data lands in one SQLite database with **no domain column** to distinguish which site generated it. The dashboard shows combined traffic with no way to filter by site.

Trevor wants:
1. **Separate tabs** in the dashboard - one per site, each showing isolated data
2. **Same login** - no need for separate accounts
3. **No combined charts/tables** - each tab shows only its own site's traffic
4. **Scrub existing PRA data** - remove all provenanceriskadvisory.com data from the database so the TK site dashboard starts clean

---

## Step 1: Schema Migration - Add `site_domain` Column

Add a `site_domain TEXT` column to these tables:

| Table | Current Primary Key / Structure |
|-------|-------------------------------|
| `page_views` | id TEXT PRIMARY KEY |
| `sessions` | id TEXT PRIMARY KEY |
| `events` | id INTEGER PRIMARY KEY AUTOINCREMENT |
| `daily_stats` | PRIMARY KEY (date, page_path) |
| `daily_referrer_stats` | PRIMARY KEY (date, referrer_domain) |
| `daily_event_stats` | PRIMARY KEY (date, event_name) |

**For `daily_stats`**: The composite primary key needs to become `(date, page_path, site_domain)` since the same path (e.g., `/about`) could exist on both sites.

**Migration SQL:**
```sql
ALTER TABLE page_views ADD COLUMN site_domain TEXT DEFAULT 'trevorkavanaugh.com';
ALTER TABLE sessions ADD COLUMN site_domain TEXT DEFAULT 'trevorkavanaugh.com';
ALTER TABLE events ADD COLUMN site_domain TEXT DEFAULT 'trevorkavanaugh.com';

-- daily_stats needs a new table since you can't alter a primary key in SQLite
CREATE TABLE daily_stats_new (
  date TEXT NOT NULL,
  page_path TEXT NOT NULL,
  site_domain TEXT NOT NULL DEFAULT 'trevorkavanaugh.com',
  page_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  sessions INTEGER DEFAULT 0,
  avg_time_on_page_seconds REAL,
  avg_scroll_depth_percent REAL,
  bounce_count INTEGER DEFAULT 0,
  entries INTEGER DEFAULT 0,
  exits INTEGER DEFAULT 0,
  PRIMARY KEY (date, page_path, site_domain)
);
INSERT INTO daily_stats_new SELECT *, 'trevorkavanaugh.com' FROM daily_stats;
DROP TABLE daily_stats;
ALTER TABLE daily_stats_new RENAME TO daily_stats;

-- Same for daily_referrer_stats
CREATE TABLE daily_referrer_stats_new (
  date TEXT NOT NULL,
  referrer_domain TEXT NOT NULL,
  referrer_type TEXT NOT NULL,
  site_domain TEXT NOT NULL DEFAULT 'trevorkavanaugh.com',
  visits INTEGER DEFAULT 0,
  page_views INTEGER DEFAULT 0,
  PRIMARY KEY (date, referrer_domain, site_domain)
);
INSERT INTO daily_referrer_stats_new SELECT *, 'trevorkavanaugh.com' FROM daily_referrer_stats;
DROP TABLE daily_referrer_stats;
ALTER TABLE daily_referrer_stats_new RENAME TO daily_referrer_stats;

-- Same for daily_event_stats
CREATE TABLE daily_event_stats_new (
  date TEXT NOT NULL,
  event_name TEXT NOT NULL,
  site_domain TEXT NOT NULL DEFAULT 'trevorkavanaugh.com',
  count INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  PRIMARY KEY (date, event_name, site_domain)
);
INSERT INTO daily_event_stats_new SELECT *, 'trevorkavanaugh.com' FROM daily_event_stats;
DROP TABLE daily_event_stats;
ALTER TABLE daily_event_stats_new RENAME TO daily_event_stats;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_page_views_site_domain ON page_views(site_domain);
CREATE INDEX IF NOT EXISTS idx_sessions_site_domain ON sessions(site_domain);
CREATE INDEX IF NOT EXISTS idx_events_site_domain ON events(site_domain);
CREATE INDEX IF NOT EXISTS idx_daily_stats_site_domain ON daily_stats(site_domain);
```

**Default to `trevorkavanaugh.com`** for all existing rows since that site was collecting first. PRA data will be scrubbed anyway (see Step 5).

---

## Step 2: Scrub Existing PRA Data

After migration, delete all rows that came from provenanceriskadvisory.com. The `url` column in `page_views` contains the full URL, so you can identify PRA data:

```sql
-- Identify PRA sessions via page_views
DELETE FROM page_views WHERE url LIKE '%provenanceriskadvisory.com%';

-- Identify PRA sessions (sessions whose entry_page came from PRA)
-- This is trickier - PRA paths overlap with TK paths (e.g., /about, /services)
-- Safest approach: delete sessions that ONLY have PRA page_views
-- After deleting PRA page_views above, find orphaned sessions:
DELETE FROM sessions WHERE id NOT IN (SELECT DISTINCT session_id FROM page_views);

-- Clean up orphaned visitors
DELETE FROM visitors WHERE id NOT IN (SELECT DISTINCT visitor_id FROM page_views);

-- Events table: delete PRA events by page_url
DELETE FROM events WHERE page_url LIKE '%provenanceriskadvisory.com%';

-- Daily aggregate tables: since all existing data defaults to TK after migration,
-- and PRA data is minimal (site only started collecting April 5, 2026),
-- the aggregates may already be negligible. But to be safe, re-aggregate
-- from the cleaned page_views table, or just delete aggregate rows
-- for dates >= 2026-04-05 and let them rebuild naturally.
DELETE FROM daily_stats WHERE date >= '2026-04-05';
DELETE FROM daily_referrer_stats WHERE date >= '2026-04-05';
DELETE FROM daily_event_stats WHERE date >= '2026-04-05';
```

**Important:** Back up `analytics.db` before running any of this. Copy it on the droplet first:
```bash
cp analytics.db analytics.db.backup-pre-separation
```

---

## Step 3: Extract Domain in Collect Endpoint

**File:** `api/index.js` - the `/api/analytics/collect` handler (starts around line 967)

The HTTP `Origin` header is already validated against `allowedOrigins`. Extract the domain from it and pass it through to all INSERT statements.

**After the payload parsing (around line 990), add:**
```javascript
// Extract site domain from Origin header
const origin = req.get('origin') || '';
const siteDomain = origin.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0] || 'unknown';
```

**Then pass `siteDomain` to every INSERT:**

1. **Sessions INSERT** (~line 1085) - add `site_domain` to the column list and values
2. **Page views INSERT** (~line 1138, the `insertPageView` prepared statement) - add `site_domain`
3. **Events INSERT** (~line 1148, the `insertEvent` prepared statement) - add `site_domain`

The visitors table does NOT need site_domain - a visitor can visit both sites and that's fine. Visitor is identified by browser fingerprint, sessions are per-site.

---

## Step 4: Add `site_domain` Filter to All Dashboard Queries

**File:** `api/dashboard.js`

Every query that touches `page_views`, `sessions`, `events`, `daily_stats`, `daily_referrer_stats`, or `daily_event_stats` needs a `WHERE site_domain = ?` clause.

**Add to every dashboard endpoint:**
```javascript
const siteDomain = req.query.site || 'trevorkavanaugh.com';
```

Then add `AND site_domain = ?` to every WHERE clause, passing `siteDomain` as a bind parameter.

**Endpoints to update (all in `dashboard.js`):**
- `GET /api/analytics/dashboard/overview` (~line 159) - 6 queries: currentMetrics, previousMetrics, currentBounce, previousBounce, topPages, topReferrers, chartDataRows
- `GET /api/analytics/pages` - page_views queries
- `GET /api/analytics/referrers` - sessions/referrer queries
- `GET /api/analytics/events` - events queries
- `GET /api/analytics/downloads` - events queries filtered by download type
- Any other endpoint that queries analytics data

**Pattern for each query - before:**
```sql
WHERE DATE(timestamp) BETWEEN ? AND ?
```

**After:**
```sql
WHERE DATE(timestamp) BETWEEN ? AND ? AND site_domain = ?
```

---

## Step 5: Dashboard UI - Site Tabs

**Files to modify:** All 12 HTML files in `api/public/analytics/`:
- `index.html` (main dashboard)
- `pages.html`
- `referrers.html`
- `linkedin.html`
- `events.html`
- `downloads.html`
- `subscribers.html` (may not need tabs - subscribers are TK-only)
- `realtime.html`
- `funnels.html`
- `settings.html`
- `login.html` (no tabs needed)
- `setup-totp.html` (no tabs needed)

**UI approach:** Add a site selector bar just below the sidebar header or above the main content area. Two tabs:

```html
<div class="site-tabs">
  <button class="site-tab active" data-site="trevorkavanaugh.com">trevorkavanaugh.com</button>
  <button class="site-tab" data-site="provenanceriskadvisory.com">provenanceriskadvisory.com</button>
</div>
```

**Behavior:**
- Default to `trevorkavanaugh.com` on load (or use `localStorage.getItem('selectedSite')`)
- Clicking a tab sets `localStorage.setItem('selectedSite', domain)` and re-fetches all data
- All API calls append `?site=<domain>` (or `&site=<domain>` if other params exist)
- Active tab gets visual highlight
- Tab selection persists across page navigation via localStorage

**CSS for tabs** (add to `dashboard.css`):
```css
.site-tabs {
  display: flex;
  gap: 0;
  border-bottom: 2px solid #e2e8f0;
  margin-bottom: 1.5rem;
  padding: 0 1.5rem;
}

.site-tab {
  padding: 0.75rem 1.25rem;
  border: none;
  background: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: #718096;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: color 0.2s, border-color 0.2s;
}

.site-tab:hover {
  color: #1a365d;
}

.site-tab.active {
  color: #1a365d;
  border-bottom-color: #c5932a;
  font-weight: 600;
}
```

**JavaScript helper** (add to each page or create a shared `site-selector.js`):
```javascript
function getSelectedSite() {
  return localStorage.getItem('selectedSite') || 'trevorkavanaugh.com';
}

function initSiteTabs() {
  const tabs = document.querySelectorAll('.site-tab');
  const currentSite = getSelectedSite();

  tabs.forEach(tab => {
    if (tab.dataset.site === currentSite) tab.classList.add('active');
    else tab.classList.remove('active');

    tab.addEventListener('click', () => {
      localStorage.setItem('selectedSite', tab.dataset.site);
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      // Each page implements refreshData()
      if (typeof refreshData === 'function') refreshData();
    });
  });
}

// Call on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initSiteTabs);
```

Each page's existing fetch calls need to append the site parameter. Wrap them in a `refreshData()` function that the tab click handler can call.

---

## Step 6: Deployment

1. Back up the database on the droplet
2. Run the schema migration SQL
3. Run the data scrub SQL
4. SCP updated files to droplet (64.23.250.139, user: naughtymoddy, path: /home/naughtymoddy/trevorkavanaugh-api/)
5. `pm2 restart trevorkavanaugh-api`
6. Verify: log into dashboard, confirm tabs work, confirm PRA tab is empty (fresh start), confirm TK tab shows only TK data

---

## File Reference

| File | Location | What to change |
|------|----------|---------------|
| Server | `api/index.js` ~line 967 | Extract domain, add to INSERTs |
| Dashboard API | `api/dashboard.js` ~line 159+ | Add `site_domain` filter to all queries |
| Schema | `api/index.js` ~line 39 | Add `site_domain` columns to CREATE TABLE statements |
| Dashboard UI | `api/public/analytics/*.html` (10 pages) | Add site tabs |
| Dashboard CSS | `api/public/analytics/css/dashboard.css` | Tab styles |
| New shared JS | `api/public/analytics/js/site-selector.js` | Tab logic + localStorage |
| Database | Droplet: `/home/naughtymoddy/trevorkavanaugh-api/analytics.db` | Migration + scrub |
