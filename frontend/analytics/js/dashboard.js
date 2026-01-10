/**
 * Analytics Dashboard
 * Main dashboard logic for TPRM Analytics
 */

(function() {
    'use strict';

    // API base URL - relative since dashboard is served from same origin as API
    const API_BASE = '/api';

    // State management
    const state = {
        user: null,
        dateRange: {
            preset: '7d',
            start: null,
            end: null
        },
        realtimeCount: 0,
        chart: null,
        realtimeInterval: null
    };

    // DOM Elements cache
    let elements = {};

    /**
     * Initialize the dashboard
     */
    async function init() {
        cacheElements();
        setupEventListeners();

        // Check authentication first
        const isAuthenticated = await checkAuth();
        if (!isAuthenticated) {
            window.location.href = 'login.html';
            return;
        }

        // Set default date range
        setDefaultDateRange();

        // Initialize Flatpickr for custom date range
        initializeDatePickers();

        // Load dashboard data
        await loadDashboardData();

        // Start real-time polling
        startRealtimePolling();

        // Hide loading overlay
        hideLoading();
    }

    /**
     * Cache DOM elements
     */
    function cacheElements() {
        elements = {
            // Loading/Error
            loadingOverlay: document.getElementById('loading-overlay'),
            errorMessage: document.getElementById('error-message'),
            errorText: document.getElementById('error-text'),
            retryButton: document.getElementById('retry-button'),

            // Sidebar
            sidebar: document.getElementById('sidebar'),
            sidebarOverlay: document.getElementById('sidebar-overlay'),
            sidebarClose: document.getElementById('sidebar-close'),
            menuToggle: document.getElementById('menu-toggle'),
            logoutLink: document.getElementById('logout-link'),

            // Date Picker
            datePickerContainer: document.querySelector('.date-picker-container'),
            datePickerTrigger: document.getElementById('date-picker-trigger'),
            datePickerDropdown: document.getElementById('date-picker-dropdown'),
            dateRangeDisplay: document.getElementById('date-range-display'),
            datePresets: document.querySelectorAll('.date-preset'),
            customDateRange: document.getElementById('custom-date-range'),
            dateStart: document.getElementById('date-start'),
            dateEnd: document.getElementById('date-end'),
            applyCustomDate: document.getElementById('apply-custom-date'),

            // User Menu
            userMenuContainer: document.querySelector('.user-menu-container'),
            userMenuTrigger: document.getElementById('user-menu-trigger'),
            userMenuDropdown: document.getElementById('user-menu-dropdown'),
            userAvatar: document.getElementById('user-avatar'),
            userName: document.getElementById('user-name'),
            userLogout: document.getElementById('user-logout'),

            // Metrics
            visitorsValue: document.getElementById('visitors-value'),
            visitorsChange: document.getElementById('visitors-change'),
            sessionsValue: document.getElementById('sessions-value'),
            sessionsChange: document.getElementById('sessions-change'),
            pageviewsValue: document.getElementById('pageviews-value'),
            pageviewsChange: document.getElementById('pageviews-change'),
            durationValue: document.getElementById('duration-value'),
            durationChange: document.getElementById('duration-change'),
            bounceValue: document.getElementById('bounce-value'),
            bounceChange: document.getElementById('bounce-change'),

            // Chart
            visitorsChart: document.getElementById('visitors-chart'),

            // Tables
            topPagesBody: document.getElementById('top-pages-body'),
            topReferrersBody: document.getElementById('top-referrers-body'),
            topEventsBody: document.getElementById('top-events-body'),

            // Realtime
            realtimeBadge: document.getElementById('realtime-badge'),
            realtimeIndicator: document.getElementById('realtime-indicator'),
            realtimeCount: document.getElementById('realtime-count')
        };
    }

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Mobile menu toggle
        elements.menuToggle?.addEventListener('click', toggleSidebar);
        elements.sidebarClose?.addEventListener('click', closeSidebar);
        elements.sidebarOverlay?.addEventListener('click', closeSidebar);

        // Date picker
        elements.datePickerTrigger?.addEventListener('click', toggleDatePicker);
        elements.datePresets?.forEach(preset => {
            preset.addEventListener('click', handleDatePresetClick);
        });
        elements.applyCustomDate?.addEventListener('click', applyCustomDateRange);

        // User menu
        elements.userMenuTrigger?.addEventListener('click', toggleUserMenu);

        // Logout handlers
        elements.logoutLink?.addEventListener('click', handleLogout);
        elements.userLogout?.addEventListener('click', handleLogout);

        // Retry button
        elements.retryButton?.addEventListener('click', retryLoadData);

        // Close dropdowns on outside click
        document.addEventListener('click', handleOutsideClick);

        // Close dropdowns on escape
        document.addEventListener('keydown', handleEscapeKey);
    }

    /**
     * Check if user is authenticated
     */
    async function checkAuth() {
        try {
            const response = await fetch(`${API_BASE}/auth/me`, {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                return false;
            }

            const data = await response.json();
            state.user = data.user;
            updateUserDisplay();
            return true;
        } catch (error) {
            console.error('Auth check failed:', error);
            return false;
        }
    }

    /**
     * Update user display in UI
     */
    function updateUserDisplay() {
        if (!state.user) return;

        const initial = state.user.username.charAt(0).toUpperCase();
        if (elements.userAvatar) {
            elements.userAvatar.textContent = initial;
        }
        if (elements.userName) {
            elements.userName.textContent = state.user.username;
        }
    }

    /**
     * Set default date range (last 7 days)
     */
    function setDefaultDateRange() {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 7);

        state.dateRange.start = start;
        state.dateRange.end = end;
        state.dateRange.preset = '7d';
    }

    /**
     * Initialize Flatpickr date pickers
     */
    function initializeDatePickers() {
        if (typeof flatpickr === 'undefined') return;

        const config = {
            dateFormat: 'Y-m-d',
            maxDate: 'today'
        };

        if (elements.dateStart) {
            flatpickr(elements.dateStart, config);
        }
        if (elements.dateEnd) {
            flatpickr(elements.dateEnd, config);
        }
    }

    /**
     * Load all dashboard data
     */
    async function loadDashboardData() {
        try {
            showLoading();
            hideError();

            const params = getDateParams();
            const overview = await fetchOverview(params);

            // Handle API response format: {success: true, data: {...}}
            const data = overview.data || overview;

            renderMetrics(data);
            renderChart(data.chart_data);
            renderTopPages(data.top_pages || []);
            renderTopReferrers(data.top_referrers || []);

            // Fetch and render events separately
            const eventsData = await fetchTopEvents(params);
            renderTopEvents(eventsData.data?.events || []);

        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            showError('Unable to load analytics data. Please try again.');
        } finally {
            hideLoading();
        }
    }

    /**
     * Get date parameters for API calls
     */
    function getDateParams() {
        const params = new URLSearchParams();

        if (state.dateRange.start) {
            params.append('start', formatDate(state.dateRange.start));
        }
        if (state.dateRange.end) {
            params.append('end', formatDate(state.dateRange.end));
        }

        return params.toString();
    }

    /**
     * Format date to YYYY-MM-DD
     */
    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    /**
     * Fetch overview data
     */
    async function fetchOverview(params) {
        const response = await fetch(`${API_BASE}/analytics/dashboard/overview?${params}`, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch overview');
        }

        return response.json();
    }

    /**
     * Fetch top pages
     */
    async function fetchTopPages(params) {
        const response = await fetch(`${API_BASE}/analytics/dashboard/pages?${params}&limit=5`, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch top pages');
        }

        return response.json();
    }

    /**
     * Fetch top referrers
     */
    async function fetchTopReferrers(params) {
        const response = await fetch(`${API_BASE}/analytics/dashboard/referrers?${params}&limit=5`, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch top referrers');
        }

        return response.json();
    }

    /**
     * Fetch top events
     */
    async function fetchTopEvents(params) {
        const response = await fetch(`${API_BASE}/analytics/dashboard/events?${params}`, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch top events');
        }

        return response.json();
    }

    /**
     * Render metrics cards
     */
    function renderMetrics(data) {
        // API returns nested objects: {visitors: {value: X, change: Y}, ...}
        // Extract value and change from each metric object
        const getMetricValue = (metric) => {
            if (metric && typeof metric === 'object') {
                return metric.value || 0;
            }
            return metric || 0;
        };

        const getMetricChange = (metric) => {
            if (metric && typeof metric === 'object') {
                return metric.change || 0;
            }
            return 0;
        };

        // Visitors
        if (elements.visitorsValue) {
            elements.visitorsValue.textContent = formatNumber(getMetricValue(data.visitors));
        }
        renderChange(elements.visitorsChange, getMetricChange(data.visitors));

        // Sessions
        if (elements.sessionsValue) {
            elements.sessionsValue.textContent = formatNumber(getMetricValue(data.sessions));
        }
        renderChange(elements.sessionsChange, getMetricChange(data.sessions));

        // Page Views
        if (elements.pageviewsValue) {
            elements.pageviewsValue.textContent = formatNumber(getMetricValue(data.page_views));
        }
        renderChange(elements.pageviewsChange, getMetricChange(data.page_views));

        // Avg Duration
        if (elements.durationValue) {
            elements.durationValue.textContent = formatDuration(getMetricValue(data.avg_duration));
        }
        renderChange(elements.durationChange, getMetricChange(data.avg_duration));

        // Bounce Rate
        if (elements.bounceValue) {
            elements.bounceValue.textContent = formatPercent(getMetricValue(data.bounce_rate));
        }
        renderChange(elements.bounceChange, getMetricChange(data.bounce_rate), true);
    }

    /**
     * Render change indicator
     */
    function renderChange(element, change, invertColors = false) {
        if (!element) return;

        const value = parseFloat(change) || 0;
        const isPositive = invertColors ? value < 0 : value > 0;
        const isNegative = invertColors ? value > 0 : value < 0;

        element.textContent = (value >= 0 ? '+' : '') + value.toFixed(1) + '%';
        element.className = 'metric-change';

        if (value === 0) {
            element.classList.add('neutral');
        } else if (isPositive) {
            element.classList.add('positive');
        } else if (isNegative) {
            element.classList.add('negative');
        }
    }

    /**
     * Render visitors chart
     */
    function renderChart(chartData) {
        if (!elements.visitorsChart || typeof Chart === 'undefined') return;

        const ctx = elements.visitorsChart.getContext('2d');

        // Destroy existing chart
        if (state.chart) {
            state.chart.destroy();
        }

        // Default data if none provided
        const labels = chartData?.labels || generateDefaultLabels();
        const data = chartData?.data || generateDefaultData(labels.length);

        state.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Visitors',
                    data: data,
                    borderColor: '#4A90E2',
                    backgroundColor: 'rgba(74, 144, 226, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#4A90E2',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#1D3557',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#4C607B',
                            font: {
                                size: 11
                            },
                            maxTicksLimit: 7
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#E5E7EB',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#4C607B',
                            font: {
                                size: 11
                            },
                            callback: function(value) {
                                return formatNumber(value);
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Generate default chart labels (last 7 days)
     */
    function generateDefaultLabels() {
        const labels = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }

        return labels;
    }

    /**
     * Generate default chart data (zeros)
     */
    function generateDefaultData(length) {
        return Array(length).fill(0);
    }

    /**
     * Render top pages table
     */
    function renderTopPages(pages) {
        if (!elements.topPagesBody) return;

        if (!pages || pages.length === 0) {
            elements.topPagesBody.innerHTML = `
                <tr>
                    <td colspan="3" class="empty-state">
                        <p>No page data available</p>
                    </td>
                </tr>
            `;
            return;
        }

        elements.topPagesBody.innerHTML = pages.map(page => `
            <tr>
                <td class="page-path" title="${escapeHtml(page.path)}">${escapeHtml(page.path)}</td>
                <td class="text-right">${formatNumber(page.views)}</td>
                <td class="text-right">${formatNumber(page.unique || page.unique_views || 0)}</td>
            </tr>
        `).join('');
    }

    /**
     * Render top referrers table
     */
    function renderTopReferrers(referrers) {
        if (!elements.topReferrersBody) return;

        if (!referrers || referrers.length === 0) {
            elements.topReferrersBody.innerHTML = `
                <tr>
                    <td colspan="3" class="empty-state">
                        <p>No referrer data available</p>
                    </td>
                </tr>
            `;
            return;
        }

        elements.topReferrersBody.innerHTML = referrers.map(ref => `
            <tr>
                <td>${escapeHtml(ref.domain || ref.source || 'Direct')}</td>
                <td><span class="referrer-badge referrer-badge--${ref.type || 'direct'}">${ref.type || 'Direct'}</span></td>
                <td class="text-right">${formatNumber(ref.visits)}</td>
            </tr>
        `).join('');
    }

    /**
     * Render top events table
     */
    function renderTopEvents(events) {
        if (!elements.topEventsBody) return;

        if (!events || events.length === 0) {
            elements.topEventsBody.innerHTML = `
                <tr>
                    <td colspan="3" class="empty-state">
                        <p>No event data available</p>
                    </td>
                </tr>
            `;
            return;
        }

        // Take only top 5 events for dashboard view
        const topEvents = events.slice(0, 5);

        elements.topEventsBody.innerHTML = topEvents.map(event => `
            <tr>
                <td class="event-name" title="${escapeHtml(event.name)}">${escapeHtml(formatEventName(event.name))}</td>
                <td class="text-right">${formatNumber(event.count)}</td>
                <td class="text-right">${formatNumber(event.unique_visitors)}</td>
            </tr>
        `).join('');
    }

    /**
     * Format event name for display (convert snake_case to Title Case)
     */
    function formatEventName(name) {
        if (!name) return 'Unknown';
        return name
            .replace(/_/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());
    }

    /**
     * Start real-time polling
     */
    function startRealtimePolling() {
        fetchRealtimeData();
        state.realtimeInterval = setInterval(fetchRealtimeData, 30000);
    }

    /**
     * Stop real-time polling
     */
    function stopRealtimePolling() {
        if (state.realtimeInterval) {
            clearInterval(state.realtimeInterval);
            state.realtimeInterval = null;
        }
    }

    /**
     * Fetch real-time visitor data
     */
    async function fetchRealtimeData() {
        try {
            const response = await fetch(`${API_BASE}/analytics/dashboard/realtime`, {
                credentials: 'include'
            });

            if (!response.ok) return;

            const result = await response.json();
            // API returns { success: true, data: { active_visitors: N } }
            state.realtimeCount = result.data?.active_visitors || 0;
            updateRealtimeDisplay();
        } catch (error) {
            console.error('Failed to fetch realtime data:', error);
        }
    }

    /**
     * Update real-time display
     */
    function updateRealtimeDisplay() {
        if (elements.realtimeCount) {
            elements.realtimeCount.textContent = state.realtimeCount;
        }
        if (elements.realtimeBadge) {
            elements.realtimeBadge.textContent = state.realtimeCount;
        }
    }

    /**
     * Toggle sidebar (mobile)
     */
    function toggleSidebar() {
        elements.sidebar?.classList.toggle('open');
        elements.sidebarOverlay?.classList.toggle('active');
    }

    /**
     * Close sidebar (mobile)
     */
    function closeSidebar() {
        elements.sidebar?.classList.remove('open');
        elements.sidebarOverlay?.classList.remove('active');
    }

    /**
     * Toggle date picker dropdown
     */
    function toggleDatePicker(e) {
        e.stopPropagation();
        elements.datePickerContainer?.classList.toggle('open');
        elements.userMenuContainer?.classList.remove('open');
    }

    /**
     * Toggle user menu dropdown
     */
    function toggleUserMenu(e) {
        e.stopPropagation();
        elements.userMenuContainer?.classList.toggle('open');
        elements.datePickerContainer?.classList.remove('open');
    }

    /**
     * Handle date preset click
     */
    function handleDatePresetClick(e) {
        const range = e.target.dataset.range;

        // Update active state
        elements.datePresets?.forEach(preset => {
            preset.classList.remove('active');
        });
        e.target.classList.add('active');

        // Handle custom range
        if (range === 'custom') {
            elements.customDateRange?.classList.add('visible');
            return;
        }

        // Hide custom range
        elements.customDateRange?.classList.remove('visible');

        // Calculate date range
        const end = new Date();
        const start = new Date();

        switch (range) {
            case 'today':
                // start and end are same
                break;
            case 'yesterday':
                start.setDate(start.getDate() - 1);
                end.setDate(end.getDate() - 1);
                break;
            case '7d':
                start.setDate(start.getDate() - 7);
                break;
            case '30d':
                start.setDate(start.getDate() - 30);
                break;
        }

        state.dateRange.start = start;
        state.dateRange.end = end;
        state.dateRange.preset = range;

        // Update display
        updateDateRangeDisplay();

        // Close dropdown
        elements.datePickerContainer?.classList.remove('open');

        // Reload data
        loadDashboardData();
    }

    /**
     * Apply custom date range
     */
    function applyCustomDateRange() {
        const startValue = elements.dateStart?.value;
        const endValue = elements.dateEnd?.value;

        if (!startValue || !endValue) {
            return;
        }

        state.dateRange.start = new Date(startValue);
        state.dateRange.end = new Date(endValue);
        state.dateRange.preset = 'custom';

        updateDateRangeDisplay();
        elements.datePickerContainer?.classList.remove('open');
        loadDashboardData();
    }

    /**
     * Update date range display text
     */
    function updateDateRangeDisplay() {
        if (!elements.dateRangeDisplay) return;

        const presetLabels = {
            'today': 'Today',
            'yesterday': 'Yesterday',
            '7d': 'Last 7 Days',
            '30d': 'Last 30 Days'
        };

        if (presetLabels[state.dateRange.preset]) {
            elements.dateRangeDisplay.textContent = presetLabels[state.dateRange.preset];
        } else {
            const start = state.dateRange.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const end = state.dateRange.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            elements.dateRangeDisplay.textContent = `${start} - ${end}`;
        }
    }

    /**
     * Handle logout
     */
    async function handleLogout(e) {
        e.preventDefault();

        try {
            await fetch(`${API_BASE}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Logout error:', error);
        }

        stopRealtimePolling();
        window.location.href = 'login.html';
    }

    /**
     * Handle outside click to close dropdowns
     */
    function handleOutsideClick(e) {
        if (!elements.datePickerContainer?.contains(e.target)) {
            elements.datePickerContainer?.classList.remove('open');
        }
        if (!elements.userMenuContainer?.contains(e.target)) {
            elements.userMenuContainer?.classList.remove('open');
        }
    }

    /**
     * Handle escape key to close dropdowns
     */
    function handleEscapeKey(e) {
        if (e.key === 'Escape') {
            elements.datePickerContainer?.classList.remove('open');
            elements.userMenuContainer?.classList.remove('open');
            closeSidebar();
        }
    }

    /**
     * Retry loading data
     */
    function retryLoadData() {
        hideError();
        loadDashboardData();
    }

    /**
     * Show loading overlay
     */
    function showLoading() {
        elements.loadingOverlay?.classList.remove('hidden');
    }

    /**
     * Hide loading overlay
     */
    function hideLoading() {
        elements.loadingOverlay?.classList.add('hidden');
    }

    /**
     * Show error message
     */
    function showError(message) {
        if (elements.errorText) {
            elements.errorText.textContent = message;
        }
        elements.errorMessage?.classList.add('visible');
    }

    /**
     * Hide error message
     */
    function hideError() {
        elements.errorMessage?.classList.remove('visible');
    }

    /**
     * Format number with commas
     */
    function formatNumber(num) {
        if (num === null || num === undefined) return '0';
        return num.toLocaleString('en-US');
    }

    /**
     * Format duration in seconds to Xm Ys
     */
    function formatDuration(seconds) {
        if (!seconds || seconds <= 0) return '0s';

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        if (minutes === 0) {
            return `${remainingSeconds}s`;
        }

        return `${minutes}m ${remainingSeconds}s`;
    }

    /**
     * Format percentage
     */
    function formatPercent(value) {
        if (value === null || value === undefined) return '0%';
        return value.toFixed(1) + '%';
    }

    /**
     * Escape HTML to prevent XSS
     */
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
