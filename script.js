// ==========================================
// 1. CONFIGURATION & CONSTANTS
// ==========================================
// NOTE: APP_ID, VERSION, and character sets are defined in frankpass-core.js.
// Do NOT redefine them here — they were removed to prevent desync bugs.

// ==========================================
// ANNOUNCEMENT CONFIGURATION
// (Use this to give a popup message to users)
// ==========================================
const ANNOUNCEMENT = {
    id: "launch_v1", // Change this ID to show the popup AGAIN for everyone
    show: true,      // Set to false to disable
    title: "🚀 FrankPass is Live!",
    message: "Welcome to FrankPass. Your passwords never leave your device. Download our Ebook in the Guide section for the ultimate security workflow! (v1.0.0)",
    cta: "Got it!"
};

// ==========================================
// 2. DOM ELEMENT SELECTIONS
// ==========================================
const form = document.getElementById('generator-form');
const platformEl = document.getElementById('platform');
const platformList = document.getElementById('platform-list');
const regionEl = document.getElementById('region');
const usernameEl = document.getElementById('username');
const secretEl = document.getElementById('secret');
const variantEl = document.getElementById('variant');
const profileEl = document.getElementById('profile');
const lengthEl = document.getElementById('length');
const lengthValEl = document.getElementById('length-val');

const generateBtn = document.getElementById('generate-btn');
const btnText = document.querySelector('.btn-text');
const btnIcon = document.querySelector('.btn-primary ion-icon');
const loader = document.querySelector('.loader');

const passwordOutput = document.getElementById('password-output');
const outputSection = document.getElementById('output-section');
const copyBtn = document.getElementById('copy-btn');
const toast = document.getElementById('toast');
const togglePassCb = document.getElementById('toggle-pass-cb');
const toggleSecretCb = document.getElementById('toggle-secret-cb');
const toggleUsernameCb = document.getElementById('toggle-username-cb');
const specialShoutoutCard = document.getElementById('special-shoutout-card');

// Security Timers
let secretClearTimer = null;
let passwordClearTimer = null;
let passwordCountdownInterval = null; // For the visual 15s timer
let inactivityRefreshTimer = null; // For the 30s page reload

// Initialize Crypto Worker
let cryptoWorker = null;
if (window.Worker) {
    cryptoWorker = new Worker('crypto-worker.js');
}

// ==========================================
// 3. EVENT LISTENERS & UI LOGIC
// ==========================================

// Update length dynamically on slider change
lengthEl.addEventListener('input', (e) => {
    lengthValEl.textContent = e.target.value;
});

// Toggle Secret Visibility via Checkbox
if (toggleSecretCb) {
    toggleSecretCb.addEventListener('change', (e) => {
        secretEl.type = e.target.checked ? 'text' : 'password';
    });
}

// Username Save Toggle
if (toggleUsernameCb) {
    toggleUsernameCb.addEventListener('change', (e) => {
        if (e.target.checked) {
            if (usernameEl && usernameEl.value) {
                localStorage.setItem('frankpass_username', usernameEl.value);
            }
        } else {
            localStorage.removeItem('frankpass_username');
        }
    });
    // If user types and toggle is on, keep saving
    if (usernameEl) {
        usernameEl.addEventListener('input', () => {
            if (toggleUsernameCb.checked) {
                localStorage.setItem('frankpass_username', usernameEl.value);
            }
        });
    }
}

// Toggle Generated Password Visibility via Switch
if (togglePassCb) {
    togglePassCb.addEventListener('change', (e) => {
        passwordOutput.type = e.target.checked ? 'text' : 'password';
    });
}

// Auto-Clear Logic
function getSettings() {
    const defaults = { passTimer: 15000, secretTimer: 60000, idleTimer: 300000 }; // Default idle: 5 min
    const saved = JSON.parse(localStorage.getItem('frankpass_settings') || '{}');
    return { ...defaults, ...saved };
}

function loadSettings() {
    const saved = JSON.parse(localStorage.getItem('frankpass_settings') || '{}');
    const passTimer = document.getElementById('setting-pass-timer');
    const secretTimer = document.getElementById('setting-secret-timer');
    const idleTimer = document.getElementById('setting-idle-timer');
    if (passTimer && saved.passTimer) passTimer.value = saved.passTimer;
    if (secretTimer && saved.secretTimer) secretTimer.value = saved.secretTimer;
    if (idleTimer && saved.idleTimer !== undefined) idleTimer.value = saved.idleTimer;

    // Restore saved username
    const savedUsername = localStorage.getItem('frankpass_username');
    if (savedUsername && usernameEl) {
        usernameEl.value = savedUsername;
        if (toggleUsernameCb) toggleUsernameCb.checked = true;
    }
}

function saveSettings() {
    const passTimer = parseInt(document.getElementById('setting-pass-timer')?.value || 15000);
    const secretTimer = parseInt(document.getElementById('setting-secret-timer')?.value || 60000);
    const idleTimer = parseInt(document.getElementById('setting-idle-timer')?.value || 300000);
    localStorage.setItem('frankpass_settings', JSON.stringify({ passTimer, secretTimer, idleTimer }));
    // Restart timers with new values immediately
    startInactivityRefreshTimer();
    if (secretEl && secretEl.value) startSecretClearTimer();
}

function startSecretClearTimer() {
    clearTimeout(secretClearTimer);
    const ms = getSettings().secretTimer;
    if (ms === 0) return; // "Never" support
    secretClearTimer = setTimeout(() => {
        if (secretEl) {
            secretEl.value = '';
            secretEl.dispatchEvent(new Event('input'));
        }
        console.log("Secret Key auto-cleared for security.");
    }, ms);
}

function startInactivityRefreshTimer() {
    clearTimeout(inactivityRefreshTimer);
    const ms = getSettings().idleTimer;
    if (ms === 0) return; // Never
    inactivityRefreshTimer = setTimeout(() => {
        console.log(`${ms/1000}s Inactivity reached. Refreshing page for security.`);
        window.location.reload();
    }, ms);
}

function startPasswordClearTimer() {
    // Clear existing timers
    clearTimeout(passwordClearTimer);
    clearInterval(passwordCountdownInterval);
    
    const ms = getSettings().passTimer;
    let timeLeft = Math.round(ms / 1000); // BUG FIX: was hardcoded 15, should match actual setting

    const timerDisplay = document.getElementById('password-timer-display');
    const timerSecondsSpan = document.getElementById('timer-seconds');

    if (timerDisplay && timerSecondsSpan) {
        timerDisplay.style.display = 'block';
        timerSecondsSpan.textContent = timeLeft;
        
        passwordCountdownInterval = setInterval(() => {
            timeLeft--;
            timerSecondsSpan.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(passwordCountdownInterval);
                timerDisplay.style.display = 'none';
            }
        }, 1000);
    }

    passwordClearTimer = setTimeout(() => {
        if (passwordOutput) {
            passwordOutput.value = '****************';
            passwordOutput.type = 'password'; // Force mask
            if (togglePassCb) togglePassCb.checked = false;
        }
        if (outputSection) outputSection.classList.remove('active');
        if (copyBtn) copyBtn.disabled = true;
        console.log(`Generated Password auto-cleared for security (${ms/1000}s).`);
    }, ms);
}

// Clear sensitive data on tab close or leave
const clearSensitiveData = () => {
    if (secretEl) secretEl.value = '';
    if (passwordOutput) {
        passwordOutput.value = '****************';
        passwordOutput.type = 'password';
    }
    if (outputSection) outputSection.classList.remove('active');
    if (copyBtn) copyBtn.disabled = true;
    const timerDisplay = document.getElementById('password-timer-display');
    if(timerDisplay) timerDisplay.style.display = 'none';
    clearInterval(passwordCountdownInterval);
    console.log("Sensitive data wiped.");
};

document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearSensitiveData();
});

window.addEventListener('beforeunload', clearSensitiveData);
window.addEventListener('pagehide', clearSensitiveData);

// Reset timers on any user activity (inactivity detection)
['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'input'].forEach(evt => {
    document.addEventListener(evt, () => {
        // Reset 30s page refresh timer
        startInactivityRefreshTimer();

        // Reset 1 min secret clear timer if secret exists
        if (secretEl && secretEl.value !== '') {
            startSecretClearTimer();
        }
    }, { passive: true });
});

// Initialize the inactivity timer on load
startInactivityRefreshTimer();

// Field Auto-Cleanup & Restore UX
// BUG-10 FIX: select() text on focus instead of clearing — prevents mobile jitter
// and datalist interference when users accidentally tap then blur a field.
function setupSmartField(el) {
    if (!el) return;
    el.addEventListener('focus', () => {
        setTimeout(() => el.select(), 0);
    });
}

setupSmartField(regionEl);
setupSmartField(platformEl);
setupSmartField(usernameEl);

// Helper: Extract 2-letter country code from value like "India (IN)"
function extractCountryCode(val) {
    if (!val) return '';
    const match = val.match(/\(([A-Z]{2})\)/);
    return match ? match[1].toLowerCase() : '';
}

// Populate Datalist dynamically based on region
function populatePlatformDatalist(region) {
    if (!window.regionalPlatforms || !platformList) return;

    // Clear existing
    platformList.innerHTML = '';

    let platforms = [];
    if (region === 'global') {
        // Collect all unique platforms
        let allPlatforms = new Set();
        Object.values(window.regionalPlatforms).forEach(arr => {
            arr.forEach(p => allPlatforms.add(p));
        });
        platforms = Array.from(allPlatforms).sort();
    } else {
        platforms = window.regionalPlatforms[region] || window.regionalPlatforms['in'] || [];
    }

    // Add fresh options
    platforms.forEach(platformName => {
        const option = document.createElement('option');
        option.value = platformName;
        platformList.appendChild(option);
    });
}

// Region change is handled below in the unified listener

// Auto-detect Region by Timezone
function autoDetectRegion() {
    try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const tzMap = {
            'Asia/Kolkata': 'in', 'Asia/Calcutta': 'in',
            'America/New_York': 'us', 'America/Los_Angeles': 'us', 'America/Chicago': 'us', 'America/Denver': 'us',
            'Europe/London': 'gb', 'Europe/Paris': 'fr', 'Europe/Berlin': 'de',
            'America/Toronto': 'ca', 'Australia/Sydney': 'au', 'Australia/Melbourne': 'au',
            'Asia/Dhaka': 'bd', 'Asia/Karachi': 'pk', 'Africa/Lagos': 'ng',
            'Asia/Manila': 'ph', 'Asia/Jakarta': 'id', 'Africa/Nairobi': 'ke',
            'Asia/Dubai': 'ae', 'Asia/Riyadh': 'sa',
            'Asia/Tokyo': 'jp', 'America/Sao_Paulo': 'br', 'Africa/Johannesburg': 'za',
            'Europe/Madrid': 'es', 'Europe/Rome': 'it', 'Europe/Amsterdam': 'nl'
            // Add more common timezones if necessary.
        };

        const detectedRegion = tzMap[tz];
        if (detectedRegion) {
            // 1. Personalize Platform List — match "(XX)" at end of option value
            const code = detectedRegion.toUpperCase();
            const option = document.querySelector(`#region-list option[value$="(${code})"]`);
            if (option) {
                regionEl.value = option.value;
            }

            // 2. Note: We no longer auto-open the language guide on load based on region
            // The guide stays hidden until the user manually clicks "How to use"
        }
    } catch (e) {
        console.warn("Could not auto-detect region:", e);
    }
}

// Region init is now handled by country-dropdown.js
// It populates platforms, updates flag badge, and sets hidden #region input.
// This DOMContentLoaded block intentionally left empty (not removed for future extensibility).
window.addEventListener('DOMContentLoaded', () => {
    // country-dropdown.js handles all region init
});

// Flag badge updater — called by regionEl 'change' listener below
function updateRegionIcon(code) {
    const flagBadge = document.getElementById('flag-badge');
    if (!flagBadge) return;
    if (!code || code.length !== 2) {
        flagBadge.innerHTML = '🌍'; return;
    }
    const flagUrl = `https://flagcdn.com/w80/${code}.png`;
    flagBadge.innerHTML = `<img src="${flagUrl}" alt="${code}" style="width:22px;height:auto;border-radius:2px;vertical-align:middle;" onerror="this.innerHTML='🌍'">`;
}

// Unified region change listener (input + change)
if (regionEl) {
    regionEl.addEventListener('input', (e) => {
        let val = e.target.value || '';
        let code = extractCountryCode(val) || 'global';
        populatePlatformDatalist(code);
        updateRegionIcon(code);

        // Clear platform on region change
        if (platformEl) platformEl.value = '';

        // Update URL path without refresh (SEO & UX)
        if (code !== 'global') {
            window.history.pushState({ code }, '', `/${code}`);
        } else {
            window.history.pushState({ code }, '', '/');
        }
    });

    regionEl.addEventListener('change', (e) => {
        let val = e.target.value || '';
        let code = extractCountryCode(val) || 'global';
        populatePlatformDatalist(code);
        updateRegionIcon(code);

        // Clear platform on region change
        if (platformEl) platformEl.value = '';

        // Update URL path without refresh (SEO & UX)
        if (code !== 'global') {
            window.history.pushState({ code }, '', `/${code}`);
        } else {
            window.history.pushState({ code }, '', '/');
        }
    });
}

// ==========================================
// 4. MAIN GENERATOR LOGIC
// ==========================================
// Main Generator Form Submission
// ==========================================
// 5. GUIDE LOCALIZATION & SHARING
// ==========================================

// Generation tracking for Shoutout feature
let genCount = parseInt(localStorage.getItem('frankpass_gen_count') || '0');

function showShoutoutModal() {
    const modal = document.getElementById('shoutout-modal');
    if (modal) modal.classList.add('show');
}

function closeShoutoutModal() {
    const modal = document.getElementById('shoutout-modal');
    if (modal) modal.classList.remove('show');
}

// Close modal when clicking outside of the content
window.addEventListener('click', (event) => {
    const modal = document.getElementById('shoutout-modal');
    if (event.target === modal) {
        closeShoutoutModal();
    }
});

// Main Generator Form Submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) return;

    closeGuide(true); // UX Improvement: Auto-hide guide on generation (skip scroll)
    setLoadingState(true);

    try {
        await new Promise(resolve => setTimeout(resolve, 10));

        // ... existing platform/username/secret logic ...
        let rawPlatform = platformEl.value.trim().toLowerCase();
        let platform = rawPlatform;
        platform = platform.replace(/^(https?:\/\/)?/, '').split('/')[0].split('?')[0].split('#')[0];
        platform = platform.replace(/^(www\.|m\.|app\.|login\.|secure\.|auth\.|account\.)/, '');
        let domainParts = platform.split('.');
        if (domainParts.length > 2 && (domainParts[domainParts.length - 2].length <= 3)) {
            platform = domainParts[domainParts.length - 3];
        } else if (domainParts.length >= 2) {
            platform = domainParts[domainParts.length - 2];
        } else {
            platform = domainParts[0];
        }
        platform = platform.replace(/[^a-z0-9]/g, '');

        const globalAliases = {
            'x': 'twitter', 'tw': 'twitter', 'ig': 'instagram', 'insta': 'instagram',
            'fb': 'facebook', 'yt': 'youtube', 'wa': 'whatsapp', 'amzn': 'amazon',
            'snap': 'snapchat', 'pin': 'pinterest', 'gpay': 'googlepay', 'appleid': 'apple'
        };
        if (globalAliases[platform]) platform = globalAliases[platform];

        const usernameRaw = usernameEl.value.trim().toLowerCase();
        const username = usernameRaw.split('@')[0].replace(/[^a-z0-9._-]/g, '');
        const secret = secretEl.value.toLowerCase().replace(/\s+/g, '');
        let variant = parseInt(variantEl.value, 10);
        if (isNaN(variant)) variant = 1;
        const profile = profileEl.value;
        let length = parseInt(lengthEl.value, 10);
        if (isNaN(length)) length = 16;

        // Use Web Worker for generation
        if (cryptoWorker) {
            cryptoWorker.onmessage = function(event) {
                const { success, password, error } = event.data;
                setLoadingState(false);
                
                if (success) {
                    displayGeneratedPassword(password, profile, length);
                } else {
                    console.error('Worker Error:', error);
                    alert('Encryption Error. Please refresh and try again.');
                }
            };

            cryptoWorker.postMessage({ platform, username, secret, variant, profile, length });
        } else {
            // Fallback for extremely old browsers (sync generation)
            const password = await FRANKPASS_CORE.generate(platform, username, secret, variant, profile, length, null);
            setLoadingState(false);
            displayGeneratedPassword(password, profile, length);
        }
    } catch (error) {
        setLoadingState(false);
        console.error('Generation Error:', error);
    }
});

// Helper: UI Update for generated password
function displayGeneratedPassword(password, profile, length) {
    // Strength Logic
    const strengthIndicator = document.getElementById('strength-indicator');
    if (strengthIndicator) {
        strengthIndicator.style.display = 'flex';
        if (length >= 16 && profile === 'standard') {
            strengthIndicator.innerHTML = '<ion-icon name="shield-checkmark"></ion-icon> Unbreakable';
            strengthIndicator.style.color = '#10b981';
            strengthIndicator.style.background = 'rgba(16, 185, 129, 0.15)';
        } else if (length >= 12 && (profile === 'standard' || profile === 'alphanumeric')) {
            strengthIndicator.innerHTML = '<ion-icon name="shield-outline"></ion-icon> Strong';
            strengthIndicator.style.color = '#3b82f6';
            strengthIndicator.style.background = 'rgba(59, 130, 246, 0.15)';
        } else if (length >= 8) {
            strengthIndicator.innerHTML = '<ion-icon name="alert-circle-outline"></ion-icon> Medium';
            strengthIndicator.style.color = '#f59e0b';
            strengthIndicator.style.background = 'rgba(245, 158, 11, 0.15)';
        } else {
            strengthIndicator.innerHTML = '<ion-icon name="warning-outline"></ion-icon> Weak';
            strengthIndicator.style.color = '#ef4444';
            strengthIndicator.style.background = 'rgba(239, 68, 68, 0.15)';
        }
    }

    passwordOutput.value = password;
    outputSection.classList.add('active');
    copyBtn.disabled = false;
    
    // Auto-clear and Scroll
    startPasswordClearTimer();
    startSecretClearTimer();
    outputSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Special Shoutout (every 5 gens)
    genCount++;
    localStorage.setItem('frankpass_gen_count', genCount);
    if (genCount % 5 === 0) {
        setTimeout(showSpecialShoutout, 500);
    }
}

function setLoadingState(isLoading) {
    if (isLoading) {
        generateBtn.disabled = true;
        btnText.classList.add('hidden');
        btnIcon.classList.add('hidden');
        loader.classList.remove('hidden');
    } else {
        generateBtn.disabled = false;
        btnText.classList.remove('hidden');
        btnIcon.classList.remove('hidden');
        loader.classList.add('hidden');
    }
}

copyBtn.addEventListener('click', () => {
    copyToClipboard(passwordOutput.value);
});

async function copyToClipboard(text) {
    if (!text || text === '****************') return;
    try {
        await navigator.clipboard.writeText(text);
        showToast();
        showSpecialShoutout();
    } catch (err) {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
        showToast();
        showSpecialShoutout();
    }
}

function showToast() {
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

function showSpecialShoutout() {
    if (specialShoutoutCard) {
        specialShoutoutCard.classList.remove('hidden');
    }
}

function hideSpecialShoutout() {
    if (specialShoutoutCard) {
        specialShoutoutCard.classList.add('hidden');
    }
}

// Guide Localization and Toggling
const langs = ['en', 'hi', 'es', 'fr'];
const guides = {};
const btns = {};

langs.forEach(lang => {
    const guideEl = document.getElementById(`guide-${lang}`);
    const btnEl = document.getElementById(`btn-guide-${lang}`);
    if (guideEl && btnEl) {
        guides[lang] = guideEl;
        btns[lang] = btnEl;
        btnEl.addEventListener('click', () => {
            toggleGuide(lang);
        });
    }
});

function toggleGuide(lang) {
    if (!guides[lang] || !btns[lang]) return;
    const isShowing = !guides[lang].classList.contains('hidden');
    langs.forEach(l => {
        if (guides[l]) guides[l].classList.add('hidden');
        if (btns[l]) btns[l].classList.remove('active');
    });
    if (!isShowing) {
        guides[lang].classList.remove('hidden');
        btns[lang].classList.add('active');
        const activeRegion = extractCountryCode(regionEl.value) || 'global';
        const transLang = (activeRegion === 'in' || activeRegion === 'np') ? 'in' : (activeRegion === 'ng' ? 'ng' : activeRegion);
        const breachTranslation = window.regionalTranslations[transLang] || window.regionalTranslations['ng'];
        if (breachTranslation) {
            const bTitle = document.getElementById('breach-title');
            const bBody = document.getElementById('breach-body');
            if (bTitle) bTitle.innerHTML = `<ion-icon name="warning-outline" style="vertical-align: middle; margin-right: 0.5rem;"></ion-icon> ${breachTranslation.breach_title}`;
            if (bBody) bBody.innerHTML = breachTranslation.breach_body;
        }
    }
}

function closeGuide(skipScroll = false) {
    langs.forEach(l => {
        if (guides[l]) guides[l].classList.add('hidden');
        if (btns[l]) btns[l].classList.remove('active');
    });

    if (!skipScroll) {
        // Scroll back to guide buttons (only when user manually closes)
        const target = document.getElementById('how-it-works');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

/**
 * Shoutout functionality: Pre-fills a localized message and opens social sharing.
 * Detects the active region from the region selector to pick the right language.
 * @param {string} platform - The social platform ('x', 'instagram', 'facebook', 'youtube', 'whatsapp')
 */
function runShoutout(platform) {
    // Detect active region from the region selector
    const regionVal = regionEl ? regionEl.value : '';
    const regionCode = extractCountryCode(regionVal) || 'ng';
    const msgData = window.regionalTranslations[regionCode] || window.regionalTranslations['ng'] || {};
    
    // Updated more descriptive message that encourages supporting others
    const message = msgData.shoutout_message || "I'm using FrankPass - a futuristic, stateless password generator that ensures privacy and mental peace. No more forgotten passwords! Check it out: https://frankpass.com/guide";
    const encodedMsg = encodeURIComponent(message);
    const guideUrl = "https://frankpass.com/guide";
    const encodedGuideUrl = encodeURIComponent(guideUrl);

    let shareUrl = "";

    switch (platform) {
        case 'x':
            shareUrl = `https://x.com/intent/tweet?text=${encodedMsg}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodedMsg}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedGuideUrl}&quote=${encodedMsg}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedGuideUrl}`;
            break;
        case 'instagram':
            navigator.clipboard.writeText(message).then(() => {
                alert("Message copied to clipboard! Now opening Instagram — paste it in your story or post.");
                window.open("https://instagram.com/mastermanikant", '_blank', 'noopener,noreferrer');
            });
            return;
        default:
            navigator.clipboard.writeText(message).then(() => {
                alert("Message copied! You can now paste it anywhere.");
            });
            return;
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
}


// =============== PWA Smart Install / Open-in-App Logic ===============
let deferredInstallPrompt = null;

// Register Service Worker for offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(reg => console.log('FrankPass SW registered:', reg.scope))
            .catch(err => console.warn('SW registration failed:', err));
    });
}

// Set button to "Open in App" mode
function showOpenInAppBtn() {
    const btn = document.getElementById('pwa-install-btn');
    if (!btn) return;
    btn.style.display = 'flex';
    btn.style.background = 'linear-gradient(135deg, #6366f1, #4f46e5)';
    btn.innerHTML = '<ion-icon name="phone-portrait-outline" style="margin-right:0.4rem;"></ion-icon> Open in App';
    btn.onclick = openInApp;
}

// Set button to "Install Web App" mode
function showInstallBtn() {
    const btn = document.getElementById('pwa-install-btn');
    if (!btn) return;
    btn.style.display = 'flex';
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    btn.innerHTML = '<ion-icon name="download-outline" style="margin-right:0.4rem;"></ion-icon> Install Web App';
    btn.onclick = installPWA;
}

// Detect Standalone Mode and show "Open in Browser" button
window.addEventListener('load', () => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    const openBrowserBtn = document.getElementById('open-browser-btn');
    if (isStandalone && openBrowserBtn) {
        openBrowserBtn.style.display = 'block';
    }
});

function openInBrowser() {
    // This will open the URL in a new browser tab/window
    window.open(window.location.href, '_blank');
}

// On page load: check if app is already installed
window.addEventListener('DOMContentLoaded', () => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
        || window.navigator.standalone === true;

    if (isStandalone) {
        // Running inside installed PWA — hide both banners & install btn
        const btn = document.getElementById('pwa-install-btn');
        if (btn) btn.style.display = 'none';
        hideInstallBanner();
    } else if (localStorage.getItem('frankpass-installed') === 'true') {
        // Previously installed — show Open in App options
        showOpenInAppBtn();
        showOpenInAppBanner();
    }
    // Otherwise wait for beforeinstallprompt
});

// Browser fires this when app is installable
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    if (localStorage.getItem('frankpass-installed') !== 'true') {
        showInstallBtn();
        showInstallBanner();
        // Show floating banner after 4 seconds
        setTimeout(() => {
            const banner = document.getElementById('pwa-float-banner');
            if (banner && localStorage.getItem('frankpass_banner_dismissed') !== 'true') {
                banner.style.display = 'flex';
            }
        }, 4000);
    }
});

// Called when user clicks "Install Web App"
function installPWA() {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    deferredInstallPrompt.userChoice.then((result) => {
        deferredInstallPrompt = null;
        if (result.outcome === 'accepted') {
            localStorage.setItem('frankpass-installed', 'true');
            showOpenInAppBtn();
            showOpenInAppBanner();
            hideInstallBanner();
        } else {
            const btn = document.getElementById('pwa-install-btn');
            if (btn) btn.style.display = 'none';
        }
    });
}

// Called when user clicks "Open in App"
function openInApp() {
    window.open(window.location.href, '_blank', 'noreferrer');
}

// Browser fires this when install completes
window.addEventListener('appinstalled', () => {
    localStorage.setItem('frankpass-installed', 'true');
    deferredInstallPrompt = null;
    showOpenInAppBtn();
    showOpenInAppBanner();
    hideInstallBanner();
    hidePWABanner();
    // Auto-request notification permission after app is installed
    if ('Notification' in window && Notification.permission === 'default') {
        setTimeout(() => {
            Notification.requestPermission().then(perm => {
                if (perm === 'granted') {
                    // Mark all prefs as enabled
                    localStorage.setItem('frankpass_notif_prefs', JSON.stringify({scam:true,updates:true,offers:true}));
                    loadNotifPrefs();
                }
            });
        }, 1500); // Slight delay so the install completes first
    }
});

// Show/hide install action banners
function showInstallBanner() {
    const el = document.getElementById('install-action-banner');
    if (el) el.style.display = 'flex';
}
function hideInstallBanner() {
    const el = document.getElementById('install-action-banner');
    if (el) el.style.display = 'none';
}
function showOpenInAppBanner() {
    const el = document.getElementById('openinapp-action-banner');
    if (el) el.style.display = 'flex';
}

// Hide the floating PWA banner
function hidePWABanner() {
    const banner = document.getElementById('pwa-float-banner');
    if (banner) banner.style.display = 'none';
    localStorage.setItem('frankpass_banner_dismissed', 'true');
}

// Toggle the Stay Informed / Notifications panel
function toggleNotifPanel() {
    const panel = document.getElementById('notif-panel');
    const settingsPanel = document.getElementById('settings-panel');
    const btn = document.getElementById('notif-bell-btn');
    const settingsBtn = document.getElementById('settings-gear-btn');
    if (!panel) return;
    
    // Close settings if open
    if (settingsPanel && settingsPanel.style.display === 'block') {
        settingsPanel.style.display = 'none';
        if (settingsBtn) settingsBtn.style.color = 'var(--text-secondary)';
    }

    const open = panel.style.display !== 'none';
    panel.style.display = open ? 'none' : 'block';
    if (btn) btn.style.color = open ? 'var(--text-secondary)' : 'var(--accent-primary)';
}

// Toggle the Site Footer
function toggleFooter() {
    const body = document.getElementById('footer-body');
    const icon = document.getElementById('footer-toggle-icon');
    const label = document.getElementById('footer-toggle-label');
    if (!body) return;
    const isOpen = body.style.display !== 'none' && body.style.display !== '';
    if (isOpen) {
        body.style.display = 'none';
        if (icon) { icon.setAttribute('name', 'chevron-down-outline'); icon.style.transform = 'rotate(0deg)'; }
        if (label) label.textContent = 'Show Site Footer';
    } else {
        body.style.display = 'block';
        if (icon) { icon.setAttribute('name', 'chevron-up-outline'); icon.style.transform = 'rotate(180deg)'; }
        if (label) label.textContent = 'Hide Site Footer';
    }
}

// Enable all notifications at once (via "Enable Alerts" button)
function enableAllNotifs() {
    // Check all toggles
    const scam = document.getElementById('pref-scam');
    const updates = document.getElementById('pref-updates');
    const offers = document.getElementById('pref-offers');
    if (scam) scam.checked = true;
    if (updates) updates.checked = true;
    if (offers) offers.checked = true;
    saveNotifPrefs();
    // Request browser permission
    requestBrowserNotif();
    // Show the section so user can see the toggles are on
    const body = document.getElementById('notif-pref-body');
    const icon = document.getElementById('notif-toggle-icon');
    const label = document.getElementById('notif-toggle-label');
    if (body) body.style.display = 'block';
    if (icon) { icon.setAttribute('name', 'chevron-up-outline'); }
    if (label) label.textContent = 'Hide';
}

// =============== FAQ Toggle & Exclusive Accordion ===============

// Toggle the entire FAQ body (Show / Hide all questions)
function toggleFAQ() {
    const body = document.getElementById('faq-body');
    const btn = document.getElementById('faq-toggle-btn');
    const icon = document.getElementById('faq-toggle-icon');
    if (!body) return;

    const isOpen = body.style.display === 'flex';
    if (isOpen) {
        body.style.display = 'none';
        if (icon) icon.style.transform = 'rotate(0deg)';
        btn.innerHTML = '<ion-icon name="chevron-down-outline" id="faq-toggle-icon"></ion-icon> Show FAQ';
    } else {
        body.style.display = 'flex';
        body.style.flexDirection = 'column';
        body.style.gap = '1rem';
        if (icon) icon.style.transform = 'rotate(180deg)';
        btn.innerHTML = '<ion-icon name="chevron-up-outline" id="faq-toggle-icon"></ion-icon> Hide FAQ';
    }
}

// Collapse FAQ and scroll to header
function collapseFAQ() {
    toggleFAQ();
    document.getElementById('faq-header').scrollIntoView({ behavior: 'smooth' });
}

// Duplicate closeGuide() removed — already defined at line 492

// Exclusive accordion: only one <details> open at a time
document.addEventListener('DOMContentLoaded', () => {
    const allDetails = document.querySelectorAll('.faq-item');
    allDetails.forEach((detail) => {
        detail.addEventListener('toggle', () => {
            if (detail.open) {
                // Close all other items
                allDetails.forEach((other) => {
                    if (other !== detail && other.open) {
                        other.removeAttribute('open');
                    }
                });
            }
        });
    });

    // Load Notification Preferences
    loadNotifPrefs();
    // Load Settings
    loadSettings();
});

// =============== NOTIFICATION PREFERENCES ===============

function loadNotifPrefs() {
    const prefs = JSON.parse(localStorage.getItem('frankpass_notif_prefs') || '{"scam":true,"updates":true,"offers":true}');
    const scamCb = document.getElementById('pref-scam');
    const updatesCb = document.getElementById('pref-updates');
    const offersCb = document.getElementById('pref-offers');

    if (scamCb) scamCb.checked = prefs.scam;
    if (updatesCb) updatesCb.checked = prefs.updates;
    if (offersCb) offersCb.checked = prefs.offers;

    // Check if browser notifications are enabled
    const notifBtnLabel = document.getElementById('notif-btn-label');
    const notifBtn = document.getElementById('notif-enable-btn');
    if (notifBtnLabel && ("Notification" in window)) {
        if (Notification.permission === "granted") {
            notifBtnLabel.textContent = "Alerts Enabled";
            if (notifBtn) {
                notifBtn.style.background = 'rgba(255, 255, 255, 0.1)';
                notifBtn.style.color = '#10b981';
                notifBtn.style.border = '1px solid rgba(16, 185, 129, 0.3)';
            }
        }
    }
}

function saveNotifPrefs() {
    const prefs = {
        scam: document.getElementById('pref-scam')?.checked || false,
        updates: document.getElementById('pref-updates')?.checked || false,
        offers: document.getElementById('pref-offers')?.checked || false
    };
    localStorage.setItem('frankpass_notif_prefs', JSON.stringify(prefs));
}

function requestBrowserNotif() {
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notifications.");
        return;
    }
    Notification.requestPermission().then(permission => {
        const notifBtnLabel = document.getElementById('notif-btn-label');
        const notifBtn = document.getElementById('notif-enable-btn');
        if (permission === "granted") {
            if (notifBtnLabel) notifBtnLabel.textContent = "Alerts Enabled";
            if (notifBtn) {
                notifBtn.style.background = 'rgba(255, 255, 255, 0.1)';
                notifBtn.style.color = '#10b981';
                notifBtn.style.border = '1px solid rgba(16, 185, 129, 0.3)';
            }
            
            // Create a test stateless notification based on preferences
            const prefs = JSON.parse(localStorage.getItem('frankpass_notif_prefs') || '{"scam":true,"updates":true,"offers":false}');
            if (prefs.scam || prefs.updates) {
               new Notification("FrankPass Alerts Enabled", {
                   body: "Your preferences are saved locally. You will only receive alerts you opted into.",
                   icon: "icons/icon-192x192.png" // fallback
               });
            }
        } else {
            alert("Notification permission denied. You can change this in your browser settings anytime.");
        }
    });
}

function checkNotifModal() {
    // Only show on root/index
    if (window.location.pathname !== '/' && window.location.pathname !== '/index.html' && window.location.pathname !== '') return;
    
    // Check if permission already granted or denied
    if ('Notification' in window) {
        if (Notification.permission === 'granted' || Notification.permission === 'denied') return;
    }

    const snoozedUntil = localStorage.getItem('frankpass_notif_snooze');
    const now = new Date().getTime();
    
    if (snoozedUntil && now < parseInt(snoozedUntil)) return;
    
    const forever = localStorage.getItem('frankpass_notif_forever');
    if (forever === 'true') return;

    // Show modal after a brief delay so it's not jarring
    setTimeout(() => {
        const modal = document.getElementById('notif-optin-modal');
        if (modal) modal.classList.add('show'); // BUG FIX: was .active but CSS uses .show
    }, 1500);
}

function dismissNotifModal(action) {
    const modal = document.getElementById('notif-optin-modal');
    if (modal) modal.classList.remove('show'); // BUG FIX: was .active but CSS uses .show
    
    if (action === '7days') {
        const sevenDays = new Date().getTime() + (7 * 24 * 60 * 60 * 1000);
        localStorage.setItem('frankpass_notif_snooze', sevenDays.toString());
    } else if (action === 'forever') {
        localStorage.setItem('frankpass_notif_forever', 'true');
    } else if (action === 'custom') {
        localStorage.setItem('frankpass_notif_forever', 'true');
        // Scroll down to the notification section
        const notifSection = document.getElementById('notification-hub');
        if (notifSection) notifSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function showAnnouncement() {
    if (!ANNOUNCEMENT.show) return;
    const lastSeenId = localStorage.getItem('frankpass_announcement_id');
    if (lastSeenId === ANNOUNCEMENT.id) return;

    const modalHTML = `
        <div id="announcement-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); display:flex; align-items:center; justify-content:center; z-index:10000; backdrop-filter:blur(8px); padding:1rem;">
            <div style="background:var(--card-bg); border:1px solid var(--accent-primary); border-radius:1.5rem; max-width:450px; width:100%; padding:2.5rem; text-align:center; box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);">
                <div style="font-size:3.5rem; margin-bottom:1.5rem;">${ANNOUNCEMENT.title.split(' ')[0]}</div>
                <h2 style="color:var(--text-primary); margin-bottom:1rem; font-size:1.8rem;">${ANNOUNCEMENT.title.split(' ').slice(1).join(' ')}</h2>
                <p style="color:var(--text-secondary); margin-bottom:2rem; line-height:1.6; font-size:1.1rem;">${ANNOUNCEMENT.message}</p>
                <button onclick="closeAnnouncement()" style="background:var(--accent-primary); color:white; border:none; padding:1rem 2.5rem; border-radius:1rem; font-weight:600; cursor:pointer; width:100%; transition:transform 0.2s;">
                    ${ANNOUNCEMENT.cta}
                </button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeAnnouncement() {
    const modal = document.getElementById('announcement-modal');
    if (modal) modal.remove();
    localStorage.setItem('frankpass_announcement_id', ANNOUNCEMENT.id);
}

window.addEventListener('load', () => {
    checkNotifModal();
    showAnnouncement();
});

// =============== SETTINGS PANEL ===============

function toggleSettingsPanel() {
    const panel = document.getElementById('settings-panel');
    const notifPanel = document.getElementById('notif-panel');
    const btn = document.getElementById('settings-gear-btn');
    const notifBtn = document.getElementById('notif-bell-btn');
    if (!panel) return;

    // Close notif if open
    if (notifPanel && notifPanel.style.display === 'block') {
        notifPanel.style.display = 'none';
        if (notifBtn) notifBtn.style.color = 'var(--text-secondary)';
    }

    const open = panel.style.display !== 'none';
    panel.style.display = open ? 'none' : 'block';
    if (btn) btn.style.color = open ? 'var(--text-secondary)' : 'var(--accent-primary)';
}


// =============== PRINT TRACKER ===============
function printTracker() {
    const printWindow = window.open('', '_blank');
    if(!printWindow) { alert("Please allow popups to print tracker."); return; }
    printWindow.document.write(`
        <html>
        <head>
            <title>FrankPass Offline Tracker</title>
            <style>
                body { font-family: 'Arial', sans-serif; padding: 40px; color: #1e293b; }
                h1 { color: #0f172a; text-align: center; margin-bottom: 5px; font-size: 24px; }
                p { text-align: center; color: #64748b; margin-bottom: 30px; font-size: 14px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #cbd5e1; padding: 12px; text-align: left; }
                th { background-color: #f1f5f9; font-weight: bold; font-size: 14px; }
                td { height: 35px; }
                .warning { margin-top: 30px; font-size: 0.85em; color: #b91c1c; border: 1px solid #fca5a5; padding: 15px; background: #fef2f2; border-radius: 8px; line-height: 1.5; }
            </style>
        </head>
        <body>
            <h1>FrankPass Offline Tracker</h1>
            <p>Your stateless physical vault. Write down your platforms and variants here.</p>
            
            <table>
                <tr>
                    <th style="width: 5%;">#</th>
                    <th style="width: 45%;">Platform / Website Name</th>
                    <th style="width: 35%;">Username / Email (Optional)</th>
                    <th style="width: 15%;">Variant No.</th>
                </tr>
                ${Array.from({length: 15}).map((_, i) => `
                <tr>
                    <td>${i + 1}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                `).join('')}
            </table>
            
            <div class="warning">
                <strong>&#9888; SECURITY WARNING:</strong> NEVER write your "Secret Master Key" on this paper. Keep your Secret Key memorized or stored in a completely separate, secure location. If this paper is lost, your passwords remain 100% safe as long as the Secret Key is unknown.
            </div>
            
            <script>
                window.onload = function() { window.print(); }
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// ==========================================
// FIRST-TIME GENTLE WELCOME POPUP
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    const welcomePopup = document.getElementById('welcome-popup');
    if (welcomePopup && !localStorage.getItem('frankpass_welcomed')) {
        setTimeout(() => {
            welcomePopup.classList.remove('hidden');
        }, 1500); // Gentle delay
    }
});

function closeWelcomePopup() {
    const welcomePopup = document.getElementById('welcome-popup');
    if (welcomePopup) {
        welcomePopup.classList.add('hidden');
        localStorage.setItem('frankpass_welcomed', 'true');
    }
}
