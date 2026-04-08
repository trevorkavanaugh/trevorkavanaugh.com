-- Migration: Add site_domain column for multi-site analytics separation
-- Run this on the production database AFTER backing up

ALTER TABLE page_views ADD COLUMN site_domain TEXT NOT NULL DEFAULT 'trevorkavanaugh.com';
ALTER TABLE sessions ADD COLUMN site_domain TEXT NOT NULL DEFAULT 'trevorkavanaugh.com';
ALTER TABLE events ADD COLUMN site_domain TEXT NOT NULL DEFAULT 'trevorkavanaugh.com';

-- daily_stats needs table recreation (can't ALTER primary key in SQLite)
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
