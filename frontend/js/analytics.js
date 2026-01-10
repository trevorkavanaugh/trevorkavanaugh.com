/**
 * TK Analytics - Client-side Analytics Tracking Script
 *
 * A lightweight, privacy-conscious analytics solution for trevorkavanaugh.com
 *
 * Features:
 * - Visitor and session management with UUID generation
 * - Page view tracking with UTM parameter extraction
 * - Time on page tracking with visibility-aware heartbeat
 * - Scroll depth milestone tracking
 * - Referrer classification
 * - Device and browser detection
 * - Auto-tracked events (outbound clicks, PDF downloads, CTA clicks)
 * - Custom event API
 * - Event batching with retry logic
 *
 * @version 1.0.0
 * @author Trevor Kavanaugh
 * @license MIT
 */

(function() {
    'use strict';

    // ============================================
    // Configuration
    // ============================================

    const CONFIG = {
        // API endpoint for collecting analytics data
        endpoint: 'https://api.trevorkavanaugh.com/api/analytics/collect',

        // Session timeout in milliseconds (30 minutes)
        sessionTimeout: 30 * 60 * 1000,

        // Heartbeat interval for time tracking (15 seconds)
        heartbeatInterval: 15 * 1000,

        // Event batch settings
        batchInterval: 5 * 1000,      // Send every 5 seconds
        batchMaxSize: 10,              // Or when 10 events accumulated

        // Scroll depth milestones to track (percentages)
        scrollMilestones: [25, 50, 75, 100],

        // Storage keys
        storageKeys: {
            visitorId: 'tk_visitor_id',
            visitCount: 'tk_visit_count',
            sessionId: 'tk_session_id',
            lastActivity: 'tk_last_activity'
        },

        // Enable debug logging (set to false in production)
        debug: false
    };

    // ============================================
    // Utility Functions
    // ============================================

    /**
     * Generate a UUID v4
     * @returns {string} A random UUID
     */
    function generateUUID() {
        // Use crypto.randomUUID if available (modern browsers)
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }

        // Fallback to manual generation
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Get current timestamp in ISO 8601 format
     * @returns {string} ISO timestamp
     */
    function getTimestamp() {
        return new Date().toISOString();
    }

    /**
     * Safely get item from storage with fallback
     * @param {string} key - Storage key
     * @param {Storage} storage - localStorage or sessionStorage
     * @returns {string|null} Stored value or null
     */
    function getFromStorage(key, storage) {
        try {
            return storage.getItem(key);
        } catch (e) {
            // Storage might be disabled or quota exceeded
            return null;
        }
    }

    /**
     * Safely set item in storage
     * @param {string} key - Storage key
     * @param {string} value - Value to store
     * @param {Storage} storage - localStorage or sessionStorage
     * @returns {boolean} Success status
     */
    function setInStorage(key, value, storage) {
        try {
            storage.setItem(key, value);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Get cookie value by name
     * @param {string} name - Cookie name
     * @returns {string|null} Cookie value or null
     */
    function getCookie(name) {
        try {
            const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
            return match ? decodeURIComponent(match[2]) : null;
        } catch (e) {
            return null;
        }
    }

    /**
     * Set a cookie
     * @param {string} name - Cookie name
     * @param {string} value - Cookie value
     * @param {number} days - Expiration in days
     */
    function setCookie(name, value, days) {
        try {
            const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
            document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
        } catch (e) {
            // Cookie setting failed, continue silently
        }
    }

    /**
     * Log debug messages (only in debug mode)
     * @param {...any} args - Arguments to log
     */
    function debug(...args) {
        if (CONFIG.debug) {
            console.log('[TK Analytics]', ...args);
        }
    }

    // ============================================
    // Visitor & Session Management
    // ============================================

    /**
     * Get or create visitor ID
     * Uses localStorage with cookie fallback for persistence
     * @returns {string} Visitor UUID
     */
    function getVisitorId() {
        // Try localStorage first
        let visitorId = getFromStorage(CONFIG.storageKeys.visitorId, localStorage);

        // Fallback to cookie
        if (!visitorId) {
            visitorId = getCookie(CONFIG.storageKeys.visitorId);
        }

        // Generate new if not found
        if (!visitorId) {
            visitorId = generateUUID();
        }

        // Persist in both localStorage and cookie
        setInStorage(CONFIG.storageKeys.visitorId, visitorId, localStorage);
        setCookie(CONFIG.storageKeys.visitorId, visitorId, 365 * 2); // 2 years

        return visitorId;
    }

    /**
     * Get or create session ID
     * Session expires after 30 minutes of inactivity
     * @returns {string} Session UUID
     */
    function getSessionId() {
        const now = Date.now();
        let sessionId = getFromStorage(CONFIG.storageKeys.sessionId, sessionStorage);
        const lastActivity = parseInt(getFromStorage(CONFIG.storageKeys.lastActivity, sessionStorage) || '0', 10);

        // Check if session expired
        const sessionExpired = lastActivity && (now - lastActivity > CONFIG.sessionTimeout);

        // Generate new session if needed
        if (!sessionId || sessionExpired) {
            sessionId = generateUUID();
            setInStorage(CONFIG.storageKeys.sessionId, sessionId, sessionStorage);
            debug('New session created:', sessionId);
        }

        // Update last activity
        setInStorage(CONFIG.storageKeys.lastActivity, now.toString(), sessionStorage);

        return sessionId;
    }

    /**
     * Get and increment visit count
     * @returns {number} Current visit count
     */
    function getVisitCount() {
        let count = parseInt(getFromStorage(CONFIG.storageKeys.visitCount, localStorage) || '0', 10);

        // Only increment on new sessions
        const sessionId = getFromStorage(CONFIG.storageKeys.sessionId, sessionStorage);
        const isNewSession = !sessionId;

        if (isNewSession) {
            count += 1;
            setInStorage(CONFIG.storageKeys.visitCount, count.toString(), localStorage);
        }

        return count;
    }

    /**
     * Update last activity timestamp
     */
    function updateActivity() {
        setInStorage(CONFIG.storageKeys.lastActivity, Date.now().toString(), sessionStorage);
    }

    // ============================================
    // Referrer Classification
    // ============================================

    /**
     * Parse referrer URL and extract domain
     * @param {string} referrer - Referrer URL
     * @returns {object} Parsed referrer info
     */
    function parseReferrer(referrer) {
        if (!referrer) {
            return { url: null, domain: null, type: 'direct' };
        }

        try {
            const url = new URL(referrer);
            const domain = url.hostname.toLowerCase();
            const type = classifyReferrer(domain, referrer);

            return { url: referrer, domain, type };
        } catch (e) {
            return { url: referrer, domain: null, type: 'referral' };
        }
    }

    /**
     * Classify referrer type based on domain
     * @param {string} domain - Referrer domain
     * @param {string} url - Full referrer URL
     * @returns {string} Referrer type
     */
    function classifyReferrer(domain, url) {
        if (!domain) return 'direct';

        // Search engines
        const searchEngines = ['google', 'bing', 'duckduckgo', 'yahoo', 'baidu', 'yandex'];
        for (const engine of searchEngines) {
            if (domain.includes(engine)) {
                return 'search';
            }
        }

        // Social networks
        const socialNetworks = ['linkedin', 'twitter', 'facebook', 'instagram', 'reddit', 'x.com'];
        for (const network of socialNetworks) {
            if (domain.includes(network)) {
                return 'social';
            }
        }

        // Email clients/services
        if (domain.includes('mail') ||
            domain.includes('outlook') ||
            domain.includes('gmail') ||
            (url && url.toLowerCase().includes('utm_medium=email'))) {
            return 'email';
        }

        // Same domain (internal)
        const currentDomain = window.location.hostname.toLowerCase();
        if (domain === currentDomain || domain.includes('trevorkavanaugh.com')) {
            return 'internal';
        }

        // Everything else is referral
        return 'referral';
    }

    // ============================================
    // UTM Parameter Extraction
    // ============================================

    /**
     * Extract UTM parameters from URL
     * @returns {object} UTM parameters
     */
    function getUTMParams() {
        const params = new URLSearchParams(window.location.search);

        return {
            utm_source: params.get('utm_source') || null,
            utm_medium: params.get('utm_medium') || null,
            utm_campaign: params.get('utm_campaign') || null,
            utm_term: params.get('utm_term') || null,
            utm_content: params.get('utm_content') || null
        };
    }

    // ============================================
    // Device & Browser Detection
    // ============================================

    /**
     * Parse user agent to detect browser, OS, and device type
     * @returns {object} Device context information
     */
    function getDeviceContext() {
        const ua = navigator.userAgent || '';
        const uaLower = ua.toLowerCase();

        // Browser detection
        let browser = 'Unknown';
        let browserVersion = '';

        if (uaLower.includes('firefox')) {
            browser = 'Firefox';
            browserVersion = extractVersion(ua, /Firefox\/(\d+(\.\d+)?)/);
        } else if (uaLower.includes('edg/')) {
            browser = 'Edge';
            browserVersion = extractVersion(ua, /Edg\/(\d+(\.\d+)?)/);
        } else if (uaLower.includes('chrome') && !uaLower.includes('edg')) {
            browser = 'Chrome';
            browserVersion = extractVersion(ua, /Chrome\/(\d+(\.\d+)?)/);
        } else if (uaLower.includes('safari') && !uaLower.includes('chrome')) {
            browser = 'Safari';
            browserVersion = extractVersion(ua, /Version\/(\d+(\.\d+)?)/);
        } else if (uaLower.includes('msie') || uaLower.includes('trident')) {
            browser = 'IE';
            browserVersion = extractVersion(ua, /(?:MSIE |rv:)(\d+(\.\d+)?)/);
        }

        // OS detection
        let os = 'Unknown';
        if (uaLower.includes('windows')) {
            os = 'Windows';
        } else if (uaLower.includes('mac os') || uaLower.includes('macos')) {
            os = 'macOS';
        } else if (uaLower.includes('linux') && !uaLower.includes('android')) {
            os = 'Linux';
        } else if (uaLower.includes('android')) {
            os = 'Android';
        } else if (uaLower.includes('iphone') || uaLower.includes('ipad') || uaLower.includes('ipod')) {
            os = 'iOS';
        }

        // Device type detection
        let deviceType = 'desktop';
        if (/tablet|ipad|playbook|silk/i.test(ua) ||
            (uaLower.includes('android') && !uaLower.includes('mobile'))) {
            deviceType = 'tablet';
        } else if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) {
            deviceType = 'mobile';
        }

        // Screen and viewport
        const screenResolution = `${screen.width}x${screen.height}`;
        const viewport = `${window.innerWidth}x${window.innerHeight}`;

        // Language and timezone
        const language = navigator.language || navigator.userLanguage || 'unknown';
        let timezone = 'unknown';
        try {
            timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        } catch (e) {
            // Intl not supported
        }

        return {
            browser,
            browser_version: browserVersion,
            os,
            device_type: deviceType,
            screen_resolution: screenResolution,
            viewport,
            language,
            timezone
        };
    }

    /**
     * Extract version number from user agent string
     * @param {string} ua - User agent string
     * @param {RegExp} regex - Pattern to match version
     * @returns {string} Version number or empty string
     */
    function extractVersion(ua, regex) {
        const match = ua.match(regex);
        return match ? match[1] : '';
    }

    // ============================================
    // Event Queue & Batching
    // ============================================

    /** @type {Array} Event queue */
    let eventQueue = [];

    /** @type {number|null} Batch timer ID */
    let batchTimer = null;

    /** @type {boolean} Is send in progress */
    let sendingInProgress = false;

    /**
     * Add event to queue and potentially trigger send
     * @param {object} event - Event object
     */
    function queueEvent(event) {
        eventQueue.push(event);
        debug('Event queued:', event.name, 'Queue size:', eventQueue.length);

        // Send immediately if batch is full
        if (eventQueue.length >= CONFIG.batchMaxSize) {
            sendBatch();
        } else if (!batchTimer) {
            // Start timer for batch send
            batchTimer = setTimeout(sendBatch, CONFIG.batchInterval);
        }
    }

    /**
     * Send queued events to the server
     * @param {boolean} useBeacon - Use sendBeacon (for page unload)
     */
    function sendBatch(useBeacon = false) {
        // Clear batch timer
        if (batchTimer) {
            clearTimeout(batchTimer);
            batchTimer = null;
        }

        // Nothing to send
        if (eventQueue.length === 0) {
            return;
        }

        // Prevent concurrent sends (except for beacon)
        if (sendingInProgress && !useBeacon) {
            return;
        }

        // Prepare payload
        const events = eventQueue.splice(0, eventQueue.length);
        const payload = {
            visitor_id: state.visitorId,
            session_id: state.sessionId,
            events,
            context: state.context
        };

        debug('Sending batch:', events.length, 'events', useBeacon ? '(beacon)' : '(fetch)');

        // Use sendBeacon for unload (more reliable)
        if (useBeacon && navigator.sendBeacon) {
            try {
                const success = navigator.sendBeacon(
                    CONFIG.endpoint,
                    JSON.stringify(payload)
                );
                if (!success) {
                    // Beacon failed, put events back in queue
                    eventQueue.unshift(...events);
                }
            } catch (e) {
                debug('Beacon failed:', e);
            }
            return;
        }

        // Use fetch for normal sends
        sendingInProgress = true;

        fetch(CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            keepalive: true // Allow request to complete even if page unloads
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            debug('Batch sent successfully');
        })
        .catch(error => {
            debug('Send failed:', error);
            // Retry once by putting events back in queue
            if (events.length > 0 && eventQueue.length < CONFIG.batchMaxSize * 2) {
                eventQueue.unshift(...events);
                // Schedule retry
                setTimeout(() => sendBatch(), CONFIG.batchInterval * 2);
            }
        })
        .finally(() => {
            sendingInProgress = false;
        });
    }

    // ============================================
    // Event Tracking Functions
    // ============================================

    /**
     * Track an event
     * @param {string} name - Event name
     * @param {object} properties - Event properties
     */
    function trackEvent(name, properties = {}) {
        try {
            updateActivity();

            const event = {
                name,
                timestamp: getTimestamp(),
                properties
            };

            queueEvent(event);
        } catch (e) {
            debug('Error tracking event:', e);
        }
    }

    /**
     * Track page view
     */
    function trackPageView() {
        const referrer = parseReferrer(document.referrer);
        const utmParams = getUTMParams();

        trackEvent('page_view', {
            url: window.location.href,
            path: window.location.pathname,
            title: document.title,
            referrer_url: referrer.url,
            referrer_domain: referrer.domain,
            referrer_type: referrer.type,
            visit_count: state.visitCount,
            ...utmParams
        });
    }

    // ============================================
    // Time on Page Tracking
    // ============================================

    /** @type {number} Time tracking start */
    let pageLoadTime = Date.now();

    /** @type {number} Total visible time */
    let totalVisibleTime = 0;

    /** @type {number} Last visibility check time */
    let lastVisibilityTime = Date.now();

    /** @type {boolean} Is page currently visible */
    let isPageVisible = !document.hidden;

    /** @type {number|null} Heartbeat interval ID */
    let heartbeatIntervalId = null;

    /**
     * Start heartbeat for time tracking
     */
    function startHeartbeat() {
        if (heartbeatIntervalId) return;

        heartbeatIntervalId = setInterval(() => {
            if (isPageVisible) {
                const now = Date.now();
                totalVisibleTime += now - lastVisibilityTime;
                lastVisibilityTime = now;

                // Send heartbeat event
                trackEvent('heartbeat', {
                    time_on_page: Math.round(totalVisibleTime / 1000),
                    path: window.location.pathname
                });
            }
        }, CONFIG.heartbeatInterval);
    }

    /**
     * Stop heartbeat
     */
    function stopHeartbeat() {
        if (heartbeatIntervalId) {
            clearInterval(heartbeatIntervalId);
            heartbeatIntervalId = null;
        }
    }

    /**
     * Handle visibility change
     */
    function handleVisibilityChange() {
        const now = Date.now();

        if (document.hidden) {
            // Page became hidden - accumulate time
            if (isPageVisible) {
                totalVisibleTime += now - lastVisibilityTime;
            }
            isPageVisible = false;
        } else {
            // Page became visible - start counting again
            lastVisibilityTime = now;
            isPageVisible = true;
        }
    }

    /**
     * Send final time on page
     */
    function sendFinalTimeOnPage() {
        // Calculate final time
        if (isPageVisible) {
            totalVisibleTime += Date.now() - lastVisibilityTime;
        }

        const totalSeconds = Math.round(totalVisibleTime / 1000);

        // Only send if meaningful time spent
        if (totalSeconds > 1) {
            // Add to queue and send immediately with beacon
            queueEvent({
                name: 'time_on_page',
                timestamp: getTimestamp(),
                properties: {
                    duration_seconds: totalSeconds,
                    path: window.location.pathname
                }
            });
            sendBatch(true);
        }
    }

    // ============================================
    // Scroll Depth Tracking
    // ============================================

    /** @type {Set} Tracked scroll milestones */
    const trackedMilestones = new Set();

    /**
     * Get current scroll depth percentage
     * @returns {number} Scroll percentage (0-100)
     */
    function getScrollDepth() {
        const windowHeight = window.innerHeight;
        const documentHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Handle edge case where document fits in viewport
        if (documentHeight <= windowHeight) {
            return 100;
        }

        const scrollableHeight = documentHeight - windowHeight;
        return Math.round((scrollTop / scrollableHeight) * 100);
    }

    /**
     * Handle scroll event for depth tracking
     */
    function handleScroll() {
        const depth = getScrollDepth();

        for (const milestone of CONFIG.scrollMilestones) {
            if (depth >= milestone && !trackedMilestones.has(milestone)) {
                trackedMilestones.add(milestone);

                trackEvent('scroll_depth', {
                    depth_percent: milestone,
                    path: window.location.pathname
                });

                debug('Scroll milestone reached:', milestone + '%');
            }
        }
    }

    // Debounced scroll handler
    let scrollTimeout = null;
    function debouncedScrollHandler() {
        if (scrollTimeout) return;
        scrollTimeout = setTimeout(() => {
            scrollTimeout = null;
            handleScroll();
        }, 100);
    }

    // ============================================
    // Auto-tracked Events
    // ============================================

    /**
     * Check if URL is external
     * @param {string} href - URL to check
     * @returns {boolean} True if external
     */
    function isExternalLink(href) {
        try {
            const url = new URL(href, window.location.origin);
            return url.hostname !== window.location.hostname;
        } catch (e) {
            return false;
        }
    }

    /**
     * Check if URL is a PDF
     * @param {string} href - URL to check
     * @returns {boolean} True if PDF
     */
    function isPDFLink(href) {
        return href && href.toLowerCase().endsWith('.pdf');
    }

    /**
     * Handle click events for auto-tracking
     * @param {Event} event - Click event
     */
    function handleClick(event) {
        try {
            // Find closest anchor element
            const link = event.target.closest('a');
            if (!link) return;

            const href = link.href;
            if (!href) return;

            // Track PDF downloads
            if (isPDFLink(href)) {
                const filename = href.split('/').pop() || 'unknown.pdf';
                trackEvent('pdf_download', {
                    url: href,
                    filename,
                    link_text: link.textContent?.trim()?.substring(0, 100)
                });
                debug('PDF download tracked:', filename);
            }

            // Track outbound clicks
            else if (isExternalLink(href)) {
                trackEvent('outbound_click', {
                    url: href,
                    domain: new URL(href).hostname,
                    link_text: link.textContent?.trim()?.substring(0, 100)
                });
                debug('Outbound click tracked:', href);
            }

            // Track CTA clicks (elements with data-track-cta attribute)
            const ctaElement = event.target.closest('[data-track-cta]');
            if (ctaElement) {
                const ctaName = ctaElement.getAttribute('data-track-cta') || 'unnamed';
                trackEvent('cta_click', {
                    cta_name: ctaName,
                    cta_text: ctaElement.textContent?.trim()?.substring(0, 100),
                    url: href || null
                });
                debug('CTA click tracked:', ctaName);
            }
        } catch (e) {
            debug('Error handling click:', e);
        }
    }

    // ============================================
    // Public API
    // ============================================

    /**
     * Public API object exposed as window.tk
     */
    const publicAPI = {
        /**
         * Track a custom event
         * @param {string} eventName - Name of the event
         * @param {object} properties - Custom properties
         */
        track: function(eventName, properties = {}) {
            try {
                if (!eventName || typeof eventName !== 'string') {
                    debug('Invalid event name');
                    return;
                }
                trackEvent(eventName, properties);
            } catch (e) {
                debug('Error in tk.track:', e);
            }
        },

        /**
         * Identify a user (for future use)
         * @param {string} userId - User identifier
         * @param {object} traits - User traits
         */
        identify: function(userId, traits = {}) {
            try {
                if (!userId) {
                    debug('Invalid user ID');
                    return;
                }

                trackEvent('identify', {
                    user_id: userId,
                    ...traits
                });

                debug('User identified:', userId);
            } catch (e) {
                debug('Error in tk.identify:', e);
            }
        },

        /**
         * Get current visitor ID
         * @returns {string} Visitor ID
         */
        getVisitorId: function() {
            return state.visitorId;
        },

        /**
         * Get current session ID
         * @returns {string} Session ID
         */
        getSessionId: function() {
            return state.sessionId;
        },

        /**
         * Force send any queued events
         */
        flush: function() {
            sendBatch(false);
        },

        /**
         * Enable or disable debug mode
         * @param {boolean} enabled - Debug mode enabled
         */
        debug: function(enabled) {
            CONFIG.debug = !!enabled;
        }
    };

    // ============================================
    // State Management
    // ============================================

    /** @type {object} Analytics state */
    const state = {
        visitorId: null,
        sessionId: null,
        visitCount: 0,
        context: null,
        initialized: false
    };

    // ============================================
    // Initialization
    // ============================================

    /**
     * Initialize analytics tracking
     */
    function init() {
        try {
            // Prevent double initialization
            if (state.initialized) {
                debug('Already initialized');
                return;
            }

            debug('Initializing TK Analytics...');

            // Initialize visitor and session
            state.visitorId = getVisitorId();
            state.visitCount = getVisitCount();
            state.sessionId = getSessionId();
            state.context = getDeviceContext();

            debug('Visitor ID:', state.visitorId);
            debug('Session ID:', state.sessionId);
            debug('Visit Count:', state.visitCount);

            // Track initial page view
            trackPageView();

            // Set up event listeners

            // Visibility change for time tracking
            document.addEventListener('visibilitychange', handleVisibilityChange);

            // Start heartbeat
            startHeartbeat();

            // Scroll depth tracking
            window.addEventListener('scroll', debouncedScrollHandler, { passive: true });
            // Check initial scroll position
            handleScroll();

            // Click tracking for outbound links, PDFs, and CTAs
            document.addEventListener('click', handleClick, true);

            // Send data on page unload
            window.addEventListener('pagehide', function() {
                stopHeartbeat();
                sendFinalTimeOnPage();
            });

            // Fallback for older browsers
            window.addEventListener('beforeunload', function() {
                stopHeartbeat();
                sendFinalTimeOnPage();
            });

            // Expose public API
            window.tk = publicAPI;

            state.initialized = true;
            debug('TK Analytics initialized successfully');

        } catch (e) {
            // Never throw - fail silently
            if (CONFIG.debug) {
                console.error('[TK Analytics] Initialization error:', e);
            }
        }
    }

    // ============================================
    // Bootstrap
    // ============================================

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already ready
        init();
    }

})();
