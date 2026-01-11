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

            // Geo
            geoMap: document.getElementById('geo-map'),
            geoTableBody: document.getElementById('geo-table-body'),

            // Realtime
            realtimeBadge: document.getElementById('realtime-badge'),
            realtimeIndicator: document.getElementById('realtime-indicator'),
            realtimeCount: document.getElementById('realtime-count'),

            // Realtime Preview
            realtimeVisitors: document.getElementById('realtime-visitors'),
            realtimePages: document.getElementById('realtime-pages')
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
            maxDate: 'today',
            static: true,
            position: 'below',
            disableMobile: true
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

            // Fetch and render geo data
            const geoData = await fetchGeoData(params);
            renderGeoMap(geoData.data?.countries || []);
            renderGeoTable(geoData.data?.countries || []);

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
     * Fetch geographic data
     */
    async function fetchGeoData(params) {
        const response = await fetch(`${API_BASE}/analytics/dashboard/geo?${params}`, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch geo data');
        }

        return response.json();
    }

    // Cache for world map data
    let cachedWorldData = null;

    /**
     * Render geographic map using D3
     */
    async function renderGeoMap(countries) {
        if (!elements.geoMap) return;

        // Check if D3 and topojson are loaded
        if (typeof d3 === 'undefined' || typeof topojson === 'undefined') {
            console.error('D3 or TopoJSON not loaded');
            elements.geoMap.innerHTML = '<p class="empty-state">Map libraries not loaded</p>';
            return;
        }

        // Clear existing content
        elements.geoMap.innerHTML = '';

        // Create visitor lookup by country code
        const visitorsByCode = {};
        let maxVisitors = 0;
        (countries || []).forEach(c => {
            if (c.country_code) {
                visitorsByCode[c.country_code] = c.visitors;
                maxVisitors = Math.max(maxVisitors, c.visitors);
            }
        });

        // Wait a tick for layout to settle
        await new Promise(resolve => requestAnimationFrame(resolve));

        // Set up dimensions - use getBoundingClientRect for more reliable measurements
        const container = elements.geoMap;
        const rect = container.getBoundingClientRect();
        const width = rect.width || 400;
        const height = rect.height || 200;

        // If container has no dimensions, show placeholder
        if (width < 50 || height < 50) {
            elements.geoMap.innerHTML = '<p class="empty-state">Loading map...</p>';
            // Retry after a short delay
            setTimeout(() => renderGeoMap(countries), 500);
            return;
        }

        // Create SVG
        const svg = d3.select(container)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');

        // Create projection - adjusted for better fit
        const projection = d3.geoNaturalEarth1()
            .scale(width / 5)
            .translate([width / 2, height / 2]);

        const path = d3.geoPath().projection(projection);

        // Color scale
        const colorScale = d3.scaleThreshold()
            .domain([1, 5, 20, 50])
            .range(['#E5E7EB', '#93C5FD', '#60A5FA', '#2563EB', '#1D4ED8']);

        // Load world map data (with caching and fallback CDNs)
        try {
            if (!cachedWorldData) {
                // Try multiple CDNs in case one fails
                const cdnUrls = [
                    'https://unpkg.com/world-atlas@2.0.2/countries-110m.json',
                    'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json',
                    'https://raw.githubusercontent.com/topojson/world-atlas/master/countries-110m.json'
                ];

                for (const url of cdnUrls) {
                    try {
                        cachedWorldData = await d3.json(url);
                        if (cachedWorldData) break;
                    } catch (e) {
                        console.warn(`Failed to load from ${url}:`, e.message);
                    }
                }

                if (!cachedWorldData) {
                    throw new Error('All CDN sources failed');
                }
            }

            const worldData = cachedWorldData;
            const countries110m = topojson.feature(worldData, worldData.objects.countries);

            // Country code lookup (numeric ID to ISO)
            const numericToIso = await loadCountryCodeMapping();

            // Draw countries
            svg.selectAll('path')
                .data(countries110m.features)
                .enter()
                .append('path')
                .attr('d', path)
                .attr('class', 'country')
                .attr('fill', d => {
                    const isoCode = numericToIso[d.id];
                    const visitors = visitorsByCode[isoCode] || 0;
                    return colorScale(visitors);
                })
                .attr('stroke', '#fff')
                .attr('stroke-width', 0.5)
                .on('mouseover', function(event, d) {
                    const isoCode = numericToIso[d.id];
                    const visitors = visitorsByCode[isoCode] || 0;
                    d3.select(this).attr('fill', '#FCD34D');

                    // Show tooltip
                    const countryName = d.properties?.name || isoCode || 'Unknown';
                    showGeoTooltip(event, countryName, visitors);
                })
                .on('mouseout', function(event, d) {
                    const isoCode = numericToIso[d.id];
                    const visitors = visitorsByCode[isoCode] || 0;
                    d3.select(this).attr('fill', colorScale(visitors));
                    hideGeoTooltip();
                });

        } catch (error) {
            console.error('Failed to load map data:', error);
            // Fallback: show a simple bar visualization instead
            renderGeoBarChart(countries);
        }
    }

    /**
     * Fallback bar chart visualization for geo data
     */
    function renderGeoBarChart(countries) {
        if (!elements.geoMap) return;

        const topCountries = (countries || []).slice(0, 8);
        if (topCountries.length === 0) {
            elements.geoMap.innerHTML = '<div class="empty-state" style="padding: 20px; text-align: center;"><p>No geographic data</p></div>';
            return;
        }

        const maxVisitors = Math.max(...topCountries.map(c => c.visitors));

        const barsHtml = topCountries.map(country => {
            const percentage = (country.visitors / maxVisitors) * 100;
            const flagUrl = country.country_code
                ? `https://flagcdn.com/w20/${country.country_code.toLowerCase()}.png`
                : null;

            return `
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    ${flagUrl ? `<img src="${flagUrl}" alt="" style="width: 20px; height: 14px; border-radius: 2px;" onerror="this.style.display='none'">` : '<span style="width: 20px;"></span>'}
                    <span style="width: 60px; font-size: 12px; color: #4C607B; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(country.country)}</span>
                    <div style="flex: 1; height: 20px; background: #E5E7EB; border-radius: 4px; overflow: hidden;">
                        <div style="width: ${percentage}%; height: 100%; background: linear-gradient(90deg, #4A90E2, #60A5FA); border-radius: 4px;"></div>
                    </div>
                    <span style="width: 40px; text-align: right; font-size: 12px; font-weight: 600; color: #1D3557;">${formatNumber(country.visitors)}</span>
                </div>
            `;
        }).join('');

        elements.geoMap.innerHTML = `
            <div style="padding: 12px;">
                <div style="font-size: 11px; color: #4C607B; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Top Countries by Visitors</div>
                ${barsHtml}
            </div>
        `;
    }

    /**
     * Load country code mapping (numeric to ISO)
     */
    async function loadCountryCodeMapping() {
        // Common country numeric IDs to ISO codes
        return {
            '840': 'US', '826': 'GB', '124': 'CA', '36': 'AU', '276': 'DE',
            '250': 'FR', '356': 'IN', '566': 'NG', '380': 'IT', '724': 'ES',
            '76': 'BR', '484': 'MX', '392': 'JP', '156': 'CN', '410': 'KR',
            '528': 'NL', '752': 'SE', '578': 'NO', '208': 'DK', '246': 'FI',
            '616': 'PL', '643': 'RU', '804': 'UA', '642': 'RO', '682': 'SA',
            '784': 'AE', '376': 'IL', '710': 'ZA', '702': 'SG', '608': 'PH',
            '360': 'ID', '458': 'MY', '764': 'TH', '704': 'VN', '586': 'PK',
            '50': 'BD', '32': 'AR', '152': 'CL', '170': 'CO', '604': 'PE',
            '372': 'IE', '56': 'BE', '756': 'CH', '40': 'AT', '620': 'PT',
            '300': 'GR', '203': 'CZ', '348': 'HU', '554': 'NZ'
        };
    }

    /**
     * Show geo tooltip
     */
    function showGeoTooltip(event, countryName, visitors) {
        let tooltip = document.getElementById('geo-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'geo-tooltip';
            tooltip.style.cssText = `
                position: fixed;
                background: #1D3557;
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                pointer-events: none;
                z-index: 1000;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            `;
            document.body.appendChild(tooltip);
        }
        tooltip.innerHTML = `<strong>${countryName}</strong><br>${visitors} visitor${visitors !== 1 ? 's' : ''}`;
        tooltip.style.left = (event.pageX + 10) + 'px';
        tooltip.style.top = (event.pageY - 30) + 'px';
        tooltip.style.display = 'block';
    }

    /**
     * Hide geo tooltip
     */
    function hideGeoTooltip() {
        const tooltip = document.getElementById('geo-tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }

    /**
     * Render geo table
     */
    function renderGeoTable(countries) {
        if (!elements.geoTableBody) return;

        if (!countries || countries.length === 0) {
            elements.geoTableBody.innerHTML = `
                <tr>
                    <td colspan="3" class="empty-state">
                        <p>No geographic data available</p>
                    </td>
                </tr>
            `;
            return;
        }

        // Calculate max for bar width
        const maxVisitors = Math.max(...countries.map(c => c.visitors));

        elements.geoTableBody.innerHTML = countries.slice(0, 10).map(country => {
            const flagUrl = country.country_code
                ? `https://flagcdn.com/w20/${country.country_code.toLowerCase()}.png`
                : null;

            return `
                <tr>
                    <td>
                        <span class="country-name">
                            ${flagUrl ? `<img src="${flagUrl}" alt="" class="country-flag" onerror="this.style.display='none'">` : ''}
                            ${escapeHtml(country.country)}
                        </span>
                    </td>
                    <td class="text-right">${formatNumber(country.visitors)}</td>
                </tr>
            `;
        }).join('');
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
        const dailyData = chartData?.data || generateDefaultData(labels.length);

        // Convert to cumulative data for growth visualization
        const cumulativeData = [];
        let runningTotal = 0;
        for (const value of dailyData) {
            runningTotal += value;
            cumulativeData.push(runningTotal);
        }

        // Calculate trendline using linear regression
        const trendlineData = calculateTrendline(cumulativeData);

        state.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Total Visitors',
                        data: cumulativeData,
                        borderColor: '#4A90E2',
                        backgroundColor: createGradient(ctx, '#4A90E2'),
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: '#4A90E2',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: '#4A90E2',
                        pointHoverBorderColor: '#fff',
                        pointHoverBorderWidth: 2
                    },
                    {
                        label: 'Trend',
                        data: trendlineData,
                        borderColor: '#E74C3C',
                        borderWidth: 2,
                        borderDash: [6, 4],
                        fill: false,
                        tension: 0,
                        pointRadius: 0,
                        pointHoverRadius: 0
                    }
                ]
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
                        display: true,
                        position: 'top',
                        align: 'end',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'line',
                            boxWidth: 30,
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1D3557',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                if (context.dataset.label === 'Trend') {
                                    return null; // Hide trend from tooltip
                                }
                                return `${context.dataset.label}: ${formatNumber(context.parsed.y)}`;
                            }
                        }
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
     * Create gradient for chart fill
     */
    function createGradient(ctx, color) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 280);
        gradient.addColorStop(0, color + '40'); // 25% opacity at top
        gradient.addColorStop(1, color + '05'); // 2% opacity at bottom
        return gradient;
    }

    /**
     * Calculate trendline using linear regression
     */
    function calculateTrendline(data) {
        const n = data.length;
        if (n < 2) return data;

        // Calculate sums for linear regression
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
        for (let i = 0; i < n; i++) {
            sumX += i;
            sumY += data[i];
            sumXY += i * data[i];
            sumX2 += i * i;
        }

        // Calculate slope and intercept
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        // Generate trendline points
        const trendline = [];
        for (let i = 0; i < n; i++) {
            trendline.push(Math.max(0, slope * i + intercept));
        }

        return trendline;
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
            // API returns { success: true, data: { active_visitors: N, pages_viewing: [...] } }
            state.realtimeCount = result.data?.active_visitors || 0;
            updateRealtimeDisplay();
            updateRealtimePreview(result.data);
        } catch (error) {
            console.error('Failed to fetch realtime data:', error);
        }
    }

    /**
     * Update realtime preview section
     */
    function updateRealtimePreview(data) {
        // Update visitor count
        if (elements.realtimeVisitors) {
            elements.realtimeVisitors.textContent = data?.active_visitors || 0;
        }

        // Update pages being viewed
        if (elements.realtimePages) {
            const pages = data?.pages_viewing || [];

            if (pages.length === 0) {
                elements.realtimePages.innerHTML = `
                    <div class="realtime-page-item">
                        <span class="realtime-page-path" style="opacity: 0.6;">No active pages</span>
                    </div>
                `;
            } else {
                elements.realtimePages.innerHTML = pages.slice(0, 5).map(page => `
                    <div class="realtime-page-item">
                        <span class="realtime-page-dot"></span>
                        <span class="realtime-page-path" title="${escapeHtml(page.path)}">${escapeHtml(page.path)}</span>
                        ${page.visitors > 1 ? `<span class="realtime-page-count">(${page.visitors})</span>` : ''}
                    </div>
                `).join('');
            }
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
