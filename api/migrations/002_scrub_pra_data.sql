-- Migration: Remove provenanceriskadvisory.com data from TK database
-- PRA gets a fresh start - run AFTER 001_add_site_domain.sql
-- BACK UP analytics.db FIRST!

-- Remove PRA page views (identifiable by URL)
DELETE FROM page_views WHERE url LIKE '%provenanceriskadvisory.com%';

-- Remove orphaned sessions (sessions with no remaining page views)
DELETE FROM sessions WHERE id NOT IN (SELECT DISTINCT session_id FROM page_views);

-- Remove orphaned visitors
DELETE FROM visitors WHERE id NOT IN (SELECT DISTINCT visitor_id FROM page_views);

-- Remove PRA events
DELETE FROM events WHERE page_url LIKE '%provenanceriskadvisory.com%';

-- Clear daily aggregates for dates after PRA started collecting (April 5, 2026)
DELETE FROM daily_stats WHERE date >= '2026-04-05';
DELETE FROM daily_referrer_stats WHERE date >= '2026-04-05';
DELETE FROM daily_event_stats WHERE date >= '2026-04-05';
