/**
 * Shared Reports JavaScript
 * Common functionality for analytics dashboard report pages
 */

(function() {
    'use strict';

    // ============================================
    // API Configuration
    // ============================================
    // API base URL - relative since dashboard is served from same origin as API
    const API_BASE = '/api';

    // ============================================
    // Global State
    // ============================================
    const state = {
        currentPage: 1,
        pageSize: 25,
        sortBy: null,
        sortOrder: 'desc',
        filters: {},
        dateRange: {
            start: null,
            end: null
        }
    };

    // ============================================
    // Auth Check
    // ============================================
    async function checkAuth() {
        try {
            const response = await fetch(`${API_BASE}/auth/me`, {
                credentials: 'include'
            });

            if (!response.ok) {
                window.location.href = 'login.html';
                return false;
            }
            return true;
        } catch (err) {
            console.error('Auth check failed:', err);
            window.location.href = 'login.html';
            return false;
        }
    }

    // ============================================
    // API Helpers
    // ============================================
    async function apiGet(endpoint, params = {}) {
        const url = new URL(`${API_BASE}/analytics/dashboard${endpoint}`, window.location.origin);

        // Ensure date range is initialized (fallback to last 7 days if not set)
        if (!state.dateRange.start || !state.dateRange.end) {
            const end = new Date();
            const start = new Date();
            start.setDate(start.getDate() - 7);
            state.dateRange.start = formatDate(start);
            state.dateRange.end = formatDate(end);
            console.log('[Reports] Date range auto-initialized:', state.dateRange);
        }

        console.log('[Reports] apiGet called:', endpoint, 'dateRange:', state.dateRange);

        // Add date range params
        url.searchParams.set('start_date', state.dateRange.start);
        url.searchParams.set('end_date', state.dateRange.end);

        // Add additional params
        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                url.searchParams.set(key, value);
            }
        });

        const response = await fetch(url.toString(), {
            credentials: 'include'
        });

        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = 'login.html';
                throw new Error('Unauthorized');
            }
            throw new Error(`API error: ${response.status}`);
        }

        return response.json();
    }

    async function apiPost(endpoint, data = {}) {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'include'
        });

        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = 'login.html';
                throw new Error('Unauthorized');
            }
            const error = await response.json();
            throw new Error(error.error || `API error: ${response.status}`);
        }

        return response.json();
    }

    // ============================================
    // Date Range Helpers
    // ============================================
    function initDateRange() {
        console.log('[Reports] initDateRange called');
        const startInput = document.getElementById('date-start');
        const endInput = document.getElementById('date-end');

        if (!startInput || !endInput) {
            console.log('[Reports] Date inputs not found, skipping');
            return;
        }

        // Set default dates (last 7 days)
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 7);

        state.dateRange.start = formatDate(start);
        state.dateRange.end = formatDate(end);

        console.log('[Reports] Date range set:', state.dateRange);

        startInput.value = state.dateRange.start;
        endInput.value = state.dateRange.end;

        // Listen for changes
        startInput.addEventListener('change', () => {
            state.dateRange.start = startInput.value;
            triggerRefresh();
        });

        endInput.addEventListener('change', () => {
            state.dateRange.end = endInput.value;
            triggerRefresh();
        });
    }

    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    function triggerRefresh() {
        const event = new CustomEvent('dateRangeChanged', {
            detail: state.dateRange
        });
        document.dispatchEvent(event);
    }

    // ============================================
    // Table Sorting
    // ============================================
    function initTableSorting(tableId, onSort) {
        const table = document.getElementById(tableId);
        if (!table) return;

        const headers = table.querySelectorAll('th.sortable');
        headers.forEach(header => {
            header.addEventListener('click', () => {
                const column = header.dataset.column;

                // Toggle sort order if same column
                if (state.sortBy === column) {
                    state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
                } else {
                    state.sortBy = column;
                    state.sortOrder = 'desc';
                }

                // Update header styles
                headers.forEach(h => {
                    h.classList.remove('sorted');
                    const icon = h.querySelector('.sort-icon');
                    if (icon) icon.textContent = '\u2195';
                });

                header.classList.add('sorted');
                const icon = header.querySelector('.sort-icon');
                if (icon) {
                    icon.textContent = state.sortOrder === 'asc' ? '\u2191' : '\u2193';
                }

                // Trigger callback
                if (typeof onSort === 'function') {
                    onSort(column, state.sortOrder);
                }
            });
        });
    }

    // Client-side sorting for already-loaded data
    function sortTableData(data, column, order) {
        return [...data].sort((a, b) => {
            let valA = a[column];
            let valB = b[column];

            // Handle nulls
            if (valA === null || valA === undefined) valA = '';
            if (valB === null || valB === undefined) valB = '';

            // Numeric comparison
            if (typeof valA === 'number' && typeof valB === 'number') {
                return order === 'asc' ? valA - valB : valB - valA;
            }

            // String comparison
            valA = String(valA).toLowerCase();
            valB = String(valB).toLowerCase();

            if (order === 'asc') {
                return valA.localeCompare(valB);
            }
            return valB.localeCompare(valA);
        });
    }

    // ============================================
    // Pagination
    // ============================================
    function createPagination(containerId, totalItems, onPageChange) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const totalPages = Math.ceil(totalItems / state.pageSize);

        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        let html = '';

        // Previous button
        html += `<button class="pagination-btn" ${state.currentPage === 1 ? 'disabled' : ''} data-page="${state.currentPage - 1}">&laquo;</button>`;

        // Page numbers
        const maxVisible = 5;
        let startPage = Math.max(1, state.currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        if (startPage > 1) {
            html += `<button class="pagination-btn" data-page="1">1</button>`;
            if (startPage > 2) {
                html += `<span class="pagination-info">...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            html += `<button class="pagination-btn ${i === state.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                html += `<span class="pagination-info">...</span>`;
            }
            html += `<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`;
        }

        // Next button
        html += `<button class="pagination-btn" ${state.currentPage === totalPages ? 'disabled' : ''} data-page="${state.currentPage + 1}">&raquo;</button>`;

        container.innerHTML = html;

        // Add click handlers
        container.querySelectorAll('.pagination-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.disabled) return;
                const page = parseInt(btn.dataset.page, 10);
                state.currentPage = page;
                if (typeof onPageChange === 'function') {
                    onPageChange(page);
                }
            });
        });
    }

    function paginateData(data, page, pageSize) {
        const start = (page - 1) * pageSize;
        return data.slice(start, start + pageSize);
    }

    // ============================================
    // Chart Helpers (using Chart.js)
    // ============================================
    let chartInstances = {};

    function destroyChart(chartId) {
        if (chartInstances[chartId]) {
            chartInstances[chartId].destroy();
            delete chartInstances[chartId];
        }
    }

    function createPieChart(containerId, data, labels, colors) {
        const canvas = document.getElementById(containerId);
        if (!canvas) return null;

        destroyChart(containerId);

        const ctx = canvas.getContext('2d');
        chartInstances[containerId] = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors || [
                        '#4A90E2',
                        '#059669',
                        '#DC2626',
                        '#D97706',
                        '#7C3AED'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.raw / total) * 100).toFixed(1);
                                return `${context.label}: ${context.raw} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });

        return chartInstances[containerId];
    }

    function createLineChart(containerId, data, labels, options = {}) {
        const canvas = document.getElementById(containerId);
        if (!canvas) return null;

        destroyChart(containerId);

        const ctx = canvas.getContext('2d');
        chartInstances[containerId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    borderColor: options.color || '#4A90E2',
                    backgroundColor: options.fillColor || 'rgba(74, 144, 226, 0.1)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 3,
                    pointHoverRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#E5E7EB'
                        }
                    }
                }
            }
        });

        return chartInstances[containerId];
    }

    function createBarChart(containerId, data, labels, options = {}) {
        const canvas = document.getElementById(containerId);
        if (!canvas) return null;

        destroyChart(containerId);

        const ctx = canvas.getContext('2d');
        chartInstances[containerId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: options.colors || '#4A90E2',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: options.horizontal ? 'y' : 'x',
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: options.horizontal
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: !options.horizontal
                        }
                    }
                }
            }
        });

        return chartInstances[containerId];
    }

    // ============================================
    // Modal Component
    // ============================================
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus first input
        const firstInput = modal.querySelector('input, button');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function initModals() {
        // Close on overlay click
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    closeModal(overlay.id);
                }
            });
        });

        // Close on button click
        document.querySelectorAll('.modal-close, [data-close-modal]').forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal-overlay');
                if (modal) {
                    closeModal(modal.id);
                }
            });
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal-overlay.active');
                if (activeModal) {
                    closeModal(activeModal.id);
                }
            }
        });
    }

    // ============================================
    // Funnel Visualization
    // ============================================
    function renderFunnel(containerId, steps) {
        const container = document.getElementById(containerId);
        if (!container || !steps || steps.length === 0) return;

        const maxCount = Math.max(...steps.map(s => s.count));

        let html = '';
        steps.forEach((step, index) => {
            const width = maxCount > 0 ? Math.max(20, (step.count / maxCount) * 100) : 20;
            const dropoff = index > 0 ? step.drop_off : 0;

            html += `
                <div class="funnel-step">
                    <div class="funnel-step-bar" style="width: ${width}%">
                        <span class="funnel-step-name">${escapeHtml(step.name)}</span>
                        <div class="funnel-step-metrics">
                            <span class="funnel-step-count">${formatNumber(step.count)}</span>
                            <span class="funnel-step-rate">${step.conversion_rate}%</span>
                        </div>
                    </div>
                    ${index < steps.length - 1 ? `<div class="funnel-dropoff">-${dropoff}%</div>` : ''}
                </div>
            `;
        });

        container.innerHTML = html;
    }

    // ============================================
    // Real-time Updates
    // ============================================
    let realtimeInterval = null;

    function startRealtimeUpdates(callback, intervalMs = 10000) {
        if (realtimeInterval) {
            clearInterval(realtimeInterval);
        }

        // Initial call
        callback();

        // Set up interval
        realtimeInterval = setInterval(callback, intervalMs);

        // Clear on page unload
        window.addEventListener('beforeunload', () => {
            if (realtimeInterval) {
                clearInterval(realtimeInterval);
            }
        });
    }

    function stopRealtimeUpdates() {
        if (realtimeInterval) {
            clearInterval(realtimeInterval);
            realtimeInterval = null;
        }
    }

    // ============================================
    // Time Formatting
    // ============================================
    function formatDuration(seconds) {
        if (seconds === null || seconds === undefined) return '-';

        const mins = Math.floor(seconds / 60);
        const secs = Math.round(seconds % 60);

        if (mins > 0) {
            return `${mins}m ${secs}s`;
        }
        return `${secs}s`;
    }

    function formatRelativeTime(timestamp) {
        const now = new Date();
        const date = new Date(timestamp);
        const diff = (now - date) / 1000; // seconds

        if (diff < 60) {
            const s = Math.floor(diff);
            return s <= 1 ? 'just now' : `${s} seconds ago`;
        }
        if (diff < 3600) {
            const m = Math.floor(diff / 60);
            return m === 1 ? '1 minute ago' : `${m} minutes ago`;
        }
        if (diff < 86400) {
            const h = Math.floor(diff / 3600);
            return h === 1 ? '1 hour ago' : `${h} hours ago`;
        }
        const d = Math.floor(diff / 86400);
        return d === 1 ? '1 day ago' : `${d} days ago`;
    }

    function formatNumber(num) {
        if (num === null || num === undefined) return '-';
        return num.toLocaleString();
    }

    function formatPercent(value) {
        if (value === null || value === undefined) return '-';
        return `${value}%`;
    }

    // ============================================
    // Utility Functions
    // ============================================
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function showLoading(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="table-loading">
                <span class="visually-hidden">Loading...</span>
            </div>
        `;
    }

    function showEmpty(containerId, message = 'No data available') {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="table-empty">
                ${escapeHtml(message)}
            </div>
        `;
    }

    function showError(containerId, message = 'An error occurred') {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="alert alert--error">
                ${escapeHtml(message)}
            </div>
        `;
    }

    function showAlert(message, type = 'info') {
        // Create alert element
        const alert = document.createElement('div');
        alert.className = `alert alert--${type}`;
        alert.style.position = 'fixed';
        alert.style.top = '80px';
        alert.style.right = '20px';
        alert.style.zIndex = '1000';
        alert.style.maxWidth = '400px';
        alert.textContent = message;

        document.body.appendChild(alert);

        // Auto remove after 5 seconds
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }

    // ============================================
    // Sidebar Navigation
    // ============================================
    function initSidebar() {
        const toggle = document.querySelector('.sidebar-toggle');
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');

        if (!toggle || !sidebar) return;

        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            overlay?.classList.toggle('active');
        });

        overlay?.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        });

        // Mark active nav link
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    // ============================================
    // Badge Helper
    // ============================================
    function getReferrerBadge(type) {
        const badges = {
            direct: '<span class="badge badge--direct">Direct</span>',
            search: '<span class="badge badge--search">Search</span>',
            social: '<span class="badge badge--social">Social</span>',
            referral: '<span class="badge badge--referral">Referral</span>',
            email: '<span class="badge badge--email">Email</span>'
        };
        return badges[type] || '<span class="badge badge--unknown">Unknown</span>';
    }

    function getEventIcon(eventName) {
        const icons = {
            page_view: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>',
            pdf_download: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
            newsletter_signup: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
            contact_click: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>',
            linkedin_click: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>'
        };
        return icons[eventName] || '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>';
    }

    // ============================================
    // Export Functions for Specific Pages
    // ============================================
    async function exportData(type) {
        try {
            const params = new URLSearchParams({
                start_date: state.dateRange.start,
                end_date: state.dateRange.end,
                type: type
            });

            const response = await fetch(`${API_BASE}/analytics/dashboard/export?${params}`, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Export failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${type}_${state.dateRange.start}_${state.dateRange.end}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();

            showAlert('Export downloaded successfully', 'success');
        } catch (err) {
            console.error('Export error:', err);
            showAlert('Export failed. Please try again.', 'error');
        }
    }

    // ============================================
    // Autocomplete for Funnel Builder
    // ============================================
    let autocompleteData = {
        pages: [],
        events: []
    };

    async function loadAutocompleteData() {
        try {
            const [pagesRes, eventsRes] = await Promise.all([
                apiGet('/pages', { sort_by: 'views', order: 'desc' }),
                apiGet('/events')
            ]);

            if (pagesRes.success && pagesRes.data.pages) {
                autocompleteData.pages = pagesRes.data.pages.map(p => p.path);
            }

            if (eventsRes.success && eventsRes.data.events) {
                autocompleteData.events = eventsRes.data.events.map(e => e.name);
            }
        } catch (err) {
            console.error('Failed to load autocomplete data:', err);
        }
    }

    function initAutocomplete(inputId, onSelect) {
        const input = document.getElementById(inputId);
        if (!input) return;

        let dropdown = null;

        function showDropdown(matches) {
            hideDropdown();

            if (matches.length === 0) return;

            dropdown = document.createElement('div');
            dropdown.className = 'autocomplete-dropdown';
            dropdown.style.cssText = `
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border: 1px solid var(--color-border);
                border-radius: var(--radius-md);
                box-shadow: var(--shadow-md);
                max-height: 200px;
                overflow-y: auto;
                z-index: 100;
            `;

            matches.forEach(match => {
                const item = document.createElement('div');
                item.style.cssText = `
                    padding: 8px 12px;
                    cursor: pointer;
                    font-size: 13px;
                `;
                item.textContent = match;
                item.addEventListener('click', () => {
                    input.value = match;
                    hideDropdown();
                    if (typeof onSelect === 'function') {
                        onSelect(match);
                    }
                });
                item.addEventListener('mouseenter', () => {
                    item.style.backgroundColor = 'var(--color-light-grey)';
                });
                item.addEventListener('mouseleave', () => {
                    item.style.backgroundColor = '';
                });
                dropdown.appendChild(item);
            });

            input.parentNode.style.position = 'relative';
            input.parentNode.appendChild(dropdown);
        }

        function hideDropdown() {
            if (dropdown) {
                dropdown.remove();
                dropdown = null;
            }
        }

        input.addEventListener('input', debounce(() => {
            const value = input.value.toLowerCase();
            if (value.length < 1) {
                hideDropdown();
                return;
            }

            const allItems = [...autocompleteData.pages, ...autocompleteData.events];
            const matches = allItems.filter(item =>
                item.toLowerCase().includes(value)
            ).slice(0, 10);

            showDropdown(matches);
        }, 200));

        input.addEventListener('blur', () => {
            setTimeout(hideDropdown, 200);
        });
    }

    // ============================================
    // Initialize on DOM Ready
    // ============================================
    function init() {
        initSidebar();
        initDateRange();
        initModals();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ============================================
    // Export Public API
    // ============================================
    window.Reports = {
        // State
        state,

        // Auth
        checkAuth,

        // API
        apiGet,
        apiPost,

        // Date Range
        initDateRange,
        formatDate,

        // Tables
        initTableSorting,
        sortTableData,

        // Pagination
        createPagination,
        paginateData,

        // Charts
        createPieChart,
        createLineChart,
        createBarChart,
        destroyChart,

        // Modal
        openModal,
        closeModal,

        // Funnel
        renderFunnel,

        // Real-time
        startRealtimeUpdates,
        stopRealtimeUpdates,

        // Formatting
        formatDuration,
        formatRelativeTime,
        formatNumber,
        formatPercent,
        escapeHtml,

        // UI
        showLoading,
        showEmpty,
        showError,
        showAlert,

        // Helpers
        getReferrerBadge,
        getEventIcon,
        debounce,

        // Export
        exportData,

        // Autocomplete
        loadAutocompleteData,
        initAutocomplete
    };

})();
