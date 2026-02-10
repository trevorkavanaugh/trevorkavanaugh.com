/**
 * Subscribers Dashboard
 * Displays newsletter subscriber analytics
 */

(function() {
    'use strict';

    const API_BASE = 'https://api.trevorkavanaugh.com';

    // DOM Elements
    const elements = {
        loadingOverlay: document.getElementById('loading-overlay'),
        errorMessage: document.getElementById('error-message'),
        errorText: document.getElementById('error-text'),
        retryButton: document.getElementById('retry-button'),
        totalSubscribers: document.getElementById('total-subscribers'),
        confirmedSubscribers: document.getElementById('confirmed-subscribers'),
        pendingSubscribers: document.getElementById('pending-subscribers'),
        unsubscribedCount: document.getElementById('unsubscribed-count'),
        newslettersSent: document.getElementById('newsletters-sent'),
        subscribersBody: document.getElementById('subscribers-body'),
        newslettersBody: document.getElementById('newsletters-body'),
        menuToggle: document.getElementById('menu-toggle'),
        sidebar: document.getElementById('sidebar'),
        sidebarOverlay: document.getElementById('sidebar-overlay'),
        sidebarClose: document.getElementById('sidebar-close'),
        userMenuTrigger: document.getElementById('user-menu-trigger'),
        userMenuDropdown: document.getElementById('user-menu-dropdown'),
        userAvatar: document.getElementById('user-avatar'),
        userName: document.getElementById('user-name'),
        userLogout: document.getElementById('user-logout'),
        logoutLink: document.getElementById('logout-link')
    };

    /**
     * Initialize the dashboard
     */
    async function init() {
        setupEventListeners();
        await checkAuth();
        await loadData();
    }

    /**
     * Set up event listeners
     */
    function setupEventListeners() {
        // Mobile menu
        if (elements.menuToggle) {
            elements.menuToggle.addEventListener('click', toggleSidebar);
        }
        if (elements.sidebarClose) {
            elements.sidebarClose.addEventListener('click', closeSidebar);
        }
        if (elements.sidebarOverlay) {
            elements.sidebarOverlay.addEventListener('click', closeSidebar);
        }

        // User menu
        if (elements.userMenuTrigger) {
            elements.userMenuTrigger.addEventListener('click', toggleUserMenu);
        }

        // Close user menu when clicking outside
        document.addEventListener('click', (e) => {
            if (elements.userMenuTrigger && !elements.userMenuTrigger.contains(e.target)) {
                elements.userMenuTrigger.parentElement.classList.remove('open');
            }
        });

        // Logout
        if (elements.userLogout) {
            elements.userLogout.addEventListener('click', handleLogout);
        }
        if (elements.logoutLink) {
            elements.logoutLink.addEventListener('click', handleLogout);
        }

        // Retry button
        if (elements.retryButton) {
            elements.retryButton.addEventListener('click', loadData);
        }
    }

    /**
     * Toggle sidebar (mobile)
     */
    function toggleSidebar() {
        elements.sidebar.classList.toggle('open');
        elements.sidebarOverlay.classList.toggle('active');
    }

    /**
     * Close sidebar
     */
    function closeSidebar() {
        elements.sidebar.classList.remove('open');
        elements.sidebarOverlay.classList.remove('active');
    }

    /**
     * Toggle user menu
     */
    function toggleUserMenu(e) {
        e.stopPropagation();
        elements.userMenuTrigger.parentElement.classList.toggle('open');
    }

    /**
     * Check authentication
     */
    async function checkAuth() {
        try {
            const response = await fetch(`${API_BASE}/api/auth/me`, {
                credentials: 'include'
            });

            if (!response.ok) {
                window.location.href = '/analytics/login.html';
                return;
            }

            const data = await response.json();
            if (data.user) {
                const initial = data.user.username.charAt(0).toUpperCase();
                if (elements.userAvatar) elements.userAvatar.textContent = initial;
                if (elements.userName) elements.userName.textContent = data.user.username;
            }
        } catch (err) {
            console.error('Auth check failed:', err);
            window.location.href = '/analytics/login.html';
        }
    }

    /**
     * Handle logout
     */
    async function handleLogout(e) {
        e.preventDefault();
        try {
            await fetch(`${API_BASE}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (err) {
            console.error('Logout error:', err);
        }
        window.location.href = '/analytics/login.html';
    }

    /**
     * Load all subscriber data
     */
    async function loadData() {
        showLoading();
        hideError();

        try {
            const response = await fetch(`${API_BASE}/api/analytics/dashboard/subscribers`, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                renderMetrics(result.data);
                renderSubscribers(result.data.subscribers || []);
                renderNewsletters(result.data.newsletters || []);
            } else {
                throw new Error(result.error || 'Failed to load data');
            }
        } catch (err) {
            console.error('Failed to load subscriber data:', err);
            showError('Unable to load subscriber data. Please try again.');
        } finally {
            hideLoading();
        }
    }

    /**
     * Render metric cards
     */
    function renderMetrics(data) {
        if (elements.totalSubscribers) {
            elements.totalSubscribers.textContent = formatNumber(data.total || 0);
        }
        if (elements.confirmedSubscribers) {
            elements.confirmedSubscribers.textContent = formatNumber(data.confirmed || 0);
        }
        if (elements.pendingSubscribers) {
            elements.pendingSubscribers.textContent = formatNumber(data.pending || 0);
        }
        if (elements.unsubscribedCount) {
            elements.unsubscribedCount.textContent = formatNumber(data.unsubscribed || 0);
        }
        if (elements.newslettersSent) {
            elements.newslettersSent.textContent = formatNumber(data.newsletters_sent || 0);
        }
    }

    /**
     * Render subscribers table
     */
    function renderSubscribers(subscribers) {
        if (!elements.subscribersBody) return;

        if (!subscribers || subscribers.length === 0) {
            elements.subscribersBody.innerHTML = `
                <tr>
                    <td colspan="3" class="empty-state">
                        <p>No subscribers yet</p>
                    </td>
                </tr>
            `;
            return;
        }

        elements.subscribersBody.innerHTML = subscribers.map(sub => `
            <tr>
                <td>${escapeHtml(sub.email)}</td>
                <td>${getStatusBadge(sub)}</td>
                <td>${formatDate(sub.created_at)}</td>
            </tr>
        `).join('');
    }

    /**
     * Get status badge HTML
     */
    function getStatusBadge(subscriber) {
        if (subscriber.unsubscribed) {
            return '<span class="referrer-badge referrer-badge--direct">Unsubscribed</span>';
        }
        if (subscriber.confirmed) {
            return '<span class="referrer-badge referrer-badge--search">Confirmed</span>';
        }
        return '<span class="referrer-badge referrer-badge--referral">Pending</span>';
    }

    /**
     * Render newsletters table
     */
    function renderNewsletters(newsletters) {
        if (!elements.newslettersBody) return;

        if (!newsletters || newsletters.length === 0) {
            elements.newslettersBody.innerHTML = `
                <tr>
                    <td colspan="3" class="empty-state">
                        <p>No newsletters sent yet</p>
                    </td>
                </tr>
            `;
            return;
        }

        elements.newslettersBody.innerHTML = newsletters.map(nl => `
            <tr>
                <td><span class="page-path" title="${escapeHtml(nl.subject)}">${escapeHtml(nl.subject)}</span></td>
                <td><span class="page-path" title="${escapeHtml(nl.article_title || '')}">${escapeHtml(nl.article_title || '-')}</span></td>
                <td>${formatDate(nl.sent_at)}</td>
            </tr>
        `).join('');
    }

    /**
     * Format number with commas
     */
    function formatNumber(num) {
        return new Intl.NumberFormat().format(num);
    }

    /**
     * Format date
     */
    function formatDate(dateStr) {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    /**
     * Escape HTML to prevent XSS
     */
    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Show loading overlay
     */
    function showLoading() {
        if (elements.loadingOverlay) {
            elements.loadingOverlay.classList.remove('hidden');
        }
    }

    /**
     * Hide loading overlay
     */
    function hideLoading() {
        if (elements.loadingOverlay) {
            elements.loadingOverlay.classList.add('hidden');
        }
    }

    /**
     * Show error message
     */
    function showError(message) {
        if (elements.errorMessage) {
            elements.errorMessage.classList.add('visible');
        }
        if (elements.errorText) {
            elements.errorText.textContent = message;
        }
    }

    /**
     * Hide error message
     */
    function hideError() {
        if (elements.errorMessage) {
            elements.errorMessage.classList.remove('visible');
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
