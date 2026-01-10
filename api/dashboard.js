/**
 * Dashboard API Endpoints for Analytics Platform
 *
 * All endpoints require authentication via requireAuth middleware.
 * Uses aggregate tables (daily_stats, daily_referrer_stats, daily_event_stats)
 * for performance on date ranges > 7 days.
 */

const { requireAuth } = require('./auth');

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Parse and validate date range from query params
 * @param {string} startDate - Start date string (YYYY-MM-DD)
 * @param {string} endDate - End date string (YYYY-MM-DD)
 * @returns {{start: string, end: string, valid: boolean, error?: string}}
 */
function parseDateRange(startDate, endDate) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  // Default to last 7 days if not provided
  if (!startDate || !endDate) {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);

    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
      valid: true
    };
  }

  // Validate format
  if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
    return {
      start: null,
      end: null,
      valid: false,
      error: 'Invalid date format. Use YYYY-MM-DD'
    };
  }

  // Validate start <= end
  if (startDate > endDate) {
    return {
      start: null,
      end: null,
      valid: false,
      error: 'Start date must be before or equal to end date'
    };
  }

  // Validate reasonable range (max 1 year)
  const startMs = new Date(startDate).getTime();
  const endMs = new Date(endDate).getTime();
  const maxRange = 365 * 24 * 60 * 60 * 1000; // 1 year in ms

  if (endMs - startMs > maxRange) {
    return {
      start: null,
      end: null,
      valid: false,
      error: 'Date range cannot exceed 1 year'
    };
  }

  return { start: startDate, end: endDate, valid: true };
}

/**
 * Calculate percentage change between two values
 * @param {number} current - Current period value
 * @param {number} previous - Previous period value
 * @returns {number} - Percentage change (rounded to 1 decimal)
 */
function calculateChange(current, previous) {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

/**
 * Get the previous period dates for comparison
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {{start: string, end: string}}
 */
function getPreviousPeriod(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const duration = end.getTime() - start.getTime();

  const prevEnd = new Date(start.getTime() - 1); // Day before start
  const prevStart = new Date(prevEnd.getTime() - duration);

  return {
    start: prevStart.toISOString().split('T')[0],
    end: prevEnd.toISOString().split('T')[0]
  };
}

/**
 * Determine if we should use aggregate tables based on date range
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {boolean}
 */
function shouldUseAggregates(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = (end - start) / (24 * 60 * 60 * 1000);
  return days > 7;
}

/**
 * Convert sort parameter to safe SQL column name
 * @param {string} sortBy - Sort parameter from request
 * @param {string[]} allowedColumns - List of allowed column names
 * @param {string} defaultColumn - Default column if invalid
 * @returns {string}
 */
function sanitizeSortColumn(sortBy, allowedColumns, defaultColumn) {
  if (!sortBy) return defaultColumn;
  const normalized = sortBy.toLowerCase();
  return allowedColumns.includes(normalized) ? normalized : defaultColumn;
}

/**
 * Convert order parameter to safe SQL direction
 * @param {string} order - Order parameter from request
 * @returns {string}
 */
function sanitizeSortOrder(order) {
  if (!order) return 'DESC';
  return order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
}

// ============================================
// ROUTE REGISTRATION
// ============================================

/**
 * Register all dashboard routes on the Express app
 * @param {Express} app - Express application
 * @param {Database} db - SQLite database instance
 */
function register(app, db) {
  const auth = requireAuth(db);

  // ----------------------------------------
  // GET /api/analytics/dashboard/overview
  // Main dashboard metrics with comparison
  // ----------------------------------------
  app.get('/api/analytics/dashboard/overview', auth, async (req, res) => {
    try {
      const { start_date, end_date } = req.query;
      const dateRange = parseDateRange(start_date, end_date);

      if (!dateRange.valid) {
        return res.status(400).json({ error: dateRange.error });
      }

      const { start, end } = dateRange;
      const prev = getPreviousPeriod(start, end);

      // Current period metrics
      const currentMetrics = db.prepare(`
        SELECT
          COUNT(DISTINCT visitor_id) as visitors,
          COUNT(DISTINCT session_id) as sessions,
          COUNT(*) as page_views,
          AVG(time_on_page_seconds) as avg_duration
        FROM page_views
        WHERE DATE(timestamp) BETWEEN ? AND ?
      `).get(start, end);

      // Previous period metrics for comparison
      const previousMetrics = db.prepare(`
        SELECT
          COUNT(DISTINCT visitor_id) as visitors,
          COUNT(DISTINCT session_id) as sessions,
          COUNT(*) as page_views,
          AVG(time_on_page_seconds) as avg_duration
        FROM page_views
        WHERE DATE(timestamp) BETWEEN ? AND ?
      `).get(prev.start, prev.end);

      // Bounce rate calculation (sessions with only 1 page view)
      const currentBounce = db.prepare(`
        SELECT
          COUNT(CASE WHEN page_count = 1 THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0) as bounce_rate
        FROM sessions
        WHERE DATE(started_at) BETWEEN ? AND ?
          AND is_bot = 0
      `).get(start, end);

      const previousBounce = db.prepare(`
        SELECT
          COUNT(CASE WHEN page_count = 1 THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0) as bounce_rate
        FROM sessions
        WHERE DATE(started_at) BETWEEN ? AND ?
          AND is_bot = 0
      `).get(prev.start, prev.end);

      // Top pages
      const topPages = db.prepare(`
        SELECT
          path,
          COUNT(*) as views,
          COUNT(DISTINCT visitor_id) as unique_visitors
        FROM page_views
        WHERE DATE(timestamp) BETWEEN ? AND ?
        GROUP BY path
        ORDER BY views DESC
        LIMIT 10
      `).all(start, end);

      // Top referrers
      const topReferrers = db.prepare(`
        SELECT
          referrer_domain as domain,
          referrer_type as type,
          COUNT(*) as visits
        FROM sessions
        WHERE DATE(started_at) BETWEEN ? AND ?
          AND referrer_domain IS NOT NULL
          AND referrer_domain != ''
          AND is_bot = 0
        GROUP BY referrer_domain, referrer_type
        ORDER BY visits DESC
        LIMIT 10
      `).all(start, end);

      res.json({
        success: true,
        data: {
          visitors: {
            value: currentMetrics.visitors || 0,
            change: calculateChange(currentMetrics.visitors || 0, previousMetrics.visitors || 0)
          },
          sessions: {
            value: currentMetrics.sessions || 0,
            change: calculateChange(currentMetrics.sessions || 0, previousMetrics.sessions || 0)
          },
          page_views: {
            value: currentMetrics.page_views || 0,
            change: calculateChange(currentMetrics.page_views || 0, previousMetrics.page_views || 0)
          },
          avg_duration: {
            value: Math.round(currentMetrics.avg_duration || 0),
            change: calculateChange(currentMetrics.avg_duration || 0, previousMetrics.avg_duration || 0)
          },
          bounce_rate: {
            value: Math.round((currentBounce.bounce_rate || 0) * 10) / 10,
            change: calculateChange(currentBounce.bounce_rate || 0, previousBounce.bounce_rate || 0)
          },
          top_pages: topPages.map(p => ({
            path: p.path,
            views: p.views,
            unique: p.unique_visitors
          })),
          top_referrers: topReferrers.map(r => ({
            domain: r.domain,
            type: r.type || 'unknown',
            visits: r.visits
          }))
        }
      });

    } catch (err) {
      console.error('Dashboard overview error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // ----------------------------------------
  // GET /api/analytics/dashboard/realtime
  // Real-time visitor activity (last 5 minutes)
  // ----------------------------------------
  app.get('/api/analytics/dashboard/realtime', auth, async (req, res) => {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

      // Active visitors (unique visitors with activity in last 5 minutes)
      const activeVisitors = db.prepare(`
        SELECT COUNT(DISTINCT visitor_id) as count
        FROM page_views
        WHERE timestamp >= ?
      `).get(fiveMinutesAgo);

      // Pages currently being viewed
      const pagesViewing = db.prepare(`
        SELECT
          path,
          COUNT(DISTINCT visitor_id) as visitors
        FROM page_views
        WHERE timestamp >= ?
        GROUP BY path
        ORDER BY visitors DESC
        LIMIT 10
      `).all(fiveMinutesAgo);

      // Recent events (last 20)
      const recentEvents = db.prepare(`
        SELECT
          event_type as name,
          page_url as path,
          created_at as timestamp
        FROM events
        WHERE created_at >= datetime('now', '-5 minutes')
          AND suspicious = 0
        ORDER BY created_at DESC
        LIMIT 20
      `).all();

      res.json({
        success: true,
        data: {
          active_visitors: activeVisitors.count || 0,
          pages_viewing: pagesViewing.map(p => ({
            path: p.path,
            visitors: p.visitors
          })),
          recent_events: recentEvents.map(e => ({
            name: e.name,
            path: e.path,
            timestamp: e.timestamp
          }))
        }
      });

    } catch (err) {
      console.error('Dashboard realtime error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // ----------------------------------------
  // GET /api/analytics/dashboard/pages
  // Detailed page performance metrics
  // ----------------------------------------
  app.get('/api/analytics/dashboard/pages', auth, async (req, res) => {
    try {
      const { start_date, end_date, sort_by, order } = req.query;
      const dateRange = parseDateRange(start_date, end_date);

      if (!dateRange.valid) {
        return res.status(400).json({ error: dateRange.error });
      }

      const { start, end } = dateRange;
      const allowedSorts = ['views', 'unique_visitors', 'avg_time', 'avg_scroll', 'entries', 'exits', 'bounce_rate'];
      const sortColumn = sanitizeSortColumn(sort_by, allowedSorts, 'views');
      const sortOrder = sanitizeSortOrder(order);

      // Use aggregate tables for longer ranges
      if (shouldUseAggregates(start, end)) {
        const pages = db.prepare(`
          SELECT
            page_path as path,
            SUM(page_views) as views,
            SUM(unique_visitors) as unique_visitors,
            AVG(avg_time_on_page_seconds) as avg_time,
            AVG(avg_scroll_depth_percent) as avg_scroll,
            SUM(entries) as entries,
            SUM(exits) as exits,
            SUM(bounce_count) * 100.0 / NULLIF(SUM(entries), 0) as bounce_rate
          FROM daily_stats
          WHERE date BETWEEN ? AND ?
          GROUP BY page_path
          ORDER BY ${sortColumn === 'views' ? 'views' : sortColumn} ${sortOrder}
          LIMIT 50
        `).all(start, end);

        return res.json({
          success: true,
          data: {
            pages: pages.map(p => ({
              path: p.path,
              views: p.views || 0,
              unique_visitors: p.unique_visitors || 0,
              avg_time: Math.round(p.avg_time || 0),
              avg_scroll: Math.round(p.avg_scroll || 0),
              entries: p.entries || 0,
              exits: p.exits || 0,
              bounce_rate: Math.round((p.bounce_rate || 0) * 10) / 10
            }))
          }
        });
      }

      // Raw query for shorter ranges
      const pages = db.prepare(`
        SELECT
          path,
          COUNT(*) as views,
          COUNT(DISTINCT visitor_id) as unique_visitors,
          AVG(time_on_page_seconds) as avg_time,
          AVG(scroll_depth_percent) as avg_scroll
        FROM page_views
        WHERE DATE(timestamp) BETWEEN ? AND ?
        GROUP BY path
        ORDER BY ${sortColumn === 'views' ? 'views' : sortColumn === 'unique_visitors' ? 'unique_visitors' : sortColumn === 'avg_time' ? 'avg_time' : sortColumn === 'avg_scroll' ? 'avg_scroll' : 'views'} ${sortOrder}
        LIMIT 50
      `).all(start, end);

      // Get entry/exit data separately
      const entriesData = db.prepare(`
        SELECT entry_page as path, COUNT(*) as entries
        FROM sessions
        WHERE DATE(started_at) BETWEEN ? AND ? AND is_bot = 0
        GROUP BY entry_page
      `).all(start, end);

      const exitsData = db.prepare(`
        SELECT exit_page as path, COUNT(*) as exits
        FROM sessions
        WHERE DATE(started_at) BETWEEN ? AND ? AND exit_page IS NOT NULL AND is_bot = 0
        GROUP BY exit_page
      `).all(start, end);

      const bouncesData = db.prepare(`
        SELECT entry_page as path, COUNT(*) as bounces
        FROM sessions
        WHERE DATE(started_at) BETWEEN ? AND ? AND page_count = 1 AND is_bot = 0
        GROUP BY entry_page
      `).all(start, end);

      // Merge data
      const entriesMap = new Map(entriesData.map(e => [e.path, e.entries]));
      const exitsMap = new Map(exitsData.map(e => [e.path, e.exits]));
      const bouncesMap = new Map(bouncesData.map(b => [b.path, b.bounces]));

      res.json({
        success: true,
        data: {
          pages: pages.map(p => {
            const entries = entriesMap.get(p.path) || 0;
            const bounces = bouncesMap.get(p.path) || 0;
            return {
              path: p.path,
              views: p.views || 0,
              unique_visitors: p.unique_visitors || 0,
              avg_time: Math.round(p.avg_time || 0),
              avg_scroll: Math.round(p.avg_scroll || 0),
              entries: entries,
              exits: exitsMap.get(p.path) || 0,
              bounce_rate: entries > 0 ? Math.round((bounces / entries) * 1000) / 10 : 0
            };
          })
        }
      });

    } catch (err) {
      console.error('Dashboard pages error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // ----------------------------------------
  // GET /api/analytics/dashboard/referrers
  // Traffic source analysis
  // ----------------------------------------
  app.get('/api/analytics/dashboard/referrers', auth, async (req, res) => {
    try {
      const { start_date, end_date, type } = req.query;
      const dateRange = parseDateRange(start_date, end_date);

      if (!dateRange.valid) {
        return res.status(400).json({ error: dateRange.error });
      }

      const { start, end } = dateRange;

      // Use aggregate tables for longer ranges
      if (shouldUseAggregates(start, end)) {
        let referrersQuery = `
          SELECT
            referrer_domain as domain,
            referrer_type as type,
            SUM(visits) as visits,
            SUM(page_views) as page_views
          FROM daily_referrer_stats
          WHERE date BETWEEN ? AND ?
        `;
        const params = [start, end];

        if (type) {
          referrersQuery += ' AND referrer_type = ?';
          params.push(type);
        }

        referrersQuery += `
          GROUP BY referrer_domain, referrer_type
          ORDER BY visits DESC
          LIMIT 20
        `;

        const referrers = db.prepare(referrersQuery).all(...params);

        // Get by type totals
        const byType = db.prepare(`
          SELECT
            referrer_type as type,
            SUM(visits) as visits
          FROM daily_referrer_stats
          WHERE date BETWEEN ? AND ?
          GROUP BY referrer_type
        `).all(start, end);

        const byTypeObj = {
          direct: 0,
          search: 0,
          social: 0,
          referral: 0
        };
        byType.forEach(t => {
          if (t.type && byTypeObj.hasOwnProperty(t.type)) {
            byTypeObj[t.type] = t.visits;
          }
        });

        return res.json({
          success: true,
          data: {
            referrers: referrers.map(r => ({
              domain: r.domain,
              type: r.type || 'unknown',
              visits: r.visits || 0,
              page_views: r.page_views || 0
            })),
            by_type: byTypeObj
          }
        });
      }

      // Raw query for shorter ranges
      let referrersQuery = `
        SELECT
          referrer_domain as domain,
          referrer_type as type,
          COUNT(*) as visits,
          SUM(page_count) as page_views
        FROM sessions
        WHERE DATE(started_at) BETWEEN ? AND ?
          AND is_bot = 0
      `;
      const params = [start, end];

      if (type) {
        referrersQuery += ' AND referrer_type = ?';
        params.push(type);
      }

      referrersQuery += `
        GROUP BY referrer_domain, referrer_type
        ORDER BY visits DESC
        LIMIT 20
      `;

      const referrers = db.prepare(referrersQuery).all(...params);

      // Get by type totals
      const byType = db.prepare(`
        SELECT
          COALESCE(referrer_type, 'direct') as type,
          COUNT(*) as visits
        FROM sessions
        WHERE DATE(started_at) BETWEEN ? AND ?
          AND is_bot = 0
        GROUP BY referrer_type
      `).all(start, end);

      const byTypeObj = {
        direct: 0,
        search: 0,
        social: 0,
        referral: 0
      };
      byType.forEach(t => {
        const normalizedType = t.type || 'direct';
        if (byTypeObj.hasOwnProperty(normalizedType)) {
          byTypeObj[normalizedType] = t.visits;
        }
      });

      res.json({
        success: true,
        data: {
          referrers: referrers.map(r => ({
            domain: r.domain || '(direct)',
            type: r.type || 'direct',
            visits: r.visits || 0,
            page_views: r.page_views || 0
          })),
          by_type: byTypeObj
        }
      });

    } catch (err) {
      console.error('Dashboard referrers error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // ----------------------------------------
  // GET /api/analytics/dashboard/events
  // Custom event tracking summary
  // ----------------------------------------
  app.get('/api/analytics/dashboard/events', auth, async (req, res) => {
    try {
      const { start_date, end_date, name } = req.query;
      const dateRange = parseDateRange(start_date, end_date);

      if (!dateRange.valid) {
        return res.status(400).json({ error: dateRange.error });
      }

      const { start, end } = dateRange;

      // Use aggregate tables for longer ranges
      if (shouldUseAggregates(start, end)) {
        let eventsQuery = `
          SELECT
            event_name as name,
            SUM(count) as count,
            SUM(unique_visitors) as unique_visitors
          FROM daily_event_stats
          WHERE date BETWEEN ? AND ?
        `;
        const params = [start, end];

        if (name) {
          eventsQuery += ' AND event_name = ?';
          params.push(name);
        }

        eventsQuery += `
          GROUP BY event_name
          ORDER BY count DESC
          LIMIT 20
        `;

        const events = db.prepare(eventsQuery).all(...params);

        return res.json({
          success: true,
          data: {
            events: events.map(e => ({
              name: e.name,
              count: e.count || 0,
              unique_visitors: e.unique_visitors || 0
            }))
          }
        });
      }

      // Raw query for shorter ranges
      let eventsQuery = `
        SELECT
          event_type as name,
          COUNT(*) as count,
          COUNT(DISTINCT ip_hash) as unique_visitors
        FROM events
        WHERE DATE(created_at) BETWEEN ? AND ?
          AND suspicious = 0
      `;
      const params = [start, end];

      if (name) {
        eventsQuery += ' AND event_type = ?';
        params.push(name);
      }

      eventsQuery += `
        GROUP BY event_type
        ORDER BY count DESC
        LIMIT 20
      `;

      const events = db.prepare(eventsQuery).all(...params);

      res.json({
        success: true,
        data: {
          events: events.map(e => ({
            name: e.name,
            count: e.count || 0,
            unique_visitors: e.unique_visitors || 0
          }))
        }
      });

    } catch (err) {
      console.error('Dashboard events error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // ----------------------------------------
  // GET /api/analytics/dashboard/downloads
  // PDF and paper download tracking
  // ----------------------------------------
  app.get('/api/analytics/dashboard/downloads', auth, async (req, res) => {
    try {
      const { start_date, end_date } = req.query;
      const dateRange = parseDateRange(start_date, end_date);

      if (!dateRange.valid) {
        return res.status(400).json({ error: dateRange.error });
      }

      const { start, end } = dateRange;

      // Get download events
      const downloads = db.prepare(`
        SELECT
          event_label,
          COUNT(*) as count,
          COUNT(DISTINCT ip_hash) as unique_visitors
        FROM events
        WHERE DATE(created_at) BETWEEN ? AND ?
          AND event_type IN ('pdf_download', 'paper_download', 'pdf_click', 'download')
          AND suspicious = 0
        GROUP BY event_label
        ORDER BY count DESC
        LIMIT 20
      `).all(start, end);

      // Helper to extract filename from event_label
      // Handles both old format (plain filename) and new format (JSON with filename field)
      function extractFileName(eventLabel) {
        if (!eventLabel) return 'Unknown';
        // Try to parse as JSON first
        if (eventLabel.startsWith('{')) {
          try {
            const parsed = JSON.parse(eventLabel);
            return parsed.filename || parsed.file_name || eventLabel;
          } catch (e) {
            return eventLabel;
          }
        }
        return eventLabel;
      }

      // Get top referrers for downloads
      const downloadReferrers = db.prepare(`
        SELECT
          event_label,
          referrer
        FROM events
        WHERE DATE(created_at) BETWEEN ? AND ?
          AND event_type IN ('pdf_download', 'paper_download', 'pdf_click', 'download')
          AND suspicious = 0
          AND referrer IS NOT NULL
      `).all(start, end);

      // Group referrers by download
      const referrersByDownload = new Map();
      downloadReferrers.forEach(d => {
        if (!d.event_label) return;
        if (!referrersByDownload.has(d.event_label)) {
          referrersByDownload.set(d.event_label, new Map());
        }
        const domain = extractDomain(d.referrer);
        if (domain) {
          const domainMap = referrersByDownload.get(d.event_label);
          domainMap.set(domain, (domainMap.get(domain) || 0) + 1);
        }
      });

      // Calculate total
      const total = downloads.reduce((sum, d) => sum + d.count, 0);

      res.json({
        success: true,
        data: {
          downloads: downloads.map(d => {
            const refMap = referrersByDownload.get(d.event_label);
            const topRefs = refMap
              ? Array.from(refMap.entries())
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3)
                  .map(([domain]) => domain)
              : [];

            return {
              file_name: extractFileName(d.event_label),
              count: d.count,
              unique_visitors: d.unique_visitors,
              top_referrers: topRefs
            };
          }),
          total: total
        }
      });

    } catch (err) {
      console.error('Dashboard downloads error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // ----------------------------------------
  // GET /api/analytics/dashboard/timeseries
  // Time-based metric visualization
  // ----------------------------------------
  app.get('/api/analytics/dashboard/timeseries', auth, async (req, res) => {
    try {
      const { start_date, end_date, metric, granularity } = req.query;
      const dateRange = parseDateRange(start_date, end_date);

      if (!dateRange.valid) {
        return res.status(400).json({ error: dateRange.error });
      }

      const { start, end } = dateRange;
      const validMetrics = ['visitors', 'sessions', 'page_views'];
      const validGranularities = ['hour', 'day', 'week'];

      const selectedMetric = validMetrics.includes(metric) ? metric : 'visitors';
      const selectedGranularity = validGranularities.includes(granularity) ? granularity : 'day';

      let query;
      let dateFormat;

      switch (selectedGranularity) {
        case 'hour':
          dateFormat = '%Y-%m-%d %H:00';
          break;
        case 'week':
          dateFormat = '%Y-W%W';
          break;
        default:
          dateFormat = '%Y-%m-%d';
      }

      switch (selectedMetric) {
        case 'visitors':
          query = `
            SELECT
              strftime('${dateFormat}', timestamp) as timestamp,
              COUNT(DISTINCT visitor_id) as value
            FROM page_views
            WHERE DATE(timestamp) BETWEEN ? AND ?
            GROUP BY strftime('${dateFormat}', timestamp)
            ORDER BY timestamp
          `;
          break;
        case 'sessions':
          query = `
            SELECT
              strftime('${dateFormat}', started_at) as timestamp,
              COUNT(*) as value
            FROM sessions
            WHERE DATE(started_at) BETWEEN ? AND ?
              AND is_bot = 0
            GROUP BY strftime('${dateFormat}', started_at)
            ORDER BY timestamp
          `;
          break;
        case 'page_views':
        default:
          query = `
            SELECT
              strftime('${dateFormat}', timestamp) as timestamp,
              COUNT(*) as value
            FROM page_views
            WHERE DATE(timestamp) BETWEEN ? AND ?
            GROUP BY strftime('${dateFormat}', timestamp)
            ORDER BY timestamp
          `;
      }

      const series = db.prepare(query).all(start, end);

      res.json({
        success: true,
        data: {
          series: series.map(s => ({
            timestamp: s.timestamp,
            value: s.value || 0
          }))
        }
      });

    } catch (err) {
      console.error('Dashboard timeseries error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // ----------------------------------------
  // GET /api/analytics/dashboard/visitors
  // Visitor demographics and segments
  // ----------------------------------------
  app.get('/api/analytics/dashboard/visitors', auth, async (req, res) => {
    try {
      const { start_date, end_date } = req.query;
      const dateRange = parseDateRange(start_date, end_date);

      if (!dateRange.valid) {
        return res.status(400).json({ error: dateRange.error });
      }

      const { start, end } = dateRange;

      // New vs returning visitors
      const visitorCounts = db.prepare(`
        SELECT
          SUM(CASE WHEN v.visit_count = 1 THEN 1 ELSE 0 END) as new_visitors,
          SUM(CASE WHEN v.visit_count > 1 THEN 1 ELSE 0 END) as returning_visitors
        FROM (
          SELECT DISTINCT pv.visitor_id
          FROM page_views pv
          WHERE DATE(pv.timestamp) BETWEEN ? AND ?
        ) active
        JOIN visitors v ON active.visitor_id = v.id
      `).get(start, end);

      // By country (from sessions)
      const byCountry = db.prepare(`
        SELECT
          COALESCE(country, 'Unknown') as country,
          COUNT(DISTINCT visitor_id) as count
        FROM sessions
        WHERE DATE(started_at) BETWEEN ? AND ?
          AND is_bot = 0
        GROUP BY country
        ORDER BY count DESC
        LIMIT 10
      `).all(start, end);

      // By device type
      const byDevice = db.prepare(`
        SELECT
          COALESCE(device_type, 'unknown') as device_type,
          COUNT(DISTINCT visitor_id) as count
        FROM sessions
        WHERE DATE(started_at) BETWEEN ? AND ?
          AND is_bot = 0
        GROUP BY device_type
      `).all(start, end);

      const deviceObj = {
        desktop: 0,
        mobile: 0,
        tablet: 0
      };
      byDevice.forEach(d => {
        const dt = d.device_type?.toLowerCase() || 'unknown';
        if (deviceObj.hasOwnProperty(dt)) {
          deviceObj[dt] = d.count;
        } else if (dt === 'unknown') {
          deviceObj.desktop += d.count; // Assume unknown is desktop
        }
      });

      // By browser
      const byBrowser = db.prepare(`
        SELECT
          COALESCE(browser, 'Unknown') as browser,
          COUNT(DISTINCT visitor_id) as count
        FROM sessions
        WHERE DATE(started_at) BETWEEN ? AND ?
          AND is_bot = 0
        GROUP BY browser
        ORDER BY count DESC
        LIMIT 10
      `).all(start, end);

      res.json({
        success: true,
        data: {
          new_visitors: visitorCounts.new_visitors || 0,
          returning_visitors: visitorCounts.returning_visitors || 0,
          by_country: byCountry.map(c => ({
            country: c.country,
            count: c.count
          })),
          by_device: deviceObj,
          by_browser: byBrowser.map(b => ({
            browser: b.browser,
            count: b.count
          }))
        }
      });

    } catch (err) {
      console.error('Dashboard visitors error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // ----------------------------------------
  // GET /api/analytics/dashboard/funnel
  // Conversion funnel analysis
  // ----------------------------------------
  app.get('/api/analytics/dashboard/funnel', auth, async (req, res) => {
    try {
      const { start_date, end_date, steps } = req.query;
      const dateRange = parseDateRange(start_date, end_date);

      if (!dateRange.valid) {
        return res.status(400).json({ error: dateRange.error });
      }

      if (!steps) {
        return res.status(400).json({ error: 'Steps parameter required (JSON array of paths/events)' });
      }

      let funnelSteps;
      try {
        funnelSteps = JSON.parse(steps);
        if (!Array.isArray(funnelSteps) || funnelSteps.length < 2) {
          throw new Error('Invalid steps');
        }
      } catch (e) {
        return res.status(400).json({ error: 'Invalid steps format. Must be JSON array with at least 2 steps' });
      }

      const { start, end } = dateRange;
      const results = [];

      // For each step, count unique visitors who completed it
      for (let i = 0; i < funnelSteps.length; i++) {
        const step = funnelSteps[i];
        let count;

        // Check if step is a page path or event
        if (step.startsWith('/')) {
          // Page path
          const pageResult = db.prepare(`
            SELECT COUNT(DISTINCT visitor_id) as count
            FROM page_views
            WHERE DATE(timestamp) BETWEEN ? AND ?
              AND path = ?
          `).get(start, end, step);
          count = pageResult.count;
        } else {
          // Event name
          const eventResult = db.prepare(`
            SELECT COUNT(DISTINCT ip_hash) as count
            FROM events
            WHERE DATE(created_at) BETWEEN ? AND ?
              AND event_type = ?
              AND suspicious = 0
          `).get(start, end, step);
          count = eventResult.count;
        }

        const firstStepCount = i === 0 ? count : results[0].count;
        const prevCount = i === 0 ? count : results[i - 1].count;

        results.push({
          name: step,
          count: count,
          conversion_rate: firstStepCount > 0 ? Math.round((count / firstStepCount) * 1000) / 10 : 0,
          drop_off: prevCount > 0 ? Math.round(((prevCount - count) / prevCount) * 1000) / 10 : 0
        });
      }

      // Adjust first step (no drop off)
      if (results.length > 0) {
        results[0].drop_off = 0;
      }

      res.json({
        success: true,
        data: {
          steps: results
        }
      });

    } catch (err) {
      console.error('Dashboard funnel error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // ----------------------------------------
  // GET /api/analytics/dashboard/export
  // Export data as CSV
  // ----------------------------------------
  app.get('/api/analytics/dashboard/export', auth, async (req, res) => {
    try {
      const { start_date, end_date, type } = req.query;
      const dateRange = parseDateRange(start_date, end_date);

      if (!dateRange.valid) {
        return res.status(400).json({ error: dateRange.error });
      }

      const validTypes = ['page_views', 'sessions', 'events'];
      const exportType = validTypes.includes(type) ? type : 'page_views';

      const { start, end } = dateRange;
      let data;
      let headers;
      let filename;

      switch (exportType) {
        case 'sessions':
          headers = ['session_id', 'visitor_id', 'started_at', 'duration_seconds', 'entry_page', 'exit_page', 'page_count', 'referrer_domain', 'referrer_type', 'device_type', 'browser', 'country'];
          data = db.prepare(`
            SELECT
              id as session_id,
              visitor_id,
              started_at,
              duration_seconds,
              entry_page,
              exit_page,
              page_count,
              referrer_domain,
              referrer_type,
              device_type,
              browser,
              country
            FROM sessions
            WHERE DATE(started_at) BETWEEN ? AND ?
              AND is_bot = 0
            ORDER BY started_at DESC
            LIMIT 10000
          `).all(start, end);
          filename = `sessions_${start}_${end}.csv`;
          break;

        case 'events':
          headers = ['event_type', 'event_label', 'page_url', 'created_at'];
          data = db.prepare(`
            SELECT
              event_type,
              event_label,
              page_url,
              created_at
            FROM events
            WHERE DATE(created_at) BETWEEN ? AND ?
              AND suspicious = 0
            ORDER BY created_at DESC
            LIMIT 10000
          `).all(start, end);
          filename = `events_${start}_${end}.csv`;
          break;

        case 'page_views':
        default:
          headers = ['path', 'title', 'visitor_id', 'session_id', 'timestamp', 'time_on_page_seconds', 'scroll_depth_percent'];
          data = db.prepare(`
            SELECT
              path,
              title,
              visitor_id,
              session_id,
              timestamp,
              time_on_page_seconds,
              scroll_depth_percent
            FROM page_views
            WHERE DATE(timestamp) BETWEEN ? AND ?
            ORDER BY timestamp DESC
            LIMIT 10000
          `).all(start, end);
          filename = `page_views_${start}_${end}.csv`;
      }

      // Convert to CSV
      const csvRows = [headers.join(',')];

      for (const row of data) {
        const values = headers.map(header => {
          const value = row[header];
          if (value === null || value === undefined) return '';
          // Escape quotes and wrap in quotes if contains comma or quote
          const stringValue = String(value);
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        });
        csvRows.push(values.join(','));
      }

      const csv = csvRows.join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(csv);

    } catch (err) {
      console.error('Dashboard export error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}

// ============================================
// HELPER FUNCTIONS (private)
// ============================================

/**
 * Extract domain from URL or referrer string
 * @param {string} url - Full URL or referrer
 * @returns {string|null} - Domain or null
 */
function extractDomain(url) {
  if (!url) return null;
  try {
    // Handle cases where url might not have protocol
    const withProtocol = url.startsWith('http') ? url : `https://${url}`;
    const urlObj = new URL(withProtocol);
    return urlObj.hostname.replace(/^www\./, '');
  } catch (e) {
    // Try to extract domain without URL parsing
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?([^\/\s]+)/);
    return match ? match[1] : null;
  }
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
  register,
  // Export utilities for testing
  parseDateRange,
  calculateChange,
  getPreviousPeriod,
  shouldUseAggregates,
  sanitizeSortColumn,
  sanitizeSortOrder
};
