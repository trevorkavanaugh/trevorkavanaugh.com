/**
 * Background Jobs Module for Analytics Platform
 *
 * Runs scheduled tasks for data maintenance and aggregation:
 * - Close stale sessions (every 5 minutes)
 * - Compute daily aggregates (daily at 2am)
 * - Cleanup old data (weekly on Sunday at 3am)
 *
 * All jobs run in-process with the main Express server.
 */

const cron = require('node-cron');

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  // Session is considered stale after this many minutes of inactivity
  SESSION_TIMEOUT_MINUTES: 30,

  // Data retention period (days) for raw data
  DATA_RETENTION_DAYS: 90,

  // Timezone for cron schedules
  TIMEZONE: 'America/New_York'
};

// ============================================
// LOGGING HELPERS
// ============================================

/**
 * Log job start with timestamp
 * @param {string} jobName - Name of the job
 */
function logJobStart(jobName) {
  console.log(`[${new Date().toISOString()}] [JOBS] Starting: ${jobName}`);
}

/**
 * Log job completion with timestamp and duration
 * @param {string} jobName - Name of the job
 * @param {number} startTime - Job start time (Date.now())
 * @param {object} results - Results object to log
 */
function logJobComplete(jobName, startTime, results = {}) {
  const duration = Date.now() - startTime;
  console.log(`[${new Date().toISOString()}] [JOBS] Completed: ${jobName} (${duration}ms)`, results);
}

/**
 * Log job error
 * @param {string} jobName - Name of the job
 * @param {Error} error - Error object
 */
function logJobError(jobName, error) {
  console.error(`[${new Date().toISOString()}] [JOBS] Error in ${jobName}:`, error.message);
}

// ============================================
// JOB 1: CLOSE STALE SESSIONS
// ============================================

/**
 * Close sessions that have been inactive for longer than SESSION_TIMEOUT_MINUTES.
 * Sets ended_at to the timestamp of the last page view and calculates duration.
 *
 * Runs every 5 minutes.
 *
 * @param {Database} db - SQLite database instance
 * @returns {number} - Number of sessions closed
 */
function closeStaleSessionsJob(db) {
  const jobName = 'Close Stale Sessions';
  const startTime = Date.now();

  try {
    logJobStart(jobName);

    // Calculate the cutoff time (30 minutes ago)
    const cutoffTime = new Date(Date.now() - CONFIG.SESSION_TIMEOUT_MINUTES * 60 * 1000).toISOString();

    // Find stale sessions: sessions where ended_at is NULL and
    // there's no page_view activity in the last 30 minutes
    const staleSessions = db.prepare(`
      SELECT
        s.id as session_id,
        s.started_at,
        MAX(pv.timestamp) as last_activity
      FROM sessions s
      LEFT JOIN page_views pv ON s.id = pv.session_id
      WHERE s.ended_at IS NULL
      GROUP BY s.id
      HAVING MAX(pv.timestamp) < ? OR MAX(pv.timestamp) IS NULL
    `).all(cutoffTime);

    if (staleSessions.length === 0) {
      logJobComplete(jobName, startTime, { sessionsClosed: 0 });
      return 0;
    }

    // Prepare update statement
    const updateSession = db.prepare(`
      UPDATE sessions
      SET ended_at = ?,
          duration_seconds = CAST((julianday(?) - julianday(started_at)) * 86400 AS INTEGER)
      WHERE id = ?
    `);

    // Close each stale session
    let closedCount = 0;
    const closeTransaction = db.transaction(() => {
      for (const session of staleSessions) {
        // Use last activity time, or started_at if no page views
        const endTime = session.last_activity || session.started_at;
        updateSession.run(endTime, endTime, session.session_id);
        closedCount++;
      }
    });

    closeTransaction();

    logJobComplete(jobName, startTime, { sessionsClosed: closedCount });
    return closedCount;

  } catch (error) {
    logJobError(jobName, error);
    return 0;
  }
}

// ============================================
// JOB 2: COMPUTE DAILY AGGREGATES
// ============================================

/**
 * Compute daily aggregate statistics for the previous day.
 * Populates daily_stats, daily_referrer_stats, and daily_event_stats tables.
 *
 * Runs daily at 2am.
 *
 * @param {Database} db - SQLite database instance
 * @param {string} [targetDate] - Optional specific date (YYYY-MM-DD), defaults to yesterday
 * @returns {object} - Results of aggregation
 */
function computeDailyAggregatesJob(db, targetDate = null) {
  const jobName = 'Compute Daily Aggregates';
  const startTime = Date.now();

  try {
    logJobStart(jobName);

    // Calculate target date (yesterday by default)
    if (!targetDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      targetDate = yesterday.toISOString().split('T')[0];
    }

    const results = {
      date: targetDate,
      pageStats: 0,
      referrerStats: 0,
      eventStats: 0
    };

    // Run all aggregations in a transaction
    const aggregateTransaction = db.transaction(() => {

      // ----------------------------------------
      // 1. DAILY PAGE STATS
      // ----------------------------------------

      // First, get entry/exit/bounce data from sessions
      const sessionData = db.prepare(`
        SELECT
          entry_page,
          exit_page,
          CASE WHEN page_count = 1 THEN 1 ELSE 0 END as is_bounce
        FROM sessions
        WHERE DATE(started_at) = ?
          AND is_bot = 0
      `).all(targetDate);

      // Build maps for entries, exits, bounces
      const entriesMap = new Map();
      const exitsMap = new Map();
      const bouncesMap = new Map();

      for (const session of sessionData) {
        if (session.entry_page) {
          entriesMap.set(session.entry_page, (entriesMap.get(session.entry_page) || 0) + 1);
          if (session.is_bounce) {
            bouncesMap.set(session.entry_page, (bouncesMap.get(session.entry_page) || 0) + 1);
          }
        }
        if (session.exit_page) {
          exitsMap.set(session.exit_page, (exitsMap.get(session.exit_page) || 0) + 1);
        }
      }

      // Get page view aggregates
      const pageStats = db.prepare(`
        SELECT
          path as page_path,
          COUNT(*) as page_views,
          COUNT(DISTINCT visitor_id) as unique_visitors,
          COUNT(DISTINCT session_id) as sessions,
          AVG(time_on_page_seconds) as avg_time_on_page_seconds,
          AVG(scroll_depth_percent) as avg_scroll_depth_percent
        FROM page_views
        WHERE DATE(timestamp) = ?
        GROUP BY path
      `).all(targetDate);

      // Delete existing stats for this date
      db.prepare('DELETE FROM daily_stats WHERE date = ?').run(targetDate);

      // Insert new stats
      const insertPageStats = db.prepare(`
        INSERT INTO daily_stats (
          date, page_path, page_views, unique_visitors, sessions,
          avg_time_on_page_seconds, avg_scroll_depth_percent,
          bounce_count, entries, exits
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const stat of pageStats) {
        insertPageStats.run(
          targetDate,
          stat.page_path,
          stat.page_views,
          stat.unique_visitors,
          stat.sessions,
          stat.avg_time_on_page_seconds || 0,
          stat.avg_scroll_depth_percent || 0,
          bouncesMap.get(stat.page_path) || 0,
          entriesMap.get(stat.page_path) || 0,
          exitsMap.get(stat.page_path) || 0
        );
        results.pageStats++;
      }

      // ----------------------------------------
      // 2. DAILY REFERRER STATS
      // ----------------------------------------

      // Delete existing referrer stats for this date
      db.prepare('DELETE FROM daily_referrer_stats WHERE date = ?').run(targetDate);

      // Insert referrer stats
      const referrerStats = db.prepare(`
        INSERT INTO daily_referrer_stats (date, referrer_domain, referrer_type, visits, page_views)
        SELECT
          DATE(started_at) as date,
          COALESCE(referrer_domain, 'direct') as referrer_domain,
          COALESCE(referrer_type, 'direct') as referrer_type,
          COUNT(*) as visits,
          SUM(page_count) as page_views
        FROM sessions
        WHERE DATE(started_at) = ?
          AND is_bot = 0
        GROUP BY DATE(started_at), COALESCE(referrer_domain, 'direct'), COALESCE(referrer_type, 'direct')
      `).run(targetDate);

      results.referrerStats = referrerStats.changes;

      // ----------------------------------------
      // 3. DAILY EVENT STATS
      // ----------------------------------------

      // Delete existing event stats for this date
      db.prepare('DELETE FROM daily_event_stats WHERE date = ?').run(targetDate);

      // Insert event stats
      const eventStats = db.prepare(`
        INSERT INTO daily_event_stats (date, event_name, count, unique_visitors)
        SELECT
          DATE(created_at) as date,
          event_type as event_name,
          COUNT(*) as count,
          COUNT(DISTINCT ip_hash) as unique_visitors
        FROM events
        WHERE DATE(created_at) = ?
          AND suspicious = 0
        GROUP BY DATE(created_at), event_type
      `).run(targetDate);

      results.eventStats = eventStats.changes;
    });

    aggregateTransaction();

    logJobComplete(jobName, startTime, results);
    return results;

  } catch (error) {
    logJobError(jobName, error);
    return { error: error.message };
  }
}

// ============================================
// JOB 3: CLEANUP OLD DATA
// ============================================

/**
 * Delete raw data older than DATA_RETENTION_DAYS.
 * Keeps aggregate tables (daily_stats, etc.) indefinitely.
 *
 * Runs weekly on Sunday at 3am.
 *
 * @param {Database} db - SQLite database instance
 * @returns {object} - Results of cleanup
 */
function cleanupOldDataJob(db) {
  const jobName = 'Cleanup Old Data';
  const startTime = Date.now();

  try {
    logJobStart(jobName);

    // Calculate cutoff date
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - CONFIG.DATA_RETENTION_DAYS);
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];

    const results = {
      cutoffDate: cutoffDateStr,
      pageViewsDeleted: 0,
      sessionsDeleted: 0,
      eventsDeleted: 0
    };

    // Run cleanup in a transaction
    const cleanupTransaction = db.transaction(() => {

      // Delete old page_views
      const pageViewsResult = db.prepare(`
        DELETE FROM page_views
        WHERE DATE(timestamp) < ?
      `).run(cutoffDateStr);
      results.pageViewsDeleted = pageViewsResult.changes;

      // Delete old sessions (but keep visitors table intact)
      const sessionsResult = db.prepare(`
        DELETE FROM sessions
        WHERE DATE(started_at) < ?
      `).run(cutoffDateStr);
      results.sessionsDeleted = sessionsResult.changes;

      // Delete old events
      const eventsResult = db.prepare(`
        DELETE FROM events
        WHERE DATE(created_at) < ?
      `).run(cutoffDateStr);
      results.eventsDeleted = eventsResult.changes;

      // Note: We keep all aggregate tables (daily_stats, daily_referrer_stats,
      // daily_event_stats) indefinitely for historical reporting

      // Note: We keep the visitors table intact for returning visitor tracking

    });

    cleanupTransaction();

    // Run VACUUM to reclaim disk space (outside transaction)
    // Only if significant data was deleted
    const totalDeleted = results.pageViewsDeleted + results.sessionsDeleted + results.eventsDeleted;
    if (totalDeleted > 1000) {
      console.log(`[${new Date().toISOString()}] [JOBS] Running VACUUM to reclaim disk space...`);
      db.exec('VACUUM');
    }

    logJobComplete(jobName, startTime, results);
    return results;

  } catch (error) {
    logJobError(jobName, error);
    return { error: error.message };
  }
}

// ============================================
// SCHEDULER
// ============================================

/**
 * Start all background jobs
 * @param {Database} db - SQLite database instance
 */
function start(db) {
  console.log(`[${new Date().toISOString()}] [JOBS] Initializing background jobs...`);

  // Job 1: Close stale sessions - every 5 minutes
  cron.schedule('*/5 * * * *', () => {
    closeStaleSessionsJob(db);
  }, {
    timezone: CONFIG.TIMEZONE
  });
  console.log(`[${new Date().toISOString()}] [JOBS] Scheduled: Close Stale Sessions (every 5 minutes)`);

  // Job 2: Compute daily aggregates - daily at 2:00 AM
  cron.schedule('0 2 * * *', () => {
    computeDailyAggregatesJob(db);
  }, {
    timezone: CONFIG.TIMEZONE
  });
  console.log(`[${new Date().toISOString()}] [JOBS] Scheduled: Compute Daily Aggregates (daily at 2:00 AM ${CONFIG.TIMEZONE})`);

  // Job 3: Cleanup old data - Sunday at 3:00 AM
  cron.schedule('0 3 * * 0', () => {
    cleanupOldDataJob(db);
  }, {
    timezone: CONFIG.TIMEZONE
  });
  console.log(`[${new Date().toISOString()}] [JOBS] Scheduled: Cleanup Old Data (Sundays at 3:00 AM ${CONFIG.TIMEZONE})`);

  console.log(`[${new Date().toISOString()}] [JOBS] Background jobs initialized successfully`);
}

/**
 * Run a job manually (useful for testing or backfilling)
 * @param {Database} db - SQLite database instance
 * @param {string} jobName - Name of the job to run
 * @param {object} options - Optional parameters for the job
 */
function runManually(db, jobName, options = {}) {
  switch (jobName) {
    case 'closeStaleSessions':
      return closeStaleSessionsJob(db);
    case 'computeDailyAggregates':
      return computeDailyAggregatesJob(db, options.date);
    case 'cleanupOldData':
      return cleanupOldDataJob(db);
    default:
      throw new Error(`Unknown job: ${jobName}`);
  }
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
  start,
  runManually,
  // Export individual jobs for testing
  closeStaleSessionsJob,
  computeDailyAggregatesJob,
  cleanupOldDataJob,
  // Export config for reference
  CONFIG
};
