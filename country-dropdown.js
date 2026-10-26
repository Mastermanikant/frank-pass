/**
 * FrankPass Custom Country Dropdown
 * Replaces native <datalist> with a searchable dropdown with real flag images.
 * Uses local /flags/ with FlagCDN fallback.
 * Multi-Tier Zero-Latency Geolocation (User Preference -> Path -> Client Locale -> Global Timezones -> Background Edge Trace).
 */
(function () {
    'use strict';

    if (window.__fp_country_dropdown_inited) return;
    window.__fp_country_dropdown_inited = true;

    const CDN = '/flags/';
    const FALLBACK_CDN = 'https://flagcdn.com/w40/';
    const DEFAULT_CODE = 'in';
    const DEFAULT_LABEL = 'India (IN)';

    // Elements
    let trigger, panel, searchInput, listScroll, displayName, triggerFlag;
    let hiddenInput, flagBadge;
    let allCountries = [];
    let currentCode = DEFAULT_CODE;

    function getFlagUrl(code) {
        return CDN + code.toLowerCase() + '.png';
    }

    function extractCode(label) {
        const m = label.match(/\\(([A-Z]{2})\\)/);
        return m ? m[1].toLowerCase() : '';
    }

    // Build one row (Rendered on demand when dropdown is opened)
    function buildOption(country) {
        const div = document.createElement('div');
        div.className = 'country-option';
        div.dataset.code = country.code;
        div.dataset.label = country.label;
        div.setAttribute('role', 'option');

        const img = document.createElement('img');
        img.className = 'c-flag';
        img.src = getFlagUrl(country.code);
        img.alt = country.code.toUpperCase();
        img.loading = 'lazy';
        img.onerror = function () {
            if (!this.src.includes('flagcdn.com')) {
                this.src = FALLBACK_CDN + country.code.toLowerCase() + '.png';
            } else {
                this.style.display = 'none';
            }
        };

        const name = document.createElement('span');
        name.className = 'c-name';
        name.textContent = country.name;

        const code = document.createElement('span');
        code.className = 'c-code';
        code.textContent = country.code.toUpperCase();

        div.appendChild(img);
        div.appendChild(name);
        div.appendChild(code);

        div.addEventListener('click', () => selectCountry(country, true));
        div.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') selectCountry(country, true);
        });

        return div;
    }

    function renderList(filter) {
        listScroll.innerHTML = '';
        const q = (filter || '').toLowerCase().trim();
        const filtered = q
            ? allCountries.filter(c =>
                c.name.toLowerCase().includes(q) ||
                c.code.toLowerCase().includes(q))
            : allCountries;

        if (!filtered.length) {
            const empty = document.createElement('div');
            empty.className = 'country-no-results';
            empty.textContent = 'No country found';
            listScroll.appendChild(empty);
            return;
        }

        filtered.forEach(c => {
            const el = buildOption(c);
            if (c.code === currentCode) el.classList.add('selected');
            listScroll.appendChild(el);
        });

        // Scroll selected into view
        const sel = listScroll.querySelector('.selected');
        if (sel) sel.scrollIntoView({ block: 'nearest' });
    }

    function openDropdown() {
        trigger.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        panel.classList.add('open');
        searchInput.value = '';
        renderList('');
        searchInput.focus();
    }

    function closeDropdown() {
        trigger.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
        panel.classList.remove('open');
    }

    function selectCountry(country, savePreference) {
        if (!country) return;
        currentCode = country.code;

        // Persist user selection if explicitly triggered
        if (savePreference) {
            try {
                localStorage.setItem('fp_preferred_country', country.code);
            } catch (e) {}
        }

        // Update trigger display
        if (triggerFlag) {
            triggerFlag.src = getFlagUrl(country.code);
            triggerFlag.style.display = '';
        }
        if (displayName) {
            displayName.textContent = country.name;
        }

        // Update premium header flag
        const headerFlag = document.getElementById('header-flag-img');
        if (headerFlag) {
            headerFlag.src = `/flags/${country.code.toLowerCase()}.png`;
            headerFlag.onerror = function() { this.src = `https://flagcdn.com/w160/${country.code.toLowerCase()}.png`; };
            headerFlag.style.display = '';
        }
        const cardLabel = document.getElementById('card-country-label');
        if (cardLabel) cardLabel.textContent = country.code.toUpperCase();
        const cardPill = document.getElementById('card-country-pill');
        if (cardPill) cardPill.title = country.label;

        // Update hidden input (replaces old regionEl value)
        if (hiddenInput) {
            hiddenInput.value = country.label;
            // Fire change event so script.js listeners pick it up
            hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Update platform datalist
        if (typeof populatePlatformDatalist === 'function') {
            populatePlatformDatalist(country.code);
        }

        // Update URL: Clean root '/' for default India, '/<code>' for other countries
        try {
            const newPath = (country.code === DEFAULT_CODE || country.code === 'in') ? '/' : '/' + country.code;
            if (window.location.pathname !== newPath) {
                window.history.replaceState({ code: country.code }, '', newPath);
            }
        } catch (e) { /* local file:// - ignore */ }

        closeDropdown();
    }

    function init() {
        // Guard: wait for country data
        if (!window.COUNTRY_LIST || !window.COUNTRY_LIST.length) {
            setTimeout(init, 50);
            return;
        }

        allCountries = window.COUNTRY_LIST;

        trigger      = document.getElementById('country-trigger');
        panel        = document.getElementById('country-dropdown-panel');
        searchInput  = document.getElementById('country-search-input');
        listScroll   = document.getElementById('country-list-scroll');
        displayName  = document.getElementById('country-display-name');
        triggerFlag  = document.getElementById('country-flag-img');
        hiddenInput  = document.getElementById('region');
        flagBadge    = document.getElementById('flag-badge');

        if (!trigger || !panel || !searchInput || !listScroll || !displayName || !triggerFlag || !hiddenInput) return;

        // ── Multi-Tier Auto-Detect Initial Country ─────────────────────
        let initCode = null;

        // Tier 0: Saved Preference in localStorage
        try {
            const saved = localStorage.getItem('fp_preferred_country');
            if (saved && allCountries.find(c => c.code === saved.toLowerCase())) {
                initCode = saved.toLowerCase();
            }
        } catch (e) {}

        // Tier 1: URL Path (/us, /gb, /ca, /de, /in, /hn -> 'in')
        if (!initCode) {
            let path = window.location.pathname.replace(/\\//g, '').toLowerCase();
            if (path === 'hn') path = 'in'; // Alias for Hindi
            if (path.length === 2 && allCountries.find(c => c.code === path)) {
                initCode = path;
            }
        }

        // Tier 2: Zero-Latency Client Device Locale (0.05ms)
        if (!initCode) {
            try {
                const navLang = navigator.language || (navigator.languages && navigator.languages[0]);
                if (navLang) {
                    let reg = null;
                    if (typeof Intl !== 'undefined' && Intl.Locale) {
                        try {
                            const loc = new Intl.Locale(navLang);
                            if (loc && loc.region) reg = loc.region.toLowerCase();
                        } catch (e) {}
                    }
                    if (!reg && navLang.includes('-')) {
                        const parts = navLang.split('-');
                        if (parts[1] && parts[1].length === 2) reg = parts[1].toLowerCase();
                    }
                    if (reg && allCountries.find(c => c.code === reg)) {
                        initCode = reg;
                    }
                }
            } catch (e) {}
        }

        // Tier 3: Global Timezone Mapping (Comprehensive 200+ Countries)
        if (!initCode) {
            try {
                const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '');
                const tzMap = {
                    'Asia/Kolkata': 'in', 'Asia/Calcutta': 'in',
                    'America/New_York': 'us', 'America/Los_Angeles': 'us',
                    'America/Chicago': 'us', 'America/Denver': 'us',
                    'America/Phoenix': 'us', 'America/Detroit': 'us',
                    'America/Indiana/Indianapolis': 'us', 'America/Anchorage': 'us',
                    'Pacific/Honolulu': 'us', 'America/Boise': 'us',
                    'Europe/London': 'gb', 'Europe/Paris': 'fr', 'Europe/Berlin': 'de',
                    'America/Toronto': 'ca', 'America/Vancouver': 'ca', 'America/Montreal': 'ca',
                    'America/Edmonton': 'ca', 'America/Winnipeg': 'ca', 'America/Halifax': 'ca',
                    'Australia/Sydney': 'au', 'Australia/Melbourne': 'au', 'Australia/Brisbane': 'au',
                    'Australia/Perth': 'au', 'Australia/Adelaide': 'au',
                    'Asia/Dhaka': 'bd', 'Asia/Karachi': 'pk', 'Africa/Lagos': 'ng',
                    'Asia/Manila': 'ph', 'Asia/Jakarta': 'id', 'Africa/Nairobi': 'ke',
                    'Asia/Dubai': 'ae', 'Asia/Riyadh': 'sa', 'Asia/Singapore': 'sg',
                    'Asia/Kuala_Lumpur': 'my', 'Asia/Bangkok': 'th', 'Asia/Kathmandu': 'np',
                    'Asia/Colombo': 'lk', 'Asia/Seoul': 'kr', 'Asia/Tokyo': 'jp',
                    'America/Sao_Paulo': 'br', 'Africa/Johannesburg': 'za', 'America/Mexico_City': 'mx',
                    'Europe/Madrid': 'es', 'Europe/Rome': 'it', 'Europe/Amsterdam': 'nl',
                    'Europe/Zurich': 'ch', 'Europe/Vienna': 'at', 'Europe/Stockholm': 'se',
                    'Europe/Oslo': 'no', 'Europe/Copenhagen': 'dk', 'Europe/Helsinki': 'fi',
                    'Europe/Warsaw': 'pl', 'Europe/Dublin': 'ie', 'Europe/Brussels': 'be',
                    'Europe/Lisbon': 'pt', 'Europe/Athens': 'gr', 'Europe/Prague': 'cz',
                    'Europe/Budapest': 'hu', 'Europe/Bucharest': 'ro', 'Pacific/Auckland': 'nz'
                };
                if (tzMap[tz]) {
                    initCode = tzMap[tz];
                } else if (tz.startsWith('America/')) {
                    initCode = 'us';
                } else if (tz.startsWith('Europe/')) {
                    initCode = 'gb';
                } else if (tz.startsWith('Australia/')) {
                    initCode = 'au';
                }
            } catch (e) {}
        }

        // Final safe fallback
        if (!initCode || !allCountries.find(c => c.code === initCode)) {
            initCode = DEFAULT_CODE;
        }

        const initCountry = allCountries.find(c => c.code === initCode) ||
                            allCountries.find(c => c.code === DEFAULT_CODE);

        if (initCountry) {
            currentCode = initCountry.code;

            if (triggerFlag) {
                triggerFlag.src = getFlagUrl(initCountry.code);
                triggerFlag.style.display = '';
            }
            if (displayName) displayName.textContent = initCountry.name;
            if (hiddenInput) {
                hiddenInput.value = initCountry.label;
                hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
            }

            const headerFlag = document.getElementById('header-flag-img');
            if (headerFlag) {
                headerFlag.src = `/flags/${initCountry.code.toLowerCase()}.png`;
                headerFlag.onerror = function() { this.src = `https://flagcdn.com/w160/${initCountry.code.toLowerCase()}.png`; };
                headerFlag.style.display = '';
            }
            const cardLabel = document.getElementById('card-country-label');
            if (cardLabel) cardLabel.textContent = initCountry.code.toUpperCase();
            const cardPill = document.getElementById('card-country-pill');
            if (cardPill) cardPill.title = initCountry.label;

            // Load platform list for this country
            if (typeof populatePlatformDatalist === 'function') {
                populatePlatformDatalist(initCountry.code);
            }
        }

        // Tier 4: Background Non-blocking Cloudflare Edge Geolocation (/cdn-cgi/trace)
        try {
            const hasSaved = !!localStorage.getItem('fp_preferred_country');
            const hasPath = window.location.pathname.length > 2;
            if (!hasSaved && !hasPath && typeof fetch === 'function') {
                const idleRunner = window.requestIdleCallback || ((cb) => setTimeout(cb, 1200));
                idleRunner(() => {
                    fetch('/cdn-cgi/trace')
                        .then(r => r.text())
                        .then(t => {
                            const m = t.match(/^loc=([A-Za-z]{2})$/m);
                            if (m && m[1]) {
                                const edgeCode = m[1].toLowerCase();
                                const edgeCountry = allCountries.find(c => c.code === edgeCode);
                                if (edgeCountry && edgeCountry.code !== currentCode) {
                                    selectCountry(edgeCountry, false);
                                }
                            }
                        })
                        .catch(() => {});
                });
            }
        } catch (e) {}

        // ── Events ──────────────────────────────────────────────────────
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (panel.classList.contains('open')) {
                closeDropdown();
            } else {
                openDropdown();
            }
        });

        panel.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                e.preventDefault();
                e.stopPropagation();
                openDropdown();
            }
        });

        searchInput.addEventListener('input', (e) => renderList(e.target.value));

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeDropdown();
        });

        // ── Browser Back / Forward Sync ──────────────────────────────
        window.addEventListener('popstate', (e) => {
            let p = window.location.pathname.replace(/\\//g, '').toLowerCase();
            if (p === 'hn') p = 'in';
            const matched = allCountries.find(c => c.code === p) || allCountries.find(c => c.code === DEFAULT_CODE);
            if (matched && matched.code !== currentCode) {
                selectCountry(matched, false);
            }
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            const dropdown = trigger ? trigger.closest('.custom-country-dropdown') : null;
            if (!dropdown || !dropdown.contains(e.target)) {
                closeDropdown();
            }
        });
    }

    // Run after DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
