// Site Selector - shared across all analytics dashboard pages
(function() {
    'use strict';

    const DEFAULT_SITE = 'trevorkavanaugh.com';

    window.getSelectedSite = function() {
        return localStorage.getItem('selectedSite') || DEFAULT_SITE;
    };

    // Helper to append site param to a URL or query string
    window.getSiteParam = function() {
        return 'site=' + encodeURIComponent(getSelectedSite());
    };

    function initSiteTabs() {
        var tabs = document.querySelectorAll('.site-tab');
        if (!tabs.length) return;

        var currentSite = getSelectedSite();

        tabs.forEach(function(tab) {
            if (tab.dataset.site === currentSite) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }

            tab.addEventListener('click', function() {
                localStorage.setItem('selectedSite', tab.dataset.site);
                tabs.forEach(function(t) { t.classList.remove('active'); });
                tab.classList.add('active');

                if (typeof refreshData === 'function') {
                    refreshData();
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSiteTabs);
    } else {
        initSiteTabs();
    }
})();
