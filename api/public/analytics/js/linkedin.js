/**
 * LinkedIn Traffic Analytics
 * Displays traffic and engagement data from LinkedIn referrals
 */

(function() {
    'use strict';

    // ============================================
    // State
    // ============================================
    let linkedinChart = null;
    let cachedData = null;

    // ============================================
    // Initialize
    // ============================================
    async function init() {
        // Check authentication
        if (!await Reports.checkAuth()) return;

        // Load initial data
        await loadData();

        // Initialize table sorting
        initSorting();

        // Listen for date range changes
        document.addEventListener('dateRangeChanged', loadData);
    }

    // ============================================
    // Data Loading
    // ============================================
    async function loadData() {
        showLoadingState();

        try {
            const response = await Reports.apiGet('/linkedin');

            if (response.success && response.data) {
                cachedData = response.data;
                renderMetrics(response.data);
                renderChart(response.data.chart || []);
                renderPagesTable(response.data.pages || []);
                renderEventsTable(response.data.events || []);
            } else {
                showEmptyState();
            }
        } catch (err) {
            console.error('Failed to load LinkedIn data:', err);
            showErrorState();
        }
    }

    // ============================================
    // Render Functions
    // ============================================
    function renderMetrics(data) {
        // LinkedIn Visitors
        const visitorsEl = document.getElementById('linkedin-visitors');
        if (visitorsEl) {
            visitorsEl.textContent = Reports.formatNumber(data.visitors || 0);
        }
        renderChange('linkedin-visitors-change', data.visitors_change);

        // Pages Viewed
        const pageviewsEl = document.getElementById('linkedin-pageviews');
        if (pageviewsEl) {
            pageviewsEl.textContent = Reports.formatNumber(data.pageviews || 0);
        }
        renderChange('linkedin-pageviews-change', data.pageviews_change);

        // Avg Duration
        const durationEl = document.getElementById('linkedin-duration');
        if (durationEl) {
            durationEl.textContent = Reports.formatDuration(data.avg_duration || 0);
        }
        renderChange('linkedin-duration-change', data.duration_change);

        // Events Triggered
        const eventsEl = document.getElementById('linkedin-events');
        if (eventsEl) {
            eventsEl.textContent = Reports.formatNumber(data.total_events || 0);
        }
        renderChange('linkedin-events-change', data.events_change);
    }

    function renderChange(elementId, change) {
        const el = document.getElementById(elementId);
        if (!el) return;

        if (change === null || change === undefined) {
            el.textContent = '';
            el.className = 'stat-change';
            return;
        }

        const value = parseFloat(change) || 0;
        const sign = value >= 0 ? '+' : '';
        el.textContent = `${sign}${value.toFixed(1)}%`;
        el.className = 'stat-change';

        if (value > 0) {
            el.classList.add('positive');
        } else if (value < 0) {
            el.classList.add('negative');
        } else {
            el.classList.add('neutral');
        }
    }

    function renderChart(chartData) {
        const ctx = document.getElementById('linkedin-chart');
        if (!ctx) return;

        // Destroy existing chart
        if (linkedinChart) {
            linkedinChart.destroy();
        }

        // Handle empty data
        if (!chartData || chartData.length === 0) {
            chartData = generateEmptyChartData();
        }

        linkedinChart = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: chartData.map(d => d.date),
                datasets: [{
                    label: 'LinkedIn Visitors',
                    data: chartData.map(d => d.visitors || d.count || 0),
                    borderColor: '#0A66C2',
                    backgroundColor: 'rgba(10, 102, 194, 0.1)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#0A66C2',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
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
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `Visitors: ${context.raw}`;
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
                            precision: 0
                        }
                    }
                }
            }
        });
    }

    function generateEmptyChartData() {
        const data = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            data.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                visitors: 0
            });
        }
        return data;
    }

    function renderPagesTable(pages) {
        const tbody = document.getElementById('linkedin-pages-tbody');
        if (!tbody) return;

        if (!pages || pages.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="table-empty">No pages visited from LinkedIn</td></tr>';
            return;
        }

        tbody.innerHTML = pages.map(page => `
            <tr>
                <td>
                    <span class="page-path" title="${Reports.escapeHtml(page.path || page.page)}">${Reports.escapeHtml(page.path || page.page)}</span>
                </td>
                <td class="numeric">${Reports.formatNumber(page.views || page.count || 0)}</td>
                <td class="numeric">${Reports.formatDuration(page.avg_duration || page.duration || 0)}</td>
            </tr>
        `).join('');
    }

    function renderEventsTable(events) {
        const tbody = document.getElementById('linkedin-events-tbody');
        if (!tbody) return;

        if (!events || events.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="table-empty">No events from LinkedIn users</td></tr>';
            return;
        }

        tbody.innerHTML = events.map(event => `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        ${Reports.getEventIcon(event.name)}
                        <span title="${Reports.escapeHtml(event.name)}">${Reports.escapeHtml(formatEventName(event.name))}</span>
                    </div>
                </td>
                <td class="numeric">${Reports.formatNumber(event.count || 0)}</td>
                <td class="numeric">${Reports.formatNumber(event.unique_visitors || event.unique || 0)}</td>
            </tr>
        `).join('');
    }

    // ============================================
    // Sorting
    // ============================================
    function initSorting() {
        // Pages table sorting
        Reports.initTableSorting('linkedin-pages-table', (column, order) => {
            if (cachedData && cachedData.pages) {
                const sorted = Reports.sortTableData(cachedData.pages, column, order);
                renderPagesTable(sorted);
            }
        });

        // Events table sorting
        Reports.initTableSorting('linkedin-events-table', (column, order) => {
            if (cachedData && cachedData.events) {
                const sorted = Reports.sortTableData(cachedData.events, column, order);
                renderEventsTable(sorted);
            }
        });
    }

    // ============================================
    // Helper Functions
    // ============================================
    function formatEventName(name) {
        if (!name) return 'Unknown';
        return name
            .replace(/_/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());
    }

    function showLoadingState() {
        const pagesTbody = document.getElementById('linkedin-pages-tbody');
        const eventsTbody = document.getElementById('linkedin-events-tbody');

        if (pagesTbody) {
            pagesTbody.innerHTML = '<tr><td colspan="3" class="table-loading"><span class="visually-hidden">Loading...</span></td></tr>';
        }
        if (eventsTbody) {
            eventsTbody.innerHTML = '<tr><td colspan="3" class="table-loading"><span class="visually-hidden">Loading...</span></td></tr>';
        }
    }

    function showEmptyState() {
        document.getElementById('linkedin-visitors').textContent = '0';
        document.getElementById('linkedin-pageviews').textContent = '0';
        document.getElementById('linkedin-duration').textContent = '0s';
        document.getElementById('linkedin-events').textContent = '0';

        renderPagesTable([]);
        renderEventsTable([]);
        renderChart([]);
    }

    function showErrorState() {
        const pagesTbody = document.getElementById('linkedin-pages-tbody');
        const eventsTbody = document.getElementById('linkedin-events-tbody');

        if (pagesTbody) {
            pagesTbody.innerHTML = '<tr><td colspan="3" class="table-empty" style="color: var(--color-error);">Failed to load data</td></tr>';
        }
        if (eventsTbody) {
            eventsTbody.innerHTML = '<tr><td colspan="3" class="table-empty" style="color: var(--color-error);">Failed to load data</td></tr>';
        }
    }

    // ============================================
    // Initialize on DOM Ready
    // ============================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
