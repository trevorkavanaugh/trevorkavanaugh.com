/**
 * Analytics Dashboard Authentication
 * Handles login, TOTP verification, and TOTP setup flows
 */

(function() {
    'use strict';

    // API base URL - relative since dashboard is served from same origin as API
    const API_BASE = '/api';

    // State management
    const state = {
        sessionToken: null,
        isUsingBackupCode: false,
        totpSecret: null,
        backupCodes: []
    };

    // DOM Elements cache
    let elements = {};

    /**
     * Initialize the auth module
     */
    function init() {
        // Determine which page we're on
        const isLoginPage = document.getElementById('login-form');
        const isSetupPage = document.getElementById('setup-form');

        if (isLoginPage) {
            initLoginPage();
        } else if (isSetupPage) {
            initSetupPage();
        }
    }

    /**
     * Initialize Login Page
     */
    function initLoginPage() {
        elements = {
            loginForm: document.getElementById('login-form'),
            usernameInput: document.getElementById('username'),
            passwordInput: document.getElementById('password'),
            loginButton: document.getElementById('login-button'),
            loginMessage: document.getElementById('login-message'),
            totpSection: document.getElementById('totp-section'),
            totpInput: document.getElementById('totp-code'),
            totpButton: document.getElementById('totp-button'),
            totpMessage: document.getElementById('totp-message'),
            backupToggle: document.getElementById('backup-toggle'),
            totpLabel: document.getElementById('totp-label'),
            credentialsSection: document.getElementById('credentials-section')
        };

        // Event listeners
        elements.loginForm.addEventListener('submit', handleLogin);

        if (elements.backupToggle) {
            elements.backupToggle.addEventListener('click', toggleBackupMode);
        }

        // Auto-focus username field
        if (elements.usernameInput) {
            elements.usernameInput.focus();
        }
    }

    /**
     * Initialize TOTP Setup Page
     */
    function initSetupPage() {
        elements = {
            setupForm: document.getElementById('setup-form'),
            qrCodeContainer: document.getElementById('qr-code'),
            secretDisplay: document.getElementById('secret-display'),
            verifyInput: document.getElementById('verify-code'),
            verifyButton: document.getElementById('verify-button'),
            setupMessage: document.getElementById('setup-message'),
            backupCodesSection: document.getElementById('backup-codes-section'),
            backupCodesList: document.getElementById('backup-codes-list'),
            copyCodesButton: document.getElementById('copy-codes'),
            downloadCodesButton: document.getElementById('download-codes'),
            continueButton: document.getElementById('continue-button'),
            setupSection: document.getElementById('setup-section'),
            stepIndicators: document.querySelectorAll('.step'),
            stepLines: document.querySelectorAll('.step-line')
        };

        // Event listeners
        elements.setupForm.addEventListener('submit', handleVerifySetup);

        if (elements.copyCodesButton) {
            elements.copyCodesButton.addEventListener('click', copyBackupCodes);
        }

        if (elements.downloadCodesButton) {
            elements.downloadCodesButton.addEventListener('click', downloadBackupCodes);
        }

        if (elements.continueButton) {
            elements.continueButton.addEventListener('click', goToDashboard);
        }

        // Fetch QR code on page load
        fetchTotpSetup();
    }

    /**
     * Handle login form submission
     */
    async function handleLogin(event) {
        event.preventDefault();

        // If TOTP section is visible, handle TOTP verification
        if (elements.totpSection.classList.contains('totp-section--visible')) {
            await handleTotpVerification();
            return;
        }

        const username = elements.usernameInput.value.trim();
        const password = elements.passwordInput.value;

        if (!username || !password) {
            showMessage(elements.loginMessage, 'Please enter both username and password.', 'error');
            return;
        }

        setButtonLoading(elements.loginButton, true);
        hideMessage(elements.loginMessage);

        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            if (data.requires_totp) {
                // Store session token and show TOTP input
                state.sessionToken = data.session_token;
                showTotpSection();
            } else if (data.requires_totp_setup) {
                // Redirect to TOTP setup page
                window.location.href = 'setup-totp.html';
            } else {
                // Login successful, redirect to dashboard
                window.location.href = 'index.html';
            }

        } catch (error) {
            showMessage(elements.loginMessage, error.message, 'error');
        } finally {
            setButtonLoading(elements.loginButton, false);
        }
    }

    /**
     * Handle TOTP verification
     */
    async function handleTotpVerification() {
        const code = elements.totpInput.value.trim();

        if (!code) {
            showMessage(elements.totpMessage, 'Please enter your verification code.', 'error');
            return;
        }

        setButtonLoading(elements.totpButton, true);
        hideMessage(elements.totpMessage);

        const endpoint = state.isUsingBackupCode
            ? `${API_BASE}/auth/verify-backup`
            : `${API_BASE}/auth/verify-totp`;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session_token: state.sessionToken,
                    code: code
                }),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Verification failed');
            }

            // Success - redirect to dashboard
            window.location.href = 'index.html';

        } catch (error) {
            showMessage(elements.totpMessage, error.message, 'error');
            elements.totpInput.value = '';
            elements.totpInput.focus();
        } finally {
            setButtonLoading(elements.totpButton, false);
        }
    }

    /**
     * Show TOTP input section
     */
    function showTotpSection() {
        // Disable credentials section
        elements.usernameInput.disabled = true;
        elements.passwordInput.disabled = true;
        elements.loginButton.style.display = 'none';

        // Show TOTP section
        elements.totpSection.classList.add('totp-section--visible');

        // Focus the TOTP input
        setTimeout(() => {
            elements.totpInput.focus();
        }, 100);

        // Update ARIA for accessibility
        elements.totpSection.setAttribute('aria-hidden', 'false');
    }

    /**
     * Toggle between TOTP and backup code input
     */
    function toggleBackupMode(event) {
        event.preventDefault();

        state.isUsingBackupCode = !state.isUsingBackupCode;

        if (state.isUsingBackupCode) {
            elements.totpLabel.textContent = 'Backup Code';
            elements.totpInput.placeholder = 'Enter backup code';
            elements.totpInput.maxLength = 10;
            elements.totpInput.classList.remove('form-input--code');
            elements.backupToggle.textContent = 'Use authenticator app instead';
        } else {
            elements.totpLabel.textContent = 'Verification Code';
            elements.totpInput.placeholder = '000000';
            elements.totpInput.maxLength = 6;
            elements.totpInput.classList.add('form-input--code');
            elements.backupToggle.textContent = 'Use backup code instead';
        }

        elements.totpInput.value = '';
        elements.totpInput.focus();
        hideMessage(elements.totpMessage);
    }

    /**
     * Fetch TOTP setup data (QR code and secret)
     */
    async function fetchTotpSetup() {
        try {
            const response = await fetch(`${API_BASE}/auth/setup-totp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch setup data');
            }

            // Display QR code
            elements.qrCodeContainer.innerHTML = `<img src="${data.qr_code}" alt="QR Code for authenticator app" width="180" height="180">`;

            // Display secret
            state.totpSecret = data.secret;
            elements.secretDisplay.textContent = data.secret;

            // Store backup codes
            state.backupCodes = data.backup_codes || [];

            // Focus verify input
            elements.verifyInput.focus();

        } catch (error) {
            showMessage(elements.setupMessage, error.message, 'error');
            elements.qrCodeContainer.innerHTML = '<div class="qr-loading">Failed to load QR code</div>';
        }
    }

    /**
     * Handle TOTP setup verification
     */
    async function handleVerifySetup(event) {
        event.preventDefault();

        const code = elements.verifyInput.value.trim();

        if (!code || code.length !== 6) {
            showMessage(elements.setupMessage, 'Please enter a 6-digit code from your authenticator app.', 'error');
            return;
        }

        setButtonLoading(elements.verifyButton, true);
        hideMessage(elements.setupMessage);

        try {
            const response = await fetch(`${API_BASE}/auth/confirm-totp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code }),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Verification failed. Please try again.');
            }

            // Success - show backup codes
            showBackupCodes();

        } catch (error) {
            showMessage(elements.setupMessage, error.message, 'error');
            elements.verifyInput.value = '';
            elements.verifyInput.focus();
        } finally {
            setButtonLoading(elements.verifyButton, false);
        }
    }

    /**
     * Show backup codes section
     */
    function showBackupCodes() {
        // Update step indicators
        if (elements.stepIndicators.length >= 2) {
            elements.stepIndicators[0].classList.add('step--complete');
            elements.stepIndicators[0].textContent = '\u2713';
            elements.stepIndicators[1].classList.add('step--active');
            elements.stepLines[0].classList.add('step-line--complete');
        }

        // Hide setup section
        elements.setupSection.style.display = 'none';

        // Populate backup codes
        elements.backupCodesList.innerHTML = state.backupCodes
            .map(code => `<div class="backup-code">${code}</div>`)
            .join('');

        // Show backup codes section
        elements.backupCodesSection.classList.add('backup-codes-section--visible');

        // Announce for screen readers
        announceToScreenReader('Two-factor authentication enabled. Please save your backup codes.');
    }

    /**
     * Copy backup codes to clipboard
     */
    async function copyBackupCodes() {
        const codesText = state.backupCodes.join('\n');

        try {
            await navigator.clipboard.writeText(codesText);
            showMessage(elements.setupMessage, 'Backup codes copied to clipboard.', 'success');
        } catch (error) {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = codesText;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showMessage(elements.setupMessage, 'Backup codes copied to clipboard.', 'success');
        }
    }

    /**
     * Download backup codes as a text file
     */
    function downloadBackupCodes() {
        const content = [
            'TPRM Analytics - Backup Codes',
            '================================',
            '',
            'Keep these codes in a safe place.',
            'Each code can only be used once.',
            '',
            ...state.backupCodes,
            '',
            'Generated: ' + new Date().toISOString()
        ].join('\n');

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'tprm-analytics-backup-codes.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showMessage(elements.setupMessage, 'Backup codes downloaded.', 'success');
    }

    /**
     * Navigate to dashboard
     */
    function goToDashboard() {
        window.location.href = 'index.html';
    }

    /**
     * Show a message
     */
    function showMessage(element, text, type) {
        if (!element) return;

        element.textContent = text;
        element.className = 'message message--visible message--' + type;
        element.setAttribute('role', 'alert');
    }

    /**
     * Hide a message
     */
    function hideMessage(element) {
        if (!element) return;

        element.className = 'message';
        element.removeAttribute('role');
    }

    /**
     * Set button loading state
     */
    function setButtonLoading(button, isLoading) {
        if (!button) return;

        if (isLoading) {
            button.classList.add('btn--loading');
            button.disabled = true;
        } else {
            button.classList.remove('btn--loading');
            button.disabled = false;
        }
    }

    /**
     * Announce message to screen readers
     */
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'visually-hidden';
        announcement.textContent = message;
        document.body.appendChild(announcement);

        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
