/**
 * Main JavaScript for Risk Management Consulting Website
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // Mobile Menu Toggle
    // ============================================
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const menuClose = document.querySelector('.menu-close');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu nav a');

    // Open mobile menu
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            this.setAttribute('aria-expanded', 'true');
        });
    }

    // Close mobile menu function
    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    }

    // Close menu when clicking X button
    if (menuClose) {
        menuClose.addEventListener('click', closeMobileMenu);
    }

    // Close menu when clicking overlay
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }

    // Close menu when clicking a link
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close menu on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // ============================================
    // Header Scroll Behavior
    // ============================================
    const header = document.getElementById('header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Add 'scrolled' class when scrolled down 50px
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollTop = scrollTop;
    });

    // ============================================
    // Smooth Scroll with Offset (for sticky header)
    // ============================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    const headerHeight = 80; // Height of sticky header

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Only handle anchor links that point to sections (not just #)
            if (href && href.length > 1) {
                const targetElement = document.querySelector(href);

                if (targetElement) {
                    e.preventDefault();

                    // Calculate position with offset
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                    // Smooth scroll to position
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Update URL without jumping
                    if (history.pushState) {
                        history.pushState(null, null, href);
                    }
                }
            }
        });
    });

    // ============================================
    // Active Navigation Highlighting
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

    function highlightActiveSection() {
        const scrollPosition = window.pageYOffset + headerHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });

                // Add active class to current section's link
                const activeLink = document.querySelector(`.main-nav a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });

        // Handle home link when at top
        if (window.pageYOffset < 100) {
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            const homeLink = document.querySelector('.main-nav a[href="/"], .main-nav a[href="#"]');
            if (homeLink) {
                homeLink.classList.add('active');
            }
        }
    }

    // Highlight on scroll
    window.addEventListener('scroll', highlightActiveSection);

    // Highlight on load
    highlightActiveSection();

    // ============================================
    // Form Handling (if contact form is added later)
    // ============================================
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Add form handling logic here
            // This is a placeholder for future implementation
            console.log('Form submitted');

            // Example: Show success message
            alert('Thank you for your message. We will be in touch soon.');
        });
    }

    // ============================================
    // Accessibility: Focus trap in mobile menu
    // ============================================
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button:not([disabled]), textarea, input, select'
        );

        if (focusableElements.length === 0) return;

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', function(e) {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        });
    }

    // Apply focus trap when mobile menu is open
    if (mobileMenu) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    if (mobileMenu.classList.contains('active')) {
                        trapFocus(mobileMenu);
                        // Focus on close button when menu opens
                        menuClose.focus();
                    }
                }
            });
        });

        observer.observe(mobileMenu, {
            attributes: true
        });
    }

    // ============================================
    // Loading Animation (optional)
    // ============================================
    // Add 'loaded' class to body when page is fully loaded
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // ============================================
    // Custom Analytics API
    // ============================================
    const API_BASE = 'https://api.trevorkavanaugh.com';

    // Track event to our own backend
    function trackEvent(eventType, eventLabel = null) {
        // Send to our API
        fetch(`${API_BASE}/api/track`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event_type: eventType,
                event_label: eventLabel,
                page_url: window.location.href
            })
        }).catch(() => {}); // Silent fail - don't break UX

        // Also send to GA4 if available
        if (typeof gtag === 'function') {
            gtag('event', eventType, {
                'event_category': 'engagement',
                'event_label': eventLabel
            });
        }
    }

    // ============================================
    // Event Tracking
    // ============================================
    // Track LinkedIn clicks
    document.querySelectorAll('a[href*="linkedin.com"]').forEach(link => {
        link.addEventListener('click', function() {
            const location = this.closest('section')?.id ||
                             this.closest('footer') ? 'footer' :
                             this.closest('.hero') ? 'hero' :
                             this.closest('.cta') ? 'cta' : 'other';
            trackEvent('linkedin_click', location);
        });
    });

    // Track email clicks
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', function() {
            const location = this.closest('section')?.id ||
                             this.closest('footer') ? 'footer' :
                             this.closest('.cta') ? 'cta' : 'other';
            trackEvent('email_click', location);
        });
    });

    // Track PDF preview/download clicks
    document.querySelectorAll('a[href$=".pdf"]').forEach(link => {
        link.addEventListener('click', function() {
            const filename = this.href.split('/').pop();
            trackEvent('pdf_click', filename);
        });
    });

    // ============================================
    // Newsletter Subscription
    // ============================================
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const emailInput = document.getElementById('newsletter-email');
            const messageEl = document.getElementById('newsletter-message');
            const submitBtn = this.querySelector('button');
            const email = emailInput.value.trim();

            if (!email) return;

            // Disable form while submitting
            submitBtn.disabled = true;
            submitBtn.textContent = 'Subscribing...';
            messageEl.textContent = '';
            messageEl.className = 'newsletter-message';

            try {
                const response = await fetch(`${API_BASE}/api/subscribe`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    messageEl.textContent = data.message || 'Check your email to confirm!';
                    messageEl.className = 'newsletter-message success';
                    emailInput.value = '';
                    trackEvent('subscribe', 'footer');
                } else {
                    messageEl.textContent = data.error || 'Something went wrong';
                    messageEl.className = 'newsletter-message error';
                }
            } catch (err) {
                messageEl.textContent = 'Connection error. Please try again.';
                messageEl.className = 'newsletter-message error';
            }

            submitBtn.disabled = false;
            submitBtn.textContent = 'Subscribe';
        });
    }

    // ============================================
    // Console Message
    // ============================================
    console.log('%c🏦 Risk Management Consulting Website', 'color: #1D3557; font-size: 16px; font-weight: bold;');
    console.log('%cBuilding Risk Management Frameworks That Scale', 'color: #4A90E2; font-size: 12px;');
});
